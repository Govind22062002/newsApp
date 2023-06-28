const NewsHeadline = require('../models/NewsHeadline');
const axios = require("axios");
let socketIO;

exports.initialize = (io) => {
    socketIO = io;
};

exports.home = async (req, res) => {
    try {
        const newsData = await NewsHeadline.find();
        var url = 'http://newsapi.org/v2/top-headlines?' +
            'country=in&' +
            'apiKey=4c3d86b8d27e4c97978bed66048b82b8';

        const data = await axios.get(url)
        // console.log(data.data, "news_get");
        res.json({ data: data.data, newsData });
    } catch (error) {
        console.error('Error getting news headlines:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.homePost = async (req, res) => {
    try {
        const { title, description, url, urlToImage, publishedAt } = req.body.data;
        const userId = req.body.loginData._id;

        const findNews = await NewsHeadline.findOne({ newsUrl: url });
        if (findNews) {
            const userReaction = findNews.userReactions.find(reaction => reaction.userId === userId);
            if (userReaction) {
                return res.status(400).json({ message: 'User has already reacted to this news headline' });
            }

            if (req.body.type === 'like') {
                findNews.likes++;
            } else if (req.body.type === 'dislike') {
                findNews.dislikes++;
            } else {
                return res.status(400).json({ message: 'Invalid reaction type' });
            }

            findNews.userReactions.push({ userId, reactionType: req.body.type });
            await findNews.save();

            // Emit a socket.io event to notify other clients about the updated news headline
            console.log(findNews, "findNews");
            socketIO.emit('newsUpdate', findNews);

            res.json({ message: 'News headline reaction updated successfully' });
        } else {
            const newHeadline = await NewsHeadline.create({
                title,
                description,
                publishedAt,
                newsUrl: url,
                image: urlToImage,
                likes: req.body?.type === 'like' ? 1 : 0,
                dislikes: req.body?.type === 'dislike' ? 1 : 0,
                userReactions: [{ userId, reactionType: req.body.type }]
            });
            // Emit a socket.io event to notify other clients about the new news headline
            console.log(NewsHeadline);
            console.log(NewsHeadline, "newsHeadline");
            socketIO.emit('newsUpdate', newHeadline);

            res.status(201).json({ message: 'News headline added successfully' });
        }
    } catch (error) {
        console.error('Error adding news headline:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// exports.UpdateLikeDislike = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { type } = req.body;

//         // Find the news headline by ID
//         const newsHeadline = await NewsHeadline.findById(id);
//         if (!newsHeadline) {
//             return res.status(404).json({ message: 'News headline not found' });
//         }

//         // Update the likes or dislikes count
//         if (type === 'like') {
//             newsHeadline.likes++;
//         } else if (type === 'dislike') {
//             newsHeadline.dislikes++;
//         } else {
//             return res.status(400).json({ message: 'Invalid reaction type' });
//         }

//         await newsHeadline.save();

//         res.json({ message: 'News headline reaction updated successfully' });
//     } catch (error) {
//         console.error('Error updating news headline reaction:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }
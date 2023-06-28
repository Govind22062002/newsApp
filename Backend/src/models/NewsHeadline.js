const mongoose = require('mongoose');

const newsHeadlineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  newsUrl: {type : String, required: true},
  description: { type: String, required: true },
  image: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  publishedAt : {type : Date, required: true},
  userReactions : {type: Array,required: true } 
});

module.exports = mongoose.model('NewsHeadline', newsHeadlineSchema);

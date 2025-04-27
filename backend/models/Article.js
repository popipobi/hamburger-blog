const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true  
    },
    content: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Article', ArticleSchema);
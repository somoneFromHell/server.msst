const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    url: {
        type: String,
        required: true,
    },

},
    { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;

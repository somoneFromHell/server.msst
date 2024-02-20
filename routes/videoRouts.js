const express = require('express');
const VideosController = require('../controllers/videosController');

const Router = express.Router();

Router.get('/', VideosController.getAllVideos);
Router.delete('/:id', VideosController.deleteVideo);
Router.post('/', VideosController.addVideo);
Router.put('/:id', VideosController.updateVideo);


module.exports = Router;

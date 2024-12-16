const express = require('express');
const storeRouter = express.Router(); 
const storeController = require('./../controllers/storeController');

storeRouter.get("/", storeController.getHome);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/homes/:homeID/:name", storeController.getHomesDetails);
storeRouter.get("/favourites", storeController.getFavouritesHome);
storeRouter.post('/favourites', storeController.postAddFavouritesHomes);
storeRouter.post('/favourites/delete/:homeID', storeController.postRemoveFavouritesHomes);
storeRouter.get('/rules/:homeID/:name', storeController.getHomeRules);

exports.storeRouter = storeRouter; 

// For get Query Parameters to show them pages Title 
// storeRouter.get("/homeDetails", storeController.getHomesDetails);

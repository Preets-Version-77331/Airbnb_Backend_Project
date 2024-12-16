const express = require('express');

const hostController = require('./../controllers/hostController');
const hostRouter = express.Router();

hostRouter.get("/add-home", hostController.getAddhome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get('/host-homes', hostController.getHostHomes);
hostRouter.get('/edit-home/:homeID/:name', hostController.getEditHome);
hostRouter.post('/edit-home', hostController.postEditHome);
hostRouter.post('/delete-home/:homeID', hostController.postDeleteHome);
exports.hostRouter = hostRouter;  // Export for main (app.js)

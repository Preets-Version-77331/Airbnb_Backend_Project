// External Module
const ENV = process.env.NODE_ENV || 'production'
const express = require('express');
const session = require('express-session');
const mongodb_session = require('connect-mongodb-session');
const mongoose = require('mongoose');
const { authRouter } = require('./routers/authRouter');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');


// Core Module 
require('dotenv').config({
  path: `.env.${ENV}`
});
const path = require('path'); 
const fs =  require('fs');


// Local Module 
const {storeRouter} = require('./routers/storeRouter');
const {hostRouter} = require('./routers/hostRouter');
const rootDir = require('./util/pathUtil'); //using combination funtionallity of the path 
const errorController = require('./controllers/errorController');
const multer = require('multer');

const MongoDbStore = mongodb_session(session);
const MONGOOSE_DB_URL = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@airbnb.waxpx.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority&appName=Airbnb`;

const sessionStore = new MongoDbStore({
    uri: MONGOOSE_DB_URL,
    collection: 'sessions' 
});
// Store the file as custome file Name. KeyNotes in learningNotes.txt  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    },
  });
  
  const fileFilter = (req, file, cb) => {
    //const isValidFile = file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg';
    const isValidFile = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype);
    cb(null, isValidFile);
  }

  const loggingPath = path.join(rootDir, 'access.log');
  const loggingStream = fs.createWriteStream(loggingPath, { flags: 'a'});
  
  const app = express();
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined', { stream: loggingStream}));

  app.set("view engine", "ejs");
  app.set("views", "views");
  
  app.use(express.static(path.join(rootDir, "public")));
  app.use('/uploads', express.static(path.join(rootDir, "uploads")));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer({storage, fileFilter}).single('photo'));
app.use(session({
    secret: 'AIRBNB SPOT',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
}));

app.use(storeRouter);   
app.use('/host', (req, res, next) => {
     if (!req.session.isLoggedIn) {
        res.redirect('/login');
     }
     next();
});
app.use('/host',hostRouter);
app.use(authRouter);
app.use(errorController.get404);
 

mongoose.connect(MONGOOSE_DB_URL).then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}`);
    });
});


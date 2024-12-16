const Home = require('../models/Home'); 
const User = require('../models/User');
const path = require('path');
const rootDir = require('../util/pathUtil');
exports.getHome = (req, res, next) => {
    Home.find().then(registeredHomes => {
        console.log('Cookies  for get req: ', req.session);
            res.render('store/airbnbHome', {homes: registeredHomes, pageTitle: 'Airbnb | Holidays rentals, cabins, beach houses & more', isLoggedIn: req.session.isLoggedIn, user: req.session.user,});// Main Responsibilty is inderact with model,views, and sending response.
    }); 
}
exports.getHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {
            res.render('store/airbnbHomes', {homes: registeredHomes, pageTitle: 'Airbnb | Holidays rentals, cabins, beach houses & more', isLoggedIn: req.session.isLoggedIn, user: req.session.user,});// Main Responsibilty is inderact with model,views, and sending response.
    }); 
}
exports.getHomesDetails = (req, res, next) => {
    const homeID = req.params.homeID;
    const name = req.params.name;
    console.log(req.params); // KeyNotes in learningNotes.txt (4th Point)
    Home.findById(homeID).then(home => {
            if (!home) {
            console.log('Home not found ');
            return res.redirect('/homes');   
        }
        res.render('store/airbnbHomeDetails', { home: home, pageTitle: `Home Details Id: ${homeID} || ${name} || ${home.location} || ${home.rating}`, isLoggedIn: req.session.isLoggedIn, user: req.session.user,});
        });    
}
//  To show favourites data to user 
exports.getFavouritesHome = async (req, res, next) => {
    const userID  = req.session.user._id;
    try {
        const user = await User.findById(userID).populate('favouriteHomes'); 
        console.log('Favourites Home', user );
        res.render('store/airbnbFavouritesHome', {pageTitle: 'AirBnb || Your Wishlist', homes: user.favouriteHomes, isLoggedIn: req.session.isLoggedIn, user: req.session.user,});
    } catch(err) {
        console.log(err);
        res.redirect('/');
    }
} 

exports.postAddFavouritesHomes = async (req, res, next) => {
    const homeID = req.body.id;
    const userID  = req.session.user._id;
    try {
        const  user = await User.findOne({_id : userID})
        if(!user.favouriteHomes.includes(homeID)) {
            user.favouriteHomes.push(homeID);
            await user.save();
        }
    } catch(err)  {
        console.log('Error Occurred while addind To favourites :', err);
    
    } finally {
        res.redirect('/favourites');
    }
}
exports.postRemoveFavouritesHomes = (req, res, next) => {
    const homeID = req.params.homeID; 
    Favourites.findOneAndDelete({homeID}).then(() => {
        res.redirect('/favourites');
    }).catch(err => {
        console.log('Error Occurred while Removing home from Favourites: ', err);
        res.redirect('/favourites');
    })
       
} 

exports.getHomeRules = (req, res, next) => {
    const rulesFileName = 'Airbnb-Rules.pdf';
    const filePath = path.join(rootDir, 'rules', rulesFileName)
    res.sendFile(filePath);
}



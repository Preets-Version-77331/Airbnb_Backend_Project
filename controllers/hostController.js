const { deletFile } = require('../util/file');
const Home = require('./../models/Home');

exports.getAddhome =  (req,res,next) => {
    res.render('host/edit-home', { 
        editing: false, 
        pageTitle:'Host your home on airbnb', 
        user: req.session.user,
        });
}
exports.getEditHome = (req, res, next) => {
    const homeID = req.params.homeID;
    const editing = req.query.editing === 'true';
    if (!editing) {
        console.log(`Editing Flag not set properly : ${editing}`);
        return res.redirect('/host/host-homes');
    }
    Home.findById(homeID).then(homes => {
        if (!homes) {
            console.log(`Home not found for editing`);
            return res.redirect('/host/host-homes');
        }
        console.log('Home object Params ', homeID);
        console.log(`Edit home of id ${homeID} and editing is ${editing}`);
        res.render('host/edit-home', {
            home: homes,
            editing: editing,
            pageTitle: `AirBnb | Edit your home | id ${homeID}`,
            user: req.session.user, 
        });
    });
}
exports.postEditHome = (req, res, next) => { // without asynchronization 
    const { id, houseName, price, location, rating, description } = req.body;
    console.log('Req Body of Home : ', req.body);
    console.log('Req file of Home image : ', req.file );
    // const newHome = new Home({houseName, price, location, rating, photoUrl, description, id});
    // Business logic ouitside model 
    Home.findById(id)
    .then((existingHome) => {
        if (!existingHome) {
            console.log('Home Not Exist');
        }
        existingHome.houseName = houseName;
        existingHome.price = price;
        existingHome.location = location;
        existingHome.rating = rating;
        if (req.file) {
            deletFile(existingHome.photoUrl.substring(1)); 
            existingHome.photoUrl = "/" + req.file.path;
        }
        existingHome.description = description;
        return existingHome.save();
    })
    .finally()
       res.redirect("/host/host-homes");
}
//   exports.postEditHome = async (req, res, next) => {// with asynchronization
//     const { id, houseName, price, location, rating, description } = req.body;
//     const photoUrl = "/" + req.file.path;
//     console.log('Req Body of Home : ', req.body);
//     console.log('Req file of Home image : ', req.file );


//     try {
//         if (!req.file) {
//             throw new Error('Images Invalid '); 
//         }
//         const existingHome = await Home.findById(id);
//         if (!existingHome) {
//             console.log('Home does not exist');
//             return res.redirect("/host/host-homes"); // Redirect if the home does not exist
//         }

//         existingHome.houseName = houseName;
//         existingHome.price = price;
//         existingHome.location = location;
//         existingHome.rating = rating;
//         existingHome.photoUrl = photoUrl;
//         existingHome.description = description;

//         await existingHome.save();
//         res.redirect("/host/host-homes");
//     } catch (err) {
//         return res.status(422).render('host/edit-home', {
//             errorMessages: [err.message],
//             editing: false, 
//             pageTitle:'Host your home on airbnb', 
//             user: req.session.user,
//           });
//     }
// };

exports.postDeleteHome = (req, res, next) => {
    const homeID = req.params.homeID; 
    console.log('Came to Delete Home of Id :',  homeID);
    Home.findByIdAndDelete(homeID).then(() => {
        res.redirect('/host/host-homes');
    });
    
}

exports.postAddHome = async (req, res, next) => {
    const { houseName, price, location, rating, description } = req.body;
    const photoUrl = "/" + req.file.path;
    const newHome = new Home({houseName: houseName, price: price, location:location, rating: rating, photoUrl, description: description, hostID: req.session.user._id});
    console.log('Req Body of Home : ', req.body);
    console.log('Req file of Home image : ', req.file );

    try {
        if (!req.file) {
            throw new Error('Images Invalid '); 
        }
        await newHome.save()
        res.redirect("/host/host-homes");
        
    } catch (err) {
        return res.status(422).render('host/edit-home', {
            errorMessages: [err.message],
            editing: false, 
            pageTitle:'Airbnb || Host your home on airbnb', 
            user: req.session.user,
          });
    }
};

  
exports.getHostHomes = (req, res, next) => {
    // Home.find().then(registeredHomes => {   // this line  in find is  search all  homes cuase their have not any Criteria to a perticular things
    Home.find({hostID: req.session.user._id}).then(registeredHomes => { // there have a criteria to search only the provided 
        res.render('host/hostHomes', { 
            homes: registeredHomes, 
            pageTitle: 'Airbnb | Host Homes',
            user: req.session.user,
        });// Main Responsibilty is interact with model,views, and sending response.
    });
}


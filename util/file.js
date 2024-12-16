const fs = require('fs');

exports.deletFile = (filePath) => {
    fs.unlink(filePath, err => {
        if (err) {
            throw err; 
        }
    }) 
};
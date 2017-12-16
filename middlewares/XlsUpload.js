var multer = require('multer');
var path = require('path');

function MyModelClass() {

    // this.ImageUpload = function (req, res, next) {
    this.storage = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, "public/uploads/stamps");
        },
        filename: function (req, file, cb) {
            console.log(req.body, path.extname(file.originalname));
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
    this.uploadFile = multer({
        storage: this.storage,
        fileFilter: function (req, file, cb) {
            if (!file.originalname.match(/\.(XLSX|xlsx|xls)$/)) {
                //return cb(new Error('Only xls files are allowed!'));
                return cb('Only xls files are allowed!', false);

                //cb('Only xls files are allowed!', false);
            } else {
                cb(null, true);
            }
            
        }
    }).any();

    this.users_storage = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, "public/uploads/users-xls");
        },
        filename: function (req, file, cb) {
            console.log(req.body, path.extname(file.originalname));
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
    this.uploadUsers = multer({
        storage: this.users_storage,
        fileFilter: function (req, file, cb) {
            if (!file.originalname.match(/\.(XLSX|xlsx|xls)$/)) {
                //return cb(new Error('Only xls files are allowed!'));
                return cb('Only xls files are allowed!', false);

                //cb('Only xls files are allowed!', false);
            } else {
                cb(null, true);
            }
            
        }
    }).any();
    // }


}

module.exports = new MyModelClass();
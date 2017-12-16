var multer = require('multer');
var path = require('path');

function MyModelClass() {

    // this.ImageUpload = function (req, res, next) {
    this.storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log("=============>>>>>>>>>>>>>>>>>>>. PATH")
            console.log(req.body)
            cb(null, req.body.image_path)
        },
        filename: function (req, file, cb) {
//            console.log(req.body, path.extname(file.originalname));
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
    this.uploadFile = multer({
        storage: this.storage,
        fileFilter: function (req, file, cb) {
            if (req.filTypeIs && req.filTypeIs == 'all') {
                cb(null, true);
            } else {
                if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                    //return cb(new Error('Only image files are allowed!'));

                    cb('Only image files are allowed!', false);
                } else {
                    cb(null, true);
                }
            }
        }
    }).any();
    // }

    this.uploadUserProfilePic = multer({
        storage: this.storage,
        fileFilter: function (req, file, cb) {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                //return cb(new Error('Only image files are allowed!')); 
                return cb('Only jpg, jpeg, png, gif files are allowed!', false);
            } else {
                cb(null, true);
            }
        }
    }).any();

    this.mailAttachmentStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/uploads/mail-attachments")
        },
        filename: function (req, file, cb) {
//            console.log(req.body, path.extname(file.originalname));
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
    this.mailAttachment = multer({
        storage: this.mailAttachmentStorage,
        fileFilter: function (req, file, cb) {
            if (req.filTypeIs && req.filTypeIs == 'all') {
                cb(null, true);
            } else {
                if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|doc|DOC|docx|DOCX|xls|XLS|xlsx|XLSX|ppt|PPT|pptx|PPTX|pdf|PDF|txt|TXT)$/)) {
                    //return cb(new Error('Only image files are allowed!'));
                    cb('Files allowed only for extension jpg, jpeg, png, gif, doc, docx, xls, xlsx, ppt, pptx, pdf, txt', false);
                } else {
                    cb(null, true);
                }
            }
        }
    }).any();


}

module.exports = new MyModelClass();
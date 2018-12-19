
var multer = require('multer');
var express = require('express');
var router = express.Router();

var file = {
    public_folder: multer({ dest: 'public/uploads/' }),
    limits: {
        fileSize: '5MB'
    },
    disk: multer({ storage: multer.diskStorage({
        destination: function (req, file, cb)
        {
            cb(null, 'public/uploads/')
        },
        filename: function (req, file, cb)
        {
            cb(null,  Date.now()+'-'+ file.originalname)
        }
    })
    })
};
module.exports = file;
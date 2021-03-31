const fs = require('fs');
const path = require('path');
const express = require('express');
const config = require('./config');
const multer = require('multer'); // key-value pairs; multipart/form-data
const GridFsStorage = require('multer-gridfs-storage'); // gridfs Data Type, USed for images/video > 16MB;
// read in mongoose library
const mongoose = require('mongoose');

const imageRouter = require('./routes/image');

const PORT = config.PORT;
const app = express();

const MONGODB_URI = config.mongoURI;
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("Connected to MongoDB!!");
  // Start listening
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}!!`);
  })
})
.catch((err) => {
  console.log(err);
})

// create storage engine
const storage = new GridFsStorage({
    url: config.mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];
        return new Promise((resolve, reject) => {
            // crypto.randomBytes(16, (err, buf) => {
            //     if (err) {
            //         return reject(err);
            //     }
            //     const filename = buf.toString('hex') + path.extname(file.originalname);
            //     const fileInfo = {
            //         filename: filename,
            //         bucketName: 'uploads'
            //     };
            //     resolve(fileInfo);
            // });
            // if (match.indexOf(file.mimetype) === -1) { TODO
            //     const filename = `${Date.now()}-${file.originalname}`;
            //     return filename;
            // }
            const fileInfo = {
                filename: `${Date.now()}-${file.originalname}`,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});


const upload = multer({ storage });

app.use('/', imageRouter(upload));

// Set your static html file
app.get("/", (req, res) => {
    res.sendFile( path.resolve(__dirname + "/views/index.html"))
  });

// load env files
require('dotenv').config();

// create routing app
const express = require('express');
const app = express();

const fs = require('fs');


const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './imgs/')
  },
  filename: function (req, file, cb) {
    // console.log(file.originalname);
    const extension = file.originalname.split('.')[1];
    // console.log(extension);
    cb(null, 'post') //Appending .jpg
  }
})

const upload = multer({ storage: storage });

const PORT = process.env.PORT || 5000;


const cors = require('cors');// this will be added later
const body_parser = require('body-parser');


// login
const tumblr = require('tumblr.js');
const client = tumblr.createClient({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  token: process.env.token,
  token_secret: process.env.token_secret
});


// set up the app for json encoding
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

// const corsOptions = {
//     origin: /\.ixdm\.ch$/,
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

// app.use();

app.post('/post', upload.single('image'), (req, res) => {
  console.log(req.body);
  /***************************************************/
  // the following to lines allow cross domain requests//
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  /********************************************************************************************/

  // create photo post
  const params = {
    data64: fs.readFileSync('./imgs/post', 'base64'),
    caption: 'test'
  }

  client.createPhotoPost('test-randomizer.tumblr.com', params, (err, resp, response) => {
    // console.log(response.body);
    const json = JSON.parse(response.body)
    const post_url   = 'https://test-randomizer.tumblr.com/image/' + json['response'].id;
    // console.log(post_url);
    if (err) {
      console.log(err);
      res.sendStatus(500)
    } else {
      res.send(post_url);
    }
    res.end();
  });

  
})


app.listen(PORT, () => console.log(`Listening on ${PORT}`));
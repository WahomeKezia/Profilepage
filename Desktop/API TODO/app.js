const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
//importing Routes 
const postsRoute = require('./routes/posts');
//impoeting bodyparser 
const bodyparser= require('body-parser');
app.use(bodyparser.json());
//middleware 
app.use('/posts', postsRoute);

//Routes but i can use a route file as above  
app.get('/', (req, res) => {
    res.send('My To Do Tasks!')
  });

 
//connect to database using Mongoose 
mongoose.connect(process.env.DB_CONNECTION,
{useNewUrlParse: true}, () => 
console.log('connected to DB!')
);


// Start listening to the server
app.listen(3000);

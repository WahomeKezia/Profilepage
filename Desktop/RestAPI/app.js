const express=require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const Joi =require('Joi')
const asyncHandler = require('express-async-handler')
// require database connection 
const dbConnect = require("./db/dbConnect");
const auth = require("./auth");
// execute database connection 
const app = require('express')();
const argon2 = require('argon2');
app.use(express.json({ limit: "50mb" }));
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

const projectHandlers = require('./projectHandlers');

app.post("/projects", projectHandlers.createProject);
app.put("/projects/:id", projectHandlers.updateProject);
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });
  
  // app.post('/', function requestHandler(req, res) {
  //   res.end('Hello, World!');
  // });

  // register endpoint
app.post("/register", async (request, response) => {
  // make sure the request body contains a password property
 if (!request.body.password) {
    return response.status(400).send({ message: "Password is required" });
  } 

  // make sure the password property is a string
  const password = String(request.body.password);

  // make sure the password is not an empty string
  if (password.trim() === "") {
    return response.status(400).send({ message: "Password cannot be empty" });
  }

  try {
    // hash the password
    const hashedPassword = await argon2.hash(password);

    // create a new user instance and collect the data
    const user = new User({
      email: request.body.email,
      password: hashedPassword,
    });

    // save the new user
    const result = await user.save();

    // return success if the new user is added to the database successfully
    response.status(201).send({
      message: "User created successfully",
      result,
    });
  } catch (error) {
    // handle any errors that may have occurred during the hashing process or when saving the user
    console.error(error);
    response.status(500).send({
      message: "Error creating user",
      error,
    });
  }
});
  

// login endpoint
app.post("/login", async (request, response) => {
  try {
    // check if email exists
    const user = await User.findOne({ email: request.body.email });
  
    if (user) {
      // compare the password entered and the hashed password found
      const passwordCheck = await argon2.verify(
        user.password,
        request.body.password
      );
      
      // check if password matches
      if (!passwordCheck) {
        return response.status(400).send({
          message: "Passwords do not match",
        });
      }
    } else {
      // Return an error if the user is not found
      return response.status(400).send({
        message: "User not found",
      });
    }
  
    // create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      "YOUR-SECRET", // replace this with your secret
      { expiresIn: "24h" }
    );
  
    // return success response
    response.status(200).send({
      message: "Login successful",
      email: user.email,
      token,
    });
  } catch (error) {
    // catch other errors
    response.status(400).send({
      message: "An error occurred",
      error,
    });
  }
});

  // free endpoint
app.get("/free-endpoint", (request, response) => {
    response.json({ message: "You are free to access me anytime" });
  });
  
// authentication endpoint
app.get("/auth-endpoint", (request, response) => {
    response.json({ message: "You are authorized to access me" });
  });
  
// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
    response.json({ message: "You are authorized to access me" });
  });
  
  
module.exports = app;
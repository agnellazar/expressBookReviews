const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: 'jimmy', password: 'pass123' }];

const privateKey = "MYSECRETSECRETKEY";

const isValid = (username)=>{ //returns boolean
  const alreadyExists = users.find((user)=> { 
    return user.username === username});
//write code to check is the username is valid
return alreadyExists;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let match = false;
  const user = isValid(username);
  if (user && user.password === password) {
    match = true;
  }
  return match;
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  const credentialsValid = authenticatedUser(username,password);
  if (credentialsValid) {
    const token = jwt.sign({user: username},privateKey,{expiresIn: 60*60});
    req.session.authorization = {token,username}
    return res.status(200).json({message: ' login successful..!!'})
  } else {
    return res.status(400).json({message:'username and password do not match..!!'});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  if(req.params.isbn){
    const reviews = books[req.params.isbn].reviews;
    if(req.user){
      reviews[req.user] = req.query.review;
      books[req.params.isbn].reviews = reviews;
      return res.status(200).json({message: ' book review added..!!'});
    }
  }

});

regd_users.delete("/auth/delete/:isbn", (req, res) => {
  //Write your code here

  if(req.params.isbn){
    const reviews = books[req.params.isbn].reviews;
    if(req.user){
      delete reviews[req.user];
      books[req.params.isbn].reviews = reviews;
      return res.status(200).json({message: ' book review deleted..!!'});
    }
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

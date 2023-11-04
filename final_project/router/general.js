const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(!username){
    return res.status(400).json({message:'username not provided..!!'});
  } else if (!password) {
    return res.status(400).json({message:'password not provided..!!'});
  } else {
    const alreadyExists = users.find(user=> {
      return user.username === username
    });
    if (alreadyExists){
      res.status(400).json({message:'user already exists..!!'});
    } else {
      users.push ({username:username, password: password});
      return res.status(200).json({message:'user added successfully..!!'});
    }
  }


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const getBooksPromise = new Promise((resolve,rej)=>{
    resolve(books);
    
  });

  getBooksPromise
  .then((booksRet)=>{res.status(200).json(booksRet)})
  .catch(()=> {res.status(400).json({message:'something went wrong..!!'})});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const getBookWithIsbnPromise = new Promise((resolve,reject)=>{
    const isbn = req.params.isbn
    let book = null;
    if(isbn){
      book = books[isbn];
    }
    if(book){
      resolve(book);
    } else {
      reject();
    }
  });

  getBookWithIsbnPromise
  .then((book)=>{
    return res.status(200).json(book);
  })
  .catch(()=>{
    return res.status(403).json({message:'book not found'});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const getBookswithAuthorPromise = new Promise((resolve,reject)=>{
    let author = req.params.author
    let book = null;
    if(author){
      author = author.replaceAll(' ','');
      const k = Object.keys(books);
      k.forEach( (key)=> {
        const bookAuthor = books[key].author.replaceAll(' ','');
        if(bookAuthor === author){
          book = books[key];
        }
      })
    }
    if(book) {
      resolve(book);
    } else {
      reject();
    }
  })
  
  getBookswithAuthorPromise
  .then((book)=>{
    return res.status(200).json(book);
  })
  .catch(()=>{
    return res.status(403).json({message:'book not found'});
  })
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const getbooksWithTitlePromise = new Promise((resolve,reject)=>{
    let title = req.params.title
    let book = null;
    if(title){
      title = title.replaceAll(' ','');
      const k = Object.keys(books);
      k.forEach( (key)=> {
        const booktitle = books[key].title.replaceAll(' ','');
        if(booktitle === title){
          book = books[key];
        }
      })
    }
    if(book) {
      resolve(book);
    } else {
      reject()
    }
  })
  
  getbooksWithTitlePromise
  .then((book)=>{
    return res.status(200).json(book);
  })
  .catch(()=>{
    return res.status(403).json({message:'book not found'});
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let reviews = null;
  if(isbn){
    reviews = books[isbn].reviews;
  }

  if(reviews) {
    return res.status(200).json(reviews);
  } else {
    return res.status(403).json({message:'book not found'});
  }
});

module.exports.general = public_users;

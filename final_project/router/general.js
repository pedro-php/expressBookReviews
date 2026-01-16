const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body?.username;
    const password = req.body?.password;
    if(!username) return res.status(400).send("Username no provided")
    if(!password) return res.status(400).send("Password no provided")
    if(users.find(user => user.username === username)) return res.status(400).send("Username already exists");
    users.push({username, password})
  //Write your code here
  return res.status(200).send("User successfully created");
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  return await new Promise(resolve => res.status(200).send(JSON.stringify(books)))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    return await new Promise(resolve => res.status(200).send(JSON.stringify(books[req.params.isbn])))
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const keys = Object.keys(books);
    let authors = {};
    for(key in books){
        if(books[key].author === req.params.author) authors[key] = books[key];
    }
  return await new Promise(resolve => res.status(200).send(JSON.stringify(authors)))
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const keys = Object.keys(books);
    let titles = {};
    for(key in books){
        if(books[key].title === req.params.title) titles[key] = books[key];
    }
  return await new Promise(resolve => res.status(200).send(JSON.stringify(titles)))
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  
  return res.status(200).send(JSON.stringify(books[req.params.isbn].reviews));
});

module.exports.general = public_users;

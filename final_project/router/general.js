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
public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/books');
      res.status(200).send(JSON.stringify(response.data));
    } catch (err) {
      res.status(500).send(JSON.stringify(err.message));
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const response = await axios.get(
        `http://localhost:5000/books/isbn/${req.params.isbn}`
      );
      res.status(200).send(JSON.stringify(response.data));
    } catch (err) {
      res.status(500).send(JSON.stringify(err.message));
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const response = await axios.get(
        `http://localhost:5000/books/author/${req.params.author}`
      );
      res.status(200).send(JSON.stringify(response.data));
    } catch (err) {
      res.status(500).send(JSON.stringify(err.message));
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const response = await axios.get(
        `http://localhost:5000/books/title/${req.params.title}`
      );
      res.status(200).send(JSON.stringify(response.data));
    } catch (err) {
      res.status(500).send(JSON.stringify(err.message));
    }
  });

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  
  return res.status(200).send(JSON.stringify(books[req.params.isbn].reviews));
});

module.exports.general = public_users;

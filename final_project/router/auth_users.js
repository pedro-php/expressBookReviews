const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return !users.find(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
      let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password required");
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "fingerprint_customer", {
      expiresIn: "1h"
    });

    req.session.authorization = {
        token,
      username
    };

    return res.status(200).send("User successfully logged in");
  }

  return res.status(401).send("Invalid login credentials");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
  
    if (!books[isbn]) {
      return res.status(404).send("Book not found" );
    }
  
    if (!review) {
      return res.status(400).send("Review query parameter is required");
    }
  
    books[isbn].reviews[username] = review;
  
    return res.status(200).send(
    "Review added/updated successfully");
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (!books[isbn]) {
      return res.status(404).send("Book not found");
    }
  
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).send("Review by this user not found");
    }
  
    delete books[isbn].reviews[username];
  
    return res.status(200).send("Review deleted successfully");
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Keep this as an empty array here

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return true;
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let review = req.query.review; // Extract review from query parameter
  let session_data = req.session.authorization;
  
  if (session_data) {
    let username = session_data['username'];
    if (books[isbn]) {
        // This adds or updates the review for the specific user
        books[isbn].reviews[username] = review;
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
  }
  return res.status(403).json({message: "User not logged in"});
});
// Filter & delete the reviews based on the session username
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let session_data = req.session.authorization;
  
  if (session_data) {
    let username = session_data['username'];
    if (books[isbn]) {
        // This removes only the review associated with the logged-in user
        delete books[isbn].reviews[username];
        return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
  }
  return res.status(403).json({message: "User not logged in"});
});
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.regd_users = regd_users;
module.exports.users = users;
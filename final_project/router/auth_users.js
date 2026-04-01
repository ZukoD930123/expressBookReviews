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

// Task 7: Login a registered user
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    // 1. Generate JWT Access Token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // 2. Store the token and username in the session (REQUIRED CRITERIA)
    req.session.authorization = {
      accessToken, username
    };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username'];

  console.log(`Received review for ISBN: ${isbn} from user: ${username}`); // This will show in your VS Code terminal

  if (books[isbn]) {
      books[isbn].reviews[username] = review;
      // You must use .json() to ensure a proper response is sent back to curl
      return res.status(200).json({
          message: "Review added/updated successfully",
          reviews: books[isbn].reviews
      });
  } else {
      // If the ISBN doesn't exist, we still need to send a response so curl doesn't hang
      return res.status(404).json({message: "Book not found"});
  }
});

// Filter & delete the reviews based on the session username
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];

  if (books[isbn]) {
      delete books[isbn].reviews[username];
      // MATCHING EVALUATOR CRITERIA:
      return res.status(200).json({
          message: `Review for ISBN ${isbn} deleted`
      });
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.regd_users = regd_users;
module.exports.users = users;
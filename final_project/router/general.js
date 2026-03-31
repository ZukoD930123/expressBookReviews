const express = require('express');
let books = require("./booksdb.js");

let users = require("./auth_users.js").users;
const public_users = express.Router();


// Helper function to check if username exists
const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    // We call our own internal ISBN endpoint or similar to get the data
    // For the sake of this task, we wrap the books retrieval in a Promise
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    const bookList = await getBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));

  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Access the book using the ISBN key from the books object
  const book = books[isbn];

  if (book) {
    // If the book exists, send it back neatly
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    // If not found, send an error message
    return res.status(404).json({message: "Book not found"});
  }
 });
 
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books); // Get all ISBNs
  const results = [];

  keys.forEach((key) => {
    if (books[key].author === author) {
      results.push({
        "isbn": key,
        "title": books[key].title,
        "reviews": books[key].reviews
      });
    }
  });

  if (results.length > 0) {
    return res.status(200).send(JSON.stringify({ booksbyauthor: results }, null, 4));
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});


// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const results = [];

  keys.forEach((key) => {
    if (books[key].title === title) {
      results.push({
        "isbn": key,
        "author": books[key].author,
        "reviews": books[key].reviews
      });
    }
  });

  if (results.length > 0) {
    return res.status(200).send(JSON.stringify({ booksbytitle: results }, null, 4));
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});



// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "No reviews found for this ISBN"});
  }
});


// At the bottom of general.js
module.exports.general = public_users;
module.exports.users = users;
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Use JSON.stringify to format the books object neatly
  // The 'null, 4' adds 4 spaces of indentation for readability
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Capture the ISBN from the URL
  const book = books[isbn];    // Look it up in your books database

  if (book) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // 1. Obtain the author name from request parameters
  const author = req.params.author;
  
  // 2. Obtain all the keys for the 'books' object
  const keys = Object.keys(books);
  
  // Create an array to hold matching books
  let filtered_books = [];

  // 3. Iterate through the books object and check if the author matches
  keys.forEach(key => {
    if (books[key].author === author) {
      filtered_books.push(books[key]);
    }
  });

  if (filtered_books.length > 0) {
    res.send(JSON.stringify(filtered_books, null, 4));
  } else {
    res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  // Convert the books object into an array and filter by title
  const filtered_books = Object.values(books).filter(book => book.title === title);

  if (filtered_books.length > 0) {
    res.send(JSON.stringify(filtered_books, null, 4));
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // 1. Extract the ISBN from the URL parameters
  const isbn = req.params.isbn;
  
  // 2. Access the specific book from the 'books' object
  const book = books[isbn];

  if (book) {
    // 3. Return only the 'reviews' object of that book
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    // 4. Handle the case where the book doesn't exist
    res.status(404).json({message: "Book not found"});
  }
});
module.exports.general = public_users;

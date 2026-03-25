const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  return res.status(300).json({message: "Yet to be implemented"});
});

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const result = await getBooks;
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const findBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  findBook
    .then(book => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch(error => res.status(error.status || 500).json({ message: error.message }));
});

// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const filtered_books = keys
        .filter(key => books[key].author === author)
        .map(key => books[key]);

      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject({ status: 404, message: "No books found by this author" });
      }
    });

    const result = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// Task 13: Get book details based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const filtered_books = keys
        .filter(key => books[key].title === title)
        .map(key => books[key]);

      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject({ status: 404, message: "No books found with this title" });
      }
    });

    const result = await getBooksByTitle;
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;

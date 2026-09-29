const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

/*
  GET /api/books

  Get all books from MongoDB
*/
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});

/*
  POST /api/books

  Add a new book
*/
router.post("/", async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      publicationYear,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !author ||
      !isbn ||
      !category ||
      !publicationYear
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Create new book
    const newBook = new Book({
      title,
      author,
      isbn,
      category,
      publicationYear,
    });

    // Save book to MongoDB
    const savedBook = await newBook.save();

    // Send response
    res.status(201).json({
      message: "Book added successfully",
      book: savedBook,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);

    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});

// POST a new book
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

    const newBook = new Book({
      title,
      author,
      isbn,
      category,
      publicationYear,
    });

    const savedBook = await newBook.save();

    res.status(201).json({
      message: "Book added successfully",
      book: savedBook,
    });
  } catch (error) {
    console.error("Error adding book:", error);

    res.status(500).json({
      message: "Failed to add book",
      error: error.message,
    });
  }
});

module.exports = router;
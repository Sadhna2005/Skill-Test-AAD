import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    publicationYear: "",
  });

  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get all books from backend
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/books");

      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Unable to fetch books from the server.");
    }
  };

  // Fetch books when page loads
  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/books",
        formData
      );

      console.log(response.data);

      setMessage("Book added successfully!");

      // Clear the form
      setFormData({
        title: "",
        author: "",
        isbn: "",
        category: "",
        publicationYear: "",
      });

      // Add newly created book to the displayed list
      setBooks((previousBooks) => [
        response.data.book,
        ...previousBooks,
      ]);
    } catch (error) {
      console.error("Error adding book:", error);

      if (error.response) {
        setError(
          error.response.data.message || "Failed to add book."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1>Library Book Management System</h1>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label>Book Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="form-group">
            <label>Author Name</label>

            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="form-group">
            <label>ISBN</label>

            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              required
            />
          </div>

          <div className="form-group">
            <label>Publication Year</label>

            <input
              type="number"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              placeholder="Enter publication year"
              required
            />
          </div>

          <button type="submit">Add Book</button>
        </form>

        {/* Success message */}
        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {/* Error message */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}
      </div>

      {/* Book List */}
      <div className="books-section">
        <h2>Available Books</h2>

        {books.length === 0 ? (
          <p className="no-books">
            No books have been added yet.
          </p>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div className="book-card" key={book._id}>
                <h3>{book.title}</h3>

                <p>
                  <strong>Author:</strong> {book.author}
                </p>

                <p>
                  <strong>ISBN:</strong> {book.isbn}
                </p>

                <p>
                  <strong>Category:</strong> {book.category}
                </p>

                <p>
                  <strong>Publication Year:</strong>{" "}
                  {book.publicationYear}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
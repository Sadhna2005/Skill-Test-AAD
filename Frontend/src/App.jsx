import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/books";

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
  const [loading, setLoading] = useState(false);

  // Fetch books when the page loads
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setError("");

      const response = await axios.get(API_URL);

      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);

      setError(
        "Unable to fetch books. Please make sure the backend is running."
      );
    }
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        ...formData,
        publicationYear: Number(formData.publicationYear),
      });

      console.log("Book added:", response.data);

      setMessage("Book added successfully!");

      // Clear form
      setFormData({
        title: "",
        author: "",
        isbn: "",
        category: "",
        publicationYear: "",
      });

      // Refresh book list
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);

      if (error.response) {
        setError(
          error.response.data.message || "Failed to add book."
        );
      } else {
        setError(
          "Unable to connect to the backend server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">

        <header className="header">
          <h1>Library Book Management System</h1>
          <p>
            Add and manage library book records
          </p>
        </header>

        {/* Add Book Form */}
        <section className="form-section">
          <h2>Add New Book</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="title">
                Book Title
              </label>

              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">
                Author Name
              </label>

              <input
                id="author"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="isbn">
                ISBN
              </label>

              <input
                id="isbn"
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <input
                id="category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="publicationYear">
                Publication Year
              </label>

              <input
                id="publicationYear"
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                placeholder="Enter publication year"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding Book..." : "Add Book"}
            </button>

          </form>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </section>

        {/* Book Records */}
        <section className="books-section">

          <div className="books-heading">
            <h2>Book Records</h2>

            <button
              type="button"
              className="refresh-button"
              onClick={fetchBooks}
            >
              Refresh
            </button>
          </div>

          {books.length === 0 ? (
            <div className="empty-message">
              No books have been added yet.
            </div>
          ) : (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Category</th>
                    <th>Publication Year</th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>

                      <td>
                        {book.title}
                      </td>

                      <td>
                        {book.author}
                      </td>

                      <td>
                        {book.isbn}
                      </td>

                      <td>
                        {book.category}
                      </td>

                      <td>
                        {book.publicationYear}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default App;
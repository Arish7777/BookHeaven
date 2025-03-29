import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyBooks.css"; // You'll need to create this CSS file

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      // Redirect to login page if not logged in
      navigate("/auth?mode=login");
      return;
    }
    setCurrentUser(user);

    // Get books added by the current user
    const allBooks = JSON.parse(localStorage.getItem("userAddedBooks")) || [];
    const userBooks = allBooks.filter(
      (book) => book.added_by === user.id || book.added_by === user._id
    );

    setBooks(userBooks);
    setIsLoading(false);
  }, [navigate]);

  const handleDelete = (bookId) => {
    // Filter out the book to delete
    const updatedBooks = books.filter((book) => book.id !== bookId);
    setBooks(updatedBooks);

    // Update localStorage
    localStorage.setItem("userAddedBooks", JSON.stringify(updatedBooks));
  };

  if (isLoading) {
    return (
      <div className="my-books-loading">
        <div className="spinner"></div>
        <p>Loading your books...</p>
      </div>
    );
  }

  return (
    <div className="my-books-container">
      <div className="my-books-header">
        <h2>New Added Books</h2>
        <p>Books you've added to BookHaven</p>
        <button className="add-new-book-btn" onClick={() => navigate("/add-book")}>
          Add New Book
        </button>
      </div>
      {books.length === 0 ? (
        <div className="no-books-message">
          <p>You haven't added any books yet.</p>
          <button className="add-first-book-btn" onClick={() => navigate("/add-book")}>
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <div className="book-cover">
                {book.cover_img ? (
                  <img src={book.cover_img} alt={`${book.title} cover`} />
                ) : (
                  <div className="no-cover">
                    <span>{book.title.substring(0, 1)}</span>
                  </div>
                )}
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-genre">{book.genre}</p>
                <p className="book-added">
                  Added: {new Date(book.date_added).toLocaleDateString()}
                </p>
                <div className="book-actions">
                  <Link to={`/book/${book.id}`} className="view-details-btn">
                    View Details
                  </Link>
                  <button className="edit-book-btn" onClick={() => navigate(`/edit-book/${book.id}`)}>
                    Edit
                  </button>
                  <button className="delete-book-btn" onClick={() => handleDelete(book.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBook.css'; 

const AddBook = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover_img: '',
    description: '',
    publisher: '',
    publish_year: '',
    isbn: '',
    pages: '',
    genre: '',
    price: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      
      navigate('/auth?mode=login');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const validate = () => {
    let tempErrors = {};
    
    if (!formData.title.trim()) tempErrors.title = "Title is required";
    if (!formData.author.trim()) tempErrors.author = "Author is required";
    if (!formData.description.trim()) tempErrors.description = "Description is required";
    if (!formData.genre.trim()) tempErrors.genre = "Genre is required";
    

    if (!formData.isbn.trim()) {
      tempErrors.isbn = "ISBN is required";
    } else if (!/^[0-9-]{10,17}$/.test(formData.isbn.trim())) {
      tempErrors.isbn = "Invalid ISBN format";
    }
    
    
    if (formData.publish_year) {
      const year = parseInt(formData.publish_year);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1000 || year > currentYear) {
        tempErrors.publish_year = "Please enter a valid year";
      }
    }
    
    
    if (formData.pages) {
      const pages = parseInt(formData.pages);
      if (isNaN(pages) || pages <= 0) {
        tempErrors.pages = "Please enter a valid number of pages";
      }
    }
    
    // Price validation
    if (formData.price) {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        tempErrors.price = "Please enter a valid price";
      }
    }
    
    
    if (formData.cover_img && !formData.cover_img.trim().startsWith('http')) {
      tempErrors.cover_img = "Please enter a valid URL for the cover image";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      
      const bookData = {
        ...formData,
        added_by: currentUser.id || currentUser._id,
        added_by_username: currentUser.username
      };
      
    
      const existingBooks = JSON.parse(localStorage.getItem('userAddedBooks')) || [];
      const newBook = {
        ...bookData,
        id: Date.now().toString(), 
        date_added: new Date().toISOString()
      };
      
      existingBooks.push(newBook);
      localStorage.setItem('userAddedBooks', JSON.stringify(existingBooks));
      
      setSubmitMessage('Book added successfully!');
      
      
      setFormData({
        title: '',
        author: '',
        cover_img: '',
        description: '',
        publisher: '',
        publish_year: '',
        isbn: '',
        pages: '',
        genre: '',
        price: ''
      });
      

      setTimeout(() => {
        navigate('/my-books');
      }, 2000);
      
    } catch (error) {
      console.error("Error adding book:", error);
      setSubmitMessage('Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-book-container">
      <div className="add-book-header">
        <h2>Add New Book</h2>
        <p>Share your favorite books with the BookHaven community</p>
      </div>
      
      {submitMessage && (
        <div className={`submit-message ${submitMessage.includes('success') ? 'success' : 'error'}`}>
          {submitMessage}
        </div>
      )}
      
      <form className="add-book-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? 'error' : ''}
            />
            {errors.author && <span className="error-message">{errors.author}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="cover_img">Cover Image URL</label>
            <input
              type="text"
              id="cover_img"
              name="cover_img"
              value={formData.cover_img}
              onChange={handleChange}
              placeholder="https://example.com/book-cover.jpg"
              className={errors.cover_img ? 'error' : ''}
            />
            {errors.cover_img && <span className="error-message">{errors.cover_img}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="isbn">ISBN *</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="978-3-16-148410-0"
              className={errors.isbn ? 'error' : ''}
            />
            {errors.isbn && <span className="error-message">{errors.isbn}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="genre">Genre *</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className={errors.genre ? 'error' : ''}
            />
            {errors.genre && <span className="error-message">{errors.genre}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="publish_year">Publication Year</label>
            <input
              type="number"
              id="publish_year"
              name="publish_year"
              value={formData.publish_year}
              onChange={handleChange}
              className={errors.publish_year ? 'error' : ''}
            />
            {errors.publish_year && <span className="error-message">{errors.publish_year}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="pages">Number of Pages</label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              className={errors.pages ? 'error' : ''}
            />
            {errors.pages && <span className="error-message">{errors.pages}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="19.99"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className={errors.description ? 'error' : ''}
          ></textarea>
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="view-books-btn"
            onClick={() => navigate('/my-books')}
            >
            View Added Books
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Book...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
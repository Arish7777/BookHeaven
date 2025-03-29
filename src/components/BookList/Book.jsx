import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./BookList.css";

const Book = (book) => {
  const navigate = useNavigate();

  const handleBookClick = (e) => {
    e.preventDefault();
    
    navigate(`/book/${book.id}`);
    
    
    setTimeout(() => {
      window.scrollTo({
        top: 500,
        behavior: 'smooth'
      });
    }, 100); 
  };

  return (
    <div 
      className='book-item flex flex-column flex-sb' 
      onClick={handleBookClick}
      style={{ cursor: 'pointer' }}
    >
      <div className='book-item-img'>
        <img src={book.cover_img} alt="cover" />
      </div>
      <div className='book-item-info text-center'>
        <div className='book-item-info-item title fw-7 fs-18'>
          <span>{book.title}</span>
        </div>

        <div className='book-item-info-item author fs-15'>
          <span className='text-capitalize fw-7'>Author: </span>
          <span>{book.author.join(", ")}</span>
        </div>

        <div className='book-item-info-item edition-count fs-15'>
          <span className='text-capitalize fw-7'>Total Editions: </span>
          <span>{book.edition_count}</span>
        </div>

        <div className='book-item-info-item publish-year fs-15'>
          <span className='text-capitalize fw-7'>First Publish Year: </span>
          <span>{book.first_publish_year}</span>
        </div>
      </div>
    </div>
  );
};

export default Book;
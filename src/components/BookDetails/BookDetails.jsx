import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import "./BookDetails.css";
import {FaArrowLeft, FaHeart, FaRegHeart, FaStar} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const URL = "https://openlibrary.org/works/";

const BookDetails = () => {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isUserAddedBook, setIsUserAddedBook] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
      
      // Check if this book is already in favorites
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
      const isFavorite = favorites.some(fav => fav.id === id);
      setIsInFavorites(isFavorite);
    }

    // Load reviews for this book
    loadReviews();
    
    // First check if this is a user-added book
    checkUserAddedBook();
  }, [id]);

  const checkUserAddedBook = () => {
    const userAddedBooks = JSON.parse(localStorage.getItem('userAddedBooks')) || [];
    const userBook = userAddedBooks.find(book => book.id === id);
    
    if (userBook) {
      setIsUserAddedBook(true);
      setBook(userBook);
      setLoading(false);
      
      // Scroll down after content is loaded
      setTimeout(() => {
        window.scrollTo({
          top: 500,
          behavior: 'smooth'
        });
      }, 300);
    } else {
      // If not a user-added book, proceed to fetch from API
      fetchBookFromAPI();
    }
  };

  const loadReviews = () => {
    const bookReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    setReviews(bookReviews);
  };

  const fetchBookFromAPI = () => {
    setLoading(true);
    async function getBookDetails(){
      try{
        const response = await fetch(`${URL}${id}.json`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          // You can add other options like cache mode if needed
          // mode: 'cors' // or 'no-cors' if needed (but this limits response access)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
  
        if(data){
          const {description, title, covers, subject_places, subject_times, subjects} = data;
          const newBook = {
            id: id,
            description: description ? description.value : "No description found",
            title: title,
            cover_img: covers ? `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg` : coverImg,
            subject_places: subject_places ? subject_places.join(", ") : "No subject places found",
            subject_times : subject_times ? subject_times.join(", ") : "No subject times found",
            subjects: subjects ? subjects.join(", ") : "No subjects found"
          };
          setBook(newBook);
        } else {
          setBook(null);
        }
        setLoading(false);
  
        // Scroll down after content is loaded
        setTimeout(() => {
          window.scrollTo({
            top: 500,
            behavior: 'smooth'
          });
        }, 300);
      } catch(error){
        console.log(error);
        setLoading(false);
      }
    }
    getBookDetails();
  };

  const toggleFavorite = () => {
    if (!currentUser) return;
    
    const favoriteKey = `favorites_${currentUser.id}`;
    let favorites = JSON.parse(localStorage.getItem(favoriteKey)) || [];
    
    if (isInFavorites) {
      // Remove from favorites
      favorites = favorites.filter(fav => fav.id !== id);
    } else {
      // Add to favorites - we need to include only necessary book info
      favorites.push({
        id: book.id,
        title: book.title,
        cover_img: book.cover_img,
        author: book.author || ["Unknown"]
      });
    }
    
    localStorage.setItem(favoriteKey, JSON.stringify(favorites));
    setIsInFavorites(!isInFavorites);
  };

  const submitReview = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("Please log in to add a review");
      return;
    }
    
    if (!userReview.trim() || userRating === 0) {
      alert("Please add both a review and rating");
      return;
    }
    
    // Create new review
    const newReview = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.username || currentUser.name || "User",
      bookId: id,
      rating: userRating,
      text: userReview,
      date: new Date().toISOString()
    };
    
    // Add to localStorage
    const updatedReviews = [...reviews, newReview];
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    
    // Update state
    setReviews(updatedReviews);
    setUserReview('');
    setUserRating(0);
  };
  
  // Calculate average rating
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if(loading) return <Loading />;

  return (
    <section className='book-details'>
      <div className='container'>
        <button type='button' className='flex flex-c back-btn' onClick={() => navigate("/book")}>
          <FaArrowLeft size = {22} />
          <span className='fs-18 fw-6'>Go Back</span>
        </button>

        <div className='book-details-content grid'>
          <div className='book-details-img'>
            <img src = {book?.cover_img} alt = "cover img" />
            
            {/* Favorites button - only show if user is logged in */}
            {currentUser && (
              <button 
                className='favorite-btn'
                onClick={toggleFavorite}
                title={isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isInFavorites ? 
                  <FaHeart size={24} color="red" /> : 
                  <FaRegHeart size={24} color="red" />
                }
              </button>
            )}

            {/* Average Rating Display */}
            <div className="average-rating">
              <span className="fw-6 fs-18">Rating: {getAverageRating()}/5</span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar 
                    key={star}
                    color={star <= getAverageRating() ? "#ffc107" : "#e4e5e9"}
                    size={20}
                  />
                ))}
              </div>
              <span className="review-count">({reviews.length} reviews)</span>
            </div>
          </div>
          
          <div className='book-details-info'>
            <div className='book-details-item title'>
              <span className='fw-6 fs-24'>{book?.title}</span>
            </div>
            {isUserAddedBook && (
              <>
                <div className='book-details-item'>
                  <span className='fw-6'>Author: </span>
                  <span>{book?.author}</span>
                </div>
                <div className='book-details-item'>
                  <span className='fw-6'>Genre: </span>
                  <span>{book?.genre}</span>
                </div>
              </>
            )}
            <div className='book-details-item description'>
              <span>{book?.description}</span>
            </div>
            {!isUserAddedBook && (
              <>
                <div className='book-details-item'>
                  <span className='fw-6'>Subject Places: </span>
                  <span className='text-italic'>{book?.subject_places}</span>
                </div>
                <div className='book-details-item'>
                  <span className='fw-6'>Subject Times: </span>
                  <span className='text-italic'>{book?.subject_times}</span>
                </div>
                <div className='book-details-item'>
                  <span className='fw-6'>Subjects: </span>
                  <span>{book?.subjects}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2 className="section-title">Reviews</h2>
          
          {/* Add Review Form */}
          {currentUser ? (
            <form className="review-form" onSubmit={submitReview}>
              <h3>Add Your Review</h3>
              
              <div className="rating-selector">
                <span className="fw-6">Your Rating: </span>
                <div className="stars-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar 
                      key={star}
                      color={(hoveredRating || userRating) >= star ? "#ffc107" : "#e4e5e9"}
                      size={24}
                      style={{ cursor: 'pointer', marginRight: '5px' }}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    />
                  ))}
                </div>
              </div>
              
              <textarea
                className="review-textarea"
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Write your review here..."
                required
                rows={5}
              />
              
              <button type="submit" className="submit-review-btn">
                Submit Review
              </button>
            </form>
          ) : (
            <div className="login-prompt">
              <p>Please <span onClick={() => navigate("/login")} className="login-link">log in</span> to add a review</p>
            </div>
          )}
          
          {/* Reviews List */}
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name fw-6">{review.username}</span>
                    <div className="reviewer-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                          key={star}
                          color={star <= review.rating ? "#ffc107" : "#e4e5e9"}
                          size={16}
                        />
                      ))}
                    </div>
                    <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookDetails
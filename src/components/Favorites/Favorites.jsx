import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from "../Loader/Loader";
import "./Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
      
      // Load favorites
      const userFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
      setFavorites(userFavorites);
    }
    setLoading(false);
  }, []);

  const removeFavorite = (bookId) => {
    if (!currentUser) return;
    
    const favoriteKey = `favorites_${currentUser.id}`;
    let updatedFavorites = favorites.filter(fav => fav.id !== bookId);
    
    localStorage.setItem(favoriteKey, JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  if(loading) return <Loading />;

  if(!currentUser) {
    return (
      <div className="favorites-container">
        <h2>Please log in to view your favorites</h2>
        <Link to="/auth?mode=login" className="login-link">Log In</Link>
      </div>
    );
  }

  return (
    <section className='favorites'>
      <div className='container'>
        <div className='section-title'>
          <h2>Your Favorite Books</h2>
        </div>
        
        {favorites.length === 0 ? (
          <div className="no-favorites">
            <p>You haven't added any books to your favorites yet.</p>
            <Link to="/book" className="browse-books-link">Browse Books</Link>
          </div>
        ) : (
          <div className='favorites-content grid'>
            {favorites.map((item, index) => (
              <div className='favorite-item' key={index}>
                <div className='favorite-item-img'>
                  <img src={item.cover_img} alt="cover" />
                  <button 
                    className='remove-btn'
                    onClick={() => removeFavorite(item.id)}
                    title='Remove from favorites'
                  >
                    &times;
                  </button>
                </div>
                <div className='favorite-item-info'>
                  <Link to={`/book/${item.id}`}>
                    <h4>{item.title}</h4>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Favorites;
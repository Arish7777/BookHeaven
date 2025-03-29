import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "./Navbar.css";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
    }

    // Add click event listener to close menu when clicking outside
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setToggleMenu(false);
      }
    };

    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavbar = () => setToggleMenu(!toggleMenu);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setToggleMenu(false);
    navigate('/auth');
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollY = (pixels) => {
    window.scrollTo({
      top: pixels,
      behavior: 'smooth'
    });
  };

  const handleNavigation = (sectionId, route) => {
    setToggleMenu(false); // Close menu when navigating
    if (location.pathname !== route) {
      navigate(route); 
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 500);
    } else {
      scrollToSection(sectionId);
    }
  };

  const handleFavoritesClick = () => {
    setToggleMenu(false); // Close menu when clicking favorites
    navigate('/favorites');
    setTimeout(() => {
      scrollY(500);
    }, 100);
  };

  const handleAddBookClick = () => {
    setToggleMenu(false); // Close menu when clicking add book
    navigate('/add-book');
    setTimeout(() => {
      scrollY(500); // You can adjust this value to scroll to your desired position
    }, 100);
  };

  return (
    <nav className='navbar' id="navbar" ref={navbarRef}>
      <div className='container navbar-content flex'>
        <div className='brand-and-toggler flex flex-sb'>
          <Link to="/" className='navbar-brand flex'>
            <span className='text-uppercase fw-7 fs-24 ls-1 '>BookHaven</span>
          </Link>
          <button type="button" className="navbar-toggler-btn" onClick={handleNavbar}>
            <HiOutlineMenuAlt3 size={35} style={{ color: "#fff" }} />
          </button>
        </div>

        <div className={toggleMenu ? "navbar-collapse show-navbar-collapse" : "navbar-collapse"}>
          <ul className="navbar-nav">
            <li className='nav-item'>
              <button className='nav-link text-uppercase text-white fs-22 fw-6 ls-1' 
                      onClick={() => handleNavigation('home', '/')}>
                Home
              </button>
            </li>
            <li className='nav-item'>
              <button className="nav-link text-uppercase fs-22 fw-6 ls-1" 
                      onClick={() => handleNavigation('about', '/about')}>
                About
              </button>
            </li>

            {currentUser ? (
              <>
                <li className='nav-item'>
                  <button 
                    onClick={handleFavoritesClick} 
                    className="nav-link text-uppercase fs-22 fw-6 ls-1"
                  >
                    Favorites
                  </button>
                </li>
                <li className='nav-item'>
                  <button 
                    onClick={handleAddBookClick} 
                    className="nav-link text-uppercase fs-22 fw-6 ls-1"
                  >
                    Add Book
                  </button>
                </li>
                <li className='nav-item'>
                  <span className="nav-username">Welcome, {currentUser.username}</span>
                </li>
                <li className='nav-item'>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </li>
              </>
            ) : (
              <li className='nav-item auth-buttons'>
                <Link to="/auth?mode=login" className="auth-login-btn" onClick={() => setToggleMenu(false)}>Log In</Link>
                <Link to="/auth?mode=signup" className="auth-signup-btn" onClick={() => setToggleMenu(false)}>Sign Up</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
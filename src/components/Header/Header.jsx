import React from 'react';
import Navbar from "../Navbar/Navbar";
import SearchForm from "../SearchForm/SearchForm";
import "./Header.css";

const Header = () => {
  return (
    <div className='holder'>
        <header className='header'>
            <Navbar />
            <div className='header-content flex flex-c text-center text-white'>
                <h2 className='header-title text-capitalize'>Discover Your Next Great Read.</h2><br />
                <p className='header-text fs-18 fw-3'>Dive into a world of endless stories, knowledge, and inspiration. Whether you're looking for timeless classics, thrilling mysteries, or insightful non-fiction, our collection has something for everyone. Start your journey today and uncover the perfect book that speaks to you.</p>
                <SearchForm />
            </div>
        </header>
    </div>
  )
}

export default Header
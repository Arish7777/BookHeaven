import React from 'react';
import "./About.css";
import aboutImg from "../../images/about-img.jpg";

const About = () => {
  return (
    <section className='about' id="about"> {/* Add id="about" for scrolling */}
      <div className='container'>
        <div className='section-title'>
          <h2>About US</h2>
        </div>

        <div className='about-content grid'>
          <div className='about-img'>
            <img src = {aboutImg} alt = "" />
          </div>
          <div className='about-text'>
            <h2 className='about-title fs-26 ls-1'>About BookHaven</h2>
            <p className='fs-17'>Welcome to BookHaven, a sanctuary for book lovers and knowledge seekers. Whether you’re an avid reader, a researcher, or just someone who enjoys the ambiance of a cozy reading space, BookHaven offers a vast collection of books across multiple genres. From timeless classics to modern bestsellers, our carefully curated library is designed to inspire curiosity and foster a love for reading.</p>
            <p className='fs-17'>At BookHaven, we believe that books have the power to transform lives. Our mission is to create a welcoming space where literature, culture, and imagination come together. Dive into a world of words, explore new perspectives, and embark on literary adventures that stay with you forever.</p>
            <p>Discover hidden gems among our shelves, participate in engaging book discussions, and connect with a community of like-minded readers. Whether you prefer the comfort of a physical book or the convenience of digital editions, BookHaven caters to all reading preferences.</p>
            <p>In addition to our extensive collection, we host author events, workshops, and literary festivals to celebrate the magic of storytelling. Our cozy reading nooks provide the perfect escape from the hustle and bustle, allowing you to immerse yourself in a world of knowledge and imagination.</p>
            <p>Join us at BookHaven, where every page turned is a step toward new adventures, ideas, and endless inspiration.</p>

          </div>
        </div>
      </div>
    </section>
  )
}

export default About

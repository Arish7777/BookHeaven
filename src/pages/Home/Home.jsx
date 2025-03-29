import React from 'react';
import Header from '../../components/Header/Header';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <main id="home"> 
        <Header />
        <Outlet />
    </main>
  )
}

export default Home;

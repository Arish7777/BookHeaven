import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter, Routes, Route
} from 'react-router-dom';
import { AppProvider } from './context';
import './index.css';
import Home from './pages/Home/Home';
import About from "./pages/About/About";
import BookList from "./components/BookList/BookList";
import BookDetails from "./components/BookDetails/BookDetails";
import AuthPage from './pages/Auth/AuthPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Favorites from './components/Favorites/Favorites';
import AddBook from './components/AddBook/AddBook';
import MyBooks from './components/MyBooks/MyBooks';
import EditBook from './components/EditBook/EditBook';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home />}>
          <Route path = "about" element = {<About />} />
          <Route path = "book" element = {<BookList />} />
          <Route path = "/book/:id" element = {<BookDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          {/* Your existing routes */}
  
          {/* New routes for book management */}
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/my-books" element={<MyBooks />} />
          <Route path="/edit-book/:id" element={<EditBook />} />
          <Route path="/my-books" element={<MyBooks />} />
        </Route>
        <Route path = "/auth" element = {<AuthPage />} /> 
        <Route path = "/dashboard" element = {<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
);
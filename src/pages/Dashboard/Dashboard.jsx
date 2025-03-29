import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FaArrowLeft } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    // Retrieve user from local storage when component mounts
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user) {
      // Ensure user has a createdAt timestamp
      if (!user.createdAt) {
        user.createdAt = new Date().toISOString();
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      setCurrentUser(user);
      
      // Retrieve all users
      let storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Ensure all users have a createdAt timestamp
      let usersUpdated = false;
      storedUsers = storedUsers.map(u => {
        if (!u.createdAt) {
          usersUpdated = true;
          return { ...u, createdAt: new Date().toISOString() };
        }
        return u;
      });
      
      // Update localStorage if any users were modified
      if (usersUpdated) {
        localStorage.setItem('users', JSON.stringify(storedUsers));
      }
      
      setUsers(storedUsers);
    } else {
      // Redirect to login if no user is found
      navigate('/auth');
    }
  }, [navigate]);

  // Format date safely, handling potential invalid date values
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date format';
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Error displaying date';
    }
  };

  // Format date and time safely
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date format';
      }
      return date.toLocaleString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Error displaying date';
    }
  };

  // If no user is loaded yet, show a loading state
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  
  const handleBacks = () => {
    navigate(-2); // Go back to the previous page
  };

  // For debugging - log the current user data
  console.log("Current user:", currentUser);
  console.log("createdAt value:", currentUser.createdAt);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to BookHaven Dashboard</h1>
        <p>Hello, {currentUser.username}!</p>

      </div>

      <div className="user-info">
        <h2>Your Profile</h2>
        <p>Email: {currentUser.email}</p>
        <p>Joined: {formatDate(currentUser.createdAt)}</p>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={handleBacks} 
          className="Main-button"
        >
          Continue
        </button>

        {/* Only show user list button for admin */}
        {currentUser.email === 'admin@bookhaven.com' && (
          <button 
            onClick={() => setShowUserList(!showUserList)}
            className="toggle-userlist-button"
          >
            {showUserList ? 'Hide User List' : 'Show User List'}
          </button>
        )}
      </div>

      {/* User List Section */}
      {showUserList && currentUser.email === 'admin@bookhaven.com' && (
        <div className="user-list-container">
          <h2>Registered Users</h2>
          {users.length === 0 ? (
            <p>No users have signed up yet.</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Sign Up Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{formatDateTime(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
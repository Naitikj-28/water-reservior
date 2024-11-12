import React, { useState } from 'react';
import './CSS/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function Navbar({ toggleSidebar, onDateChange }) {
  const [selectedDate, setSelectedDate] = useState('2011-01-01');

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  return (
    <nav className="navbar">
      <button onClick={toggleSidebar} className="sidebar-toggle">
        <FontAwesomeIcon icon={faBars} className="icon" />
      </button>
      <p className="name">Water Reservoir Watch</p>
      <div className="datepicker-container">
        <input
          type="date"
          className="datepicker-input"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
    </nav>
  );
}

export default Navbar;

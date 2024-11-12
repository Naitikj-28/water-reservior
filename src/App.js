import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Main from './Components/Main';
import Spinner from './Components/Spinner';
import './App.css';

function App() {
  const [selectedDam, setSelectedDam] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2011-01-01'); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDamClick = (damName) => {
    setSelectedDam(damName);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} onDateChange={handleDateChange} />
      <div className="container">
        <Sidebar
          isOpen={isSidebarOpen}
          onDamClick={handleDamClick}
          selectedDam={selectedDam}
        />
        <main className={isSidebarOpen ? 'content shift' : 'content'}>
          <Main
            selectedDam={selectedDam}
            selectedDate={selectedDate}
            isSidebarOpen={isSidebarOpen}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
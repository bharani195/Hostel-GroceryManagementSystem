import BuildingImage from './Images/aboutkec.jpg';
import React from 'react';
import './HomePage.css'; // Import the CSS for the HomePage component
import GenericHeader from './GenericHeader'; // Correctly importing GenericHeader

const HomePage = () => {
  return (
    <>
      {/* Reusable Generic Header */}
      <GenericHeader />

      <div className="about-container">
        {/* Header Section */}
        <header className="kec-header">
          <h1>KONGU ENGINEERING COLLEGE</h1>
        </header>

        {/* Main Content Section */}
        <main className="kec-content">
          <h2>About KEC</h2>
          <p>
            Kongu Engineering College, one of the foremost multi-professional
            research-led institutions, is internationally recognized as a leader
            in professional and career-oriented education...
          </p>

          {/* Image Section */}
          <div className="kec-image-container">
            <img src={BuildingImage} alt="KEC Building" />
          </div>

          <p>
            The word 'Kongu' refers to a region of the southern state of India, and
            the term 'Kongu Vellalar' specifically means the agricultural community...
          </p>
        </main>
      </div>
    </>
  );
};

export default HomePage;

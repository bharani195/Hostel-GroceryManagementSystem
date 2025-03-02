import React from 'react';
import BuildingImage from './Images/aboutkec.jpg';
import './CaretakerDashboard.css';
import Caretaker from './CaretakerFooter.js';
const CaretakerDashboard = () => 

    <div className="about-container">
      {/* Header Section */}
      <header className="kec-header">
        <h1>KONGU ENGINEERING COLLEGE</h1>
        
      </header>

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
          The word 'Kongu' refers to a region of the southern state of India and
          the term 'Kongu Vellalar' specially means the agricultural community...
        </p>

   
       <Caretaker/>
      </main>
      
    </div>

    


export default CaretakerDashboard;

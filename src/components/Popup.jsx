import React from 'react';

const Popup = ({ mensaje, mostrar, onClose }) => {
  return (
    mostrar && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>{mensaje}</h2>
          <img src="trofeo.jpg" alt="¡Ganaste!" style={{ width: '100px' }} />
        </div>
      </div>
    )
  );
};

export default Popup;

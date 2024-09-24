import React from 'react';

const Popup = ({ mensaje, mostrar, imagen }) => {
  return (
    <div className={`popup ${mostrar ? 'visible' : 'hidden'}`}>
      <div className="popup-content">
        <p>{mensaje}</p>
        {imagen && <img src={imagen} alt="popup visual" className="popup-image" />}
      </div>
    </div>
  );
};

export default Popup;



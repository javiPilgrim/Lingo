import React from 'react';

const LetterBox = ({ letra, estado }) => {
  const getColor = () => {
    if (estado === 'correcto') return 'green';
    if (estado === 'mala-posicion') return 'yellow';
    return 'gray';
  };

  return (
    <span style={{
      display: 'inline-block',
      width: '40px',
      height: '40px',
      lineHeight: '40px',
      textAlign: 'center',
      margin: '5px',
      fontSize: '20px',
      backgroundColor: getColor(),
      color: 'white',
      borderRadius: '5px',
      border: '1px solid #000',
    }}>
      {letra}
    </span>
  );
};

export default LetterBox;

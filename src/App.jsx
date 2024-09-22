import React, { useState, useEffect } from 'react';
import LetterBox from './components/LetterBox';
import Popup from './components/Popup';

const palabras = ['LINCE', 'PERRO', 'GATOS', 'CIELO', 'CASAS']; // Ejemplos de palabras

function App() {
  const [palabraSecreta, setPalabraSecreta] = useState(palabras[Math.floor(Math.random() * palabras.length)]);
  const [jugadorActual, setJugadorActual] = useState(1);
  const [intentos, setIntentos] = useState(Array(5).fill(Array(5).fill({ letra: '', estado: '' })));
  const [inputPalabra, setInputPalabra] = useState('');
  const [puntuaciones, setPuntuaciones] = useState({ 1: 0, 2: 0 });
  const [intentoActual, setIntentoActual] = useState(0);
  const [mostrarPopup, setMostrarPopup] = useState(false); // Nuevo estado para controlar el popup
  const [mensajePopup, setMensajePopup] = useState(''); // Estado para el mensaje del popup

  const maxIntentos = 5;

  useEffect(() => {
    if (mostrarPopup) {
      const timer = setTimeout(() => {
        setMostrarPopup(false);
      }, 5000); // Oculta el popup después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [mostrarPopup]);

  const handleInputChange = (e) => {
    setInputPalabra(e.target.value.toUpperCase());
  };

  const checkPalabra = () => {
    if (inputPalabra.length !== 5) {
      alert('La palabra debe tener 5 letras.');
      return;
    }

    let nuevoIntento = [];
    for (let i = 0; i < 5; i++) {
      if (inputPalabra[i] === palabraSecreta[i]) {
        nuevoIntento.push({ letra: inputPalabra[i], estado: 'correcto' });
      } else if (palabraSecreta.includes(inputPalabra[i])) {
        nuevoIntento.push({ letra: inputPalabra[i], estado: 'mala-posicion' });
      } else {
        nuevoIntento.push({ letra: inputPalabra[i], estado: 'incorrecto' });
      }
    }

    const nuevosIntentos = [...intentos];
    nuevosIntentos[intentoActual] = nuevoIntento;
    setIntentos(nuevosIntentos);

    if (inputPalabra === palabraSecreta) {
      const nuevaPuntuacion = { ...puntuaciones, [jugadorActual]: puntuaciones[jugadorActual] + 1 };
      setPuntuaciones(nuevaPuntuacion);
      setMensajePopup(`¡Jugador ${jugadorActual} ha adivinado la palabra!`);
      setMostrarPopup(true); // Mostrar el popup

      const aplausos = new Audio('/aplausos.mp3'); // Ruta del archivo de sonido
      aplausos.play();

      if (nuevaPuntuacion[jugadorActual] >= 3) {
        alert(`¡Jugador ${jugadorActual} ha ganado el juego!`);
        resetGame();
        return;
      }
      resetRound();
    } else if (intentoActual + 1 >= maxIntentos) {
      alert(`¡Se acabaron los intentos! La palabra era ${palabraSecreta}.`);
      resetRound();
    } else {
      setIntentoActual(intentoActual + 1);
      cambiarTurno();
    }

    setInputPalabra('');
  };

  const cambiarTurno = () => {
    setJugadorActual(jugadorActual === 1 ? 2 : 1);
  };

  const resetRound = () => {
    setIntentos(Array(5).fill(Array(5).fill({ letra: '', estado: '' })));
    setIntentoActual(0);
    setPalabraSecreta(palabras[Math.floor(Math.random() * palabras.length)]);
    cambiarTurno();
  };

  const resetGame = () => {
    setPuntuaciones({ 1: 0, 2: 0 });
    resetRound();
  };

  const renderPalabraSecreta = () => {
    return (
      <div className="palabra-secreta">
        {palabraSecreta.split('').map((letra, index) => {
          let visible = false;
          for (let i = 0; i < intentoActual; i++) {
            if (intentos[i][index]?.estado === 'correcto') {
              visible = true;
              break;
            }
          }
          return (
            <LetterBox
              key={index}
              letra={visible ? letra : ''}
              estado={visible ? 'correcto' : ''}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="header">
        <div className={`jugador jugador1 ${jugadorActual === 2 ? 'jugador-inactivo' : ''}`}>
          <h3>Jugador 1</h3>
          <p>Puntos: {puntuaciones[1]}</p>
        </div>
        <div className={`jugador jugador2 ${jugadorActual === 1 ? 'jugador-inactivo' : ''}`}>
          <h3>Jugador 2</h3>
          <p>Puntos: {puntuaciones[2]}</p>
        </div>
      </div>

      <h2 className="titulo">La Palabra Escondida</h2>
      {renderPalabraSecreta()}

      <div className="intentos">
        <h3 className="titulo">Intentos</h3>
        {intentos.map((intento, idx) => (
          <div key={idx} className="intento">
            {intento.map((letraObj, letraIdx) => (
              <LetterBox key={letraIdx} letra={letraObj.letra} estado={letraObj.estado} />
            ))}
          </div>
        ))}
      </div>

      <div className="input-section">
        <input
          type="text"
          maxLength="5"
          value={inputPalabra}
          onChange={handleInputChange}
          placeholder="Escribe tu palabra"
        />
        <button onClick={checkPalabra}>Comprobar palabra</button>
      </div>

      <Popup mensaje={mensajePopup} mostrar={mostrarPopup} />
    </div>
  );
}

export default App;

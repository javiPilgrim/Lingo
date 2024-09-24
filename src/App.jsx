import React, { useState, useEffect } from 'react';
import LetterBox from './components/LetterBox';
import Popup from './components/Popup';

const palabras = ['LAPIZ', 'JUEGO', 'PIZZA', 'AVION', 'RATON', 'CANTO', 'NIEVE']; 

function App() {
  const [pantallaActual, setPantallaActual] = useState('intro');
  const [palabraSecreta, setPalabraSecreta] = useState(palabras[Math.floor(Math.random() * palabras.length)]);
  const [jugadorActual, setJugadorActual] = useState(1);
  const [intentos, setIntentos] = useState(Array(5).fill(Array(5).fill({ letra: '', estado: '' })));
  const [inputPalabra, setInputPalabra] = useState('');
  const [puntuaciones, setPuntuaciones] = useState({ 1: 0, 2: 0 });
  const [intentoActual, setIntentoActual] = useState(0);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mensajePopup, setMensajePopup] = useState('');
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false);

  const maxIntentos = 5;
  const [audio, setAudio] = useState(null); // Estado para gestionar el audio

  useEffect(() => {
    // Cargar el archivo de audio cuando la app se monta
    const audioFile = new Audio('aplausos.mp3'); // Asegúrate de que la ruta sea correcta
    setAudio(audioFile);
  }, []);

  useEffect(() => {
    if (mostrarPopup) {
      // Reproducir el audio cuando el popup se muestra
      if (audio) {
        audio.play();
      }

      const timer = setTimeout(() => {
        setMostrarPopup(false);
      }, 5000); // Oculta el popup después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [mostrarPopup, audio]);

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
      setMostrarPopup(true); // Mostrar el popup y reproducir el audio

      if (nuevaPuntuacion[jugadorActual] >= 3) {
        alert(`¡Jugador ${jugadorActual} ha ganado el juego!`);
        setPantallaActual('intro');
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

  const mostrarPantallaJuego = () => {
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

        <Popup mensaje={mensajePopup} mostrar={mostrarPopup} imagen="/trofeo.jpg" />
      </div>
    );
  };

  const mostrarPantallaIntro = () => (
    <div className="pantalla-intro">
      <div className="intro-box">
        <h1 className="titulo-3d">Bienvenido a LINGO.</h1>
        <h2 className="subtitulo-3d">El juego de la Palabra Escondida</h2>
        <div className="botones-intro">
          <button className="boton-intro" onClick={() => alert('Modo un jugador aún no disponible')}>Un Jugador</button>
          <button className="boton-intro" onClick={() => setPantallaActual('juego')}>Dos Jugadores</button>
          <button className="boton-intro" onClick={() => setMostrarInstrucciones(true)}>Ver Instrucciones</button>
        </div>
  
        {mostrarInstrucciones && (
          <div className="instrucciones-modal">
            <h2>Instrucciones del Juego</h2>
            <p>
              <strong>Objetivo:</strong> El objetivo del juego es adivinar la palabra secreta en un máximo de 5 intentos.</p>
              <p><strong>Modalidad "Dos Jugadores".</strong></p>
              <p>Cada jugador toma turnos para ingresar una palabra de 5 letras. Si una letra está en la
              posición correcta, se marcará en verde; si está en la palabra pero en la posición
              incorrecta, se marcará en amarillo; y si no está en la palabra, no se marcará. Los jugadores irán intentando resolver la palabra en su turno. Puntuará el jugador que consiga resolver la palabra. En caso de que ninguno de los jugadores resuelva la palabra en cinco intentos se desvelará la palabra y se pasará a un nuevo panel con una nueva palabra oculta. El jugador que llegue a los tres puntos gana la partida.
            </p>
            <button onClick={() => setMostrarInstrucciones(false)}>Cerrar Instrucciones</button>
          </div>
        )}
      </div>
    </div>
  );
  

  return (
    <div>
      {pantallaActual === 'intro' && mostrarPantallaIntro()}
      {pantallaActual === 'juego' && mostrarPantallaJuego()}
    </div>
  );
}

export default App;


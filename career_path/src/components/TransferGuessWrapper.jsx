// src/components/TransferGuessWrapper.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import background from '../assets/background1.png';
import TransferGuess from './TransferGuess';
import Logo from './Logo';

const TransferGuessWrapper = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        overflow: 'hidden',
        padding: 0,
      }}
    >
      <Logo />

      {/* Státuszsáv */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          fontSize: '18px',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div>⏱️ Hátralévő idő: {timeLeft} mp</div>
        <div>🏆 Pontszám: {score}</div>
      </div>

      {/* Maga a játék */}
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <TransferGuess
          leagueId={Number(leagueId)}
          season={2022}
          onScoreUpdate={setScore}
          onTimeUpdate={setTimeLeft}
        />
      </div>

      {/* Vissza gomb */}
      <button
        onClick={() => navigate('/leagues')}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          padding: '10px 16px',
          fontSize: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: '#fff',
          border: '1px solid #fff',
          borderRadius: '6px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        ⬅ Vissza
      </button>
    </div>
  );
};

export default TransferGuessWrapper;

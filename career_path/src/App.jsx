import { useState } from 'react';
import './App.css';
import TransferGuess from './components/TransferGuess';
import background from './assets/background1.png';

function App() {
  const [leagueId, setLeagueId] = useState(39);
  const [season, setSeason] = useState(2022);
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const leagues = [
    { id: 39, name: 'Premier League' },
    { id: 140, name: 'La Liga' },
    { id: 78, name: 'Bundesliga' },
    { id: 135, name: 'Serie A' },
    { id: 61, name: 'Ligue 1' },
    { id: 2, name: 'Champions League' },
  ];

const backgroundStyle = {
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '100vh',             // 🔒 fix magasság
  width: '100vw',              // 🔒 fix szélesség
  overflow: 'hidden',          // ⛔ semmilyen görgetés ne jelenjen meg
  position: 'relative',        // szükséges a status barhoz
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',        // középre igazít függőlegesen
  color: 'white',
  padding: 0,                  // ⛔ nincs felesleges belső tér
};


  return (
    <div style={backgroundStyle}>
      {/* ⏱️ 🏆 Státuszsáv */}
      <div className="status-bar"   style={{
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
  }}>
        <div>⏱️ Hátralévő idő: {remainingTime} mp</div>
        <div>🏆 Pontszám: {score}</div>
      </div>

      {/* Tartalom */}
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h1>Transfer Guess Game</h1>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="league">Válassz bajnokságot: </label>
          <select
            id="league"
            value={leagueId}
            onChange={(e) => setLeagueId(Number(e.target.value))}
            style={{ padding: '8px', fontSize: '16px' }}
          >
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>

        <TransferGuess
          leagueId={leagueId}
          season={season}
          onScoreUpdate={setScore}
          onTimeUpdate={setRemainingTime}
        />
      </div>
    </div>
  );
}

export default App;

// (többi import változatlan)
import { useEffect, useState } from 'react';
import { fetchTeams, fetchPlayersByTeam, fetchPlayerTransfers } from '../services/footballApi';

const TransferGuess = ({ leagueId, season, onScoreUpdate, onTimeUpdate }) => {
  const [player, setPlayer] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [canGuess, setCanGuess] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [knownPlayers, setKnownPlayers] = useState([]);
  const [pendingScoreUpdate, setPendingScoreUpdate] = useState(null); // ✅ új state
  const [allPlayers, setAllPlayers] = useState([]);


 useEffect(() => {
  const fetchAll = async () => {
    const data = await fetchTeams(leagueId, season);
    const allTeams = data.map(item => item.team);
    setTeams(allTeams);

    const all = [];

    for (const team of allTeams) {
      const players = await fetchPlayersByTeam(team.id);
      all.push(...players.map(p => p.player));
    }

    setAllPlayers(all);
  };

  fetchAll();
}, [leagueId, season]);


  const loadPlayer = async () => {
    setIsLoading(true);
    if (teams.length === 0) return;

    let tries = 0;
    let randomPlayer = null;
    let transferData = [];

    while (tries < 10) {
      const randomTeam = teams[Math.floor(Math.random() * teams.length)];
      const players = await fetchPlayersByTeam(randomTeam.id);

      if (players.length === 0) {
        tries++;
        continue;
      }

      const candidate = players[Math.floor(Math.random() * players.length)].player;
      const raw = await fetchPlayerTransfers(candidate.id);
      const data = raw[0]?.transfers || [];

      if (data.length > 0 && data.some(t => t.teams?.in?.logo)) {
        randomPlayer = candidate;
        transferData = data;
        break;
      }

      tries++;
    }

    if (randomPlayer) {
      setSuggestions([]);
      setPlayer(randomPlayer);
      setTransfers(transferData);
      setGuess('');
      setResult('');
      setTimeLeft(20);
      setCanGuess(true);

      setKnownPlayers(prev => {
        const alreadyKnown = prev.some(p => p.id === randomPlayer.id);
        return alreadyKnown ? prev : [...prev, randomPlayer];
      });
    } else {
      console.warn('⚠️ Nem találtunk játékost logóval.');
      setPlayer(null);
      setTransfers([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (teams.length > 0) loadPlayer();
  }, [teams]);

  useEffect(() => {
    if (!canGuess || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, canGuess]);

  useEffect(() => {
    if (onTimeUpdate) onTimeUpdate(timeLeft);
  }, [timeLeft, onTimeUpdate]);

  useEffect(() => {
    if (timeLeft === 0 && canGuess) {
      setResult(`⏰ Lejárt az idő! A helyes válasz: ${player?.name}`);
      setCanGuess(false);
    }
  }, [timeLeft, canGuess, player]);

  // ✅ új useEffect a biztonságos score frissítéshez
  useEffect(() => {
    if (pendingScoreUpdate !== null && onScoreUpdate) {
      onScoreUpdate(pendingScoreUpdate);
      setPendingScoreUpdate(null);
    }
  }, [pendingScoreUpdate, onScoreUpdate]);

const handleInputChange = (e) => {
  const value = e.target.value;
  setGuess(value);

  if (value.trim() === '') {
    setSuggestions([]);
    return;
  }

  const normalizedInput = normalizeText(value);

  const filtered = allPlayers.filter(player => {
    const parts = player.name
      .replace(/\./g, '')
      .split(' ')
      .filter(Boolean)
      .map(normalizeText);

    return parts.some(part => part.startsWith(normalizedInput));
  });

  setSuggestions(filtered.slice(0, 10)); // most már player objektumokat tárol
};



const normalizeText = (text) =>
  text
    .normalize("NFD") // szétbontja ékezetes karaktereket (é → e + ́ )
    .replace(/[\u0300-\u036f]/g, "") // törli az ékezeteket
    .toLowerCase()
    .trim();

const handleSubmit = (e) => {
  e.preventDefault();
  if (!canGuess || !player) return;

  const normalizedGuess = normalizeText(guess);
  const normalizedFullName = normalizeText(player.name);

  const nameParts = player.name
    .replace(/\./g, '')
    .split(' ')
    .filter(Boolean)
    .map(normalizeText);

  const isCorrect =
    normalizedGuess === normalizedFullName ||  // teljes név egyezés
    nameParts.some(part => part === normalizedGuess); // bármely névrész egyezés

  if (isCorrect) {
    const updated = score + 1;
    setResult('Helyes! 🎉');
    setScore(updated);
    setPendingScoreUpdate(updated);
    setCanGuess(false);
  } else {
    setResult(`Nem talált! 😢 A helyes válasz: ${player.name}`);
    setCanGuess(false);
  }
};


  if (isLoading) return <p>Betöltés...</p>;
  if (!player || transfers.length === 0) return <p>Nincs elérhető adat.</p>;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Kitalálod ki ez a játékos?</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[...transfers].reverse().map((transfer, index) => {
          const inTeam = transfer.teams?.in;
          if (!inTeam || !inTeam.logo) return null;

          return (
            <div key={index} style={{ textAlign: 'center' }}>
              <img src={inTeam.logo} alt={inTeam.name} style={{ width: '80px' }} />
              <p>{inTeam.name}</p>
            </div>
          );
        })}
      </div>

<form
  onSubmit={handleSubmit}
  style={{
    marginTop: '20px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  }}
>
  <input
    disabled={!canGuess}
    type="text"
    value={guess}
    onChange={handleInputChange}
    placeholder="Ide írd a tippedet..."
    style={{
      padding: '10px',
      fontSize: '16px',
      width: '300px'
    }}
  />

  {/* Autocomplete itt jön be alá */}
  {canGuess && suggestions.length > 0 && (
    <div
      style={{
        width: '300px',
        maxHeight: '80px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff',
        padding: '5px',
        color: '#000',
        textAlign: 'left',
        zIndex: 1000
      }}
    >
      {suggestions.map((player, index) => (
        <div
          key={index}
          onClick={() => {
            setGuess(player.name);

            setSuggestions([]);
          }}
          style={{
            cursor: 'pointer',
            padding: '6px 10px',
            borderBottom: '1px solid #eee'
          }}
        >
          {player.name}
        </div>
      ))}
    </div>
  )}

  <button
    type="submit"
    style={{
      padding: '10px 20px',
      fontSize: '16px'
    }}
  >
    Tipp
  </button>
</form>



{result && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}
  >
    <div
      style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '300px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      <h3 style={{ marginBottom: '20px', color: '#000' }}>{result}</h3>
      <button
        onClick={loadPlayer}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Következő játékos
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default TransferGuess;

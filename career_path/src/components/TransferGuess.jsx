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

  const loadTeams = async () => {
    const data = await fetchTeams(leagueId, season);
    setTeams(data.map(item => item.team));
  };

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
      setPlayer(randomPlayer);
      setTransfers(transferData);
      setGuess('');
      setResult('');
      setTimeLeft(20); // 🔄 idő belső state-ben
      setCanGuess(true);
    } else {
      console.warn('⚠️ Nem találtunk játékost logóval.');
      setPlayer(null);
      setTransfers([]);
    }

    setIsLoading(false);
  };

  // 📥 Frissítések betöltésekor
  useEffect(() => {
    loadTeams();
  }, [leagueId, season]);

  useEffect(() => {
    if (teams.length > 0) loadPlayer();
  }, [teams]);

  // ⏱️ időzítő visszaszámláló
  useEffect(() => {
    if (!canGuess || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, canGuess]);

  // ⏱️ ⬆️ idő frissítés App felé
  useEffect(() => {
    if (onTimeUpdate) onTimeUpdate(timeLeft);
  }, [timeLeft, onTimeUpdate]);

  // ⛔ idő lejáratakor
  useEffect(() => {
    if (timeLeft === 0 && canGuess) {
      setResult(`⏰ Lejárt az idő! A helyes válasz: ${player?.name}`);
      setCanGuess(false);
    }
  }, [timeLeft, canGuess, player]);

  // 🧠 Tipp ellenőrzése
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canGuess || !player) return;

    const playerLastName = player.name.split(' ').slice(-1)[0].toLowerCase();
    const userGuess = guess.trim().toLowerCase();

    if (userGuess === playerLastName) {
      setResult('Helyes! 🎉');
      setScore(prev => {
        const updated = prev + 1;
        if (onScoreUpdate) onScoreUpdate(updated); // ✅ App frissítése
        return updated;
      });
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

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input
          disabled={!canGuess}
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Ide írd a tippedet..."
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px' }}>
          Tipp
        </button>
      </form>

      {result && <h3 style={{ marginTop: '20px' }}>{result}</h3>}

      <button onClick={loadPlayer} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Következő játékos
      </button>
    </div>
  );
};

export default TransferGuess;

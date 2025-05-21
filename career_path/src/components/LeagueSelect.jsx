import { useNavigate } from 'react-router-dom';
import background from '../assets/background1.png';
import Logo from './Logo'; // ⬅️ Importáljuk a logót

const leagues = [
  { id: 39, name: 'Premier League' },
  { id: 140, name: 'La Liga' },
  { id: 78, name: 'Bundesliga' },
  { id: 135, name: 'Serie A' },
  { id: 61, name: 'Ligue 1' },
  { id: 2, name: 'Champions League' },
];

const LeagueSelect = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        padding: '20px',
        position: 'relative' // szükséges a logó pozicionálásához
      }}
    >
      <Logo /> {/* ⬅️ Logó megjelenítése fent középen */}

      <h2 style={{ fontSize: '32px', marginBottom: '40px', textShadow: '2px 2px 4px #000' }}>
        Válassz egy ligát
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          maxWidth: '300px',
        }}
      >
        {leagues.map((league) => (
          <button
            key={league.id}
            onClick={() => navigate(`/game/${league.id}`)}
            style={{
              padding: '14px 20px',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 123, 255, 0.85)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            }}
          >
            {league.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeagueSelect;

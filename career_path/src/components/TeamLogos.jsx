import { useEffect, useState } from 'react';
import { fetchTeams } from '../services/footballApi';

const TeamLogos = ({ leagueId, season }) => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const getTeams = async () => {
      const data = await fetchTeams(leagueId, season);
      console.log('API-Football teams:', data); // Debug log itt
      setTeams(data);
    };
    getTeams();
  }, [leagueId, season]);

  return (
    <div>
      <h2>Csapatok</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {teams.map((item) => (
          <div key={item.team.id} style={{ textAlign: 'center' }}>
            {item.team.logo && (
              <img src={item.team.logo} alt={item.team.name} style={{ width: '80px' }} />
            )}
            <p>{item.team.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamLogos;

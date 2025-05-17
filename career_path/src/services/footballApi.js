import { mockTransfers } from '../mocks/mockTransfers';

const MOCK_MODE = true;

const API_KEY = '8f5956c7c9f10a969d0376f7038ca496';

const headers = {
  'x-apisports-key': API_KEY
};

export const fetchTeams = async (leagueId = 39, season = 2023) => {
   if (MOCK_MODE) return [{ team: { id: 1, name: "Mock FC", logo: "https://media.api-sports.io/football/teams/50.png" } }];
  try {
    const response = await fetch(`https://v3.football.api-sports.io/teams?league=${leagueId}&season=${season}`, { headers });
    const data = await response.json();
     console.log('🔁 fetchTeams response:', data);
    return data.response;
  } catch (error) {
    console.error('Hiba a csapatok lekérésénél:', error);
    return [];
  }
};

export const fetchPlayersByTeam = async (teamId, season = 2023) => {
  if (MOCK_MODE) return mockTransfers.map(t => ({ player: t.player }));
  try {
    const response = await fetch(`https://v3.football.api-sports.io/players?team=${teamId}&season=${season}`, { headers });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Hiba a játékosok lekérésénél:', error);
    return [];
  }
};

export const fetchPlayerTransfers = async (playerId) => {
    if (MOCK_MODE) {
    const player = mockTransfers.find(p => p.player.id === playerId);
    return player ? [player] : [];
  }
  try {
    const response = await fetch(`https://v3.football.api-sports.io/transfers?player=${playerId}`, { headers });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Hiba az átigazolások lekérésénél:', error);
    return [];
  }
};
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import StartPage from './components/StartPage';
import LeagueSelect from './components/LeagueSelect';
import TransferGuessWrapper from './components/TransferGuessWrapper';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/leagues" element={<LeagueSelect />} />
      <Route path="/game/:leagueId" element={<TransferGuessWrapper />} />
    </Routes>
  );
}

export default App;

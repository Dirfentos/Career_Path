// src/components/StartPage.jsx
import { useNavigate } from 'react-router-dom';
import background from '../assets/background1.png';
import Logo from './Logo';

const StartPage = () => {
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
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
        position: 'relative'
      }}
    >
      <Logo large />
      <button
        onClick={() => navigate('/leagues')}
        style={{
          padding: '16px 32px',
          fontSize: '20px',
          borderRadius: '8px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          marginTop: '260px'
        }}
      >
        Start
      </button>
    </div>
  );
};

export default StartPage;

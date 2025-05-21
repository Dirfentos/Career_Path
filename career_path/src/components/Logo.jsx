import logo from '../assets/logo.png';

const Logo = ({ large = false }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          height: large ? '240px' : '140px', // 🔼 itt növeltük
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default Logo;

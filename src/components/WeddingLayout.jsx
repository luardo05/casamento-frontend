import React from 'react';

const WeddingLayout = ({ children }) => {
  return (
    <div style={styles.pageWrapper}>
      {/* --- Camada de Fundo (Partículas Douradas) --- */}
      <div style={styles.particlesContainer}>
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            style={{
              ...styles.particle,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2
            }} 
          />
        ))}
      </div>

      {/* --- Ornamentos Florais (Cantos) --- */}
      {/* Canto Superior Esquerdo */}
      <svg style={styles.cornerTL} width="150" height="150" viewBox="0 0 100 100" fill="none">
        <path d="M0 0 C 40 10, 60 40, 50 100 M0 0 C 10 40, 40 60, 100 50" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.4"/>
        <circle cx="0" cy="0" r="10" fill="#D4AF37" opacity="0.3" />
        <circle cx="45" cy="45" r="3" fill="#D4AF37" />
        <circle cx="70" cy="20" r="2" fill="#D4AF37" />
      </svg>

      {/* Canto Inferior Direito */}
      <svg style={styles.cornerBR} width="150" height="150" viewBox="0 0 100 100" fill="none">
        <path d="M100 100 C 60 90, 40 60, 50 0 M100 100 C 90 60, 60 40, 0 50" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.4"/>
        <circle cx="100" cy="100" r="10" fill="#D4AF37" opacity="0.3" />
        <circle cx="55" cy="55" r="3" fill="#D4AF37" />
        <circle cx="30" cy="80" r="2" fill="#D4AF37" />
      </svg>

      {/* --- Conteúdo da Página --- */}
      <div style={styles.content}>
        {children}
      </div>

      {/* --- Estilos Globais de Animação --- */}
      <style>{`
        @keyframes twinkle {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0.8; box-shadow: 0 0 10px #D4AF37; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        body { margin: 0; padding: 0; background-color: #fffaf0; }
        h1, h2 { font-family: 'Great Vibes', cursive; color: #8a6d3b; }
        p, button, input, div { font-family: 'Montserrat', sans-serif; }
      `}</style>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#fffaf0', // Creme suave
    position: 'relative',
    overflow: 'hidden'
  },
  particlesContainer: {
    position: 'fixed',
    top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none',
    zIndex: 0
  },
  particle: {
    position: 'absolute',
    width: '4px', height: '4px',
    backgroundColor: '#D4AF37', // Dourado
    borderRadius: '50%',
    animation: 'twinkle 3s infinite ease-in-out'
  },
  cornerTL: {
    position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none'
  },
  cornerBR: {
    position: 'fixed', bottom: 0, right: 0, zIndex: 0, pointerEvents: 'none'
  },
  content: {
    position: 'relative',
    zIndex: 1, // Garante que o texto fique acima do fundo
    padding: '20px'
  }
};

export default WeddingLayout;
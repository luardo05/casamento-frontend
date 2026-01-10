import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// IMPORTANTE: Importando a imagem aqui
// Certifique-se que o nome do arquivo na pasta assets é exatamente esse
import capaImagem from '../assets/capa.jpg'; 

function GuestRSVP() {
  const [name, setName] = useState('');
  const [plusOne, setPlusOne] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('guest_token');
      if (token) {
        try {
          await api.get('/guests/me');
          navigate('/presentes');
        } catch (error) {
          localStorage.removeItem('guest_token');
        }
      }
    };
    checkToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name) return alert("Por favor, digite seu nome.");
    
    setLoading(true);

    try {
      const response = await api.post('/guests/rsvp', {
        name,
        plusOne: plusOne || null 
      });

      localStorage.setItem('guest_token', response.data.token);
      alert('Presença confirmada! Vamos ver a lista de presentes.');
      navigate('/presentes');

    } catch (error) {
      console.error(error);
      alert('Erro ao confirmar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '400px', margin: '50px auto', padding: '20px',
      backgroundColor: 'white', borderRadius: '15px', // Arredondei mais as bordas
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center'
    },
    // Estilo novo para a imagem
    image: {
      width: '100%', 
      height: 'auto', // Altura fixa para não ficar gigante
      objectFit: 'cover', // Corta a imagem para caber sem esticar
      borderRadius: '10px',
      marginBottom: '20px'
    },
    input: {
      width: '100%', padding: '12px', marginBottom: '10px',
      borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box',
      fontSize: '16px'
    },
    button: {
      width: '100%', padding: '12px', backgroundColor: '#4CAF50',
      color: 'white', border: 'none', borderRadius: '8px',
      cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Aqui entra a imagem */}
      <img src={capaImagem} alt="Capa do Convite" style={styles.image} />

      <h1 style={{color: '#333', fontSize: '24px'}}>Bem-vindo ao Casamento! 💍</h1>
      <p style={{color: '#666', marginBottom: '20px'}}>
        Confirme sua presença para acessar a lista de presentes.
      </p>

      <form onSubmit={handleSubmit}>
        <input 
          style={styles.input}
          type="text" 
          placeholder="Seu nome completo " 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input 
          style={styles.input}
          type="text" 
          placeholder="Nome do acompanhante (Opcional)" 
          value={plusOne}
          onChange={(e) => setPlusOne(e.target.value)}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Confirmando...' : 'Confirmar Presença'}
        </button>
      </form>
    </div>
  );
}

export default GuestRSVP;
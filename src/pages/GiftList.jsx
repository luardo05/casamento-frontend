import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function GiftList() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadGifts = async () => {
    try {
      const response = await api.get('/gifts');
      setGifts(response.data);
    } catch (error) {
      alert('Erro ao carregar presentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('guest_token');
    if (!token) {
      navigate('/'); 
      return;
    }
    loadGifts();
  }, [navigate]);

  const handleSelectGift = async (giftId) => {
    if (!window.confirm("Confirmar a escolha deste presente?")) return;

    try {
      await api.post(`/gifts/${giftId}/select`);
      alert('Que incrível! Obrigado pelo presente! 🎁');
      loadGifts(); 
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao selecionar.';
      alert(msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('guest_token');
    navigate('/');
  };

  // --- LÓGICA DE ORDENAÇÃO ---
  // Cria uma cópia da lista e ordena conforme sua regra
  const sortedGifts = [...gifts].sort((a, b) => {
    // Calcula quantos restam para o presente A
    const aTaken = a.chosenBy ? a.chosenBy.length : 0;
    const aRemaining = a.maxQuantity - aTaken;
    const aIsAvailable = aRemaining > 0;

    // Calcula quantos restam para o presente B
    const bTaken = b.chosenBy ? b.chosenBy.length : 0;
    const bRemaining = b.maxQuantity - bTaken;
    const bIsAvailable = bRemaining > 0;

    // 1. Critério: Disponibilidade (Disponíveis vêm primeiro)
    if (aIsAvailable && !bIsAvailable) return -1; // A vem antes
    if (!aIsAvailable && bIsAvailable) return 1;  // B vem antes

    // 2. Critério: Ordem Alfabética (Desempate)
    return a.name.localeCompare(b.name);
  });

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
    image: { width: '100%', height: 'auto', objectFit: 'cover', backgroundColor: '#eee' },
    cardContent: { padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    title: { fontSize: '18px', margin: '0 0 10px 0', color: '#333' },
    info: { fontSize: '14px', color: '#666', marginBottom: '15px' },
    button: { width: '100%', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.3s' },
    logoutBtn: { padding: '8px 16px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Carregando presentes...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{margin: 0}}>Lista de Presentes 🎁</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
      </div>

      {sortedGifts.length === 0 ? (
        <p style={{textAlign: 'center'}}>Nenhum presente cadastrado ainda.</p>
      ) : (
        <div style={styles.grid}>
          {/* AQUI USAMOS O sortedGifts EM VEZ DE gifts */}
          {sortedGifts.map((gift) => {
            const totalTaken = gift.chosenBy ? gift.chosenBy.length : 0;
            const isFull = totalTaken >= gift.maxQuantity;
            const remaining = gift.maxQuantity - totalTaken;

            return (
              <div key={gift._id} style={{
                ...styles.card,
                opacity: isFull ? 0.6 : 1 // Deixa o card meio transparente se estiver esgotado
              }}>
                <img 
                  src={gift.imageUrl} 
                  alt={gift.name} 
                  style={{
                    ...styles.image,
                    filter: isFull ? 'grayscale(100%)' : 'none' // Foto preto e branco se esgotado
                  }}
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=Sem+Foto'}} 
                />

                <div style={styles.cardContent}>
                  <div>
                    <h3 style={styles.title}>{gift.name}</h3>
                    <p style={styles.info}>
                      {isFull 
                        ? <span style={{color: 'red', fontWeight: 'bold'}}>Esgotado</span>
                        : <span>Disponíveis: <strong>{remaining}</strong> de {gift.maxQuantity}</span>
                      }
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectGift(gift._id)}
                    disabled={isFull}
                    style={{
                      ...styles.button,
                      backgroundColor: isFull ? '#ccc' : '#4CAF50',
                      color: isFull ? '#666' : 'white',
                      cursor: isFull ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isFull ? 'Indisponível' : 'Presentear'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GiftList;
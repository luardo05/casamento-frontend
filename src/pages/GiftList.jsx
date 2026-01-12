import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';


import pixImage from '../assets/pix.png'; 

function GiftList() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- CONFIGURAÇÃO DO PIX ---
  const CHAVE_PIX = "71348895489"; 
  const NOME_BENEFICIARIO = "Hiago Rodrigo Silva Gomes"; 

  const loadGifts = async () => {
    try {
      const response = await api.get('/gifts');
      setGifts(response.data);
    } catch (error) {
      console.error(error);
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

  const handleCopyPix = () => {
    navigator.clipboard.writeText(CHAVE_PIX);
    alert("Chave Pix copiada para a área de transferência!");
  };

  const handleLogout = () => {
    localStorage.removeItem('guest_token');
    navigate('/');
  };

  // Lógica de ordenação (Disponíveis primeiro)
  const sortedGifts = [...gifts].sort((a, b) => {
    const aRemaining = a.maxQuantity - (a.chosenBy ? a.chosenBy.length : 0);
    const bRemaining = b.maxQuantity - (b.chosenBy ? b.chosenBy.length : 0);
    if ((aRemaining > 0) && !(bRemaining > 0)) return -1;
    if (!(aRemaining > 0) && (bRemaining > 0)) return 1;
    return a.name.localeCompare(b.name);
  });

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    logoutBtn: { padding: '8px 16px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    
    // Estilos do Card do Pix
    pixContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '40px',
      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)', // Sombra dourada
      border: '1px solid #D4AF37',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    pixTitle: { color: '#D4AF37', fontFamily: 'Great Vibes, cursive', fontSize: '32px', margin: '0 0 15px 0' },
    pixText: { color: '#555', marginBottom: '20px', maxWidth: '600px', lineHeight: '1.5' },
    qrCode: { width: '180px', height: '180px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #eee' },
    copyButton: {
      padding: '12px 25px', backgroundColor: '#D4AF37', color: 'white',
      border: 'none', borderRadius: '30px', cursor: 'pointer',
      fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },

    // Estilos da Grid (Mantidos)
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
    image: { width: '100%', height: '200px', objectFit: 'cover', backgroundColor: '#eee' },
    cardContent: { padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    title: { fontSize: '18px', margin: '0 0 10px 0', color: '#333' },
    info: { fontSize: '14px', color: '#666', marginBottom: '15px' },
    button: { width: '100%', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.3s' },
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Carregando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{margin: 0, fontFamily: 'Great Vibes, cursive', fontSize: '36px', color: '#D4AF37'}}>Lista de Presentes</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
      </div>

      {/* --- SEÇÃO DO PIX (NOVO) --- */}
      <div style={styles.pixContainer}>
        <h2 style={styles.pixTitle}>Contribuição via Pix</h2>
        <p style={styles.pixText}>
          Caso prefira, você pode contribuir com qualquer valor para nossa lua de mel através do Pix abaixo.
          Ficaremos muito felizes com seu carinho!
        </p>
        
        {/* Imagem do QR Code (Se der erro, mostra só o texto) */}
        <img src={pixImage} alt="QR Code Pix" style={styles.qrCode} onError={(e) => e.target.style.display='none'} />

        <div style={{marginBottom: '10px', fontWeight: 'bold', color: '#333'}}>
           Chave: {CHAVE_PIX} <br/>
           <span style={{fontSize: '12px', fontWeight: 'normal'}}>{NOME_BENEFICIARIO}</span>
        </div>

        <button onClick={handleCopyPix} style={styles.copyButton}>
          📋 Copiar Chave Pix
        </button>
      </div>

      <h3 style={{color: '#666', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>
        Ou escolha um item da lista:
      </h3>

      {sortedGifts.length === 0 ? (
        <p style={{textAlign: 'center'}}>Carregando itens...</p>
      ) : (
        <div style={styles.grid}>
          {sortedGifts.map((gift) => {
            const totalTaken = gift.chosenBy ? gift.chosenBy.length : 0;
            const isFull = totalTaken >= gift.maxQuantity;
            const remaining = gift.maxQuantity - totalTaken;

            return (
              <div key={gift._id} style={{...styles.card, opacity: isFull ? 0.6 : 1}}>
                <img 
                  src={gift.imageUrl} 
                  alt={gift.name} 
                  style={{...styles.image, filter: isFull ? 'grayscale(100%)' : 'none'}}
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=Sem+Foto'}} 
                />
                <div style={styles.cardContent}>
                  <div>
                    <h3 style={styles.title}>{gift.name}</h3>
                    <p style={styles.info}>
                      {isFull 
                        ? <span style={{color: 'red', fontWeight: 'bold'}}>Esgotado</span>
                        : <span>Disponíveis: <strong>{remaining}</strong></span>
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
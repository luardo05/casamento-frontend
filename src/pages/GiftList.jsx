import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import pixImage from '../assets/pix.png'; 

function GiftList() {
  const [gifts, setGifts] = useState([]);
  const [customGift, setCustomGift] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- CONFIGURE AQUI ---
  const CHAVE_PIX = "713.488.954-89"; 
  const NOME_BENEFICIARIO = "Hiago Rodrigo Silva Gomes";

  const loadGifts = async () => {
    try {
      const response = await api.get('/gifts');
      setGifts(response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    const token = localStorage.getItem('guest_token');
    if (!token) { navigate('/'); return; }
    loadGifts();
  }, [navigate]);

  const handleSelectGift = async (giftId) => {
    if (!window.confirm("Confirmar a escolha deste presente?")) return;
    try {
      await api.post(`/gifts/${giftId}/select`);
      alert('Que incrível! Obrigado pelo presente! 🎁');
      loadGifts(); 
    } catch (error) { alert(error.response?.data?.message || 'Erro.'); }
  };

  const handleSendCustom = async (e) => {
    e.preventDefault();
    if (!customGift.trim()) return;
    try {
      await api.post('/gifts/custom', { message: customGift });
      alert('Sua mensagem de presente foi enviada com sucesso! ❤️');
      setCustomGift('');
    } catch (error) { alert('Erro ao enviar.'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('guest_token');
    navigate('/');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(CHAVE_PIX);
    alert("Chave Pix copiada!");
  };

  // Separação das Listas
  const availableGifts = gifts.filter(g => (g.maxQuantity - (g.chosenBy?.length || 0)) > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const unavailableGifts = gifts.filter(g => (g.maxQuantity - (g.chosenBy?.length || 0)) <= 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    logoutBtn: { padding: '8px 16px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    
    // Estilos do Pix (Com o texto de volta)
    pixContainer: { backgroundColor: 'white', borderRadius: '15px', padding: '30px', marginBottom: '40px', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)', border: '1px solid #D4AF37', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    pixTitle: { color: '#D4AF37', fontFamily: 'Great Vibes, cursive', fontSize: '32px', margin: '0 0 15px 0' },
    pixText: { color: '#555', marginBottom: '20px', maxWidth: '600px', lineHeight: '1.5', fontSize: '16px' }, // Estilo do texto
    qrCode: { width: '160px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #eee' },
    copyButton: { padding: '10px 25px', backgroundColor: '#D4AF37', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '10px' },
    
    // Estilo Custom Gift
    customSection: { margin: '40px 0', padding: '30px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px dashed #D4AF37' },
    customInput: { width: '80%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '15px', fontSize: '16px' },
    customBtn: { padding: '12px 25px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px', fontWeight: 'bold' },

    sectionTitle: { color: '#555', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '40px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' },
    card: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
    image: { width: '100%', height: '200px', objectFit: 'cover' },
    cardContent: { padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    button: { width: '100%', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }
  };

  const renderCard = (gift, isFull) => (
    <div key={gift._id} style={{...styles.card, opacity: isFull ? 0.6 : 1}}>
      <img src={gift.imageUrl} alt={gift.name} style={{...styles.image, filter: isFull ? 'grayscale(100%)' : 'none'}} onError={(e)=>e.target.src='https://via.placeholder.com/300'} />
      <div style={styles.cardContent}>
        <div>
          <h3 style={{margin: '0 0 10px 0', fontSize: '18px'}}>{gift.name}</h3>
          <p style={{color: isFull ? 'red' : '#666'}}>
            {isFull ? <strong>Esgotado</strong> : `Disponíveis: ${gift.maxQuantity - (gift.chosenBy?.length || 0)}`}
          </p>
        </div>
        <button onClick={() => handleSelectGift(gift._id)} disabled={isFull}
          style={{...styles.button, backgroundColor: isFull ? '#ccc' : '#4CAF50', color: isFull ? '#666' : 'white', cursor: isFull ? 'not-allowed' : 'pointer'}}>
          {isFull ? 'Indisponível' : 'Presentear'}
        </button>
      </div>
    </div>
  );

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Carregando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{fontFamily: 'Great Vibes, cursive', fontSize: '36px', color: '#D4AF37', margin:0}}>Lista de Presentes</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
      </div>

      {/* --- SEÇÃO DO PIX COM O TEXTO DE VOLTA --- */}
      <div style={styles.pixContainer}>
        <h2 style={styles.pixTitle}>Contribuição via Pix</h2>
        
        {/* AQUI ESTÁ O TEXTO DE VOLTA */}
        <p style={styles.pixText}>
          Caso prefira, você pode contribuir com qualquer valor para nossa lua de mel através do Pix abaixo.
          Ficaremos muito felizes com seu carinho!
        </p>

        <img src={pixImage} alt="Pix" style={styles.qrCode} onError={(e) => e.target.style.display='none'} />
        
        <div style={{color: '#333'}}>
          <strong>Chave:</strong> {CHAVE_PIX} <br/>
          <span style={{fontSize: '13px'}}>{NOME_BENEFICIARIO}</span>
        </div>
        
        <button onClick={handleCopyPix} style={styles.copyButton}>📋 Copiar Chave Pix</button>
      </div>

      {/* 1. Lista de DISPONÍVEIS */}
      <h3 style={styles.sectionTitle}>🎁 Itens Disponíveis</h3>
      <div style={styles.grid}>
        {availableGifts.map(g => renderCard(g, false))}
        {availableGifts.length === 0 && <p>Todos os itens da lista principal já foram escolhidos!</p>}
      </div>

      {/* 2. ÁREA DE PRESENTE CUSTOMIZADO */}
      <div style={styles.customSection}>
        <h3 style={{color: '#D4AF37', margin: 0}}>Quer dar algo diferente?</h3>
        <p style={{color: '#666'}}>Se não encontrou o que queria ou deseja dar algo especial, escreva aqui:</p>
        <form onSubmit={handleSendCustom} style={{display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:'center'}}>
          <input 
            type="text" 
            placeholder="Ex: Um jogo de jantar, Um dia no Spa..." 
            value={customGift} 
            onChange={(e) => setCustomGift(e.target.value)} 
            style={styles.customInput} 
          />
          <button type="submit" style={styles.customBtn}>Enviar</button>
        </form>
      </div>

      {/* 3. Lista de INDISPONÍVEIS */}
      {unavailableGifts.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}>🔒 Itens Já Escolhidos</h3>
          <div style={styles.grid}>
            {unavailableGifts.map(g => renderCard(g, true))}
          </div>
        </>
      )}
    </div>
  );
}

export default GiftList;
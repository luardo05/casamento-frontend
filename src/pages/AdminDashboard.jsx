import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('guests');
  // data agora guardará { standard: [], custom: [] } quando estiver na aba gifts
  const [guestsData, setGuestsData] = useState([]);
  const [giftsData, setGiftsData] = useState({ standard: [], custom: [] });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'guests') {
          const res = await api.get('/admin/guests');
          setGuestsData(res.data || []);
        } else {
          // Agora o endpoint retorna { standard: [...], custom: [...] }
          const res = await api.get('/admin/gifts');
          setGiftsData(res.data);
        }
      } catch (error) {
        if (error.response?.status === 401) navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const renderGuestsTable = () => (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={{backgroundColor:'#f4f4f4'}}><th style={styles.th}>Nome</th><th style={styles.th}>Acompanhante</th></tr>
        </thead>
        <tbody>
          {guestsData.map(g => (
            <tr key={g._id} style={{borderBottom:'1px solid #eee'}}>
              <td style={styles.td}><strong>{g.name}</strong></td>
              <td style={styles.td}>{g.plusOne || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGiftsTable = () => (
    <div>
      {/* Tabela de Personalizados (NOVO) */}
      <h3 style={{color: '#D4AF37', marginTop: 0}}>✨ Presentes Personalizados (Escritos)</h3>
      <div style={{...styles.tableWrapper, marginBottom: '40px'}}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor:'#fff8e1'}}><th style={styles.th}>Quem enviou</th><th style={styles.th}>Mensagem do Presente</th></tr>
          </thead>
          <tbody>
            {giftsData.custom?.length === 0 && <tr><td colSpan="2" style={styles.td}>Nenhum presente personalizado ainda.</td></tr>}
            {giftsData.custom?.map(c => (
              <tr key={c._id} style={{borderBottom:'1px solid #eee'}}>
                <td style={styles.td}><strong>{c.guestName}</strong></td>
                <td style={styles.td}>{c.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabela de Itens da Lista */}
      <h3 style={{color: '#333'}}>🎁 Itens da Lista</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor:'#f4f4f4'}}><th style={styles.th}>Presente</th><th style={styles.th}>Quem vai dar</th></tr>
          </thead>
          <tbody>
            {giftsData.standard?.map(g => (
              <tr key={g._id} style={{borderBottom:'1px solid #eee'}}>
                <td style={styles.td}>
                   <div style={{fontWeight:'bold'}}>{g.name}</div>
                   <div style={{fontSize:'12px', color: (g.chosenBy?.length >= g.maxQuantity ? 'red' : 'green')}}>
                     {(g.chosenBy?.length >= g.maxQuantity ? 'Esgotado' : 'Disponível')}
                   </div>
                </td>
                <td style={styles.td}>
                  {g.chosenBy?.map((p, i) => (
                    <div key={i} style={styles.tag}>🎁 {p.guestName}</div>
                  ))}
                  {(!g.chosenBy || g.chosenBy.length === 0) && <span style={{color:'#999', fontStyle:'italic'}}>-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const styles = {
    container: { width: '95%', maxWidth: '1100px', margin: '0 auto', padding: '20px 0' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' },
    tableWrapper: { width: '100%', overflowX: 'auto', borderRadius: '8px', border: '1px solid #eee', backgroundColor: 'white' },
    table: { width: '100%', minWidth: '600px', borderCollapse: 'collapse' },
    th: { padding: '12px', textAlign: 'left', fontSize: '14px', color: '#555' },
    td: { padding: '12px', textAlign: 'left', fontSize: '14px', verticalAlign: 'top' },
    tag: { backgroundColor: '#f8f9fa', border: '1px solid #ddd', padding: '5px 10px', borderRadius: '15px', display: 'inline-block', margin: '2px', fontSize: '12px' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '20px', padding: '0 10px' },
    tabButton: (isActive) => ({ padding: '8px 20px', backgroundColor: isActive ? '#333' : '#eee', color: isActive ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: isActive?'bold':'normal' }),
    logoutBtn: { padding: '8px 15px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{fontSize:'22px', margin:0}}>Painel do Noivo 🤵</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
      </div>
      <div style={styles.tabs}>
        <button style={styles.tabButton(activeTab==='guests')} onClick={()=>setActiveTab('guests')}>Convidados</button>
        <button style={styles.tabButton(activeTab==='gifts')} onClick={()=>setActiveTab('gifts')}>Presentes</button>
      </div>
      {loading ? <p style={{textAlign:'center'}}>Carregando...</p> : (activeTab==='guests' ? renderGuestsTable() : renderGiftsTable())}
    </div>
  );
}

export default AdminDashboard;
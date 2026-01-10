import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('guests'); 
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === 'guests' ? '/admin/guests' : '/admin/gifts';
        const response = await api.get(endpoint);
        setData(response.data || []);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/admin');
        }
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

  // --- Tabela de Convidados ---
  const renderGuestsTable = () => (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={{backgroundColor: '#f4f4f4'}}>
            <th style={styles.th}>Nome</th>
            <th style={styles.th}>Acompanhante</th>
            <th style={styles.th}>Data</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
             <tr><td colSpan="3" style={styles.td}>Nenhum convidado.</td></tr>
          )}
          {data.map((guest) => (
            <tr key={guest._id || Math.random()} style={{borderBottom: '1px solid #eee'}}>
              <td style={styles.td}><strong>{guest.name}</strong></td>
              <td style={styles.td}>{guest.plusOne || '-'}</td>
              <td style={styles.td}>
                {guest.confirmedAt ? new Date(guest.confirmedAt).toLocaleDateString() : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // --- Tabela de Presentes ---
  const renderGiftsTable = () => (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={{backgroundColor: '#f4f4f4'}}>
            <th style={{...styles.th, width: '60px'}}>Item</th>
            <th style={{...styles.th, minWidth: '120px'}}>Presente</th>
            <th style={{...styles.th, minWidth: '100px'}}>Status</th>
            <th style={{...styles.th, minWidth: '180px'}}>Quem vai dar?</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
             <tr><td colSpan="4" style={styles.td}>Nenhum presente.</td></tr>
          )}
          {data.map((gift) => {
            const chosenBy = gift.chosenBy || [];
            const totalTaken = chosenBy.length;
            const isFull = totalTaken >= (gift.maxQuantity || 1);
            
            return (
              <tr key={gift._id || Math.random()} style={{borderBottom: '1px solid #eee'}}>
                <td style={styles.td}>
                  {gift.imageUrl ? (
                    <img 
                      src={gift.imageUrl} 
                      alt="" 
                      style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px'}}
                      onError={(e) => {e.target.style.display = 'none'}}
                    />
                  ) : '-'}
                </td>
                <td style={{...styles.td, verticalAlign: 'middle'}}>
                  <div style={{fontWeight: 'bold', color: '#333'}}>{gift.name}</div>
                </td>
                <td style={{...styles.td, verticalAlign: 'middle'}}>
                  {isFull 
                    ? <span style={{backgroundColor: '#ffebee', color: '#c62828', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap'}}>Esgotado</span> 
                    : <span style={{backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap'}}>{(gift.maxQuantity || 1) - totalTaken} livre(s)</span>
                  }
                </td>
                <td style={styles.td}>
                  {chosenBy.length === 0 ? (
                    <span style={{color: '#999', fontSize: '13px', fontStyle: 'italic'}}>—</span>
                  ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                      {chosenBy.map((person, index) => (
                        <div key={index} style={{
                          backgroundColor: '#f8f9fa', border: '1px solid #e9ecef',
                          padding: '8px', borderRadius: '6px', fontSize: '13px',
                          display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                          <span>🎁</span>
                          <div>
                            <strong>{person.guestName}</strong>
                            {person.plusOneName && <span style={{color: '#666'}}> +1</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const styles = {
    // Container ajustado para Mobile (ocupa mais largura e tem menos padding)
    container: { 
      width: '95%', 
      maxWidth: '1100px', 
      margin: '0 auto', 
      padding: '20px 0' // Zero padding lateral para aproveitar a tela do celular
    },
    header: { 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: '20px', padding: '0 10px' // Padding só no header
    },
    title: { fontSize: '22px', color: '#2c3e50', margin: 0 },
    logoutBtn: { 
      padding: '8px 15px', backgroundColor: '#d9534f', color: 'white', 
      border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' 
    },
    tabs: { 
      display: 'flex', gap: '10px', marginBottom: '20px', 
      borderBottom: '1px solid #ddd', padding: '0 10px 10px 10px',
      overflowX: 'auto' // Permite rolar as abas se a tela for muito pequena
    },
    tabButton: (isActive) => ({
      padding: '8px 20px',
      backgroundColor: isActive ? '#333' : 'transparent',
      color: isActive ? 'white' : '#666',
      border: isActive ? 'none' : '1px solid transparent',
      borderRadius: '20px', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap',
      fontWeight: isActive ? 'bold' : 'normal', transition: '0.3s'
    }),
    
    // NOVO: Wrapper que permite a tabela rolar lateralmente sem quebrar o site
    tableWrapper: {
      width: '100%',
      overflowX: 'auto', // O segredo está aqui
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      borderRadius: '8px',
      backgroundColor: 'white',
      border: '1px solid #eee'
    },
    table: { 
      width: '100%', 
      minWidth: '600px', // Força a tabela a ter um tamanho mínimo (ativa a rolagem no celular)
      borderCollapse: 'separate', borderSpacing: '0' 
    },
    th: { 
      padding: '12px 15px', textAlign: 'left', color: '#555', 
      fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px',
      whiteSpace: 'nowrap' // Impede que o cabeçalho quebre linha feio
    },
    td: { 
      padding: '12px 15px', textAlign: 'left', verticalAlign: 'top', 
      color: '#444', fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Painel do Noivo 🤵</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tabButton(activeTab === 'guests')} onClick={() => setActiveTab('guests')}>
          Convidados
        </button>
        <button style={styles.tabButton(activeTab === 'gifts')} onClick={() => setActiveTab('gifts')}>
          Presentes
        </button>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '50px', color: '#666'}}>Carregando...</div>
      ) : (
        activeTab === 'guests' ? renderGuestsTable() : renderGiftsTable()
      )}
    </div>
  );
}

export default AdminDashboard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('guests');
  const [guestsData, setGuestsData] = useState([]);
  const [giftsData, setGiftsData] = useState({ standard: [], custom: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para carregar dados
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'guests') {
        const res = await api.get('/admin/guests');
        setGuestsData(res.data || []);
      } else {
        const res = await api.get('/admin/gifts');
        setGiftsData(res.data);
      }
    } catch (error) {
      if (error.response?.status === 401) navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const handleDeleteGuest = async (id, name) => {
    if (!window.confirm(`Tem certeza que deseja remover "${name}"?\nO presente escolhido por ele voltará a ficar disponível.`)) return;

    try {
      await api.delete(`/admin/guests/${id}`);
      alert('Convidado removido!');
      fetchData(); // Recarrega a lista
    } catch (error) {
      alert('Erro ao deletar.');
    }
  };

  const handleResetSystem = async () => {
    const confirm1 = window.confirm("⚠️ PERIGO: Isso vai apagar TODOS os convidados e zerar a contagem de presentes.\n\nIsso é útil para limpar testes.\n\nDeseja continuar?");
    if (!confirm1) return;
    
    const confirm2 = window.confirm("Tem certeza absoluta? Essa ação não pode ser desfeita.");
    if (!confirm2) return;

    try {
      await api.delete('/admin/reset');
      alert('Sistema limpo com sucesso! Pronto para uso oficial.');
      fetchData();
    } catch (error) {
      alert('Erro ao resetar.');
    }
  };

  const renderGuestsTable = () => (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={{backgroundColor:'#f4f4f4'}}>
            <th style={styles.th}>Nome</th>
            <th style={styles.th}>Acompanhante</th>
            <th style={styles.th}>Ações</th> {/* Nova Coluna */}
          </tr>
        </thead>
        <tbody>
          {guestsData.length === 0 && <tr><td colSpan="3" style={styles.td}>Nenhum convidado.</td></tr>}
          {guestsData.map(g => (
            <tr key={g._id} style={{borderBottom:'1px solid #eee'}}>
              <td style={styles.td}><strong>{g.name}</strong></td>
              <td style={styles.td}>{g.plusOne || '-'}</td>
              <td style={styles.td}>
                <button 
                  onClick={() => handleDeleteGuest(g._id, g.name)}
                  style={styles.deleteBtn}
                  title="Remover convidado e liberar presente"
                >
                  🗑️ Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGiftsTable = () => (
    <div>
      <h3 style={{color: '#D4AF37', marginTop: 0}}>✨ Presentes Personalizados (Escritos)</h3>
      <div style={{...styles.tableWrapper, marginBottom: '40px'}}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor:'#fff8e1'}}><th style={styles.th}>Quem enviou</th><th style={styles.th}>Mensagem</th></tr>
          </thead>
          <tbody>
            {giftsData.custom?.length === 0 && <tr><td colSpan="2" style={styles.td}>Nenhum presente personalizado.</td></tr>}
            {giftsData.custom?.map(c => (
              <tr key={c._id} style={{borderBottom:'1px solid #eee'}}>
                <td style={styles.td}><strong>{c.guestName}</strong></td>
                <td style={styles.td}>{c.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                     {(g.chosenBy?.length >= g.maxQuantity ? 'Esgotado' : `Disponível (${g.maxQuantity - (g.chosenBy?.length||0)})`)}
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
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px', flexWrap: 'wrap', gap: '10px' },
    tableWrapper: { width: '100%', overflowX: 'auto', borderRadius: '8px', border: '1px solid #eee', backgroundColor: 'white' },
    table: { width: '100%', minWidth: '600px', borderCollapse: 'collapse' },
    th: { padding: '12px', textAlign: 'left', fontSize: '14px', color: '#555' },
    td: { padding: '12px', textAlign: 'left', fontSize: '14px', verticalAlign: 'middle' },
    tag: { backgroundColor: '#f8f9fa', border: '1px solid #ddd', padding: '5px 10px', borderRadius: '15px', display: 'inline-block', margin: '2px', fontSize: '12px' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '20px', padding: '0 10px' },
    tabButton: (isActive) => ({ padding: '8px 20px', backgroundColor: isActive ? '#333' : '#eee', color: isActive ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: isActive?'bold':'normal' }),
    
    // Botões de Ação
    logoutBtn: { padding: '8px 15px', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    resetBtn: { padding: '8px 15px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    deleteBtn: { padding: '5px 10px', backgroundColor: '#fff0f0', color: '#d9534f', border: '1px solid #ffcccc', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{fontSize:'22px', margin:0}}>Painel do Noivo 🤵</h1>
        <div style={{display:'flex', gap:'10px'}}>
           {/* Botão de Resetar Tudo */}
           <button onClick={handleResetSystem} style={styles.resetBtn}>⚠️ Limpar Tudo</button>
           <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
        </div>
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
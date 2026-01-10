import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/admin/login', {
        username,
        password
      });

      // Salva o token ESPECÍFICO de admin
      localStorage.setItem('admin_token', response.data.token);
      
      // Redireciona para o painel
      navigate('/admin/dashboard');

    } catch (error) {
      alert('Login falhou: Verifique usuário e senha.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '400px', margin: '100px auto', padding: '30px',
      backgroundColor: 'white', borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center'
    },
    input: {
      width: '100%', padding: '12px', marginBottom: '15px',
      borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box'
    },
    button: {
      width: '100%', padding: '12px', backgroundColor: '#333',
      color: 'white', border: 'none', borderRadius: '5px',
      cursor: 'pointer', fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <h2>Área dos Noivos 🎩</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Usuário" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
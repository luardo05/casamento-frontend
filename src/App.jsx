import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importação das Páginas
import GuestRSVP from './pages/GuestRSVP';
import GiftList from './pages/GiftList';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// 1. A importação (Se estiver cinza, é porque falta o passo 2 abaixo)
import WeddingLayout from './components/WeddingLayout';

function App() {
  return (
    <Router>
      {/* 2. O Layout DEVE começar aqui... */}
      <WeddingLayout>
        
        {/* ...para envolver todo o conteúdo das rotas */}
        <Routes>
          {/* Rotas dos Convidados */}
          <Route path="/" element={<GuestRSVP />} />
          <Route path="/presentes" element={<GiftList />} />

          {/* Rotas do Noivo */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>

      {/* 3. ...e terminar aqui */}
      </WeddingLayout>
    </Router>
  );
}

export default App;
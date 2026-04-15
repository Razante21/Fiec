import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import api from './services/api';

import Layout from './components/Layout';
import Login from './pages/Login';
import AdminPainel from './pages/AdminPainel';
import Turmas from './pages/Turmas';
import TurmaAulas from './pages/TurmaAulas';
import Aluno from './pages/Aluno';
import CreateProfessor from './pages/CreateProfessor';
import CreateTurma from './pages/CreateTurma';
import CadastrarAula from './pages/CadastrarAula';
import EditarAula from './pages/EditarAula';
import Excluir from './pages/Excluir';
import ExcluirAdmin from './pages/ExcluirAdmin';
import AcessoNegado from './pages/AcessoNegado';
import Home from './pages/Home';

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(data => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="text-[#E8EFF7]">Carregando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={getDashboard(user.nivel)} /> : <Login />} />
        
        <Route path="/admin" element={requireAuth(user, 'administrador') ? <Layout><AdminPainel /></Layout> : <Navigate to="/login" replace />} />
        <Route path="/admin/criar-professor" element={requireAuth(user, 'administrador') ? <Layout><CreateProfessor /></Layout> : <Navigate to="/login" replace />} />
        <Route path="/admin/criar-turma" element={requireAuth(user, 'administrador') ? <Layout><CreateTurma /></Layout> : <Navigate to="/login" replace />} />
        <Route path="/admin/excluir/:tipo/:id" element={requireAuth(user, 'administrador') ? <Layout><ExcluirAdmin /></Layout> : <Navigate to="/login" replace />} />
        
        <Route path="/turmas" element={requireAuth(user, 'professor') ? <Layout><Turmas /></Layout> : <Navigate to={getRedirect(user)} />} />
        <Route path="/turma/:id" element={requireAuth(user, 'professor') ? <Layout><TurmaAulas /></Layout> : <Navigate to={getRedirect(user)} />} />
        <Route path="/turma/:id/cadastrar-aula" element={requireAuth(user, 'professor') ? <Layout><CadastrarAula /></Layout> : <Navigate to={getRedirect(user)} />} />
        <Route path="/turma/:turmaId/editar-aula/:aulaId" element={requireAuth(user, 'professor') ? <Layout><EditarAula /></Layout> : <Navigate to={getRedirect(user)} />} />
        <Route path="/turma/:turmaId/excluir-aula/:aulaId" element={requireAuth(user, 'professor') ? <Layout><Excluir /></Layout> : <Navigate to={getRedirect(user)} />} />
        
        <Route path="/aluno" element={requireAuth(user, 'aluno') ? <Layout><Aluno /></Layout> : <Navigate to={getRedirect(user)} />} />
        
        <Route path="/acesso-negado" element={<AcessoNegado />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}

function requireAuth(user, nivel) {
  return user && user.nivel === nivel;
}

function getDashboard(nivel) {
  switch (nivel) {
    case 'administrador': return '/admin';
    case 'professor': return '/turmas';
    case 'aluno': return '/aluno';
    default: return '/login';
  }
}

function getRedirect(user) {
  if (!user) return '/login';
  return getDashboard(user.nivel);
}

export default App;
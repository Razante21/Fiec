import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function AdminPainel() {
  const [professores, setProfessores] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profData, turmasData] = await Promise.all([
        api.get('/users/professores'),
        api.get('/users/turmas')
      ]);
      setProfessores(profData);
      setTurmas(turmasData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8DA4BF] mb-1">Administração</p>
        <h1 className="text-3xl font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Painel do Administrador</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm text-green-400">{success}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link to="/admin/criar-professor"
           className="btn-shine bg-[#111827] border border-[#1F2C42] hover:border-blue-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 group">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="#60A5FA" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-[#E8EFF7] group-hover:text-blue-400 transition-colors" style={{ fontFamily: "'Syne',sans-serif" }}>Criar Professor / Estagiário</p>
            <p className="text-xs text-[#8DA4BF] mt-0.5">Adicionar novo professor ou estagiário ao sistema</p>
          </div>
        </Link>

        <Link to="/admin/criar-turma"
           className="btn-shine bg-[#111827] border border-[#1F2C42] hover:border-green-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 group">
          <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="#4ADE80" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-[#E8EFF7] group-hover:text-green-400 transition-colors" style={{ fontFamily: "'Syne',sans-serif" }}>Criar Turma</p>
            <p className="text-xs text-[#8DA4BF] mt-0.5">Adicionar nova turma ao sistema</p>
          </div>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-[#1F2C42] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="#60A5FA" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h2 className="font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Professores</h2>
          </div>
          <div className="space-y-2">
            {professores.map((prof) => (
              <div key={prof.id} className="item-card flex justify-between items-center bg-[#0B0F1A] border border-[#1F2C42] hover:border-blue-500/20 p-3 rounded-xl transition-all duration-150">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-[#E8EFF7] font-medium">{prof.nome}</span>
                </div>
                <Link to={`/admin/excluir/professor/${prof.id}`}
                   className="text-xs font-semibold px-3 py-1.5 rounded-lg text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all duration-150">
                  Excluir
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F2C42] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="#4ADE80" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h2 className="font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Turmas</h2>
          </div>
          <div className="space-y-2">
            {turmas.map((turma) => (
              <div key={turma.id} className="item-card flex justify-between items-center bg-[#0B0F1A] border border-[#1F2C42] hover:border-blue-500/20 p-3 rounded-xl transition-all duration-150">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-[#E8EFF7] font-medium">{turma.nome}</span>
                </div>
                <Link to={`/admin/excluir/turma/${turma.id}`}
                   className="text-xs font-semibold px-3 py-1.5 rounded-lg text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all duration-150">
                  Excluir
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPainel;
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function ExcluirAdmin() {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (tipo === 'professor') {
        await api.delete(`/users/professor/${id}`);
      } else if (tipo === 'turma') {
        await api.delete(`/users/turma/${id}`);
      }
      setSuccess(`${tipo} excluído com sucesso!`);
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0F1A] text-[#E8EFF7] min-h-screen flex items-center justify-center p-6">
      <div className="bg-glow"></div>
      <div className="fixed bottom-0 left-0 w-72 h-72 opacity-[0.04] pointer-events-none z-0"
           style={{ backgroundImage: 'radial-gradient(circle, #EF4444 1px, transparent 1px)', backgroundSize: '22px 22px' }}></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#111827] border border-[#1F2C42] rounded-2xl p-8 text-center"
             style={{ boxShadow: '0 0 60px rgba(239,68,68,0.06)' }}>

          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#E8EFF7] mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Confirmar Exclusão</h1>
          <p className="text-sm text-[#8DA4BF] mb-1">Tem certeza que deseja excluir este(a) <strong className="text-[#E8EFF7]">{tipo}</strong>?</p>
          <p className="text-sm text-red-400 font-semibold mb-7">Essa ação não pode ser desfeita.</p>

          {success && (
            <div className="mb-4 rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => navigate(-1)}
              className="w-full py-3 rounded-xl bg-[#1F2C42] hover:bg-[#2A3A52] text-sm font-semibold transition-all duration-200"
              style={{ fontFamily: "'Syne',sans-serif" }}>
              Cancelar
            </button>
            <button onClick={handleDelete} disabled={loading}
              className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-all duration-200 active:scale-95 disabled:opacity-50"
              style={{ fontFamily: "'Syne',sans-serif" }}>
              {loading ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/admin" className="text-xs text-[#3A4F6A] hover:text-[#8DA4BF] transition-colors">
            ← Voltar ao painel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ExcluirAdmin;
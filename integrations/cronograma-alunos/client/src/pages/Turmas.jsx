import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTurmas();
  }, []);

  const loadTurmas = async () => {
    try {
      const data = await api.get('/turmas');
      setTurmas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-[#8DA4BF]">Carregando...</div>;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8DA4BF] mb-1">Área do professor</p>
        <h1 className="text-3xl font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Minhas Turmas</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {turmas.map((turma) => (
          <Link key={turma.id} to={`/turma/${turma.id}`}
             className="turma-card block p-5 rounded-2xl border border-[#1F2C42] bg-[#111827] hover:border-blue-500/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#8DA4BF] mb-1">Turma</p>
                <h2 className="text-lg font-bold text-[#E8EFF7] hover:text-blue-400 transition-colors" style={{ fontFamily: "'Syne',sans-serif" }}>
                  {turma.turma}
                </h2>
                <p className="text-sm text-[#8DA4BF] mt-1">
                  {turma.descricao}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Turmas;
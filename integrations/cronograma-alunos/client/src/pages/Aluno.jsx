import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function formatDate(dateStr) {
  if (!dateStr || dateStr === '0000-00-00') return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function Aluno() {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAulas();
  }, []);

  const loadAulas = async () => {
    try {
      const data = await api.get('/aulas/aluno');
      setAulas(data);
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
        <p className="text-xs uppercase tracking-widest text-[#8DA4BF] mb-1">Área do aluno</p>
        <h1 className="text-3xl font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Minhas Aulas</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {aulas.map((aula) => (
          <div key={aula.id} className="aula-card p-5 rounded-2xl border border-[#1F2C42] bg-[#111827] hover:border-blue-500/30 transition-all duration-200">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-base font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>
                {aula.titulo}
              </h2>
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold shrink-0" style={{ backgroundColor: 'rgba(209,125,43,0.15)', color: 'rgb(209,125,43)', border: '1px solid rgba(209,125,43,0.3)' }}>
                {aula.tipo}
              </span>
            </div>

            <p className="text-sm text-[#8DA4BF] mb-3 leading-relaxed">
              {aula.descricao}
            </p>

            <p className="text-xs text-[#3A4F6A] mb-4">
              📅 {formatDate(aula.data)}
            </p>

            <div className="flex flex-wrap gap-2">
              {aula.liberarExe === 'sim' && aula.exercicio && (
                <a href={aula.exercicio} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600/80 hover:bg-green-600 border border-green-500/30 transition-all duration-200">
                  📝 Exercício
                </a>
              )}
              {aula.liberarSli === 'sim' && aula.slide && (
                <a href={aula.slide} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600/80 hover:bg-blue-600 border border-blue-500/30 transition-all duration-200">
                  📊 Slide
                </a>
              )}
              {aula.liberarCorr === 'sim' && aula.correcao && (
                <a href={aula.correcao} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600/80 hover:bg-red-600 border border-red-500/30 transition-all duration-200">
                  ✏️ Correção
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Aluno;
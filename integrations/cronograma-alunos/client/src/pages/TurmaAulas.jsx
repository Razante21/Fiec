import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function formatDate(dateStr) {
  if (!dateStr || dateStr === '0000-00-00') return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function TurmaAulas() {
  const { id } = useParams();
  const [turma, setTurma] = useState(null);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [turmaData, aulasData] = await Promise.all([
        api.get(`/turmas/${id}`),
        api.get(`/aulas/turma/${id}`)
      ]);
      setTurma(turmaData);
      setAulas(aulasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-[#8DA4BF]">Carregando...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8DA4BF] mb-1">Professor</p>
          <h1 className="text-3xl font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>
            {turma?.turma} — {turma?.descricao}
          </h1>
        </div>
        <Link to={`/turma/${id}/cadastrar-aula`}
           className="btn-shine inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 whitespace-nowrap"
           style={{ fontFamily: "'Syne',sans-serif" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nova Aula
        </Link>
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
              <div className="flex-1">
                <h2 className="text-base font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>
                  {aula.titulo}
                </h2>
                <p className="text-sm text-[#8DA4BF] mt-1 leading-relaxed">
                  {aula.descricao}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${aula.status === 'ativa' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {aula.status === 'ativa' ? 'Ativa' : 'Inativa'}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-[#3A4F6A]">📅 {formatDate(aula.data)}</span>
              <span className="text-[#1F2C42]">•</span>
              <span className="text-xs text-[#3A4F6A]">Ordem: {aula.ordem}</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ backgroundColor: 'rgba(209,125,43,0.15)', color: 'rgb(209,125,43)', border: '1px solid rgba(209,125,43,0.3)' }}>
                {aula.tipo}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#1F2C42]">
              <div className="flex flex-wrap gap-2">
                {aula.liberarExe === 'sim' && aula.exercicio && (
                  <a href={aula.exercicio} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600/80 hover:bg-green-600 border border-green-500/30 transition-all duration-200">
                    📝 Exercício
                  </a>
                )}
                {aula.liberarSli === 'sim' && aula.slide && (
                  <a href={aula.slide} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600/80 hover:bg-blue-600 border border-blue-500/30 transition-all duration-200">
                    📊 Slide
                  </a>
                )}
                {aula.liberarCorr === 'sim' && aula.correcao && (
                  <a href={aula.correcao} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600/80 hover:bg-red-600 border border-red-500/30 transition-all duration-200">
                    ✏️ Correção
                  </a>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <Link to={`/turma/${id}/editar-aula/${aula.id}`}
                   className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-yellow-500/80 hover:bg-yellow-500 border border-yellow-500/30 transition-all duration-200">
                  ✏️ Editar
                </Link>
                <Link to={`/turma/${id}/excluir-aula/${aula.id}`}
                   className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 border border-red-500/30 transition-all duration-200">
                  🗑️ Excluir
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TurmaAulas;
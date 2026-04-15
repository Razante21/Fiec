import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function EditarAula() {
  const { turmaId, aulaId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data: '',
    tipo: '',
    ordem: '',
    status: 'ativa',
    exercicio: '',
    slide: '',
    correcao: '',
    liberarExe: '',
    liberarSli: '',
    liberarCorr: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAula();
  }, [aulaId]);

  const loadAula = async () => {
    try {
      const data = await api.get(`/aulas/${aulaId}`);
      setFormData({
        titulo: data.titulo || '',
        descricao: data.descricao || '',
        data: data.data || '',
        tipo: data.tipo || '',
        ordem: data.ordem || '',
        status: data.status || 'ativa',
        exercicio: data.exercicio || '',
        slide: data.slide || '',
        correcao: data.correcao || '',
        liberarExe: data.liberarExe || '',
        liberarSli: data.liberarSli || '',
        liberarcorr: data.liberarCorr || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    setLoading(true);
    try {
      await api.put(`/aulas/${aulaId}`, formData);
      setSuccess('Salvo com sucesso!');
      setTimeout(() => navigate(`/turma/${turmaId}`), 2000);
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
        <p className="text-xs uppercase tracking-widest text-[#8DA4BF] mb-1">Professor</p>
        <h1 className="text-3xl font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Editar Aula</h1>
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

      <div className="bg-[#111827] border border-[#1F2C42] rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Título</label>
            <input name="titulo" type="text" value={formData.titulo} onChange={handleChange} required className="field-input" placeholder="Título da aula" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Descrição</label>
            <textarea name="descricao" value={formData.descricao} onChange={handleChange} required className="field-input" rows="3" placeholder="Descrição da aula"></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Data</label>
              <input name="data" type="date" value={formData.data} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Tipo</label>
              <input name="tipo" type="text" value={formData.tipo} onChange={handleChange} required className="field-input" placeholder="Ex: Excel" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Ordem</label>
              <input name="ordem" type="number" step="0.1" value={formData.ordem} onChange={handleChange} required className="field-input" placeholder="1.0" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Status da Aula</label>
            <select name="status" value={formData.status} onChange={handleChange} className="field-input">
              <option value="ativa">Ativa</option>
              <option value="inativa">Inativa</option>
            </select>
          </div>

          <div className="border-t border-[#1F2C42] pt-5">
            <p className="text-xs uppercase tracking-widest text-[#8DA4BF] mb-4">Materiais</p>

            <div className="bg-[#0B0F1A] border border-[#1F2C42] rounded-xl p-4 mb-3">
              <label className="block text-sm font-semibold text-green-400 mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>📝 Exercício</label>
              <input name="exercicio" type="url" value={formData.exercicio} onChange={handleChange} className="field-input mb-2" placeholder="https://" />
              <select name="liberarExe" value={formData.liberarExe} onChange={handleChange} className="field-input">
                <option value="">Visibilidade...</option>
                <option value="sim">✅ Mostrar para alunos</option>
                <option value="nao">🚫 Não mostrar</option>
              </select>
            </div>

            <div className="bg-[#0B0F1A] border border-[#1F2C42] rounded-xl p-4 mb-3">
              <label className="block text-sm font-semibold text-blue-400 mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>📊 Slide</label>
              <input name="slide" type="url" value={formData.slide} onChange={handleChange} className="field-input mb-2" placeholder="https://" />
              <select name="liberarSli" value={formData.liberarSli} onChange={handleChange} className="field-input">
                <option value="">Visibilidade...</option>
                <option value="sim">✅ Mostrar para alunos</option>
                <option value="nao">🚫 Não mostrar</option>
              </select>
            </div>

            <div className="bg-[#0B0F1A] border border-[#1F2C42] rounded-xl p-4">
              <label className="block text-sm font-semibold text-red-400 mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>✏️ Correção</label>
              <input name="correcao" type="url" value={formData.correcao} onChange={handleChange} className="field-input mb-2" placeholder="https://" />
              <select name="liberarCorr" value={formData.liberarCorr} onChange={handleChange} className="field-input">
                <option value="">Visibilidade...</option>
                <option value="sim">✅ Mostrar para alunos</option>
                <option value="nao">🚫 Não mostrar</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-shine w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px active:scale-95 mt-2 disabled:opacity-50"
            style={{ fontFamily: "'Syne',sans-serif" }}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditarAula;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function CreateProfessor() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [categoria, setCategoria] = useState('professor');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (senha.length < 6) {
      setError('Senha: Mínimo 6 caracteres');
      return;
    }
    if (!/[A-Z]/.test(senha)) {
      setError('Senha: Pelo menos uma letra maiúscula');
      return;
    }
    if (!/[0-9]/.test(senha)) {
      setError('Senha: Pelo menos um número');
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const payloadTipo = categoria === 'estagiario' ? 'Estagiário' : tipo;
      await api.post('/users/professor', { nome, senha, tipo: payloadTipo, descricao, categoria });
      setSuccess(categoria === 'estagiario' ? 'Estagiário cadastrado com sucesso!' : 'Professor cadastrado com sucesso!');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8DA4BF] mb-1">Administração</p>
        <h1 className="text-3xl font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Criar Professor / Estagiário</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-red-400 font-semibold mb-1.5">Ocorreu um erro</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="text-sm text-green-400 font-medium">{success}</p>
          </div>
        </div>
      )}

      <div className="bg-[#111827] border border-[#1F2C42] rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" className="field-input" required />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="field-input" required>
              <option value="professor">Professor</option>
              <option value="estagiario">Estagiário</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Senha</label>
            <div className="relative">
              <input type={showSenha ? 'text' : 'password'} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo 6 caracteres" className="field-input pr-11" required />
              <button type="button" onClick={() => setShowSenha(!showSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A4F6A] hover:text-[#8DA4BF] transition-colors text-base">
                {showSenha ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Confirmar senha</label>
            <div className="relative">
              <input type={showConfirmar ? 'text' : 'password'} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Repita a senha" className="field-input pr-11" required />
              <button type="button" onClick={() => setShowConfirmar(!showConfirmar)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A4F6A] hover:text-[#8DA4BF] transition-colors text-base">
                {showConfirmar ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {categoria === 'professor' && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Tipo / Disciplina</label>
              <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ex: Matemática" className="field-input" required />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Descrição</label>
            <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Breve descrição" className="field-input" />
          </div>

          <button type="submit" disabled={loading}
            className="btn-shine w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px active:scale-95 mt-2 disabled:opacity-50"
            style={{ fontFamily: "'Syne',sans-serif" }}>
            {loading ? 'Criando...' : categoria === 'estagiario' ? 'Criar Estagiário' : 'Criar Professor'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProfessor;
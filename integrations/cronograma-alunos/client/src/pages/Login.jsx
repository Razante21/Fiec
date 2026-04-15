import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../services/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/auth/login', { username, password });
      login(data.token, data.user);
      
      switch (data.user.nivel) {
        case 'administrador':
          navigate('/admin');
          break;
        case 'professor':
          navigate('/turmas');
          break;
        case 'aluno':
          navigate('/aluno');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0F1A] text-[#E8EFF7] min-h-screen flex items-center justify-center px-4 py-10">
      <div className="bg-glow"></div>
      <div className="fixed top-0 right-0 w-72 h-72 opacity-[0.07] pointer-events-none z-0"
           style={{ backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)', backgroundSize: '22px 22px' }}></div>
      <div className="fixed bottom-0 left-0 w-72 h-72 opacity-[0.07] pointer-events-none z-0"
           style={{ backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)', backgroundSize: '22px 22px' }}></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 fade-up delay-1">
          <a href="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="#60A5FA" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>EduPortal</h1>
              <p className="text-sm text-[#8DA4BF] mt-0.5">Plataforma de materiais didáticos</p>
            </div>
          </a>
        </div>

        <div className="fade-up delay-2 bg-[#111827] border border-[#1F2C42] rounded-2xl p-8"
             style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Bem-vindo de volta</h2>
            <p className="text-sm text-[#8DA4BF] mt-1">Entre com suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="fade-up delay-3">
              <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Usuário</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A4F6A]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </span>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="seu usuário" required
                  className="field-input w-full text-sm rounded-xl pl-10 pr-4 py-3" />
              </div>
            </div>

            <div className="fade-up delay-4">
              <label className="block text-xs uppercase tracking-widest text-[#8DA4BF] mb-1.5">Senha</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A4F6A]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="field-input w-full text-sm rounded-xl pl-10 pr-11 py-3" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A4F6A] hover:text-[#8DA4BF] transition-colors">
                  <svg id="eye-icon" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
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

            <div className="fade-up delay-5 pt-1">
              <button type="submit" disabled={loading}
                className="btn-shine w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px active:scale-95 disabled:opacity-50"
                style={{ fontFamily: "'Syne',sans-serif" }}>
                {loading ? 'Entrando...' : 'Entrar na plataforma'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs mt-6 text-[#3A4F6A] fade-up delay-5">
          Acesso restrito a alunos e professores cadastrados.<br/>
          Problemas? Fale com o administrador.
        </p>
      </div>
    </div>
  );
}

export default Login;
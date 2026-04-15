import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getNav = () => {
    switch (user?.nivel) {
      case 'administrador':
        return { title: 'Painel do Administrador', link: '/admin' };
      case 'professor':
        return { title: 'Minhas Turmas', link: '/turmas' };
      case 'aluno':
        return { title: 'Minhas Aulas', link: '/aluno' };
      default:
        return { title: 'EduPortal', link: '/' };
    }
  };

  const nav = getNav();

  return (
    <div className="bg-[#0B0F1A] text-[#E8EFF7] min-h-screen flex flex-col">
      <div className="bg-glow"></div>
      <div className="fixed top-0 right-0 w-72 h-72 opacity-[0.05] pointer-events-none z-0"
           style={{ backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)', backgroundSize: '22px 22px' }}></div>

      <nav className="relative z-10 border-b border-[#1F2C42] bg-[#0B0F1A]/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="#60A5FA" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ fontFamily: "'Syne',sans-serif" }}>EduPortal</span>
              {user?.nivel === 'administrador' && (
                <span className="text-xs text-[#8DA4BF] hidden sm:inline">/ Administrador</span>
              )}
            </div>
          </div>

          {user?.nivel === 'professor' && (
            <a href="https://classroom.google.com/" target="_blank" rel="noopener noreferrer"
               className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#8DA4BF] nav-link">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Google Sala de Aula
            </a>
          )}

          <button onClick={logout}
                  className="text-sm font-semibold px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  style={{ fontFamily: "'Syne',sans-serif" }}>
            Sair
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-16 w-full flex-1">
        {children}
      </main>

      <footer className="relative z-10 border-t border-[#1F2C42] py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-bold text-[#E8EFF7] mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>Inclusão Digital</h2>
            <p className="text-xs text-[#8DA4BF] leading-relaxed">Acesso à tecnologia e educação digital, criando oportunidades e reduzindo desigualdades.</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#E8EFF7] mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>Contato</h3>
            <p className="text-xs text-[#8DA4BF]">Email: edudigital08@fiec.com.br</p>
            <p className="text-xs text-[#8DA4BF]">Telefone: (19) 99300-8684</p>
            <p className="text-xs text-[#8DA4BF] mb-2">Atendimento: Seg–Sex, 8h às 12h</p>
            <p className="text-xs text-[#3A4F6A]">Este site segue boas práticas de acessibilidade.</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 mt-6 pt-4 border-t border-[#1F2C42]">
          <p className="text-xs text-[#3A4F6A] text-center">© 2026 Inclusão Digital • Compromisso com educação e inclusão</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
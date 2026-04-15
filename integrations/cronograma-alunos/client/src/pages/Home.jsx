import { Link } from 'react-router-dom';

function Home() {
  const stepsProfessor = [
    ['1', 'Acesse com seu login de professor'],
    ['2', 'Vá ao painel de publicação'],
    ['3', 'Cole o link do material (slide, atividade ou correção)'],
    ['4', 'Adicione um título e salve — o aluno já pode ver'],
  ];

  const stepsAluno = [
    ['1', 'Acesse com seu login de aluno'],
    ['2', 'Veja os materiais organizados por tipo'],
    ['3', 'Clique no link para abrir slides, atividades ou correções'],
    ['4', 'Estude no seu ritmo, quando e onde quiser'],
  ];

  return (
    <div className="bg-[#0B0F1A] text-[#E8EFF7] min-h-screen">
      <div className="bg-glow"></div>
      <div className="fixed top-0 right-0 w-72 h-72 opacity-[0.07] pointer-events-none z-0"
           style={{ backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)', backgroundSize: '22px 22px' }}></div>
      <div className="fixed bottom-0 left-0 w-72 h-72 opacity-[0.07] pointer-events-none z-0"
           style={{ backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)', backgroundSize: '22px 22px' }}></div>

      <nav className="relative z-10 border-b border-[#1F2C42] bg-[#0B0F1A]/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="#60A5FA" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>EduPortal</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-[#8DA4BF]">
            <a href="#sobre" className="nav-link">Sobre</a>
            <a href="#funcionalidades" className="nav-link">Funcionalidades</a>
            <a href="#como-funciona" className="nav-link">Como funciona</a>
          </div>
          <Link to="/login"
             className="btn-shine bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 active:scale-95"
             style={{ fontFamily: "'Syne',sans-serif" }}>
            Entrar
          </Link>
        </div>
      </nav>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center" id="sobre">
        <div className="fade-up delay-1 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6" style={{ fontFamily: "'Syne',sans-serif" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
          Plataforma educacional
        </div>

        <h1 className="fade-up delay-2 text-4xl sm:text-5xl font-bold leading-tight mb-5 text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>
          Materiais didáticos<br/>
          <span className="text-blue-400">organizados em um só lugar</span>
        </h1>

        <p className="fade-up delay-3 text-[#8DA4BF] text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          O EduPortal conecta professores e alunos de forma simples. O professor publica slides, atividades e correções — os alunos acessam tudo com facilidade, a qualquer hora.
        </p>

        <div className="fade-up delay-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/login"
             className="btn-shine bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px active:scale-95 w-full sm:w-auto text-center"
             style={{ fontFamily: "'Syne',sans-serif" }}>
            Acessar a plataforma
          </Link>
          <a href="#funcionalidades"
             className="text-[#8DA4BF] hover:text-[#E8EFF7] text-sm font-medium px-6 py-3.5 rounded-xl border border-[#1F2C42] hover:border-[#3B4F6A] transition-all duration-200 w-full sm:w-auto text-center">
            Ver funcionalidades
          </a>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="fade-up delay-4 grid grid-cols-3 gap-4 border border-[#1F2C42] rounded-2xl p-6 bg-[#111827]/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400" style={{ fontFamily: "'Syne',sans-serif" }}>3</p>
            <p className="text-xs text-[#8DA4BF] mt-1">tipos de material</p>
          </div>
          <div className="text-center border-x border-[#1F2C42]">
            <p className="text-2xl font-bold text-blue-400" style={{ fontFamily: "'Syne',sans-serif" }}>100%</p>
            <p className="text-xs text-[#8DA4BF] mt-1">via link, sem upload</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400" style={{ fontFamily: "'Syne',sans-serif" }}>2</p>
            <p className="text-xs text-[#8DA4BF] mt-1">perfis de acesso</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24" id="funcionalidades">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-[#8DA4BF] mb-2">O que a plataforma oferece</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Funcionalidades</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="feature-card bg-[#111827] border border-[#1F2C42] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="#60A5FA" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 className="font-bold text-[#E8EFF7] mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Publicação de atividades</h3>
            <p className="text-sm text-[#8DA4BF] leading-relaxed">O professor posta atividades via link externo. Os alunos acessam direto pela plataforma, sem precisar de e-mail ou grupo de WhatsApp.</p>
          </div>

          <div className="feature-card bg-[#111827] border border-[#1F2C42] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="#60A5FA" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            <h3 className="font-bold text-[#E8EFF7] mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Slides das aulas</h3>
            <p className="text-sm text-[#8DA4BF] leading-relaxed">Compartilhe apresentações em link do Google Slides, Canva ou qualquer outra plataforma. Fácil de atualizar, sem precisar repostar.</p>
          </div>

          <div className="feature-card bg-[#111827] border border-[#1F2C42] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="#60A5FA" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <h3 className="font-bold text-[#E8EFF7] mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Correções disponíveis</h3>
            <p className="text-sm text-[#8DA4BF] leading-relaxed">Publique o gabarito ou a correção detalhada em link. Os alunos consultam quando quiserem, no próprio ritmo.</p>
          </div>

          <div className="feature-card bg-[#111827] border border-[#1F2C42] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="#60A5FA" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 className="font-bold text-[#E8EFF7] mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Acesso por perfil</h3>
            <p className="text-sm text-[#8DA4BF] leading-relaxed">Login separado para professor e aluno. O professor gerencia conteúdos, o aluno apenas visualiza — sem risco de edição acidental.</p>
          </div>

          <div className="feature-card bg-[#111827] border border-[#1F2C42] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="#60A5FA" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
            </div>
            <h3 className="font-bold text-[#E8EFF7] mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Tudo por links</h3>
            <p className="text-sm text-[#8DA4BF] leading-relaxed">Sem upload de arquivos no servidor. Todos os materiais são gerenciados por links externos, deixando o sistema leve e fácil de manter.</p>
          </div>

          <div className="feature-card bg-[#111827] border border-[#1F2C42] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="#60A5FA" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="font-bold text-[#E8EFF7] mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Responsivo</h3>
            <p className="text-sm text-[#8DA4BF] leading-relaxed">Interface adaptada para celular, tablet e computador. O aluno acessa os materiais de qualquer dispositivo, sem perder nada.</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24" id="como-funciona">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-[#8DA4BF] mb-2">Simples e direto</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Como funciona</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-[#1F2C42] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="#60A5FA" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h3 className="font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Para o professor</h3>
            </div>
            <div className="space-y-4">
              {stepsProfessor.map(([n, txt]) => (
                <div key={n} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ fontFamily: "'Syne',sans-serif" }}>{n}</span>
                  <p className="text-sm text-[#8DA4BF] leading-relaxed">{txt}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] border border-[#1F2C42] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="#60A5FA" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h3 className="font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>Para o aluno</h3>
            </div>
            <div className="space-y-4">
              {stepsAluno.map(([n, txt]) => (
                <div key={n} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ fontFamily: "'Syne',sans-serif" }}>{n}</span>
                  <p className="text-sm text-[#8DA4BF] leading-relaxed">{txt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-[#111827] border border-blue-500/20 rounded-2xl p-10 text-center"
             style={{ boxShadow: '0 0 60px rgba(59,130,246,0.07)' }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E8EFF7] mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>Pronto para começar?</h2>
          <p className="text-[#8DA4BF] text-sm mb-7 max-w-sm mx-auto">Faça login e acesse todos os materiais da turma em um único lugar.</p>
          <Link to="/login"
             className="btn-shine inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px active:scale-95"
             style={{ fontFamily: "'Syne',sans-serif" }}>
            Entrar na plataforma
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#1F2C42] py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-sm font-bold text-[#E8EFF7]" style={{ fontFamily: "'Syne',sans-serif" }}>EduPortal</span>
          <p className="text-xs text-[#3A4F6A]">Plataforma de materiais didáticos — acesso restrito</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
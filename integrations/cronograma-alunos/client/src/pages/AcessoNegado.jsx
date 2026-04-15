import { Link } from 'react-router-dom';

function AcessoNegado() {
  return (
    <div className="bg-[#0B0F1A] text-[#E8EFF7] min-h-screen flex items-center justify-center p-6">
      <div className="bg-glow"></div>
      <div className="fixed bottom-0 right-0 w-72 h-72 opacity-[0.04] pointer-events-none z-0"
           style={{ backgroundImage: 'radial-gradient(circle, #EF4444 1px, transparent 1px)', backgroundSize: '22px 22px' }}></div>

      <div className="relative z-10 w-full max-w-md text-center fade-up">
        <p className="text-8xl font-bold text-red-500/20 mb-0 leading-none select-none" style={{ fontFamily: "'Syne',sans-serif" }}>403</p>

        <div className="bg-[#111827] border border-[#1F2C42] rounded-2xl p-8 -mt-4"
             style={{ boxShadow: '0 0 60px rgba(239,68,68,0.06)' }}>

          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-[#E8EFF7] mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Acesso Negado</h2>
          <p className="text-sm text-[#8DA4BF] mb-7 leading-relaxed">
            Você não tem permissão para acessar esta página.<br/>
            Se acredita que isso é um erro, entre em contato com o administrador.
          </p>

          <div className="flex gap-3 justify-center">
            <button onClick={() => window.history.back()}
              className="px-5 py-2.5 rounded-xl bg-[#1F2C42] hover:bg-[#2A3A52] text-sm font-semibold transition-all duration-200"
              style={{ fontFamily: "'Syne',sans-serif" }}>
              ← Voltar
            </button>
            <Link to="/login"
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-semibold text-white transition-all duration-200 active:scale-95"
              style={{ fontFamily: "'Syne',sans-serif" }}>
              Ir para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcessoNegado;
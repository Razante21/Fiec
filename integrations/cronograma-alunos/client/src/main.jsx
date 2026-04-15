import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Cronograma runtime error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0B0F1A',
            color: '#E8EFF7',
            fontFamily: 'DM Sans, sans-serif',
            padding: '24px',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '520px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' }}>Erro ao carregar o cronograma</h1>
            <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: '14px' }}>
              Ocorreu um erro inesperado na interface. Recarregue a página e, se continuar, avise o suporte.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                border: 'none',
                borderRadius: '10px',
                background: '#3B82F6',
                color: '#fff',
                padding: '10px 14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Recarregar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
)
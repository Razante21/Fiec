# FIEC - Plataforma de Inscricoes e Cronograma

Este repositorio contem o MVP da FIEC com duas frentes principais:

1. Portal de inscricoes (site publico + painel admin).
2. Cronograma de alunos (app integrado internamente no mesmo dominio).

O objetivo deste README e facilitar manutencao por qualquer pessoa nova no projeto, com foco em:

1. Onde cada parte funciona.
2. Em qual pasta mexer para cada tipo de mudanca.
3. Como publicar sem se perder.

## 1) Visao Geral do MVP

Fluxo principal:

1. Usuario acessa os polos e turmas no site.
2. Usuario faz inscricao ou entra em lista de espera.
3. Admin autentica, gerencia polos/turmas/configuracao.
4. Cronograma de alunos roda em rotas internas:
   - `/cronograma-alunos`
   - `/cronograma-alunos/admin`
5. Cronograma de estagiarios roda em rotas internas compartilhando o mesmo backend:
   - `/cronograma-estagiarios`
   - `/cronograma-estagiarios/admin`

## 2) Stack e Dependencias

Projeto principal:

1. Next.js 14 (App Router).
2. React 18.
3. TypeScript.
4. MySQL (mysql2).
5. Framer Motion (animacoes).

Integracao de cronograma:

1. Vite + React.
2. React Router com HashRouter.
3. Build estatico publicado em `public/cronograma-alunos-app`.

## 3) Mapa Visual de Pastas

Use este mapa como guia rapido para localizar funcionalidades.

```text
.
|- src/
|  |- app/
|  |  |- page.tsx                        # Hub/entrada principal
|  |  |- inscricao/                      # Jornada publica de inscricoes
|  |  |  |- page.tsx                     # Landing de inscricao + CTA polos
|  |  |  |- _components/                 # UI local (cards, modal)
|  |  |  |- _presenter/                  # Presenter da busca de turmas
|  |  |  |- polo/<slug>/                 # Paginas dos polos
|  |  |- admin/                          # Telas admin (UI)
|  |  |- inscricoes/admin/               # Painel de inscricoes
|  |  |- cronograma-alunos/              # Wrapper interno do cronograma (iframe)
|  |  |- cronograma-estagiarios/         # Wrapper interno de estagiarios (mesmo backend)
|  |  |- api/                            # Endpoints server-side
|  |     |- auth/                        # Login, logout, sessao
|  |     |- admin/                       # Endpoints protegidos de admin
|  |     |- polos/                       # Dados publicos de polos
|  |     |- turmas/                      # Dados publicos de turmas
|  |     |- inscricoes/                  # Criacao de inscricao/lista espera
|  |- lib/
|  |  |- db.ts                           # Conexao MySQL
|  |  |- auth-server.ts                  # Token de sessao (assinatura HMAC)
|  |- models/                            # Regras de acesso ao banco
|  |- modules/inscricoes/                # Estrutura modular em evolucao
|- sql/
|  |- database.sql                       # Script base do banco
|- public/
|  |- favicon.ico
|  |- cronograma-alunos-app/             # Build publicado da integracao
|- docs/
|  |- arquitetura.md                     # Visao de arquitetura
|  |- operacao-admin.md                  # Rotina e suporte admin
|  |- deploy-vercel.md                   # Processo de deploy
|- integrations/
|  |- cronograma-alunos/
|     |- client/                         # Fonte do app de cronograma (Vite)
|     |- server/                         # API separada da integracao
|     |- database/                       # SQL da integracao
|- apps-script.gs                        # Scripts auxiliares legados
|- script-turma-individual.gs            # Scripts auxiliares legados
```

## 4) Se Quiser Mudar X, Edite Y

Guia direto para manutencao sem perda de tempo.

1. Home/Hub inicial:
   - `src/app/page.tsx`

2. Landing de inscricao e CTA de polos:
   - `src/app/inscricao/page.tsx`

3. Modal e cards da inscricao:
   - `src/app/inscricao/_components/form-modal.tsx`
   - `src/app/inscricao/_components/polo-card.tsx`

4. Regras de carregamento de turmas no front:
   - `src/app/inscricao/_presenter/turmas.presenter.ts`

5. Paginas de cada polo:
   - `src/app/inscricao/polo/*/page.tsx`

6. API publica de polos/turmas/inscricoes:
   - `src/app/api/polos/route.ts`
   - `src/app/api/turmas/route.ts`
   - `src/app/api/inscricoes/route.ts`

7. Login e sessao:
   - `src/app/api/auth/login/route.ts`
   - `src/app/api/auth/me/route.ts`
   - `src/lib/auth-server.ts`

8. Telas e API do admin:
   - UI: `src/app/admin/*` e `src/app/inscricoes/admin/page.tsx`
   - API: `src/app/api/admin/*`

9. Banco e queries:
   - Conexao: `src/lib/db.ts`
   - Modelos: `src/models/*`
   - SQL base: `sql/database.sql`

10. Cronograma de alunos (versao integrada):
    - Wrappers Next:
      - `src/app/cronograma-alunos/page.tsx`
      - `src/app/cronograma-alunos/admin/page.tsx`
    - Fonte da integracao:
      - `integrations/cronograma-alunos/client/*`
    - Build servido pelo Next:
      - `public/cronograma-alunos-app/*`

11. Cronograma de estagiarios (versao integrada e compartilhada):
      - Wrappers Next:
         - `src/app/cronograma-estagiarios/page.tsx`
         - `src/app/cronograma-estagiarios/admin/page.tsx`
      - Usa o mesmo app publicado em `public/cronograma-alunos-app/*`.
      - Usa o mesmo backend/tabelas do cronograma de alunos (dados sincronizados).

## 5) Configuracao de Ambiente

Crie um `.env.local` com as variaveis abaixo.

```bash
MYSQLHOST=localhost
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=
MYSQLDATABASE=railway

# obrigatorio para sessao segura em producao
AUTH_SECRET=troque-este-segredo
```

Observacoes:

1. O projeto tambem aceita `MYSQL_ROOT_PASSWORD` e `MYSQL_DATABASE` como fallback.
2. Em producao, nunca usar o valor padrao de secret.

## 6) Como Rodar Localmente

Instalacao e execucao do projeto principal:

```bash
npm install
npm run dev
```

Build de validacao:

```bash
npm run build
```

## 7) Banco de Dados

Script inicial:

1. Arquivo base: `sql/database.sql`.
2. O schema contem usuarios, polos, turmas/alunos, inscricoes, lista de espera e configuracoes.

Recomendacao de operacao:

1. Sempre versionar mudancas de schema por script novo em `sql/`.
2. Evitar editar dados diretamente em producao sem backup.

## 8) Cronograma Alunos (Integracao Interna)

A tela de cronograma e carregada por iframe no Next, usando o build do app Vite.

Fluxo para atualizar o cronograma:

1. Editar fonte em `integrations/cronograma-alunos/client`.
2. Gerar build do client.
3. Publicar build em `public/cronograma-alunos-app`.

Exemplo de publicacao manual:

```bash
cd integrations/cronograma-alunos/client
npm install
npm run build
rm -rf ../../../public/cronograma-alunos-app
cp -r dist ../../../public/cronograma-alunos-app
```

Pontos importantes:

1. O client usa `HashRouter` para funcionar no subcaminho.
2. O `base` do Vite precisa continuar em `/cronograma-alunos-app/`.
3. As rotas de estagiarios usam o mesmo build/backend para garantir que o que o professor libera apareca igual para alunos e estagiarios.

## 9) Regras de Manutencao MVP

Para manter o projeto simples e rastreavel:

1. Mudar no menor escopo possivel.
2. Nao misturar refactor grande com correcao urgente.
3. Quando mexer em API, validar tambem a tela que consome.
4. Sempre rodar build antes de subir.
5. Registrar checkpoint curto no repo memory apos blocos grandes de alteracao.

## 10) Organizacao Recomendada (Evolucao)

A pasta `docs/` ja foi criada para centralizar conhecimento operacional.

Proximas melhorias sugeridas (sem quebrar rotas):

1. Mover scripts legados para `legacy/apps-script/`.
2. Criar `scripts/` na raiz para comandos de publicacao recorrentes.
3. Adicionar checklist de release em `docs/release-checklist.md`.

## 11) Checklist Rapido Antes de Deploy

1. `npm run build` no projeto principal.
2. Se houve mudanca no cronograma, rebuild e copia para `public/cronograma-alunos-app`.
3. Validar login admin e endpoints protegidos.
4. Validar fluxo de inscricao e lista de espera.
5. Confirmar favicon e assets carregando corretamente.

---

Se voce acabou de chegar no projeto, comece por:

1. Ler este README por completo.
2. Rodar localmente.
3. Abrir `src/app/inscricao/page.tsx` e `src/app/api/inscricoes/route.ts` para entender o fluxo principal ponta a ponta.
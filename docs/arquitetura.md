# Arquitetura do Projeto FIEC

## Camadas

1. Frontend Next.js em `src/app`.
2. API interna Next em `src/app/api`.
3. Modelos e banco em `src/models` e `src/lib/db.ts`.
4. Integracao de cronograma em `integrations/cronograma-alunos` com publicacao estatica em `public/cronograma-alunos-app`.

## Fluxo principal de inscricao

1. Usuario entra em `src/app/inscricao/page.tsx`.
2. Front consulta polos e turmas em `/api/polos` e `/api/turmas`.
3. Envio de inscricao ou lista de espera ocorre em `/api/inscricoes`.
4. Persistencia e feita pelos models e MySQL.

## Fluxo admin

1. Login em `/api/auth/login`.
2. Validacao de sessao em `/api/auth/me`.
3. Endpoints protegidos em `/api/admin/*`.

## Integracao cronograma

1. Rotas Next de entrada:
   - `/cronograma-alunos`
   - `/cronograma-alunos/admin`
   - `/cronograma-estagiarios`
   - `/cronograma-estagiarios/admin`
2. Paginas Next carregam iframe para `public/cronograma-alunos-app/index.html`.
3. Fonte da integracao principal fica em `integrations/cronograma-alunos/client`.
4. Cronograma de estagiarios usa o mesmo backend/tabelas para manter sincronia com a visao dos alunos.

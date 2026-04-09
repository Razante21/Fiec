# FIEC - Contexto do Projeto

## Estrutura Atual
- Site em Next.js/React/TypeScript
- Deploy no Vercel: https://github.com/Razante21/Fiec
- 8 páginas de polos: FIEC, CEU, Bem Viver, Casa da Providência, JD Brasil, Sol-Sol, Veredas, Comunidade Independente

## Formulário de Inscrição
- Modal que abre ao clicar na turma
- Campos: Nome, Data Nascimento, CPF, Telefone, Endereço, CEP, Email
- Termos e Normas Regimentais
- Validação de idade mínima (12 anos)

## Lista de Espera
- Modal separado que abre pelo botão "Lista de Espera" em cada polo
- Campos: Turma (dropdown), Nome, Telefone, Email
- Cada polo mostra APENAS as turmas dele

## Google Sheets - ARMAZENAMENTO
- **CADA TURMA TEM SUA PRÓPRIA PLANILHA** (gerada pelo Google Forms)
- **UMA PLANILHA SÓ PARA TURMAS** (para o site ler)
- **UMA PLANILHA SÓ PARA LISTA DE ESPERA**

### Abas necesarias:
1. **Planilha de Turmas** (URL_1):
   - Aba "Turmas" com colunas: Polo, Modulo, Dias, Horario, Ativo
   - Arquivo CSV pronto para importar: `turmas-para-importar.csv`

2. **Planilha de Lista de Espera** (URL_2):
   - Aba "ListaEspera" com colunas: Data, Turma, Nome, Telefone, Email, Status

### Apps Script:
- URL_1: Lê as turmas (action=turmas ou turmasPorPolo)
- URL_2: Salva na lista de espera (POST com tipo=listaEspera)

## Vagas
- Cada turma tem 40 vagas
- Contagem feita via Apps Script de CADA PLANILHA (não é global)
- O site mostra "X vagas restantes" consultando o Apps Script de cada turma

## Como adicionar/edita turmas:
1. Editar a planilha de Turmas
2. Adicionar/editar/remover linhas na aba "Turmas"
3. Usar "sim" ou "não" na coluna Ativo para mostrar/esconder

## URLs a configurar:
- `URL_PLANILHA_TURMAS` = URL da planilha que tem a aba Turmas
- `URL_PLANILHA_LISTA_ESPERA` = URL da planilha da lista de espera

# FIEC - Sistema de Inscrição

Site de inscrição para o programa de educação digital da FIEC.

## Configuração

### Planilhas Google Sheets

O sistema utiliza 3 planilhas:

1. **Planilha de Turmas** (`URL_PLANILHA_TURMAS`)
   - Contém as turmas disponíveis
   - Aba "Turmas" com colunas: Polo, Modulo, Dias, Horario, Ativo

2. **Planilha de Lista de Espera** (`URL_PLANILHA_LISTA_ESPERA`)
   - Armazena inscritos em lista de espera
   - Aba "ListaEspera" com colunas: Data, Turma, Nome, Telefone, Email, Status

3. **Planilhas Individuais de Turmas**
   - Cada turma tem sua própria planilha
   - Colunas: Data, Nome, DataNascimento, CPF, Telefone, Endereco, CEP, Email

### Apps Script

Crie um Apps Script para cada planilha:

**Planilha de Turmas** (URL_turmas):
```javascript
function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'turmas') {
    return retornaTurmas();
  } else if (action === 'turmasPorPolo') {
    return turmasPorPolo(e.parameter.polo);
  }
}

function retornaTurmas() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Turmas');
  var data = sheet.getDataRange().getValues();
  var turmas = [];
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][4] === 'sim') {
      turmas.push({
        polo: data[i][0],
        modulo: data[i][1],
        dias: data[i][2],
        horario: data[i][3]
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({turmas: turmas}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**Planilha de Inscrição** (URL_inscricao):
```javascript
function doPost(e) {
  var postData = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Inscricoes');
  
  sheet.appendRow([
    new Date(),
    postData.nome,
    postData.dataNascimento,
    postData.cpf,
    postData.telefone,
    postData.endereco,
    postData.cep,
    postData.email,
    postData.poloid,
    postData.modulo,
    postData.dias,
    postData.horario
  ]);
  
  // Contagem de vagas
  var vagas = 40 - sheet.getLastRow() + 1;
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    vagas: Math.max(0, vagas)
  })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var action = e.parameter.action;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Inscricoes');
  var total = sheet.getLastRow() - 1;
  var vagas = 40 - total;
  
  return ContentService.createTextOutput(JSON.stringify({
    vagas: Math.max(0, vagas)
  })).setMimeType(ContentService.MimeType.JSON);
}
```

**Planilha de Lista de Espera** (URL_lista_espera):
```javascript
function doPost(e) {
  var postData = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ListaEspera');
  
  if (postData.tipo === 'listaEspera') {
    sheet.appendRow([
      new Date(),
      postData.turma,
      postData.nome,
      postData.telefone,
      postData.email,
      'Pendente'
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Configuração no Código

Edite o arquivo `src/components/ui/polo-card.tsx` para configurar as URLs:

```typescript
scriptUrl: 'URL_DO_APPS_SCRIPT_DA_TURMA',
masterUrl: 'URL_LISTA_ESPERA',
```

## Deploy

O projeto está configurado para deploy no Vercel.

```bash
npm run build
```

## Estrutura dos Polos

- FIEC
- CEU
- Bem Viver
- Casa da Providência
- JD Brasil
- Sol-Sol
- Veredas
- Comunidade Independente
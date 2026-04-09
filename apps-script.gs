// ============================================================
//  GOOGLE APPS SCRIPT - FIEC Educação Digital
//  SÓ PARA LER TURMAS E SALVAR LISTA DE ESPERA
//  As inscrições vão para as planilhas do Google Forms de cada turma
// ============================================================

// ============================================================
//  SALVAR NA LISTA DE ESPERA (POST)
// ============================================================
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    var dados = JSON.parse(e.postData.contents);
    
    if (dados.tipo === 'listaEspera') {
      var aba = ss.getSheetByName("ListaEspera") || ss.insertSheet("ListaEspera");
      aba.appendRow([
        new Date(),
        dados.turma,
        dados.nome.toUpperCase().trim(),
        dados.telefone,
        dados.email,
        "Pendente"
      ]);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (erro) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: erro.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
//  LER TURMAS (GET)
// ============================================================
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = e.parameter.action;
  
  if (action === 'turmas') {
    var turmas = getTurmas(ss);
    return ContentService.createTextOutput(JSON.stringify({ turmas: turmas }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'turmasPorPolo') {
    var polo = e.parameter.polo;
    var turmas = getTurmas(ss).filter(function(t) { 
      return t.polo.toLowerCase().indexOf(polo.toLowerCase()) !== -1 || 
             polo.toLowerCase().indexOf(t.polo.toLowerCase()) !== -1;
    });
    return ContentService.createTextOutput(JSON.stringify({ turmas: turmas }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var turmas = getTurmas(ss);
  return ContentService.createTextOutput(JSON.stringify({ turmas: turmas }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getTurmas(ss) {
  var aba = ss.getSheetByName("Turmas");
  if (!aba) return [];
  
  var dados = aba.getDataRange().getValues();
  var turmas = [];
  
  for (var i = 1; i < dados.length; i++) {
    var ativo = dados[i][4];
    if (ativo && ativo.toString().toLowerCase() === 'sim') {
      turmas.push({
        polo: dados[i][0],
        modulo: dados[i][1],
        dias: dados[i][2],
        horario: dados[i][3],
        tag: dados[i][1]
      });
    }
  }
  
  return turmas;
}
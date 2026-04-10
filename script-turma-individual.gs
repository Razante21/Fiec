// ============================================================
//  SCRIPT POR TURMA – FIEC Educação Digital
//  Cole este código em cada planilha de turma individual
//  (Extensões > Apps Script)
// ============================================================

const VAGAS_TOTAL = 40;

// ── 1. FORMATAR NOME E VERIFICAR IDADE ─────────────────────
function formatarEVerificarTudo(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getSheets()[0];
  var linha = e.range.getRow();

  // Formatar nome em maiúsculo (Coluna 2 / B)
  var celulaNome = aba.getRange(linha, 2);
  var nomeOriginal = celulaNome.getValue();
  if (typeof nomeOriginal === 'string') {
    celulaNome.setValue(nomeOriginal.toUpperCase().trim());
  }

  // Verificar idade (Coluna 3 / C)
  var dataNascRaw = aba.getRange(linha, 3).getValue();
  var dataNasc = new Date(dataNascRaw);

  if (isNaN(dataNasc.getTime())) return;

  var hoje = new Date();
  var idade = hoje.getFullYear() - dataNasc.getFullYear();
  var m = hoje.getMonth() - dataNasc.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
    idade--;
  }

  // Se menor de 12 anos, pinta linha de vermelho
  if (idade < 12) {
    aba.getRange(linha, 1, 1, 13).setBackground("#ff4d4d");
    aba.getRange(linha, 14).setValue("MENOR DE 12 ANOS (Idade: " + idade + ")");
  } else {
    aba.getRange(linha, 1, 1, 13).setBackground(null);
    aba.getRange(linha, 14).clearContent();
  }
}

// ── 2. ENDPOINT DE VAGAS ─────────────────────────────────────
// Implantar > Nova implantação > Aplicativo da web
// Executar como: Eu | Quem tem acesso: Qualquer pessoa
// Use a URL gerada no campo ScriptUrl da planilha master
// ─────────────────────────────────────────────────────────────
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getSheets()[0];
  var inscritos = Math.max(0, aba.getLastRow() - 1);
  var restantes = Math.max(0, VAGAS_TOTAL - inscritos);

  return ContentService
    .createTextOutput(JSON.stringify({
      vagas: restantes,
      total: VAGAS_TOTAL,
      esgotado: restantes === 0
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── 3. RECEBER INSCRIÇÃO DO FORM ────────────────────────────
// O Google Forms já salva automaticamente na planilha
// Esta função é para receber POST do site se necessário
// ─────────────────────────────────────────────────────────────
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getSheets()[0];
  
  try {
    var dados = JSON.parse(e.postData.contents);
    
    // Validar idade mínima
    if (dados.dataNascimento) {
      var dataNasc = new Date(dados.dataNascimento);
      var hoje = new Date();
      var idade = hoje.getFullYear() - dataNasc.getFullYear();
      var m = hoje.getMonth() - dataNasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
      }
      
      if (idade < 12) {
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Idade mínima: 12 anos. Você tem " + idade + " anos." 
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Cabeçalho na primeira execução
    if (aba.getLastRow() === 0) {
      aba.appendRow(["Data", "Nome", "DataNascimento", "CPF", "Telefone", "Email", "Endereco", "CEP", "Polo", "Modulo", "Dias", "Horario", "Status"]);
    }
    
    aba.appendRow([
      new Date(),
      dados.nome ? dados.nome.toUpperCase().trim() : "",
      dados.dataNascimento || "",
      dados.cpf || "",
      dados.telefone || "",
      dados.email || "",
      dados.endereco || "",
      dados.cep || "",
      dados.poloid || "",
      dados.modulo || "",
      dados.dias || "",
      dados.horario || "",
      "Pendente"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (erro) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: erro.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
//  GATILHO (TRIGGER) - Configurar manualmente:
//  Extensões > Apps Script > Acionadores > Adicionar acionador
//    Função: formatarEVerificarTudo
//    Origem: Da planilha
//    Tipo: Ao enviar formulário
// ============================================================
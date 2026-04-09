// ============================================================
//  GOOGLE APPS SCRIPT - FIEC Educação Digital
//  Cole este código em: Extensões > Apps Script (na planilha)
//
//  O que faz:
//  1. Recebe dados do formulário React via POST
//  2. Formata nome em maiúsculo
//  3. Verifica idade (mínimo 12 anos)
//  4. Salva na planilha
//  5. Retorna vagas restantes
//
//  IMPLANTAÇÃO:
//  1. Salve este código
//  2. Implantar > Nova implantação > Aplicativo da web
//  3. Executar como: Eu
//  4. Quem tem acesso: Qualquer pessoa
//  5. Copie a URL gerada ecole no seu código React (scriptUrl)
// ============================================================

const VAGAS_TOTAL = 40;
const SS_URL = "URL_DA_SUA_PLANILHA_AQUI";

// ── 1. RECEBER FORMULÁRIO ─────────────────────────────────────
function doPost(e) {
  var ss = SpreadsheetApp.openByUrl(SS_URL);
  var aba = ss.getSheets()[0];
  
  try {
    var dados = JSON.parse(e.postData.contents);
    
    // Validations
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
        error: "Aluno deve ter pelo menos 12 anos completos"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Formatar nome
    var nomeFormatado = dados.nome.toUpperCase().trim();
    
    // Contar inscritos
    var totalInscritos = Math.max(0, aba.getLastRow());
    var vagasRestantes = Math.max(0, VAGAS_TOTAL - totalInscritos);
    
    // Se ainda tem vagas, inserir
    if (vagasRestantes > 0) {
      aba.appendRow([
        new Date(),                    // Data/Hora
        nomeFormatado,                 // Nome
        dados.dataNascimento,         // Data Nascimento
        dados.cpf,                    // CPF
        dados.telefone,               // Telefone
        dados.endereco,               // Endereço
        dados.cep,                    // CEP
        dados.email,                  // E-mail
        dados.poloid,                 // Polo
        dados.modulo,                 // Módulo
        dados.dias,                   // Dias
        dados.horario,                // Horário
        "Pendente",                   // Status
        ""                            // Observações
      ]);
      
      vagasRestantes--;
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      vagas: vagasRestantes,
      idade: idade
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (erro) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: erro.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ── 2. CONSULTAR VAGAS ───────────────────────────────────────
function doGet(e) {
  var ss = SpreadsheetApp.openByUrl(SS_URL);
  var aba = ss.getSheets()[0];
  var inscritos = Math.max(0, aba.getLastRow() - 1);
  var restantes = Math.max(0, VAGAS_TOTAL - inscritos);

  return ContentService
    .createTextOutput(JSON.stringify({
      inscritos: inscritos,
      restantes: restantes,
      total: VAGAS_TOTAL,
      esgotado: restantes === 0
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── 3. FORMATAR AO ENVIAR FORM (opcional) ───────────────────
// Se quiserformatar nome quandoenviar pelo Forms original
function formatarEVerificarTudo(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getSheets()[0];
  var linha = e.range.getRow();

  // Formatar nome (Coluna B)
  var nomeOriginal = aba.getRange(linha, 2).getValue();
  if (typeof nomeOriginal === 'string') {
    aba.getRange(linha, 2).setValue(nomeOriginal.toUpperCase().trim());
  }

  // Verificar idade (Coluna C)
  var dataNascRaw = aba.getRange(linha, 3).getValue();
  var dataNasc = new Date(dataNascRaw);
  if (isNaN(dataNasc.getTime())) return;

  var hoje = new Date();
  var idade = hoje.getFullYear() - dataNasc.getFullYear();
  var m = hoje.getMonth() - dataNasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
    idade--;
  }

  // Pintar linha de vermelho se menor de 12 anos
  if (idade < 12) {
    aba.getRange(linha, 1, 1, 14).setBackground("#ff4d4d");
    aba.getRange(linha, 14).setValue("MENOR DE 12 ANOS");
  } else {
    aba.getRange(linha, 1, 1, 14).setBackground(null);
  }
}

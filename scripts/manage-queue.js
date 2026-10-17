/**
 * Minha Decisão Certa - Queue Manager CLI
 * 
 * Commands:
 *   node scripts/manage-queue.js --list
 *   node scripts/manage-queue.js --preview <id|slug>
 *   node scripts/manage-queue.js --approve <id|slug|all>
 *   node scripts/manage-queue.js --pause <id|slug|all>
 *   node scripts/manage-queue.js --reschedule <id|slug> <YYYY-MM-DD>
 */

const fs = require('fs');
const path = require('path');

const QUEUE_FILE = path.join(__dirname, '..', 'artigos_agendados.json');

function loadQueue() {
  if (!fs.existsSync(QUEUE_FILE)) {
    console.error('Queue file not found:', QUEUE_FILE);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf-8');
}

function listQueue(queue) {
  console.log('\n========================================================================================');
  console.log('                   MINHA DECISÃO CERTA - FILA DE PUBLICAÇÃO');
  console.log('========================================================================================\n');
  
  console.log(
    '#'.padEnd(4) +
    'Status'.padEnd(14) +
    'Data Prevista'.padEnd(16) +
    'Categoria'.padEnd(24) +
    'Termo Shopee'
  );
  console.log('-'.repeat(88));

  queue.forEach((item) => {
    const num = item.id.toString().padEnd(4);
    let statusFormatted = (item.status || 'rascunho').toUpperCase();
    if (item.status === 'rascunho') statusFormatted = '🟡 RASCUNHO';
    else if (item.status === 'agendado') statusFormatted = '🟢 AGENDADO';
    else if (item.status === 'publicado') statusFormatted = '✅ PUBLICADO';
    else if (item.status === 'erro') statusFormatted = '❌ ERRO';

    const sched = item.data_publicacao || item.scheduledDate?.slice(0, 10) || 'Sem data';
    const cat = (item.categoria || '').padEnd(24);
    console.log(`${num}${statusFormatted.padEnd(17)}${sched.padEnd(16)}${cat}"${item.termo_shopee}"`);
    console.log(`     ↳ ${item.titulo}`);
  });

  const counts = queue.reduce((acc, cur) => {
    acc[cur.status] = (acc[cur.status] || 0) + 1;
    return acc;
  }, {});

  console.log('\n----------------------------------------------------------------------------------------');
  console.log(`Resumo: ${queue.length} artigos no total | ` +
    `Rascunhos: ${counts.rascunho || 0} | ` +
    `Agendados: ${counts.agendado || 0} | ` +
    `Publicados: ${counts.publicado || 0} | ` +
    `Erros: ${counts.erro || 0}`);
  console.log('========================================================================================\n');
}

function previewItem(queue, id) {
  const item = queue.find(q => q.id.toString() === id || q.slug === id);
  if (!item) {
    console.error(`Artigo não encontrado para o identificador: ${id}`);
    process.exit(1);
  }

  console.log('\n========================================================================================');
  console.log(`PRÉVIA DO ARTIGO #${item.id}: ${item.titulo}`);
  console.log('========================================================================================');
  console.log(`Slug / Arquivo:    ${item.slug}`);
  console.log(`Status Atual:      ${item.status.toUpperCase()}`);
  console.log(`Data de Postagem:  ${item.data_publicacao} às 10:00 (America/Sao_Paulo)`);
  console.log(`Categoria:         ${item.categoria}`);
  console.log(`Busca na Shopee:   "${item.termo_shopee}"`);
  console.log(`Ícone / Cor:       ${item.icone} / ${item.cor}`);
  console.log('========================================================================================\n');
}

function approve(queue, target) {
  let modified = 0;
  queue.forEach(item => {
    if (target === 'all' || item.id.toString() === target || item.slug === target) {
      if (item.status === 'rascunho') {
        item.status = 'agendado';
        modified++;
        console.log(`[Aprovado] #${item.id} "${item.titulo}" -> Status: AGENDADO`);
      }
    }
  });

  if (modified > 0) {
    saveQueue(queue);
    console.log(`\nSucesso: ${modified} artigo(s) aprovado(s) para publicação.`);
  } else {
    console.log('Nenhum artigo alterado. Verifique se o status já não era agendado ou publicado.');
  }
}

function pause(queue, target) {
  let modified = 0;
  queue.forEach(item => {
    if (target === 'all' || item.id.toString() === target || item.slug === target) {
      if (item.status === 'agendado') {
        item.status = 'rascunho';
        modified++;
        console.log(`[Pausado] #${item.id} "${item.titulo}" -> Status: RASCUNHO`);
      }
    }
  });

  if (modified > 0) {
    saveQueue(queue);
    console.log(`\nSucesso: ${modified} artigo(s) pausado(s) em rascunho.`);
  } else {
    console.log('Nenhum artigo alterado.');
  }
}

function reschedule(queue, target, newDateYMD) {
  const item = queue.find(q => q.id.toString() === target || q.slug === target);
  if (!item) {
    console.error(`Artigo não encontrado: ${target}`);
    process.exit(1);
  }

  item.data_publicacao = newDateYMD;
  item.scheduledDate = `${newDateYMD}T10:00:00-03:00`;
  saveQueue(queue);
  console.log(`[Reagendado] #${item.id} "${item.titulo}" para ${newDateYMD} às 10:00.`);
}

const args = process.argv.slice(2);
const queue = loadQueue();

if (args.includes('--list') || args.length === 0) {
  listQueue(queue);
} else if (args.includes('--preview')) {
  const idx = args.indexOf('--preview');
  previewItem(queue, args[idx + 1]);
} else if (args.includes('--approve')) {
  const idx = args.indexOf('--approve');
  approve(queue, args[idx + 1]);
} else if (args.includes('--pause')) {
  const idx = args.indexOf('--pause');
  pause(queue, args[idx + 1]);
} else if (args.includes('--reschedule')) {
  const idx = args.indexOf('--reschedule');
  reschedule(queue, args[idx + 1], args[idx + 2]);
} else {
  console.log(`
Uso:
  node scripts/manage-queue.js --list                    Listar todos os artigos
  node scripts/manage-queue.js --preview <id>            Ver detalhes e busca Shopee
  node scripts/manage-queue.js --approve <id|all>        Aprovar para publicação automática
  node scripts/manage-queue.js --pause <id|all>          Pausar artigo (manter em rascunho)
  node scripts/manage-queue.js --reschedule <id> <data>  Alterar data (Ex: 2026-10-25)
  `);
}

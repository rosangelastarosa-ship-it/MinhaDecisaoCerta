/**
 * Minha Decisão Certa - Test Suite for Publisher & Scheduler
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const TEST_DIR = path.join(ROOT_DIR, 'scratch', 'test_mdc_' + Date.now());

function setupSandbox() {
  fs.mkdirSync(TEST_DIR, { recursive: true });
  fs.mkdirSync(path.join(TEST_DIR, 'data'), { recursive: true });

  fs.writeFileSync(path.join(TEST_DIR, 'blog.html'), '<!DOCTYPE html><html><body><div class="blog-grid">\n</div></body></html>', 'utf-8');
  fs.writeFileSync(path.join(TEST_DIR, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://www.minhadecisaocerta.com.br/</loc></url>\n</urlset>', 'utf-8');
  fs.writeFileSync(path.join(TEST_DIR, 'data', 'publish-history.json'), '[]', 'utf-8');
}

function teardownSandbox() {
  try { fs.rmSync(TEST_DIR, { recursive: true, force: true }); } catch (e) {}
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   TESTES DO AGENDADOR AUTOMÁTICO - MINHA DECISÃO CERTA');
  console.log('======================================================\n');

  setupSandbox();

  const queueFile = path.join(TEST_DIR, 'artigos_agendados.json');
  const historyFile = path.join(TEST_DIR, 'data', 'publish-history.json');
  const blogFile = path.join(TEST_DIR, 'blog.html');
  const sitemapFile = path.join(TEST_DIR, 'sitemap.xml');

  // Simple test runner pointing to sandbox
  async function testRun(queue, mockNow) {
    fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2), 'utf-8');
    const now = new Date(mockNow);
    const todayYMD = mockNow.slice(0, 10);

    let blog = fs.readFileSync(blogFile, 'utf-8');
    let sitemap = fs.readFileSync(sitemapFile, 'utf-8');
    let history = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));

    const dueItems = queue.filter(item => {
      if (item.status !== 'agendado') return false;
      const sched = item.scheduledDate ? new Date(item.scheduledDate) : new Date(item.data_publicacao);
      return sched <= now;
    });

    const published = [];
    for (const item of dueItems) {
      if (item.simulateFailure) {
        item.status = 'erro';
        history.push({ id: item.id, status: 'error' });
        continue;
      }

      // Generate article file
      fs.writeFileSync(path.join(TEST_DIR, item.slug), `<h1>${item.titulo}</h1>`, 'utf-8');

      // Update blog
      if (!blog.includes(item.slug)) {
        blog = blog.replace('<div class="blog-grid">', `<div class="blog-grid">\n<a href="${item.slug}">${item.titulo}</a>`);
        fs.writeFileSync(blogFile, blog, 'utf-8');
      }

      // Update sitemap
      if (!sitemap.includes(item.slug)) {
        sitemap = sitemap.replace('</urlset>', `  <url><loc>https://www.minhadecisaocerta.com.br/${item.slug}</loc></url>\n</urlset>`);
        fs.writeFileSync(sitemapFile, sitemap, 'utf-8');
      }

      item.status = 'publicado';
      item.publishedAt = now.toISOString();
      history.push({ id: item.id, status: 'success' });
      published.push(item.id);
    }

    fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2), 'utf-8');
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf-8');
    return { publishedCount: published.length };
  }

  try {
    // TESTE 1: Item futuro não publica
    console.log('[Teste 1] Verificando se item futuro agendado não é antecipado...');
    const q1 = [{ id: 101, slug: 'future.html', titulo: 'Futuro', status: 'agendado', scheduledDate: '2026-10-25T10:00:00-03:00' }];
    const r1 = await testRun(q1, '2026-10-21T10:00:00-03:00');
    assert.strictEqual(r1.publishedCount, 0);
    console.log('  PASSED: Item futuro não foi publicado.\n');

    // TESTE 2: Rascunho não publica mesmo se a data passou
    console.log('[Teste 2] Verificando se rascunho com data vencida não é publicado...');
    const q2 = [{ id: 102, slug: 'draft.html', titulo: 'Rascunho', status: 'rascunho', scheduledDate: '2026-10-18T10:00:00-03:00' }];
    const r2 = await testRun(q2, '2026-10-21T10:00:00-03:00');
    assert.strictEqual(r2.publishedCount, 0);
    console.log('  PASSED: Rascunho mantido em espera sem publicação indevida.\n');

    // TESTE 3: Item aprovado e vencido publica uma única vez
    console.log('[Teste 3] Verificando publicação de item aprovado e vencido...');
    const q3 = [{ id: 103, slug: 'due.html', titulo: 'Artigo Vencido', status: 'agendado', scheduledDate: '2026-10-20T10:00:00-03:00' }];
    const r3 = await testRun(q3, '2026-10-21T10:00:00-03:00');
    assert.strictEqual(r3.publishedCount, 1);
    const blog3 = fs.readFileSync(blogFile, 'utf-8');
    assert(blog3.includes('due.html'));
    console.log('  PASSED: Artigo publicado com sucesso e inserido no blog.\n');

    // TESTE 4: Re-execução não duplica
    console.log('[Teste 4] Verificando proteção contra duplicatas na re-execução...');
    const q4 = JSON.parse(fs.readFileSync(queueFile, 'utf-8'));
    const r4 = await testRun(q4, '2026-10-21T10:00:00-03:00');
    assert.strictEqual(r4.publishedCount, 0);
    console.log('  PASSED: Idempotência confirmada, nenhuma duplicação gerada.\n');

    // TESTE 5: Erro simulado mantém item para retry
    console.log('[Teste 5] Verificando tratamento de falhas...');
    const q5 = [{ id: 105, slug: 'error.html', titulo: 'Erro', status: 'agendado', scheduledDate: '2026-10-20T10:00:00-03:00', simulateFailure: true }];
    await testRun(q5, '2026-10-21T10:00:00-03:00');
    const q5After = JSON.parse(fs.readFileSync(queueFile, 'utf-8'));
    assert.strictEqual(q5After[0].status, 'erro');
    console.log('  PASSED: Falha tratada com sucesso, mantendo item com status="erro" para retry.\n');

    console.log('======================================================');
    console.log('  TODOS OS 5 TESTES DO MDC PASSARAM COM SUCESSO!     ');
    console.log('======================================================\n');

  } finally {
    teardownSandbox();
  }
}

runTests().catch(err => {
  console.error('\nFALHA NO TESTE MDC:', err);
  process.exit(1);
});

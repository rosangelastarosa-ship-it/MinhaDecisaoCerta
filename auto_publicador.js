/**
 * Auto Publicador - Minha Decisão Certa
 * Encaminha para o motor central em scripts/publisher.js
 */
const { runPublisher } = require('./scripts/publisher');

runPublisher({ verbose: true })
  .then(res => {
    console.log('[Resultado]:', res.message || `${res.publishedCount} artigo(s) publicado(s).`);
  })
  .catch(err => {
    console.error('[Erro]:', err.message);
  });

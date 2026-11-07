/* Comparador Minha Decisão Certa — catálogo curado + duelo lado a lado.
 * DADOS REAIS APENAS: preços e notas copiados do guia minhadecisaocerta.com.br
 * (verificado ao vivo em 05/11/2026) e da pesquisa de TVs de 26/10/2026.
 * Onde a ficha não informa o dado, o valor é null e a tabela mostra "—".
 * Nunca invente preço ou especificação aqui: edite apenas com dados verificados.
 *
 * Fotos: img/*.png e img/*.jpg são as imagens do próprio guia, exceto
 * tv-semp.jpg (Pexels, foto de Kaboompics, id 5202925) e tv-philips.jpg
 * (Pexels, foto de yair elgazar, id 6020432) — licença Pexels, uso comercial livre.
 */
'use strict';

/* ------------------------------------------------------------------ */
/* Catálogo                                                           */
/* ------------------------------------------------------------------ */

var CATEGORIES = [
  { id: 'celulares', label: 'Celulares', guide: 'https://minhadecisaocerta.com.br/celulares.html' },
  { id: 'notebooks', label: 'Notebooks', guide: 'https://minhadecisaocerta.com.br/notebooks.html' },
  { id: 'tvs', label: 'TVs de 50"', guide: 'https://minhadecisaocerta.com.br' },
  { id: 'airfryers', label: 'Air fryers', guide: 'https://minhadecisaocerta.com.br/airfryers.html' }
];

/* spec: { text, num } — num só existe quando o valor é comparável.
 * Sem num, a linha aparece sem selo de "melhor aqui". */
var PRODUCTS = [
  /* ---------------- Celulares (Shopee, Out/2026) ---------------- */
  {
    id: 'redmi-note-13-pro', cat: 'celulares', name: 'Xiaomi Redmi Note 13 Pro 5G',
    rating: 4.8, ratingText: '4,8 (100 avaliações)',
    price: 1449.50, store: 'Shopee', priceDate: 'Out/2026',
    img: 'img/redmi_note_13_pro.jpg', tag: 'Câmera de 200 MP',
    specs: {
      camera: { text: '200 MP', num: 200 },
      tela: { text: '—' }, bateria: { text: '—' },
      armazenamento: { text: '—' }, ram: { text: '—' }
    }
  },
  {
    id: 'galaxy-s23-fe', cat: 'celulares', name: 'Samsung Galaxy S23 FE (256GB)',
    rating: 4.5, ratingText: '4,5 (100 avaliações)',
    price: 2003.55, store: 'Shopee', priceDate: 'Out/2026',
    img: 'img/galaxy_s23_fe.jpg', tag: 'Zoom óptico',
    specs: {
      camera: { text: '—' }, tela: { text: '—' }, bateria: { text: '—' },
      armazenamento: { text: '256 GB', num: 256 }, ram: { text: '—' }
    }
  },
  {
    id: 'poco-c85', cat: 'celulares', name: 'Xiaomi POCO C85 NFC (256GB)',
    rating: 4.9, ratingText: '4,9 (175 avaliações)',
    price: 1243.00, store: 'Shopee', priceDate: 'Out/2026',
    img: 'img/poco_c85.jpg', tag: 'Tela 120 Hz e bateria grande',
    specs: {
      camera: { text: '—' },
      tela: { text: '6,88" • 120 Hz', num: 120 },
      bateria: { text: '5.160 mAh', num: 5160 },
      armazenamento: { text: '256 GB', num: 256 },
      ram: { text: '8 GB', num: 8 }
    }
  },

  /* ---------------- Notebooks (Out/2026) ---------------- */
  {
    id: 'acer-aspire-5', cat: 'notebooks', name: 'Acer Aspire 5 (Ryzen 5)',
    rating: 9.5, ratingText: '9,5 / 10 — Melhor custo-benefício do ano',
    price: 2864.01, store: 'Preço médio do guia', priceDate: 'Out/2026',
    img: 'img/acer_aspire.jpg', tag: 'Melhor custo-benefício do ano',
    specs: {
      processador: { text: 'Ryzen 5' }, ram: { text: '—' }, tela: { text: '—' },
      bateria: { text: '5–6 h', num: 5.5 }, armazenamento: { text: 'SSD NVMe' }
    }
  },
  {
    id: 'macbook-air-m1', cat: 'notebooks', name: 'Apple MacBook Air M1',
    rating: 9.5, ratingText: '9,5 / 10 — Melhor notebook premium',
    price: 5029.08, store: 'Preço médio do guia', priceDate: 'Out/2026',
    img: 'img/macbook_air.jpg', tag: 'Bateria de 14h+',
    specs: {
      processador: { text: 'Apple M1' }, ram: { text: '—' },
      tela: { text: 'Retina' },
      bateria: { text: '14h+', num: 14 }, armazenamento: { text: '256 GB SSD', num: 256 }
    }
  },
  {
    id: 'asus-vivobook', cat: 'notebooks', name: 'ASUS Vivobook (Ryzen 7)',
    rating: 9.2, ratingText: '9,2 / 10',
    price: 5714.88, store: 'Preço médio do guia', priceDate: 'Out/2026',
    img: 'img/asus_vivobook.jpg', tag: 'Tela OLED espetacular',
    specs: {
      processador: { text: 'Ryzen 7' },
      ram: { text: '16 GB', num: 16 }, tela: { text: 'OLED' },
      bateria: { text: '—' }, armazenamento: { text: '—' }
    }
  },

  /* ---------------- TVs de 50" (preços de 26/10/2026) ---------------- */
  {
    id: 'semp-s42', cat: 'tvs', name: 'SEMP S42 50" Full HD',
    rating: null, ratingText: null,
    price: 1793.97, store: 'Magazine Luiza (Pix)', priceDate: '26/10/2026',
    img: 'img/tv-semp.jpg', tag: 'Menor preço em 50"',
    specs: {
      resolucao: { text: 'Full HD', num: 1080 },
      tamanho: { text: '50"', num: 50 },
      recursos: { text: 'Smart TV' }
    }
  },
  {
    id: 'philips-50pug7300', cat: 'tvs', name: 'Philips 50PUG7300 4K',
    rating: null, ratingText: null,
    price: 1899.00, store: 'Mercado Livre', priceDate: '26/10/2026',
    img: 'img/tv-philips.jpg', tag: '4K com comando de voz',
    specs: {
      resolucao: { text: '4K UHD', num: 2160 },
      tamanho: { text: '50"', num: 50 },
      recursos: { text: 'Comando de voz • Bluetooth' }
    }
  },

  /* ---------------- Air fryers (Shopee, Out/2026) ---------------- */
  {
    id: 'britania-bfr21p', cat: 'airfryers', name: 'Britânia BFR21P Air Flow (4L)',
    rating: 4.8, ratingText: '4,8 (432 avaliações)',
    price: 421.40, store: 'Shopee', priceDate: 'Out/2026',
    img: 'img/airfryer_britannia_4l.jpg', tag: '1.500 W • cesto quadrado',
    specs: {
      capacidade: { text: '4 L', num: 4 },
      potencia: { text: '1.500 W', num: 1500 },
      tipo: { text: 'Cesto' }
    }
  },
  {
    id: 'mondial-afon-12l', cat: 'airfryers', name: 'Mondial AFON-12L-BI Digital (12L)',
    rating: 4.9, ratingText: '4,9 (512 avaliações)',
    price: 521.55, store: 'Shopee', priceDate: 'Out/2026',
    img: 'img/airfryer_mondial_12l.jpg', tag: 'Oven 2 em 1 digital',
    specs: {
      capacidade: { text: '12 L', num: 12 },
      potencia: { text: '—' },
      tipo: { text: 'Oven (forno)' }
    }
  },
  {
    id: 'gaabor-duo', cat: 'airfryers', name: 'Gaabor Duo Touchscreen (4,2L)',
    rating: 4.8, ratingText: '4,8 (140 avaliações)',
    price: 209.00, store: 'Shopee', priceDate: 'Out/2026',
    img: 'img/airfryer_gaabor_duo.jpg', tag: 'Visor transparente',
    specs: {
      capacidade: { text: '4,2 L', num: 4.2 },
      potencia: { text: '—' },
      tipo: { text: 'Cesto' }
    }
  }
];

/* Linhas da tabela por categoria. better: 'low' | 'high' | null
 * (null = a linha só informa, sem selo de melhor). */
var SPEC_ROWS = {
  celulares: [
    { key: 'price', label: 'Preço', better: 'low' },
    { key: 'rating', label: 'Nota do guia', better: 'high' },
    { key: 'camera', label: 'Câmera traseira', better: 'high' },
    { key: 'tela', label: 'Tela', better: 'high' },
    { key: 'bateria', label: 'Bateria', better: 'high' },
    { key: 'armazenamento', label: 'Armazenamento', better: 'high' },
    { key: 'ram', label: 'Memória RAM', better: 'high' }
  ],
  notebooks: [
    { key: 'price', label: 'Preço', better: 'low' },
    { key: 'rating', label: 'Nota do guia', better: 'high' },
    { key: 'processador', label: 'Processador', better: null },
    { key: 'ram', label: 'Memória RAM', better: 'high' },
    { key: 'tela', label: 'Tela', better: null },
    { key: 'bateria', label: 'Bateria', better: 'high' },
    { key: 'armazenamento', label: 'Armazenamento', better: 'high' }
  ],
  tvs: [
    { key: 'price', label: 'Preço', better: 'low' },
    { key: 'resolucao', label: 'Resolução', better: 'high' },
    { key: 'tamanho', label: 'Tamanho', better: null },
    { key: 'recursos', label: 'Recursos', better: null }
  ],
  airfryers: [
    { key: 'price', label: 'Preço', better: 'low' },
    { key: 'rating', label: 'Nota do guia', better: 'high' },
    { key: 'capacidade', label: 'Capacidade', better: null },
    { key: 'potencia', label: 'Potência', better: 'high' },
    { key: 'tipo', label: 'Tipo', better: null }
  ]
};

/* Perfis guiados por categoria. */
var PROFILES = {
  celulares: [
    { label: '📸 Quero câmera forte', product: 'redmi-note-13-pro', reason: 'O Redmi Note 13 Pro 5G tem câmera de 200 MP — a maior do grupo — por R$ 1.449,50 (Shopee, Out/2026).' },
    { label: '💰 Melhor custo-benefício', product: 'poco-c85', reason: 'O POCO C85 NFC é o mais barato do grupo (R$ 1.243,00), tem a maior nota (4,9) e bateria de 5.160 mAh.' },
    { label: '💜 Ecossistema Samsung', product: 'galaxy-s23-fe', reason: 'O Galaxy S23 FE (256 GB) é a porta de entrada da linha Galaxy S, com zoom óptico e ótimo conjunto de lentes.' }
  ],
  notebooks: [
    { label: '💰 Melhor custo-benefício', product: 'acer-aspire-5', reason: 'O Acer Aspire 5 é o melhor custo-benefício do ano no guia (nota 9,5) por R$ 2.864,01.' },
    { label: '🔋 Bateria para o dia todo', product: 'macbook-air-m1', reason: 'O MacBook Air M1 dura 14h+ longe da tomada e não esquenta — nota 9,5 no guia.' },
    { label: '🖥️ Performance no Windows', product: 'asus-vivobook', reason: 'O ASUS Vivobook (Ryzen 7) tem 16 GB de RAM e tela OLED — o mais potente com Windows do grupo.' }
  ],
  tvs: [
    { label: '💰 Menor preço', product: 'semp-s42', reason: 'A SEMP S42 de 50" Full HD foi a TV 50" mais barata que encontramos: R$ 1.793,97 no Pix (26/10/2026).' },
    { label: '✨ Melhor imagem 4K', product: 'philips-50pug7300', reason: 'A Philips 50PUG7300 é 4K, com comando de voz e Bluetooth, por R$ 1.899,00 (26/10/2026).' }
  ],
  airfryers: [
    { label: '👨‍👩‍👧‍👦 Família grande', product: 'mondial-afon-12l', reason: 'A Mondial AFON-12L-BI é oven de 12 litros — cabe a refeição da família inteira — por R$ 521,55.' },
    { label: '💰 Menor preço', product: 'gaabor-duo', reason: 'A Gaabor Duo Touchscreen (4,2 L) custa R$ 209,00 e tem visor transparente para acompanhar o preparo.' },
    { label: '⭐ Custo-benefício', product: 'britania-bfr21p', reason: 'A Britânia BFR21P (4 L, 1.500 W) é a queridinha do guia: nota 4,8 com 432 avaliações, por R$ 421,40.' }
  ]
};

var CATEGORY_NOTES = {
  tvs: '📺 Por enquanto são 2 TVs de 50" com preço verificado. Em breve: Samsung 50DU7700 4K — o preço ainda será confirmado na loja antes de entrar no duelo.'
};

/* ------------------------------------------------------------------ */
/* Quiz "Qual é o ideal para você?"                                   */
/* Regras simples, sem inventar nada: cada resposta soma pontos aos   */
/* produtos do catálogo com base na ficha real (preço, nota e specs   */
/* verificadas em app.js). Perguntas sem dado na ficha (ex.: som da   */
/* TV, limpeza da air fryer) somam o mesmo para todos — não inventam  */
/* diferença onde não há. A pergunta de orçamento usa `max`: produto  */
/* acima do teto perde 10 pontos (o orçamento manda mais que qualquer */
/* preferência); se nenhum couber, o resultado avisa com honestidade  */
/* com honestidade e mostra o mais próximo.                           */
/* ------------------------------------------------------------------ */

var QUIZ = {
  celulares: [
    { id: 'orcamento', text: 'Qual é o seu orçamento?',
      options: [
        { label: 'Até R$ 1.000', max: 1000 },
        { label: 'Até R$ 1.300', max: 1300 },
        { label: 'De R$ 1.300 a R$ 1.600', max: 1600 },
        { label: 'De R$ 1.600 a R$ 2.100', max: 2100 },
        { label: 'Sem limite definido', max: null }
      ] },
    { id: 'prioridade', text: 'O que é mais importante para você?',
      options: [
        { label: '📸 Câmera forte', scores: { 'redmi-note-13-pro': 5 }, why: { 'redmi-note-13-pro': 'câmera de 200 MP, a maior do grupo' } },
        { label: '🔋 Bateria que dura o dia todo', scores: { 'poco-c85': 5 }, why: { 'poco-c85': 'bateria de 5.160 mAh, a maior do grupo' } },
        { label: '⚡ Desempenho e fluidez', scores: { 'poco-c85': 3, 'galaxy-s23-fe': 1 }, why: { 'poco-c85': 'tela de 120 Hz e 8 GB de RAM', 'galaxy-s23-fe': '256 GB de armazenamento' } },
        { label: '💰 Menor preço', scores: { 'poco-c85': 5 }, why: { 'poco-c85': 'o mais barato do grupo: R$ 1.243,00' } }
      ] },
    { id: 'tela', text: 'Prefere tela grande ou mais compacta?',
      options: [
        { label: 'Tela grande (6,8" ou mais)', scores: { 'poco-c85': 2 }, why: { 'poco-c85': 'tela grande de 6,88"' } },
        { label: 'Tanto faz', scores: { 'redmi-note-13-pro': 1, 'galaxy-s23-fe': 1, 'poco-c85': 1 } },
        { label: 'Mais compacta', scores: {} }
      ] },
    { id: 'armazenamento', text: 'Quanto armazenamento você precisa?',
      options: [
        { label: '128 GB está bom', scores: { 'redmi-note-13-pro': 1, 'galaxy-s23-fe': 1, 'poco-c85': 1 } },
        { label: '256 GB', scores: { 'galaxy-s23-fe': 2, 'poco-c85': 2 }, why: { 'galaxy-s23-fe': '256 GB de armazenamento', 'poco-c85': '256 GB de armazenamento' } },
        { label: 'Quanto mais, melhor', scores: { 'galaxy-s23-fe': 2, 'poco-c85': 2 }, why: { 'galaxy-s23-fe': '256 GB de armazenamento', 'poco-c85': '256 GB de armazenamento' } }
      ] },
    { id: 'marca', text: 'Tem preferência de marca?',
      options: [
        { label: 'Tanto faz', scores: { 'redmi-note-13-pro': 1, 'galaxy-s23-fe': 1, 'poco-c85': 1 } },
        { label: 'Samsung', scores: { 'galaxy-s23-fe': 2 }, why: { 'galaxy-s23-fe': 'da linha Galaxy S, com zoom óptico' } },
        { label: 'Xiaomi', scores: { 'redmi-note-13-pro': 2, 'poco-c85': 2 }, why: { 'redmi-note-13-pro': 'Xiaomi com câmera de 200 MP', 'poco-c85': 'Xiaomi com a maior nota do grupo (4,9)' } }
      ] }
  ],
  notebooks: [
    { id: 'orcamento', text: 'Qual é o seu orçamento?',
      options: [
        { label: 'Até R$ 2.000', max: 2000 },
        { label: 'Até R$ 3.000', max: 3000 },
        { label: 'De R$ 3.000 a R$ 5.500', max: 5500 },
        { label: 'Sem limite definido', max: null }
      ] },
    { id: 'uso', text: 'Para que você vai usar mais?',
      options: [
        { label: '📚 Estudos', scores: { 'acer-aspire-5': 2, 'macbook-air-m1': 1 }, why: { 'acer-aspire-5': 'melhor custo-benefício do ano no guia (nota 9,5)', 'macbook-air-m1': 'bateria de 14h+ para o dia inteiro de aula' } },
        { label: '💼 Trabalho', scores: { 'macbook-air-m1': 2, 'asus-vivobook': 1 }, why: { 'macbook-air-m1': 'bateria de 14h+ e tela Retina', 'asus-vivobook': '16 GB de RAM e processador Ryzen 7' } },
        { label: '🎮 Jogos leves', scores: { 'asus-vivobook': 2, 'acer-aspire-5': 1 }, why: { 'asus-vivobook': 'Ryzen 7 com 16 GB de RAM, o mais potente com Windows do grupo', 'acer-aspire-5': 'Ryzen 5 com bom custo-benefício' } },
        { label: '🌐 Só o básico (navegar e vídeos)', scores: { 'acer-aspire-5': 2 }, why: { 'acer-aspire-5': 'o mais barato do grupo, com nota 9,5 no guia' } }
      ] },
    { id: 'portabilidade', text: 'O que pesa mais para você?',
      options: [
        { label: '🪶 Leve e com bateria longa', scores: { 'macbook-air-m1': 3 }, why: { 'macbook-air-m1': 'bateria de 14h+ e não esquenta' } },
        { label: '💪 Potência máxima', scores: { 'asus-vivobook': 3 }, why: { 'asus-vivobook': 'Ryzen 7, 16 GB de RAM e tela OLED' } },
        { label: '⚖️ Equilíbrio entre os dois', scores: { 'acer-aspire-5': 2, 'macbook-air-m1': 1 }, why: { 'acer-aspire-5': 'equilíbrio entre preço e desempenho' } }
      ] },
    { id: 'tela', text: 'Prefere que tipo de tela?',
      options: [
        { label: 'OLED, cores vibrantes', scores: { 'asus-vivobook': 2 }, why: { 'asus-vivobook': 'tela OLED espetacular' } },
        { label: 'Retina, nitidez', scores: { 'macbook-air-m1': 2 }, why: { 'macbook-air-m1': 'tela Retina' } },
        { label: 'Tanto faz', scores: { 'acer-aspire-5': 1, 'macbook-air-m1': 1, 'asus-vivobook': 1 } }
      ] },
    { id: 'bateria', text: 'A bateria é importante para você?',
      options: [
        { label: 'Muito — uso longe da tomada', scores: { 'macbook-air-m1': 3, 'acer-aspire-5': 1 }, why: { 'macbook-air-m1': 'bateria de 14h+' } },
        { label: 'Mais ou menos', scores: { 'acer-aspire-5': 1, 'macbook-air-m1': 1 } },
        { label: 'Pouco — uso sempre na tomada', scores: { 'asus-vivobook': 1, 'acer-aspire-5': 1 } }
      ] }
  ],
  tvs: [
    { id: 'orcamento', text: 'Qual é o seu orçamento?',
      options: [
        { label: 'Até R$ 1.500', max: 1500 },
        { label: 'Até R$ 1.850', max: 1850 },
        { label: 'Até R$ 2.000', max: 2000 },
        { label: 'Sem limite definido', max: null }
      ] },
    { id: 'sala', text: 'Qual o tamanho da sala / distância do sofá?',
      options: [
        { label: 'Sala pequena (até 2 m)', scores: { 'semp-s42': 1, 'philips-50pug7300': 1 } },
        { label: 'Sala média (2 a 3 m)', scores: { 'semp-s42': 1, 'philips-50pug7300': 1 } },
        { label: 'Sala grande (mais de 3 m)', scores: { 'semp-s42': 1, 'philips-50pug7300': 1 } }
      ] },
    { id: 'prioridade', text: 'O que é mais importante para você?',
      options: [
        { label: '✨ Qualidade de imagem', scores: { 'philips-50pug7300': 3 }, why: { 'philips-50pug7300': 'resolução 4K UHD' } },
        { label: '📺 Recursos smart', scores: { 'philips-50pug7300': 2, 'semp-s42': 1 }, why: { 'philips-50pug7300': 'comando de voz e Bluetooth', 'semp-s42': 'Smart TV' } },
        { label: '💰 Menor preço', scores: { 'semp-s42': 3 }, why: { 'semp-s42': 'a TV 50" mais barata que encontramos: R$ 1.793,97' } }
      ] },
    { id: 'som', text: 'O som é importante para você?',
      options: [
        { label: 'Muito importante', scores: { 'semp-s42': 1, 'philips-50pug7300': 1 } },
        { label: 'Tanto faz — uso soundbar ou fone', scores: { 'semp-s42': 1, 'philips-50pug7300': 1 } },
        { label: 'Pouco importante', scores: { 'semp-s42': 1, 'philips-50pug7300': 1 } }
      ] },
    { id: 'jogos', text: 'Vai jogar videogame na TV?',
      options: [
        { label: 'Sim, bastante', scores: { 'semp-s42': 1, 'philips-50pug7300': 1 } },
        { label: 'Às vezes', scores: { 'semp-s42': 1, 'philips-50pug7300': 1 } },
        { label: 'Não', scores: { 'semp-s42': 1, 'philips-50pug7300': 1 } }
      ] }
  ],
  airfryers: [
    { id: 'orcamento', text: 'Qual é o seu orçamento?',
      options: [
        { label: 'Até R$ 150', max: 150 },
        { label: 'Até R$ 250', max: 250 },
        { label: 'Até R$ 450', max: 450 },
        { label: 'Até R$ 600', max: 600 },
        { label: 'Sem limite definido', max: null }
      ] },
    { id: 'pessoas', text: 'Para quantas pessoas você cozinha?',
      options: [
        { label: '1 a 2 pessoas', scores: { 'gaabor-duo': 2, 'britania-bfr21p': 1 }, why: { 'gaabor-duo': '4,2 L na medida para 1 ou 2 pessoas', 'britania-bfr21p': '4 L, tamanho ideal para pouca gente' } },
        { label: '3 a 4 pessoas', scores: { 'britania-bfr21p': 2, 'gaabor-duo': 1 }, why: { 'britania-bfr21p': '4 L com 1.500 W', 'gaabor-duo': '4,2 L com visor transparente' } },
        { label: '5 ou mais', scores: { 'mondial-afon-12l': 3 }, why: { 'mondial-afon-12l': 'oven de 12 litros — cabe a refeição da família inteira' } }
      ] },
    { id: 'prioridade', text: 'O que é mais importante para você?',
      options: [
        { label: '⚡ Potência', scores: { 'britania-bfr21p': 3 }, why: { 'britania-bfr21p': '1.500 W, a maior potência informada do grupo' } },
        { label: '📟 Painel digital', scores: { 'mondial-afon-12l': 2, 'gaabor-duo': 2 }, why: { 'mondial-afon-12l': 'painel digital', 'gaabor-duo': 'touchscreen com visor transparente' } },
        { label: '🍕 Função forno (oven)', scores: { 'mondial-afon-12l': 3 }, why: { 'mondial-afon-12l': 'oven 2 em 1 — funciona como forno' } }
      ] },
    { id: 'frequencia', text: 'Com que frequência vai usar?',
      options: [
        { label: 'Todo dia', scores: { 'britania-bfr21p': 1, 'mondial-afon-12l': 1, 'gaabor-duo': 1 } },
        { label: 'Algumas vezes por semana', scores: { 'britania-bfr21p': 1, 'mondial-afon-12l': 1, 'gaabor-duo': 1 } },
        { label: 'De vez em quando', scores: { 'gaabor-duo': 2 }, why: { 'gaabor-duo': 'a mais barata do grupo para uso eventual: R$ 209,00' } }
      ] },
    { id: 'limpeza', text: 'Facilidade de limpeza é importante?',
      options: [
        { label: 'Muito importante', scores: { 'britania-bfr21p': 1, 'mondial-afon-12l': 1, 'gaabor-duo': 1 } },
        { label: 'Tanto faz', scores: { 'britania-bfr21p': 1, 'mondial-afon-12l': 1, 'gaabor-duo': 1 } }
      ] }
  ]
};

/* ------------------------------------------------------------------ */
/* Funções puras (testáveis sem navegador)                            */
/* ------------------------------------------------------------------ */

function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function productById(id) {
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) return PRODUCTS[i];
  }
  return null;
}

function productsOf(cat) {
  return PRODUCTS.filter(function (p) { return p.cat === cat; });
}

function rowValue(product, row) {
  if (row.key === 'price') return { text: formatBRL(product.price), num: product.price };
  if (row.key === 'rating') {
    if (product.rating == null) return { text: '—' };
    var scale = product.cat === 'notebooks' ? ' / 10' : ' / 5';
    return { text: String(product.rating).replace('.', ',') + scale, num: product.rating };
  }
  var spec = product.specs[row.key];
  if (!spec) return { text: '—' };
  return spec;
}

/* Devolve { rowKey: productId } com o vencedor de cada linha.
 * Só há selo quando pelo menos 2 produtos têm valor numérico e há
 * um único melhor (empate = sem selo). */
function computeWinners(cat, selectedIds) {
  var winners = {};
  var selected = selectedIds.map(productById).filter(Boolean);
  if (selected.length < 2) return winners;
  SPEC_ROWS[cat].forEach(function (row) {
    if (!row.better) return;
    var best = null, bestNum = null, count = 0, tie = false;
    selected.forEach(function (p) {
      var v = rowValue(p, row);
      if (v.num == null) return;
      count++;
      if (bestNum == null ||
          (row.better === 'low' && v.num < bestNum) ||
          (row.better === 'high' && v.num > bestNum)) {
        best = p; bestNum = v.num; tie = false;
      } else if (v.num === bestNum) {
        tie = true;
      }
    });
    if (count >= 2 && best && !tie) winners[row.key] = best.id;
  });
  return winners;
}

/* Veredito: conta os selos; desempate pela maior nota do guia e,
 * persistindo o empate, pelo menor preço. */
function computeVerdict(cat, selectedIds) {
  var winners = computeWinners(cat, selectedIds);
  var counts = {};
  selectedIds.forEach(function (id) { counts[id] = 0; });
  Object.keys(winners).forEach(function (key) { counts[winners[key]]++; });
  var ranked = selectedIds.slice().sort(function (a, b) {
    if (counts[b] !== counts[a]) return counts[b] - counts[a];
    var ra = productById(a).rating || 0, rb = productById(b).rating || 0;
    if (rb !== ra) return rb - ra;
    return productById(a).price - productById(b).price;
  });
  var winner = productById(ranked[0]);
  var tied = selectedIds.length > 1 && counts[ranked[1]] === counts[ranked[0]];
  var wonRows = Object.keys(winners).filter(function (k) { return winners[k] === winner.id; })
    .map(function (k) {
      var row = SPEC_ROWS[cat].filter(function (r) { return r.key === k; })[0];
      return row ? row.label : k;
    });
  return { winners: winners, counts: counts, winner: winner, wonRows: wonRows, tied: tied };
}

function buildSummary(cat, selectedIds) {
  var catLabel = CATEGORIES.filter(function (c) { return c.id === cat; })[0].label;
  var verdict = computeVerdict(cat, selectedIds);
  var lines = [];
  lines.push('DUELO — Minha Decisão Certa (' + catLabel + ')');
  lines.push(selectedIds.map(function (id) { return productById(id).name; }).join('  x  '));
  lines.push('');
  SPEC_ROWS[cat].forEach(function (row) {
    var cells = selectedIds.map(function (id) {
      var p = productById(id);
      var v = rowValue(p, row);
      var mark = verdict.winners[row.key] === id ? ' ★ melhor aqui' : '';
      return p.name + ': ' + v.text + mark;
    });
    var anyValue = selectedIds.some(function (id) {
      return rowValue(productById(id), row).text !== '—';
    });
    if (anyValue) lines.push('• ' + row.label + ' — ' + cells.join(' | '));
  });
  lines.push('');
  var w = verdict.winner;
  lines.push('VEREDITO: ' + w.name + ' vence o duelo' +
    (verdict.wonRows.length ? ' (melhor em: ' + verdict.wonRows.join(', ') + ')' : '') +
    (verdict.tied ? ' — empate em selos, desempate pela nota do guia e pelo menor preço.' : '.'));
  lines.push('');
  selectedIds.forEach(function (id) {
    var p = productById(id);
    lines.push('• ' + p.name + ' — ' + formatBRL(p.price) + ' (' + p.store + ', ' + p.priceDate + ').');
  });
  lines.push('Preços observados em ' + selectedIds.map(function (id) { return productById(id).priceDate; }).join(', ') +
    ' — confira o preço atual na loja.');
  lines.push('Guia completo: https://minhadecisaocerta.com.br');
  return lines.join('\n');
}

/* Quiz: soma os pontos das respostas, aplica o teto de orçamento e
 * devolve os 2 produtos mais indicados, com os motivos. Desempate:
 * maior nota do guia, depois menor preço. `answers` = índices das
 * opções escolhidas, na ordem das perguntas. */
function scoreQuiz(cat, answers) {
  var questions = QUIZ[cat];
  if (!questions) return { ranked: [], top: [], overBudget: false, budgetMax: null };
  var products = productsOf(cat);
  var scores = {}, reasons = {}, budgetMax = null;
  products.forEach(function (p) { scores[p.id] = 0; reasons[p.id] = []; });
  (answers || []).forEach(function (optIdx, qi) {
    var q = questions[qi];
    if (!q || optIdx == null) return;
    var opt = q.options[optIdx];
    if (!opt) return;
    if (opt.max != null && budgetMax == null) budgetMax = opt.max;
    Object.keys(opt.scores || {}).forEach(function (pid) {
      if (scores[pid] == null) return;
      scores[pid] += opt.scores[pid];
      var why = (opt.why || {})[pid];
      if (why && reasons[pid].indexOf(why) === -1) reasons[pid].push(why);
    });
  });
  var overBudget = false;
  if (budgetMax != null) {
    var anyFits = products.some(function (p) { return p.price <= budgetMax; });
    overBudget = !anyFits;
    products.forEach(function (p) {
      if (p.price > budgetMax) scores[p.id] -= 10;
    });
  }
  var ranked = products.map(function (p) {
    return {
      id: p.id, score: scores[p.id],
      reasons: reasons[p.id].length ? reasons[p.id].slice(0, 2) : [p.tag]
    };
  }).sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    var ra = productById(a.id).rating || 0, rb = productById(b.id).rating || 0;
    if (rb !== ra) return rb - ra;
    return productById(a.id).price - productById(b.id).price;
  });
  return {
    ranked: ranked,
    top: ranked.slice(0, 2).map(function (r) { return r.id; }),
    overBudget: overBudget,
    budgetMax: budgetMax
  };
}

/* ------------------------------------------------------------------ */
/* Calculadora de parcelas ("Cabe no seu bolso?")                     */
/* Tabela PRICE: parcela = P × [i ÷ (1 − (1+i)^−n)]. Sem juros (i=0), */
/* a parcela é P/n. A taxa padrão é 0% — o site NUNCA assume juros:   */
/* o usuário digita a taxa que a loja cobra, se houver. À vista (Pix) */
/* é exatamente o preço listado — sem desconto inventado.             */
/* ------------------------------------------------------------------ */

function calcInstallment(price, n, ratePct) {
  var i = (ratePct || 0) / 100;
  var monthly = i === 0 ? price / n : price * (i / (1 - Math.pow(1 + i, -n)));
  return { monthly: monthly, total: monthly * n, extra: monthly * n - price };
}

/* ------------------------------------------------------------------ */
/* Lista de desejos (simples)                                         */
/* Só localStorage, neste navegador e aparelho — sem login, sem conta, */
/* sem e-mail e sem aviso. O preço mostrado é o efetivo do site       */
/* (ao vivo quando disponível, senão o do guia). O alerta completo     */
/* (monitoramento contínuo + e-mail) é um projeto separado, futuro.   */
/* Mapa: { productId: target } — target = preço-alvo em R$ (> 0) ou   */
/* null quando o visitante ainda não definiu um preço.                */
/* ------------------------------------------------------------------ */

var WISHLIST_KEY = 'mdc-wishlist-v1';

function wishlistFromJson(json) {
  var map = {};
  var data;
  try { data = JSON.parse(json); } catch (e) { return map; }
  if (!data || typeof data !== 'object') return map;
  Object.keys(data).forEach(function (id) {
    if (!productById(id)) return; /* produto desconhecido: ignora */
    var t = data[id];
    if (t == null) { map[id] = null; return; }
    var n = Number(t);
    map[id] = (isFinite(n) && n > 0) ? n : null;
  });
  return map;
}

function wishlistToJson(map) {
  return JSON.stringify(map || {});
}

/* Estado do preço-alvo: 'hit' (preço atual <= meta), 'gap' (falta X) */
/* ou 'no-target' (sem meta definida). */
function wishlistStatus(p, target, eff) {
  if (target == null || !(target > 0)) return { state: 'no-target', gap: null };
  if (eff.price <= target) return { state: 'hit', gap: 0 };
  return { state: 'gap', gap: eff.price - target };
}

function wishlistToggle(map, productId) {
  var next = {};
  Object.keys(map || {}).forEach(function (k) { next[k] = map[k]; });
  if (!productById(productId)) return next;
  if (next.hasOwnProperty(productId)) { delete next[productId]; }
  else { next[productId] = null; }
  return next;
}

function wishlistSetTarget(map, productId, target) {
  var next = {};
  Object.keys(map || {}).forEach(function (k) { next[k] = map[k]; });
  if (!productById(productId)) return next;
  var n = Number(target);
  next[productId] = (isFinite(n) && n > 0) ? n : null;
  return next;
}

/* Tokens do nome do produto para casar com a oferta ao vivo da Shopee. */
var STOPWORDS = ['de', 'do', 'da', 'com', 'para', 'em', 'e', '5g', 'l', '4l', '12l', '42l', 'wifi', 'nfc'];
function nameTokens(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ').split(' ')
    .filter(function (t) { return t.length > 1 && STOPWORDS.indexOf(t) === -1; });
}
/* Palavras-chave de acessórios que NUNCA devem ser confundidos com o produto real */
var ACCESSORY_WORDS = [
  'capa', 'capinha', 'pelicula', 'case', 'cabo', 'carregador', 'suporte',
  'adaptador', 'fone', 'relogio', 'pulseira', 'protetor', 'adesivo', 'skin',
  'vidro', 'peca', 'pecas', 'display', 'touch', 'bateria original', 'troca', 'flex',
  'modulo', 'painel', 'barra de led', 'barras de led', 'placa',
  'controle', 'cesto', 'grelha', 'tapete', 'papel', 'forma de silicone',
  'resistencia', 'alca', 'cooler', 'fonte', 'mochila'
];

/* Casa a oferta ao vivo com o produto quando há pelo menos 2 tokens
 * em comum, ou o token de modelo (ex.: bfr21p, 50pug7300) aparece.
 * REJEITA categoricamente capinhas, películas, cabos e discrepâncias de preço. */
function matchOffer(product, offers) {
  var tokens = nameTokens(product.name);
  var best = null, bestScore = 0;
  var minPrice = product.price ? product.price * 0.5 : 50;
  var maxPrice = product.price ? product.price * 2.8 : 50000;

  (offers || []).forEach(function (o) {
    var rawName = o.productName || '';
    var hay = rawName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Rejeita qualquer acessório/capinha/película
    var isAccessory = ACCESSORY_WORDS.some(function (w) {
      return hay.indexOf(w) !== -1;
    });
    if (isAccessory) return;

    var price = Number(o.priceMin);
    if (price > 100000) price = price / 100;
    // Rejeita ofertas com preço discrepante (ex.: capinha de R$ 18 num celular de R$ 1400)
    if (price < minPrice || price > maxPrice) return;

    var score = 0;
    tokens.forEach(function (t) { if (hay.indexOf(t) !== -1) score++; });
    if (score > bestScore) { bestScore = score; best = o; }
  });
  if (bestScore >= 2) return best;
  return null;
}

/* ------------------------------------------------------------------ */
/* Interface (navegador)                                              */
/* ------------------------------------------------------------------ */

var state = { cat: 'celulares', selected: [], live: {}, liveConfigured: null };
var quizState = { cat: null, step: 0, answers: [] };

function el(id) { return document.getElementById(id); }

function renderTabs() {
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (t) {
    var active = t.dataset.cat === state.cat;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

function priceHtml(p) {
  var live = state.live[p.id];
  if (live) {
    return '<p class="product-price">' + formatBRL(live.price) +
      '<span class="live-badge">AO VIVO</span>' +
      '<small>Preço ao vivo via Shopee — confira na loja</small></p>' +
      (live.offerLink ? '<p><a href="' + live.offerLink + '" target="_blank" rel="noopener sponsored">Ver oferta na Shopee ↗</a></p>' : '');
  }
  return '<p class="product-price">' + formatBRL(p.price) +
    '<small>' + p.store + ' • ' + p.priceDate + ' — confira o preço atual na loja</small></p>';
}

/* Preço efetivo do produto: ao vivo, quando disponível; senão, o do guia. */
function effectivePrice(p) {
  var live = state.live[p.id];
  if (live) return { price: live.price, source: 'Preço ao vivo via Shopee' };
  return { price: p.price, source: p.store + ' • ' + p.priceDate };
}

/* HTML do widget de parcelas de um produto (puro — sem amarrar eventos).
 * uid distingue as instâncias (duelo vs quiz). Os valores iniciais já
 * vêm calculados para 12x sem juros; os eventos recalculam depois. */
function installmentWidgetHtml(p, uid, eff) {
  var res = calcInstallment(eff.price, 12, 0);
  var opts = '';
  for (var n = 1; n <= 12; n++) {
    opts += '<option value="' + n + '"' + (n === 12 ? ' selected' : '') + '>' + n + 'x</option>';
  }
  return '<div class="inst-widget" data-product="' + p.id + '" data-uid="' + uid + '" data-price="' + eff.price + '">' +
    '<p class="inst-title">💳 Cabe no seu bolso?</p>' +
    '<p class="inst-product">' + p.name + '</p>' +
    '<p class="inst-price">Preço: <strong>' + formatBRL(eff.price) + '</strong> <span>— ' + eff.source + '</span></p>' +
    '<div class="inst-controls">' +
    '<label>Parcelas<select class="inst-n" aria-label="Número de parcelas">' + opts + '</select></label>' +
    '<label>Juros ao mês (%) — edite se a loja cobrar<input class="inst-rate" type="number" min="0" max="20" step="0.1" value="0" inputmode="decimal" aria-label="Juros ao mês em porcentagem"></label>' +
    '</div>' +
    '<p class="inst-result">Parcela: <strong class="inst-monthly">' + formatBRL(res.monthly) + '/mês</strong> · Total: <strong class="inst-total">' + formatBRL(res.total) + '</strong></p>' +
    '<p class="inst-compare">À vista (Pix): ' + formatBRL(eff.price) + ' · Parcelado em 12x: ' + formatBRL(res.monthly) + '/mês — total ' + formatBRL(res.total) + '</p>' +
    '<p class="inst-extra" hidden></p>' +
    '<p class="inst-note">Sem juros por padrão (0%). Se a loja cobrar juros, digite a taxa acima — o cálculo usa exatamente o valor que você informar.</p>' +
    '</div>';
}

function recalcInstallmentWidget(widget) {
  var price = parseFloat(widget.getAttribute('data-price'));
  if (!(price > 0)) return;
  var nEl = widget.querySelector('.inst-n');
  var rEl = widget.querySelector('.inst-rate');
  if (!nEl || !rEl) return;
  var n = parseInt(nEl.value, 10);
  if (isNaN(n) || n < 1) n = 1;
  if (n > 12) n = 12;
  var rate = parseFloat(String(rEl.value).replace(',', '.'));
  if (isNaN(rate) || rate < 0) rate = 0;
  var res = calcInstallment(price, n, rate);
  var monthlyEl = widget.querySelector('.inst-monthly');
  var totalEl = widget.querySelector('.inst-total');
  var compareEl = widget.querySelector('.inst-compare');
  var extraEl = widget.querySelector('.inst-extra');
  if (monthlyEl) monthlyEl.textContent = formatBRL(res.monthly) + '/mês';
  if (totalEl) totalEl.textContent = formatBRL(res.total);
  if (compareEl) {
    if (n === 1) {
      compareEl.textContent = 'À vista (Pix): ' + formatBRL(price) + ' — em 1 parcela de ' + formatBRL(res.monthly) + '.';
    } else {
      compareEl.textContent = 'À vista (Pix): ' + formatBRL(price) + ' · Parcelado em ' + n + 'x: ' + formatBRL(res.monthly) + '/mês — total ' + formatBRL(res.total) + '.';
    }
  }
  if (extraEl) {
    if (res.extra > 0.005) {
      extraEl.textContent = 'Com juros de ' + String(rate).replace('.', ',') + '% ao mês, você paga ' + formatBRL(res.extra) + ' a mais que à vista.';
      extraEl.hidden = false;
    } else {
      extraEl.textContent = '';
      extraEl.hidden = true;
    }
  }
}

/* Um único listener por contêiner (delegação): sobrevive às re-renderizações. */
function bindInstallmentContainer(container) {
  if (!container || container.__instBound) return;
  container.__instBound = true;
  function onInput(ev) {
    var t = ev && ev.target;
    if (!t || typeof t.closest !== 'function') return;
    var widget = t.closest('.inst-widget');
    if (widget) recalcInstallmentWidget(widget);
  }
  container.addEventListener('input', onInput);
  container.addEventListener('change', onInput);
}

/* ---------------- Lista de desejos (interface) ---------------- */

var wishlist = {}; /* carregada em initWishlist() */

function loadWishlist() {
  try {
    if (typeof localStorage === 'undefined') return {};
    var raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? wishlistFromJson(raw) : {};
  } catch (e) { return {}; }
}

function saveWishlist() {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(WISHLIST_KEY, wishlistToJson(wishlist));
  } catch (e) { /* sem armazenamento: a lista vive só na sessão */ }
}

function wishlistStatusLine(p, target, eff) {
  var st = wishlistStatus(p, target, eff);
  if (st.state === 'hit') {
    return '<p class="wish-status wish-hit">🎉 Já está no seu preço! Preço atual ' + formatBRL(eff.price) +
      ' ≤ sua meta de ' + formatBRL(target) + '.</p>';
  }
  if (st.state === 'gap') {
    return '<p class="wish-status wish-gap">Falta ' + formatBRL(st.gap) +
      ' para chegar no seu preço de ' + formatBRL(target) + '.</p>';
  }
  return '<p class="wish-status">Defina o preço que você quer pagar para acompanhar a queda.</p>';
}

function wishlistItemHtml(p, map) {
  var m = map || wishlist;
  var eff = effectivePrice(p);
  var target = m[p.id];
  var targetVal = target != null ? String(target) : '';
  var rating = p.ratingText ? '<p class="product-rating">⭐ ' + p.ratingText + '</p>' : '';
  return '<article class="wish-item" data-product="' + p.id + '">' +
    '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
    '<span class="wish-body">' +
    '<h3>' + p.name + '</h3>' + rating +
    '<p class="product-price">' + formatBRL(eff.price) + '<small>' + eff.source + ' — confira o preço atual na loja</small></p>' +
    wishlistStatusLine(p, target, eff) +
    '<label class="wish-target-label">Quero pagar até R$ ' +
    '<input class="wish-target" type="number" min="0" step="0.01" inputmode="decimal" value="' + targetVal + '" placeholder="Ex.: 1.200" aria-label="Preço-alvo em reais para ' + p.name + '"></label>' +
    '<span class="wish-actions"><button class="btn btn-ghost wish-remove" type="button" data-product="' + p.id + '">Remover</button></span>' +
    '</span></article>';
}

function wishlistListHtml(map) {
  var m = map || wishlist;
  var ids = Object.keys(m);
  if (!ids.length) {
    return '<p class="wish-empty">Sua lista está vazia por enquanto — toque em ♥ Salvar na lista em qualquer produto do comparador para acompanhar o preço dele aqui.</p>';
  }
  var html = '<div class="wish-list">';
  ids.forEach(function (id) {
    var p = productById(id);
    if (p) html += wishlistItemHtml(p, m);
  });
  html += '</div>';
  html += '<p class="wish-actions"><button id="wishlist-clear" class="btn btn-ghost" type="button">🗑️ Limpar lista</button></p>';
  return html;
}

/* Lê os preços-alvo digitados (mas ainda não confirmados) antes de
 * re-renderizar, para não apagar o que o visitante está digitando
 * quando os preços ao vivo chegam. */
function scrapeWishlistTargets() {
  var box = el('wishlist-items');
  if (!box || !box.querySelectorAll) return;
  var inputs = box.querySelectorAll('.wish-target');
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    var item = input.closest ? input.closest('.wish-item') : null;
    var id = item && item.getAttribute ? item.getAttribute('data-product') : null;
    if (!id || !wishlist.hasOwnProperty(id)) continue;
    var raw = String(input.value || '').replace(',', '.').trim();
    var n = parseFloat(raw);
    wishlist[id] = (isFinite(n) && n > 0) ? n : null;
  }
}

function updateWishlistCount() {
  var badge = el('wishlist-count');
  if (!badge) return;
  var n = Object.keys(wishlist).length;
  badge.textContent = String(n);
  badge.hidden = n === 0;
}

function renderWishlist() {
  var box = el('wishlist-items');
  if (!box) return;
  scrapeWishlistTargets();
  box.innerHTML = wishlistListHtml();
  updateWishlistCount();
}

/* Atualiza o rótulo de todos os botões "Salvar na lista" da página
 * (cards do comparador e cards do quiz) sem re-renderizar tudo. */
function refreshWishSaveButtons() {
  if (typeof document === 'undefined' || !document.querySelectorAll) return;
  var btns = document.querySelectorAll('.wish-save');
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    var id = b.dataset && b.dataset.product;
    if (!id) continue;
    var saved = wishlist.hasOwnProperty(id);
    if (b.classList && b.classList.toggle) b.classList.toggle('saved', saved);
    b.setAttribute('aria-pressed', saved ? 'true' : 'false');
    b.textContent = saved ? '✓ Na sua lista' : '♥ Salvar na lista';
  }
}

function toggleWishlist(productId) {
  if (!productById(productId)) return;
  wishlist = wishlistToggle(wishlist, productId);
  saveWishlist();
  renderWishlist();
  renderProducts();
  refreshWishSaveButtons();
}

/* Delegação na seção: remover item, limpar lista, preço-alvo. */
function bindWishlist() {
  var section = el('lista-desejos');
  if (!section || section.__wishBound) return;
  section.__wishBound = true;
  section.addEventListener('click', function (ev) {
    var t = ev && ev.target;
    if (!t || typeof t.closest !== 'function') return;
    var rm = t.closest('.wish-remove');
    if (rm && rm.dataset && rm.dataset.product) {
      var id = rm.dataset.product;
      if (wishlist.hasOwnProperty(id)) {
        wishlist = wishlistToggle(wishlist, id);
        saveWishlist();
        renderWishlist();
        renderProducts();
        refreshWishSaveButtons();
      }
      return;
    }
    if (t.closest('#wishlist-clear')) {
      wishlist = {};
      saveWishlist();
      renderWishlist();
      renderProducts();
      refreshWishSaveButtons();
    }
  });
  section.addEventListener('change', function (ev) {
    var t = ev && ev.target;
    if (!t || !t.classList || !t.classList.contains('wish-target')) return;
    var item = t.closest ? t.closest('.wish-item') : null;
    var id = item && item.getAttribute ? item.getAttribute('data-product') : null;
    if (!id || !wishlist.hasOwnProperty(id)) return;
    var raw = String(t.value || '').replace(',', '.').trim();
    var n = parseFloat(raw);
    wishlist = wishlistSetTarget(wishlist, id, (isFinite(n) && n > 0) ? n : null);
    saveWishlist();
    renderWishlist();
  });
}

/* Um único listener no documento para todos os botões "Salvar na lista"
 * (cards do comparador e do quiz) — sobrevive às re-renderizações. */
function initWishlist() {
  wishlist = loadWishlist();
  if (typeof document === 'undefined') return;
  if (!document.__wishSaveBound) {
    document.__wishSaveBound = true;
    document.addEventListener('click', function (ev) {
      var t = ev && ev.target;
      if (!t || typeof t.closest !== 'function') return;
      var b = t.closest('.wish-save');
      if (!b || !b.dataset || !b.dataset.product) return;
      toggleWishlist(b.dataset.product);
    });
  }
  bindWishlist();
  renderWishlist();
}

function renderProducts() {
  var grid = el('product-grid');
  grid.innerHTML = '';
  productsOf(state.cat).forEach(function (p) {
    var cell = document.createElement('div');
    cell.className = 'product-cell';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'product-card' + (state.selected.indexOf(p.id) !== -1 ? ' selected' : '');
    btn.setAttribute('aria-pressed', state.selected.indexOf(p.id) !== -1 ? 'true' : 'false');
    var rating = p.ratingText ? '<p class="product-rating">⭐ ' + p.ratingText + '</p>' : '';
    var selectedLabel = state.selected.indexOf(p.id) !== -1
      ? '✓ Selecionado para o duelo'
      : '＋ Toque para comparar';
    btn.innerHTML =
      '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
      '<span class="product-body">' +
      '<span class="product-tag">' + p.tag + '</span>' +
      '<h3>' + p.name + '</h3>' + rating + priceHtml(p) +
      '<span class="select-state">' + selectedLabel + '</span>' +
      '</span>';
    btn.addEventListener('click', function () { toggleSelect(p.id); });
    cell.appendChild(btn);
    var saved = wishlist.hasOwnProperty(p.id);
    var save = document.createElement('button');
    save.type = 'button';
    save.className = 'wish-save' + (saved ? ' saved' : '');
    save.setAttribute('aria-pressed', saved ? 'true' : 'false');
    save.setAttribute('data-product', p.id);
    save.textContent = saved ? '✓ Na sua lista' : '♥ Salvar na lista';
    cell.appendChild(save);
    grid.appendChild(cell);
  });

  var note = el('category-note');
  if (CATEGORY_NOTES[state.cat]) {
    note.textContent = CATEGORY_NOTES[state.cat];
    note.hidden = false;
  } else {
    note.hidden = true;
  }
}

function renderProfiles() {
  var box = el('profiles');
  box.innerHTML = '<p class="profiles-label">Não sabe por onde começar? Escolha um perfil:</p>';
  (PROFILES[state.cat] || []).forEach(function (prof) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'profile-chip';
    b.textContent = prof.label;
    b.addEventListener('click', function () { applyProfile(prof, b); });
    box.appendChild(b);
  });
  el('profile-reason').hidden = true;
}

function applyProfile(prof, chip) {
  if (state.selected.indexOf(prof.product) === -1) {
    if (state.selected.length >= 3) state.selected.shift();
    state.selected.push(prof.product);
  }
  var reason = el('profile-reason');
  reason.textContent = '💡 ' + prof.reason;
  reason.hidden = false;
  document.querySelectorAll('.profile-chip').forEach(function (c) { c.classList.remove('active'); });
  if (chip) chip.classList.add('active');
  renderProducts();
  renderDuel();
}

function toggleSelect(id) {
  var i = state.selected.indexOf(id);
  if (i !== -1) {
    state.selected.splice(i, 1);
  } else {
    if (state.selected.length >= 3) state.selected.shift();
    state.selected.push(id);
  }
  el('profile-reason').hidden = true;
  renderProducts();
  renderDuel();
}

function renderDuel() {
  var duel = el('duel');
  var hint = el('duel-hint');
  if (state.selected.length < 2) {
    duel.hidden = true;
    hint.hidden = false;
    var instBox = el('installments');
    if (instBox) instBox.innerHTML = '';
    return;
  }
  duel.hidden = false;
  hint.hidden = true;
  var verdict = computeVerdict(state.cat, state.selected);
  var table = el('duel-table');
  var html = '<thead><tr><th></th>';
  state.selected.forEach(function (id) {
    html += '<th>' + productById(id).name + '</th>';
  });
  html += '</tr></thead><tbody>';
  SPEC_ROWS[state.cat].forEach(function (row) {
    var anyValue = state.selected.some(function (id) {
      return rowValue(productById(id), row).text !== '—';
    });
    if (!anyValue) return;
    html += '<tr><th class="row-label" scope="row">' + row.label + '</th>';
    state.selected.forEach(function (id) {
      var p = productById(id);
      var v = rowValue(p, row);
      var best = verdict.winners[row.key] === id;
      if (row.key === 'price') {
        var live = state.live[id];
        html += '<td class="price-cell' + (best ? ' best' : '') + '">' + v.text +
          (best ? '<span class="best-badge">★ Melhor aqui</span>' : '') +
          '<small>' + (live ? 'Preço ao vivo via Shopee' : p.store + ' • ' + p.priceDate) + '</small></td>';
      } else {
        html += '<td' + (best ? ' class="best"' : '') + '>' + v.text +
          (best ? '<span class="best-badge">★ Melhor aqui</span>' : '') + '</td>';
      }
    });
    html += '</tr>';
  });
  html += '</tbody>';
  table.innerHTML = html;

  var w = verdict.winner;
  el('verdict').innerHTML = '<h3>🏆 Veredito: ' + w.name + '</h3><p>' +
    'Venceu em ' + verdict.counts[w.id] + ' quesito(s)' +
    (verdict.wonRows.length ? ' (' + verdict.wonRows.join(', ') + ')' : '') +
    (verdict.tied ? ' — empate em selos, desempate pela nota do guia e pelo menor preço.' : '.') +
    ' Preços com data de observação — confira o preço atual na loja antes de comprar.</p>';
  renderInstallments();
}

/* Um widget "Cabe no seu bolso?" por produto do duelo. */
function renderInstallments() {
  var box = el('installments');
  if (!box) return;
  var html = '<h3>💳 Cabe no seu bolso?</h3>' +
    '<p class="inst-intro">Simule as parcelas de cada produto do duelo. Por padrão, sem juros (0%) — edite a taxa se a loja cobrar.</p>' +
    '<div class="inst-grid">';
  state.selected.forEach(function (id) {
    var p = productById(id);
    html += installmentWidgetHtml(p, 'duel-' + id, effectivePrice(p));
  });
  html += '</div>';
  box.innerHTML = html;
  bindInstallmentContainer(box);
}

function copySummary() {
  var text = buildSummary(state.cat, state.selected);
  function done() {
    var fb = el('copy-feedback');
    fb.hidden = false;
    setTimeout(function () { fb.hidden = true; }, 4000);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
  } else {
    fallbackCopy(text);
    done();
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* o usuário copia manualmente */ }
  document.body.removeChild(ta);
}

/* Preço ao vivo via /api/shopee (quando configurado na Vercel). */
function fetchLivePrices() {
  var status = el('live-status');
  var products = productsOf(state.cat);
  var pending = products.length;
  var anyLive = false;
  if (!window.fetch) {
    status.textContent = 'Preços do guia (Out/2026 e 26/10/2026) — confira o preço atual na loja.';
    return;
  }
  products.forEach(function (p) {
    var minP = p.price ? Math.floor(p.price * 0.5) : 0;
    fetch('/api/shopee?keyword=' + encodeURIComponent(p.name) + '&minPrice=' + minP)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.configured) {
          state.liveConfigured = true;
          var offer = matchOffer(p, data.offers || []);
          if (offer && offer.priceMin != null) {
            var price = Number(offer.priceMin);
            if (price > 100000) price = price / 100; /* centavos, se vier assim */
            state.live[p.id] = { price: price, offerLink: offer.offerLink || null };
            anyLive = true;
          }
        } else {
          state.liveConfigured = false;
        }
      })
      .catch(function () { /* sem preço ao vivo: mantém o preço do guia */ })
      .finally(function () {
        pending--;
        if (pending === 0) {
          if (state.liveConfigured && anyLive) {
            status.textContent = '✅ Preços ao vivo via API da Shopee — valores conferidos agora.';
            status.classList.add('live');
          } else {
            status.textContent = 'Preço ao vivo em breve — os valores abaixo são do guia (Out/2026 e 26/10/2026). Confira o preço atual na loja.';
          }
          renderProducts();
          renderDuel();
          renderWishlist();
        }
      });
  });
}

/* ---------------- Quiz (interface) ---------------- */

function renderQuizCats() {
  var box = el('quiz-cats');
  box.innerHTML = '';
  CATEGORIES.forEach(function (c) {
    var icon = c.id === 'celulares' ? '📱 ' : c.id === 'notebooks' ? '💻 ' : c.id === 'tvs' ? '📺 ' : '🍳 ';
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'quiz-cat';
    b.textContent = icon + c.label;
    b.addEventListener('click', function () { startQuiz(c.id); });
    box.appendChild(b);
  });
}

function startQuiz(cat) {
  quizState = { cat: cat, step: 0, answers: [] };
  el('quiz-result').hidden = true;
  el('quiz-box').hidden = false;
  renderQuizQuestion();
}

function quizCatLabel() {
  var c = CATEGORIES.filter(function (x) { return x.id === quizState.cat; })[0];
  return c ? c.label : '';
}

function renderQuizQuestion() {
  var questions = QUIZ[quizState.cat];
  var q = questions[quizState.step];
  el('quiz-progress').textContent = 'Pergunta ' + (quizState.step + 1) + ' de ' + questions.length + ' • ' + quizCatLabel();
  el('quiz-question').textContent = q.text;
  var box = el('quiz-options');
  box.innerHTML = '';
  q.options.forEach(function (opt, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'quiz-option';
    b.textContent = opt.label;
    b.addEventListener('click', function () { answerQuiz(i); });
    box.appendChild(b);
  });
}

function answerQuiz(optIdx) {
  quizState.answers[quizState.step] = optIdx;
  if (quizState.step < QUIZ[quizState.cat].length - 1) {
    quizState.step++;
    renderQuizQuestion();
  } else {
    showQuizResult();
  }
}

function quizBack() {
  if (quizState.step > 0) {
    quizState.step--;
    renderQuizQuestion();
  } else {
    el('quiz-box').hidden = true;
    el('quiz-result').hidden = true;
  }
}

function quizRestart() {
  el('quiz-box').hidden = true;
  el('quiz-result').hidden = true;
  quizState = { cat: null, step: 0, answers: [] };
}

function showQuizResult() {
  var result = scoreQuiz(quizState.cat, quizState.answers);
  el('quiz-box').hidden = true;
  var box = el('quiz-result');
  var html = '<h3>🎯 Nossas indicações para você</h3>';
  if (result.overBudget) {
    var cheapest = productsOf(quizState.cat).slice().sort(function (a, b) { return a.price - b.price; })[0];
    html += '<p class="quiz-note">⚠️ Nenhum modelo do nosso catálogo cabe em ' + formatBRL(result.budgetMax) +
      ' — o mais próximo é <strong>' + cheapest.name + '</strong>, por ' + formatBRL(cheapest.price) +
      ' (' + cheapest.store + ', ' + cheapest.priceDate + '). As indicações abaixo são as que mais combinam com o resto das suas respostas.</p>';
  }
  html += '<div class="quiz-result-cards">';
  result.top.forEach(function (id, i) {
    var p = productById(id);
    var r = result.ranked.filter(function (x) { return x.id === id; })[0];
    var rating = p.ratingText ? '<p class="product-rating">⭐ ' + p.ratingText + '</p>' : '';
    html += '<article class="quiz-result-card">' +
      '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
      '<span class="product-body">' +
      '<span class="quiz-rank">' + (i === 0 ? '🥇 1ª indicação' : '🥈 2ª indicação') + '</span>' +
      '<h3>' + p.name + '</h3>' + rating + priceHtml(p) +
      '<button class="wish-save' + (wishlist.hasOwnProperty(p.id) ? ' saved' : '') + '" type="button" data-product="' + p.id + '" aria-pressed="' + (wishlist.hasOwnProperty(p.id) ? 'true' : 'false') + '">' + (wishlist.hasOwnProperty(p.id) ? '✓ Na sua lista' : '♥ Salvar na lista') + '</button>' +
      installmentWidgetHtml(p, 'quiz-' + id, effectivePrice(p)) +
      '<ul class="quiz-reasons">' + r.reasons.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>' +
      '</span></article>';
  });
  html += '</div>';
  html += '<div class="quiz-actions">' +
    '<button id="quiz-compare" class="btn btn-primary" type="button">⚔️ Comparar esses dois</button>' +
    '<button id="quiz-redo" class="btn btn-ghost" type="button">↩️ Refazer o quiz</button>' +
    '</div>';
  box.innerHTML = html;
  box.hidden = false;
  bindInstallmentContainer(box);
  el('quiz-compare').addEventListener('click', compareQuizPicks);
  el('quiz-redo').addEventListener('click', quizRestart);
}

/* ------------------------------------------------------------------ */
/* Calculadora de tamanho ideal de TV                                  */
/* ------------------------------------------------------------------ */

/* Fórmula da Samsung (guia oficial, ver pesquisa): distância ideal =
 * tamanho da tela × 1,2, dentro de um campo de visão de 30° a 40°.
 * Faixa confortável: do ideal (×1,2, o mais perto recomendado) até o
 * limite de 30° de campo de visão, em que a distância é
 * D / (2 × tan 15°) = D × 1,866.
 * Tela 16:9: largura = diagonal × 0,8716; altura = diagonal × 0,4903
 * (16/√337 e 9/√337). Tamanhos comerciais: 43/50/55/65/75/85". */
var TV_SIZES = [43, 50, 55, 65, 75, 85];
var INCH_M = 0.0254;

function tvIdealDistanceM(sizeIn) { return sizeIn * 1.2 * INCH_M; }
function tvDistanceRangeM(sizeIn) {
  return { min: sizeIn * 1.2 * INCH_M, max: sizeIn * 1.8660254 * INCH_M };
}
function tvDimensions(sizeIn) {
  return { widthCm: sizeIn * 0.8716 * 2.54, heightCm: sizeIn * 0.4903 * 2.54 };
}
function tvIdealSizeIn(distanceM) { return distanceM / INCH_M / 1.2; }
function tvNearestSize(idealIn) {
  var best = TV_SIZES[0];
  TV_SIZES.forEach(function (s) {
    if (Math.abs(s - idealIn) < Math.abs(best - idealIn)) best = s;
  });
  return best;
}

function fmtNumPt(value, decimals) {
  return value.toFixed(decimals).replace('.', ',');
}

var tvSizeState = { mode: 'distance', distance: 2.0, size: null };

/* HTML do resultado (puro, dados os modos) — usado pelo render e pelos testes. */
function tvSizeResultHtmlFor(mode, distance, size) {
  var recSize, recLine;
  if (mode === 'size' && size) {
    recSize = size;
    recLine = '📺 TV de ' + size + ' polegadas: distância ideal de ' + fmtNumPt(tvIdealDistanceM(size), 2) + ' m.';
  } else {
    var ideal = tvIdealSizeIn(distance);
    recSize = tvNearestSize(ideal);
    recLine = '🛋️ Para ' + fmtNumPt(distance, 2) + ' m de distância, o tamanho ideal é de ~' +
      fmtNumPt(ideal, 1) + ' polegadas.';
  }
  var range = tvDistanceRangeM(recSize);
  var dims = tvDimensions(recSize);
  var html = '<p class="tv-rec">' + recLine + '</p>';
  if (mode !== 'size') {
    html += '<p class="tv-nearest">Tamanho comercial mais próximo: <strong>' + recSize + ' polegadas</strong>.</p>';
  }
  html += '<ul class="tv-facts">' +
    '<li>Distância ideal (Samsung): <strong>' + fmtNumPt(range.min, 2) + ' m</strong></li>' +
    '<li>Faixa confortável: de <strong>' + fmtNumPt(range.min, 2) + ' m</strong> a <strong>' + fmtNumPt(range.max, 2) + ' m</strong></li>' +
    '<li>Largura da tela: <strong>' + fmtNumPt(dims.widthCm, 1) + ' cm</strong> · Altura da tela: <strong>' + fmtNumPt(dims.heightCm, 1) + ' cm</strong></li>' +
    '</ul>' +
    '<p class="tv-note">💡 É uma recomendação, não uma regra: mais perto que o mínimo, a tela enche a visão e pode cansar os olhos; mais longe que o máximo, a tela parece pequena e você perde os detalhes.</p>';
  if (recSize === 50) {
    var tvs = productsOf('tvs');
    html += '<div class="tv-catalog"><h4>📺 No nosso catálogo, as TVs de 50" com preço verificado são:</h4>' +
      '<div class="tv-catalog-list">';
    tvs.forEach(function (p) {
      var eff = effectivePrice(p);
      html += '<div class="tv-catalog-item">' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
        '<span><strong>' + p.name + '</strong><br>' + formatBRL(eff.price) + ' — ' + eff.source + '</span>' +
        '</div>';
    });
    html += '</div>' +
      '<button id="tv-size-compare" class="btn btn-primary" type="button">⚔️ Comparar essas TVs</button></div>';
  } else {
    html += '<div class="tv-catalog"><p>Nosso catálogo tem TVs de 50 polegadas com preço verificado — veja a categoria de TVs do comparador.</p>' +
      '<button id="tv-size-catalog" class="btn btn-primary" type="button">📺 Ver as TVs de 50"</button></div>';
  }
  return html;
}

function renderTvSize() {
  var box = el('tv-size-result');
  if (!box) return;
  box.innerHTML = tvSizeResultHtmlFor(tvSizeState.mode, tvSizeState.distance, tvSizeState.size);
  var out = el('tv-size-dist-out');
  if (out) out.textContent = fmtNumPt(tvSizeState.distance, 2) + ' m';
  var slider = el('tv-size-dist');
  if (slider) slider.value = String(tvSizeState.distance);
  var num = el('tv-size-dist-num');
  if (num) num.value = String(tvSizeState.distance);
  document.querySelectorAll('.tv-size-btn').forEach(function (b) {
    b.classList.toggle('active', tvSizeState.mode === 'size' && parseInt(b.dataset.size, 10) === tvSizeState.size);
  });
  var cmp = el('tv-size-compare');
  if (cmp) cmp.addEventListener('click', compareTvPicks);
  var cat = el('tv-size-catalog');
  if (cat) cat.addEventListener('click', showTvsCategory);
}

function compareTvPicks() {
  state.cat = 'tvs';
  state.selected = ['semp-s42', 'philips-50pug7300'];
  renderTabs();
  renderProfiles();
  renderProducts();
  renderDuel();
  fetchLivePrices();
  var target = el('comparador');
  if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth' });
}

function showTvsCategory() {
  switchCategory('tvs');
  var target = el('comparador');
  if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth' });
}

function initTvSize() {
  var slider = el('tv-size-dist');
  if (slider) slider.addEventListener('input', function (e) {
    var d = parseFloat(e.target.value);
    if (isNaN(d)) return;
    tvSizeState.mode = 'distance';
    tvSizeState.distance = d;
    tvSizeState.size = null;
    renderTvSize();
  });
  var num = el('tv-size-dist-num');
  if (num) num.addEventListener('change', function (e) {
    var d = parseFloat(String(e.target.value).replace(',', '.'));
    if (isNaN(d)) d = 2.0;
    if (d < 0.5) d = 0.5;
    if (d > 5) d = 5;
    tvSizeState.mode = 'distance';
    tvSizeState.distance = d;
    tvSizeState.size = null;
    renderTvSize();
  });
  var pick = el('tv-size-pick');
  if (pick) pick.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.tv-size-btn') : null;
    if (!btn || !btn.dataset) return;
    var s = parseInt(btn.dataset.size, 10);
    if (TV_SIZES.indexOf(s) === -1) return;
    tvSizeState.mode = 'size';
    tvSizeState.size = s;
    renderTvSize();
  });
  renderTvSize();
}

function compareQuizPicks() {
  var result = scoreQuiz(quizState.cat, quizState.answers);
  state.cat = quizState.cat;
  state.selected = result.top.slice(0, 2);
  renderTabs();
  renderProfiles();
  renderProducts();
  renderDuel();
  fetchLivePrices();
  var target = el('comparador');
  if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth' });
}

function switchCategory(cat) {
  state.cat = cat;
  state.selected = [];
  renderTabs();
  renderProfiles();
  renderProducts();
  renderDuel();
  fetchLivePrices();
}

function init() {
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { switchCategory(t.dataset.cat); });
  });
  el('copy-summary').addEventListener('click', copySummary);
  el('clear-duel').addEventListener('click', function () {
    state.selected = [];
    renderProducts();
    renderDuel();
  });
  el('quiz-back').addEventListener('click', quizBack);
  el('quiz-restart').addEventListener('click', quizRestart);
  renderTabs();
  renderProfiles();
  renderProducts();
  renderDuel();
  renderQuizCats();
  initTvSize();
  initWishlist();
  fetchLivePrices();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

/* Exporta as funções puras para testes em Node. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CATEGORIES: CATEGORIES,
    PRODUCTS: PRODUCTS, SPEC_ROWS: SPEC_ROWS, PROFILES: PROFILES, QUIZ: QUIZ,
    formatBRL: formatBRL, productById: productById, productsOf: productsOf,
    rowValue: rowValue, computeWinners: computeWinners,
    computeVerdict: computeVerdict, buildSummary: buildSummary,
    scoreQuiz: scoreQuiz,
    calcInstallment: calcInstallment,
    TV_SIZES: TV_SIZES,
    tvIdealDistanceM: tvIdealDistanceM, tvDistanceRangeM: tvDistanceRangeM,
    tvDimensions: tvDimensions, tvIdealSizeIn: tvIdealSizeIn,
    tvNearestSize: tvNearestSize, tvSizeResultHtmlFor: tvSizeResultHtmlFor,
    installmentWidgetHtml: installmentWidgetHtml,
    recalcInstallmentWidget: recalcInstallmentWidget,
    bindInstallmentContainer: bindInstallmentContainer,
    WISHLIST_KEY: WISHLIST_KEY,
    wishlistFromJson: wishlistFromJson, wishlistToJson: wishlistToJson,
    wishlistStatus: wishlistStatus, wishlistToggle: wishlistToggle,
    wishlistSetTarget: wishlistSetTarget,
    wishlistStatusLine: wishlistStatusLine,
    wishlistItemHtml: wishlistItemHtml, wishlistListHtml: wishlistListHtml,
    loadWishlist: loadWishlist, saveWishlist: saveWishlist,
    renderWishlist: renderWishlist, toggleWishlist: toggleWishlist,
    initWishlist: initWishlist,
    nameTokens: nameTokens, matchOffer: matchOffer
  };
}


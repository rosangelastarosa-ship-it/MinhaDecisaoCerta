const fs = require('fs');
const path = require('path');

const cssContent = /* ==========================================================================
   ESPECIAL BLACK FRIDAY 2026 — MINHA DECISÃO CERTA
   Visual Identity:
   - Deep Navy: #101828
   - Editorial Royal Blue: #2146B7
   - High-CTR Accent Orange: #F65B00
   - White: #FFFFFF
   - Verified Deal Green: #16A34A
   - Border subtle: #E2E8F0
   - Modern Typography: Plus Jakarta Sans + Inter
   ========================================================================== */

:root {
  --bf-navy: #101828;
  --bf-navy-light: #1e293b;
  --bf-blue: #2146b7;
  --bf-blue-hover: #1b3894;
  --bf-orange: #f65b00;
  --bf-orange-hover: #dc4f00;
  --bf-green: #16a34a;
  --bf-green-bg: #ecfdf5;
  --bf-green-border: #86efac;
  --bf-surface: #ffffff;
  --bf-bg-canvas: #f8fafc;
  --bf-text-dark: #0f172a;
  --bf-text-body: #334155;
  --bf-text-muted: #64748b;
  --bf-border: #e2e8f0;
  --bf-shadow-card: 0 4px 20px -2px rgba(16, 24, 40, 0.08);
  --bf-shadow-hover: 0 16px 32px -4px rgba(16, 24, 40, 0.14);
}

/* Base resets & typography for special */
.bf-page-wrapper {
  background-color: var(--bf-bg-canvas);
  color: var(--bf-text-body);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
}

/* Home / Promo Banner */
.bf-home-banner {
  background: linear-gradient(135deg, #101828 0%, #172554 60%, #1e3a8a 100%);
  color: #ffffff;
  border-radius: 16px;
  padding: 2.25rem 2rem;
  margin: 2.5rem auto 1.5rem auto;
  max-width: 1200px;
  box-shadow: 0 12px 30px -5px rgba(16, 24, 40, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .bf-home-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2.5rem 3rem;
  }
}

.bf-home-banner::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(246, 91, 0, 0.25) 0%, rgba(246, 91, 0, 0) 70%);
  pointer-events: none;
}

.bf-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(246, 91, 0, 0.18);
  color: #ffedd5;
  border: 1px solid rgba(246, 91, 0, 0.4);
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.bf-home-banner h2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.85rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  margin-bottom: 0.5rem;
}

.bf-home-banner p {
  color: #cbd5e1;
  font-size: 1.05rem;
  max-width: 650px;
  line-height: 1.6;
}

.bf-btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: var(--bf-orange);
  color: #ffffff !important;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.95rem 1.85rem;
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(246, 91, 0, 0.4);
  white-space: nowrap;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.bf-btn-cta:hover {
  background-color: var(--bf-orange-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(246, 91, 0, 0.5);
  color: #ffffff !important;
}

/* Hero Section (Hub & Articles) */
.bf-hero {
  background: linear-gradient(180deg, #101828 0%, #0d1522 100%);
  color: #ffffff;
  padding: 4.5rem 1.5rem 4rem;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.bf-hero-container {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.bf-hero h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  margin: 1.25rem 0 1.25rem;
}

@media (min-width: 768px) {
  .bf-hero h1 {
    font-size: 3rem;
  }
}

.bf-hero-sub {
  font-size: 1.18rem;
  color: #cbd5e1;
  max-width: 780px;
  margin: 0 auto 1.75rem;
  line-height: 1.65;
}

.bf-meta-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  font-size: 0.9rem;
  color: #94a3b8;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.bf-meta-strip span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Breadcrumbs */
.bf-breadcrumbs {
  max-width: 1200px;
  margin: 1.25rem auto 0;
  padding: 0 1.5rem;
  font-size: 0.88rem;
  color: #64748b;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.bf-breadcrumbs a {
  color: var(--bf-blue);
  text-decoration: none;
}

.bf-breadcrumbs a:hover {
  text-decoration: underline;
}

.bf-breadcrumbs span.separator {
  color: #94a3b8;
}

/* Editorial Trust Card */
.bf-trust-box {
  background: #ffffff;
  border: 1px solid var(--bf-border);
  border-left: 5px solid var(--bf-blue);
  border-radius: 12px;
  padding: 1.5rem 1.75rem;
  margin: 2rem auto;
  max-width: 1000px;
  box-shadow: var(--bf-shadow-card);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .bf-trust-box {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.bf-trust-text h3 {
  font-size: 1.15rem;
  color: var(--bf-text-dark);
  margin-bottom: 0.35rem;
}

.bf-trust-text p {
  font-size: 0.92rem;
  color: var(--bf-text-muted);
  line-height: 1.5;
  margin: 0;
}

/* Category Grid (Hub) */
.bf-guides-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}

@media (min-width: 768px) {
  .bf-guides-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.bf-guide-card {
  background: var(--bf-surface);
  border: 1px solid var(--bf-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--bf-shadow-card);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
}

.bf-guide-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--bf-shadow-hover);
  border-color: #cbd5e1;
}

.bf-guide-img-wrapper {
  position: relative;
  height: 240px;
  background: #0f172a;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bf-guide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.bf-tag-overlay {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(16, 24, 40, 0.85);
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.bf-guide-body {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.bf-guide-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--bf-text-dark);
  line-height: 1.35;
  margin-bottom: 0.85rem;
}

.bf-guide-desc {
  font-size: 0.98rem;
  color: var(--bf-text-body);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.bf-guide-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.25rem;
  border-top: 1px solid var(--bf-border);
}

.bf-guide-link {
  color: var(--bf-blue);
  font-weight: 700;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}

.bf-guide-link:hover {
  color: var(--bf-blue-hover);
  text-decoration: underline;
}

/* Future Categories Grid */
.bf-future-section {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--bf-border);
  padding: 2.5rem 2rem;
  max-width: 1200px;
  margin: 3.5rem auto 4rem;
  box-shadow: var(--bf-shadow-card);
}

.bf-future-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 1.75rem;
}

.bf-future-card {
  background: #f8fafc;
  border: 1px solid var(--bf-border);
  border-radius: 10px;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s ease;
}

.bf-future-card:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.bf-future-icon {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--bf-blue);
  flex-shrink: 0;
}

.bf-future-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--bf-text-dark);
}

.bf-future-badge {
  font-size: 0.72rem;
  color: #64748b;
  display: block;
  margin-top: 2px;
}

/* Article Editorial Content */
.bf-article-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.bf-article-content h2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.85rem;
  color: var(--bf-text-dark);
  margin: 3rem 0 1.25rem;
  line-height: 1.3;
}

.bf-article-content h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.4rem;
  color: var(--bf-text-dark);
  margin: 2rem 0 0.85rem;
  line-height: 1.35;
}

.bf-article-content p {
  font-size: 1.08rem;
  line-height: 1.75;
  color: var(--bf-text-body);
  margin-bottom: 1.5rem;
}

.bf-article-content ul, .bf-article-content ol {
  margin: 1.25rem 0 1.75rem 1.5rem;
  font-size: 1.05rem;
  line-height: 1.75;
}

.bf-article-content li {
  margin-bottom: 0.5rem;
}

/* Responsive Comparison Table */
.bf-table-container {
  background: #ffffff;
  border: 1px solid var(--bf-border);
  border-radius: 14px;
  margin: 2.5rem 0;
  box-shadow: var(--bf-shadow-card);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.bf-comparison-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.92rem;
}

.bf-comparison-table th, .bf-comparison-table td {
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid var(--bf-border);
}

.bf-comparison-table th {
  background-color: #101828;
  color: #ffffff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.bf-comparison-table tr:last-child td {
  border-bottom: none;
}

.bf-comparison-table tr:hover td {
  background-color: #f8fafc;
}

.bf-table-prod-name {
  font-weight: 700;
  color: var(--bf-text-dark);
}

.bf-table-tag {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 4px;
}

.bf-tag-best {
  background: #fef3c7;
  color: #92400e;
}

.bf-tag-budget {
  background: #ecfdf5;
  color: #065f46;
}

.bf-tag-gamer {
  background: #ede9fe;
  color: #5b21b6;
}

/* Individual Product Cards */
.bf-product-box {
  background: #ffffff;
  border: 1px solid var(--bf-border);
  border-radius: 16px;
  padding: 2.25rem 2rem;
  margin: 3rem 0;
  box-shadow: var(--bf-shadow-card);
  position: relative;
}

.bf-product-box.highlight {
  border: 2px solid var(--bf-blue);
}

.bf-product-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--bf-border);
  padding-bottom: 1.75rem;
}

@media (min-width: 768px) {
  .bf-product-header {
    flex-direction: row;
    align-items: center;
  }
}

.bf-product-thumb {
  width: 100%;
  max-width: 220px;
  height: 180px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--bf-border);
  margin: 0 auto;
}

.bf-product-thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.bf-product-meta {
  flex-grow: 1;
}

.bf-product-badge {
  display: inline-block;
  background: var(--bf-blue);
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 9999px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.bf-product-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--bf-text-dark);
  margin-bottom: 0.35rem;
}

.bf-product-subtitle {
  font-size: 0.95rem;
  color: var(--bf-text-muted);
}

/* Specs Grid */
.bf-specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--bf-border);
  margin: 1.5rem 0;
}

.bf-spec-item strong {
  display: block;
  font-size: 0.78rem;
  color: var(--bf-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.bf-spec-item span {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--bf-text-dark);
}

/* Pros and Cons */
.bf-pros-cons-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin: 1.75rem 0;
}

@media (min-width: 768px) {
  .bf-pros-cons-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.bf-pros-box, .bf-cons-box {
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid;
}

.bf-pros-box {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.bf-cons-box {
  background: #fef2f2;
  border-color: #fecaca;
}

.bf-pros-box h4, .bf-cons-box h4 {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bf-pros-box h4 { color: #166534; }
.bf-cons-box h4 { color: #991b1b; }

.bf-pros-box ul, .bf-cons-box ul {
  margin: 0 0 0 1.25rem;
  padding: 0;
  font-size: 0.92rem;
  line-height: 1.6;
}

.bf-pros-box li { color: #14532d; margin-bottom: 0.4rem; }
.bf-cons-box li { color: #7f1d1d; margin-bottom: 0.4rem; }

/* Pricing & Affiliate CTAs */
.bf-price-cta-panel {
  background: #f8fafc;
  border: 1px solid var(--bf-border);
  border-radius: 14px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.bf-price-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .bf-price-header {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
  }
}

.bf-verified-price-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bf-green-bg);
  color: var(--bf-green);
  border: 1px solid var(--bf-green-border);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
}

.bf-price-val {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--bf-text-dark);
}

.bf-price-note {
  font-size: 0.82rem;
  color: var(--bf-text-muted);
}

/* 3 Store Buttons */
.bf-affiliate-buttons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
}

@media (min-width: 640px) {
  .bf-affiliate-buttons {
    grid-template-columns: repeat(3, 1fr);
  }
}

.bf-btn-store {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.88rem;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.bf-btn-amazon {
  background: #232f3e;
  color: #ff9900 !important;
}
.bf-btn-amazon:hover {
  background: #131921;
  color: #ffaa1d !important;
  transform: translateY(-2px);
}

.bf-btn-shopee {
  background: #ee4d2d;
  color: #ffffff !important;
}
.bf-btn-shopee:hover {
  background: #d73211;
  color: #ffffff !important;
  transform: translateY(-2px);
}

.bf-btn-mercadolivre {
  background: #ffe600;
  color: #2d3277 !important;
  border-color: #e5ce00;
}
.bf-btn-mercadolivre:hover {
  background: #edd500;
  color: #1a1e4a !important;
  transform: translateY(-2px);
}

.bf-btn-disabled {
  background: #e2e8f0;
  color: #94a3b8 !important;
  cursor: not-allowed;
  pointer-events: none;
}

/* Disclosure Callout */
.bf-affiliate-disclosure {
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  font-size: 0.84rem;
  color: #64748b;
  line-height: 1.5;
  margin: 1.75rem 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.bf-affiliate-disclosure svg {
  flex-shrink: 0;
  margin-top: 2px;
}

/* FAQ Accordion / Box */
.bf-faq-section {
  margin: 3.5rem 0;
}

.bf-faq-item {
  background: #ffffff;
  border: 1px solid var(--bf-border);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
}

.bf-faq-item h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--bf-text-dark);
  margin-bottom: 0.5rem;
}

.bf-faq-item p {
  font-size: 0.98rem;
  color: var(--bf-text-body);
  margin: 0;
  line-height: 1.6;
}

/* Author Box */
.bf-author-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: #ffffff;
  border: 1px solid var(--bf-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 3.5rem 0;
}

.bf-author-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #101828;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.bf-author-info h4 {
  font-size: 1.05rem;
  color: var(--bf-text-dark);
  margin-bottom: 0.25rem;
}

.bf-author-info p {
  font-size: 0.88rem;
  color: var(--bf-text-muted);
  margin: 0;
  line-height: 1.4;
}
;

fs.writeFileSync('css/black-friday.css', cssContent, 'utf8');
console.log('css/black-friday.css successfully created!');

document.addEventListener('DOMContentLoaded', () => {
  const key = (document.body.dataset.project || '').toLowerCase();
  const project = window.MAIS_PROJECTS?.[key];
  const root = document.getElementById('projectApp');

  if (!project || !root) {
    if (root) root.innerHTML = '<main class="project-main"><div class="project-container"><h1>Projeto não encontrado</h1><p><a href="../../index.html#projetos">Voltar aos projetos</a></p></div></main>';
    return;
  }

  const imagePath = (image) => image;
  const whatsapp = 'https://wa.me/5534998887604?text=' + encodeURIComponent(`Olá! Vi o projeto ${project.title} no site da Mais Soluções e gostaria de mais informações.`);
  document.title = `${project.title} | Mais Soluções`;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.content = project.summary;
  const canonicalUrl = `https://maissolucoes.engtec.br${window.location.pathname}`;
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;
  let openGraphUrl = document.querySelector('meta[property="og:url"]');
  if (!openGraphUrl) {
    openGraphUrl = document.createElement('meta');
    openGraphUrl.setAttribute('property', 'og:url');
    document.head.appendChild(openGraphUrl);
  }
  openGraphUrl.content = canonicalUrl;

  root.innerHTML = `
    <div class="project-shell">
      <header class="project-header" id="projectHeader">
        <div class="project-container project-header-inner">
          <a class="project-logo" href="../../index.html" aria-label="Mais Soluções — início"><img src="../../logo.png" alt="Mais Soluções"></a>
          <a class="project-back" href="../../index.html#projetos"><i data-lucide="arrow-left"></i><span>Voltar aos projetos</span></a>
        </div>
      </header>
      <main>
        <section class="project-hero">
          <div class="project-hero-media"><img src="${imagePath(project.images[0])}" alt="${project.title}"></div>
          <div class="project-container project-hero-content project-reveal">
            <nav class="project-breadcrumb" aria-label="Navegação estrutural"><a href="../../index.html">Início</a><span>/</span><a href="../../index.html#projetos">Projetos</a><span>/</span><span aria-current="page">${project.title}</span></nav>
            <span class="project-badge">${project.category}</span>
            <h1 class="project-title">${project.title}</h1>
            <p class="project-lead">${project.summary}</p>
          </div>
        </section>
        <section class="project-main">
          <div class="project-container">
            <div class="project-overview project-reveal">
              <div>
                <span class="project-kicker">Sobre a obra</span>
                <h2 class="project-heading">Planejamento e execução em cada detalhe</h2>
                <p class="project-copy">${project.description}</p>
                ${project.highlights?.length ? `<div class="project-highlights" aria-label="Escopo e números da obra">${project.highlights.map((item) => `<div class="project-highlight"><i data-lucide="check"></i><span>${item}</span></div>`).join('')}</div>` : ''}
              </div>
              <aside class="project-meta" aria-label="Informações da obra">
                <div class="project-meta-row"><span class="project-meta-label">Segmento</span><span class="project-meta-value">${project.category}</span></div>
                <div class="project-meta-row"><span class="project-meta-label">Localização</span><span class="project-meta-value">${project.location}</span></div>
                <div class="project-meta-row"><span class="project-meta-label">Galeria</span><span class="project-meta-value">${project.images.length} imagens</span></div>
              </aside>
            </div>
            <section class="project-gallery project-reveal" aria-labelledby="galleryTitle">
              <div class="project-gallery-head"><div><span class="project-kicker">Galeria</span><h2 class="project-gallery-title" id="galleryTitle">Conheça o projeto</h2></div><span class="project-gallery-count">Clique para ampliar</span></div>
              <div class="project-grid">${project.images.map((image, index) => `<button class="project-photo" type="button" data-index="${index}" aria-label="Ampliar imagem ${index + 1} de ${project.images.length}"><img src="${imagePath(image)}" alt="${project.title} — imagem ${index + 1}" loading="${index < 3 ? 'eager' : 'lazy'}"></button>`).join('')}</div>
            </section>
            <aside class="project-cta project-reveal"><div><h2>Tem um projeto semelhante?</h2><p>Converse com nossa equipe sobre planejamento, execução e possibilidades.</p></div><a class="project-cta-button" href="${whatsapp}" target="_blank" rel="noopener">Falar com especialista <i data-lucide="arrow-up-right"></i></a></aside>
          </div>
        </section>
      </main>
      <footer class="project-footer"><div class="project-container project-footer-inner"><span>© 2026 Mais Soluções Engenharia</span><a href="mailto:comercial@maissolucoes.eng.br">comercial@maissolucoes.eng.br</a></div></footer>
    </div>
    <div class="project-lightbox" id="projectLightbox" aria-hidden="true"><div class="project-lightbox-backdrop" data-close></div><div class="project-lightbox-content" role="dialog" aria-modal="true" aria-label="Visualização ampliada"><button class="project-lightbox-close" type="button" aria-label="Fechar" data-close><i data-lucide="x"></i></button><button class="project-lightbox-nav project-lightbox-prev" type="button" aria-label="Imagem anterior"><i data-lucide="chevron-left"></i></button><img class="project-lightbox-image" alt=""><button class="project-lightbox-nav project-lightbox-next" type="button" aria-label="Próxima imagem"><i data-lucide="chevron-right"></i></button><span class="project-lightbox-caption"></span></div></div>`;

  window.lucide?.createIcons();
  const header = document.getElementById('projectHeader');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.project-reveal').forEach((element) => revealObserver.observe(element));

  const lightbox = document.getElementById('projectLightbox');
  const lightboxImage = lightbox.querySelector('.project-lightbox-image');
  const lightboxCaption = lightbox.querySelector('.project-lightbox-caption');
  let currentIndex = 0;
  let returnFocus = null;

  const showImage = (index) => {
    currentIndex = (index + project.images.length) % project.images.length;
    lightboxImage.src = imagePath(project.images[currentIndex]);
    lightboxImage.alt = `${project.title} — imagem ${currentIndex + 1}`;
    lightboxCaption.textContent = `${currentIndex + 1} / ${project.images.length}`;
  };
  const openLightbox = (index, trigger) => {
    returnFocus = trigger;
    showImage(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('project-lightbox-open');
    lightbox.querySelector('.project-lightbox-close').focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('project-lightbox-open');
    returnFocus?.focus();
  };
  document.querySelectorAll('.project-photo').forEach((button) => button.addEventListener('click', () => openLightbox(Number(button.dataset.index), button)));
  lightbox.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', closeLightbox));
  lightbox.querySelector('.project-lightbox-prev').addEventListener('click', () => showImage(currentIndex - 1));
  lightbox.querySelector('.project-lightbox-next').addEventListener('click', () => showImage(currentIndex + 1));
  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('active')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    if (event.key === 'Tab') {
      const controls = [...lightbox.querySelectorAll('button')];
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
});

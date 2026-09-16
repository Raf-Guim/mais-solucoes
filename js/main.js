document.addEventListener('DOMContentLoaded', () => {
  window.lucide?.createIcons();

  const header = document.getElementById('header');
  const hero = document.querySelector('.hero');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  // Header fica sempre colado e visível — só alterna o fundo mais opaco
  // quando a página já rolou um pouco (efeito ativado no CSS via .scrolled).
  let headerTicking = false;

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

  function onScroll() {
    if (headerTicking) return;
    headerTicking = true;
    requestAnimationFrame(() => {
      updateHeaderState();
      headerTicking = false;
    });
  }

  updateHeaderState();

  window.addEventListener('scroll', onScroll, { passive: true });

  // Hero — card "obra em destaque": o tamanho de referência (990px, cerca de
  // 16:10) foi desenhado para uma tela 1920x1080. Em janelas mais baixas ou
  // mais estreitas que essa referência, um max-width fixo (ou em vh) não é
  // suficiente: ele não sabe quanto espaço o header, o padding da hero, a
  // fileira de botões e o card de contato (canto inferior direito, position
  // absolute) realmente ocupam. Por isso medimos tudo em tempo real e
  // calculamos o maior tamanho que o card pode ter sem invadir nenhum desses
  // elementos, reaplicando sempre que a janela for redimensionada.
  const heroMediaCol = document.querySelector('.hero-media-col');
  const heroMediaFrame = document.getElementById('heroMediaFrame');
  const heroActions = hero?.querySelector('.hero-actions');
  const heroContact = document.querySelector('.hero-contact');
  const heroInner = document.querySelector('.hero-inner');
  const HERO_MEDIA_REF = 990; // tamanho "ideal" a 1920x1080
  const HERO_MEDIA_MIN = 260; // nunca encolhe além disso
  const HERO_MEDIA_ASPECT = 16 / 10;

  function fitHeroMedia() {
    if (!heroMediaCol || !heroMediaFrame || !heroInner) return;

    // Abaixo de 1000px o layout muda de estrutura (breakpoints próprios
    // cuidam do tamanho do card); aqui só tratamos o desktop "largo".
    if (window.innerWidth <= 1000) {
      heroMediaCol.style.maxWidth = '';
      return;
    }

    const innerStyle = getComputedStyle(heroInner);
    // O padding-top da hero já foi dimensionado para "vazar" o header fixo
    // (ele é maior que a altura máxima do header + uma folga) — por isso
    // usamos só ele como reserva de topo, sem subtrair a altura do header
    // de novo (isso estava contando o mesmo espaço duas vezes e encolhendo
    // o card sem necessidade).
    const padTop = parseFloat(innerStyle.paddingTop) || 0;
    const padBottom = parseFloat(innerStyle.paddingBottom) || 0;
    const colStyle = getComputedStyle(heroMediaCol);
    const colGap = parseFloat(colStyle.rowGap || colStyle.gap) || 0;
    const actionsH = heroActions ? heroActions.getBoundingClientRect().height : 0;

    // Reserva vertical para o card de contato não ser invadido: o próprio
    // padding-bottom da hero já dá uma folga na base, então só precisamos
    // da reserva EXTRA quando o contato precisar de mais espaço que isso
    // (usamos o maior dos dois, não a soma dos dois).
    let contactReserveH = padBottom;
    let contactReserveW = 0;
    if (heroContact) {
      const contactRect = heroContact.getBoundingClientRect();
      contactReserveH = Math.max(padBottom, contactRect.height + 20);
      contactReserveW = (contactRect.width + 28) * 2;
    }

    const availableHeight = window.innerHeight - padTop - colGap - actionsH - contactReserveH;
    const availableWidth = Math.min(heroInner.clientWidth, window.innerWidth - contactReserveW);

    let maxW = Math.min(HERO_MEDIA_REF, availableWidth, Math.max(availableHeight, 0) * HERO_MEDIA_ASPECT);
    if (!Number.isFinite(maxW) || maxW <= 0) maxW = HERO_MEDIA_REF;
    maxW = Math.max(maxW, HERO_MEDIA_MIN);

    heroMediaCol.style.maxWidth = `${Math.round(maxW)}px`;
  }

  let heroMediaTicking = false;
  function requestFitHeroMedia() {
    if (heroMediaTicking) return;
    heroMediaTicking = true;
    requestAnimationFrame(() => {
      fitHeroMedia();
      heroMediaTicking = false;
    });
  }

  fitHeroMedia();
  window.addEventListener('resize', requestFitHeroMedia);
  window.addEventListener('load', fitHeroMedia);

  // Seção "Projetos": o bloco de texto da esquerda deve ficar do mesmo
  // tamanho e na mesma altura da IMAGEM do carrossel à direita (ignorando
  // os tabs, que ficam acima da imagem). Medimos a altura real dos tabs
  // (fonte/paddings variam por navegador) e empurramos o texto para baixo
  // com a mesma distância, depois igualamos a altura do texto à da imagem
  // e centralizamos o título/parágrafo dentro dela.
  function alignProjetosIntro() {
    const intro = document.querySelector('.projetos-intro');
    const showcase = document.querySelector('.projetos-showcase');
    const tabs = showcase?.querySelector('.projetos-tabs');
    const viewport = showcase?.querySelector('.carousel-viewport');
    if (!intro || !showcase || !tabs || !viewport) return;

    if (window.innerWidth <= 1024) {
      intro.style.marginTop = '';
      intro.style.minHeight = '';
      return;
    }

    const showcaseRect = showcase.getBoundingClientRect();
    const tabsRect = tabs.getBoundingClientRect();
    const tabsMarginBottom = parseFloat(getComputedStyle(tabs).marginBottom) || 0;
    const gapBeforeImage = (tabsRect.bottom - showcaseRect.top) + tabsMarginBottom;

    intro.style.marginTop = `${Math.max(gapBeforeImage, 0)}px`;
    intro.style.minHeight = `${viewport.getBoundingClientRect().height}px`;
  }

  alignProjetosIntro();
  window.addEventListener('resize', alignProjetosIntro);
  window.addEventListener('load', alignProjetosIntro);

  // Seção "Serviços": mesma lógica da seção "Projetos" — o bloco de texto da
  // esquerda deve ficar do mesmo tamanho do card do carrossel à direita.
  // Aqui não há tabs acima do carrossel, então basta igualar a altura do
  // texto à altura real do card ativo (que varia de slide para slide).
  function alignServicosIntro() {
    const intro = document.querySelector('.servicos-intro');
    const showcase = document.querySelector('.servicos-showcase');
    const viewport = showcase?.querySelector('.carousel-viewport');
    if (!intro || !showcase || !viewport) return;

    if (window.innerWidth <= 1024) {
      intro.style.minHeight = '';
      return;
    }

    intro.style.minHeight = `${viewport.getBoundingClientRect().height}px`;
  }

  alignServicosIntro();
  window.addEventListener('resize', alignServicosIntro);
  window.addEventListener('load', alignServicosIntro);

  // A altura do card ativo muda a cada troca de slide do carrossel de
  // Serviços (imagens/textos diferentes), então recalculamos sempre que o
  // carrossel atualiza o slide ativo.
  const servicosViewport = document.querySelector('.servicos-showcase .carousel-viewport');
  if (servicosViewport) {
    const servicosResizeObserver = new ResizeObserver(() => alignServicosIntro());
    servicosResizeObserver.observe(servicosViewport);
  }

  // Rolagem horizontal — Serviços + Projetos (somente desktop, acima de
  // 1024px). O wrapper (.hscroll-wrapper) é 2x mais alto que a tela; enquanto
  // o usuário rola por essa altura extra, o bloco interno fica "grudado"
  // (position: sticky) e aqui convertemos a distância rolada em um
  // deslocamento horizontal (translateX) do track, fazendo Serviços sair
  // pela esquerda e Projetos entrar pela direita. Desativado em telas
  // ≤1024px e quando o usuário pede "reduzir movimento" no sistema.
  const hscrollWrapper = document.getElementById('hscrollWrapper');
  const hscrollTrack = document.getElementById('hscrollTrack');
  const HSCROLL_PANEL_COUNT = 2;
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function isHscrollActive() {
    return !!(hscrollWrapper && hscrollTrack) && window.innerWidth > 1024 && !reduceMotionQuery.matches;
  }

  function updateHscroll() {
    if (!hscrollWrapper || !hscrollTrack) return;

    if (!isHscrollActive()) {
      hscrollTrack.style.transform = '';
      return;
    }

    const scrollDistance = hscrollWrapper.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) return;

    const rectTop = hscrollWrapper.getBoundingClientRect().top;
    let progress = -rectTop / scrollDistance;
    progress = Math.max(0, Math.min(1, progress));

    hscrollTrack.style.transform = `translateX(-${progress * (HSCROLL_PANEL_COUNT - 1) * 100}vw)`;
  }

  // Calcula a posição de rolagem vertical que corresponde a um painel
  // específico (0 = Serviços, 1 = Projetos). Como os dois painéis ocupam a
  // mesma posição vertical dentro do bloco "grudado" (a diferença entre eles
  // é só horizontal), um link do menu não pode simplesmente pular até o
  // elemento — precisa calcular em que ponto da rolagem o track já deslizou
  // o suficiente para mostrar aquele painel.
  function hscrollTargetY(panelIndex) {
    const wrapperTop = hscrollWrapper.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = hscrollWrapper.offsetHeight - window.innerHeight;
    return wrapperTop + (panelIndex / (HSCROLL_PANEL_COUNT - 1)) * scrollDistance;
  }

  if (hscrollWrapper && hscrollTrack) {
    let hscrollTicking = false;
    const onHscrollScroll = () => {
      if (hscrollTicking) return;
      hscrollTicking = true;
      requestAnimationFrame(() => {
        updateHscroll();
        hscrollTicking = false;
      });
    };

    window.addEventListener('scroll', onHscrollScroll, { passive: true });
    window.addEventListener('resize', updateHscroll);
    window.addEventListener('load', updateHscroll);
    reduceMotionQuery.addEventListener?.('change', updateHscroll);
    updateHscroll();

    // Corrige o "deep link" para #servicos/#projetos vindo de outra página
    // (ex.: o link "Voltar aos projetos" nas páginas de obra usa
    // "../../index.html#projetos"). Como os dois painéis ocupam a mesma
    // posição vertical dentro do bloco de rolagem horizontal — só a
    // horizontal muda entre eles — o salto de âncora nativo do navegador
    // não sabe qual painel mostrar e sempre cai no início do bloco
    // (Serviços), deixando "Projetos" com a posição errada e a sensação de
    // uma seção em branco ao rolar. Aqui recalculamos e corrigimos a
    // posição assim que a página termina de carregar.
    function fixHscrollDeepLink() {
      const hash = window.location.hash;
      if (hash !== '#servicos' && hash !== '#projetos') return;
      if (!isHscrollActive()) return;

      const panelIndex = hash === '#projetos' ? 1 : 0;
      const headerOffset = header ? header.offsetHeight : 0;
      window.scrollTo({ top: hscrollTargetY(panelIndex) - headerOffset, behavior: 'auto' });
      updateHscroll();
    }

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    fixHscrollDeepLink();
    window.addEventListener('load', fixHscrollDeepLink);
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = mobileMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(el => {
      el.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      const headerOffset = header ? header.offsetHeight : 0;
      const hscrollPanelIndex = id === '#servicos' ? 0 : id === '#projetos' ? 1 : null;
      let top;

      if (hscrollPanelIndex !== null && isHscrollActive()) {
        top = hscrollTargetY(hscrollPanelIndex) - headerOffset;
      } else {
        top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      }

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });

  if (hero) {
    setTimeout(() => {
      hero.classList.add('loaded');
    }, 150);
  }

  // Hero — rotação das fotos da obra em destaque (Swift Jandira)
  const heroMediaImgs = document.querySelectorAll('#heroMediaFrame .hero-media-img');

  if (heroMediaImgs.length > 1) {
    let heroMediaIndex = Array.from(heroMediaImgs).findIndex(img => img.classList.contains('is-active'));
    if (heroMediaIndex < 0) heroMediaIndex = 0;

    setInterval(() => {
      heroMediaImgs[heroMediaIndex].classList.remove('is-active');
      heroMediaIndex = (heroMediaIndex + 1) % heroMediaImgs.length;
      heroMediaImgs[heroMediaIndex].classList.add('is-active');
    }, 4200);
  }

  const reveals = document.querySelectorAll(
    '.anim-fade, .anim-up, .anim-left, .anim-right, .anim-zoom, .anim-item'
  );

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const delay = parseInt(entry.target.dataset.delay, 10) || 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObs.unobserve(entry.target);

      if (entry.target.classList.contains('pilar-card')) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -80px 0px'
  });

  reveals.forEach(el => {
    if (!el.classList.contains('visible')) {
      revealObs.observe(el);
    }
  });

  document.querySelectorAll('.pilar-card').forEach(card => {
    if (!card.classList.contains('anim-left') && !card.classList.contains('anim-right')) {
      revealObs.observe(card);
    }
  });

  const carousels = [];

  document.querySelectorAll('.projects-carousel').forEach(carousel => {
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-btn--prev');
    const nextBtn = carousel.querySelector('.carousel-btn--next');
    const panel = carousel.closest('.tab-panel');

    let current = 0;
    let autoTimer = null;
    let sectionVisible = false;
    let isAnimating = false;

    function clearSlideState(slide) {
      slide.classList.remove(
        'active',
        'is-active',
        'is-left',
        'is-right',
        'is-hidden-left',
        'is-hidden-right'
      );
    }

    function updateCarousel() {
      const lastIndex = slides.length - 1;
      const isMobile = window.innerWidth <= 768;

      slides.forEach((slide, index) => {
        clearSlideState(slide);

        if (isMobile) {
          if (index === current) {
            slide.classList.add('active', 'is-active');
          } else if (index < current) {
            slide.classList.add('is-hidden-left');
          } else {
            slide.classList.add('is-hidden-right');
          }
          return;
        }

        if (index === current) {
          slide.classList.add('active', 'is-active');
        } else if (index === current - 1) {
          slide.classList.add('is-left');
        } else if (index === current + 1) {
          slide.classList.add('is-right');
        } else if (index < current) {
          slide.classList.add('is-hidden-left');
        } else {
          slide.classList.add('is-hidden-right');
        }
      });

      if (prevBtn) prevBtn.classList.toggle('hidden', current === 0);
      if (nextBtn) nextBtn.classList.toggle('hidden', current === lastIndex);
    }

    function goToSlide(nextIndex) {
      if (isAnimating || nextIndex === current || nextIndex < 0 || nextIndex >= slides.length) return;

      isAnimating = true;
      current = nextIndex;
      updateCarousel();

      setTimeout(() => {
        isAnimating = false;
      }, 820);
    }

    function nextSlide() {
      if (current < slides.length - 1) {
        goToSlide(current + 1);
      } else {
        current = 0;
        updateCarousel();
      }
    }

    function prevSlide() {
      if (current > 0) {
        goToSlide(current - 1);
      } else {
        current = slides.length - 1;
        updateCarousel();
      }
    }

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAuto() {
      stopAuto();

      // Carrosséis sem abas (ex.: Serviços) não têm um .tab-panel ancestral —
      // nesse caso, tratamos como sempre "ativo".
      const panelActive = !panel || panel.classList.contains('active');
      if (!sectionVisible || !panelActive) return;

      autoTimer = setInterval(() => {
        if (current < slides.length - 1) {
          goToSlide(current + 1);
        } else {
          current = 0;
          updateCarousel();
        }
      }, 12000);
    }

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      startAuto();
    });

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      startAuto();
    });

    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        sectionVisible = entry.isIntersecting;
        if (sectionVisible) startAuto();
        else stopAuto();
      });
    }, { threshold: 0.35 });

    visibilityObserver.observe(panel || carousel);

    window.addEventListener('resize', updateCarousel);

    updateCarousel();

    carousels.push({
      panel,
      startAuto,
      stopAuto,
      updateCarousel
    });
  });

  const tabList = document.querySelector('.projetos-tabs');
  tabList?.setAttribute('role', 'tablist');
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
    btn.setAttribute('aria-controls', `panel-${btn.dataset.tab}`);
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');

        if (panel.id === `panel-${tab}`) {
          panel.classList.add('active');

          const carousel = panel.querySelector('.projects-carousel');
          if (carousel) {
            carousel.classList.add('visible');
          }
        }
      });

      carousels.forEach(c => {
        if (c.panel && c.panel.classList.contains('active')) {
          c.updateCarousel();
          c.startAuto();
        } else {
          c.stopAuto();
        }
      });
    });
  });

  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `scale(1.08) translateY(${y * 0.25}px)`;
      }
    }, { passive: true });
  }

  if (window.innerWidth > 768) {
    document.querySelectorAll('.pilar-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((e.clientY - rect.top) - cy) / cy * -2.5;
        const ry = ((e.clientX - rect.left) - cx) / cx * 2.5;

        card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  const parceirosGrid = document.querySelector('.parceiros-grid');
  if (parceirosGrid) {
    const parceiroCards = parceirosGrid.querySelectorAll('.parceiro-card');

    parceiroCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const parcObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        parceiroCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 50);
        });

        parcObs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    parcObs.observe(parceirosGrid);
  }

  if (hero && window.innerWidth > 768) {
    const glow = document.createElement('div');

    Object.assign(glow.style, {
      position: 'absolute',
      width: '500px',
      height: '500px',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '1',
      background: 'radial-gradient(circle, rgba(15,95,188,0.14) 0%, transparent 70%)',
      willChange: 'transform',
      transition: 'transform 0.08s linear'
    });

    hero.appendChild(glow);

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      glow.style.transform = `translate(${e.clientX - rect.left - 250}px, ${e.clientY - rect.top - 250}px)`;
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length && header) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: `-${header.offsetHeight}px 0px -35% 0px`
    });

    sections.forEach(section => navObs.observe(section));
  }

  const projectPages = {
    'balneario-camboriu': 'obras/balneario/',
    'jardim-samambaia': 'obras/jardimsamambaia/',
    'reforma-vinhedo': 'obras/CondominioVinhedo/',
    'casa-academia-jundiai': 'obras/casajundiaiacademia/',
    'alto-padrao-alta-vista-jundiai': 'obras/altopadraoaltavista/',
    'casa-sao-joaquim': 'obras/CasaSaoJoaquim/',
    'redevoa-ribeirao-preto': 'obras/redevoa/',
    'mormai-jundiai': 'obras/mormai-jundiai/',
    'gpa-obras-1': 'obras/GPA/',
    'gpa-obras-2': 'obras/GPA2/',
    'gpa-obras-3': 'obras/GPA3/',
    'maple-bear-jundiai': 'obras/maplebearjundiai/',
    'swift-atibaia': 'obras/SwiftAtibaia/',
    'swift-jandira': 'obras/SwiftJandira/',
    'swift-jundiai': 'obras/SwiftJundiai/'
  };

  document.querySelectorAll('.project-gallery-trigger').forEach(trigger => {
    const projectUrl = projectPages[trigger.dataset.gallery];
    if (!projectUrl) return;

    trigger.tabIndex = 0;
    trigger.setAttribute('role', 'link');
    trigger.setAttribute('aria-label', `Ver detalhes de ${trigger.dataset.title || 'projeto'}`);

    const openProject = () => window.location.href = projectUrl;
    trigger.addEventListener('click', openProject);
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProject();
      }
    });
  });

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
  });

  tabList?.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const tabs = Array.from(tabList.querySelectorAll('.tab-btn'));
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextTab = tabs[(currentIndex + direction + tabs.length) % tabs.length];
    nextTab.focus();
    nextTab.click();
  });

  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(element) {
    const target = Number(element.dataset.target || 0);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * target);

      element.textContent = `${prefix}${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll('.stat-number');

        numbers.forEach((number) => {
          if (!number.dataset.animated) {
            animateCounter(number);
            number.dataset.animated = 'true';
          }
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.35
  });

  const pillarsStatsCard = document.querySelector('.pillars-stats-card');

  if (pillarsStatsCard) {
    statObserver.observe(pillarsStatsCard);
  }
});

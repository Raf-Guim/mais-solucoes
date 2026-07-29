document.addEventListener('DOMContentLoaded', () => {
  window.lucide?.createIcons();

  const header = document.getElementById('header');
  const hero = document.querySelector('.hero');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastScrollY = window.scrollY;

  function updateHeaderState() {
    if (!header) return;

    const currentScrollY = window.scrollY;
    const isScrolled = currentScrollY > 50;
    const isAtHero = currentScrollY < window.innerHeight * 0.55;
    const scrollingDown = currentScrollY > lastScrollY;
    const scrollingUp = currentScrollY < lastScrollY;

    header.classList.toggle('scrolled', isScrolled);
    header.classList.toggle('at-hero', isAtHero);

    if (isAtHero || currentScrollY < 120) {
      header.classList.remove('header-hidden');
    } else if (scrollingDown && currentScrollY > 220) {
      header.classList.add('header-hidden');
    } else if (scrollingUp) {
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  }

  updateHeaderState();

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState);

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = mobileMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';

      if (isActive) {
        header?.classList.remove('header-hidden');
      }
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
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

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

      const panelActive = panel && panel.classList.contains('active');
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

    if (panel) {
      visibilityObserver.observe(panel);
    }

    window.addEventListener('resize', updateCarousel);

    updateCarousel();

    carousels.push({
      panel,
      startAuto,
      stopAuto,
      updateCarousel
    });
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

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
    'swift-atibaia': 'obras/SwiftAtibaia/'
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

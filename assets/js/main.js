/* ============================================================
   Shared site behavior — index.html, about.html, projects/*.html
   Every block below is guarded so it only runs on pages that
   actually contain the relevant markup.
   ============================================================ */
(function(){
  "use strict";
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Nav show/hide + scrolled state */
  const nav = document.getElementById('nav');
  if (nav){
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('nav--scrolled', y > 12);
      if (y > lastY && y > 160) nav.classList.add('nav--hidden');
      else nav.classList.remove('nav--hidden');
      lastY = y;
    }, { passive:true });
  }

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window){
    /* threshold 0 is required: mask elements start clip-path-collapsed to
       zero visible height, so a higher ratio threshold would never fire —
       isIntersecting still flips true on first geometric overlap at 0. */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold:0, rootMargin:'0px 0px -10% 0px' });
    revealEls.forEach(el => io.observe(el));

    const lineEls = document.querySelectorAll('[data-reveal-line]');
    const io2 = new IntersectionObserver((entries)=>{
      entries.forEach((e,i)=>{
        if(e.isIntersecting){
          setTimeout(()=> e.target.classList.add('in-view'), i*90);
          io2.unobserve(e.target);
        }
      });
    }, { threshold:.3 });
    lineEls.forEach(el => io2.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
    document.querySelectorAll('[data-reveal-line]').forEach(el => el.classList.add('in-view'));
  }

  /* Hero load sequence (in addition to scroll reveal, hero reveals immediately) */
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero [data-reveal], .about-hero [data-reveal]').forEach(el => {
      requestAnimationFrame(()=> el.classList.add('in-view'));
    });
  });

  /* Subtle parallax on hero visual */
  const parallaxEl = document.querySelector('[data-parallax]');
  if (parallaxEl && !reduce){
    window.addEventListener('scroll', () => {
      const r = parallaxEl.getBoundingClientRect();
      const center = window.innerHeight/2;
      const dist = (r.top + r.height/2 - center) / window.innerHeight;
      parallaxEl.style.transform = `translateY(${dist*22}px)`;
    }, { passive:true });
  }

  /* Selected work sticky stack — scale/dim card as next one covers it */
  const cards = Array.from(document.querySelectorAll('.work-card'));
  if (cards.length && !reduce){
    const onScroll = () => {
      cards.forEach((card, i) => {
        const next = cards[i+1];
        if (!next) return;
        const nextRect = next.getBoundingClientRect();
        const cardTop = parseInt(getComputedStyle(card).top, 10) || 0;
        const progress = Math.min(Math.max((cardTop + 40 - nextRect.top) / 200, 0), 1);
        const scale = 1 - progress*0.04;
        const opacity = 1 - progress*0.35;
        card.style.transform = `scale(${scale})`;
        card.style.opacity = opacity;
      });
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  /* Approach — scroll-linked progress rail + active step + big number */
  const approachSection = document.getElementById('approach');
  const rail = document.getElementById('approachFill');
  const steps = Array.from(document.querySelectorAll('.approach-step'));
  const bigNum = document.getElementById('approachBig');
  if (approachSection && rail && steps.length){
    const onApproachScroll = () => {
      const rect = approachSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh*0.5;
      const scrolled = Math.min(Math.max(-rect.top + vh*0.4, 0), total);
      const pct = total > 0 ? (scrolled/total)*100 : 0;
      rail.style.height = pct + '%';

      let activeIndex = 0;
      steps.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top < vh*0.55) activeIndex = i;
        s.classList.toggle('is-active', r.top < vh*0.55 && r.bottom > vh*0.2);
      });
      if (bigNum) bigNum.textContent = String(activeIndex+1).padStart(2,'0');
    };
    window.addEventListener('scroll', onApproachScroll, { passive:true });
    onApproachScroll();
  }

  /* Marquee: duplicate content for seamless loop */
  const track = document.getElementById('marqueeTrack');
  if (track) track.innerHTML += track.innerHTML;

  /* Contact drawer */
  const overlay = document.getElementById('overlay');
  const drawer = document.getElementById('drawer');
  const openers = document.querySelectorAll('[data-open-drawer]');
  const closers = document.querySelectorAll('[data-close-drawer]');
  let lastFocused = null;

  function openDrawer(){
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    const closeBtn = drawer.querySelector('.drawer__close');
    if (closeBtn) closeBtn.focus();
  }
  function closeDrawer(){
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  if (overlay && drawer){
    openers.forEach(b => b.addEventListener('click', openDrawer));
    closers.forEach(b => b.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  /* Copy email */
  const copyBtn = document.getElementById('copyEmail');
  if (copyBtn){
    copyBtn.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText('krishnendu.knp@gmail.com');
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(()=> copyBtn.textContent = original, 1600);
      }catch(err){
        copyBtn.textContent = 'krishnendu.knp@gmail.com';
      }
    });
  }

      /* Education tabs — homepage */
  const educationTabs = document.querySelectorAll('[data-education-tab]');
  const educationPanels = document.querySelectorAll('[data-education-panel]');

  if (educationTabs.length && educationPanels.length){
    educationTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-education-tab');

        educationTabs.forEach(item => {
          const isActive = item === tab;

          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        educationPanels.forEach(panel => {
          const isActive =
            panel.getAttribute('data-education-panel') === target;

          panel.classList.toggle('is-active', isActive);
          panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });
      });
    });
  }


  /* Footer reveal — scroll-controlled wordmark */
  const siteFooter = document.getElementById('siteFooter');
  const footerWord = document.getElementById('footerWord');

  if (siteFooter && footerWord && !reduce){

    const updateFooterReveal = () => {
      const rect = siteFooter.getBoundingClientRect();
      const vh = window.innerHeight;

      const start = vh;
      const end = vh * 0.18;

      const progress = Math.min(
        Math.max((start - rect.top) / (start - end), 0),
        1
      );

      const translate = 105 - (progress * 105);
      const opacity = 0.15 + (progress * 0.85);

      footerWord.style.transform =
        `translateY(${translate}%)`;

      footerWord.style.opacity = opacity;
    };

    window.addEventListener(
      'scroll',
      updateFooterReveal,
      { passive:true }
    );

    updateFooterReveal();

  } else if (footerWord){

    footerWord.style.transform = 'translateY(0)';
    footerWord.style.opacity = '1';

  }

/* Experience KPI count-up */
const kpiEls = document.querySelectorAll('[data-kpi]');

if (kpiEls.length){
  const animateKpi = (el) => {
    if (el.dataset.animated === 'true') return;

    el.dataset.animated = 'true';

    const numberEl = el.querySelector('.kpi-number');
    if (!numberEl) return;

    const target = Number(el.dataset.kpiValue) || 0;
    const duration = 900;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min(
        (now - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);
      numberEl.textContent = Math.round(target * eased);

      if (progress < 1){
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  if (!reduce && 'IntersectionObserver' in window){
    const kpiObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animateKpi(entry.target);
          kpiObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold:0.35
    });

    kpiEls.forEach(el => kpiObserver.observe(el));
  } else {
    kpiEls.forEach(animateKpi);
  }
}

   /* ============================================================
   PROJECT VISUALIZATION LIGHTBOX
   ============================================================ */

const visualTriggers = document.querySelectorAll(
  '.case-visual-card__trigger[data-lightbox], ' +
  '.case-visual-card__trigger[data-lightbox-group]'
);

if (visualTriggers.length){

  /* Create lightbox automatically if it does not exist */
  let lightbox = document.getElementById('caseLightbox');

  if (!lightbox){

    lightbox = document.createElement('div');

    lightbox.className = 'case-lightbox';
    lightbox.id = 'caseLightbox';
    lightbox.setAttribute('aria-hidden','true');

    lightbox.innerHTML = `
      <div class="case-lightbox__backdrop"></div>

      <div class="case-lightbox__panel">

        <button
          class="case-lightbox__close"
          type="button"
          aria-label="Close image">
          ×
        </button>

        <button
          class="case-lightbox__prev"
          type="button"
          aria-label="Previous image">
          ←
        </button>

        <div class="case-lightbox__content">
          <img
            id="caseLightboxImage"
            src=""
            alt="">
        </div>

        <button
          class="case-lightbox__next"
          type="button"
          aria-label="Next image">
          →
        </button>

      </div>
    `;

    document.body.appendChild(lightbox);
  }


  const lightboxImage =
    document.getElementById('caseLightboxImage');

  const lightboxClose =
    lightbox.querySelector('.case-lightbox__close');

  const lightboxPrev =
    lightbox.querySelector('.case-lightbox__prev');

  const lightboxNext =
    lightbox.querySelector('.case-lightbox__next');

  const lightboxBackdrop =
    lightbox.querySelector('.case-lightbox__backdrop');


  let currentImages = [];
  let currentIndex = 0;


  /* ------------------------------------------------------------
     SHOW IMAGE
     ------------------------------------------------------------ */

  function showLightboxImage(index){

    if (!currentImages.length) return;

    currentIndex =
      (index + currentImages.length) %
      currentImages.length;

    const image =
      currentImages[currentIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt || '';
  }


  /* ------------------------------------------------------------
     BUILD GALLERY
     ------------------------------------------------------------ */

  function buildGallery(trigger){

    const gallery =
      trigger.closest('.case-visual-grid');

    if (!gallery){
      return {
        images: [],
        index: 0
      };
    }


    const galleryTriggers =
      Array.from(
        gallery.querySelectorAll(
          '.case-visual-card__trigger[data-lightbox], ' +
          '.case-visual-card__trigger[data-lightbox-group]'
        )
      );


    const images = [];
    let clickedIndex = 0;


    galleryTriggers.forEach((button) => {

      let src = '';
      let alt = '';


      /* Grouped image source */
      const group =
        button.getAttribute('data-lightbox-group');


      if (group){

        const sourceGroup =
          document.querySelector(
            `.case-lightbox-data [data-lightbox-group="${group}"]`
          );

        const sourceImage =
          sourceGroup
            ? sourceGroup.querySelector('img')
            : null;


        if (sourceImage){

          src = sourceImage.src;
          alt = sourceImage.alt || '';

        }

      }


      /* Direct image fallback */
      if (!src){

        const image =
          button.querySelector('img');

        const dataSrc =
          button.getAttribute('data-src');


        if (dataSrc){
          src = dataSrc;
        }
        else if (image){
          src = image.src;
        }


        if (image){
          alt = image.alt || '';
        }

      }


      if (src){

        if (button === trigger){
          clickedIndex = images.length;
        }


        images.push({
          src: src,
          alt: alt
        });

      }

    });


    return {
      images: images,
      index: clickedIndex
    };

  }


  /* ------------------------------------------------------------
     OPEN
     ------------------------------------------------------------ */

  function openLightbox(trigger){

    const gallery =
      buildGallery(trigger);


    currentImages =
      gallery.images;

    currentIndex =
      gallery.index;


    if (!currentImages.length){
      return;
    }


    showLightboxImage(currentIndex);


    lightbox.classList.add(
      'is-open'
    );

    lightbox.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.style.overflow =
      'hidden';

  }


  /* ------------------------------------------------------------
     CLOSE
     ------------------------------------------------------------ */

  function closeLightbox(){

    lightbox.classList.remove(
      'is-open'
    );

    lightbox.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.style.overflow =
      '';

    lightboxImage.src = '';
    lightboxImage.alt = '';

    currentImages = [];
    currentIndex = 0;

  }


  /* ------------------------------------------------------------
     OPEN IMAGE
     ------------------------------------------------------------ */

  visualTriggers.forEach((trigger) => {

    trigger.addEventListener(
      'click',
      () => openLightbox(trigger)
    );

  });


  /* ------------------------------------------------------------
     CLOSE
     ------------------------------------------------------------ */

  if (lightboxClose){

    lightboxClose.addEventListener(
      'click',
      closeLightbox
    );

  }


  /* ------------------------------------------------------------
     PREVIOUS
     ------------------------------------------------------------ */

  if (lightboxPrev){

    lightboxPrev.addEventListener(
      'click',
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        showLightboxImage(
          currentIndex - 1
        );

      }
    );

  }


  /* ------------------------------------------------------------
     NEXT
     ------------------------------------------------------------ */

  if (lightboxNext){

    lightboxNext.addEventListener(
      'click',
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        showLightboxImage(
          currentIndex + 1
        );

      }
    );

  }


  /* ------------------------------------------------------------
     BACKDROP
     ------------------------------------------------------------ */

  if (lightboxBackdrop){

    lightboxBackdrop.addEventListener(
      'click',
      closeLightbox
    );

  }


  /* ------------------------------------------------------------
     KEYBOARD
     ------------------------------------------------------------ */

  document.addEventListener(
    'keydown',
    (event) => {

      if (
        !lightbox.classList.contains(
          'is-open'
        )
      ){
        return;
      }


      if (event.key === 'Escape'){
        closeLightbox();
      }


      if (event.key === 'ArrowLeft'){

        event.preventDefault();

        showLightboxImage(
          currentIndex - 1
        );

      }


      if (event.key === 'ArrowRight'){

        event.preventDefault();

        showLightboxImage(
          currentIndex + 1
        );

      }

    }
  );

}
document.querySelectorAll('.case-recommendation__trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {

    const item = trigger.closest('.case-recommendation');
    const isOpen = item.classList.contains('is-open');

    item.classList.toggle('is-open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));

  });
});
document.querySelectorAll('.case-tools__tab').forEach((tab) => {
  tab.addEventListener('click', () => {

    const target = tab.dataset.toolsTab;

    document
      .querySelectorAll('.case-tools__tab')
      .forEach((item) => {
        item.classList.toggle(
          'is-active',
          item === tab
        );
      });

    document
      .querySelectorAll('.case-tools__panel')
      .forEach((panel) => {
        panel.classList.toggle(
          'is-active',
          panel.dataset.toolsPanel === target
        );
      });

  });
});
})();
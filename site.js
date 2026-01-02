(() => {
  const getCurrentHash = () => window.location.hash || '#home';

  const getLinkHash = (href) => {
    if (!href) {
      return '';
    }
    const hashIndex = href.indexOf('#');
    return hashIndex >= 0 ? href.slice(hashIndex) : '';
  };

  const setActiveNav = () => {
    const current = getCurrentHash();
    const links = document.querySelectorAll('.site-nav a');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      const linkHash = getLinkHash(href);
      if (linkHash === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  const initPlateClicks = () => {
    document.addEventListener('click', (event) => {
      const img = event.target.closest('.plate img');
      if (!img) {
        return;
      }

      const anchor = img.closest('a');
      const href = anchor
        ? anchor.getAttribute('href')
        : img.getAttribute('data-full') || img.getAttribute('src');

      if (!href) {
        return;
      }

      event.preventDefault();
      window.open(href, '_blank', 'noopener');
    });
  };

  const initGalleryLightbox = () => {
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) {
      return;
    }

    const links = Array.from(gallery.querySelectorAll('a'));
    const items = links
      .map((link) => {
        const img = link.querySelector('img');
        const src = img ? img.getAttribute('src') : link.getAttribute('href');
        return {
          src,
          alt: img ? img.getAttribute('alt') : '',
        };
      })
      .filter((item) => item.src);

    if (items.length === 0) {
      return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.hidden = true;

    const inner = document.createElement('div');
    inner.className = 'lightbox__inner';

    const header = document.createElement('div');
    header.className = 'lightbox__header';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'lightbox__close';
    closeButton.textContent = 'Close';

    const scroller = document.createElement('div');
    scroller.className = 'lightbox__scroller';

    items.forEach((item) => {
      const figure = document.createElement('figure');
      figure.className = 'lightbox__item';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || '';
      figure.appendChild(img);

      scroller.appendChild(figure);
    });

    header.appendChild(closeButton);
    inner.append(header, scroller);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    const open = (index) => {
      overlay.hidden = false;
      document.body.classList.add('lightbox-open');
      scroller.scrollTop = 0;
      requestAnimationFrame(() => {
        const target = scroller.children[index];
        if (target) {
          target.scrollIntoView({ block: 'start' });
        }
      });
    };

    const close = () => {
      overlay.hidden = true;
      document.body.classList.remove('lightbox-open');
    };

    gallery.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link || !gallery.contains(link)) {
        return;
      }

      event.preventDefault();

      const img = link.querySelector('img');
      const src = img ? img.getAttribute('src') : link.getAttribute('href');
      const index = items.findIndex((item) => item.src === src);
      open(index >= 0 ? index : 0);
    });

    closeButton.addEventListener('click', close);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        close();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (!overlay.hidden && event.key === 'Escape') {
        close();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    initPlateClicks();
    initGalleryLightbox();
  });

  window.addEventListener('hashchange', setActiveNav);
})();

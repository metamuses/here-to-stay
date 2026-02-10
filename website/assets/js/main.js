/**
* Template Name: Scaffold
* Template URL: https://bootstrapmade.com/scaffold-bootstrap-metro-style-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;

    // Function to equalize heights
    function equalizeCardHeights() {
      const cards = isotopeItem.querySelectorAll('.dataset-item');
      cards.forEach(card => card.style.height = 'auto');
      let maxHeight = 0;
      cards.forEach(card => {
        if (card.offsetHeight > maxHeight) {
          maxHeight = card.offsetHeight;
        }
      });
      cards.forEach(card => card.style.height = maxHeight + 'px');
    }

    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      // Equalize heights BEFORE Isotope initialization
      equalizeCardHeights();

      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    // Re-equalize and re-layout on window resize
    window.addEventListener('resize', function () {
      equalizeCardHeights();
      if (initIsotope) {
        initIsotope.layout();
      }
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.results-item h3, .results-item .results-toggle').forEach((resultsItem) => {
    resultsItem.addEventListener('click', () => {
      resultsItem.parentNode.classList.toggle('results-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);


  /**
   * Fetch and Display RDF/Turtle File
   */
  const ttlDisplay = document.querySelector('#ttl-display');
  if (ttlDisplay) {
    fetch("assets/data/your-file.ttl")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then(data => {
        ttlDisplay.textContent = data.trim();
      })
      .catch(error => {
        ttlDisplay.textContent = "Failed to load Turtle file: " + error;
      });
  }

  /* ANALYSES NAVBAR */
  document.addEventListener('DOMContentLoaded', function () {
    // Select all dropdown links with the custom class
    const tabLinks = document.querySelectorAll('.external-tab-link');

    tabLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('data-tab-target');

        const tabTrigger = document.querySelector(`.analyses .nav-tabs .nav-link[data-bs-target="${targetId}"]`);

        if (tabTrigger) {
          const tabInstance = bootstrap.Tab.getOrCreateInstance(tabTrigger);
          tabInstance.show();

          const section = document.querySelector('#analyses');
          if (section) {
            const headerOffset = 60;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }
      });
    });
  });


  // KNIME workflow
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".knime-zoom-container").forEach(function (container) {
      const img = container.querySelector(".knime-zoom-img");

      let scale = 1;
      let pos = { x: 0, y: 0 };
      let start = { x: 0, y: 0 };
      let isDragging = false;

      container.addEventListener("wheel", function (e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.min(Math.max(1, scale + delta), 5);
        updateTransform();
      });

      container.addEventListener("mousedown", function (e) {
        isDragging = true;
        start = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        container.style.cursor = "grabbing";
      });

      window.addEventListener("mouseup", function () {
        isDragging = false;
        container.style.cursor = "grab";
      });

      window.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        pos = { x: e.clientX - start.x, y: e.clientY - start.y };
        updateTransform();
      });

      function updateTransform() {
        img.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
      }
    });
  });

  // WORKFLOW CAROUSEL
  const myCarousel = document.getElementById('workflowCarousel');

  myCarousel.addEventListener('slid.bs.carousel', event => {
    const activeSlide = event.relatedTarget;

    console.log("Slide changed! Now showing:", activeSlide);
  });


})();

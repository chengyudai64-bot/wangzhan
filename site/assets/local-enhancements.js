(function () {
  // Suppress the original loader's harmless late callback after offline fallback.
  window.addEventListener('error', function (event) {
    if (String(event.message).includes("Cannot read properties of null (reading 'children')")) event.preventDefault();
  });

  document.addEventListener('DOMContentLoaded', function () {
    var loader = document.querySelector('[data-js="loading"]');
    if (loader) {
      window.setTimeout(function () {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.style.pointerEvents = 'none';
      }, 1500);
    }

    var revealItems = document.querySelectorAll('[data-js="works-card"], [data-js="index-event-card"]');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('local-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px 12% 0px', threshold: .06 });
      revealItems.forEach(function (item, index) {
        item.classList.add('local-reveal');
        item.style.transitionDelay = Math.min(index % 6, 5) * 55 + 'ms';
        observer.observe(item);
      });
    }

    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      var hero = document.querySelector('[data-js="index-kv"]');
      var image = document.querySelector('[data-js="index-kv-images"]');
      if (hero && image) {
        hero.addEventListener('pointermove', function (event) {
          var rect = hero.getBoundingClientRect();
          var x = (event.clientX - rect.left) / rect.width - .5;
          var y = (event.clientY - rect.top) / rect.height - .5;
          image.style.transform = 'translate3d(' + (x * 10) + 'px,' + (y * 7) + 'px,0)';
        });
        hero.addEventListener('pointerleave', function () { image.style.transform = ''; });
      }
    }
  });
})();

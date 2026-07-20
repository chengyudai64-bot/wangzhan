(function () {
  var mobileQuery = matchMedia('(max-width: 768px)');
  var isMobileBoot = mobileQuery.matches;
  var root = document.documentElement;
  var bootStartedAt = Date.now();
  var criticalAssetUrls = [
    '/images/meme_full.webp',
    '/glb/mochiusa.glb',
    '/glb/meme_low.glb',
    '/js/draco/draco_decoder.wasm'
  ];
  var criticalAssetPromises = [];

  function setMobileProgress(value) {
    var progress = Math.max(0, Math.min(100, Math.round(value)));
    root.style.setProperty('--local-loading-progress', progress + '%');
    root.setAttribute('data-local-loading-label', 'LOADING ' + progress + '%');
  }

  if (isMobileBoot) {
    root.classList.add('local-mobile-loading');
    setMobileProgress(4);
    criticalAssetPromises = criticalAssetUrls.map(function (url) {
      return fetch(url, { cache: 'force-cache' }).then(function (response) {
        if (!response.ok) throw new Error('Failed to load ' + url);
        return response.arrayBuffer();
      });
    });
  }

  // Suppress the original loader's harmless late callback after offline fallback.
  window.addEventListener('error', function (event) {
    if (String(event.message).includes("Cannot read properties of null (reading 'children')")) event.preventDefault();
  });

  document.addEventListener('DOMContentLoaded', function () {
    var isMobile = mobileQuery.matches;
    var loader = document.querySelector('[data-js="loading"]');
    if (isMobile) {
      var heroImages = Array.prototype.slice.call(document.querySelectorAll('[data-js="index-kv"] img'));
      var imagePromises = heroImages.map(function (image) {
        if (image.complete && image.naturalWidth > 0) return Promise.resolve();
        return new Promise(function (resolve) {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      });
      var fontPromise = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      var pagePromise = document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise(function (resolve) { window.addEventListener('load', resolve, { once: true }); });
      var originalTimelinePromise = new Promise(function (resolve) {
        var resolveAfterIntro = function () {
          window.setTimeout(resolve, 5600);
        };
        if (!loader || !loader.parentNode) {
          resolveAfterIntro();
          return;
        }
        var observer = new MutationObserver(function () {
          if (!document.documentElement.contains(loader)) {
            observer.disconnect();
            resolveAfterIntro();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        window.setTimeout(function () {
          observer.disconnect();
          resolve();
        }, 20000);
      });
      var tasks = criticalAssetPromises.concat(imagePromises, [fontPromise, pagePromise, originalTimelinePromise]);
      var completed = 0;
      var total = Math.max(tasks.length, 1);

      tasks.forEach(function (task) {
        Promise.resolve(task).catch(function () {}).then(function () {
          completed += 1;
          setMobileProgress(8 + (completed / total) * 87);
        });
      });

      var timeout = new Promise(function (resolve) { window.setTimeout(resolve, 21000); });
      Promise.race([Promise.allSettled(tasks), timeout]).then(function () {
        var minimumDelay = Math.max(0, 900 - (Date.now() - bootStartedAt));
        var renderSettleDelay = 700;
        setMobileProgress(96);
        window.setTimeout(function () {
          setMobileProgress(100);
          window.setTimeout(function () {
            root.classList.add('local-mobile-ready');
            root.classList.remove('local-mobile-loading');
            root.style.overflow = '';
            document.body.style.overflow = '';
          }, 260);
        }, Math.max(minimumDelay, renderSettleDelay));
      });
    }

    if (loader) {
      window.setTimeout(function () {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.style.pointerEvents = 'none';
      }, isMobile ? 22000 : 6500);
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

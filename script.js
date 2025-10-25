/* script.js
   Весь jQuery-код — внутри $(document).ready
   Реализованы все задания Assignment 7 + рейтинг + тема + lazy load
*/
$(document).ready(function () {
  console.log("jQuery is ready!");

  /***********************
   * ИНИЦИАЛИЗАЦИЯ ТЕМЫ
   ***********************/
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  $('#theme-toggle').on('click', function () {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    localStorage.setItem('theme', cur);
    $(this).text(cur === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема');
    showNotification('Тема переключена: ' + (cur === 'dark' ? 'Тёмная' : 'Светлая'));
  });

  /***********************
   * ДАННЫЕ ДЛЯ ПОДСКАЗОК
   ***********************/
  const items = [];
  $('.product-card').each(function () { items.push($(this).data('name')); });

  /***********************
   * TASK 1: LIVE SEARCH (keyup)
   ***********************/
  function applyFilters() {
    const q = $('#search-bar').val().toLowerCase().trim();
    const category = $('#filter-category').val();
    const onlyStock = $('#filter-stock').prop('checked');

    $('.product-card').each(function () {
      const $card = $(this);
      const name = ($card.data('name') || '').toString().toLowerCase();
      const cat = ($card.data('category') || '');
      const instock = $card.data('instock') == 1;

      let visible = true;
      if (q && !name.includes(q)) visible = false;
      if (category && cat !== category) visible = false;
      if (onlyStock && !instock) visible = false;

      $card.toggle(visible);
    });
  }

  $('#search-bar').on('keyup', function () {
    applyFilters();
    updateSuggestions();
    highlightMatches();
  });

  $('#filter-category, #filter-stock').on('change', applyFilters);

  /***********************
   * TASK 2: AUTOCOMPLETE SUGGESTIONS
   ***********************/
  function updateSuggestions() {
    const val = $('#search-bar').val().toLowerCase().trim();
    const $s = $('#suggestions');
    $s.empty();
    if (!val) { $s.hide(); return; }

    const matches = items.filter(it => it.toLowerCase().includes(val));
    if (!matches.length) { $s.hide(); return; }

    matches.forEach(m => $s.append(`<div class="suggest-item">${m}</div>`));
    $s.show();
  }

  $(document).on('click', '.suggest-item', function () {
    $('#search-bar').val($(this).text());
    $('#suggestions').empty().hide();
    applyFilters();
    highlightMatches();
  });

  $(document).click(function (e) {
    if (!$(e.target).closest('#suggestions, #search-bar').length) $('#suggestions').empty().hide();
  });

  /***********************
   * TASK 3: HIGHLIGHT SEARCH
   ***********************/
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightMatches() {
    const kw = $('#search-bar').val().trim();
    if (!kw) {
      $('.product-title').each(function () { $(this).html($(this).text()); });
      return;
    }
    const regex = new RegExp('(' + escapeRegExp(kw) + ')', 'ig');
    $('.product-title').each(function () {
      const txt = $(this).text();
      $(this).html(txt.replace(regex, '<mark>$1</mark>'));
    });
  }

  /***********************
   * TASK 4: SCROLL PROGRESS BAR
   ***********************/
  $(window).on('scroll resize', function () {
    const scrolled = ($(window).scrollTop() / ($(document).height() - $(window).height())) * 100;
    $('#progress-bar').css('width', scrolled + '%');
  });

  /***********************
   * TASK 5: ANIMATED COUNTER
   ***********************/
  $('.count').each(function () {
    const $el = $(this);
    const target = parseInt($el.attr('data-target'), 10) || 0;
    $({ countNum: 0 }).animate({ countNum: target }, {
      duration: 1800,
      easing: 'swing',
      step: function () {
        $el.text(Math.floor(this.countNum));
      },
      complete: function () {
        $el.text(this.countNum);
      }
    });
  });

  /***********************
   * TASK 6: LOADING SPINNER ON SUBMIT
   ***********************/
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    const $btn = $('#submit-btn');
    $btn.prop('disabled', true).html('<span class="spinner" aria-hidden="true"></span> Пожалуйста, ждите...');
    setTimeout(function () {
      $btn.prop('disabled', false).text('Отправить');
      // показать уведомление
      showNotification('Форма успешно отправлена ✅');
      $('#contact-form')[0].reset();
    }, 1600);
  });

  /***********************
   * TASK 7: NOTIFICATION / TOAST
   ***********************/
  let notTimeout = null;
  function showNotification(msg, timeout = 2200) {
    const $n = $('#notification');
    $n.stop(true, true).text(msg).fadeIn(200);
    if (notTimeout) clearTimeout(notTimeout);
    notTimeout = setTimeout(() => $n.fadeOut(300), timeout);
  }
  // Демонстрация: кнопки add-cart вызывают уведомление
  $(document).on('click', '.add-cart', function () {
    showNotification('🛒 Товар добавлен в корзину');
    // можно имплементировать добавление в корзину (localStorage) — опционально
  });

  /***********************
   * TASK 8: COPY TO CLIPBOARD BUTTON
   ***********************/
  $(document).on('click', '.copy-btn', async function () {
    const target = $(this).data('target');
    const text = $(target).text().trim();
    try {
      await navigator.clipboard.writeText(text);
      const $btn = $(this);
      const orig = $btn.text();
      $btn.text('Скопировано ✅');
      setTimeout(() => $btn.text(orig), 1600);
    } catch (err) {
      showNotification('Ошибка копирования');
    }
  });

  /***********************
   * TASK 9: LAZY LOADING IMAGES
   ***********************/
  function lazyLoad() {
    $('img.lazy').each(function () {
      const $img = $(this);
      if ($img.attr('src')) return; // уже загружено
      const top = $img.offset().top;
      const winBottom = $(window).scrollTop() + $(window).height() + 100;
      if (top < winBottom) {
        $img.attr('src', $img.data('src'));
        $img.removeClass('lazy');
      }
    });
  }
  $(window).on('scroll resize', lazyLoad);
  lazyLoad(); // выполнить сразу

  /***********************
   * РЕЙТИНГ: ЛОКАЛЬНАЯ ЛОГИКА (localStorage)
   * - один рейтинг от «пользователя» на товар (учебно)
   * - aggregate хранится в localStorage как ratings_{productId}: { sum, count } и userRating_{productId}
   ***********************/
  function getAgg(productId) {
    const raw = localStorage.getItem('ratings_' + productId);
    return raw ? JSON.parse(raw) : { sum: 0, count: 0 };
  }
  function setAgg(productId, obj) {
    localStorage.setItem('ratings_' + productId, JSON.stringify(obj));
  }
  function getUserRating(productId) {
    const raw = localStorage.getItem('userRating_' + productId);
    return raw ? parseInt(raw, 10) : null;
  }
  function setUserRating(productId, value) {
    localStorage.setItem('userRating_' + productId, value);
  }

  // инициализация отображения рейтингов
  $('.rating').each(function () {
    const productId = $(this).data('product');
    const agg = getAgg(productId);
    const avg = agg.count ? (agg.sum / agg.count) : null;
    $(this).find('.avg').text(avg ? avg.toFixed(1) : '—');
    $(this).find('.count').text(agg.count || 0);

    // показать звёзды, если пользователь уже голосовал
    const ur = getUserRating(productId);
    if (ur) {
      highlightStars($(this), ur);
    }
  });

  // helper: покрасить звезды в интерфейсе
  function highlightStars($ratingEl, value) {
    $ratingEl.find('.star').each(function () {
      const v = parseInt($(this).data('value'), 10);
      $(this).text(v <= value ? '★' : '☆');
    });
  }

  // hover UX: показываем подсветку при наведении
  $(document).on('mouseenter', '.star', function () {
    const $stars = $(this).closest('.stars');
    const v = parseInt($(this).data('value'), 10);
    $stars.find('.star').each(function () {
      const val = parseInt($(this).data('value'), 10);
      $(this).toggleClass('hover', val <= v);
      $(this).text(val <= v ? '★' : '☆');
    });
  });
  $(document).on('mouseleave', '.stars', function () {
    const $rating = $(this).closest('.rating');
    const productId = $rating.data('product');
    const ur = getUserRating(productId);
    if (ur) highlightStars($rating, ur);
    else {
      // сбросить
      $(this).find('.star').text('☆').removeClass('hover');
    }
  });

  // click on star -> upsert rating
  $(document).on('click', '.stars .star', function () {
    const $rating = $(this).closest('.rating');
    const productId = $rating.data('product');
    const value = parseInt($(this).data('value'), 10);

    // получить предыдущую оценку пользователя (если была)
    const prev = getUserRating(productId);
    const agg = getAgg(productId);

    if (prev) {
      // обновление: заменяем сумму
      agg.sum = agg.sum - prev + value;
      // count не меняется
    } else {
      agg.sum = agg.sum + value;
      agg.count = (agg.count || 0) + 1;
    }
    setAgg(productId, agg);
    setUserRating(productId, value);

    // обновить UI
    const avg = (agg.count) ? (agg.sum / agg.count) : value;
    $rating.find('.avg').text(avg ? avg.toFixed(1) : '—');
    $rating.find('.count').text(agg.count || 0);
    highlightStars($rating, value);

    showNotification('Спасибо за оценку! (' + value + '★)');
  });

  /***********************
   * ДОП: если хочешь, можно очистить все локальные рейтинги:
   * localStorage.removeItem('ratings_p1'); localStorage.removeItem('userRating_p1');
   ***********************/

  /***********************
   * ДОП: маленькие UX улучшения
   ***********************/
  // закрыть suggestions по esc
  $('#search-bar').on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('#suggestions').empty().hide();
      $(this).val('');
      applyFilters();
    }
  });

  // немного задержки для наглядности подсказок (UX)
  let suggestTimer = null;
  $('#search-bar').on('input', function () {
    clearTimeout(suggestTimer);
    suggestTimer = setTimeout(updateSuggestions, 160);
  });

  // initial filter (на случай, если параметры заданы)
  applyFilters();
});

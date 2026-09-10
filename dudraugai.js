/* ============================================================
   «Два друга · Vardininkas и Galininkas» — тренажёр
   Автор методики: Божена Анацкая · anacka.lt
   © 2026 Божена Анацкая. Все права защищены.

   Здесь: генераторы заданий, проверка, сохранение в браузере,
   повторы и весь интерфейс страницы dudraugai.html.
   Данные — в dudraugai-data.js (глобальный объект DD).
   ============================================================ */
(function () {
  'use strict';
  var D = window.DD;
  if (!D) return;

  /* ---------- утилиты ---------- */
  var NUM_RU = ['единственное число', 'множественное число'];
  var CASE_RU = { nom: 'Vardininkas (kas?)', acc: 'Galininkas (ką?)' };
  var POS = ['jis', 'ji', 'jie', 'jos'];
  var DAY = 24 * 60 * 60 * 1000;
  var INTERVALS = [1, 3, 7, 14, 30];
  var PAGE = 12;
  var MAXLEN = 5000;
  var MODES = {
    name: 'Имя и число',
    forms: 'Четыре формы',
    agreement: 'Согласование',
    action: 'Направить действие',
    translate: 'Полный перевод',
    formation: 'Словообразование'
  };

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] === false || attrs[k] == null) { /* skip */ }
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c == null || c === false) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pronounOf(noun, num) { return num === 0 ? (noun.gender === 'm' ? 'jis' : 'ji') : (noun.gender === 'm' ? 'jie' : 'jos'); }
  function posIndex(noun, num) { return POS.indexOf(pronounOf(noun, num)); }
  function hasNum(noun, num) { return !!noun.nom[num]; }
  function genderRu(noun) { return noun.gender === 'm' ? 'мужской род' : 'женский род'; }
  function tag(p) { return el('span', { class: 'dd-tag dd-tag-' + p, text: p }); }

  /* ---------- нормализация и проверка ---------- */
  function normalize(s) {
    s = String(s || '');
    try { s = s.normalize('NFC'); } catch (e) { /* старый браузер */ }
    try { s = s.toLocaleLowerCase('lt'); } catch (e) { s = s.toLowerCase(); }
    return s.replace(/[.,!?;:«»"„“”‘’'…()]/g, '').replace(/\s+/g, ' ').trim();
  }
  function matches(input, variants) {
    var v = normalize(input);
    if (!v) return false;
    return variants.some(function (x) { return normalize(x) === v; });
  }

  /* ---------- генерация заданий ---------- */
  var TASKS = [];
  var TASK = {};
  function addTask(t) {
    if (TASK[t.id]) throw new Error('duplicate task id ' + t.id);
    TASKS.push(t); TASK[t.id] = t;
  }
  function phrase(adj, noun, cs, num) {
    var pi = posIndex(noun, num);
    return adj[cs][pi] + ' ' + noun[cs][num];
  }
  function whyAgreement(adj, noun, cs, num) {
    var pi = posIndex(noun, num), pr = POS[pi];
    var s = noun.id + ' — ' + genderRu(noun) + ', ' + NUM_RU[num] + ' → ' + pr + '. ';
    s += 'Описание ' + adj.id + ' встаёт в позицию ' + pr + ': ' + adj[cs][pi] + '. ';
    if (cs === 'acc') s += 'Galininkas отвечает на ką? (кого? что?): ' + adj.nom[pi] + ' ' + noun.nom[num] + ' → ' + adj.acc[pi] + ' ' + noun.acc[num] + '.';
    else s += 'Vardininkas отвечает на kas? (кто? что?): это имя предмета.';
    if (noun.note) s += ' ' + noun.note;
    return s;
  }

  // 1. Имя и число
  D.SCENES.forEach(function (sc) {
    var noun = D.NOUN[sc.noun], adj = D.ADJ[sc.adjectives[0]];
    var baseNum = hasNum(noun, 0) ? 0 : 1;
    var target = hasNum(noun, 1) ? 1 : 0;
    var pr = pronounOf(noun, baseNum);
    var prompt = 'Исходные слова: <b>' + esc(noun.id) + '</b> (' + esc(noun.ru) + ') и <b>' + esc(adj.id) + '</b> (' + esc(adj.ru) + '). ' +
      'Напишите местоимение для слова <b>' + esc(noun.id) + '</b> и словосочетание в Vardininkas — ' + NUM_RU[target] + '.';
    var why = noun.id + ' — ' + genderRu(noun) + ' → ' + pr + '. ' +
      (target === 1 && baseNum === 0 ? 'Во множественном числе: ' + phrase(adj, noun, 'nom', 1) + ' (' + pronounOf(noun, 1) + ').' :
        target === 1 ? 'У этого слова в изучаемом значении есть только множественное число: ' + phrase(adj, noun, 'nom', 1) + '.' :
          'В изучаемом значении тренируем единственное число: ' + phrase(adj, noun, 'nom', 0) + '.');
    if (noun.note) why += ' ' + noun.note;
    addTask({
      id: 'name:' + noun.id, mode: 'name', title: cap(noun.id) + ' · ' + noun.ru, prompt: prompt,
      labels: ['Местоимение (jis / ji / jie / jos)', 'Словосочетание · ' + NUM_RU[target]],
      answers: [[pr], [phrase(adj, noun, 'nom', target)]], why: why, group: adj.group, object: noun.id
    });
  });

  // 2. Четыре формы
  D.ADJS.forEach(function (adj) {
    ['nom', 'acc'].forEach(function (cs) {
      addTask({
        id: 'forms:' + adj.id + ':' + cs, mode: 'forms', title: adj.id + ' · ' + adj.ru,
        prompt: 'Прилагательное <b>' + esc(adj.id) + '</b> (' + esc(adj.ru) + '). Напишите четыре формы в падеже <b>' + CASE_RU[cs] + '</b>: для jis, ji, jie и jos.',
        labels: POS.slice(),
        answers: adj[cs].map(function (f) { return [f]; }),
        why: 'Группа ' + (adj.group === 'as' ? '-as / -ias' : adj.group === 'us' ? '-us' : '-is / -inis') + '. ' +
          'Порядок позиций всегда один: jis, ji, jie, jos → ' + adj[cs].join(', ') + '.' +
          (adj.kind === 'us' && adj.acc[1] !== adj.id.slice(0, -2) + 'ią' ? ' Перед -ią меняется согласный: ' + adj.nom[1] + ' → ' + adj.acc[1] + '.' : '') +
          (adj.kind === 'ias' ? ' В позиции jie окончание -i: ' + adj.nom[2] + '.' : '') +
          (adj.kind === 'is' ? ' У didelis в позиции jie — dideli, а не dideliai.' : ''),
        group: adj.group
      });
    });
  });

  // 3. Согласование
  D.SCENES.forEach(function (sc) {
    var noun = D.NOUN[sc.noun];
    sc.adjectives.forEach(function (aid) {
      var adj = D.ADJ[aid];
      [0, 1].forEach(function (num) {
        if (!hasNum(noun, num)) return;
        ['nom', 'acc'].forEach(function (cs) {
          addTask({
            id: 'agreement:' + noun.id + ':' + adj.id + ':' + num + ':' + cs, mode: 'agreement',
            title: cap(noun.id) + ' + ' + adj.id,
            prompt: 'Существительное <b>' + esc(noun.id) + '</b> (' + esc(noun.ru) + ') · описание <b>' + esc(adj.id) + '</b> (' + esc(adj.ru) + '). ' +
              'Напишите словосочетание: <b>' + NUM_RU[num] + '</b>, <b>' + CASE_RU[cs] + '</b>.',
            labels: ['Словосочетание'],
            answers: [[phrase(adj, noun, cs, num)]],
            why: whyAgreement(adj, noun, cs, num), group: adj.group, object: noun.id
          });
        });
      });
    });
  });

  // 4. Направить действие
  function sentenceVariants(pron, verbForm, obj) {
    var v = [pron + ' ' + verbForm + ' ' + obj, verbForm + ' ' + obj, pron + ' ' + obj + ' ' + verbForm, obj + ' ' + verbForm];
    return v.map(cap);
  }
  D.SCENES.forEach(function (sc) {
    var noun = D.NOUN[sc.noun];
    sc.actions.forEach(function (vid, vi) {
      var verb = D.VERB[vid], adj = D.ADJ[sc.adjectives[vi % sc.adjectives.length]];
      var c = D.conjugate(verb);
      [0, 1].forEach(function (num) {
        if (!hasNum(noun, num)) return;
        var obj = phrase(adj, noun, 'acc', num);
        addTask({
          id: 'action:' + noun.id + ':' + verb.id + ':' + adj.id + ':' + num, mode: 'action',
          title: verb.id + ' → ' + noun.id,
          prompt: 'Действующий <b>aš</b> · действие <b>' + esc(verb.id) + '</b> (' + esc(verb.ru) + ') · описание <b>' + esc(adj.id) + '</b> (' + esc(adj.ru) + ') · предмет <b>' + esc(noun.id) + '</b> (' + esc(noun.ru) + ') · ' + NUM_RU[num] + '. ' +
            'Напишите целое утвердительное предложение в настоящем времени.',
          labels: ['Предложение'],
          answers: [sentenceVariants('Aš', c.pres[0], obj)],
          why: 'aš → ' + c.pres[0] + '. Действие направлено на предмет: ką? ' + obj + '. ' +
            adj.nom[posIndex(noun, num)] + ' → ' + adj.acc[posIndex(noun, num)] + ', ' + noun.nom[num] + ' → ' + noun.acc[num] + '. ' +
            'Местоимение aš можно опустить: форма глагола уже показывает действующего.' + (noun.note ? ' ' + noun.note : ''),
          group: adj.group, object: noun.id, verb: verb.id, sentence: true
        });
      });
    });
  });

  // 5. Полный перевод
  D.TRANSLATIONS.forEach(function (t, i) {
    addTask({
      id: 'translate:' + (i + 1), mode: 'translate', title: 'Перевод ' + (i + 1),
      prompt: 'Переведите на литовский: <b>' + esc(t[0]) + '</b>',
      labels: ['Литовское предложение'], answers: [t[1]], why: t[2], verb: t[3], sentence: true
    });
  });

  // 6. Словообразование
  D.UMAS.forEach(function (u) {
    addTask({
      id: 'formation:umas:' + u.adj, mode: 'formation', title: u.adj + ' → имя качества',
      prompt: 'Признак <b>' + esc(u.adj) + '</b> (' + esc(u.ru) + '). Напишите имя качества с -umas: «' + esc(u.nounRu) + '».',
      labels: ['Имя качества'], answers: [[u.noun]],
      why: 'Берём основу ' + u.adj.replace(/(ias|as|us)$/, '') + '- и добавляем блок -umas: ' + u.noun + '. Внутри блока: суффикс -um-, окончание -as → jis ' + u.noun + '.',
      group: D.ADJ[u.adj].group
    });
  });
  D.PAIRS.forEach(function (p) {
    addTask({
      id: 'formation:pair:' + p.a + ':a', mode: 'formation', title: p.a + ' · меняется само',
      prompt: '<b>' + esc(p.subjRu) + '</b> ' + esc(p.aRu) + ' (сейчас). Напишите форму глагола <b>' + esc(p.a) + '</b> для 3-го лица: «' + esc(p.subj) + ' …».',
      labels: [p.subj + ' …'], answers: [[p.a3]],
      why: p.a + ' — глагол изменения состояния, он не требует объекта: ' + p.subj + ' ' + p.a3 + '. У этой группы настоящее строится по модели -ėja. Нельзя переносить её на все глаголы с -ėti: mylėti → myli.',
      verb: p.a
    });
    addTask({
      id: 'formation:pair:' + p.a + ':b', mode: 'formation', title: p.b + ' · изменяем что-то',
      prompt: 'Я ' + esc(p.bRu.split(';')[0]) + ' <b>' + esc(p.objRu) + '</b>. Напишите литовское предложение с глаголом <b>' + esc(p.b) + '</b> (объект: ' + esc(p.obj) + ').',
      labels: ['Предложение'], answers: [sentenceVariants('Aš', p.b1, p.obj)],
      why: p.b + ' — глагол воздействия: действие направлено на ką? ' + p.obj + '. Aš ' + p.b1 + ' ' + p.obj + '.',
      verb: p.b, sentence: true
    });
  });
  D.MATERIALS.forEach(function (m) {
    addTask({
      id: 'formation:material:' + m.noun, mode: 'formation', title: m.noun + ' → описание',
      prompt: 'Материал <b>' + esc(m.noun) + '</b> (' + esc(m.ru) + '). Напишите описание «из этого материала» в позиции jis.',
      labels: ['Описание (jis)'], answers: [[m.adj]],
      why: m.note + ' → ' + m.adj + '. Четыре позиции: ' + D.ADJ[m.adj].nom.join(', ') + '.',
      group: 'is'
    });
  });

  /* ---------- сохранение (гостевой режим, этот браузер) ---------- */
  var USER = 'guest';
  var KEY = 'dd:progress:' + USER;
  var TEXT_KEY = 'dd:text:' + USER;
  var progress = { entries: {}, loaded: false, error: '' };
  var statusEl, statusTimer;

  function setStatus(msg, isError) {
    if (!statusEl) return;
    if (progress.error && !isError) msg = progress.error;
    statusEl.textContent = msg;
    statusEl.classList.toggle('dd-status-err', !!(isError || progress.error));
  }
  function loadProgress() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && typeof data === 'object' && data.entries) progress.entries = data.entries;
      }
    } catch (e) { progress.error = 'Не удалось прочитать сохранённые ответы в этом браузере.'; }
    progress.loaded = true;
    setStatus(Object.keys(progress.entries).length ? 'Прогресс загружен: сохранено в этом браузере.' : 'Ответы будут сохраняться в этом браузере.');
  }
  var saveTimer = null;
  function saveProgress(now) {
    clearTimeout(saveTimer);
    var doSave = function () {
      try {
        localStorage.setItem(KEY, JSON.stringify({ v: 1, entries: progress.entries }));
        progress.error = '';
        setStatus('Сохранено в этом браузере.');
      } catch (e) {
        progress.error = 'Браузер не разрешил сохранить ответ. Возможно, хранилище отключено или переполнено.';
        setStatus(progress.error, true);
      }
    };
    if (now) doSave(); else saveTimer = setTimeout(doSave, 300);
  }
  function entry(id) { return progress.entries[id]; }
  function ensureEntry(id) {
    if (!progress.entries[id]) progress.entries[id] = { values: [], checked: false, correct: false, attempts: 0, at: 0, level: 0, due: 0 };
    return progress.entries[id];
  }
  function setDraft(id, values) {
    var e = ensureEntry(id);
    e.draft = values.slice();
    e.at = Date.now();
    saveProgress(false);
  }
  function commitCheck(id, values, correct) {
    var e = ensureEntry(id), now = Date.now();
    e.values = values.slice();
    delete e.draft;
    var wasDueLater = e.checked && e.correct && e.due > now;
    e.checked = true; e.correct = correct; e.attempts = (e.attempts || 0) + 1; e.at = now;
    if (correct) {
      if (!wasDueLater) {
        e.level = Math.min((e.level || 0) + 1, INTERVALS.length);
        e.due = now + INTERVALS[e.level - 1] * DAY;
      }
    } else { e.level = 0; e.due = now; }
    saveProgress(true);
  }
  function confirmedCount() {
    return Object.keys(progress.entries).filter(function (k) { var e = progress.entries[k]; return e.checked && e.correct && TASK[k]; }).length;
  }
  function dueTasks() {
    var now = Date.now();
    return Object.keys(progress.entries).filter(function (k) {
      var e = progress.entries[k]; return TASK[k] && e.checked && e.due <= now;
    }).sort(function (a, b) { return progress.entries[a].due - progress.entries[b].due; }).map(function (k) { return TASK[k]; });
  }
  function lastTask() {
    var best = null, bestAt = 0;
    Object.keys(progress.entries).forEach(function (k) {
      var e = progress.entries[k];
      if (TASK[k] && e.at > bestAt) { bestAt = e.at; best = TASK[k]; }
    });
    return best;
  }

  /* ---------- вкладки ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.dd-tab'));
  var panels = {};
  tabs.forEach(function (b) { panels[b.dataset.tab] = document.getElementById('dd-' + b.dataset.tab); });
  function showTab(name) {
    tabs.forEach(function (b) {
      var on = b.dataset.tab === name;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      if (panels[b.dataset.tab]) panels[b.dataset.tab].hidden = !on;
    });
    if (name === 'intro') renderIntroCounters();
    if (name === 'review') renderReviewStats();
    try { history.replaceState(null, '', '#' + name); } catch (e) { /* ignore */ }
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { showTab(b.dataset.tab); });
    b.addEventListener('keydown', function (ev) {
      var j = ev.key === 'ArrowRight' ? i + 1 : ev.key === 'ArrowLeft' ? i - 1 : -1;
      if (j < 0 || j >= tabs.length) return;
      ev.preventDefault(); tabs[j].focus(); showTab(tabs[j].dataset.tab);
    });
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-goto]')).forEach(function (b) {
    b.addEventListener('click', function () { showTab(b.dataset.goto); window.scrollTo({ top: document.getElementById('dd-tabs').offsetTop - 70, behavior: 'smooth' }); });
  });

  /* ---------- знакомство: счётчики ---------- */
  function countBy(mode) { return TASKS.filter(function (t) { return t.mode === mode; }).length; }
  function renderIntroCounters() {
    var box = document.getElementById('dd-counters');
    if (!box) return;
    var rows = [
      ['Существительные', D.NOUNS.length], ['Прилагательные', D.ADJS.length], ['Глаголы со спряжением', D.VERBS.length],
      ['Предметы в конструкторе', D.SCENES.length], ['Все письменные задания', TASKS.length]
    ];
    Object.keys(MODES).forEach(function (m) { rows.push(['«' + MODES[m] + '»', countBy(m)]); });
    rows.push(['Подтверждённые ответы', confirmedCount()]);
    box.innerHTML = '';
    rows.forEach(function (r) {
      box.appendChild(el('div', { class: 'dd-counter' }, [el('b', { text: String(r[1]) }), el('span', { text: r[0] })]));
    });
    var cont = document.getElementById('dd-continue');
    var last = lastTask();
    cont.hidden = !last;
    cont.onclick = function () { if (last) openTask(last); };
  }

  /* ---------- спряжение: диалог ---------- */
  var dlg = document.getElementById('dd-dialog');
  function openConjugation(verb) {
    var c = D.conjugate(verb);
    var box = document.getElementById('dd-dialog-body');
    box.innerHTML = '';
    box.appendChild(el('h3', { class: 'dd-dialog-title', text: verb.id }));
    box.appendChild(el('p', { class: 'dd-muted', text: verb.ru + (verb.note ? ' · ' + verb.note : '') }));
    var persons = ['aš', 'tu', 'jis / ji', 'mes', 'jūs', 'jie / jos'];
    var table = el('table', {}, [el('thead', {}, [el('tr', {}, ['Лицо', 'Настоящее', 'Прошедшее однократное', 'Будущее', 'Повелительное'].map(function (h) { return el('th', { text: h }); }))])]);
    var tb = el('tbody');
    persons.forEach(function (p, i) {
      tb.appendChild(el('tr', {}, [el('td', { class: 'w', text: p }), el('td', { text: c.pres[i] }), el('td', { text: c.past[i] }), el('td', { text: c.fut[i] }), el('td', { text: c.imp[i] })]));
    });
    table.appendChild(tb);
    box.appendChild(el('div', { class: 'tw dd-tw' }, [table]));
    box.appendChild(el('p', { class: 'dd-muted dd-small', text: 'Показаны четыре ряда: настоящее, прошедшее однократное, будущее и повелительное. Прошедшее многократное и сослагательное здесь не отображаются.' }));
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }
  document.getElementById('dd-dialog-close').addEventListener('click', function () { dlg.close ? dlg.close() : dlg.removeAttribute('open'); });
  dlg.addEventListener('click', function (ev) { if (ev.target === dlg) { dlg.close ? dlg.close() : dlg.removeAttribute('open'); } });

  /* ---------- четыре формы прилагательного ---------- */
  function formsTable(adj) {
    var table = el('table', {}, [el('thead', {}, [el('tr', {}, ['Позиция', 'Vardininkas', 'Galininkas'].map(function (h) { return el('th', { text: h }); }))])]);
    var tb = el('tbody');
    POS.forEach(function (p, i) {
      tb.appendChild(el('tr', {}, [el('td', { class: 'w' }, [tag(p)]), el('td', { text: adj.nom[i] }), el('td', { text: adj.acc[i] })]));
    });
    table.appendChild(tb);
    return el('div', { class: 'tw dd-tw' }, [table]);
  }

  /* ---------- конструктор «Предмет и действия» ---------- */
  var C = { noun: null, num: 0, adj: null, verb: null, pron: 'aš' };
  var objSel = document.getElementById('dd-object');
  function fillSceneOptions(sel) {
    var g1 = el('optgroup', { label: 'Предметы опубликованной версии' }), g2 = el('optgroup', { label: 'Дополнительные предметы' });
    D.SCENES.forEach(function (sc) {
      var nn = D.NOUN[sc.noun];
      (sc.published ? g1 : g2).appendChild(el('option', { value: nn.id, text: nn.id + ' · ' + nn.ru }));
    });
    sel.appendChild(g1); sel.appendChild(g2);
  }
  fillSceneOptions(objSel);
  function selectNoun(id) {
    var sc = D.SCENE[id], nn = D.NOUN[id];
    C.noun = nn; C.adj = D.ADJ[sc.adjectives[0]]; C.verb = D.VERB[sc.actions[0]];
    C.num = hasNum(nn, 0) ? 0 : 1;
    objSel.value = id;
    renderBuilder();
  }
  objSel.addEventListener('change', function () { selectNoun(objSel.value); });

  function renderBuilder() {
    var nn = C.noun, sc = D.SCENE[nn.id], num = C.num, pi = posIndex(nn, num);
    // число
    var numBox = document.getElementById('dd-number');
    numBox.innerHTML = '';
    [0, 1].forEach(function (k) {
      var ok = hasNum(nn, k);
      numBox.appendChild(el('button', {
        type: 'button', class: 'dd-seg' + (num === k ? ' on' : ''), 'aria-pressed': num === k ? 'true' : 'false',
        disabled: !ok, title: ok ? '' : 'У слова ' + nn.id + ' нет этой формы в изучаемом значении',
        text: k === 0 ? 'Единственное' : 'Множественное',
        onclick: function () { C.num = k; renderBuilder(); }
      }));
    });
    document.getElementById('dd-number-note').textContent = !hasNum(nn, 0) ? 'Для ' + nn.id + ' нет единственного числа: используем множественное.' :
      !hasNum(nn, 1) ? 'В изучаемом значении у ' + nn.id + ' тренируем только единственное число.' : '';
    // карточка имени
    var name = document.getElementById('dd-name');
    name.innerHTML = '';
    name.appendChild(el('span', { class: 'dd-eyebrow', text: 'Называю · kas? · кто? что?' }));
    name.appendChild(el('div', { class: 'dd-name-row' }, [tag(POS[pi]), el('span', { class: 'dd-lt-big', text: nn.nom[num] })]));
    name.appendChild(el('p', { class: 'dd-muted', text: nn.ru + ' · ' + genderRu(nn) + ', ' + NUM_RU[num] }));
    if (nn.note) name.appendChild(el('p', { class: 'dd-note-inline', text: nn.note }));
    // описания
    var adjBox = document.getElementById('dd-adjs');
    adjBox.innerHTML = '';
    sc.adjectives.forEach(function (aid) {
      var adj = D.ADJ[aid], on = C.adj.id === aid;
      adjBox.appendChild(el('button', { type: 'button', class: 'dd-chip' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false', onclick: function () { C.adj = adj; renderBuilder(); } },
        [el('b', { text: adj.nom[pi] + ' ' + nn.nom[num] }), el('span', { text: adj.ru })]));
    });
    // действия
    var actBox = document.getElementById('dd-acts');
    actBox.innerHTML = '';
    sc.actions.forEach(function (vid) {
      var vb = D.VERB[vid], on = C.verb.id === vid;
      actBox.appendChild(el('button', { type: 'button', class: 'dd-chip' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false', onclick: function () { C.verb = vb; renderBuilder(); } },
        [el('b', { text: vb.id }), el('span', { text: vb.ru })]));
    });
    // местоимения
    var prBox = document.getElementById('dd-prons');
    prBox.innerHTML = '';
    D.PRONOUNS.forEach(function (p) {
      var on = C.pron === p.id;
      prBox.appendChild(el('button', { type: 'button', class: 'dd-seg' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false', title: p.ru, onclick: function () { C.pron = p.id; renderBuilder(); }, text: p.id }));
    });
    // итог
    var pr = D.PRONOUNS.filter(function (p) { return p.id === C.pron; })[0];
    var c = D.conjugate(C.verb);
    var verbForm = c.pres[pr.idx];
    var res = document.getElementById('dd-result');
    res.innerHTML = '';
    res.appendChild(el('span', { class: 'dd-eyebrow', text: 'Взаимодействую · ką? · кого? что?' }));
    res.appendChild(el('p', { class: 'dd-sentence' }, [cap(pr.id) + ' ' + verbForm + ' ', el('mark', { text: C.adj.acc[pi] + ' ' + nn.acc[num] }), '.']));
    res.appendChild(el('p', { class: 'dd-muted', text: pr.ru + ' · ' + C.verb.ru.split(';')[0] + ' · ' + C.adj.ru + ' · ' + nn.ru }));
    var ch = document.getElementById('dd-change');
    ch.innerHTML = '';
    ch.appendChild(el('div', { class: 'dd-change-row' }, [el('span', { text: C.adj.nom[pi] }), el('span', { class: 'dd-arrow', text: '→' }), el('b', { text: C.adj.acc[pi] })]));
    ch.appendChild(el('div', { class: 'dd-change-row' }, [el('span', { text: nn.nom[num] }), el('span', { class: 'dd-arrow', text: '→' }), el('b', { text: nn.acc[num] })]));
    ch.appendChild(el('p', { class: 'dd-muted', text: 'Вопрос ką? — кого? что? Описание согласуется с предметом по позиции ' + POS[pi] + ' (' + genderRu(nn) + ', ' + NUM_RU[num] + '), поэтому оба окончания меняются вместе. Число предмета не зависит от того, кто действует: ' + C.pron + ' → ' + verbForm + '.' }));
    document.getElementById('dd-conj-btn').textContent = 'Спряжение ' + C.verb.id;
    var fd = document.getElementById('dd-forms');
    fd.querySelector('summary').textContent = 'Четыре формы: ' + C.adj.id;
    var fb = fd.querySelector('.dd-forms-body');
    fb.innerHTML = '';
    fb.appendChild(formsTable(C.adj));
  }
  document.getElementById('dd-conj-btn').addEventListener('click', function () { openConjugation(C.verb); });
  document.getElementById('dd-write-btn').addEventListener('click', function () {
    var id = 'action:' + C.noun.id + ':' + C.verb.id + ':' + C.adj.id + ':' + C.num;
    var t = TASK[id];
    if (t) openTask(t); else openPractice({ mode: 'action', object: C.noun.id });
  });

  /* ---------- практика ---------- */
  var P = { mode: 'all', group: 'all', object: 'all', page: 0, review: false };
  var modeSel = document.getElementById('dd-f-mode'), groupSel = document.getElementById('dd-f-group'), objFSel = document.getElementById('dd-f-object');
  Object.keys(MODES).forEach(function (m) { modeSel.appendChild(el('option', { value: m, text: MODES[m] })); });
  fillSceneOptions(objFSel);
  function filtered() {
    return TASKS.filter(function (t) {
      if (P.mode !== 'all' && t.mode !== P.mode) return false;
      if (P.group !== 'all' && t.group !== P.group) return false;
      if (P.object !== 'all' && t.object !== P.object) return false;
      return true;
    });
  }
  [modeSel, groupSel, objFSel].forEach(function (s) {
    s.addEventListener('change', function () {
      P.mode = modeSel.value; P.group = groupSel.value; P.object = objFSel.value; P.page = 0;
      renderPractice();
    });
  });
  document.getElementById('dd-prev').addEventListener('click', function () { P.page = Math.max(0, P.page - 1); renderPractice(); scrollToList(); });
  document.getElementById('dd-next').addEventListener('click', function () { P.page = P.page + 1; renderPractice(); scrollToList(); });
  document.getElementById('dd-reset-filters').addEventListener('click', function () { openPractice({}); });
  function scrollToList() { document.getElementById('dd-list').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function openPractice(f) {
    P.mode = f.mode || 'all'; P.group = f.group || 'all'; P.object = f.object || 'all'; P.page = f.page || 0;
    modeSel.value = P.mode; groupSel.value = P.group; objFSel.value = P.object;
    showTab('practice'); renderPractice();
  }
  function openTask(t) {
    var list = TASKS.filter(function (x) { return x.mode === t.mode; });
    var i = list.indexOf(t);
    openPractice({ mode: t.mode, page: Math.floor(Math.max(0, i) / PAGE) });
    var card = document.getElementById('card-' + cssId(t.id));
    if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); var inp = card.querySelector('input'); if (inp) inp.focus({ preventScroll: true }); }
  }
  function cssId(s) { return s.replace(/[^A-Za-z0-9_-]/g, function (c) { return '_' + c.charCodeAt(0).toString(16); }); }

  function renderPractice() {
    var list = filtered(), pages = Math.max(1, Math.ceil(list.length / PAGE));
    if (P.page >= pages) P.page = pages - 1;
    var box = document.getElementById('dd-list');
    box.innerHTML = '';
    var empty = document.getElementById('dd-empty');
    empty.hidden = list.length > 0;
    list.slice(P.page * PAGE, P.page * PAGE + PAGE).forEach(function (t) { box.appendChild(renderCard(t, false)); });
    document.getElementById('dd-page').textContent = list.length ? 'Страница ' + (P.page + 1) + ' из ' + pages + ' · заданий: ' + list.length : '';
    document.getElementById('dd-prev').disabled = P.page === 0;
    document.getElementById('dd-next').disabled = P.page >= pages - 1;
    document.getElementById('dd-pager').hidden = list.length === 0;
  }

  var LT = ['ą', 'č', 'ę', 'ė', 'į', 'š', 'ų', 'ū', 'ž'];
  function renderCard(t, review) {
    var e = entry(t.id);
    var card = el('article', { class: 'dd-card', id: (review ? 'rev-' : 'card-') + cssId(t.id) });
    card.appendChild(el('span', { class: 'dd-eyebrow', text: MODES[t.mode] + (review ? ' · повтор' : '') }));
    card.appendChild(el('h3', { class: 'dd-card-title', text: t.title }));
    card.appendChild(el('p', { class: 'dd-prompt', html: t.prompt }));
    var inputs = [], lastFocused = null;
    var fields = el('div', { class: 'dd-fields' });
    t.labels.forEach(function (lbl, i) {
      var inp = el('input', { type: 'text', maxlength: MAXLEN, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': lbl, class: 'dd-input' });
      var start = review ? '' : (e && e.draft ? (e.draft[i] || '') : (e && e.values ? (e.values[i] || '') : ''));
      inp.value = start;
      inp.addEventListener('focus', function () { lastFocused = inp; });
      inp.addEventListener('input', function () {
        fb.hidden = true; fb.innerHTML = '';
        if (!review) setDraft(t.id, inputs.map(function (x) { return x.value; }));
        updateBtn();
      });
      inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && !btn.disabled) { ev.preventDefault(); check(); } });
      inputs.push(inp);
      fields.appendChild(el('label', { class: 'dd-field' }, [el('span', { text: lbl }), inp]));
    });
    card.appendChild(fields);
    var kb = el('div', { class: 'dd-kb', role: 'group', 'aria-label': 'Литовские буквы' });
    LT.forEach(function (ch) {
      kb.appendChild(el('button', {
        type: 'button', class: 'dd-key', text: ch, onmousedown: function (ev) { ev.preventDefault(); },
        onclick: function () {
          var inp = lastFocused || inputs[0];
          var s = inp.selectionStart == null ? inp.value.length : inp.selectionStart, en = inp.selectionEnd == null ? s : inp.selectionEnd;
          inp.value = inp.value.slice(0, s) + ch + inp.value.slice(en);
          inp.setSelectionRange(s + 1, s + 1);
          inp.focus();
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }));
    });
    card.appendChild(kb);
    var btn = el('button', { type: 'button', class: 'dd-btn', text: 'Проверить', onclick: function () { check(); } });
    var row = el('div', { class: 'dd-card-actions' }, [btn]);
    if (t.verb && D.VERB[t.verb]) row.appendChild(el('button', { type: 'button', class: 'dd-btn ghost', text: 'Спряжение ' + t.verb, onclick: function () { openConjugation(D.VERB[t.verb]); } }));
    card.appendChild(row);
    var fb = el('div', { class: 'dd-feedback', hidden: true });
    card.appendChild(fb);
    function updateBtn() { btn.disabled = !progress.loaded || inputs.some(function (x) { return !x.value.trim(); }); }
    updateBtn();
    function showFeedback(results, values) {
      fb.innerHTML = '';
      var all = results.every(Boolean);
      fb.appendChild(el('p', { class: 'dd-verdict ' + (all ? 'ok' : 'soft'), text: all ? 'Ответ подтверждён.' : (t.sentence ? 'Сравним ваш вариант с примером. Несовпадение с подготовленными вариантами само по себе не означает ошибку.' : 'Сравните форму с примером.') }));
      var ul = el('ul', { class: 'dd-fb-list' });
      t.labels.forEach(function (lbl, i) {
        ul.appendChild(el('li', {}, [
          el('span', { class: 'dd-fb-lbl', text: lbl + ': ' }),
          el('span', { class: results[i] ? 'dd-ok' : 'dd-soft', text: values[i] }),
          results[i] ? null : el('span', { class: 'dd-muted', text: ' · пример: ' + t.answers[i][0] })
        ]));
      });
      fb.appendChild(ul);
      if (all) fb.appendChild(el('p', { class: 'dd-muted', text: 'Эталон: ' + t.answers.map(function (a) { return a[0]; }).join(' · ') }));
      fb.appendChild(el('p', { class: 'dd-why', text: t.why }));
      fb.hidden = false;
    }
    function check() {
      if (btn.disabled) return;
      var values = inputs.map(function (x) { return x.value; });
      var results = values.map(function (v, i) { return matches(v, t.answers[i]); });
      commitCheck(t.id, values, results.every(Boolean));
      showFeedback(results, values);
      if (review) card.classList.add('dd-card-done');
    }
    if (!review && e && e.checked && !e.draft && e.values.length === t.labels.length) {
      var results = e.values.map(function (v, i) { return matches(v, t.answers[i]); });
      showFeedback(results, e.values);
    }
    return card;
  }

  /* ---------- повторы ---------- */
  function renderReviewStats() {
    var due = dueTasks();
    document.getElementById('dd-review-stat').textContent = due.length ? 'Карточек к повтору сейчас: ' + due.length + '.' : 'Сейчас нет карточек к повтору. Они появятся по расписанию после ваших попыток.';
  }
  document.getElementById('dd-review-start').addEventListener('click', function () {
    var box = document.getElementById('dd-review-list');
    box.innerHTML = '';
    var due = dueTasks();
    if (!due.length) { renderReviewStats(); return; }
    due.slice(0, 30).forEach(function (t) { box.appendChild(renderCard(t, true)); });
    if (due.length > 30) box.appendChild(el('p', { class: 'dd-muted', text: 'Показаны первые 30 карточек. Нажмите «Обновить повторы» после их прохождения.' }));
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('dd-review-refresh').addEventListener('click', function () { document.getElementById('dd-review-list').innerHTML = ''; renderReviewStats(); });
  document.getElementById('dd-review-exit').addEventListener('click', function () { document.getElementById('dd-review-list').innerHTML = ''; openPractice({}); });

  /* ---------- база слов ---------- */
  function renderDictionary() {
    // существительные
    var tb = document.getElementById('dd-nouns-body');
    D.NOUNS.forEach(function (nn) {
      var dash = function (s) { return s || '—'; };
      tb.appendChild(el('tr', {}, [
        el('td', { class: 'w', text: nn.id }), el('td', { class: 'g', text: nn.ru }),
        el('td', {}, [tag(nn.nom[0] ? pronounOf(nn, 0) : pronounOf(nn, 1)), nn.nom[0] && nn.nom[1] ? ' ' : '', nn.nom[0] && nn.nom[1] ? tag(pronounOf(nn, 1)) : null]),
        el('td', { text: dash(nn.nom[0]) }), el('td', { text: dash(nn.nom[1]) }), el('td', { text: dash(nn.acc[0]) }), el('td', { text: dash(nn.acc[1]) }),
        el('td', { class: 'g dd-small', text: nn.note })
      ]));
    });
    // прилагательные
    var q = document.getElementById('dd-adj-q'), g = document.getElementById('dd-adj-g'), list = document.getElementById('dd-adj-list');
    function draw() {
      var v = normalize(q.value), gr = g.value;
      list.innerHTML = '';
      var n = 0;
      D.ADJS.forEach(function (adj) {
        if (gr !== 'all' && adj.group !== gr) return;
        if (v && normalize(adj.id).indexOf(v) === -1 && normalize(adj.ru).indexOf(v) === -1) return;
        n++;
        var d = el('details', { class: 'dd-adj' }, [el('summary', {}, [el('b', { text: adj.id }), el('span', { class: 'dd-muted', text: ' · ' + adj.ru + ' · ' + (adj.group === 'as' ? '-as / -ias' : adj.group === 'us' ? '-us' : '-is / -inis') })])]);
        d.addEventListener('toggle', function () { if (d.open && !d.dataset.done) { d.dataset.done = '1'; d.appendChild(formsTable(adj)); } });
        list.appendChild(d);
      });
      document.getElementById('dd-adj-hits').textContent = n ? 'Найдено: ' + n : 'Ничего не найдено — попробуйте другое слово.';
    }
    q.addEventListener('input', draw); g.addEventListener('change', draw); draw();
    // глаголы
    var vl = document.getElementById('dd-verb-list');
    D.VERBS.forEach(function (vb) {
      vl.appendChild(el('button', { type: 'button', class: 'dd-chip', onclick: function () { openConjugation(vb); } }, [el('b', { text: vb.id }), el('span', { text: vb.ru })]));
    });
  }

  /* ---------- новые слова ---------- */
  function renderFormation() {
    var u = document.getElementById('dd-umas');
    D.UMAS.forEach(function (x) { u.appendChild(el('li', {}, [el('b', { text: x.adj }), ' (' + x.ru + ') → ', el('b', { class: 'dd-ok', text: x.noun }), ' — ' + x.nounRu])); });
    var p = document.getElementById('dd-pairs');
    D.PAIRS.forEach(function (x) {
      p.appendChild(el('li', {}, [
        el('button', { type: 'button', class: 'dd-link', text: x.a, onclick: function () { openConjugation(D.VERB[x.a]); } }), ' — ' + x.aRu + ' · ',
        el('button', { type: 'button', class: 'dd-link', text: x.b, onclick: function () { openConjugation(D.VERB[x.b]); } }), ' — ' + x.bRu,
        el('span', { class: 'dd-muted dd-block', text: x.subj + ' ' + x.a3 + '. · Aš ' + x.b1 + ' ' + x.obj + '.' })
      ]));
    });
    var m = document.getElementById('dd-materials');
    D.MATERIALS.forEach(function (x) { m.appendChild(el('li', {}, [el('b', { text: x.noun }), ' (' + x.ru + ') → ', el('b', { class: 'dd-ok', text: x.adj }), el('span', { class: 'dd-muted', text: ' · ' + x.note })])); });
  }

  /* ---------- моё пространство ---------- */
  function initSpace() {
    var ta = document.getElementById('dd-text'), st = document.getElementById('dd-text-status'), tm;
    try { ta.value = localStorage.getItem(TEXT_KEY) || ''; } catch (e) { /* ignore */ }
    function save(now) {
      clearTimeout(tm);
      var f = function () {
        try { localStorage.setItem(TEXT_KEY, ta.value); st.textContent = 'Текст сохранён в этом браузере · ' + ta.value.length + ' / ' + MAXLEN; st.classList.remove('dd-status-err'); }
        catch (e) { st.textContent = 'Браузер не разрешил сохранить текст.'; st.classList.add('dd-status-err'); }
      };
      if (now) f(); else tm = setTimeout(f, 700);
    }
    ta.addEventListener('input', function () { save(false); });
    document.getElementById('dd-text-save').addEventListener('click', function () { save(true); });
    document.getElementById('dd-text-copy').addEventListener('click', function () {
      var text = 'Проверь, пожалуйста, мой литовский текст. Я учу два падежа: Vardininkas (kas?) и Galininkas (ką?). ' +
        'Отметь, где выбрана верная конструкция, где верная конструкция с ошибкой в форме, а где нужен другой тип конструкции. Объясни просто и предложи исправленный вариант.\n\n' + ta.value;
      var done = function () { st.textContent = 'Скопировано. Вставьте текст в ChatGPT или отправьте преподавателю вручную.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { fallback(); });
      else fallback();
      function fallback() {
        var t = el('textarea', { style: 'position:fixed;left:-9999px' }); t.value = text; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) { st.textContent = 'Не удалось скопировать автоматически — выделите текст и скопируйте вручную.'; }
        document.body.removeChild(t);
      }
    });
    st.textContent = ta.value ? 'Текст восстановлен из этого браузера · ' + ta.value.length + ' / ' + MAXLEN : 'Текст сохраняется автоматически в этом браузере.';
  }

  /* ---------- запуск ---------- */
  statusEl = document.getElementById('dd-status');
  loadProgress();
  selectNoun('langas');
  renderPractice();
  renderDictionary();
  renderFormation();
  initSpace();
  renderIntroCounters();
  var h = (location.hash || '').slice(1);
  showTab(panels[h] ? h : 'intro');

  // для тестов и отладки
  window.DDApp = { TASKS: TASKS, TASK: TASK, normalize: normalize, matches: matches, MODES: MODES, showTab: showTab, openTask: openTask };
})();

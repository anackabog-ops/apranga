/*!
 * Разборы литовского · anacka.lt
 * © 2026 Божена Анацкая (Božena Anacka). Все права защищены.
 * All rights reserved.
 *
 * Авторский учебный материал. Личное и учебное использование
 * со ссылкой на автора разрешено; публикация целиком, продажа
 * и удаление указания авторства — только с письменного согласия.
 * Условия: https://apranga.netlify.app/teises.html
 */

(function(){
  // ---------- scroll spy ----------
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail a'));
  var map = {};
  links.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
  var secs = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          links.forEach(function(l){ l.classList.remove('on'); });
          var a = map[e.target.id];
          if (a) a.classList.add('on');
        }
      });
    }, { rootMargin: '-10% 0px -75% 0px', threshold: 0 });
    secs.forEach(function(s){ io.observe(s); });
  }

  // ---------- table search ----------
  var q = document.getElementById('q');
  if (q) {
  var hits = document.getElementById('hits');
  var rows = Array.prototype.slice.call(document.querySelectorAll('.tw tbody tr'));
  var items = Array.prototype.slice.call(document.querySelectorAll('.phrase li'));
  var all = rows.concat(items);
  var sections = secs;

  // снимаем всю диакритику — и литовскую (ą č ė š ū ž), и знаки ударения
  // (á à ã ą́ ...), чтобы «paltas» находило «pal̃tas», а «pirstin» — «pirštinės»
  function norm(s){
    var t = s.toLowerCase().replace(/ё/g,'е');
    try { t = t.normalize('NFD').replace(/[̀-ͯ]/g,''); }
    catch(e){
      t = t.replace(/[āăąà-å]/g,'a').replace(/[čć]/g,'c').replace(/[ēėęěè-ë]/g,'e')
           .replace(/[īįıì-ï]/g,'i').replace(/š/g,'s').replace(/[ūųù-ü]/g,'u')
           .replace(/ž/g,'z');
    }
    return t;
  }
  all.forEach(function(r){ r.dataset.k = norm(r.textContent); });

  q.addEventListener('input', function(){
    var v = norm(q.value.trim());
    if (!v) {
      all.forEach(function(r){ r.hidden = false; });
      sections.forEach(function(s){ s.hidden = false; });
      hits.textContent = '';
      return;
    }
    var n = 0;
    all.forEach(function(r){
      var m = r.dataset.k.indexOf(v) !== -1;
      r.hidden = !m;
      if (m) n++;
    });
    sections.forEach(function(s){
      var vis = Array.prototype.slice.call(s.querySelectorAll('.tw tbody tr, .phrase li'));
      if (!vis.length) { s.hidden = true; return; }
      s.hidden = !vis.some(function(r){ return !r.hidden; });
    });
    hits.textContent = n ? ('Найдено строк: ' + n) : 'Ничего не найдено — попробуйте другое слово';
  });

  } // /search

  // ---------- quiz ----------
  var Q = [
    { s:['Šalta, greitai ',' kepurę!'], o:['užsidėk','apsivilk','apsiauk'], a:0,
      w:'Голова — зона dėti. Шапка кладётся сверху, поэтому užsidėti.' },
    { s:['Ji ',' naujus odinius batus.'], o:['vilki','avi','mūvi'], a:1,
      w:'Обувь на стопе — только avėti. Форма настоящего времени: avi.' },
    { s:['Vaikas dar nemoka ',' batraiščių.'], o:['užsisegti','užsirišti','užsimauti'], a:1,
      w:'Шнурки завязывают: rišti → užsirišti.' },
    { s:['Prieš išeidamas jis ',' juodą paltą.'], o:['apsivilko','apsiavė','užsidėjo'], a:0,
      w:'Пальто — торс, корень vilk‑, результат — apsivilkti.' },
    { s:['Žiemą visada ',' šiltas pirštines.'], o:['avime','mūvime','segime'], a:1,
      w:'Перчатки натягиваются на конечности: mauti → mūvėti.' },
    { s:['Ji ',' ilgą languotą sijoną.'], o:['apsisegė','apsiavė','užsimovė'], a:0,
      w:'Юбка пристёгивается на талии: segti → apsisegti. Допустимо и apsivilko.' },
    { s:['Prašau ',' batus prie durų.'], o:['nusivilkti','nusiauti','nusiimti'], a:1,
      w:'Разуться — nusiauti. Тот же корень au‑, приставка nu‑.' },
    { s:['Mama ',' vaiką ir išėjo į darželį.'], o:['apsirengė','aprengė','apsivilko'], a:1,
      w:'Действие на другого человека — без ‑si‑: aprengti.' },
    { s:['Darbuotojai privalo ',' uniformą.'], o:['dėvėti','nešioti','vilkėti'], a:0,
      w:'Официальный, письменный регистр — dėvėti. Так пишут в правилах и инструкциях.' },
    { s:['Močiutė ',' gintaro karolius kiekvieną šventę.'], o:['vilki','nešioja','avi'], a:1,
      w:'Регулярная привычка, украшения — nešioti.' },
    { s:['Man karšta, ',' striukę.'], o:['nusivilksiu','nusiausiu','nusiimsiu'], a:0,
      w:'Куртка — торс, снимаем через nusivilkti.' },
    { s:['Jis ',' diržą ir pasitaisė marškinius.'], o:['užsirišo','apsijuosė','užsimovė'], a:1,
      w:'Ремень опоясывает: juosti → apsijuosti. Также возможно užsisegė diržą.' }
  ];

  var box = document.getElementById('quiz');
  if (!box) return;
  var scoreEl = document.getElementById('score');
  var done = 0;

  Q.forEach(function(item, i){
    var d = document.createElement('div');
    d.className = 'q';
    var stem = document.createElement('p');
    stem.className = 'stem';
    stem.appendChild(document.createTextNode(item.s[0]));
    var blank = document.createElement('span');
    blank.className = 'blank';
    blank.textContent = '…';
    stem.appendChild(blank);
    stem.appendChild(document.createTextNode(item.s[1]));
    d.appendChild(stem);

    var opts = document.createElement('div');
    opts.className = 'opts';
    var why = document.createElement('div');
    why.className = 'why';
    why.textContent = item.w;

    item.o.forEach(function(txt, j){
      var b = document.createElement('button');
      b.className = 'opt';
      b.type = 'button';
      b.textContent = txt;
      b.addEventListener('click', function(){
        if (d.dataset.answered) return;
        d.dataset.answered = '1';
        done++;
        scoreEl.textContent = 'Отвечено: ' + done + ' / ' + Q.length;
        Array.prototype.slice.call(opts.children).forEach(function(c, k){
          if (k === item.a) c.classList.add('ok');
          else if (k === j) c.classList.add('no');
        });
        blank.textContent = item.o[item.a];
        why.classList.add('show');
      });
      opts.appendChild(b);
    });

    d.appendChild(opts);
    d.appendChild(why);
    box.appendChild(d);
  });
})();

/* ---- упражнения: выбор варианта ---- */
(function(){
  [].slice.call(document.querySelectorAll('.ex-choice')).forEach(function(list){
    var items = [].slice.call(list.children), done = 0;
    var score = list.parentNode.querySelector('.score');
    items.forEach(function(li){
      var why = li.querySelector('.ex-why');
      var opts = [].slice.call(li.querySelectorAll('.opt'));
      opts.forEach(function(b){
        b.addEventListener('click', function(){
          if (li.dataset.answered) return;
          li.dataset.answered = '1';
          done++;
          if (score) score.textContent = 'Отвечено: ' + done + ' / ' + items.length;
          opts.forEach(function(o){
            if (o.dataset.ok) o.classList.add('ok');
            else if (o === b) o.classList.add('no');
          });
          if (why) why.classList.add('show');
        });
      });
    });
  });
})();

/* ---- упражнения: показать ответ ---- */
(function(){
  [].slice.call(document.querySelectorAll('.reveal-btn')).forEach(function(b){
    b.addEventListener('click', function(){
      var a = b.parentNode.querySelector('.ex-a');
      if (!a) return;
      a.classList.toggle('show');
      b.textContent = a.classList.contains('show') ? 'Скрыть' : 'Ответ';
    });
  });
})();

/* ---- переключатель темы ---- */
(function(){
  var root=document.documentElement, b=document.getElementById('theme');
  if(!b) return;
  b.addEventListener('click',function(){
    var cur=root.getAttribute('data-theme');
    if(!cur) cur = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var next = cur==='dark' ? 'light' : 'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next);}catch(e){}
  });
})();

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

/* ============================================================
   Vardininkas и Galininkas — базы слов и движок тренажёра.
   Страница /linksniai.html. Ничего из app.js не переопределяет:
   темой и боковым меню по-прежнему занимается app.js.

   Формы сверены со школьными таблицами литовского словоизменения
   (emokykla.lt, «Lietuvių kalbos žinynas», VLKK) — см. § 12 страницы.
   ============================================================ */
(function(){
"use strict";
if (!document.getElementById('lk-root')) return;

/* ---------------- нормализация ответов ----------------

   Знаки ударения (á à ã) снимаем всегда: их набирают редко, а падеж
   от них не зависит. Литовские буквы (ą č ė į š ų ū ž) — это буквы,
   а не «украшения», поэтому в мягком режиме их различие показываем
   отдельной подсказкой, но ответ засчитываем.                        */

function tidy(s){
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[‘’“”«»"']/g, ' ')
    .replace(/[.,!?;:()–—‑-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function stripStress(s){
  try { return s.normalize('NFD').replace(/[\u0300\u0301\u0303\u0308]/g, '').normalize('NFC'); }
  catch (e) { return s.replace(/[àáãâ]/g, 'a').replace(/[èé]/g, 'e').replace(/[ìí]/g, 'i')
                      .replace(/[òó]/g, 'o').replace(/[ùú]/g, 'u'); }
}
function norm(s){ return stripStress(tidy(s)); }
function flat(s){
  return norm(s)
    .replace(/ą/g, 'a').replace(/č/g, 'c').replace(/[ęė]/g, 'e').replace(/į/g, 'i')
    .replace(/š/g, 's').replace(/[ųū]/g, 'u').replace(/ž/g, 'z')
    .replace(/ё/g, 'е');
}

/* Возвращает 'ok' — точное попадание, 'near' — верно, но потеряна
   литовская буква, '' — мимо. */
function judge(input, answers){
  var v = norm(input);
  if (!v) return '';
  var i;
  for (i = 0; i < answers.length; i++) if (v === norm(answers[i])) return 'ok';
  for (i = 0; i < answers.length; i++) if (flat(input) === flat(answers[i])) return 'near';
  return '';
}

/* Какие именно буквы потерялись — для подсказки в вердикте. */
function missingLetters(input, answer){
  var a = norm(input).split(''), b = norm(answer).split(''), out = [], i;
  for (i = 0; i < b.length; i++) if (a[i] !== b[i] && /[ąčęėįšųūž]/.test(b[i])) out.push(b[i]);
  return out.filter(function(x, k, arr){ return arr.indexOf(x) === k; });
}

/* Первое несовпавшее слово — чтобы не просто сказать «неверно». */
function firstDiff(input, answer){
  var a = norm(input).split(' '), b = norm(answer).split(' '), i;
  for (i = 0; i < b.length; i++) {
    if (flat(a[i] || '') !== flat(b[i])) {
      return { pos: i + 1, got: a[i] || '—', need: tidy(answer).split(' ')[i] };
    }
  }
  if (a.length > b.length) return { pos: b.length + 1, got: a[b.length], need: '—' };
  return null;
}

function el(tag, cls, txt){
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
}

/* ============================================================
   1. ДАИКТАВАРДЖЯЙ — имена предметов
   nom: vardininkas ед. ч. · pl: vardininkas мн. ч.
   acc: galininkas ед. ч. · accPl: galininkas мн. ч.
   p: jis / ji / jie / jos · d: тип склонения · ru: перевод
   ============================================================ */
var NOUNS = [
  /* мужские на -as */
  {nom:'langas', p:'jis', pl:'langai', acc:'langą', accPl:'langus', d:'-as', ru:'окно'},
  {nom:'namas', p:'jis', pl:'namai', acc:'namą', accPl:'namus', d:'-as', ru:'дом'},
  {nom:'stalas', p:'jis', pl:'stalai', acc:'stalą', accPl:'stalus', d:'-as', ru:'стол'},
  {nom:'vaikas', p:'jis', pl:'vaikai', acc:'vaiką', accPl:'vaikus', d:'-as', ru:'ребёнок'},
  {nom:'draugas', p:'jis', pl:'draugai', acc:'draugą', accPl:'draugus', d:'-as', ru:'друг'},
  {nom:'vyras', p:'jis', pl:'vyrai', acc:'vyrą', accPl:'vyrus', d:'-as', ru:'мужчина, муж'},
  {nom:'miestas', p:'jis', pl:'miestai', acc:'miestą', accPl:'miestus', d:'-as', ru:'город'},
  {nom:'laiškas', p:'jis', pl:'laiškai', acc:'laišką', accPl:'laiškus', d:'-as', ru:'письмо'},
  {nom:'batas', p:'jis', pl:'batai', acc:'batą', accPl:'batus', d:'-as', ru:'ботинок'},
  {nom:'darbas', p:'jis', pl:'darbai', acc:'darbą', accPl:'darbus', d:'-as', ru:'работа'},
  {nom:'filmas', p:'jis', pl:'filmai', acc:'filmą', accPl:'filmus', d:'-as', ru:'фильм'},
  {nom:'daiktas', p:'jis', pl:'daiktai', acc:'daiktą', accPl:'daiktus', d:'-as', ru:'предмет, вещь'},
  {nom:'telefonas', p:'jis', pl:'telefonai', acc:'telefoną', accPl:'telefonus', d:'-as', ru:'телефон'},
  {nom:'mokytojas', p:'jis', pl:'mokytojai', acc:'mokytoją', accPl:'mokytojus', d:'-as', ru:'учитель'},
  {nom:'pienas', p:'jis', pl:'—', acc:'pieną', accPl:'—', d:'-as', ru:'молоко'},
  /* мужские на -is / -ys / -ias (мягкая основа) */
  {nom:'brolis', p:'jis', pl:'broliai', acc:'brolį', accPl:'brolius', d:'-is', ru:'брат'},
  {nom:'medis', p:'jis', pl:'medžiai', acc:'medį', accPl:'medžius', d:'-is', ru:'дерево'},
  {nom:'peilis', p:'jis', pl:'peiliai', acc:'peilį', accPl:'peilius', d:'-is', ru:'нож'},
  {nom:'sūris', p:'jis', pl:'sūriai', acc:'sūrį', accPl:'sūrius', d:'-is', ru:'сыр'},
  {nom:'kompiuteris', p:'jis', pl:'kompiuteriai', acc:'kompiuterį', accPl:'kompiuterius', d:'-is', ru:'компьютер'},
  {nom:'obuolys', p:'jis', pl:'obuoliai', acc:'obuolį', accPl:'obuolius', d:'-ys', ru:'яблоко'},
  {nom:'arklys', p:'jis', pl:'arkliai', acc:'arklį', accPl:'arklius', d:'-ys', ru:'лошадь'},
  {nom:'kelias', p:'jis', pl:'keliai', acc:'kelią', accPl:'kelius', d:'-ias', ru:'дорога, путь'},
  {nom:'svečias', p:'jis', pl:'svečiai', acc:'svečią', accPl:'svečius', d:'-ias', ru:'гость'},
  /* мужские на -us */
  {nom:'sūnus', p:'jis', pl:'sūnūs', acc:'sūnų', accPl:'sūnus', d:'-us', ru:'сын'},
  {nom:'turgus', p:'jis', pl:'turgūs', acc:'turgų', accPl:'turgus', d:'-us', ru:'рынок'},
  {nom:'dangus', p:'jis', pl:'—', acc:'dangų', accPl:'—', d:'-us', ru:'небо'},
  /* мужские на -uo и -is: разбираем отдельно как исключения */
  {nom:'vanduo', p:'jis', pl:'vandenys', acc:'vandenį', accPl:'vandenis', d:'-uo', ru:'вода', x:1},
  {nom:'dantis', p:'jis', pl:'dantys', acc:'dantį', accPl:'dantis', d:'-is (м.)', ru:'зуб', x:1},
  /* женские на -a */
  {nom:'mama', p:'ji', pl:'mamos', acc:'mamą', accPl:'mamas', d:'-a', ru:'мама'},
  {nom:'knyga', p:'ji', pl:'knygos', acc:'knygą', accPl:'knygas', d:'-a', ru:'книга'},
  {nom:'duona', p:'ji', pl:'—', acc:'duoną', accPl:'—', d:'-a', ru:'хлеб'},
  {nom:'arbata', p:'ji', pl:'arbatos', acc:'arbatą', accPl:'arbatas', d:'-a', ru:'чай'},
  {nom:'kava', p:'ji', pl:'kavos', acc:'kavą', accPl:'kavas', d:'-a', ru:'кофе'},
  {nom:'mašina', p:'ji', pl:'mašinos', acc:'mašiną', accPl:'mašinas', d:'-a', ru:'машина'},
  {nom:'daina', p:'ji', pl:'dainos', acc:'dainą', accPl:'dainas', d:'-a', ru:'песня'},
  {nom:'galva', p:'ji', pl:'galvos', acc:'galvą', accPl:'galvas', d:'-a', ru:'голова'},
  {nom:'ranka', p:'ji', pl:'rankos', acc:'ranką', accPl:'rankas', d:'-a', ru:'рука'},
  {nom:'dukra', p:'ji', pl:'dukros', acc:'dukrą', accPl:'dukras', d:'-a', ru:'дочь'},
  {nom:'sriuba', p:'ji', pl:'sriubos', acc:'sriubą', accPl:'sriubas', d:'-a', ru:'суп'},
  {nom:'valanda', p:'ji', pl:'valandos', acc:'valandą', accPl:'valandas', d:'-a', ru:'час'},
  /* женские на -ė */
  {nom:'sesė', p:'ji', pl:'sesės', acc:'sesę', accPl:'seses', d:'-ė', ru:'сестра, сестрёнка'},
  {nom:'katė', p:'ji', pl:'katės', acc:'katę', accPl:'kates', d:'-ė', ru:'кошка'},
  {nom:'gatvė', p:'ji', pl:'gatvės', acc:'gatvę', accPl:'gatves', d:'-ė', ru:'улица'},
  {nom:'kėdė', p:'ji', pl:'kėdės', acc:'kėdę', accPl:'kėdes', d:'-ė', ru:'стул'},
  {nom:'upė', p:'ji', pl:'upės', acc:'upę', accPl:'upes', d:'-ė', ru:'река'},
  {nom:'saulė', p:'ji', pl:'saulės', acc:'saulę', accPl:'saules', d:'-ė', ru:'солнце'},
  {nom:'gėlė', p:'ji', pl:'gėlės', acc:'gėlę', accPl:'gėles', d:'-ė', ru:'цветок'},
  {nom:'mergaitė', p:'ji', pl:'mergaitės', acc:'mergaitę', accPl:'mergaites', d:'-ė', ru:'девочка'},
  {nom:'duktė', p:'ji', pl:'dukterys', acc:'dukterį', accPl:'dukteris', d:'-ė', ru:'дочь', x:1},
  /* женские на -is */
  {nom:'moteris', p:'ji', pl:'moterys', acc:'moterį', accPl:'moteris', d:'-is', ru:'женщина'},
  {nom:'akis', p:'ji', pl:'akys', acc:'akį', accPl:'akis', d:'-is', ru:'глаз'},
  {nom:'širdis', p:'ji', pl:'širdys', acc:'širdį', accPl:'širdis', d:'-is', ru:'сердце'},
  {nom:'naktis', p:'ji', pl:'naktys', acc:'naktį', accPl:'naktis', d:'-is', ru:'ночь'},
  {nom:'žuvis', p:'ji', pl:'žuvys', acc:'žuvį', accPl:'žuvis', d:'-is', ru:'рыба'},
  {nom:'pilis', p:'ji', pl:'pilys', acc:'pilį', accPl:'pilis', d:'-is', ru:'замок'},
  {nom:'sesuo', p:'ji', pl:'seserys', acc:'seserį', accPl:'seseris', d:'-uo', ru:'сестра', x:1},
  /* только множественное */
  {nom:'durys', p:'jos', pl:'durys', acc:'—', accPl:'duris', d:'только мн.', ru:'дверь'},
  {nom:'žirklės', p:'jos', pl:'žirklės', acc:'—', accPl:'žirkles', d:'только мн.', ru:'ножницы'},
  {nom:'akiniai', p:'jie', pl:'akiniai', acc:'—', accPl:'akinius', d:'только мн.', ru:'очки'},
  {nom:'marškiniai', p:'jie', pl:'marškiniai', acc:'—', accPl:'marškinius', d:'только мн.', ru:'рубашка'},
  {nom:'pietūs', p:'jie', pl:'pietūs', acc:'—', accPl:'pietus', d:'только мн.', ru:'обед'}
];

/* ============================================================
   2. БЮДВАРДЖЯЙ — прилагательные, четыре формы + galininkas
   g: группа · jis / ji / jie / jos — vardininkas
   ajis / aji / ajie / ajos — galininkas тех же четырёх форм
   ============================================================ */
var ADJS = [
  /* группа -as: jis -as · ji -a · jie -i · jos -os */
  {g:'as', jis:'naujas', ji:'nauja', jie:'nauji', jos:'naujos', ru:'новый'},
  {g:'as', jis:'senas', ji:'sena', jie:'seni', jos:'senos', ru:'старый'},
  {g:'as', jis:'geras', ji:'gera', jie:'geri', jos:'geros', ru:'хороший'},
  {g:'as', jis:'blogas', ji:'bloga', jie:'blogi', jos:'blogos', ru:'плохой'},
  {g:'as', jis:'baltas', ji:'balta', jie:'balti', jos:'baltos', ru:'белый'},
  {g:'as', jis:'juodas', ji:'juoda', jie:'juodi', jos:'juodos', ru:'чёрный'},
  {g:'as', jis:'šaltas', ji:'šalta', jie:'šalti', jos:'šaltos', ru:'холодный'},
  {g:'as', jis:'šiltas', ji:'šilta', jie:'šilti', jos:'šiltos', ru:'тёплый'},
  {g:'as', jis:'karštas', ji:'karšta', jie:'karšti', jos:'karštos', ru:'горячий'},
  {g:'as', jis:'mažas', ji:'maža', jie:'maži', jos:'mažos', ru:'маленький'},
  {g:'as', jis:'ilgas', ji:'ilga', jie:'ilgi', jos:'ilgos', ru:'длинный'},
  {g:'as', jis:'trumpas', ji:'trumpa', jie:'trumpi', jos:'trumpos', ru:'короткий'},
  {g:'as', jis:'aukštas', ji:'aukšta', jie:'aukšti', jos:'aukštos', ru:'высокий'},
  {g:'as', jis:'žemas', ji:'žema', jie:'žemi', jos:'žemos', ru:'низкий'},
  {g:'as', jis:'siauras', ji:'siaura', jie:'siauri', jos:'siauros', ru:'узкий'},
  {g:'as', jis:'pilnas', ji:'pilna', jie:'pilni', jos:'pilnos', ru:'полный'},
  {g:'as', jis:'sausas', ji:'sausa', jie:'sausi', jos:'sausos', ru:'сухой'},
  {g:'as', jis:'drėgnas', ji:'drėgna', jie:'drėgni', jos:'drėgnos', ru:'влажный'},
  {g:'as', jis:'jaunas', ji:'jauna', jie:'jauni', jos:'jaunos', ru:'молодой'},
  {g:'as', jis:'sveikas', ji:'sveika', jie:'sveiki', jos:'sveikos', ru:'здоровый'},
  {g:'as', jis:'linksmas', ji:'linksma', jie:'linksmi', jos:'linksmos', ru:'весёлый'},
  {g:'as', jis:'liūdnas', ji:'liūdna', jie:'liūdni', jos:'liūdnos', ru:'грустный'},
  {g:'as', jis:'storas', ji:'stora', jie:'stori', jos:'storos', ru:'толстый'},
  {g:'as', jis:'plonas', ji:'plona', jie:'ploni', jos:'plonos', ru:'тонкий'},
  {g:'as', jis:'lengvas', ji:'lengva', jie:'lengvi', jos:'lengvos', ru:'лёгкий'},
  {g:'as', jis:'greitas', ji:'greita', jie:'greiti', jos:'greitos', ru:'быстрый'},
  {g:'as', jis:'lėtas', ji:'lėta', jie:'lėti', jos:'lėtos', ru:'медленный'},
  {g:'as', jis:'turtingas', ji:'turtinga', jie:'turtingi', jos:'turtingos', ru:'богатый'},
  {g:'as', jis:'naudingas', ji:'naudinga', jie:'naudingi', jos:'naudingos', ru:'полезный'},
  {g:'as', jis:'mielas', ji:'miela', jie:'mieli', jos:'mielos', ru:'милый'},
  {g:'as', jis:'laisvas', ji:'laisva', jie:'laisvi', jos:'laisvos', ru:'свободный'},
  {g:'as', jis:'kietas', ji:'kieta', jie:'kieti', jos:'kietos', ru:'твёрдый'},
  {g:'as', jis:'minkštas', ji:'minkšta', jie:'minkšti', jos:'minkštos', ru:'мягкий'},
  {g:'as', jis:'tuščias', ji:'tuščia', jie:'tušti', jos:'tuščios', ru:'пустой', x:1},
  /* группа -us: jis -us · ji -i · jie -ūs · jos -ios */
  {g:'us', jis:'gražus', ji:'graži', jie:'gražūs', jos:'gražios', ru:'красивый'},
  {g:'us', jis:'ramus', ji:'rami', jie:'ramūs', jos:'ramios', ru:'спокойный'},
  {g:'us', jis:'malonus', ji:'maloni', jie:'malonūs', jos:'malonios', ru:'приятный'},
  {g:'us', jis:'skanus', ji:'skani', jie:'skanūs', jos:'skanios', ru:'вкусный'},
  {g:'us', jis:'gardus', ji:'gardi', jie:'gardūs', jos:'gardžios', ru:'вкусный, лакомый'},
  {g:'us', jis:'sunkus', ji:'sunki', jie:'sunkūs', jos:'sunkios', ru:'тяжёлый, трудный'},
  {g:'us', jis:'saldus', ji:'saldi', jie:'saldūs', jos:'saldžios', ru:'сладкий'},
  {g:'us', jis:'kartus', ji:'karti', jie:'kartūs', jos:'karčios', ru:'горький'},
  {g:'us', jis:'platus', ji:'plati', jie:'platūs', jos:'plačios', ru:'широкий'},
  {g:'us', jis:'gilus', ji:'gili', jie:'gilūs', jos:'gilios', ru:'глубокий'},
  {g:'us', jis:'švarus', ji:'švari', jie:'švarūs', jos:'švarios', ru:'чистый'},
  {g:'us', jis:'brangus', ji:'brangi', jie:'brangūs', jos:'brangios', ru:'дорогой'},
  {g:'us', jis:'pigus', ji:'pigi', jie:'pigūs', jos:'pigios', ru:'дешёвый'},
  {g:'us', jis:'įdomus', ji:'įdomi', jie:'įdomūs', jos:'įdomios', ru:'интересный'},
  {g:'us', jis:'drąsus', ji:'drąsi', jie:'drąsūs', jos:'drąsios', ru:'смелый'},
  {g:'us', jis:'stiprus', ji:'stipri', jie:'stiprūs', jos:'stiprios', ru:'сильный'},
  {g:'us', jis:'baisus', ji:'baisi', jie:'baisūs', jos:'baisios', ru:'страшный'},
  {g:'us', jis:'saugus', ji:'saugi', jie:'saugūs', jos:'saugios', ru:'безопасный'},
  {g:'us', jis:'tamsus', ji:'tamsi', jie:'tamsūs', jos:'tamsios', ru:'тёмный'},
  {g:'us', jis:'šviesus', ji:'šviesi', jie:'šviesūs', jos:'šviesios', ru:'светлый'},
  {g:'us', jis:'garsus', ji:'garsi', jie:'garsūs', jos:'garsios', ru:'громкий, знаменитый'},
  {g:'us', jis:'tylus', ji:'tyli', jie:'tylūs', jos:'tylios', ru:'тихий'},
  {g:'us', jis:'sotus', ji:'soti', jie:'sotūs', jos:'sočios', ru:'сытный'},
  {g:'us', jis:'gausus', ji:'gausi', jie:'gausūs', jos:'gausios', ru:'обильный'},
  /* группа -is: jis -is · ji -ė · jie -iai · jos -ės */
  {g:'is', jis:'medinis', ji:'medinė', jie:'mediniai', jos:'medinės', ru:'деревянный'},
  {g:'is', jis:'stiklinis', ji:'stiklinė', jie:'stikliniai', jos:'stiklinės', ru:'стеклянный'},
  {g:'is', jis:'metalinis', ji:'metalinė', jie:'metaliniai', jos:'metalinės', ru:'металлический'},
  {g:'is', jis:'popierinis', ji:'popierinė', jie:'popieriniai', jos:'popierinės', ru:'бумажный'},
  {g:'is', jis:'odinis', ji:'odinė', jie:'odiniai', jos:'odinės', ru:'кожаный'},
  {g:'is', jis:'vilnonis', ji:'vilnonė', jie:'vilnoniai', jos:'vilnonės', ru:'шерстяной'},
  {g:'is', jis:'medvilninis', ji:'medvilninė', jie:'medvilniniai', jos:'medvilninės', ru:'хлопковый'},
  {g:'is', jis:'auksinis', ji:'auksinė', jie:'auksiniai', jos:'auksinės', ru:'золотой'},
  {g:'is', jis:'sidabrinis', ji:'sidabrinė', jie:'sidabriniai', jos:'sidabrinės', ru:'серебряный'},
  {g:'is', jis:'molinis', ji:'molinė', jie:'moliniai', jos:'molinės', ru:'глиняный'},
  {g:'is', jis:'plastikinis', ji:'plastikinė', jie:'plastikiniai', jos:'plastikinės', ru:'пластиковый'},
  {g:'is', jis:'rytinis', ji:'rytinė', jie:'rytiniai', jos:'rytinės', ru:'утренний'},
  {g:'is', jis:'vakarinis', ji:'vakarinė', jie:'vakariniai', jos:'vakarinės', ru:'вечерний'},
  {g:'is', jis:'naktinis', ji:'naktinė', jie:'naktiniai', jos:'naktinės', ru:'ночной'},
  {g:'is', jis:'žieminis', ji:'žieminė', jie:'žieminiai', jos:'žieminės', ru:'зимний'},
  {g:'is', jis:'vasarinis', ji:'vasarinė', jie:'vasariniai', jos:'vasarinės', ru:'летний'},
  {g:'is', jis:'kasdienis', ji:'kasdienė', jie:'kasdieniai', jos:'kasdienės', ru:'повседневный'},
  {g:'is', jis:'paskutinis', ji:'paskutinė', jie:'paskutiniai', jos:'paskutinės', ru:'последний'},
  {g:'is', jis:'viršutinis', ji:'viršutinė', jie:'viršutiniai', jos:'viršutinės', ru:'верхний'},
  {g:'is', jis:'apatinis', ji:'apatinė', jie:'apatiniai', jos:'apatinės', ru:'нижний'},
  {g:'is', jis:'vidinis', ji:'vidinė', jie:'vidiniai', jos:'vidinės', ru:'внутренний'},
  {g:'is', jis:'išorinis', ji:'išorinė', jie:'išoriniai', jos:'išorinės', ru:'внешний'},
  {g:'is', jis:'didelis', ji:'didelė', jie:'dideli', jos:'didelės', ru:'большой', x:1}
];


/* Galininkas прилагательного зависит только от группы, поэтому формы
   не храним, а выводим: мужские — из словарной формы (jis),
   женские — из формы jos, где мягкость основы уже видна
   (saldžios → saldžią, karčios → karčią).                            */
function adjAcc(a, form){
  if (form === 'jis') {
    if (a.g === 'as') return a.jis.replace(/as$/, 'ą');
    if (a.g === 'us') return a.jis.replace(/us$/, 'ų');
    return a.jis.replace(/is$/, 'į');
  }
  if (form === 'jie') return a.g === 'is' ? a.jos.replace(/ės$/, 'ius') : a.jos.replace(/os$/, 'us');
  if (form === 'ji')  return a.g === 'is' ? a.jos.replace(/ės$/, 'ę')   : a.jos.replace(/os$/, 'ą');
  return                a.g === 'is' ? a.jos.replace(/ės$/, 'es')  : a.jos.replace(/os$/, 'as');
}

/* ============================================================
   3. ВЕЙКСМАЖОДЖЯЙ — переходные глаголы: они и требуют galininkas.
   inf · aš (1 л. ед. ч.) · jis (3 л.) · ru
   ============================================================ */
var VERBS = [
  {inf:'matyti', as:'matau', jis:'mato', ru:'видеть'},
  {inf:'pamatyti', as:'pamatau', jis:'pamato', ru:'увидеть'},
  {inf:'girdėti', as:'girdžiu', jis:'girdi', ru:'слышать'},
  {inf:'turėti', as:'turiu', jis:'turi', ru:'иметь'},
  {inf:'pirkti', as:'perku', jis:'perka', ru:'покупать'},
  {inf:'valgyti', as:'valgau', jis:'valgo', ru:'есть'},
  {inf:'gerti', as:'geriu', jis:'geria', ru:'пить'},
  {inf:'skaityti', as:'skaitau', jis:'skaito', ru:'читать'},
  {inf:'rašyti', as:'rašau', jis:'rašo', ru:'писать'},
  {inf:'piešti', as:'piešiu', jis:'piešia', ru:'рисовать'},
  {inf:'atidaryti', as:'atidarau', jis:'atidaro', ru:'открывать'},
  {inf:'uždaryti', as:'uždarau', jis:'uždaro', ru:'закрывать'},
  {inf:'valyti', as:'valau', jis:'valo', ru:'чистить, убирать'},
  {inf:'plauti', as:'plaunu', jis:'plauna', ru:'мыть'},
  {inf:'mylėti', as:'myliu', jis:'myli', ru:'любить'},
  {inf:'žinoti', as:'žinau', jis:'žino', ru:'знать'},
  {inf:'suprasti', as:'suprantu', jis:'supranta', ru:'понимать'},
  {inf:'daryti', as:'darau', jis:'daro', ru:'делать'},
  {inf:'imti', as:'imu', jis:'ima', ru:'брать'},
  {inf:'nešti', as:'nešu', jis:'neša', ru:'нести'},
  {inf:'nešioti', as:'nešioju', jis:'nešioja', ru:'носить'},
  {inf:'vežti', as:'vežu', jis:'veža', ru:'везти'},
  {inf:'gaminti', as:'gaminu', jis:'gamina', ru:'готовить (еду)'},
  {inf:'ruošti', as:'ruošiu', jis:'ruošia', ru:'готовить, снаряжать'},
  {inf:'taisyti', as:'taisau', jis:'taiso', ru:'чинить'},
  {inf:'statyti', as:'statau', jis:'stato', ru:'строить, ставить'},
  {inf:'keisti', as:'keičiu', jis:'keičia', ru:'менять'},
  {inf:'dažyti', as:'dažau', jis:'dažo', ru:'красить'},
  {inf:'pjauti', as:'pjaunu', jis:'pjauna', ru:'резать'},
  {inf:'rasti', as:'randu', jis:'randa', ru:'находить'},
  {inf:'prarasti', as:'prarandu', jis:'praranda', ru:'терять'},
  {inf:'laikyti', as:'laikau', jis:'laiko', ru:'держать'},
  {inf:'dėti', as:'dedu', jis:'deda', ru:'класть'},
  {inf:'kelti', as:'keliu', jis:'kelia', ru:'поднимать'},
  {inf:'kviesti', as:'kviečiu', jis:'kviečia', ru:'приглашать'},
  {inf:'dovanoti', as:'dovanoju', jis:'dovanoja', ru:'дарить'},
  {inf:'baigti', as:'baigiu', jis:'baigia', ru:'заканчивать'},
  {inf:'pradėti', as:'pradedu', jis:'pradeda', ru:'начинать'},
  {inf:'pamiršti', as:'pamirštu', jis:'pamiršta', ru:'забывать'},
  {inf:'atsiminti', as:'atsimenu', jis:'atsimena', ru:'помнить'},
  {inf:'jausti', as:'jaučiu', jis:'jaučia', ru:'чувствовать'},
  {inf:'mokyti', as:'mokau', jis:'moko', ru:'учить (кого-то)'},
  {inf:'šildyti', as:'šildau', jis:'šildo', ru:'греть'},
  {inf:'gerinti', as:'gerinu', jis:'gerina', ru:'улучшать'}
];

/* Глаголы, которые НЕ берут galininkas — на них чаще всего спотыкаются. */
var NOT_ACC = [
  {inf:'norėti', c:'kilmininkas · ko?', ex:'noriu kavos', ru:'хотеть'},
  {inf:'ieškoti', c:'kilmininkas · ko?', ex:'ieškau raktų', ru:'искать'},
  {inf:'laukti', c:'kilmininkas · ko?', ex:'laukiu autobuso', ru:'ждать'},
  {inf:'bijoti', c:'kilmininkas · ko?', ex:'bijau šuns', ru:'бояться'},
  {inf:'klausytis', c:'kilmininkas · ko?', ex:'klausausi muzikos', ru:'слушать'},
  {inf:'prašyti', c:'kilmininkas · ko?', ex:'prašau pagalbos', ru:'просить'},
  {inf:'mokytis', c:'kilmininkas · ko?', ex:'mokausi lietuvių kalbos', ru:'учиться'},
  {inf:'padėti', c:'naudininkas · kam?', ex:'padedu mamai', ru:'помогать'},
  {inf:'skambinti', c:'naudininkas · kam?', ex:'skambinu broliui', ru:'звонить'},
  {inf:'atsakyti', c:'naudininkas · kam?', ex:'atsakau mokytojui', ru:'отвечать'},
  {inf:'naudotis', c:'įnagininkas · kuo?', ex:'naudojuosi kompiuteriu', ru:'пользоваться'},
  {inf:'domėtis', c:'įnagininkas · kuo?', ex:'domiuosi menu', ru:'интересоваться'}
];

/* ============================================================
   4. ЖОДЖЮ ДАРИБА — словообразование от прилагательного
   ============================================================ */
var DERIV = [
  {adj:'gražus', ru:'красивый', umas:'gražumas', umasRu:'красота', eti:'gražėti', etiRu:'становиться красивее', inti:'gražinti', intiRu:'украшать, делать красивее'},
  {adj:'geras', ru:'хороший', umas:'gerumas', umasRu:'доброта', eti:'gerėti', etiRu:'улучшаться', inti:'gerinti', intiRu:'улучшать'},
  {adj:'blogas', ru:'плохой', umas:'blogumas', umasRu:'плохое качество', eti:'blogėti', etiRu:'ухудшаться', inti:'bloginti', intiRu:'ухудшать'},
  {adj:'ramus', ru:'спокойный', umas:'ramumas', umasRu:'спокойствие', eti:'ramėti', etiRu:'успокаиваться', inti:'raminti', intiRu:'успокаивать'},
  {adj:'malonus', ru:'приятный', umas:'malonumas', umasRu:'удовольствие', eti:'—', etiRu:'—', inti:'—', intiRu:'—'},
  {adj:'sunkus', ru:'тяжёлый', umas:'sunkumas', umasRu:'тяжесть, трудность', eti:'sunkėti', etiRu:'становиться тяжелее', inti:'sunkinti', intiRu:'утяжелять'},
  {adj:'lengvas', ru:'лёгкий', umas:'lengvumas', umasRu:'лёгкость', eti:'lengvėti', etiRu:'становиться легче', inti:'lengvinti', intiRu:'облегчать'},
  {adj:'ilgas', ru:'длинный', umas:'ilgumas', umasRu:'длина', eti:'ilgėti', etiRu:'удлиняться', inti:'ilginti', intiRu:'удлинять'},
  {adj:'trumpas', ru:'короткий', umas:'trumpumas', umasRu:'краткость', eti:'trumpėti', etiRu:'укорачиваться', inti:'trumpinti', intiRu:'укорачивать'},
  {adj:'šiltas', ru:'тёплый', umas:'šiltumas', umasRu:'теплота', eti:'šiltėti', etiRu:'теплеть', inti:'šildyti', intiRu:'греть'},
  {adj:'didelis', ru:'большой', umas:'didumas', umasRu:'величина', eti:'didėti', etiRu:'расти, увеличиваться', inti:'didinti', intiRu:'увеличивать'},
  {adj:'mažas', ru:'маленький', umas:'mažumas', umasRu:'малость', eti:'mažėti', etiRu:'уменьшаться', inti:'mažinti', intiRu:'уменьшать'},
  {adj:'švarus', ru:'чистый', umas:'švarumas', umasRu:'чистота', eti:'švarėti', etiRu:'становиться чище', inti:'švarinti', intiRu:'чистить, делать чище'},
  {adj:'stiprus', ru:'сильный', umas:'stiprumas', umasRu:'сила', eti:'stiprėti', etiRu:'крепнуть', inti:'stiprinti', intiRu:'укреплять'},
  {adj:'brangus', ru:'дорогой', umas:'brangumas', umasRu:'дороговизна', eti:'brangti', etiRu:'дорожать', inti:'branginti', intiRu:'ценить, повышать цену'},
  {adj:'tamsus', ru:'тёмный', umas:'tamsumas', umasRu:'темнота', eti:'tamsėti', etiRu:'темнеть', inti:'tamsinti', intiRu:'затемнять'},
  {adj:'šviesus', ru:'светлый', umas:'šviesumas', umasRu:'светлота', eti:'šviesėti', etiRu:'светлеть', inti:'šviesinti', intiRu:'осветлять'},
  {adj:'aukštas', ru:'высокий', umas:'aukštumas', umasRu:'высота', eti:'aukštėti', etiRu:'становиться выше', inti:'aukštinti', intiRu:'повышать, возвышать'}
];

/* ============================================================
   5. ЗАДАНИЯ
   Каждое задание: q — вопрос, hint — подсказка, ans — принимаемые
   при вводе ответы, opts — варианты с объяснением к КАЖДОМУ
   (в том числе к неверным), rule — правило одной строкой.
   ============================================================ */

var GEND_WHY = {
  jis: 'jis — имя мужское, единственное число. В vardininkas у него окончания -as, -is, -ys, -ias, -us, -uo.',
  ji:  'ji — имя женское, единственное число. В vardininkas окончания -a, -ė, -is.',
  jie: 'jie — имя мужское, множественное число. Окончания -ai, -iai, -ūs, -ys.',
  jos: 'jos — имя женское, множественное число. Окончания -os, -ės, -ys.'
};
function gender(word, tail, right, why, hint){
  return {
    q: '<b>' + word + '</b> — это jis, ji, jie или jos?',
    hint: hint || 'Смотрим только на окончание vardininkas.',
    ans: [right],
    rule: 'Имя предмета — мужское или женское — определяем по окончанию именительного падежа.',
    opts: ['jis', 'ji', 'jie', 'jos'].map(function(k){
      return {
        t: k, ok: k === right,
        w: k === right ? why
                       : GEND_WHY[k] + ' У «' + word + '» окончание ' + tail + ' — под это не подходит.'
      };
    })
  };
}

var DRILLS = [];

/* ---------- 1. Имя мужское или женское ---------- */
DRILLS.push({
  id: 'rod',
  title: 'Vardininkas: имя мужское или женское',
  sub: 'Пока не назвали предмет и не определили его имя, никакого действия на него направить нельзя. Начинаем отсюда.',
  rule: 'jis · ji · jie · jos — четыре ярлыка, которые мы ставим на любой предмет. Ставим их по окончанию vardininkas.',
  items: [
    gender('langas', '-as', 'jis', 'Окончание -as — имя мужское, единственное число: jis langas.'),
    gender('mama', '-a', 'ji', 'Окончание -a — имя женское, единственное число: ji mama.'),
    gender('sesė', '-ė', 'ji', 'Окончание -ė — имя женское, единственное число: ji sesė.'),
    gender('brolis', '-is', 'jis', 'Окончание -is бывает и мужским, и женским. У «brolis» — мужское: jis brolis (kilmininkas brolio).',
           'Окончание -is коварное: сверьтесь со словарём или с родительным падежом.'),
    gender('moteris', '-is', 'ji', 'Тоже -is, но имя женское: ji moteris (kilmininkas moters). Пара brolis / moteris — главная причина, почему -is надо запоминать вместе со словом.',
           'Окончание -is коварное: сверьтесь со словарём или с родительным падежом.'),
    gender('sūnus', '-us', 'jis', 'Окончание -us — имя мужское, единственное число: jis sūnus.'),
    gender('obuolys', '-ys', 'jis', 'Окончание -ys — имя мужское, единственное число: jis obuolys (мн. ч. obuoliai).'),
    gender('kėdė', '-ė', 'ji', 'Окончание -ė — имя женское, единственное число: ji kėdė.'),
    gender('langai', '-ai', 'jie', 'Окончание -ai — имя мужское, множественное число: jie langai.'),
    gender('gėlės', '-ės', 'jos', 'Окончание -ės — имя женское, множественное число: jos gėlės.'),
    gender('durys', '-ys', 'jos', 'Durys существует только во множественном числе и только женское: jos durys. Одной «двери» в литовском нет.',
           'Есть предметы, у которых единственного числа просто нет.'),
    gender('akiniai', '-iai', 'jie', 'Akiniai — тоже только множественное, но мужское: jie akiniai.',
           'Есть предметы, у которых единственного числа просто нет.'),
    gender('vanduo', '-uo', 'jis', 'Окончание -uo — имя мужское: jis vanduo. Основа при этом меняется: vandens, vandenį.',
           'Окончание -uo встречается у нескольких важных слов: vanduo, akmuo, šuo.'),
    gender('sesuo', '-uo', 'ji', 'Здесь -uo, но имя женское: ji sesuo (kilmininkas sesers, galininkas seserį). Пара vanduo / sesuo — исключения, которые учат парой.',
           'Окончание -uo встречается у нескольких важных слов: vanduo, akmuo, šuo, sesuo, duktė.')
  ]
});

/* ---------- 2. Множественное число vardininkas ---------- */
DRILLS.push({
  id: 'daug',
  title: 'Vardininkas: единственное → множественное',
  sub: 'Всё, что существует, бывает одно и бывает много. Это второе, что мы делаем с именем предмета.',
  rule: '-as → -ai · -is → -iai · -ys → -iai · -us → -ūs · -a → -os · -ė → -ės · -is (ж.) → -ys',
  items: [
    { q: 'Один <b>langas</b> — много …?', hint: 'Мужское -as.', ans: ['langai'],
      rule: '-as → -ai', opts: [
      { t:'langai', ok:1, w:'Мужское -as в множественном даёт -ai: langas → langai.' },
      { t:'langos', ok:0, w:'-os — женское окончание (mama → mamos). Langas мужское.' },
      { t:'langus', ok:0, w:'Langus — это уже galininkas множественного («вижу окна»), а не имя предмета.' },
      { t:'langais', ok:0, w:'Окончание -ais — įnagininkas («чем? окнами»), другой падеж.' } ] },
    { q: 'Одна <b>sesė</b> — много …?', hint: 'Женское -ė.', ans: ['sesės'],
      rule: '-ė → -ės', opts: [
      { t:'sesės', ok:1, w:'Женское -ė в множественном даёт -ės: sesė → sesės.' },
      { t:'seses', ok:0, w:'Seses — это galininkas множественного («вижу сестёр»). Имя предмета — sesės.' },
      { t:'sesos', ok:0, w:'-os даёт только окончание -a: mama → mamos. У sesė основа на -ė.' },
      { t:'sesiai', ok:0, w:'-iai — мужское окончание (brolis → broliai).' } ] },
    { q: 'Одна <b>moteris</b> — много …?', hint: 'Женское -is.', ans: ['moterys'],
      rule: '-is (ж.) → -ys', opts: [
      { t:'moterys', ok:1, w:'Женское -is в множественном даёт -ys: moteris → moterys. Так же akis → akys, naktis → naktys.' },
      { t:'moteriai', ok:0, w:'-iai — мужское окончание, а moteris женское.' },
      { t:'moteris', ok:0, w:'Moteris — это либо vardininkas единственного, либо galininkas множественного. Как «много» не годится.' },
      { t:'moterės', ok:0, w:'-ės бывает у основ на -ė (sesė → sesės), а moteris на -ė не оканчивается.' } ] },
    { q: 'Один <b>brolis</b> — много …?', hint: 'Мужское -is.', ans: ['broliai'],
      rule: '-is (м.) → -iai', opts: [
      { t:'broliai', ok:1, w:'Мужское -is даёт -iai: brolis → broliai. Основа мягкая, поэтому i сохраняется.' },
      { t:'brolys', ok:0, w:'-ys во множественном бывает у женского -is (moterys) и у мужского dantys, но не у brolis.' },
      { t:'brolius', ok:0, w:'Brolius — galininkas множественного («вижу братьев»).' },
      { t:'broliais', ok:0, w:'-ais — įnagininkas, другой падеж.' } ] },
    { q: 'Один <b>medis</b> — много …?', hint: 'Мужское -is, основа на -d-.', ans: ['medžiai'],
      rule: '-is → -iai, при этом d + i → dž', opts: [
      { t:'medžiai', ok:1, w:'Medis → medžiai. Перед мягким окончанием d переходит в dž — то же будет и в galininkas: medžius.' },
      { t:'mediai', ok:0, w:'Окончание выбрано верно, но чередование d → dž пропущено: правильно medžiai.' },
      { t:'medys', ok:0, w:'-ys здесь не бывает: medis мужское, оно даёт -iai.' },
      { t:'medžius', ok:0, w:'Medžius — galininkas множественного, а не имя предмета.' } ] },
    { q: 'Один <b>sūnus</b> — много …?', hint: 'Мужское -us.', ans: ['sūnūs'],
      rule: '-us → -ūs', opts: [
      { t:'sūnūs', ok:1, w:'Мужское -us даёт долгое -ūs: sūnus → sūnūs. Так же turgus → turgūs.' },
      { t:'sūnus', ok:0, w:'Это либо vardininkas единственного, либо galininkas множественного. Различает их только долгота: sūnūs — имя, sūnus — «кого?».' },
      { t:'sūnai', ok:0, w:'-ai бывает у основ на -as (langas → langai), а не на -us.' },
      { t:'sūnys', ok:0, w:'-ys здесь не бывает: это окончание женского -is и слов вроде dantys.' } ] },
    { q: 'Одна <b>akis</b> — много …?', hint: 'Женское -is.', ans: ['akys'],
      rule: '-is (ж.) → -ys', opts: [
      { t:'akys', ok:1, w:'Женское -is даёт -ys: akis → akys.' },
      { t:'akis', ok:0, w:'Akis — vardininkas единственного или galininkas множественного, но не «много» в роли имени.' },
      { t:'akiai', ok:0, w:'-iai — мужское окончание, akis женское.' },
      { t:'akės', ok:0, w:'-ės бывает у основ на -ė (katė → katės).' } ] },
    { q: 'Один <b>obuolys</b> — много …?', hint: 'Мужское -ys.', ans: ['obuoliai'],
      rule: '-ys (м.) → -iai', opts: [
      { t:'obuoliai', ok:1, w:'Мужское -ys даёт -iai: obuolys → obuoliai. Так же arklys → arkliai.' },
      { t:'obuolys', ok:0, w:'Это форма единственного числа.' },
      { t:'obuolius', ok:0, w:'Obuolius — galininkas множественного («ем яблоки»).' },
      { t:'obuoliais', ok:0, w:'-ais — įnagininkas.' } ] },
    { q: 'Одна <b>mama</b> — много …?', hint: 'Женское -a.', ans: ['mamos'],
      rule: '-a → -os', opts: [
      { t:'mamos', ok:1, w:'Женское -a даёт -os: mama → mamos.' },
      { t:'mamas', ok:0, w:'Mamas — galininkas множественного («вижу мам»).' },
      { t:'mamės', ok:0, w:'-ės бывает у основ на -ė.' },
      { t:'mamai', ok:0, w:'Mamai — naudininkas («кому? маме»).' } ] },
    { q: 'Одна <b>katė</b> — много …?', hint: 'Женское -ė.', ans: ['katės'],
      rule: '-ė → -ės', opts: [
      { t:'katės', ok:1, w:'Женское -ė даёт -ės: katė → katės.' },
      { t:'kates', ok:0, w:'Kates — galininkas множественного («вижу кошек»). Разница ровно в одной точке над e.' },
      { t:'katos', ok:0, w:'-os бывает у основ на -a.' },
      { t:'katys', ok:0, w:'-ys бывает у женского -is (akis → akys).' } ] }
  ]
});

/* ---------- 3. Прилагательное в четырёх формах ---------- */
DRILLS.push({
  id: 'formos',
  title: 'Būdvardis: четыре формы',
  sub: 'Голое «окно» мозг не удержит. Удержит «чистое окно», «новое окно», «стеклянное окно». Поэтому прилагательное мы сразу расписываем в четырёх формах — jis, ji, jie, jos.',
  rule: '-as: naujas · nauja · nauji · naujos  |  -us: gražus · graži · gražūs · gražios  |  -is: medinis · medinė · mediniai · medinės',
  items: [
    { q: '<b>gražus</b> — форма <b>jos</b>?', hint: 'Группа -us.', ans: ['gražios'],
      rule: 'Группа -us: jis gražus · ji graži · jie gražūs · jos gražios', opts: [
      { t:'gražios', ok:1, w:'Женское множественное у группы -us — окончание -ios: gražios gėlės.' },
      { t:'gražūs', ok:0, w:'Gražūs — это jie, мужское множественное.' },
      { t:'graži', ok:0, w:'Graži — это ji, женское единственное.' },
      { t:'gražias', ok:0, w:'Gražias — уже galininkas множественного («вижу красивые»), а не имя.' } ] },
    { q: '<b>medinis</b> — форма <b>jie</b>?', hint: 'Группа -is.', ans: ['mediniai'],
      rule: 'Группа -is: jis medinis · ji medinė · jie mediniai · jos medinės', opts: [
      { t:'mediniai', ok:1, w:'Мужское множественное у группы -is — окончание -iai: mediniai stalai.' },
      { t:'medinės', ok:0, w:'Medinės — это jos, женское множественное.' },
      { t:'medini', ok:0, w:'Такой формы нет. Похожая medinį — это galininkas единственного.' },
      { t:'medinius', ok:0, w:'Medinius — galininkas множественного, а не имя.' } ] },
    { q: '<b>didelis</b> — форма <b>jie</b>?', hint: 'Внимание: слово ведёт себя не как medinis.', ans: ['dideli'],
      rule: 'didelis · didelė · dideli · didelės — единственное на -is прилагательное, у которого jie на -i, а не на -iai.', opts: [
      { t:'dideli', ok:1, w:'Верно: dideli namai. Didelis — исключение внутри группы -is: у него твёрдое -i, как у группы -as.' },
      { t:'dideliai', ok:0, w:'Так было бы по общему правилу группы -is (medinis → mediniai), но didelis идёт особняком: dideli.' },
      { t:'didelės', ok:0, w:'Didelės — это jos.' },
      { t:'didelius', ok:0, w:'Didelius — galininkas множественного.' } ] },
    { q: '<b>saldus</b> — форма <b>jos</b>?', hint: 'Группа -us, основа на -d-.', ans: ['saldžios'],
      rule: 'Перед окончанием -ios согласные d и t смягчаются: d → dž, t → č', opts: [
      { t:'saldžios', ok:1, w:'Saldus → saldžios. Перед -ios d переходит в dž. Так же kartus → karčios, platus → plačios.' },
      { t:'saldios', ok:0, w:'Окончание верное, но чередование d → dž пропущено: правильно saldžios.' },
      { t:'saldūs', ok:0, w:'Saldūs — это jie, мужское множественное.' },
      { t:'saldi', ok:0, w:'Saldi — это ji, женское единственное.' } ] },
    { q: '<b>naujas</b> — форма <b>jos</b>?', hint: 'Группа -as.', ans: ['naujos'],
      rule: 'Группа -as: jis naujas · ji nauja · jie nauji · jos naujos', opts: [
      { t:'naujos', ok:1, w:'Женское множественное у группы -as — окончание -os: naujos knygos.' },
      { t:'nauji', ok:0, w:'Nauji — это jie.' },
      { t:'naujas', ok:0, w:'Naujas — это jis (или galininkas множественного женского: matau naujas knygas).' },
      { t:'naujės', ok:0, w:'Такого окончания у группы -as нет: -ės бывает только в группе -is.' } ] },
    { q: '<b>tuščias</b> — форма <b>jie</b>?', hint: 'Мягкая разновидность группы -as.', ans: ['tušti'],
      rule: 'tuščias · tuščia · tušti · tuščios', opts: [
      { t:'tušti', ok:1, w:'Верно: tušti buteliai. Перед твёрдым -i мягкость снимается, поэтому č возвращается к t.' },
      { t:'tuščiai', ok:0, w:'Tuščiai — это наречие «впустую», а не форма jie.' },
      { t:'tuščios', ok:0, w:'Tuščios — это jos.' },
      { t:'tuščius', ok:0, w:'Tuščius — galininkas множественного.' } ] }
  ]
});

/* ---------- 4. Согласование в vardininkas ---------- */
DRILLS.push({
  id: 'derinys',
  title: 'Vardininkas: прилагательное + предмет',
  sub: 'Сначала определили jis / ji / jie / jos у предмета — теперь подбираем ту же форму прилагательного. Это и есть образ, который запомнит мозг.',
  rule: 'Форма прилагательного = форма предмета. Определили предмет — прилагательное подставляется само.',
  items: [
    { q: '… <b>langas</b> — <i>naujas</i>', hint: 'Langas — jis.', ans: ['naujas'],
      rule: 'langas → jis → naujas', opts: [
      { t:'naujas', ok:1, w:'Langas — имя мужское единственное (jis), значит naujas langas.' },
      { t:'nauja', ok:0, w:'Nauja — форма ji, а langas не женское.' },
      { t:'nauji', ok:0, w:'Nauji — форма jie, множественное. Langas один.' },
      { t:'naujos', ok:0, w:'Naujos — форма jos: женское множественное.' } ] },
    { q: '… <b>gėlė</b> — <i>gražus</i>', hint: 'Gėlė — ji.', ans: ['graži'],
      rule: 'gėlė → ji → graži', opts: [
      { t:'graži', ok:1, w:'Gėlė — имя женское единственное (ji), значит graži gėlė.' },
      { t:'gražus', ok:0, w:'Gražus — словарная форма jis, для мужского предмета.' },
      { t:'gražios', ok:0, w:'Gražios — jos, множественное.' },
      { t:'gražią', ok:0, w:'Gražią — уже galininkas: это ответ на «ką?», а мы пока только называем.' } ] },
    { q: '… <b>durys</b> — <i>medinis</i>', hint: 'Durys — jos.', ans: ['medinės'],
      rule: 'durys → jos → medinės', opts: [
      { t:'medinės', ok:1, w:'Durys — только множественное и женское (jos), значит medinės durys.' },
      { t:'medinis', ok:0, w:'Medinis — jis, мужское единственное.' },
      { t:'mediniai', ok:0, w:'Mediniai — jie, мужское множественное. Durys женское.' },
      { t:'medinė', ok:0, w:'Medinė — ji, единственное. У durys единственного нет.' } ] },
    { q: '… <b>sūnūs</b> — <i>geras</i>', hint: 'Sūnūs — jie.', ans: ['geri'],
      rule: 'sūnūs → jie → geri', opts: [
      { t:'geri', ok:1, w:'Sūnūs — мужское множественное (jie): geri sūnūs.' },
      { t:'geros', ok:0, w:'Geros — jos, женское множественное.' },
      { t:'geras', ok:0, w:'Geras — jis, единственное.' },
      { t:'gerus', ok:0, w:'Gerus — galininkas множественного («вижу хороших»).' } ] },
    { q: '… <b>moterys</b> — <i>linksmas</i>', hint: 'Moterys — jos.', ans: ['linksmos'],
      rule: 'moterys → jos → linksmos', opts: [
      { t:'linksmos', ok:1, w:'Moterys — женское множественное (jos): linksmos moterys.' },
      { t:'linksmi', ok:0, w:'Linksmi — jie, мужское множественное.' },
      { t:'linksma', ok:0, w:'Linksma — ji, единственное.' },
      { t:'linksmas', ok:0, w:'Linksmas — jis (либо galininkas множественного женского).' } ] },
    { q: '… <b>akiniai</b> — <i>naujas</i>', hint: 'Akiniai — jie.', ans: ['nauji'],
      rule: 'akiniai → jie → nauji', opts: [
      { t:'nauji', ok:1, w:'Akiniai — мужское, только множественное (jie): nauji akiniai.' },
      { t:'naujos', ok:0, w:'Naujos — jos. Akiniai не женское, хотя по-русски «очки» рода не подсказывают.' },
      { t:'naujas', ok:0, w:'Naujas — jis, единственное. У akiniai единственного нет.' },
      { t:'naujus', ok:0, w:'Naujus — galininkas множественного.' } ] }
  ]
});

/* ---------- 5. Galininkas, единственное число ---------- */
DRILLS.push({
  id: 'gal-vns',
  title: 'Galininkas: единственное число',
  sub: 'Предмет назван и описан. Теперь направляем на него действие: <b>ką?</b> — и все гласные окончания уходят в носовые.',
  rule: 'Четыре носовые: ą · ę · į · ų. Какая гласная в окончании — такая и носовая. Ударение на неё не падает.',
  items: [
    { q: 'Matau … <i>(naujas langas)</i>', hint: 'Действие matau требует ką?', ans: ['naują langą'],
      rule: 'a → ą: naujas langas → naują langą', opts: [
      { t:'naują langą', ok:1, w:'Оба слова на -as, обе гласные a уходят в носовую ą: matau naują langą.' },
      { t:'naujas langas', ok:0, w:'Это vardininkas — имя предмета. После matau нужен ответ на «ką?».' },
      { t:'naujus langus', ok:0, w:'Это galininkas, но множественного числа: «вижу новые окна».' },
      { t:'naujo lango', ok:0, w:'Это kilmininkas («ko?»). Он появится при отрицании: nematau naujo lango.' } ] },
    { q: 'Matau … <i>(graži mergaitė)</i>', hint: 'У graži внутри спрятана -ia-.', ans: ['gražią mergaitę'],
      rule: 'graži = gražia: a → ą. У -ė гласная e → ę', opts: [
      { t:'gražią mergaitę', ok:1, w:'Graži на самом деле gražia (скрытая a), поэтому носовая ą: gražią. У mergaitė гласная e уходит в ę.' },
      { t:'gražę mergaitę', ok:0, w:'Так было бы, если бы у graži в основе была e. Но там a: gražia → gražią.' },
      { t:'graži mergaitė', ok:0, w:'Vardininkas. Действие требует «ką?».' },
      { t:'gražias mergaites', ok:0, w:'Galininkas множественного: «вижу красивых девочек».' } ] },
    { q: 'Valau … <i>(švarus stalas)</i>', hint: 'Прилагательное на -us.', ans: ['švarų stalą'],
      rule: 'u → ų, a → ą', opts: [
      { t:'švarų stalą', ok:1, w:'У švarus гласная u → ų, у stalas гласная a → ą.' },
      { t:'švarią stalą', ok:0, w:'-ią — женское окончание. Stalas мужское, ему нужно švarų.' },
      { t:'švarus stalas', ok:0, w:'Vardininkas.' },
      { t:'švarius stalus', ok:0, w:'Galininkas множественного.' } ] },
    { q: 'Perku … <i>(medinė kėdė)</i>', hint: 'Оба слова на -ė.', ans: ['medinę kėdę'],
      rule: 'ė → ę', opts: [
      { t:'medinę kėdę', ok:1, w:'У основ на -ė гласная e уходит в носовую ę: medinę kėdę.' },
      { t:'mediną kėdą', ok:0, w:'Носовая ą берётся из гласной a. Здесь в окончании e, значит ę.' },
      { t:'medinė kėdė', ok:0, w:'Vardininkas.' },
      { t:'medines kėdes', ok:0, w:'Galininkas множественного.' } ] },
    { q: 'Matau … <i>(didelis brolis)</i>', hint: 'Оба слова на -is.', ans: ['didelį brolį'],
      rule: 'i → į', opts: [
      { t:'didelį brolį', ok:1, w:'У основ на -is гласная i уходит в носовую į: didelį brolį.' },
      { t:'didelį broli', ok:0, w:'Broli — šauksmininkas, форма обращения («брат!»). В galininkas нужна носовая: brolį.' },
      { t:'didelis brolis', ok:0, w:'Vardininkas.' },
      { t:'didelius brolius', ok:0, w:'Galininkas множественного.' } ] },
    { q: 'Geriu … <i>(saldi arbata)</i>', hint: 'У saldi та же скрытая -ia-, что и у graži.', ans: ['saldžią arbatą'],
      rule: 'saldi = saldia, при этом d → dž', opts: [
      { t:'saldžią arbatą', ok:1, w:'Saldi разворачивается в saldia, а d перед ia переходит в dž: saldžią. Ориентир — форма jos: saldžios.' },
      { t:'saldią arbatą', ok:0, w:'Окончание верное, но чередование d → dž пропущено.' },
      { t:'saldžę arbatę', ok:0, w:'Носовая ę берётся из e. Здесь в обоих словах a → ą.' },
      { t:'saldi arbata', ok:0, w:'Vardininkas.' } ] },
    { q: 'Turiu … <i>(geras sūnus)</i>', hint: 'Прилагательное на -as, предмет на -us.', ans: ['gerą sūnų'],
      rule: 'a → ą, u → ų — каждое слово меняет свою гласную', opts: [
      { t:'gerą sūnų', ok:1, w:'Прилагательное и предмет меняются каждый по своей гласной: gerA → gerĄ, sūnUs → sūnŲ.' },
      { t:'gerą sūnus', ok:0, w:'Предмет остался в vardininkas. Действие направлено на оба слова сразу.' },
      { t:'gerus sūnus', ok:0, w:'Galininkas множественного: «имею хороших сыновей».' },
      { t:'gero sūnaus', ok:0, w:'Kilmininkas: появится при отрицании — neturiu gero sūnaus.' } ] },
    { q: 'Matau … <i>(linksma moteris)</i>', hint: 'Moteris — женское на -is.', ans: ['linksmą moterį'],
      rule: 'a → ą, i → į', opts: [
      { t:'linksmą moterį', ok:1, w:'У прилагательного a → ą, у moteris i → į. Женский род на окончание galininkas не влияет.' },
      { t:'linksmą moterę', ok:0, w:'Носовая ę берётся из e, а у moteris в окончании i.' },
      { t:'linksmas moteris', ok:0, w:'Это galininkas множественного: «вижу весёлых женщин».' },
      { t:'linksma moteris', ok:0, w:'Vardininkas.' } ] },
    { q: 'Geriu … <i>(šaltas vanduo)</i>', hint: 'У vanduo меняется вся основа.', ans: ['šaltą vandenį'],
      rule: 'vanduo → vandenį: основа vanden- + носовая į', opts: [
      { t:'šaltą vandenį', ok:1, w:'Vanduo вне общего правила: основа становится vanden-, окончание — носовая į. Так же akmuo → akmenį, šuo → šunį.' },
      { t:'šaltą vanduo', ok:0, w:'Предмет остался в vardininkas.' },
      { t:'šaltą vandenę', ok:0, w:'Носовая ę здесь не берётся: у vandenis основа на -i.' },
      { t:'šaltus vandenis', ok:0, w:'Galininkas множественного.' } ] },
    { q: 'Skaitau … <i>(įdomi knyga)</i>', hint: 'Прилагательное группы -us в женской форме.', ans: ['įdomią knygą'],
      rule: 'įdomi = įdomia → įdomią', opts: [
      { t:'įdomią knygą', ok:1, w:'Įdomi — женская форма от įdomus, внутри неё -ia-, поэтому įdomią. У knyga a → ą.' },
      { t:'įdomę knygą', ok:0, w:'Носовая ę берётся из e, а здесь a.' },
      { t:'įdomų knygą', ok:0, w:'Įdomų — мужская форма. Knyga женское.' },
      { t:'įdomias knygas', ok:0, w:'Galininkas множественного.' } ] }
  ]
});

/* ---------- 6. Galininkas, множественное число ---------- */
DRILLS.push({
  id: 'gal-dgs',
  title: 'Galininkas: множественное число',
  sub: 'Здесь носовых уже нет — четыре обычных окончания. И только одно из них мужское.',
  rule: '-us (мужское) · -as · -es · -is (женские). Женские окончания вырастают из vardininkas: -a → -as, -ė → -es, -is → -is.',
  items: [
    { q: 'Matau … <i>(nauji langai)</i>', hint: 'Мужское множественное.', ans: ['naujus langus'],
      rule: 'мужское → -us', opts: [
      { t:'naujus langus', ok:1, w:'Единственное мужское окончание galininkas множественного — -us.' },
      { t:'naujas langas', ok:0, w:'Это vardininkas единственного числа.' },
      { t:'nauji langai', ok:0, w:'Vardininkas множественного — имя предметов, а не «кого? что?».' },
      { t:'naujų langų', ok:0, w:'Kilmininkas множественного: nematau naujų langų.' } ] },
    { q: 'Perku … <i>(gražios gėlės)</i>', hint: 'Женское на -ės.', ans: ['gražias gėles'],
      rule: 'жен. -ios → -ias, -ės → -es', opts: [
      { t:'gražias gėles', ok:1, w:'У прилагательного -ios → -ias, у предмета -ės → -es. Точка над e исчезает — это и есть разница между «цветы» и «цветов».' },
      { t:'gražias gėlės', ok:0, w:'Предмет остался в vardininkas: gėlės — это «цветы» как имя.' },
      { t:'gražius gėlius', ok:0, w:'-us и -ius — мужские окончания, а gėlė женское.' },
      { t:'gražių gėlių', ok:0, w:'Kilmininkas множественного.' } ] },
    { q: 'Statau … <i>(medinės kėdės)</i>', hint: 'Оба слова женские на -ės.', ans: ['medines kėdes'],
      rule: '-ės → -es', opts: [
      { t:'medines kėdes', ok:1, w:'У женских основ на -ė окончание galininkas множественного — -es: medines kėdes.' },
      { t:'medinės kėdės', ok:0, w:'Vardininkas множественного.' },
      { t:'medinias kėdias', ok:0, w:'-ias бывает у женских основ на -ia (gražias), а не на -ė.' },
      { t:'medinius kėdžius', ok:0, w:'Мужские окончания, а слова женские.' } ] },
    { q: 'Matau … <i>(dideli broliai)</i>', hint: 'Мужское множественное.', ans: ['didelius brolius'],
      rule: 'мужское → -us, у мягкой основы -ius', opts: [
      { t:'didelius brolius', ok:1, w:'Основа мягкая, поэтому -ius. Это то же самое -us, только с сохранённой мягкостью.' },
      { t:'didelus brolus', ok:0, w:'Мягкость основы потеряна: у brolis и didelis перед -us остаётся i.' },
      { t:'dideli broliai', ok:0, w:'Vardininkas множественного.' },
      { t:'didelių brolių', ok:0, w:'Kilmininkas множественного.' } ] },
    { q: 'Turiu … <i>(gražūs sūnūs)</i>', hint: 'Здесь прилагательное и предмет расходятся.', ans: ['gražius sūnus'],
      rule: 'Прилагательные на -us во множественном смягчаются (gražius), предметы на -us — нет (sūnus).', opts: [
      { t:'gražius sūnus', ok:1, w:'Главная пара всей темы. Прилагательное gražus даёт gražius, а предмет sūnus остаётся sūnus — только с коротким u вместо долгого ū.' },
      { t:'gražus sūnus', ok:0, w:'Прилагательное осталось в словарной форме. Ему нужно смягчение: gražius.' },
      { t:'gražius sūnius', ok:0, w:'Предмет смягчился зря: у sūnus основа твёрдая, galininkas множественного — sūnus.' },
      { t:'gražūs sūnūs', ok:0, w:'Vardininkas множественного: долгие ū — признак имени, короткие u — признак galininkas.' } ] },
    { q: 'Kviečiu … <i>(linksmos moterys)</i>', hint: 'Женское на -is.', ans: ['linksmas moteris'],
      rule: 'жен. -os → -as, -ys → -is', opts: [
      { t:'linksmas moteris', ok:1, w:'У прилагательного -os → -as, у moterys → moteris. Форма совпала с vardininkas единственного — различает их только контекст действия.' },
      { t:'linksmas moterys', ok:0, w:'Предмет остался в vardininkas множественного.' },
      { t:'linksmus moterius', ok:0, w:'Мужские окончания, а слова женские.' },
      { t:'linksmų moterų', ok:0, w:'Kilmininkas множественного (и у moteris он moterų).' } ] },
    { q: 'Atidarau … <i>(medinės durys)</i>', hint: 'Только множественное, женское.', ans: ['medines duris'],
      rule: 'durys → duris', opts: [
      { t:'medines duris', ok:1, w:'Durys склоняется как женское на -is: galininkas множественного — duris.' },
      { t:'medines durys', ok:0, w:'Durys — vardininkas. Действие требует duris.' },
      { t:'medinę durį', ok:0, w:'Единственного числа у durys нет.' },
      { t:'medinių durų', ok:0, w:'Kilmininkas: neatidarau medinių durų.' } ] },
    { q: 'Valgau … <i>(saldūs obuoliai)</i>', hint: 'Прилагательное на -us + мягкая основа.', ans: ['saldžius obuolius'],
      rule: 'saldus → saldžius (d → dž), obuolys → obuolius', opts: [
      { t:'saldžius obuolius', ok:1, w:'Прилагательное смягчается и даёт dž: saldžius. Ориентир — форма jos: saldžios → saldžius.' },
      { t:'saldius obuolius', ok:0, w:'Окончание верное, чередование d → dž пропущено.' },
      { t:'saldus obuolius', ok:0, w:'Прилагательное осталось в словарной форме.' },
      { t:'saldūs obuoliai', ok:0, w:'Vardininkas множественного.' } ] },
    { q: 'Nešioju … <i>(nauji akiniai)</i>', hint: 'Только множественное, мужское.', ans: ['naujus akinius'],
      rule: 'мужское → -us / -ius', opts: [
      { t:'naujus akinius', ok:1, w:'Akiniai — мужское, мягкая основа: akinius. Прилагательное naujas — твёрдая: naujus.' },
      { t:'naujus akinius, akiniai', ok:0, w:'Такой формы нет — здесь просто склеены два варианта.' },
      { t:'naujas akinias', ok:0, w:'-as и -ias — женские окончания.' },
      { t:'nauji akiniai', ok:0, w:'Vardininkas множественного.' } ] },
    { q: 'Matau … <i>(juodos katės)</i>', hint: 'Оба слова женские.', ans: ['juodas kates'],
      rule: 'жен. -os → -as, -ės → -es', opts: [
      { t:'juodas kates', ok:1, w:'Juodos → juodas, katės → kates. Обе точки над e исчезают.' },
      { t:'juodas katės', ok:0, w:'Предмет остался в vardininkas.' },
      { t:'juodus katus', ok:0, w:'Мужские окончания.' },
      { t:'juodų kačių', ok:0, w:'Kilmininkas множественного.' } ] }
  ]
});

/* ---------- 7. Скрытая -ia- ---------- */
DRILLS.push({
  id: 'ia',
  title: 'Скрытая -ia-: почему graži → gražią',
  sub: 'Единственное место, где правило «гласная → носовая» смотрит не на то, что видно, а на то, что спрятано.',
  rule: 'Женские формы прилагательных на -us (graži, saldi, plati) — это сокращённое -ia. Разворачиваем -ia и уже её отправляем в носовую: gražia → gražią.',
  items: [
    { q: '<b>graži mergaitė</b> → ką? …', hint: 'graži = gražia', ans: ['gražią mergaitę'],
      rule: 'gražia → gražią', opts: [
      { t:'gražią mergaitę', ok:1, w:'Разворачиваем graži в gražia, гласную a отправляем в носовую: gražią.' },
      { t:'gražę mergaitę', ok:0, w:'Ошибка от того, что смотрим на видимую i. За ней прячется a, а не e.' },
      { t:'gražį mergaitę', ok:0, w:'Носовая į была бы, будь основа на -i, как у brolis. Здесь основа на -ia.' },
      { t:'gražu mergaitę', ok:0, w:'Такой формы нет.' } ] },
    { q: '<b>saldi arbata</b> → ką? …', hint: 'saldi = saldia, d → dž', ans: ['saldžią arbatą'],
      rule: 'saldia → saldžią', opts: [
      { t:'saldžią arbatą', ok:1, w:'Разворачиваем saldi в saldia; d перед ia переходит в dž.' },
      { t:'saldią arbatą', ok:0, w:'Гласная найдена верно, но чередование пропущено. Подсказка всегда в форме jos: saldžios.' },
      { t:'saldę arbatą', ok:0, w:'Носовая ę взялась бы из e, а не из скрытой a.' },
      { t:'saldi arbatą', ok:0, w:'Прилагательное осталось в vardininkas.' } ] },
    { q: '<b>karti kava</b> → ką? …', hint: 'karti = kartia, t → č', ans: ['karčią kavą'],
      rule: 'kartia → karčią', opts: [
      { t:'karčią kavą', ok:1, w:'t перед ia переходит в č. Ориентир — форма jos: karčios.' },
      { t:'kartią kavą', ok:0, w:'Чередование t → č пропущено.' },
      { t:'kartę kavą', ok:0, w:'Носовая ę здесь не берётся.' },
      { t:'karti kavą', ok:0, w:'Прилагательное осталось в vardininkas.' } ] },
    { q: '<b>plati gatvė</b> → ką? …', hint: 'plati = platia, t → č', ans: ['plačią gatvę'],
      rule: 'platia → plačią', opts: [
      { t:'plačią gatvę', ok:1, w:'plati → platia → plačią. У gatvė гласная e уходит в ę.' },
      { t:'platią gatvę', ok:0, w:'Чередование t → č пропущено: сверьтесь с формой jos — plačios.' },
      { t:'plačią gatvą', ok:0, w:'У основы на -ė носовая ę, а не ą.' },
      { t:'plačias gatves', ok:0, w:'Множественное число.' } ] },
    { q: '<b>rami naktis</b> → ką? …', hint: 'rami = ramia; naktis — женское на -is', ans: ['ramią naktį'],
      rule: 'ramia → ramią; naktis → naktį', opts: [
      { t:'ramią naktį', ok:1, w:'У прилагательного скрытая a → ą, у naktis обычная i → į. Два разных пути в одном словосочетании.' },
      { t:'ramią naktę', ok:0, w:'У naktis в окончании i, значит носовая į.' },
      { t:'ramę naktį', ok:0, w:'У rami скрыта a, а не e.' },
      { t:'ramias naktis', ok:0, w:'Множественное число.' } ] }
  ]
});

/* ---------- 8. Кто требует galininkas ---------- */
DRILLS.push({
  id: 'valdymas',
  title: 'Кто зовёт Galininkas, а кто нет',
  sub: 'Galininkas приходит только по зову переходного глагола. Некоторые очень частые глаголы зовут других друзей — и это ошибка номер один у русскоязычных.',
  rule: 'matau, perku, valgau, skaitau → ką? · noriu, laukiu, bijau, klausausi → ko? · padedu, skambinu → kam?',
  items: [
    { q: 'Noriu … <i>(kava)</i>', hint: 'Norėti зовёт не galininkas.', ans: ['kavos'],
      rule: 'norėti + kilmininkas (ko?)', opts: [
      { t:'kavos', ok:1, w:'Norėti требует kilmininkas: noriu kavos. По-русски «хочу кофе» — родительный, так же и здесь.' },
      { t:'kavą', ok:0, w:'Это galininkas. После norėti он не ставится, хотя рука тянется.' },
      { t:'kavai', ok:0, w:'Naudininkas («кому? кофе»).' },
      { t:'kava', ok:0, w:'Vardininkas или įnagininkas — но не то, что зовёт norėti.' } ] },
    { q: 'Matau … <i>(kava)</i>', hint: 'А вот matyti зовёт galininkas.', ans: ['kavą'],
      rule: 'matyti + galininkas (ką?)', opts: [
      { t:'kavą', ok:1, w:'Matyti переходный: matau ką? — kavą. Гласная a уходит в носовую ą.' },
      { t:'kavos', ok:0, w:'Kilmininkas. Он появится только при отрицании: nematau kavos.' },
      { t:'kava', ok:0, w:'Vardininkas — имя предмета, действие на него ещё не направлено.' },
      { t:'kavai', ok:0, w:'Naudininkas.' } ] },
    { q: 'Laukiu … <i>(draugas)</i>', hint: 'Laukti зовёт kilmininkas.', ans: ['draugo'],
      rule: 'laukti + kilmininkas (ko?)', opts: [
      { t:'draugo', ok:1, w:'Laukti требует kilmininkas: laukiu draugo. По-русски «жду друга» — тоже родительный.' },
      { t:'draugą', ok:0, w:'Galininkas после laukti не ставится.' },
      { t:'draugui', ok:0, w:'Naudininkas («кому? другу»).' },
      { t:'draugas', ok:0, w:'Vardininkas.' } ] },
    { q: 'Padedu … <i>(mama)</i>', hint: 'Padėti зовёт naudininkas.', ans: ['mamai'],
      rule: 'padėti + naudininkas (kam?)', opts: [
      { t:'mamai', ok:1, w:'Padėti требует naudininkas: padedu mamai. По-русски «помогаю маме» — дательный, совпадает.' },
      { t:'mamą', ok:0, w:'Galininkas. «Помогаю кого?» не говорят ни по-русски, ни по-литовски.' },
      { t:'mamos', ok:0, w:'Kilmininkas.' },
      { t:'mama', ok:0, w:'Vardininkas.' } ] },
    { q: 'Klausausi … <i>(daina)</i>', hint: 'Klausytis зовёт kilmininkas.', ans: ['dainos'],
      rule: 'klausytis + kilmininkas (ko?)', opts: [
      { t:'dainos', ok:1, w:'Klausytis требует kilmininkas: klausausi dainos. Здесь русский и литовский расходятся — по-русски «слушаю песню».' },
      { t:'dainą', ok:0, w:'Самая частая ошибка: русский винительный тянет за собой литовский galininkas, но klausytis его не зовёт.' },
      { t:'dainai', ok:0, w:'Naudininkas.' },
      { t:'daina', ok:0, w:'Vardininkas или įnagininkas.' } ] },
    { q: 'Nematau … <i>(naujas langas)</i>', hint: 'Отрицание меняет падеж.', ans: ['naujo lango'],
      rule: 'Отрицание переходного глагола: galininkas → kilmininkas', opts: [
      { t:'naujo lango', ok:1, w:'При отрицании galininkas уступает место kilmininkas: matau naują langą, но nematau naujo lango.' },
      { t:'naują langą', ok:0, w:'В утверждении это верно, а после ne- литовский требует kilmininkas.' },
      { t:'naujas langas', ok:0, w:'Vardininkas.' },
      { t:'naujų langų', ok:0, w:'Kilmininkas, но множественного числа.' } ] }
  ]
});

/* ---------- 9. Словообразование ---------- */
DRILLS.push({
  id: 'daryba',
  title: 'Словообразование: из прилагательного растут слова',
  sub: 'Одно прилагательное даёт минимум три новых слова. Так словарь растёт не сложением, а умножением.',
  rule: 'основа + -umas → имя качества · основа + -ėti → «становиться каким-то» · основа + -inti → «делать каким-то» (и это переходный глагол, он зовёт galininkas)',
  items: [
    { q: '<b>gražus</b> → имя качества, «красота»?', hint: 'Суффикс -umas.', ans: ['gražumas'],
      rule: 'gražus → gražumas', opts: [
      { t:'gražumas', ok:1, w:'Основа graž- + -umas. Получается имя мужское на -as, и оно само склоняется: matau gražumą.' },
      { t:'gražėjimas', ok:0, w:'Это имя от глагола gražėti — «процесс становления красивее», не само качество.' },
      { t:'gražinimas', ok:0, w:'Это имя от глагола gražinti — «украшение как действие».' },
      { t:'gražus', ok:0, w:'Само прилагательное, а нужен предмет-качество.' } ] },
    { q: '<b>ramus</b> → «успокаивать кого-то»?', hint: 'Суффикс -inti: действие на другого.', ans: ['raminti'],
      rule: 'ramus → raminti (переходный) / ramėti (непереходный)', opts: [
      { t:'raminti', ok:1, w:'Основа ram- + -inti. Такие глаголы всегда переходные: raminu ką? — vaiką.' },
      { t:'ramėti', ok:0, w:'Ramėti — «самому становиться спокойнее». Действие не выходит наружу, galininkas ему не нужен.' },
      { t:'ramumas', ok:0, w:'Это имя качества, «спокойствие», а не глагол.' },
      { t:'ramiai', ok:0, w:'Наречие «спокойно».' } ] },
    { q: '<b>geras</b> → «улучшаться, становиться лучше»?', hint: 'Суффикс -ėti.', ans: ['gerėti'],
      rule: 'geras → gerėti (сам) / gerinti (кого-то)', opts: [
      { t:'gerėti', ok:1, w:'Основа ger- + -ėti: oras gerėja — погода улучшается. Формы: gerėja, gerėjo.' },
      { t:'gerinti', ok:0, w:'Gerinti — «улучшать что-то»: gerinu ką? — rezultatą. Это переходный близнец.' },
      { t:'gerumas', ok:0, w:'Имя качества, «доброта».' },
      { t:'gerai', ok:0, w:'Наречие «хорошо».' } ] },
    { q: '<b>didelis</b> → «увеличивать»?', hint: 'Основа короче, чем кажется.', ans: ['didinti'],
      rule: 'didelis → основа did- → didinti / didėti / didumas', opts: [
      { t:'didinti', ok:1, w:'Основа не didel-, а did-: didinti, didėti, didumas. Суффикс -el- в словообразование не идёт.' },
      { t:'didelinti', ok:0, w:'Такого слова нет: основа берётся без -el-.' },
      { t:'didėti', ok:0, w:'Didėti — «увеличиваться самому»: miestas didėja.' },
      { t:'didumas', ok:0, w:'Имя качества, «величина».' } ] },
    { q: '<b>šiltas</b> → «греть что-то»?', hint: 'Здесь общий шаблон даёт сбой.', ans: ['šildyti'],
      rule: 'šiltas → šildyti (не «šiltinti»)', opts: [
      { t:'šildyti', ok:1, w:'Исключение из шаблона: вместо -inti здесь -yti и чередование t → d. Šildau ką? — pieną.' },
      { t:'šiltinti', ok:0, w:'По шаблону ожидалось бы именно это, но в языке закрепилось šildyti. Šiltinti живёт только в узком строительном смысле «утеплять».' },
      { t:'šiltėti', ok:0, w:'Šiltėti — «теплеть само»: oras šiltėja.' },
      { t:'šiltumas', ok:0, w:'Имя качества, «теплота».' } ] },
    { q: 'Куда пойдёт galininkas: <b>gerėti</b> или <b>gerinti</b>?', hint: 'Действие наружу или внутрь?', ans: ['gerinti'],
      rule: 'Глаголы на -inti переходные, глаголы на -ėti — нет.', opts: [
      { t:'gerinti', ok:1, w:'Gerinti направлено наружу, на предмет: gerinu ką? — rezultatą, sveikatą. Значит зовёт galininkas.' },
      { t:'gerėti', ok:0, w:'Gerėti происходит с самим подлежащим: oras gerėja. Направлять его не на что.' },
      { t:'оба', ok:0, w:'Нет: это и есть смысл пары. Один глагол переходный, второй нет.' },
      { t:'ни один', ok:0, w:'Один из них всё-таки переходный — тот, что на -inti.' } ] }
  ]
});

/* ---------- 10. Перевод предложения целиком ---------- */
DRILLS.push({
  id: 'sakiniai',
  title: 'Соберите предложение сами',
  sub: 'Здесь вариантов не предлагаем: пишите перевод сами. Проверка снимает знаки ударения и лишние пробелы, различает «почти верно» и «мимо», а после ответа разбирает предложение по словам и показывает, на чём тут обычно спотыкаются.',
  rule: 'Порядок работы: назвали предмет (vardininkas) → описали → определили jis/ji/jie/jos → выбрали действие → отправили предмет в galininkas.',
  mode: 'text',
  items: [
    { q: 'Я вижу новое окно.', ans: ['Matau naują langą', 'Aš matau naują langą'],
      hint: 'matyti → matau · langas — jis',
      rule: 'naujas langas → naują langą',
      bd: [ {w:'Matau', e:'«вижу» — 1 л. ед. ч. от matyti. Личное местоимение aš можно опустить: окончание уже показывает лицо.'},
            {w:'naują', e:'naujas → naują: гласная a уходит в носовую ą.'},
            {w:'langą', e:'langas → langą: та же a → ą.'} ],
      alt: 'Принимается и «Aš matau naują langą».',
      opts: [ {t:'Matau naujas langas', ok:0, w:'Оба слова остались в vardininkas. После matau нужен ответ на «ką?».'},
              {t:'Matau naujus langus', ok:0, w:'Это множественное: «вижу новые окна».'},
              {t:'Matau naujo lango', ok:0, w:'Kilmininkas. Он нужен только при отрицании: nematau naujo lango.'} ] },
    { q: 'Мама покупает красивые цветы.', ans: ['Mama perka gražias gėles'],
      hint: 'pirkti → perka · gėlės — jos',
      rule: 'gražios gėlės → gražias gėles',
      bd: [ {w:'Mama', e:'подлежащее остаётся в vardininkas — оно называет, а не принимает действие.'},
            {w:'perka', e:'3 л. от pirkti. Основа настоящего времени perk-.'},
            {w:'gražias', e:'gražios → gražias: женское -ios во множественном galininkas даёт -ias.'},
            {w:'gėles', e:'gėlės → gėles: точка над e исчезает.'} ],
      opts: [ {t:'Mamą perka gražias gėles', ok:0, w:'Подлежащее отправлено в galininkas. Действие направляют не на того, кто действует.'},
              {t:'Mama perka gražios gėlės', ok:0, w:'Словосочетание осталось в vardininkas.'},
              {t:'Mama perka gražią gėlę', ok:0, w:'Верная форма, но единственного числа: «покупает красивый цветок».'} ] },
    { q: 'Он пьёт горячий чай.', ans: ['Jis geria karštą arbatą'],
      hint: 'gerti → geria · arbata — ji',
      rule: 'karšta arbata → karštą arbatą',
      bd: [ {w:'Jis', e:'подлежащее в vardininkas.'},
            {w:'geria', e:'3 л. от gerti.'},
            {w:'karštą', e:'прилагательное согласовано с arbata (ji), гласная a → ą.'},
            {w:'arbatą', e:'arbata → arbatą.'} ],
      opts: [ {t:'Jis geria karštas arbatas', ok:0, w:'Это множественное число в galininkas: «пьёт горячие чаи».'},
              {t:'Jis geria karšta arbata', ok:0, w:'Vardininkas: предмет назван, но действие на него не направлено.'},
              {t:'Jis geria karštos arbatos', ok:0, w:'Kilmininkas. Он уместен при отрицании или в значении «немного чаю».'} ] },
    { q: 'Дети едят сладкие яблоки.', ans: ['Vaikai valgo saldžius obuolius'],
      hint: 'valgyti → valgo · obuoliai — jie',
      rule: 'saldūs obuoliai → saldžius obuolius',
      bd: [ {w:'Vaikai', e:'подлежащее во множественном vardininkas.'},
            {w:'valgo', e:'3 л. от valgyti — форма одна и для единственного, и для множественного.'},
            {w:'saldžius', e:'saldūs → saldžius: прилагательные на -us во множественном galininkas смягчаются, d переходит в dž.'},
            {w:'obuolius', e:'obuoliai → obuolius: мужское окончание -us на мягкой основе.'} ],
      opts: [ {t:'Vaikai valgo saldus obuolius', ok:0, w:'Прилагательное осталось в словарной форме.'},
              {t:'Vaikai valgo saldžius obuoliai', ok:0, w:'Предмет остался в vardininkas.'},
              {t:'Vaikai valgo saldų obuolį', ok:0, w:'Верно, но в единственном числе.'} ] },
    { q: 'Она читает интересную книгу.', ans: ['Ji skaito įdomią knygą'],
      hint: 'skaityti → skaito · knyga — ji',
      rule: 'įdomi knyga → įdomią knygą',
      bd: [ {w:'Ji', e:'подлежащее в vardininkas.'},
            {w:'skaito', e:'3 л. от skaityti.'},
            {w:'įdomią', e:'įdomi разворачивается в įdomia, и уже эта a уходит в ą.'},
            {w:'knygą', e:'knyga → knygą.'} ],
      opts: [ {t:'Ji skaito įdomę knygą', ok:0, w:'Носовая ę берётся из e. У įdomi спрятана a.'},
              {t:'Ji skaito įdomų knygą', ok:0, w:'Įdomų — мужская форма, а knyga женское.'},
              {t:'Ji skaito įdomias knygas', ok:0, w:'Множественное число.'} ] },
    { q: 'Мы открываем деревянные двери.', ans: ['Atidarome medines duris', 'Mes atidarome medines duris'],
      hint: 'atidaryti → atidarome · durys — jos, только множественное',
      rule: 'medinės durys → medines duris',
      bd: [ {w:'Atidarome', e:'1 л. мн. ч. от atidaryti. Mes можно опустить.'},
            {w:'medines', e:'medinės → medines.'},
            {w:'duris', e:'durys → duris: женское -ys даёт -is.'} ],
      alt: 'Принимается и «Mes atidarome medines duris».',
      opts: [ {t:'Atidarome medines durys', ok:0, w:'Предмет остался в vardininkas.'},
              {t:'Atidarome medinę durį', ok:0, w:'Единственного числа у durys не существует.'},
              {t:'Atidarome medinių durų', ok:0, w:'Kilmininkas — нужен при отрицании: neatidarome medinių durų.'} ] },
    { q: 'Учитель приглашает весёлых гостей.', ans: ['Mokytojas kviečia linksmus svečius'],
      hint: 'kviesti → kviečia · svečiai — jie',
      rule: 'linksmi svečiai → linksmus svečius',
      bd: [ {w:'Mokytojas', e:'подлежащее в vardininkas.'},
            {w:'kviečia', e:'3 л. от kviesti, основа настоящего времени kvieči-.'},
            {w:'linksmus', e:'linksmi → linksmus: твёрдая основа, поэтому просто -us.'},
            {w:'svečius', e:'svečiai → svečius: мягкая основа, поэтому -ius.'} ],
      opts: [ {t:'Mokytojas kviečia linksmius svečius', ok:0, w:'Прилагательное linksmas твёрдое, ему -us без i.'},
              {t:'Mokytojas kviečia linksmus svečiai', ok:0, w:'Предмет остался в vardininkas.'},
              {t:'Mokytojas kviečia linksmą svečią', ok:0, w:'Верно, но в единственном числе.'} ] },
    { q: 'Я держу маленькую кошку.', ans: ['Laikau mažą katę', 'Aš laikau mažą katę'],
      hint: 'laikyti → laikau · katė — ji',
      rule: 'maža katė → mažą katę',
      bd: [ {w:'Laikau', e:'1 л. ед. ч. от laikyti.'},
            {w:'mažą', e:'maža → mažą: a → ą.'},
            {w:'katę', e:'katė → katę: e → ę. Два разных слова в одном словосочетании берут разные носовые.'} ],
      opts: [ {t:'Laikau mažą katą', ok:0, w:'У основы на -ė носовая ę, а не ą.'},
              {t:'Laikau mažas kates', ok:0, w:'Множественное число.'},
              {t:'Laikau maža katė', ok:0, w:'Vardininkas.'} ] },
    { q: 'Ты видишь высокие деревья?', ans: ['Ar matai aukštus medžius', 'Ar tu matai aukštus medžius', 'Matai aukštus medžius'],
      hint: 'Вопрос вводится словом ar · medžiai — jie',
      rule: 'aukšti medžiai → aukštus medžius',
      bd: [ {w:'Ar', e:'вопросительная частица: превращает утверждение в вопрос, порядок слов не меняя.'},
            {w:'matai', e:'2 л. ед. ч. от matyti.'},
            {w:'aukštus', e:'aukšti → aukštus.'},
            {w:'medžius', e:'medžiai → medžius: чередование d → dž сохраняется во всех формах множественного.'} ],
      alt: 'Принимается и без ar, и с местоимением tu.',
      opts: [ {t:'Ar matai aukštus medius', ok:0, w:'Чередование d → dž пропущено.'},
              {t:'Ar matai aukšti medžiai', ok:0, w:'Vardininkas.'},
              {t:'Ar matai aukštą medį', ok:0, w:'Верно, но в единственном числе.'} ] },
    { q: 'Я не вижу нового окна.', ans: ['Nematau naujo lango', 'Aš nematau naujo lango'],
      hint: 'Отрицание отменяет galininkas.',
      rule: 'matau naują langą → nematau naujo lango',
      bd: [ {w:'Nematau', e:'приставка ne- пишется слитно с глаголом.'},
            {w:'naujo', e:'galininkas уступает место kilmininkas: naują → naujo.'},
            {w:'lango', e:'langą → lango.'} ],
      opts: [ {t:'Nematau naują langą', ok:0, w:'Самая частая ошибка: русский винительный после «не вижу» сохраняется, литовский — нет.'},
              {t:'Ne matau naujo lango', ok:0, w:'Ne- пишется слитно: nematau.'},
              {t:'Nematau naujas langas', ok:0, w:'Vardininkas.'} ] },
    { q: 'Мама греет тёплое молоко.', ans: ['Mama šildo šiltą pieną'],
      hint: 'šildyti → šildo · pienas — jis',
      rule: 'šiltas pienas → šiltą pieną',
      bd: [ {w:'Mama', e:'подлежащее в vardininkas.'},
            {w:'šildo', e:'3 л. от šildyti — переходного глагола, выросшего из прилагательного šiltas.'},
            {w:'šiltą', e:'šiltas → šiltą.'},
            {w:'pieną', e:'pienas → pieną. Множественного у pienas нет.'} ],
      opts: [ {t:'Mama šiltina šiltą pieną', ok:0, w:'Šiltinti в этом значении не употребляется — «греть» это šildyti.'},
              {t:'Mama šildo šiltas pienas', ok:0, w:'Vardininkas.'},
              {t:'Mama šildosi šiltą pieną', ok:0, w:'Частица -si разворачивает действие на себя: «греется». Здесь действие направлено на молоко.'} ] },
    { q: 'Я хочу горячего чая, но не вижу чашки.', ans: ['Noriu karštos arbatos, bet nematau puodelio', 'Noriu karštos arbatos bet nematau puodelio'],
      hint: 'norėti → ko? · nematyti → ko? Оба раза galininkas не приходит.',
      rule: 'Проверка на внимательность: здесь galininkas не нужен ни разу.',
      bd: [ {w:'Noriu', e:'norėti требует kilmininkas.'},
            {w:'karštos arbatos', e:'kilmininkas единственного: karšta arbata → karštos arbatos.'},
            {w:'bet', e:'«но» — союз, падежей не требует.'},
            {w:'nematau', e:'отрицание переходного глагола тоже требует kilmininkas.'},
            {w:'puodelio', e:'puodelis → puodelio.'} ],
      alt: 'Запятая перед bet ставится, но проверка её не требует.',
      opts: [ {t:'Noriu karštą arbatą, bet nematau puodelį', ok:0, w:'Galininkas поставлен оба раза, а его здесь не зовёт ни один из глаголов.'},
              {t:'Noriu karštos arbatos, bet nematau puodelį', ok:0, w:'Первая половина верна, вторую испортило отрицание: после ne- нужен kilmininkas.'},
              {t:'Noriu karšta arbata, bet nematau puodelis', ok:0, w:'Vardininkas в обоих местах.'} ] }
  ]
});

/* ============================================================
   6. ИНТЕРВАЛЬНЫЕ ПОВТОРЕНИЯ
   Пять коробок Лейтнера. Ответили верно — задание уезжает дальше
   по кривой забывания; ошиблись — возвращается на сегодня.
   ============================================================ */
var BOXES = [0, 1, 3, 7, 16, 35];              /* дни до следующего показа */
var BOX_LBL = ['сегодня', 'завтра', 'через 3 дня', 'через неделю', 'через 2,5 недели', 'через месяц'];
var STORE = 'lk-cases-v1';
var DAY = 864e5;

function load(){
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
}
function save(db){
  try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) {}
}
function record(key, ok){
  var db = load(), cur = db[key] || { b: 0 };
  cur.b = ok ? Math.min(cur.b + 1, BOXES.length - 1) : 0;
  cur.due = Date.now() + BOXES[cur.b] * DAY;
  cur.seen = Date.now();
  db[key] = cur;
  save(db);
  return cur;
}
function dueItems(){
  var db = load(), now = Date.now(), out = [];
  DRILLS.forEach(function(bl){
    bl.items.forEach(function(it, i){
      var st = db[bl.id + ':' + i];
      if (st && st.due <= now && st.b > 0) out.push({ bl: bl, it: it, i: i });
    });
  });
  return out;
}

/* ============================================================
   7. ОТРИСОВКА ЗАДАНИЯ
   ============================================================ */

function verdictBox(){ return el('div', 'tq-verdict'); }

function buildWhy(item){
  var box = el('div', 'tq-why');
  box.appendChild(el('b', null, 'Разбор всех вариантов'));

  if (item.opts && item.opts.length) {
    var ul = el('ul', 'wl');
    item.opts.forEach(function(o){
      var li = el('li');
      var mk = el('span', 'mk ' + (o.ok ? 'y' : 'n'), o.ok ? 'верно' : 'мимо');
      var body = el('div');
      body.appendChild(el('span', 'wt', o.t));
      body.appendChild(el('span', 'wd', o.w));
      li.appendChild(mk);
      li.appendChild(body);
      ul.appendChild(li);
    });
    box.appendChild(ul);
  }

  if (item.bd) {
    var h = el('b', null, 'Предложение по словам');
    h.style.marginTop = '12px';
    box.appendChild(h);
    var bd = el('ul', 'bd');
    item.bd.forEach(function(p){
      var li = el('li');
      li.appendChild(el('b', null, p.w));
      li.appendChild(el('span', null, p.e));
      bd.appendChild(li);
    });
    box.appendChild(bd);
  }

  if (item.alt) box.appendChild(el('p', 'alt', item.alt));
  if (item.rule) {
    var r = el('p', 'alt');
    r.appendChild(el('b', null, 'Правило: '));
    r.appendChild(document.createTextNode(item.rule));
    box.appendChild(r);
  }
  return box;
}

/* Возвращает узел задания; onDone(ok) вызывается один раз. */
function renderItem(block, item, idx, total, mode, onDone){
  var wrap = el('div', 'tq');
  wrap.appendChild(el('span', 'tq-n', 'Задание ' + (idx + 1) + ' из ' + total));

  var q = el('p', 'tq-q');
  q.innerHTML = item.q;
  wrap.appendChild(q);

  if (item.hint) {
    var h = el('p', 'tq-hint');
    h.appendChild(el('b', null, 'Подсказка: '));
    h.appendChild(document.createTextNode(item.hint));
    wrap.appendChild(h);
  }

  var verdict = verdictBox();
  var why = buildWhy(item);
  var closed = false;

  function finish(state, msg, extra){
    if (closed) return;
    closed = true;
    verdict.className = 'tq-verdict show v-' + (state === 'ok' ? 'ok' : state === 'near' ? 'near' : 'no');
    verdict.textContent = msg;
    if (extra) verdict.appendChild(el('span', null, extra));
    why.classList.add('show');
    var st = record(block.key ? block.key(idx) : block.id + ':' + idx, state === 'ok');
    var next = el('span', null, 'Следующий показ этого задания — ' + BOX_LBL[st.b] + '.');
    verdict.appendChild(next);
    onDone(state === 'ok');
  }

  var right = item.opts ? (item.opts.filter(function(o){ return o.ok; })[0] || {}).t : null;
  if (!right) right = item.ans[0];

  if (mode === 'choice' && item.opts && item.opts.length > 1) {
    var opts = el('div', 'tq-opts');
    item.opts.forEach(function(o){
      var b = el('button', 'tq-opt', o.t);
      b.type = 'button';
      b.addEventListener('click', function(){
        if (closed) return;
        Array.prototype.forEach.call(opts.children, function(c, k){
          c.disabled = true;
          if (item.opts[k].ok) c.classList.add('ok');
        });
        if (!o.ok) b.classList.add('no');
        finish(o.ok ? 'ok' : 'no',
               o.ok ? 'Верно.' : 'Мимо. Правильный вариант — ' + right + '.',
               o.w);
      });
      opts.appendChild(b);
    });
    wrap.appendChild(opts);
  } else {
    var form = el('div', 'tq-form');
    var input = document.createElement(item.bd ? 'textarea' : 'input');
    input.className = 'tq-in' + (item.bd ? ' tq-area' : '');
    input.setAttribute('placeholder', item.bd ? 'Напишите предложение по-литовски…' : 'Впишите ответ…');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'Ваш ответ');
    var go = el('button', 'btn-go', 'Проверить');
    go.type = 'button';
    var skip = el('button', 'btn-skip', 'Показать ответ');
    skip.type = 'button';
    var help = el('p', 'kbd-help',
      'Знаки ударения можно не ставить. Литовские буквы (ą č ę ė į š ų ū ž) проверка узнаёт и без них, но скажет, каких не хватило.');

    function check(){
      if (closed) return;
      var val = input.value;
      if (!norm(val)) { input.focus(); return; }
      var r = judge(val, item.ans);
      input.disabled = true; go.disabled = true; skip.disabled = true;
      if (r === 'ok') {
        input.classList.add('ok');
        finish('ok', 'Верно.', 'Эталон: ' + item.ans[0] + '.');
      } else if (r === 'near') {
        input.classList.add('near');
        var miss = missingLetters(val, item.ans[0]);
        finish('near', 'Почти. Слово угадано, но потерялись литовские буквы' +
               (miss.length ? ' — ' + miss.join(' ') : '') + '.',
               'Эталон: ' + item.ans[0] + '. Носовая здесь не украшение, а само окончание падежа: langa и langą — разные формы, ' +
               'поэтому ответ засчитан как неверный и вернётся к повторению сегодня.');
      } else {
        input.classList.add('no');
        var d = firstDiff(val, item.ans[0]);
        finish('no', 'Мимо. Правильно: ' + item.ans[0] + '.',
               d ? 'Первое расхождение — слово № ' + d.pos + ': у вас «' + d.got + '», нужно «' + d.need + '».' : null);
      }
    }

    go.addEventListener('click', check);
    input.addEventListener('keydown', function(e){
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); }
    });
    skip.addEventListener('click', function(){
      if (closed) return;
      input.value = item.ans[0];
      input.disabled = true; go.disabled = true; skip.disabled = true;
      finish('no', 'Ответ открыт: ' + item.ans[0] + '.',
             'Задание вернётся к повторению сегодня — открытый ответ не считается решённым.');
    });

    form.appendChild(input);
    form.appendChild(go);
    form.appendChild(skip);
    form.appendChild(help);
    wrap.appendChild(form);
  }

  wrap.appendChild(verdict);
  wrap.appendChild(why);
  return wrap;
}

/* ============================================================
   8. ОТРИСОВКА БЛОКА
   ============================================================ */
function renderBlock(block, host){
  var mode = block.mode === 'text' ? 'text' : 'choice';

  var card = el('section', 'trainer');
  card.id = 'tr-' + block.id;

  var head = el('div', 'tr-head');
  var left = el('div');
  var t = el('h3', 'tr-t', block.title);
  left.appendChild(t);
  var sub = el('p', 'tr-sub');
  sub.innerHTML = block.sub;
  left.appendChild(sub);
  head.appendChild(left);

  if (block.mode !== 'text') {
    var modes = el('div', 'modes');
    modes.setAttribute('role', 'group');
    modes.setAttribute('aria-label', 'Способ ответа');
    ['choice', 'text'].forEach(function(m){
      var b = el('button', null, m === 'choice' ? 'Выбрать вариант' : 'Вписать ответ');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(m === mode));
      b.addEventListener('click', function(){
        if (mode === m) return;
        mode = m;
        Array.prototype.forEach.call(modes.children, function(c){
          c.setAttribute('aria-pressed', String(c === b));
        });
        fill();
      });
      modes.appendChild(b);
    });
    head.appendChild(modes);
  }
  card.appendChild(head);

  if (block.rule) {
    var rule = el('div', 'tr-rule');
    rule.appendChild(el('b', null, 'Правило блока'));
    rule.appendChild(document.createTextNode(block.rule));
    card.appendChild(rule);
  }

  var list = el('div');
  card.appendChild(list);

  var foot = el('div', 'tr-foot');
  var score = el('p', 'tr-score');
  var again = el('button', 'tr-again', 'Пройти заново');
  again.type = 'button';
  again.addEventListener('click', function(){ fill(); card.scrollIntoView({ block: 'start' }); });
  foot.appendChild(score);
  foot.appendChild(again);
  card.appendChild(foot);

  var done, ok;
  function setScore(){
    score.innerHTML = 'Отвечено: <b>' + done + ' / ' + block.items.length + '</b>' +
                      (done ? ' · без ошибок: <b>' + ok + '</b>' : '');
  }
  function fill(){
    list.textContent = '';
    done = 0; ok = 0;
    setScore();
    block.items.forEach(function(item, i){
      list.appendChild(renderItem(block, item, i, block.items.length, mode, function(good){
        done++; if (good) ok++;
        setScore();
        if (block.after) block.after();
      }));
    });
  }
  fill();
  host.appendChild(card);
}

/* ============================================================
   9. БАЗЫ СЛОВ
   ============================================================ */
var TABS = [
  { k:'n', name:'Предметы', n:NOUNS.length,
    head:['Vardininkas','Кто','Мн. ч.','Galininkas ед.','Galininkas мн.','Тип','Перевод'],
    row:function(x){ return [
      ['w', x.nom],
      ['tag', x.p],
      ['f', x.pl],
      ['acc', x.acc],
      ['acc', x.accPl],
      ['g', x.d + (x.x ? ' · особое' : '')],
      ['g', x.ru]
    ]; } },
  { k:'a', name:'Прилагательные', n:ADJS.length,
    head:['jis','ji','jie','jos','Galininkas: jį · ją · juos · jas','Группа','Перевод'],
    row:function(x){ return [
      ['w', x.jis],
      ['f', x.ji],
      ['f', x.jie],
      ['f', x.jos],
      ['acc', adjAcc(x,'jis') + ' · ' + adjAcc(x,'ji') + ' · ' + adjAcc(x,'jie') + ' · ' + adjAcc(x,'jos')],
      ['g', '-' + x.g + (x.x ? ' · особое' : '')],
      ['g', x.ru]
    ]; } },
  { k:'v', name:'Глаголы, зовущие ką?', n:VERBS.length,
    head:['Bendratis','aš','jis / ji','Пример','Перевод'],
    row:function(x){ return [
      ['w', x.inf],
      ['f', x.as],
      ['f', x.jis],
      ['acc', x.as + ' ką? — naują langą'],
      ['g', x.ru]
    ]; } },
  { k:'x', name:'Глаголы, зовущие не ką?', n:NOT_ACC.length,
    head:['Bendratis','Кого зовёт','Пример','Перевод'],
    row:function(x){ return [
      ['w', x.inf],
      ['acc', x.c],
      ['f', x.ex],
      ['g', x.ru]
    ]; } },
  { k:'d', name:'Словообразование', n:DERIV.length,
    head:['Būdvardis','+ -umas','+ -ėti (сам)','+ -inti (кого-то)','Перевод'],
    row:function(x){ return [
      ['w', x.adj],
      ['f', x.umas + ' · ' + x.umasRu],
      ['f', x.eti + (x.etiRu !== '—' ? ' · ' + x.etiRu : '')],
      ['acc', x.inti + (x.intiRu !== '—' ? ' · ' + x.intiRu : '')],
      ['g', x.ru]
    ]; } }
];
var TAB_DATA = { n:NOUNS, a:ADJS, v:VERBS, x:NOT_ACC, d:DERIV };

function renderWords(host){
  var cur = 'n';
  var tabs = el('div', 'wb-tabs');
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', 'Какую базу показать');

  var search = document.createElement('input');
  search.className = 'wb-search';
  search.type = 'search';
  search.setAttribute('placeholder', 'Поиск по базе — по-литовски или по-русски…');
  search.setAttribute('aria-label', 'Поиск по базе слов');

  var wrap = el('div', 'wb-wrap');
  var count = el('p', 'wb-count');

  function paint(){
    var tab = TABS.filter(function(t){ return t.k === cur; })[0];
    var rows = TAB_DATA[cur];
    var v = flat(search.value);
    wrap.textContent = '';
    var table = el('table', 'wb');
    var thead = el('thead'), tr = el('tr');
    tab.head.forEach(function(h){ tr.appendChild(el('th', null, h)); });
    thead.appendChild(tr);
    table.appendChild(thead);
    var tbody = el('tbody'), shown = 0;
    rows.forEach(function(x){
      var cells = tab.row(x);
      var hay = flat(cells.map(function(c){ return c[1]; }).join(' '));
      if (v && hay.indexOf(v) === -1) return;
      shown++;
      var r = el('tr');
      cells.forEach(function(c){
        var td = el('td');
        if (c[0] === 'tag') {
          var cls = c[1] === 'jis' ? 'tg-jis' : c[1] === 'ji' ? 'tg-ji' : 'tg-pl';
          td.appendChild(el('span', 'tg ' + cls, c[1]));
        } else {
          td.className = c[0];
          td.textContent = c[1];
        }
        r.appendChild(td);
      });
      tbody.appendChild(r);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    count.textContent = v
      ? (shown ? 'Найдено строк: ' + shown + ' из ' + rows.length : 'Ничего не найдено — попробуйте другое слово')
      : 'Всего в этой базе: ' + rows.length;
  }

  TABS.forEach(function(t){
    var b = el('button', null, t.name + ' · ' + t.n);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(t.k === cur));
    b.addEventListener('click', function(){
      cur = t.k;
      Array.prototype.forEach.call(tabs.children, function(c){
        c.setAttribute('aria-pressed', String(c === b));
      });
      paint();
    });
    tabs.appendChild(b);
  });

  search.addEventListener('input', paint);

  host.appendChild(tabs);
  host.appendChild(search);
  host.appendChild(wrap);
  host.appendChild(count);
  paint();
}

/* ============================================================
   10. ПАНЕЛЬ ПОВТОРЕНИЯ
   ============================================================ */
function renderRepeat(host){
  var bar = el('div', 'rep-bar');
  var txt = el('p', 'rb-t');
  var btn = el('button', 'tr-again', 'Начать повторение');
  btn.type = 'button';
  var stage = el('div');

  function refresh(){
    var due = dueItems();
    var db = load();
    var seen = Object.keys(db).length;
    var total = DRILLS.reduce(function(s, b){ return s + b.items.length; }, 0);
    if (!seen) {
      txt.innerHTML = 'Пока пусто. Пройдите любой блок ниже — задания встанут в расписание повторений: ' +
                      '<b>сегодня → завтра → через 3 дня → через неделю → через 2,5 недели → через месяц</b>.';
      btn.hidden = true;
    } else {
      txt.innerHTML = 'Пройдено заданий: <b>' + seen + ' из ' + total + '</b>. ' +
                      (due.length ? 'К повторению сегодня: <b>' + due.length + '</b>.'
                                  : 'На сегодня повторять нечего — возвращайтесь завтра.');
      btn.hidden = !due.length;
    }
    return due;
  }

  btn.addEventListener('click', function(){
    var due = dueItems();
    stage.textContent = '';
    if (!due.length) { refresh(); return; }
    renderBlock({
      id: 'repeat',
      title: 'Повторение по расписанию',
      sub: 'Здесь собраны задания, у которых сегодня подошёл срок. Ошиблись — задание вернётся сегодня же, ответили верно — уедет дальше по кривой забывания.',
      rule: 'Повторять надо не то, что помните, а то, что вот-вот забудете.',
      items: due.map(function(d){ return d.it; }),
      /* результат пишем в исходный ключ задания, а не в ключ «repeat» */
      key: function(i){ return due[i].bl.id + ':' + due[i].i; },
      after: refresh
    }, stage);
    refresh();
  });

  bar.appendChild(txt);
  bar.appendChild(btn);
  host.appendChild(bar);
  host.appendChild(stage);
  refresh();
}

/* ============================================================
   11. СТАРТ
   ============================================================ */
var trainers = document.getElementById('lk-trainers');
if (trainers) DRILLS.forEach(function(b){ renderBlock(b, trainers); });

var words = document.getElementById('lk-words');
if (words) renderWords(words);

var repeat = document.getElementById('lk-repeat');
if (repeat) renderRepeat(repeat);

/* Оглавление блоков тренажёра — чтобы по ним можно было прыгать. */
var jump = document.getElementById('lk-jump');
if (jump) {
  DRILLS.forEach(function(b, i){
    var a = document.createElement('a');
    a.href = '#tr-' + b.id;
    a.textContent = (i + 1) + ' · ' + b.title;
    jump.appendChild(a);
  });
}

})();

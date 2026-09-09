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
   Схемы глаголов: три главные формы → все времена и формы.
   Страница /schemos.html.

   Здесь ничего не заучивается штучно. У глагола есть ТРИ главные
   формы (bendratis · esamasis 3 · būtasis kartinis 3), и из них
   выводится вся парадигма. Поэтому в базе хранятся только они,
   а таблицы собирает движок ниже.
   ============================================================ */
(function(){
"use strict";
if (!document.getElementById('vk-root')) return;

/* ---------------- вспомогательное ---------------- */
function el(tag, cls, txt){
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
}
function tidy(s){
  return String(s == null ? '' : s).toLowerCase()
    .replace(/[‘’“”«»"']/g, ' ').replace(/[.,!?;:()–—‑-]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
function stripStress(s){
  try { return s.normalize('NFD').replace(/[̀́̃̈]/g, '').normalize('NFC'); }
  catch (e) { return s; }
}
function norm(s){ return stripStress(tidy(s)); }
function flat(s){
  return norm(s).replace(/ą/g,'a').replace(/č/g,'c').replace(/[ęė]/g,'e').replace(/į/g,'i')
    .replace(/š/g,'s').replace(/[ųū]/g,'u').replace(/ž/g,'z').replace(/ё/g,'е');
}

/* ============================================================
   1. ЧЕРЕДОВАНИЯ

   Перед -iau и -usi (то есть перед задним гласным с j-призвуком)
   t переходит в č, d — в dž. Это не исключение, а закон:
   skait- + -iau → skaičiau, rod- + -iau → rodžiau.
   ============================================================ */
function soften(stem){
  return stem.replace(/t$/, 'č').replace(/d$/, 'dž');
}

/* Перед будущим -s- шипящие и свистящие сливаются с ним в один звук:
   vež- + s → veš-, neš- + s → neš-, mes- + s → mes-.            */
function futureStem(inf){
  var st = inf.replace(/ti$/, '');
  if (/[žš]$/.test(st)) return st.replace(/[žš]$/, 'š');
  if (/[zs]$/.test(st)) return st.replace(/[zs]$/, 's');
  return st + 's';
}

/* Повелительное наклонение: основа инфинитива + -k.
   Перед -k выпадает g (bėg- → bėk), z переходит в s (megz- → mesk). */
function imperStem(inf){
  var st = inf.replace(/ti$/, '');
  if (/g$/.test(st)) return st.replace(/g$/, '');
  if (/z$/.test(st)) return st.replace(/z$/, 's');
  return st;
}

/* ============================================================
   2. ДВИЖОК: три главные формы → вся парадигма
   ============================================================ */

var PERSONS = ['aš', 'tu', 'jis / ji', 'mes', 'jūs', 'jie / jos'];

/* Три города настоящего времени и два дома прошедшего.
   Официальная грамматика называет их asmenuotės (-(i)a, -i, -o)
   и две основы прошедшего (-o, -ė). Названия «город» и «дом» — наши,
   чтобы систему было видно раньше, чем терминологию. */
var CITY = {
  'I':   {n:'город A',  lt:'I asmenuotė · -(i)a', ends:'-u · -i · -a · -ame · -ate · -a'},
  'II':  {n:'город I',  lt:'II asmenuotė · -i',   ends:'-iu · -i · -i · -ime · -ite · -i'},
  'III': {n:'город O',  lt:'III asmenuotė · -o',  ends:'-au · -ai · -o · -ome · -ote · -o'}
};
var HOUSE = {
  'O': {n:'дом O', lt:'būtojo kartinio kamienas -o', ends:'-au · -ai · -o · -ome · -ote · -o'},
  'Ė': {n:'дом Ė', lt:'būtojo kartinio kamienas -ė', ends:'-iau · -ei · -ė · -ėme · -ėte · -ė'}
};
var REL = {
  'full': ['Маршрут известен целиком', 'rel-full'],
  'past': ['Стабильно только прошлое', 'rel-past'],
  'none': ['Маршрута нет — учим три формы', 'rel-none']
};

/* Настоящее время. Спряжение определяется окончанием 3-го лица:
   -a → I (dirba), -i → II (turi), -o → III (skaito).            */
function present(pres3){
  var stem, ends;
  if (/o$/.test(pres3)) {                       /* III: skaito */
    stem = pres3.slice(0, -1);
    ends = ['au', 'ai', 'o', 'ome', 'ote', 'o'];
  } else if (/i$/.test(pres3)) {                /* II: turi */
    stem = pres3.slice(0, -1);
    ends = ['iu', 'i', 'i', 'ime', 'ite', 'i'];
  } else {                                      /* I: dirba, geria */
    stem = pres3.slice(0, -1);
    ends = ['u', 'i', 'a', 'ame', 'ate', 'a'];
  }
  return ends.map(function(e, i){
    /* у мягкой основы (geri-) 2-е лицо не удваивает i: geri, а не gerii */
    if (i === 1 && /i$/.test(stem) && e === 'i') return stem;
    return stem + e;
  });
}
function presentInfo(pres3){
  if (/o$/.test(pres3)) return { n: 'III', stem: pres3.slice(0, -1), ends: '-au · -ai · -o · -ome · -ote · -o' };
  if (/i$/.test(pres3)) return { n: 'II',  stem: pres3.slice(0, -1), ends: '-iu · -i · -i · -ime · -ite · -i' };
  return { n: 'I', stem: pres3.slice(0, -1), ends: '-u · -i · -a · -ame · -ate · -a' };
}

/* Прошедшее однократное. Тип по окончанию 3-го лица:
   -o → dirbo, -ė → skaitė (и тогда в 1-м лице t → č, d → dž).   */
function pastOnce(past3){
  var stem;
  if (/ė$/.test(past3)) {
    stem = past3.slice(0, -1);
    return [soften(stem) + 'iau', stem + 'ei', stem + 'ė', stem + 'ėme', stem + 'ėte', stem + 'ė'];
  }
  stem = past3.slice(0, -1);
  return [stem + 'au', stem + 'ai', stem + 'o', stem + 'ome', stem + 'ote', stem + 'o'];
}
function pastInfo(past3){
  if (/ė$/.test(past3)) return { t: 'ė', stem: past3.slice(0, -1), ends: '-iau · -ei · -ė · -ėme · -ėte · -ė' };
  return { t: 'o', stem: past3.slice(0, -1), ends: '-au · -ai · -o · -ome · -ote · -o' };
}

/* Прошедшее многократное: основа инфинитива + -dav- + окончания -o-типа. */
function pastOften(inf){
  var st = inf.replace(/ti$/, '') + 'dav';
  return ['au', 'ai', 'o', 'ome', 'ote', 'o'].map(function(e){ return st + e; });
}

/* Будущее: основа инфинитива + -s- + личные окончания. */
function future(inf){
  var st = futureStem(inf);
  return [st + 'iu', st + 'i', st, st + 'ime', st + 'ite', st];
}

/* Условное наклонение (tariamoji nuosaka). */
function conditional(inf){
  var st = inf.replace(/ti$/, '');
  return [st + 'čiau', st + 'tum', st + 'tų', st + 'tume', st + 'tumėte', st + 'tų'];
}

/* Повелительное наклонение (liepiamoji nuosaka): только 3 формы. */
function imperative(inf){
  var st = imperStem(inf);
  return [st + 'k', st + 'kime', st + 'kite'];
}

/* Причастия и наречные формы.

   Женская форма действительного причастия прошедшего времени
   (-usi / -iusi) здесь НЕ выводится машинально: у одних глаголов
   основа перед ней смягчается (skaitęs → skaičiusi), у других нет
   (ėmęs → ėmusi), и правило зависит от типа основы, а не от буквы.
   Эта форма — предмет отдельного разбора по причастиям, поэтому
   тут даётся только мужская, которая образуется без исключений.

   Страдательные причастия показываем только у переходных глаголов:
   у непереходных таких форм в живом языке нет.                     */
function participles(inf, pres3, past3, transitive){
  var pStem = /i$/.test(pres3) ? pres3.slice(0, -1) + 'in' : pres3.slice(0, -1) + 'an';
  var qStem = past3.slice(0, -1);
  var iStem = inf.replace(/ti$/, '');
  return {
    actPres: [pStem + 'tis', pStem + 'ti'],
    actPast: [qStem + 'ęs'],
    pasPres: transitive ? [pres3 + 'mas', pres3 + 'ma'] : null,
    pasPast: transitive ? [iStem + 'tas', iStem + 'ta'] : null,
    pusdal:  [iStem + 'damas', iStem + 'dama'],
    padal:   pStem + 't'
  };
}

/* Город настоящего времени определяется по третьему лицу:
   -a → город A (I asmenuotė), -i → город I (II), -o → город O (III). */
function cityOf(pres3){
  if (/o$/.test(pres3)) return {k:'III', n:'город O', ends:'-au · -ai · -o · -ome · -ote · -o'};
  if (/i$/.test(pres3)) return {k:'II',  n:'город I', ends:'-iu · -i · -i · -ime · -ite · -i'};
  return                       {k:'I',   n:'город A', ends:'-u · -i · -a · -ame · -ate · -a'};
}
/* Дом прошедшего — по третьему лицу прошедшего: -o или -ė. */
function houseOf(past3){
  if (/ė$/.test(past3)) return {k:'Ė', n:'дом Ė', ends:'-iau · -ei · -ė · -ėme · -ėte · -ė'};
  return                       {k:'O', n:'дом O', ends:'-au · -ai · -o · -ome · -ote · -o'};
}
function ci_stem(pres3){ return pres3.slice(0, -1); }
function famOf(v){
  var f = FAMILIES.filter(function(x){ return x.k === v.g; })[0];
  return f || FAMILIES[FAMILIES.length - 1];
}
/* Маршрут конкретного глагола: инфинитив → город → дом. */
function routeOf(v){
  return v.inf + '  →  ' + cityOf(v.pres).n + '  →  ' + houseOf(v.past).n;
}

/* Полная парадигма одного глагола.
   irrPres — ручная замена настоящего времени: она нужна ровно
   одному глаголу, būti, у которого настоящее не выводится ниоткуда. */
function conjugate(v){
  return {
    inf: v.inf,
    pres: v.irrPres || present(v.pres),
    past: pastOnce(v.past),
    often: pastOften(v.inf),
    fut: future(v.inf),
    cond: conditional(v.inf),
    imper: imperative(v.inf),
    part: v.irrPart || participles(v.inf, v.pres, v.past, v.t),
    presInfo: presentInfo(v.pres),
    pastInfo: pastInfo(v.past)
  };
}

/* ============================================================
   3. ГРУППЫ ГЛАГОЛОВ

   Группа не заменяет три главные формы — она подсказывает, каких
   форм ждать. Внутри группы схема одна и та же, поэтому выучив
   один глагол, вы получаете все остальные из списка даром.
   ============================================================ */
var FAMILIES = [
  /* ---- маршрут известен целиком ---- */
  {k:'yti', n:'Семья -yti', rel:'full',
   cut:'убрать -yti', stem:'valgyti − -yti → valg-',
   city:'III', house:'Ė',
   route:'-yti  →  город O  →  дом Ė',
   d:'Самая большая стабильная семья языка. Убираем -yti целиком — и полученная основа работает и в настоящем, и в прошедшем. В настоящем она живёт в городе O, в прошлом переезжает в дом Ė.',
   ex:'valgyti → valgo → valgė',
   exru:'есть → ест → ел',
   note:'Мы больше не учим <i>daryti — daro</i> как отдельный факт. Мы знаем: daryti из семьи -yti, а эта семья живёт в городе O и уезжает в дом Ė. Одно правило — десятки глаголов.'},

  {k:'inti', n:'Семья -inti и -enti', rel:'full',
   cut:'убрать -ti', stem:'gerinti − -ti → gerin-  ·  gyventi − -ti → gyven-',
   city:'I', house:'O',
   route:'-inti  →  город A  →  дом O',
   d:'Основа не меняется вообще: убрали -ti — и всё. Живёт в городе A, в прошлом переезжает в дом O, где окончания те же, что в городе O настоящего времени.',
   ex:'gerinti → gerina → gerino  ·  gyventi → gyvena → gyveno',
   exru:'улучшать → улучшает → улучшал  ·  жить → живёт → жил',
   note:'Эта семья вырастает из прилагательных и означает «делать что-то каким-то», поэтому почти вся она переходная и зовёт <b>ką?</b> — <i>gerinti sveikatą</i> (улучшать здоровье). Подробно — в разделе про пару -inti / -ėti.'},

  {k:'eti-eja', n:'Семья -ėti со значением «становиться»', rel:'full',
   cut:'убрать -ti', stem:'gerėti − -ti → gerė- → основа gerėj-',
   city:'I', house:'O',
   route:'-ėti «становиться»  →  город A  →  дом O',
   d:'Зеркальная пара к -inti. Если -inti — «сделать каким-то», то это — «стать каким-то самому». В настоящем появляется j и работает город A, в прошлом — дом O.',
   ex:'gerėti → gerėja → gerėjo',
   exru:'улучшаться → улучшается → улучшался',
   note:'Внимание на два похожих слова: <b>gerėjate</b> — это настоящее время («вы становитесь лучше»), а <b>gerėjote</b> — прошедшее («вы становились лучше»). Различает их одна буква.'},

  {k:'auti', n:'Семья -auti и -uoti', rel:'full',
   cut:'настоящее: −ti + j · прошедшее: -au-/-uo- → -av-',
   stem:'keliauti − -ti → keliau- + j → keliauj-  ·  прошедшее keliav-',
   city:'I', house:'O',
   route:'-auti / -uoti  →  город A  →  дом O',
   d:'Здесь два разных шага, и их удобно держать отдельно. НАСТОЯЩЕЕ: убираем -ti и приклеиваем j — получается основа на -j-, дальше обычный город A. ПРОШЕДШЕЕ: -au- и -uo- сменяются на -av-, и дальше обычный дом O.',
   ex:'keliauti → keliauja → keliavo',
   exru:'путешествовать → путешествует → путешествовал',
   note:'<b>Настоящее:</b> keliauti → keliau<b>j</b>u, keliauji, keliauja, keliaujame, keliaujate, keliauja. То же у -uoti: dainuoti → dainuo<b>j</b>u, dainuoji, dainuoja.<br><b>Прошедшее:</b> keli<b>av</b>au, keliavai, keliavo, keliavome, keliavote, keliavo; dain<b>av</b>au, dainavai, dainavo.<br>Сюда же уходят почти все заимствования: <i>fotografuoti</i> (фотографировать), <i>organizuoti</i> (организовывать), <i>remontuoti</i> (ремонтировать). Новое иностранное слово в литовском почти всегда становится глаголом этой семьи — поэтому она растёт быстрее всех.'},

  /* ---- стабильно только прошлое ---- */
  {k:'eti', n:'Семья -ėti', rel:'past',
   cut:'убрать -ti', stem:'turėti − -ėti → tur- · прошедшее turėj-',
   city:null, house:'O',
   route:'-ėti  →  город проверяем  →  дом O',
   d:'Дорога в прошлое надёжная: -ėti почти всегда даёт -ėjo. А вот город настоящего по инфинитиву не угадывается — его нужно посмотреть в третьем лице.',
   ex:'turėti → turi → turėjo',
   exru:'иметь → имеет → имел',
   note:'Вот почему город надо проверять: <i>turėti → turi</i> (город I), но <i>kalbėti → kalba</i> (город A). Оба на -ėti, а живут в разных городах. Это и есть та информация, ради которой третья форма существует.'},

  {k:'oti', n:'Семья -oti', rel:'past',
   cut:'убрать -ti', stem:'dėkoti − -ti → dėko- · прошедшее dėkoj-',
   city:null, house:'O',
   route:'-oti  →  город проверяем  →  дом O',
   d:'Ровно та же история: в прошлом почти всегда -ojo, а город настоящего бывает разный.',
   ex:'dėkoti → dėkoja → dėkojo',
   exru:'благодарить → благодарит → благодарил',
   note:'Сравните: <i>dėkoti → dėkoja</i> (город A), но <i>ieškoti → ieško</i> (город O) и <i>bijoti → bijo</i> (город O). Два последних к тому же зовут не galininkas, а kilmininkas: <i>ieškau raktų</i> (ищу ключи), <i>bijau šuns</i> (боюсь собаки).'},

  {k:'yti-x', n:'Бунтари внутри -yti', rel:'none',
   cut:'три формы', stem:'-y- здесь часть корня, а не суффикс',
   city:null, house:null,
   route:'-yti  →  город A  →  дом O   (а не O → Ė, как у настоящей семьи -yti)',
   d:'Ловушка для глаза. Эти слова кончаются на -yti, но к большой стабильной семье не относятся: у них -y- входит в короткий корень, а не является суффиксом. Поэтому и маршрут другой — не «город O → дом Ė», а «город A → дом O» с j в основе.',
   ex:'gyti → gyja → gijo',
   exru:'заживать → заживает → заживал',
   note:'Сравните: <i>daryti → daro → darė</i> (делать) — суффикс -yti, настоящая семья. И <i>gyti → gyja → gijo</i> (заживать) — корень gy-, бунтарь. Отличить их по инфинитиву нельзя, отличает третье лицо: <b>-o</b> у семьи, <b>-ja</b> у бунтаря.<br>Сюда же <i>lyti → lyja → lijo</i> (идти о дожде) — он живёт только в третьем лице: <i>lyja</i> (идёт дождь), <i>lijo</i> (шёл дождь).'},

  /* ---- бунтари ---- */
  {k:'kinta', n:'Бунтари', rel:'none',
   cut:'три формы', stem:'по трём главным формам',
   city:null, house:null,
   route:'инфинитив ничего не обещает — учим три формы',
   d:'Здесь схемы не будет, и это честный ответ. По инфинитиву у этих глаголов нельзя узнать ни город, ни дом — поэтому именно им и нужны три главные формы. Заметьте: окончания у бунтарей самые обычные. Непредсказуема только основа.',
   ex:'imti → ima → ėmė',
   exru:'брать → берёт → брал',
   note:'Утешение: бунтарей немного, но они самые частые — <i>būti</i> (быть), <i>eiti</i> (идти), <i>duoti</i> (давать), <i>imti</i> (брать). Вы услышите их сотни раз и запомните без таблицы. Особый случай — <b>būti</b>: у него в разных временах разные корни (esu, yra, buvo), грамматика называет это супплетивизмом.'}
];

/* Прилагательное → два глагола: «сделать таким» и «стать таким».
   Одна пара объясняет сразу словообразование, переходность и падеж. */
var PAIRS = [
  {adj:'geras',   adjru:'хороший',           inti:'gerinti',    intiru:'улучшать',      eti:'gerėti',    etiru:'улучшаться'},
  {adj:'blogas',  adjru:'плохой',            inti:'bloginti',   intiru:'ухудшать',      eti:'blogėti',   etiru:'ухудшаться'},
  {adj:'didelis', adjru:'большой',           inti:'didinti',    intiru:'увеличивать',   eti:'didėti',    etiru:'увеличиваться'},
  {adj:'mažas',   adjru:'маленький',         inti:'mažinti',    intiru:'уменьшать',     eti:'mažėti',    etiru:'уменьшаться'},
  {adj:'stiprus', adjru:'сильный',           inti:'stiprinti',  intiru:'укреплять',     eti:'stiprėti',  etiru:'крепнуть'},
  {adj:'silpnas', adjru:'слабый',            inti:'silpninti',  intiru:'ослаблять',     eti:'silpnėti',  etiru:'слабеть'},
  {adj:'tobulas', adjru:'совершенный',       inti:'tobulinti',  intiru:'совершенствовать', eti:'tobulėti', etiru:'совершенствоваться'},
  {adj:'greitas', adjru:'быстрый',           inti:'greitinti',  intiru:'ускорять',      eti:'greitėti',  etiru:'ускоряться'},
  {adj:'lėtas',   adjru:'медленный',         inti:'lėtinti',    intiru:'замедлять',     eti:'lėtėti',    etiru:'замедляться'},
  {adj:'sunkus',  adjru:'тяжёлый, трудный',  inti:'sunkinti',   intiru:'утяжелять',     eti:'sunkėti',   etiru:'становиться тяжелее'},
  {adj:'lengvas', adjru:'лёгкий',            inti:'lengvinti',  intiru:'облегчать',     eti:'lengvėti',  etiru:'становиться легче'},
  {adj:'švarus',  adjru:'чистый',            inti:'švarinti',   intiru:'очищать',       eti:'švarėti',   etiru:'становиться чище'},
  {adj:'tamsus',  adjru:'тёмный',            inti:'tamsinti',   intiru:'затемнять',     eti:'tamsėti',   etiru:'темнеть'},
  {adj:'šviesus', adjru:'светлый',           inti:'šviesinti',  intiru:'осветлять',     eti:'šviesėti',  etiru:'светлеть'},
  {adj:'ilgas',   adjru:'длинный',           inti:'ilginti',    intiru:'удлинять',      eti:'ilgėti',    etiru:'удлиняться'},
  {adj:'trumpas', adjru:'короткий',          inti:'trumpinti',  intiru:'укорачивать',   eti:'trumpėti',  etiru:'укорачиваться'},
  {adj:'gražus',  adjru:'красивый',          inti:'gražinti',   intiru:'украшать',      eti:'gražėti',   etiru:'хорошеть'},
  {adj:'tikras',  adjru:'настоящий, верный', inti:'tikrinti',   intiru:'проверять',     eti:'—',         etiru:'—'}
];

/* ============================================================
   4. БАЗА ГЛАГОЛОВ
   inf — bendratis · pres — esamojo laiko 3 asmuo
   past — būtojo kartinio laiko 3 asmuo · ru — перевод · g — группа
   t:1 — переходный, зовёт galininkas (ką?)
   ============================================================ */
var VERBS = [
  /* ---- устойчивые -inti ---- */
  {inf:'sveikinti', pres:'sveikina', past:'sveikino', ru:'поздравлять', g:'inti', t:1},
  {inf:'auginti', pres:'augina', past:'augino', ru:'растить', g:'inti', t:1},
  {inf:'džiovinti', pres:'džiovina', past:'džiovino', ru:'сушить', g:'inti', t:1},
  {inf:'žadinti', pres:'žadina', past:'žadino', ru:'будить', g:'inti', t:1},
  {inf:'spausdinti', pres:'spausdina', past:'spausdino', ru:'печатать', g:'inti', t:1},
  {inf:'platinti', pres:'platina', past:'platino', ru:'распространять', g:'inti', t:1},
  {inf:'tvirtinti', pres:'tvirtina', past:'tvirtino', ru:'утверждать', g:'inti', t:1},
  {inf:'garsinti', pres:'garsina', past:'garsino', ru:'прославлять', g:'inti', t:1},
  {inf:'virškinti', pres:'virškina', past:'virškino', ru:'переваривать', g:'inti', t:1},
  {inf:'smulkinti', pres:'smulkina', past:'smulkino', ru:'измельчать', g:'inti', t:1},
  {inf:'vaidinti', pres:'vaidina', past:'vaidino', ru:'играть роль', g:'inti', t:1},
  {inf:'piginti', pres:'pigina', past:'pigino', ru:'удешевлять', g:'inti', t:1},
  {inf:'artinti', pres:'artina', past:'artino', ru:'приближать', g:'inti', t:1},
  {inf:'tolinti', pres:'tolina', past:'tolino', ru:'отдалять', g:'inti', t:1},
  {inf:'linksminti', pres:'linksmina', past:'linksmino', ru:'веселить', g:'inti', t:1},
  {inf:'liūdinti', pres:'liūdina', past:'liūdino', ru:'печалить', g:'inti', t:1},
  {inf:'kaitinti', pres:'kaitina', past:'kaitino', ru:'накалять', g:'inti', t:1},
  {inf:'vėsinti', pres:'vėsina', past:'vėsino', ru:'охлаждать', g:'inti', t:1},
  {inf:'drėkinti', pres:'drėkina', past:'drėkino', ru:'увлажнять', g:'inti', t:1},
  {inf:'sausinti', pres:'sausina', past:'sausino', ru:'осушать', g:'inti', t:1},
  {inf:'turtinti', pres:'turtina', past:'turtino', ru:'обогащать', g:'inti', t:1},
  {inf:'aiškinti', pres:'aiškina', past:'aiškino', ru:'объяснять', g:'inti', t:1},
  {inf:'ryškinti', pres:'ryškina', past:'ryškino', ru:'проявлять', g:'inti', t:1},
  {inf:'raginti', pres:'ragina', past:'ragino', ru:'побуждать', g:'inti', t:1},
  {inf:'kaltinti', pres:'kaltina', past:'kaltino', ru:'обвинять', g:'inti', t:1},
  {inf:'skatinti', pres:'skatina', past:'skatino', ru:'поощрять', g:'inti', t:1},
  {inf:'gąsdinti', pres:'gąsdina', past:'gąsdino', ru:'пугать', g:'inti', t:1},
  {inf:'vaišinti', pres:'vaišina', past:'vaišino', ru:'угощать', g:'inti', t:1},
  {inf:'laisvinti', pres:'laisvina', past:'laisvino', ru:'освобождать', g:'inti', t:1},
  {inf:'valgydinti', pres:'valgydina', past:'valgydino', ru:'кормить', g:'inti', t:1},
  {inf:'pagaminti', pres:'pagamina', past:'pagamino', ru:'приготовить', g:'inti', t:1},
  {inf:'patikrinti', pres:'patikrina', past:'patikrino', ru:'проверить', g:'inti', t:1},
  {inf:'gyventi', pres:'gyvena', past:'gyveno', ru:'жить', g:'inti', t:1},
  {inf:'ridenti', pres:'ridena', past:'rideno', ru:'катить', g:'inti', t:1},
  {inf:'tobulinti', pres:'tobulina', past:'tobulino', ru:'совершенствовать', g:'inti', t:1},
  {inf:'silpninti', pres:'silpnina', past:'silpnino', ru:'ослаблять', g:'inti', t:1},
  {inf:'greitinti', pres:'greitina', past:'greitino', ru:'ускорять', g:'inti', t:1},
  {inf:'lėtinti', pres:'lėtina', past:'lėtino', ru:'замедлять', g:'inti', t:1},
  {inf:'gražinti', pres:'gražina', past:'gražino', ru:'украшать, делать красивее', g:'inti', t:1},
  {inf:'gerinti', pres:'gerina', past:'gerino', ru:'улучшать', g:'inti', t:1},
  {inf:'bloginti', pres:'blogina', past:'blogino', ru:'ухудшать', g:'inti', t:1},
  {inf:'didinti', pres:'didina', past:'didino', ru:'увеличивать', g:'inti', t:1},
  {inf:'mažinti', pres:'mažina', past:'mažino', ru:'уменьшать', g:'inti', t:1},
  {inf:'ilginti', pres:'ilgina', past:'ilgino', ru:'удлинять', g:'inti', t:1},
  {inf:'trumpinti', pres:'trumpina', past:'trumpino', ru:'укорачивать', g:'inti', t:1},
  {inf:'stiprinti', pres:'stiprina', past:'stiprino', ru:'укреплять', g:'inti', t:1},
  {inf:'lengvinti', pres:'lengvina', past:'lengvino', ru:'облегчать', g:'inti', t:1},
  {inf:'sunkinti', pres:'sunkina', past:'sunkino', ru:'утяжелять', g:'inti', t:1},
  {inf:'tamsinti', pres:'tamsina', past:'tamsino', ru:'затемнять', g:'inti', t:1},
  {inf:'šviesinti', pres:'šviesina', past:'šviesino', ru:'осветлять', g:'inti', t:1},
  {inf:'raminti', pres:'ramina', past:'ramino', ru:'успокаивать', g:'inti', t:1},
  {inf:'švarinti', pres:'švarina', past:'švarino', ru:'делать чище', g:'inti', t:1},
  {inf:'gaminti', pres:'gamina', past:'gamino', ru:'готовить (еду)', g:'inti', t:1},
  {inf:'grąžinti', pres:'grąžina', past:'grąžino', ru:'возвращать', g:'inti', t:1},
  {inf:'vadinti', pres:'vadina', past:'vadino', ru:'называть', g:'inti', t:1},
  {inf:'tikrinti', pres:'tikrina', past:'tikrino', ru:'проверять', g:'inti', t:1},
  {inf:'lyginti', pres:'lygina', past:'lygino', ru:'сравнивать; гладить', g:'inti', t:1},
  {inf:'kalbinti', pres:'kalbina', past:'kalbino', ru:'заговаривать с кем-то', g:'inti', t:1},
  {inf:'pratinti', pres:'pratina', past:'pratino', ru:'приучать', g:'inti', t:1},
  {inf:'minkštinti', pres:'minkština', past:'minkštino', ru:'смягчать', g:'inti', t:1},
  {inf:'tikslinti', pres:'tikslina', past:'tikslino', ru:'уточнять', g:'inti', t:1},
  {inf:'branginti', pres:'brangina', past:'brangino', ru:'ценить; повышать цену', g:'inti', t:1},
  {inf:'kabinti', pres:'kabina', past:'kabino', ru:'вешать', g:'inti', t:1},
  {inf:'sodinti', pres:'sodina', past:'sodino', ru:'сажать', g:'inti', t:1},
  {inf:'dalinti', pres:'dalina', past:'dalino', ru:'делить, раздавать', g:'inti', t:1},

  /* ---- устойчивые -yti ---- */
  {inf:'siūlyti', pres:'siūlo', past:'siūlė', ru:'предлагать', g:'yti', t:1},
  {inf:'svarstyti', pres:'svarsto', past:'svarstė', ru:'обдумывать', g:'yti', t:1},
  {inf:'laistyti', pres:'laisto', past:'laistė', ru:'поливать', g:'yti', t:1},
  {inf:'pjaustyti', pres:'pjausto', past:'pjaustė', ru:'нарезать', g:'yti', t:1},
  {inf:'braižyti', pres:'braižo', past:'braižė', ru:'чертить', g:'yti', t:1},
  {inf:'mėtyti', pres:'mėto', past:'mėtė', ru:'разбрасывать', g:'yti', t:1},
  {inf:'svaidyti', pres:'svaido', past:'svaidė', ru:'швырять', g:'yti', t:1},
  {inf:'gaudyti', pres:'gaudo', past:'gaudė', ru:'ловить', g:'yti', t:1},
  {inf:'vaikyti', pres:'vaiko', past:'vaikė', ru:'гонять', g:'yti', t:1},
  {inf:'guldyti', pres:'guldo', past:'guldė', ru:'укладывать', g:'yti', t:1},
  {inf:'mąstyti', pres:'mąsto', past:'mąstė', ru:'размышлять', g:'yti', t:1},
  {inf:'sūdyti', pres:'sūdo', past:'sūdė', ru:'солить', g:'yti', t:1},
  {inf:'valdyti', pres:'valdo', past:'valdė', ru:'управлять', g:'yti', t:1},
  {inf:'barstyti', pres:'barsto', past:'barstė', ru:'посыпать', g:'yti', t:1},
  {inf:'lipdyti', pres:'lipdo', past:'lipdė', ru:'лепить', g:'yti', t:1},
  {inf:'skaldyti', pres:'skaldo', past:'skaldė', ru:'колоть, раскалывать', g:'yti', t:1},
  {inf:'maudyti', pres:'maudo', past:'maudė', ru:'купать', g:'yti', t:1},
  {inf:'taupyti', pres:'taupo', past:'taupė', ru:'экономить', g:'yti', t:1},
  {inf:'slaugyti', pres:'slaugo', past:'slaugė', ru:'ухаживать за больным', g:'yti', t:1},
  {inf:'kraustyti', pres:'krausto', past:'kraustė', ru:'перебирать, переезжать', g:'yti', t:1},
  {inf:'ardyti', pres:'ardo', past:'ardė', ru:'разбирать, пороть', g:'yti', t:1},
  {inf:'glostyti', pres:'glosto', past:'glostė', ru:'гладить рукой', g:'yti', t:1},
  {inf:'laužyti', pres:'laužo', past:'laužė', ru:'ломать', g:'yti', t:1},
  {inf:'daužyti', pres:'daužo', past:'daužė', ru:'разбивать', g:'yti', t:1},
  {inf:'rūkyti', pres:'rūko', past:'rūkė', ru:'курить', g:'yti', t:1},
  {inf:'stumdyti', pres:'stumdo', past:'stumdė', ru:'толкать', g:'yti', t:1},
  {inf:'šaldyti', pres:'šaldo', past:'šaldė', ru:'морозить', g:'yti', t:1},
  {inf:'badyti', pres:'bado', past:'badė', ru:'колоть, бодать', g:'yti', t:1},
  {inf:'atsakyti', pres:'atsako', past:'atsakė', ru:'отвечать', g:'yti', t:1},
  {inf:'perskaityti', pres:'perskaito', past:'perskaitė', ru:'прочитать', g:'yti', t:1},
  {inf:'paskaityti', pres:'paskaito', past:'paskaitė', ru:'почитать', g:'yti', t:1},
  {inf:'parašyti', pres:'parašo', past:'parašė', ru:'написать', g:'yti', t:1},
  {inf:'užrašyti', pres:'užrašo', past:'užrašė', ru:'записать', g:'yti', t:1},
  {inf:'aprašyti', pres:'aprašo', past:'aprašė', ru:'описать', g:'yti', t:1},
  {inf:'įrašyti', pres:'įrašo', past:'įrašė', ru:'записать на носитель', g:'yti', t:1},
  {inf:'perrašyti', pres:'perrašo', past:'perrašė', ru:'переписать', g:'yti', t:1},
  {inf:'surašyti', pres:'surašo', past:'surašė', ru:'составить список', g:'yti', t:1},
  {inf:'prirašyti', pres:'prirašo', past:'prirašė', ru:'написать много', g:'yti', t:1},
  {inf:'nurašyti', pres:'nurašo', past:'nurašė', ru:'списать', g:'yti', t:1},
  {inf:'padaryti', pres:'padaro', past:'padarė', ru:'сделать', g:'yti', t:1},
  {inf:'sudaryti', pres:'sudaro', past:'sudarė', ru:'составить', g:'yti', t:1},
  {inf:'pradaryti', pres:'pradaro', past:'pradarė', ru:'приоткрыть', g:'yti', t:1},
  {inf:'pasakyti', pres:'pasako', past:'pasakė', ru:'сказать', g:'yti', t:1},
  {inf:'paklausyti', pres:'paklauso', past:'paklausė', ru:'послушать', g:'yti', t:1},
  {inf:'pataisyti', pres:'pataiso', past:'pataisė', ru:'починить, исправить', g:'yti', t:1},
  {inf:'sutaisyti', pres:'sutaiso', past:'sutaisė', ru:'починить', g:'yti', t:1},
  {inf:'atitaisyti', pres:'atitaiso', past:'atitaisė', ru:'исправить', g:'yti', t:1},
  {inf:'išvalyti', pres:'išvalo', past:'išvalė', ru:'вычистить', g:'yti', t:1},
  {inf:'nuvalyti', pres:'nuvalo', past:'nuvalė', ru:'вытереть', g:'yti', t:1},
  {inf:'išmokyti', pres:'išmoko', past:'išmokė', ru:'научить', g:'yti', t:1},
  {inf:'pamokyti', pres:'pamoko', past:'pamokė', ru:'поучить', g:'yti', t:1},
  {inf:'pastatyti', pres:'pastato', past:'pastatė', ru:'построить, поставить', g:'yti', t:1},
  {inf:'nustatyti', pres:'nustato', past:'nustatė', ru:'установить', g:'yti', t:1},
  {inf:'sustatyti', pres:'sustato', past:'sustatė', ru:'расставить', g:'yti', t:1},
  {inf:'įstatyti', pres:'įstato', past:'įstatė', ru:'вставить', g:'yti', t:1},
  {inf:'sumaišyti', pres:'sumaišo', past:'sumaišė', ru:'смешать', g:'yti', t:1},
  {inf:'išmaišyti', pres:'išmaišo', past:'išmaišė', ru:'размешать', g:'yti', t:1},
  {inf:'pamaišyti', pres:'pamaišo', past:'pamaišė', ru:'помешать', g:'yti', t:1},
  {inf:'sulaikyti', pres:'sulaiko', past:'sulaikė', ru:'задержать', g:'yti', t:1},
  {inf:'palaikyti', pres:'palaiko', past:'palaikė', ru:'поддержать', g:'yti', t:1},
  {inf:'suvalgyti', pres:'suvalgo', past:'suvalgė', ru:'съесть', g:'yti', t:1},
  {inf:'pavalgyti', pres:'pavalgo', past:'pavalgė', ru:'поесть', g:'yti', t:1},
  {inf:'išgydyti', pres:'išgydo', past:'išgydė', ru:'вылечить', g:'yti', t:1},
  {inf:'nudažyti', pres:'nudažo', past:'nudažė', ru:'покрасить', g:'yti', t:1},
  {inf:'uždažyti', pres:'uždažo', past:'uždažė', ru:'закрасить', g:'yti', t:1},
  {inf:'perdažyti', pres:'perdažo', past:'perdažė', ru:'перекрасить', g:'yti', t:1},
  {inf:'sutvarkyti', pres:'sutvarko', past:'sutvarkė', ru:'привести в порядок', g:'yti', t:1},
  {inf:'palaistyti', pres:'palaisto', past:'palaistė', ru:'полить', g:'yti', t:1},
  {inf:'prašyti', pres:'prašo', past:'prašė', ru:'просить', g:'yti', c:'kilmininkas · ko?'},
  {inf:'atsiprašyti', pres:'atsiprašo', past:'atsiprašė', ru:'извиняться', g:'yti', c:'kilmininkas · ko?'},
  {inf:'bandyti', pres:'bando', past:'bandė', ru:'пробовать, пытаться', g:'yti', t:1},
  {inf:'skaityti', pres:'skaito', past:'skaitė', ru:'читать', g:'yti', t:1},
  {inf:'rašyti', pres:'rašo', past:'rašė', ru:'писать', g:'yti', t:1},
  {inf:'daryti', pres:'daro', past:'darė', ru:'делать', g:'yti', t:1},
  {inf:'matyti', pres:'mato', past:'matė', ru:'видеть', g:'yti', t:1},
  {inf:'sakyti', pres:'sako', past:'sakė', ru:'говорить, сказать', g:'yti', t:1},
  {inf:'mokyti', pres:'moko', past:'mokė', ru:'учить (кого-то)', g:'yti', t:1},
  {inf:'valyti', pres:'valo', past:'valė', ru:'чистить, убирать', g:'yti', t:1},
  {inf:'rodyti', pres:'rodo', past:'rodė', ru:'показывать', g:'yti', t:1},
  {inf:'taisyti', pres:'taiso', past:'taisė', ru:'чинить', g:'yti', t:1},
  {inf:'statyti', pres:'stato', past:'statė', ru:'строить, ставить', g:'yti', t:1},
  {inf:'laikyti', pres:'laiko', past:'laikė', ru:'держать', g:'yti', t:1},
  {inf:'dažyti', pres:'dažo', past:'dažė', ru:'красить', g:'yti', t:1},
  {inf:'šildyti', pres:'šildo', past:'šildė', ru:'греть', g:'yti', t:1},
  {inf:'valgyti', pres:'valgo', past:'valgė', ru:'есть', g:'yti', t:1},
  {inf:'klausyti', pres:'klauso', past:'klausė', ru:'слушать(ся)', g:'yti', t:1},
  {inf:'gydyti', pres:'gydo', past:'gydė', ru:'лечить', g:'yti', t:1},
  {inf:'atidaryti', pres:'atidaro', past:'atidarė', ru:'открывать', g:'yti', t:1},
  {inf:'uždaryti', pres:'uždaro', past:'uždarė', ru:'закрывать', g:'yti', t:1},
  {inf:'lankyti', pres:'lanko', past:'lankė', ru:'посещать', g:'yti', t:1},
  {inf:'maišyti', pres:'maišo', past:'maišė', ru:'мешать, смешивать', g:'yti', t:1},
  {inf:'karpyti', pres:'karpo', past:'karpė', ru:'резать ножницами', g:'yti', t:1},
  {inf:'tvarkyti', pres:'tvarko', past:'tvarkė', ru:'приводить в порядок', g:'yti', t:1},
  {inf:'vartyti', pres:'varto', past:'vartė', ru:'переворачивать', g:'yti', t:1},
  {inf:'girdyti', pres:'girdo', past:'girdė', ru:'поить', g:'yti', t:1},

  /* ---- -ėti с настоящим на -i ---- */
  {inf:'turėti', pres:'turi', past:'turėjo', ru:'иметь', g:'eti', t:1},
  {inf:'norėti', pres:'nori', past:'norėjo', ru:'хотеть', g:'eti', c:'kilmininkas · ko?'},
  {inf:'galėti', pres:'gali', past:'galėjo', ru:'мочь', g:'eti'},
  {inf:'mylėti', pres:'myli', past:'mylėjo', ru:'любить', g:'eti', t:1},
  {inf:'girdėti', pres:'girdi', past:'girdėjo', ru:'слышать', g:'eti', t:1},
  {inf:'žiūrėti', pres:'žiūri', past:'žiūrėjo', ru:'смотреть', g:'eti'},
  {inf:'sėdėti', pres:'sėdi', past:'sėdėjo', ru:'сидеть', g:'eti'},
  {inf:'gulėti', pres:'guli', past:'gulėjo', ru:'лежать', g:'eti'},
  {inf:'tylėti', pres:'tyli', past:'tylėjo', ru:'молчать', g:'eti'},
  {inf:'tikėti', pres:'tiki', past:'tikėjo', ru:'верить', g:'eti'},

  /* ---- -ėti с настоящим на -a ---- */
  {inf:'kalbėti', pres:'kalba', past:'kalbėjo', ru:'говорить', g:'eti'},
  {inf:'mokėti', pres:'moka', past:'mokėjo', ru:'уметь; платить', g:'eti', t:1},
  {inf:'skaudėti', pres:'skauda', past:'skaudėjo', ru:'болеть (о боли)', g:'eti'},
  {inf:'skambėti', pres:'skamba', past:'skambėjo', ru:'звучать', g:'eti'},

  /* ---- -ėti «становиться» ---- */
  {inf:'tobulėti', pres:'tobulėja', past:'tobulėjo', ru:'совершенствоваться', g:'eti-eja'},
  {inf:'greitėti', pres:'greitėja', past:'greitėjo', ru:'ускоряться', g:'eti-eja'},
  {inf:'lėtėti', pres:'lėtėja', past:'lėtėjo', ru:'замедляться', g:'eti-eja'},
  {inf:'gražėti', pres:'gražėja', past:'gražėjo', ru:'хорошеть', g:'eti-eja'},
  {inf:'gerėti', pres:'gerėja', past:'gerėjo', ru:'улучшаться', g:'eti-eja'},
  {inf:'blogėti', pres:'blogėja', past:'blogėjo', ru:'ухудшаться', g:'eti-eja'},
  {inf:'didėti', pres:'didėja', past:'didėjo', ru:'увеличиваться', g:'eti-eja'},
  {inf:'mažėti', pres:'mažėja', past:'mažėjo', ru:'уменьшаться', g:'eti-eja'},
  {inf:'ilgėti', pres:'ilgėja', past:'ilgėjo', ru:'удлиняться', g:'eti-eja'},
  {inf:'trumpėti', pres:'trumpėja', past:'trumpėjo', ru:'укорачиваться', g:'eti-eja'},
  {inf:'stiprėti', pres:'stiprėja', past:'stiprėjo', ru:'крепнуть', g:'eti-eja'},
  {inf:'silpnėti', pres:'silpnėja', past:'silpnėjo', ru:'слабеть', g:'eti-eja'},
  {inf:'šiltėti', pres:'šiltėja', past:'šiltėjo', ru:'теплеть', g:'eti-eja'},
  {inf:'tamsėti', pres:'tamsėja', past:'tamsėjo', ru:'темнеть', g:'eti-eja'},
  {inf:'šviesėti', pres:'šviesėja', past:'šviesėjo', ru:'светлеть', g:'eti-eja'},
  {inf:'sunkėti', pres:'sunkėja', past:'sunkėjo', ru:'становиться тяжелее', g:'eti-eja'},
  {inf:'lengvėti', pres:'lengvėja', past:'lengvėjo', ru:'становиться легче', g:'eti-eja'},
  {inf:'švarėti', pres:'švarėja', past:'švarėjo', ru:'становиться чище', g:'eti-eja'},
  {inf:'brangėti', pres:'brangėja', past:'brangėjo', ru:'дорожать', g:'eti-eja'},
  {inf:'senėti', pres:'senėja', past:'senėjo', ru:'стареть', g:'eti-eja'},

  /* ---- -auti / -uoti ---- */
  {inf:'fotografuoti', pres:'fotografuoja', past:'fotografavo', ru:'фотографировать', g:'auti', t:1},
  {inf:'planuoti', pres:'planuoja', past:'planavo', ru:'планировать', g:'auti', t:1},
  {inf:'matuoti', pres:'matuoja', past:'matavo', ru:'мерить', g:'auti', t:1},
  {inf:'šukuoti', pres:'šukuoja', past:'šukavo', ru:'расчёсывать', g:'auti', t:1},
  {inf:'bučiuoti', pres:'bučiuoja', past:'bučiavo', ru:'целовать', g:'auti', t:1},
  {inf:'klijuoti', pres:'klijuoja', past:'klijavo', ru:'клеить', g:'auti', t:1},
  {inf:'rikiuoti', pres:'rikiuoja', past:'rikiavo', ru:'выстраивать', g:'auti', t:1},
  {inf:'rūšiuoti', pres:'rūšiuoja', past:'rūšiavo', ru:'сортировать', g:'auti', t:1},
  {inf:'vairuoti', pres:'vairuoja', past:'vairavo', ru:'водить машину', g:'auti', t:1},
  {inf:'montuoti', pres:'montuoja', past:'montavo', ru:'монтировать', g:'auti', t:1},
  {inf:'remontuoti', pres:'remontuoja', past:'remontavo', ru:'ремонтировать', g:'auti', t:1},
  {inf:'kopijuoti', pres:'kopijuoja', past:'kopijavo', ru:'копировать', g:'auti', t:1},
  {inf:'projektuoti', pres:'projektuoja', past:'projektavo', ru:'проектировать', g:'auti', t:1},
  {inf:'reaguoti', pres:'reaguoja', past:'reagavo', ru:'реагировать', g:'auti', t:1},
  {inf:'diskutuoti', pres:'diskutuoja', past:'diskutavo', ru:'обсуждать', g:'auti', t:1},
  {inf:'registruoti', pres:'registruoja', past:'registravo', ru:'регистрировать', g:'auti', t:1},
  {inf:'komentuoti', pres:'komentuoja', past:'komentavo', ru:'комментировать', g:'auti', t:1},
  {inf:'kontroliuoti', pres:'kontroliuoja', past:'kontroliavo', ru:'контролировать', g:'auti', t:1},
  {inf:'informuoti', pres:'informuoja', past:'informavo', ru:'информировать', g:'auti', t:1},
  {inf:'ignoruoti', pres:'ignoruoja', past:'ignoravo', ru:'игнорировать', g:'auti', t:1},
  {inf:'treniruoti', pres:'treniruoja', past:'treniravo', ru:'тренировать', g:'auti', t:1},
  {inf:'dekoruoti', pres:'dekoruoja', past:'dekoravo', ru:'декорировать', g:'auti', t:1},
  {inf:'ragauti', pres:'ragauja', past:'ragavo', ru:'пробовать на вкус', g:'auti', t:1},
  {inf:'draugauti', pres:'draugauja', past:'draugavo', ru:'дружить', g:'auti', t:1},
  {inf:'bendrauti', pres:'bendrauja', past:'bendravo', ru:'общаться', g:'auti'},
  {inf:'dalyvauti', pres:'dalyvauja', past:'dalyvavo', ru:'участвовать', g:'auti'},
  {inf:'dainuoti', pres:'dainuoja', past:'dainavo', ru:'петь', g:'auti', t:1},
  {inf:'keliauti', pres:'keliauja', past:'keliavo', ru:'путешествовать', g:'auti'},
  {inf:'važiuoti', pres:'važiuoja', past:'važiavo', ru:'ехать', g:'auti'},
  {inf:'studijuoti', pres:'studijuoja', past:'studijavo', ru:'учиться (в вузе)', g:'auti', t:1},
  {inf:'sportuoti', pres:'sportuoja', past:'sportavo', ru:'заниматься спортом', g:'auti'},
  {inf:'meluoti', pres:'meluoja', past:'melavo', ru:'врать', g:'auti'},
  {inf:'kainuoti', pres:'kainuoja', past:'kainavo', ru:'стоить', g:'auti'},
  {inf:'juokauti', pres:'juokauja', past:'juokavo', ru:'шутить', g:'auti'},
  {inf:'skaičiuoti', pres:'skaičiuoja', past:'skaičiavo', ru:'считать', g:'auti', t:1},
  {inf:'organizuoti', pres:'organizuoja', past:'organizavo', ru:'организовывать', g:'auti', t:1},

  /* ---- -oti ---- */
  {inf:'saugoti', pres:'saugo', past:'saugojo', ru:'беречь, охранять', g:'oti', t:1},
  {inf:'naudoti', pres:'naudoja', past:'naudojo', ru:'использовать', g:'oti', t:1},
  {inf:'svajoti', pres:'svajoja', past:'svajojo', ru:'мечтать', g:'oti', t:1},
  {inf:'pasakoti', pres:'pasakoja', past:'pasakojo', ru:'рассказывать', g:'oti', t:1},
  {inf:'medžioti', pres:'medžioja', past:'medžiojo', ru:'охотиться', g:'oti', t:1},
  {inf:'kloti', pres:'kloja', past:'klojo', ru:'стелить', g:'oti', t:1},
  {inf:'dėkoti', pres:'dėkoja', past:'dėkojo', ru:'благодарить', g:'oti', c:'naudininkas · kam?'},
  {inf:'galvoti', pres:'galvoja', past:'galvojo', ru:'думать', g:'oti'},
  {inf:'dovanoti', pres:'dovanoja', past:'dovanojo', ru:'дарить', g:'oti', t:1},
  {inf:'kartoti', pres:'kartoja', past:'kartojo', ru:'повторять', g:'oti', t:1},
  {inf:'vaikščioti', pres:'vaikščioja', past:'vaikščiojo', ru:'ходить', g:'oti'},
  {inf:'nešioti', pres:'nešioja', past:'nešiojo', ru:'носить', g:'oti', t:1},
  {inf:'ieškoti', pres:'ieško', past:'ieškojo', ru:'искать', g:'oti', c:'kilmininkas · ko?'},
  {inf:'bijoti', pres:'bijo', past:'bijojo', ru:'бояться', g:'oti', c:'kilmininkas · ko?'},
  {inf:'miegoti', pres:'miega', past:'miegojo', ru:'спать', g:'oti'},
  {inf:'žinoti', pres:'žino', past:'žinojo', ru:'знать', g:'oti', t:1},

  /* ---- бунтари внутри -yti: -y- здесь часть корня, а не суффикс ---- */
  {inf:'gyti', pres:'gyja', past:'gijo', ru:'заживать, выздоравливать', g:'yti-x'},
  {inf:'ryti', pres:'ryja', past:'rijo', ru:'глотать', g:'yti-x', t:1},
  {inf:'dalyti', pres:'dalija', past:'dalijo', ru:'делить, раздавать', g:'yti-x', t:1},
  /* ---- основа меняется ---- */
  {inf:'būti', pres:'yra', past:'buvo', ru:'быть', g:'kinta',
   irrPres:['esu', 'esi', 'yra', 'esame', 'esate', 'yra'],
   irrPart:{ actPres:['esantis', 'esanti'], actPast:['buvęs'],
             pasPres:null, pasPast:null,
             pusdal:['būdamas', 'būdama'], padal:'esant' }},
  {inf:'eiti', pres:'eina', past:'ėjo', ru:'идти', g:'kinta'},
  {inf:'duoti', pres:'duoda', past:'davė', ru:'давать', g:'kinta', t:1},
  {inf:'imti', pres:'ima', past:'ėmė', ru:'брать', g:'kinta', t:1},
  {inf:'dirbti', pres:'dirba', past:'dirbo', ru:'работать', g:'kinta'},
  {inf:'gerti', pres:'geria', past:'gėrė', ru:'пить', g:'kinta', t:1},
  {inf:'pirkti', pres:'perka', past:'pirko', ru:'покупать', g:'kinta', t:1},
  {inf:'nešti', pres:'neša', past:'nešė', ru:'нести', g:'kinta', t:1},
  {inf:'vežti', pres:'veža', past:'vežė', ru:'везти', g:'kinta', t:1},
  {inf:'vesti', pres:'veda', past:'vedė', ru:'вести', g:'kinta', t:1},
  {inf:'mesti', pres:'meta', past:'metė', ru:'бросать', g:'kinta', t:1},
  {inf:'kelti', pres:'kelia', past:'kėlė', ru:'поднимать', g:'kinta', t:1},
  {inf:'dėti', pres:'deda', past:'dėjo', ru:'класть', g:'kinta', t:1},
  {inf:'rasti', pres:'randa', past:'rado', ru:'находить', g:'kinta', t:1},
  {inf:'suprasti', pres:'supranta', past:'suprato', ru:'понимать', g:'kinta', t:1},
  {inf:'keisti', pres:'keičia', past:'keitė', ru:'менять', g:'kinta', t:1},
  {inf:'kviesti', pres:'kviečia', past:'kvietė', ru:'приглашать', g:'kinta', t:1},
  {inf:'leisti', pres:'leidžia', past:'leido', ru:'пускать, разрешать', g:'kinta', t:1},
  {inf:'jausti', pres:'jaučia', past:'jautė', ru:'чувствовать', g:'kinta', t:1},
  {inf:'klausti', pres:'klausia', past:'klausė', ru:'спрашивать', g:'kinta'},
  {inf:'laukti', pres:'laukia', past:'laukė', ru:'ждать', g:'kinta', c:'kilmininkas · ko?'},
  {inf:'baigti', pres:'baigia', past:'baigė', ru:'заканчивать', g:'kinta', t:1},
  {inf:'plauti', pres:'plauna', past:'plovė', ru:'мыть', g:'kinta', t:1},
  {inf:'pjauti', pres:'pjauna', past:'pjovė', ru:'резать', g:'kinta', t:1},
  {inf:'gauti', pres:'gauna', past:'gavo', ru:'получать', g:'kinta', t:1},
  {inf:'augti', pres:'auga', past:'augo', ru:'расти', g:'kinta'},
  {inf:'bėgti', pres:'bėga', past:'bėgo', ru:'бежать', g:'kinta'},
  {inf:'lipti', pres:'lipa', past:'lipo', ru:'лезть, подниматься', g:'kinta'},
  {inf:'kristi', pres:'krinta', past:'krito', ru:'падать', g:'kinta'},
  {inf:'pažinti', pres:'pažįsta', past:'pažino', ru:'быть знакомым, узнавать', g:'kinta', t:1},
  {inf:'pamiršti', pres:'pamiršta', past:'pamiršo', ru:'забывать', g:'kinta', t:1}
];

/* ============================================================
   4b. ПРОСТРАНСТВО

   Всё, что мы видим вокруг, можно назвать, описать и направить
   на это действие. Здесь лежат предметы с их формой galininkas,
   прилагательные в обоих родах и русские формы — без них нельзя
   честно составить задание на перевод.
   ============================================================ */

/* Лицо: литовское местоимение и русское. */
var PRON = [
  {lt:'aš',  ru:'я'},   {lt:'tu',  ru:'ты'},  {lt:'jis', ru:'он'},
  {lt:'mes', ru:'мы'},  {lt:'jūs', ru:'вы'},  {lt:'jie', ru:'они'}
];

/* Предметы вокруг. p — jis/ji/jie/jos в литовском, rg — род в русском
   (m / f / n / p), потому что роды в двух языках не совпадают:
   kėdė женское, а «стул» мужской. */
var SPACE_OBJ = [
  {lt:'langas',      acc:'langą',        p:'jis', ru:'окно',      ra:'окно',      rg:'n', v:['matyti','atidaryti','uždaryti','valyti','plauti','dažyti']},
  {lt:'durys',       acc:'duris',        p:'jos', ru:'дверь',     ra:'дверь',     rg:'f', pl:1, v:['matyti','atidaryti','uždaryti','dažyti']},
  {lt:'stalas',      acc:'stalą',        p:'jis', ru:'стол',      ra:'стол',      rg:'m', v:['matyti','valyti','taisyti','statyti','dažyti']},
  {lt:'kėdė',        acc:'kėdę',         p:'ji',  ru:'стул',      ra:'стул',      rg:'m', v:['matyti','taisyti','statyti','dažyti','valyti']},
  {lt:'knyga',       acc:'knygą',        p:'ji',  ru:'книга',     ra:'книгу',     rg:'f', v:['skaityti','matyti','laikyti','rodyti','pirkti','dovanoti']},
  {lt:'laiškas',     acc:'laišką',       p:'jis', ru:'письмо',    ra:'письмо',    rg:'n', v:['rašyti','skaityti','matyti','rodyti']},
  {lt:'telefonas',   acc:'telefoną',     p:'jis', ru:'телефон',   ra:'телефон',   rg:'m', v:['matyti','laikyti','taisyti','pirkti','rodyti','valyti']},
  {lt:'kompiuteris', acc:'kompiuterį',   p:'jis', ru:'компьютер', ra:'компьютер', rg:'m', v:['matyti','taisyti','pirkti','valyti']},
  {lt:'kava',        acc:'kavą',         p:'ji',  ru:'кофе',      ra:'кофе',      rg:'m', v:['gerti','pirkti','šildyti','gaminti']},
  {lt:'arbata',      acc:'arbatą',       p:'ji',  ru:'чай',       ra:'чай',       rg:'m', v:['gerti','pirkti','šildyti','gaminti']},
  {lt:'vanduo',      acc:'vandenį',      p:'jis', ru:'вода',      ra:'воду',      rg:'f', v:['gerti','šildyti','matyti']},
  {lt:'pienas',      acc:'pieną',        p:'jis', ru:'молоко',    ra:'молоко',    rg:'n', v:['gerti','šildyti','pirkti']},
  {lt:'duona',       acc:'duoną',        p:'ji',  ru:'хлеб',      ra:'хлеб',      rg:'m', v:['valgyti','pirkti','pjauti','laikyti']},
  {lt:'obuolys',     acc:'obuolį',       p:'jis', ru:'яблоко',    ra:'яблоко',    rg:'n', v:['valgyti','pirkti','pjauti','matyti']},
  {lt:'sriuba',      acc:'sriubą',       p:'ji',  ru:'суп',       ra:'суп',       rg:'m', v:['gaminti','valgyti','šildyti']},
  {lt:'namas',       acc:'namą',         p:'jis', ru:'дом',       ra:'дом',       rg:'m', v:['statyti','matyti','dažyti','tvarkyti','pirkti']},
  {lt:'kambarys',    acc:'kambarį',      p:'jis', ru:'комната',   ra:'комнату',   rg:'f', v:['tvarkyti','valyti','matyti','dažyti']},
  {lt:'siena',       acc:'sieną',        p:'ji',  ru:'стена',     ra:'стену',     rg:'f', v:['dažyti','matyti','valyti']},
  {lt:'grindys',     acc:'grindis',      p:'jos', ru:'пол',       ra:'пол',       rg:'m', pl:1, v:['plauti','valyti','matyti']},
  {lt:'lova',        acc:'lovą',         p:'ji',  ru:'кровать',   ra:'кровать',   rg:'f', v:['tvarkyti','matyti','statyti']},
  {lt:'veidrodis',   acc:'veidrodį',     p:'jis', ru:'зеркало',   ra:'зеркало',   rg:'n', v:['valyti','matyti','plauti']},
  {lt:'lempa',       acc:'lempą',        p:'ji',  ru:'лампа',     ra:'лампу',     rg:'f', v:['matyti','pirkti','valyti','taisyti']},
  {lt:'puodelis',    acc:'puodelį',      p:'jis', ru:'чашка',     ra:'чашку',     rg:'f', v:['plauti','laikyti','matyti','pirkti']},
  {lt:'lėkštė',      acc:'lėkštę',       p:'ji',  ru:'тарелка',   ra:'тарелку',   rg:'f', v:['plauti','laikyti','matyti']},
  {lt:'peilis',      acc:'peilį',        p:'jis', ru:'нож',       ra:'нож',       rg:'m', v:['laikyti','plauti','matyti']},
  {lt:'raktas',      acc:'raktą',        p:'jis', ru:'ключ',      ra:'ключ',      rg:'m', v:['laikyti','matyti','rasti']},
  {lt:'gėlė',        acc:'gėlę',         p:'ji',  ru:'цветок',    ra:'цветок',    rg:'m', v:['dovanoti','pirkti','matyti','laikyti']},
  {lt:'katė',        acc:'katę',         p:'ji',  ru:'кошка',     ra:'кошку',     rg:'f', v:['matyti','laikyti','mylėti']},
  {lt:'šuo',         acc:'šunį',         p:'jis', ru:'собака',    ra:'собаку',    rg:'f', v:['matyti','mylėti','laikyti']},
  {lt:'mašina',      acc:'mašiną',       p:'ji',  ru:'машина',    ra:'машину',    rg:'f', v:['taisyti','plauti','pirkti','matyti']},
  {lt:'batai',       acc:'batus',        p:'jie', ru:'ботинки',   ra:'ботинки',   rg:'p', pl:1, v:['valyti','pirkti','matyti','taisyti']},
  {lt:'marškiniai',  acc:'marškinius',   p:'jie', ru:'рубашка',   ra:'рубашку',   rg:'f', pl:1, v:['dažyti','pirkti','matyti','plauti']},
  {lt:'muzika',      acc:'muziką',       p:'ji',  ru:'музыка',    ra:'музыку',    rg:'f', v:['girdėti','mylėti']}
];

/* Прилагательные для образа. Литовские формы galininkas — по роду
   и числу предмета; русские — по роду русского слова. */
var SPACE_ADJ = [
  {k:'naujas',    nom:['naujas', 'nauja', 'nauji', 'naujos'], lt:['naują','naują','naujus','naujas'],           ru:['новый','новую','новое','новые']},
  {k:'senas',     nom:['senas', 'sena', 'seni', 'senos'], lt:['seną','seną','senus','senas'],               ru:['старый','старую','старое','старые']},
  {k:'didelis',   nom:['didelis', 'didelė', 'dideli', 'didelės'], lt:['didelį','didelę','didelius','dideles'],      ru:['большой','большую','большое','большие']},
  {k:'mažas',     nom:['mažas', 'maža', 'maži', 'mažos'], lt:['mažą','mažą','mažus','mažas'],               ru:['маленький','маленькую','маленькое','маленькие']},
  {k:'gražus',    nom:['gražus', 'graži', 'gražūs', 'gražios'], lt:['gražų','gražią','gražius','gražias'],        ru:['красивый','красивую','красивое','красивые']},
  {k:'švarus',    nom:['švarus', 'švari', 'švarūs', 'švarios'], lt:['švarų','švarią','švarius','švarias'],        ru:['чистый','чистую','чистое','чистые']},
  {k:'šiltas',    nom:['šiltas', 'šilta', 'šilti', 'šiltos'], lt:['šiltą','šiltą','šiltus','šiltas'],           ru:['тёплый','тёплую','тёплое','тёплые']},
  {k:'šaltas',    nom:['šaltas', 'šalta', 'šalti', 'šaltos'], lt:['šaltą','šaltą','šaltus','šaltas'],           ru:['холодный','холодную','холодное','холодные']},
  {k:'baltas',    nom:['baltas', 'balta', 'balti', 'baltos'], lt:['baltą','baltą','baltus','baltas'],           ru:['белый','белую','белое','белые']},
  {k:'juodas',    nom:['juodas', 'juoda', 'juodi', 'juodos'], lt:['juodą','juodą','juodus','juodas'],           ru:['чёрный','чёрную','чёрное','чёрные']},
  {k:'medinis',   nom:['medinis', 'medinė', 'mediniai', 'medinės'], lt:['medinį','medinę','medinius','medines'],      ru:['деревянный','деревянную','деревянное','деревянные']},
  {k:'stiklinis', nom:['stiklinis', 'stiklinė', 'stikliniai', 'stiklinės'], lt:['stiklinį','stiklinę','stiklinius','stiklines'], ru:['стеклянный','стеклянную','стеклянное','стеклянные']},
  {k:'skanus',    nom:['skanus', 'skani', 'skanūs', 'skanios'], lt:['skanų','skanią','skanius','skanias'],        ru:['вкусный','вкусную','вкусное','вкусные']},
  {k:'įdomus',    nom:['įdomus', 'įdomi', 'įdomūs', 'įdomios'], lt:['įdomų','įdomią','įdomius','įdomias'],        ru:['интересный','интересную','интересное','интересные']}
];

/* Русские личные формы глаголов — только для тех, что участвуют
   в предметных заданиях. Русский спрягается нерегулярно, поэтому
   формы записаны прямо, а не выведены. */
var RU_VERB = {
  matyti:     ['вижу','видишь','видит','видим','видите','видят'],
  atidaryti:  ['открываю','открываешь','открывает','открываем','открываете','открывают'],
  uždaryti:   ['закрываю','закрываешь','закрывает','закрываем','закрываете','закрывают'],
  valyti:     ['чищу','чистишь','чистит','чистим','чистите','чистят'],
  plauti:     ['мою','моешь','моет','моем','моете','моют'],
  gerti:      ['пью','пьёшь','пьёт','пьём','пьёте','пьют'],
  valgyti:    ['ем','ешь','ест','едим','едите','едят'],
  skaityti:   ['читаю','читаешь','читает','читаем','читаете','читают'],
  rašyti:     ['пишу','пишешь','пишет','пишем','пишете','пишут'],
  laikyti:    ['держу','держишь','держит','держим','держите','держат'],
  pirkti:     ['покупаю','покупаешь','покупает','покупаем','покупаете','покупают'],
  dažyti:     ['крашу','красишь','красит','красим','красите','красят'],
  taisyti:    ['чиню','чинишь','чинит','чиним','чините','чинят'],
  statyti:    ['ставлю','ставишь','ставит','ставим','ставите','ставят'],
  gaminti:    ['готовлю','готовишь','готовит','готовим','готовите','готовят'],
  šildyti:    ['грею','греешь','греет','греем','греете','греют'],
  pjauti:     ['режу','режешь','режет','режем','режете','режут'],
  dovanoti:   ['дарю','даришь','дарит','дарим','дарите','дарят'],
  rodyti:     ['показываю','показываешь','показывает','показываем','показываете','показывают'],
  tvarkyti:   ['убираю','убираешь','убирает','убираем','убираете','убирают'],
  mylėti:     ['люблю','любишь','любит','любим','любите','любят'],
  girdėti:    ['слышу','слышишь','слышит','слышим','слышите','слышат'],
  rasti:      ['нахожу','находишь','находит','находим','находите','находят']
};

/* Индекс литовской формы прилагательного по предмету:
   0 — мужское ед., 1 — женское ед., 2 — мужское мн., 3 — женское мн. */
function adjSlotLT(o){
  if (o.pl) return o.p === 'jie' ? 2 : 3;
  return o.p === 'jis' ? 0 : 1;
}
/* Индекс русской формы: 0 — м., 1 — ж., 2 — ср., 3 — мн. */
function adjSlotRU(o){
  return o.rg === 'm' ? 0 : o.rg === 'f' ? 1 : o.rg === 'n' ? 2 : 3;
}

/* Собирает фразу «кто + действие + какой предмет» на двух языках
   и разбирает её по словам. */
function buildPhrase(o, verbInf, pi, adjKey){
  var v = VERBS.filter(function(x){ return x.inf === verbInf; })[0];
  var c = conjugate(v);
  var a = adjKey ? SPACE_ADJ.filter(function(x){ return x.k === adjKey; })[0] : null;
  var ci = cityOf(v.pres);

  var ltAdj = a ? a.lt[adjSlotLT(o)] : '';
  var ruAdj = a ? a.ru[adjSlotRU(o)] : '';
  var lt = c.pres[pi] + ' ' + (ltAdj ? ltAdj + ' ' : '') + o.acc;
  var ru = PRON[pi].ru + ' ' + RU_VERB[verbInf][pi] + ' ' + (ruAdj ? ruAdj + ' ' : '') + o.ra;

  var parts = [
    {w: c.pres[pi],
     e: v.inf + ' (' + v.ru + ') — ' + ci.n + ', ' + PERSONS[pi] + '. Основа ' + v.pres.slice(0, -1) + '-.'}
  ];
  if (a) parts.push({w: ltAdj,
     e: 'предмет ' + o.lt + ' — это ' + o.p + (o.pl ? ' (только множественное)' : '') + ', поэтому в vardininkas было бы ' + a.nom[adjSlotLT(o)] + ', а в galininkas — ' + ltAdj + '.'});
  parts.push({w: o.acc,
     e: o.lt + ' (' + o.ru + ') → ' + o.acc + '. Действие переходит на предмет, поэтому galininkas: ką? — ' + o.acc + '.'});

  return {
    lt: lt.charAt(0).toUpperCase() + lt.slice(1) + '.',
    ru: ru.charAt(0).toUpperCase() + ru.slice(1) + '.',
    bare: lt,
    withPron: PRON[pi].lt + ' ' + lt,
    parts: parts,
    obj: o, verb: v, pi: pi, adj: a
  };
}

/* ============================================================
   5. ПРИСТАВКИ
   ============================================================ */
var PREFIXES = [
  {p:'į-', img:'ВНУТРЬ',
   d:'Действие уходит внутрь объекта — и часто внутрь состояния.',
   go:'įeiti', gru:'войти', run:'įbėgti', rru:'вбежать',
   prep:'į', pcase:'galininkas · ką?', pex:'įeiti į kambarį', pexru:'войти в комнату',
   br:[{n:'внутрь физически', ex:'įeiti į namą', ru:'войти в дом'},
       {n:'вложить, вписать', ex:'įdėti · įrašyti', ru:'вложить · записать на носитель'},
       {n:'вход в состояние', ex:'įsimylėti · įmigti', ru:'влюбиться · заснуть'}]},

  {p:'iš-', img:'ИЗНУТРИ НАРУЖУ → ДО КОНЦА',
   d:'Сначала наружу, а потом — исчерпать действие до конца.',
   go:'išeiti', gru:'выйти', run:'išbėgti', rru:'выбежать',
   prep:'iš', pcase:'kilmininkas · ko?', pex:'išeiti iš namų', pexru:'выйти из дома',
   br:[{n:'наружу', ex:'išeiti iš kambario', ru:'выйти из комнаты'},
       {n:'до конца, исчерпать', ex:'išgerti · išmokti · išvalyti', ru:'выпить · выучить · вычистить'},
       {n:'раздать по всем', ex:'išdalyti', ru:'раздать'}]},

  {p:'pri-', img:'ПРИБЛИЗИТЬСЯ → НАКОПИТЬ ДО ГРАНИЦЫ',
   d:'Был далеко — приблизился — достиг точки. А дальше: накапливал, пока не хватило.',
   go:'prieiti', gru:'подойти', run:'pribėgti', rru:'подбежать',
   prep:'prie', pcase:'kilmininkas · ko?', pex:'prieiti prie lango', pexru:'подойти к окну',
   br:[{n:'приблизиться', ex:'prieiti prie žmogaus', ru:'подойти к человеку'},
       {n:'накопить, наполнить', ex:'pripilti · prirašyti', ru:'налить доверху · написать много'},
       {n:'насытиться', ex:'prisivalgyti', ru:'наесться'},
       {n:'прикрепить', ex:'prisegti', ru:'приколоть, прикрепить'}]},

  {p:'nu-', img:'ПРОЧЬ, ВНИЗ, ОТДЕЛЕНИЕ',
   d:'Уйти от точки, снять с поверхности, довести до результата.',
   go:'nueiti', gru:'уйти, дойти', run:'nubėgti', rru:'убежать, добежать',
   prep:'nuo', pcase:'kilmininkas · ko?', pex:'nueiti nuo lango', pexru:'отойти от окна',
   br:[{n:'прочь, вниз', ex:'nueiti nuo kelio', ru:'сойти с дороги'},
       {n:'снять, удалить', ex:'nuimti · nuvalyti', ru:'снять · вытереть'},
       {n:'довести до результата', ex:'nupirkti · nudažyti', ru:'купить · покрасить'}]},

  {p:'per-', img:'ЧЕРЕЗ → ЦЕЛИКОМ → ЗАНОВО → СВЕРХ',
   d:'Четыре ветви, и все растут из одной: пересечь объект насквозь.',
   go:'pereiti', gru:'перейти', run:'perbėgti', rru:'перебежать',
   prep:'per', pcase:'galininkas · ką?', pex:'pereiti per gatvę', pexru:'перейти через улицу',
   br:[{n:'через, с одной стороны на другую', ex:'pereiti per tiltą', ru:'перейти через мост'},
       {n:'целиком, до конца', ex:'perskaityti', ru:'прочитать от начала до конца'},
       {n:'заново', ex:'perrašyti · perdaryti', ru:'переписать · переделать'},
       {n:'сверх нормы', ex:'persivalgyti', ru:'переесть'}]},

  {p:'pra-', img:'МИМО, СКВОЗЬ → ПРОЙТИ ОТРЕЗОК → НАЧАТЬ',
   d:'Пройти мимо объекта — или сквозь целый отрезок времени.',
   go:'praeiti', gru:'пройти мимо', run:'prabėgti', rru:'пробежать мимо',
   prep:'pro', pcase:'galininkas · ką?', pex:'praeiti pro namą', pexru:'пройти мимо дома',
   br:[{n:'мимо', ex:'praeiti pro langą', ru:'пройти мимо окна'},
       {n:'пройти сквозь период', ex:'pragyventi dešimt metų', ru:'прожить десять лет'},
       {n:'начать', ex:'prakalbėti · pražysti', ru:'заговорить · расцвести'},
       {n:'упустить, потерять', ex:'prarasti · pramiegoti', ru:'потерять · проспать'}]},

  {p:'ap-', img:'ВОКРУГ → ОХВАТ',
   d:'Действие идёт вокруг объекта или по всей его поверхности.',
   go:'apeiti', gru:'обойти', run:'apibėgti', rru:'обежать',
   prep:'aplink', pcase:'galininkas · ką?', pex:'apeiti aplink namą', pexru:'обойти вокруг дома',
   br:[{n:'вокруг', ex:'apeiti namą', ru:'обойти дом'},
       {n:'охватить целиком', ex:'apkabinti · apsirengti', ru:'обнять · одеться'},
       {n:'по поверхности', ex:'apdažyti', ru:'покрасить снаружи'},
       {n:'слегка, частично', ex:'apšilti', ru:'немного согреться'}]},

  {p:'at-', img:'К ТОЧКЕ, СЮДА → ОБРАТНОЕ ДЕЙСТВИЕ',
   d:'Движение к нам — и отдельная ветвь: действие наоборот.',
   go:'ateiti', gru:'прийти', run:'atbėgti', rru:'прибежать',
   prep:'—', pcase:'своего предлога нет', pex:'ateiti į svečius', pexru:'прийти в гости',
   br:[{n:'сюда, к точке отсчёта', ex:'ateiti · atnešti', ru:'прийти · принести'},
       {n:'обратное действие', ex:'atidaryti · atsegti · atimti', ru:'открыть · отстегнуть · отнять'},
       {n:'ответное действие', ex:'atsakyti', ru:'ответить'}]},

  {p:'par-', img:'ОБРАТНО К СВОЕЙ ТОЧКЕ',
   d:'Не просто «сюда», а домой, туда, откуда вышли. Отдельная от at- идея.',
   go:'pareiti', gru:'вернуться пешком', run:'parbėgti', rru:'прибежать обратно',
   prep:'—', pcase:'своего предлога нет', pex:'pareiti namo', pexru:'вернуться домой',
   br:[{n:'вернуться', ex:'pareiti · parvažiuoti · parskristi', ru:'вернуться пешком · на транспорте · прилететь'},
       {n:'принести обратно', ex:'parnešti · parvežti', ru:'принести · привезти домой'},
       {n:'отдать другому', ex:'parduoti', ru:'продать'}]},

  {p:'su-', img:'ВМЕСТЕ → В ОДНО ЦЕЛОЕ',
   d:'Разные части сходятся в одну точку и становятся целым. Отсюда — результат.',
   go:'sueiti', gru:'сойтись, собраться', run:'subėgti', rru:'сбежаться',
   prep:'su', pcase:'įnagininkas · kuo?', pex:'susitikti su draugu', pexru:'встретиться с другом',
   br:[{n:'вместе, в одну точку', ex:'sueiti · susitikti', ru:'сойтись · встретиться'},
       {n:'соединить, сложить', ex:'sujungti · sudėti · surinkti', ru:'соединить · сложить · собрать'},
       {n:'результат', ex:'suprasti · suvalgyti · sutaisyti', ru:'понять · съесть · починить'}]},

  {p:'už-', img:'ЗА ГРАНИЦУ → ЗАКРЫТЬ → НОВАЯ ФАЗА',
   d:'Пересечь границу и оказаться в новом состоянии.',
   go:'užeiti', gru:'зайти', run:'užbėgti', rru:'забежать',
   prep:'už', pcase:'kilmininkas · ko?', pex:'užeiti už namo', pexru:'зайти за дом',
   br:[{n:'за, зайти', ex:'užeiti pas draugą', ru:'зайти к другу'},
       {n:'закрыть, застегнуть', ex:'uždaryti · užsegti', ru:'закрыть · застегнуть'},
       {n:'начало состояния', ex:'užmigti · uždainuoti', ru:'уснуть · запеть'},
       {n:'зафиксировать', ex:'užrašyti', ru:'записать'}]},

  {p:'pa-', img:'ОГРАНИЧИТЬ ДЕЙСТВИЕ',
   d:'Самая многоликая. Ставит действию рамку — по времени, по количеству или по результату.',
   go:'paeiti', gru:'немного пройти', run:'pabėgti', rru:'убежать',
   prep:'pas', pcase:'galininkas · ką?', pex:'nueiti pas gydytoją', pexru:'сходить к врачу',
   br:[{n:'немного, недолго', ex:'paskaityti · pamiegoti', ru:'почитать · поспать'},
       {n:'результат', ex:'padaryti · pamatyti · parašyti', ru:'сделать · увидеть · написать'},
       {n:'под', ex:'padėti · pakišti', ru:'положить · подсунуть'}]}
];

/* Один глагол движения и все двенадцать стрелок. */
var MOTION = [
  {p:'į-',   v:'įeiti',   ru:'войти'},        {p:'iš-',  v:'išeiti',  ru:'выйти'},
  {p:'at-',  v:'ateiti',  ru:'прийти'},       {p:'nu-',  v:'nueiti',  ru:'уйти, дойти'},
  {p:'par-', v:'pareiti', ru:'вернуться'},    {p:'pri-', v:'prieiti', ru:'подойти'},
  {p:'per-', v:'pereiti', ru:'перейти'},      {p:'pra-', v:'praeiti', ru:'пройти мимо'},
  {p:'ap-',  v:'apeiti',  ru:'обойти'},       {p:'su-',  v:'sueiti',  ru:'сойтись'},
  {p:'už-',  v:'užeiti',  ru:'зайти'},        {p:'pa-',  v:'paeiti',  ru:'немного пройти'}
];

/* Приставочные глаголы, у которых значение уже не выводится из формулы. */
var LEXICAL = [
  {v:'atsakyti',  ru:'ответить',        from:'sakyti — говорить',   why:'от «сказать к точке отсчёта» осталось только «ответить». Пространственная стрелка уже не помогает.'},
  {v:'parduoti',  ru:'продать',         from:'duoti — давать',      why:'par- «обратно» плюс «дать» дало отдельное слово: отдать за деньги.'},
  {v:'suprasti',  ru:'понять',          from:'rasti — находить',    why:'«собрать вместе и найти» стало «понять». Формулой не вывести.'},
  {v:'atidaryti', ru:'открыть',         from:'daryti — делать',     why:'обратное действие к «закрыть», но связь с «делать» уже не чувствуется.'},
  {v:'pasakoti',  ru:'рассказывать',    from:'sakyti — говорить',   why:'отдельная лексема со своим спряжением: pasakoja, pasakojo.'},
  {v:'prarasti',  ru:'потерять',        from:'rasti — находить',    why:'приставка перевернула значение основы в противоположное.'},
  {v:'užmigti',   ru:'уснуть',          from:'migti — засыпать',    why:'už- маркирует не «за», а вход в новую фазу — сон.'},
  {v:'įsimylėti', ru:'влюбиться',       from:'mylėti — любить',     why:'į- «внутрь» плюс -si-: войти внутрь состояния любви.'}
];

/* Элементы другого происхождения: они не словообразовательные приставки. */
var PARTICLES = [
  {p:'ne-',   n:'отрицание',                    ex:'neturiu',      ru:'у меня нет'},
  {p:'nebe-', n:'было и прекратилось',          ex:'nebeturiu',    ru:'у меня больше нет'},
  {p:'be-',   n:'действие ещё продолжается',    ex:'tebeturiu',    ru:'у меня всё ещё есть'},
  {p:'te-',   n:'только, лишь',                 ex:'teturiu vieną', ru:'у меня только один'},
  {p:'tebe-', n:'всё ещё, до сих пор',          ex:'tebedirba',    ru:'всё ещё работает'}
];

/* ============================================================
   6. ТЕМЫ ДЛЯ СВОИХ ПРЕДЛОЖЕНИЙ
   ============================================================ */
var THEMES = [
  {t:'Моё утро', d:'Что вы делаете каждое утро? Настоящее время, 1-е лицо.', hint:'keliuosi, geriu, skaitau, važiuoju'},
  {t:'Вчерашний день', d:'Три предложения о вчера. Прошедшее однократное.', hint:'dirbau, valgiau, skaičiau'},
  {t:'Когда я был ребёнком', d:'Что вы делали регулярно? Прошедшее многократное на -davo.', hint:'skaitydavau, žaisdavau, eidavau'},
  {t:'Завтра', d:'Три плана. Будущее время.', hint:'pirksiu, važiuosiu, rašysiu'},
  {t:'Если бы', d:'Условное наклонение: что бы вы сделали.', hint:'skaityčiau, keliaučiau, pirkčiau'},
  {t:'Просьба', d:'Три просьбы кому-то. Повелительное наклонение.', hint:'skaityk, atidaryk, palauk'},
  {t:'Моя кухня', d:'Что вы готовите и из чего. Переходные глаголы + galininkas.', hint:'gaminu sriubą, pjaunu daržoves'},
  {t:'Уборка', d:'Что вы моете, чистите, приводите в порядок.', hint:'valau langą, plaunu indus, tvarkau kambarį'},
  {t:'Погода меняется', d:'Глаголы на -ėti: что становится каким.', hint:'oras gerėja, dienos ilgėja, temsta'},
  {t:'Я делаю это лучше', d:'Пара -ėti / -inti: что происходит само и что делаете вы.', hint:'sveikata gerėja — aš gerinu sveikatą'},
  {t:'Работа', d:'Чем вы занимаетесь. Настоящее и прошедшее.', hint:'dirbu, rašau, organizuoju, tikrinu'},
  {t:'Семья', d:'Кто что делает. Третье лицо.', hint:'mama gamina, brolis dirba, sesė skaito'},
  {t:'Покупки', d:'Что вы покупаете и сколько это стоит.', hint:'perku duoną, kainuoja, mokusi'},
  {t:'Дорога', d:'Как вы добираетесь. Глаголы движения с приставками.', hint:'išeinu, važiuoju, pareinu, ateinu'},
  {t:'Книга', d:'Что вы читаете и о чём она.', hint:'skaitau knygą, perskaičiau, pasakoja'},
  {t:'Разговор', d:'Кто что сказал. kalbėti, sakyti, klausti, atsakyti.', hint:'jis pasakė, aš paklausiau'},
  {t:'Тело и здоровье', d:'Что болит, что лечат, что укрепляют.', hint:'skauda galvą, gydau, stiprinu'},
  {t:'Дом', d:'Что вы строите, чините, красите, вешаете.', hint:'statau, taisau, dažau, kabinu'},
  {t:'Планы на год', d:'Будущее время, много глаголов.', hint:'studijuosiu, keliausiu, mokysiuosi'},
  {t:'Что я умею', d:'mokėti и galėti с инфинитивом.', hint:'moku plaukti, galiu padėti'},
  {t:'Чего я хочу', d:'norėti требует kilmininkas или инфинитива.', hint:'noriu kavos, noriu keliauti'},
  {t:'Чего я боюсь', d:'bijoti требует kilmininkas.', hint:'bijau šuns, bijau tamsos'},
  {t:'Подарки', d:'dovanoti: кому что дарите.', hint:'dovanoju mamai gėlių'},
  {t:'Мой день с приставками', d:'Один глагол, шесть приставок. Как меняется смысл.', hint:'einu, ateinu, išeinu, pareinu, nueinu, praeinu'}
];

/* ============================================================
   7. ИНДЕКС ВСЕХ ФОРМ — для разбора того, что вы написали сами
   ============================================================ */
var TENSES = [
  {k:'pres',  n:'настоящее',              lt:'esamasis laikas'},
  {k:'past',  n:'прошедшее однократное',  lt:'būtasis kartinis laikas'},
  {k:'often', n:'прошедшее многократное', lt:'būtasis dažninis laikas'},
  {k:'fut',   n:'будущее',                lt:'būsimasis laikas'},
  {k:'cond',  n:'условное наклонение',    lt:'tariamoji nuosaka'}
];
var IMPER_P = ['tu', 'mes', 'jūs'];

var INDEX = null;
function buildIndex(){
  if (INDEX) return INDEX;
  INDEX = {};
  function put(form, rec){
    var key = flat(form);
    if (!INDEX[key]) INDEX[key] = [];
    INDEX[key].push(rec);
  }
  VERBS.forEach(function(v){
    var c = conjugate(v);
    TENSES.forEach(function(t){
      c[t.k].forEach(function(f, i){
        put(f, { v: v, form: f, what: t.n, who: PERSONS[i] });
      });
    });
    c.imper.forEach(function(f, i){
      put(f, { v: v, form: f, what: 'повелительное наклонение', who: IMPER_P[i] });
    });
    put(v.inf, { v: v, form: v.inf, what: 'инфинитив', who: '—' });
    put(c.part.padal, { v: v, form: c.part.padal, what: 'деепричастие', who: '—' });
    c.part.actPres.forEach(function(f){ put(f, { v: v, form: f, what: 'действительное причастие настоящего', who: '—' }); });
    c.part.actPast.forEach(function(f){ put(f, { v: v, form: f, what: 'действительное причастие прошедшего', who: '—' }); });
    c.part.pusdal.forEach(function(f){ put(f, { v: v, form: f, what: 'полупричастие', who: '—' }); });
    if (c.part.pasPres) c.part.pasPres.forEach(function(f){ put(f, { v: v, form: f, what: 'страдательное причастие настоящего', who: '—' }); });
    if (c.part.pasPast) c.part.pasPast.forEach(function(f){ put(f, { v: v, form: f, what: 'страдательное причастие прошедшего', who: '—' }); });
  });
  return INDEX;
}

/* Разбирает написанное предложение: находит глагольные формы. */
function analyse(text){
  var ix = buildIndex();
  var words = norm(text).split(' ').filter(Boolean);
  var found = [], unknown = [];
  words.forEach(function(w){
    var bare = w.replace(/^ne/, '');
    var hit = ix[flat(w)] || (w !== bare ? ix[flat(bare)] : null);
    if (hit) found.push({ word: w, neg: !ix[flat(w)], recs: hit });
    else unknown.push(w);
  });
  return { found: found, unknown: unknown, words: words.length };
}

/* ============================================================
   8. СХЕМЫ ГРУПП
   ============================================================ */
function renderSchemas(host){
  FAMILIES.forEach(function(f){
    var list = VERBS.filter(function(v){ return v.g === f.k; });
    var card = el('section', 'sch ' + REL[f.rel][1]);
    card.id = 'g-' + f.k;

    var head = el('div', 'sch-head');
    head.appendChild(el('h3', 'sch-t', f.n));
    head.appendChild(el('span', 'sch-badge', REL[f.rel][0]));
    card.appendChild(head);

    var route = el('div', 'sch-f');
    route.textContent = f.route;
    card.appendChild(route);

    card.appendChild(el('p', 'sch-d', f.d));

    var rows = el('div', 'sch-rows');
    function row(a, b){
      var r = el('div', 'sch-row');
      r.appendChild(el('b', null, a));
      r.appendChild(el('span', null, b));
      rows.appendChild(r);
    }
    row('Что делаем с инфинитивом', f.stem);
    row('Город настоящего', f.city ? CITY[f.city].n + ' · окончания ' + CITY[f.city].ends
                                   : 'по инфинитиву не угадать — смотрим третье лицо');
    row('Дом прошедшего', f.house ? HOUSE[f.house].n + ' · окончания ' + HOUSE[f.house].ends
                                  : 'по инфинитиву не угадать — смотрим третье лицо');
    row('Пример', f.ex + '  —  ' + f.exru);
    card.appendChild(rows);

    if (f.note) {
      var nb = el('p', 'sch-note');
      nb.innerHTML = f.note;
      card.appendChild(nb);
    }

    var chips = el('div', 'chips');
    list.forEach(function(v){
      var c = el('button', 'chip-v');
      c.type = 'button';
      c.appendChild(el('b', null, v.inf));
      c.appendChild(el('span', null, v.ru));
      c.addEventListener('click', function(){ openDetail(v.inf, true); });
      chips.appendChild(c);
    });
    var cap = el('p', 'sch-cap', 'В базе этой семьи: ' + list.length +
                 '. Нажмите на глагол — откроется полный разбор.');
    card.appendChild(cap);
    card.appendChild(chips);
    host.appendChild(card);
  });
}

/* Пара «сделать таким» / «стать таким» — словообразование, переходность
   и падеж объясняются одной таблицей. */
function renderPairs(host){
  var wrap = el('div', 'wb-wrap');
  var t = el('table', 'wb');
  var thead = el('thead'), tr = el('tr');
  ['Прилагательное', 'Перевод', '-inti · сделать таким', 'Что значит',
   '-ėti · стать таким', 'Что значит'].forEach(function(x){ tr.appendChild(el('th', null, x)); });
  thead.appendChild(tr); t.appendChild(thead);
  var tb = el('tbody');
  PAIRS.forEach(function(x){
    var r = el('tr');
    r.appendChild(el('td', 'w', x.adj));
    r.appendChild(el('td', 'g', x.adjru));
    r.appendChild(el('td', 'f', x.inti));
    r.appendChild(el('td', 'g', x.intiru + (x.inti !== '—' ? ' · ką?' : '')));
    r.appendChild(el('td', 'acc', x.eti));
    r.appendChild(el('td', 'g', x.etiru + (x.eti !== '—' ? ' · kas?' : '')));
    tb.appendChild(r);
  });
  t.appendChild(tb); wrap.appendChild(t);
  host.appendChild(wrap);
}

/* ============================================================
   9. ПОЛНАЯ ТАБЛИЦА ОДНОГО ГЛАГОЛА
   ============================================================ */
function conjTable(v){
  var c = conjugate(v);
  var wrap = el('div', 'ct');

  var head = el('div', 'ct-head');
  var h = el('div');
  var hv = el('p', 'ct-v');
  hv.appendChild(el('b', null, v.inf));
  hv.appendChild(el('span', null, ' — ' + v.ru));
  h.appendChild(hv);
  var f = famOf(v), ci = cityOf(v.pres), ho = houseOf(v.past);
  h.appendChild(el('p', 'ct-g', f.n + ' · ' + (v.t ? 'переходный, зовёт ką?'
                                                  : (v.c ? 'зовёт ' + v.c : 'непереходный'))));
  var rt = el('p', 'ct-route');
  rt.appendChild(el('b', null, v.inf));
  rt.appendChild(el('span', null, ' → '));
  rt.appendChild(el('b', null, ci.n));
  rt.appendChild(el('span', null, ' → '));
  rt.appendChild(el('b', null, ho.n));
  h.appendChild(rt);
  head.appendChild(h);
  wrap.appendChild(head);

  /* три главные формы */
  var main = el('div', 'ct-main');
  [['Bendratis', v.inf, 'инфинитив · семья ' + f.n.replace('Семья ', '')],
   ['Esamasis · jis', v.pres, '3-е лицо настоящего · ' + ci.n + ' (' + ci.lt + ')'],
   ['Būtasis kartinis · jis', v.past, '3-е лицо прошедшего · ' + ho.n + ' (' + ho.lt + ')']].forEach(function(m){
    var d = el('div');
    d.appendChild(el('span', 'ct-lbl', m[0]));
    d.appendChild(el('b', null, m[1]));
    d.appendChild(el('span', 'ct-sub', m[2]));
    main.appendChild(d);
  });
  wrap.appendChild(main);
  wrap.appendChild(el('p', 'ct-hint', 'Всё, что ниже, выведено из этих трёх форм. Больше про этот глагол помнить не нужно.'));

  /* времена по лицам */
  var tw = el('div', 'ct-wrap');
  var table = el('table', 'ct-tab');
  var thead = el('thead'), tr = el('tr');
  tr.appendChild(el('th', null, 'Кто'));
  TENSES.forEach(function(t){
    var th = el('th');
    th.appendChild(el('b', null, t.n));
    th.appendChild(el('span', null, t.lt));
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);
  var tbody = el('tbody');
  PERSONS.forEach(function(p, i){
    var r = el('tr');
    r.appendChild(el('td', 'ct-p', p));
    TENSES.forEach(function(t){
      r.appendChild(el('td', 'ct-f', c[t.k][i]));
    });
    tbody.appendChild(r);
  });
  table.appendChild(tbody);
  tw.appendChild(table);
  wrap.appendChild(tw);

  /* остальные формы */
  var more = el('div', 'ct-more');
  function add(label, val, note){
    var d = el('div', 'ct-mrow');
    d.appendChild(el('b', null, label));
    d.appendChild(el('span', 'ct-mval', val));
    if (note) d.appendChild(el('span', 'ct-mnote', note));
    more.appendChild(d);
  }
  add('Повелительное', c.imper.join(' · '), 'tu · mes · jūs');
  add('Действительное причастие настоящего', c.part.actPres.join(' · '), 'jis · ji');
  add('Действительное причастие прошедшего', c.part.actPast.join(' · '), 'мужская форма');
  add('Страдательное причастие настоящего', c.part.pasPres ? c.part.pasPres.join(' · ') : '—',
      c.part.pasPres ? 'jis · ji' : 'у непереходного глагола такой формы нет');
  add('Страдательное причастие прошедшего', c.part.pasPast ? c.part.pasPast.join(' · ') : '—',
      c.part.pasPast ? 'jis · ji' : 'у непереходного глагола такой формы нет');
  add('Полупричастие', c.part.pusdal.join(' · '), 'pusdalyvis · jis · ji');
  add('Деепричастие', c.part.padal, 'padalyvis');
  wrap.appendChild(more);

  return wrap;
}

/* ============================================================
   10. БАЗА ГЛАГОЛОВ
   ============================================================ */
function renderBase(host){
  var search = document.createElement('input');
  search.className = 'vb-search';
  search.type = 'search';
  search.setAttribute('placeholder', 'Поиск: literally или по-русски — skait, читать, -inti…');
  search.setAttribute('aria-label', 'Поиск по базе глаголов');

  var filters = el('div', 'vb-tabs');
  var cur = 'all';
  var wrap = el('div', 'wb-wrap');
  var count = el('p', 'wb-count');

  function paint(){
    var v = flat(search.value);
    wrap.textContent = '';
    var table = el('table', 'wb');
    var thead = el('thead'), tr = el('tr');
    ['Bendratis', 'Esamasis · jis', 'Būtasis · jis', 'Город', 'Дом', 'Семья', 'Кого зовёт', 'Перевод', ''].forEach(function(x){
      tr.appendChild(el('th', null, x));
    });
    thead.appendChild(tr);
    table.appendChild(thead);
    var tbody = el('tbody'), shown = 0;
    VERBS.forEach(function(x){
      if (cur !== 'all' && x.g !== cur) return;
      var f = famOf(x), ci = cityOf(x.pres), ho = houseOf(x.past);
      var hay = flat([x.inf, x.pres, x.past, x.ru, f.n, '-' + x.g, ci.n, ho.n].join(' '));
      if (v && hay.indexOf(v) === -1) return;
      shown++;
      var r = el('tr');
      r.appendChild(el('td', 'w', x.inf));
      r.appendChild(el('td', 'f', x.pres));
      r.appendChild(el('td', 'f', x.past));
      r.appendChild(el('td', 'city c-' + ci.k, ci.n));
      r.appendChild(el('td', 'city h-' + ho.k, ho.n));
      r.appendChild(el('td', 'g', f.n.replace('Семья ', '')));
      r.appendChild(el('td', 'acc', x.t ? 'ką? · galininkas' : (x.c || '—')));
      r.appendChild(el('td', 'g', x.ru));
      var td = el('td');
      var b = el('button', 'vb-open', 'Разбор');
      b.type = 'button';
      b.addEventListener('click', function(){ openDetail(x.inf, true); });
      td.appendChild(b);
      r.appendChild(td);
      tbody.appendChild(r);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    count.textContent = (v || cur !== 'all')
      ? (shown ? 'Показано глаголов: ' + shown + ' из ' + VERBS.length : 'Ничего не найдено')
      : 'Всего в базе: ' + VERBS.length + ' глаголов · у каждого виден город настоящего и дом прошедшего';
  }

  [{ k:'all', n:'Все' }].concat(FAMILIES.map(function(g){ return { k:g.k, n:g.n.replace('Семья ', '') }; })).forEach(function(f){
    var b = el('button', null, f.n);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(f.k === cur));
    b.addEventListener('click', function(){
      cur = f.k;
      Array.prototype.forEach.call(filters.children, function(c){
        c.setAttribute('aria-pressed', String(c === b));
      });
      paint();
    });
    filters.appendChild(b);
  });
  search.addEventListener('input', paint);

  host.appendChild(filters);
  host.appendChild(search);
  host.appendChild(wrap);
  host.appendChild(count);
  paint();
}

/* ============================================================
   11. ПОДРОБНЫЙ РАЗБОР
   ============================================================ */
var detailHost = null, detailPick = null;  /* detailPick — инфинитив выбранного глагола */
var repaintPick = null;                    /* перерисовать чипы выбора */
var backTo = null;                         /* куда вернуться после прыжка к разбору */

/* Разбор живёт в своём разделе, а нажимают на глагол за много экранов
   отсюда — из карточки семьи или из базы. Поэтому после открытия
   переносим к нему экран и оставляем кнопку «назад». */
function jumpToDetail(){
  var host = document.getElementById('vk-detail');
  if (!host) return;
  var from = window.scrollY;
  var to = host.getBoundingClientRect().top + window.scrollY - 12;
  var far = Math.abs(to - from) > window.innerHeight * 3;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  backTo = from;
  try { window.scrollTo({ top: to, behavior: (far || still) ? 'auto' : 'smooth' }); }
  catch (e) { window.scrollTo(0, to); }
  host.classList.remove('flash');
  void host.offsetWidth;          /* перезапускаем подсветку */
  host.classList.add('flash');
}

function openDetail(inf, jump){
  if (!detailHost) return;
  var v = VERBS.filter(function(x){ return x.inf === inf; })[0];
  if (!v) return;
  detailPick = inf;
  detailHost.textContent = '';

  if (jump) {
    var back = el('button', 'det-back');
    back.type = 'button';
    back.textContent = '← Вернуться туда, где нажали';
    back.addEventListener('click', function(){
      if (backTo == null) return;
      try { window.scrollTo({ top: backTo, behavior: 'smooth' }); }
      catch (e) { window.scrollTo(0, backTo); }
    });
    detailHost.appendChild(back);
  }

  detailHost.appendChild(conjTable(v));
  var g = famOf(v);
  if (g) {
    var steps = el('div', 'steps-lt');
    var c = conjugate(v), ci = cityOf(v.pres), ho = houseOf(v.past);
    var stem = v.inf.replace(/ti$/, '');
    [['Шаг 1 · стабильный или бунтарь',
      g.rel === 'none'
        ? 'Бунтарь. По инфинитиву ни город, ни дом не угадываются, поэтому три формы здесь и нужны: ' + v.inf + ' · ' + v.pres + ' · ' + v.past + '.'
        : g.n + '. ' + (g.rel === 'full' ? 'Маршрут известен целиком: ' + g.route + '.'
                                         : 'Дорога в прошлое известна, город настоящего проверяем по третьему лицу.')],
     ['Шаг 2 · где живёт сейчас',
      '«' + v.pres + '» кончается на ' + (/o$/.test(v.pres) ? '-o' : /i$/.test(v.pres) ? '-i' : '-a') +
      ', значит ' + ci.n + ' (' + ci.lt + '). Основа ' + ci_stem(v.pres) + '-, окончания ' + ci.ends + '.'],
     ['Шаг 3 · где живёт в прошлом',
      '«' + v.past + '» кончается на ' + (/ė$/.test(v.past) ? '-ė' : '-o') +
      ', значит ' + ho.n + ' (' + ho.lt + '). Основа ' + v.past.slice(0, -1) + '-, окончания ' + ho.ends + '.'],
     ['Шаг 4 · маршрут глагола', routeOf(v) + '. Это и есть всё, что нужно помнить.'],
     ['Шаг 5 · остальные три формы',
      'Они берутся от инфинитива и от города с домом не зависят: ' + stem + '- плюс -s- даёт будущее ' + c.fut[0] +
      ', плюс -dav- даёт многократное ' + c.often[0] + ', плюс -čiau даёт условное ' + c.cond[0] + '.'],
     ['Шаг 6 · падеж дополнения',
      v.t ? 'Переходный: действие переходит на объект, поэтому зовёт galininkas. ' + c.pres[0] + ' ką? — например, knygą (книгу).'
          : (v.c ? 'Зовёт не galininkas, а ' + v.c + '. Русский здесь подсказывает неверно — эту помету стоит запомнить вместе со словом.'
                 : 'Непереходный: действие остаётся при подлежащем, направлять его не на что. Вопрос kas? — кто или что делает.')]
    ].forEach(function(x){
      var d = el('div', 'step-lt');
      d.appendChild(el('b', null, x[0]));
      d.appendChild(el('p', null, x[1]));
      steps.appendChild(d);
    });
    detailHost.appendChild(steps);
  }
  if (repaintPick) repaintPick();
  if (jump) jumpToDetail();
}

/* ============================================================
   12. ПРАКТИКА

   Задания собираются из самой парадигмы, поэтому неверных ответов
   в них не бывает по построению. Неверные варианты — это тоже
   настоящие формы того же глагола, только из другой клетки таблицы:
   так видно не «мимо», а куда именно вы попали.
   ============================================================ */
function pick(arr, n, seed){
  var out = [], used = {}, i = 0, k = seed;
  while (out.length < n && i < 200) {
    k = (k * 1103515245 + 12345) & 0x7fffffff;
    var j = k % arr.length;
    if (!used[j]) { used[j] = 1; out.push(arr[j]); }
    i++;
  }
  return out;
}

function makeTask(v, ti, pi, seed){
  var c = conjugate(v);
  var right = c[TENSES[ti].k][pi];
  var pool = [];
  TENSES.forEach(function(t, a){
    t && c[t.k].forEach(function(f, b){
      if (f === right) return;
      pool.push({ f: f, what: TENSES[a].n, who: PERSONS[b] });
    });
  });
  /* оставляем только уникальные написания */
  var seen = {}, uniq = [];
  pool.forEach(function(o){ if (!seen[o.f]) { seen[o.f] = 1; uniq.push(o); } });

  var wrong = pick(uniq, 3, seed);
  var opts = wrong.map(function(o){
    return { t: o.f, ok: 0, w: 'Это тоже форма глагола ' + v.inf + ', но другая клетка: ' + o.what + ', ' + o.who + '.' };
  });
  opts.splice(seed % 4, 0, {
    t: right, ok: 1,
    w: TENSES[ti].n + ' (' + TENSES[ti].lt + '), ' + PERSONS[pi] + '. ' + explain(v, ti)
  });

  return {
    q: '<b>' + v.inf + '</b> <i>(' + v.ru + ')</i> → ' + TENSES[ti].n + ', <b>' + PERSONS[pi] + '</b>',
    hint: 'Три главные формы: ' + v.inf + ' · ' + v.pres + ' · ' + v.past,
    ans: [right],
    rule: explain(v, ti),
    opts: opts
  };
}
function explain(v, ti){
  var c = conjugate(v);
  if (TENSES[ti].k === 'pres')  return 'Основа настоящего ' + c.presInfo.stem + '- (из формы ' + v.pres + '), окончания ' + c.presInfo.ends + '.';
  if (TENSES[ti].k === 'past')  return 'Основа прошедшего ' + c.pastInfo.stem + '- (из формы ' + v.past + '), окончания ' + c.pastInfo.ends + '.';
  if (TENSES[ti].k === 'often') return 'От инфинитива: ' + v.inf.replace(/ti$/, '') + '- плюс -dav- и окончания -au · -ai · -o · -ome · -ote · -o.';
  if (TENSES[ti].k === 'fut')   return 'От инфинитива: ' + v.inf.replace(/ti$/, '') + '- плюс -s- и окончания -iu · -i · — · -ime · -ite · —.';
  return 'От инфинитива: ' + v.inf.replace(/ti$/, '') + '- плюс -čiau · -tum · -tų · -tume · -tumėte · -tų.';
}

/* Задание другого типа: не «поставь форму», а «определи адрес».
   Именно этим начинается работа с новым глаголом. */
function cityTask(v, seed){
  var ci = cityOf(v.pres), ho = houseOf(v.past);
  var opts = [
    {t:'город A', ok: ci.k === 'I',   w:'Город A — третье лицо кончается на -a: ' + (ci.k === 'I' ? v.pres + '. Верно.' : 'а у «' + v.pres + '» окончание другое.')},
    {t:'город I', ok: ci.k === 'II',  w:'Город I — третье лицо кончается на -i: ' + (ci.k === 'II' ? v.pres + '. Верно.' : 'а у «' + v.pres + '» окончание другое.')},
    {t:'город O', ok: ci.k === 'III', w:'Город O — третье лицо кончается на -o: ' + (ci.k === 'III' ? v.pres + '. Верно.' : 'а у «' + v.pres + '» окончание другое.')}
  ];
  return {
    q: 'В каком городе живёт <b>' + v.inf + '</b> <i>(' + v.ru + ')</i> в настоящем времени?',
    hint: 'Третье лицо настоящего: ' + v.pres + '. Смотрим на его последнюю букву.',
    ans: [ci.n],
    rule: 'Город определяется по третьему лицу: -a → город A, -i → город I, -o → город O. Дальше маршрут: ' + routeOf(v) + '.',
    opts: opts
  };
}

/* Задание на приставку: дан образ — какая стрелка? */
function taskPrefix(seed){
  var r = rnd(seed);
  var i = r(PREFIXES.length);
  var pf = PREFIXES[i];
  var opts = [{t: pf.go, ok: 1, w: pf.p + ' — образ «' + pf.img + '». Отсюда ' + pf.go + ' — ' + pf.gru + '.'}];
  var used = { }; used[i] = 1;
  while (opts.length < 4) {
    var j = r(PREFIXES.length);
    if (used[j]) continue;
    used[j] = 1;
    opts.push({t: PREFIXES[j].go, ok: 0,
      w: PREFIXES[j].p + ' — это «' + PREFIXES[j].img + '», отсюда ' + PREFIXES[j].go + ' (' + PREFIXES[j].gru + '). Не то направление.'});
  }
  var k = r(4);
  var tmp = opts[0]; opts[0] = opts[k]; opts[k] = tmp;
  return {
    q: 'Какая приставка даёт значение <b>«' + pf.gru + '»</b> глаголу <b>eiti</b> <i>(идти)</i>?',
    hint: 'Ищите стрелку: ' + pf.img.toLowerCase() + '.',
    ans: [pf.go],
    rule: pf.p + ' → ' + pf.img + '. ' + pf.d,
    opts: opts
  };
}

/* Задание на связку «приставка + предлог + падеж». */
function taskPrepCase(seed){
  var r = rnd(seed + 5);
  var withPrep = PREFIXES.filter(function(x){ return x.prep !== '—'; });
  var pf = withPrep[r(withPrep.length)];
  var opts = [{t: pf.prep, ok: 1, w: 'Верно: ' + pf.p + ' в глаголе и ' + pf.prep + ' перед объектом — одна пара. ' + pf.pex + ' — ' + pf.pexru + '.'}];
  var seen = {}; seen[pf.prep] = 1;
  withPrep.forEach(function(x){
    if (opts.length >= 4 || seen[x.prep]) return;
    seen[x.prep] = 1;
    opts.push({t: x.prep, ok: 0, w: x.prep + ' идёт с приставкой ' + x.p + ': ' + x.pex + ' — ' + x.pexru + '.'});
  });
  return {
    q: 'Дополните: <b>' + pf.go + '</b> <i>(' + pf.gru + ')</i> … <b>' + pf.pex.split(' ').slice(-1)[0] + '</b>',
    hint: 'Приставка уже показала стрелку. Предлог показывает, относительно какого объекта эта стрелка направлена.',
    ans: [pf.prep],
    rule: 'Приставка даёт направление, предлог с падежом — точку отсчёта: ' + pf.prep + ' + ' + pf.pcase + '.',
    opts: opts
  };
}

function buildTasks(groupKey, n){
  var list = VERBS.filter(function(v){ return groupKey === 'all' || v.g === groupKey; });
  var out = [];
  var seed = Date.now() % 9973;
  for (var i = 0; i < n; i++) {
    var v = list[(i * 7 + 3) % list.length];
    var kind = i % 7;
    /* семь типов по кругу: адрес, форма, направь действие, перевод,
       образ, приставка-стрелка, приставка с предлогом */
    if (kind === 0) { out.push(cityTask(v, i)); continue; }
    if (kind === 2) { out.push(taskDirect(seed + i * 137)); continue; }
    if (kind === 3) { out.push(taskTranslate(seed + i * 211)); continue; }
    if (kind === 4) { out.push(taskImage(seed + i * 307)); continue; }
    if (kind === 5) { out.push(taskPrefix(seed + i * 419)); continue; }
    if (kind === 6) { out.push(taskPrepCase(seed + i * 523)); continue; }
    /* шаг подобран так, чтобы времена не повторялись из подхода в подход */
    var ti = (i + Math.floor(i / 5) * 2) % TENSES.length;
    var pi = (i * 5 + 2) % PERSONS.length;
    out.push(makeTask(v, ti, pi, i * 31 + 7));
  }
  return out;
}

function renderPractice(host){
  var bar = el('div', 'vb-tabs');
  var stage = el('div');
  var cur = 'all';

  function fill(){
    stage.textContent = '';
    var items = buildTasks(cur, 12);
    var card = el('section', 'trainer');
    var head = el('div', 'tr-head');
    var left = el('div');
    left.appendChild(el('h3', 'tr-t', 'Двенадцать форм подряд'));
    left.appendChild(el('p', 'tr-sub', 'Задания собраны из самой парадигмы. Неверные варианты — настоящие формы этого же глагола из других клеток, поэтому после ответа видно не просто «мимо», а куда именно вы попали.'));
    head.appendChild(left);
    var modes = el('div', 'modes');
    var mode = 'choice';
    ['choice', 'text'].forEach(function(m){
      var b = el('button', null, m === 'choice' ? 'Выбрать вариант' : 'Вписать ответ');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(m === mode));
      b.addEventListener('click', function(){
        if (mode === m) return;
        mode = m;
        Array.prototype.forEach.call(modes.children, function(c){ c.setAttribute('aria-pressed', String(c === b)); });
        draw();
      });
      modes.appendChild(b);
    });
    head.appendChild(modes);
    card.appendChild(head);

    var list = el('div');
    card.appendChild(list);
    var foot = el('div', 'tr-foot');
    var score = el('p', 'tr-score');
    var again = el('button', 'tr-again', 'Другие двенадцать');
    again.type = 'button';
    again.addEventListener('click', fill);
    foot.appendChild(score);
    foot.appendChild(again);
    card.appendChild(foot);

    var done, ok;
    function draw(){
      list.textContent = '';
      done = 0; ok = 0;
      score.innerHTML = 'Отвечено: <b>0 / ' + items.length + '</b>';
      items.forEach(function(item, i){
        list.appendChild(taskNode(item, i, items.length, mode, function(good){
          done++; if (good) ok++;
          score.innerHTML = 'Отвечено: <b>' + done + ' / ' + items.length + '</b> · без ошибок: <b>' + ok + '</b>';
        }));
      });
    }
    draw();
    stage.appendChild(card);
  }

  [{ k:'all', n:'Все семьи' }].concat(FAMILIES.map(function(g){ return { k:g.k, n:g.n.replace('Семья ', '') }; })).forEach(function(f){
    var b = el('button', null, f.n);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(f.k === cur));
    b.addEventListener('click', function(){
      cur = f.k;
      Array.prototype.forEach.call(bar.children, function(c){ c.setAttribute('aria-pressed', String(c === b)); });
      fill();
    });
    bar.appendChild(b);
  });

  host.appendChild(bar);
  host.appendChild(stage);
  fill();
}

/* одно задание */
function taskNode(item, idx, total, mode, onDone){
  var wrap = el('div', 'tq');
  wrap.appendChild(el('span', 'tq-n', 'Задание ' + (idx + 1) + ' из ' + total));
  var q = el('p', 'tq-q');
  q.innerHTML = item.q;
  wrap.appendChild(q);
  var h = el('p', 'tq-hint');
  h.appendChild(el('b', null, 'Подсказка: '));
  h.appendChild(document.createTextNode(item.hint));
  wrap.appendChild(h);

  var verdict = el('div', 'tq-verdict');
  var why = el('div', 'tq-why');
  why.appendChild(el('b', null, item.opts && item.opts.length ? 'Разбор всех вариантов' : 'Разбор'));
  var ul = el('ul', 'wl');
  (item.opts || []).forEach(function(o){
    var li = el('li');
    li.appendChild(el('span', 'mk ' + (o.ok ? 'y' : 'n'), o.ok ? 'верно' : 'мимо'));
    var body = el('div');
    body.appendChild(el('span', 'wt', o.t));
    body.appendChild(el('span', 'wd', o.w));
    li.appendChild(body);
    ul.appendChild(li);
  });
  if (item.opts && item.opts.length) why.appendChild(ul);

  if (item.bd) {
    var bh = el('b', null, 'Фраза по словам');
    bh.style.marginTop = item.opts && item.opts.length ? '12px' : '0';
    why.appendChild(bh);
    var bl = el('ul', 'bd');
    item.bd.forEach(function(x){
      var li = el('li');
      li.appendChild(el('b', null, x.w));
      li.appendChild(el('span', null, x.e));
      bl.appendChild(li);
    });
    why.appendChild(bl);
  }
  if (item.alt) why.appendChild(el('p', 'alt', item.alt));

  var r = el('p', 'alt');
  r.appendChild(el('b', null, 'Правило: '));
  r.appendChild(document.createTextNode(item.rule));
  why.appendChild(r);

  var closed = false;
  function finish(state, msg, extra){
    if (closed) return;
    closed = true;
    verdict.className = 'tq-verdict show v-' + state;
    verdict.textContent = msg;
    if (extra) verdict.appendChild(el('span', null, extra));
    why.classList.add('show');
    onDone(state === 'ok');
  }

  if (mode === 'choice' && item.opts && item.opts.length) {
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
        finish(o.ok ? 'ok' : 'no', o.ok ? 'Верно.' : 'Мимо. Правильная форма — ' + item.ans[0] + '.', o.w);
      });
      opts.appendChild(b);
    });
    wrap.appendChild(opts);
  } else {
    var form = el('div', 'tq-form');
    var input = document.createElement('input');
    input.className = 'tq-in';
    input.setAttribute('placeholder', item.bd ? 'Напишите фразу по-литовски…' : 'Впишите форму…');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'Ваш ответ');
    var go = el('button', 'btn-go', 'Проверить');
    go.type = 'button';
    function check(){
      if (closed || !norm(input.value)) return;
      input.disabled = true; go.disabled = true;
      var exact = item.ans.some(function(a){ return norm(input.value) === norm(a); });
      var loose = item.ans.some(function(a){ return flat(input.value) === flat(a); });
      if (exact) { input.classList.add('ok'); finish('ok', 'Верно.', 'Эталон: ' + item.ans[0] + '.'); }
      else if (loose) { input.classList.add('near'); finish('near', 'Почти. Форма угадана, но потерялись литовские буквы.', 'Эталон: ' + item.ans[0] + '.'); }
      else {
        input.classList.add('no');
        var ix = buildIndex()[flat(input.value)];
        finish('no', 'Мимо. Правильно: ' + item.ans[0] + '.',
          ix ? 'То, что вы написали, — тоже настоящая форма: ' + ix[0].v.inf + ', ' + ix[0].what + ', ' + ix[0].who + '.' : null);
      }
    }
    go.addEventListener('click', check);
    input.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); check(); } });
    form.appendChild(input);
    form.appendChild(go);
    wrap.appendChild(form);
  }

  wrap.appendChild(verdict);
  wrap.appendChild(why);
  return wrap;
}

/* ============================================================
   12b. ЗАДАНИЯ ПО ПРОСТРАНСТВУ

   Три новых типа. Все собираются из базы предметов, поэтому эталон
   всегда верен, а неверные варианты — настоящие формы, только не те.
   ============================================================ */

/* Псевдослучайный, но воспроизводимый выбор: одинаковый набор
   заданий при одинаковом seed. */
function rnd(seed){ return function(n){ seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; }; }

function spaceTriple(seed){
  var r = rnd(seed);
  var o = SPACE_OBJ[r(SPACE_OBJ.length)];
  var vi = o.v[r(o.v.length)];
  var pi = r(6);
  return { o: o, vi: vi, pi: pi };
}

/* 1. Направь действие: дан предмет, действие и лицо — собери фразу. */
function taskDirect(seed){
  var t = spaceTriple(seed), r = rnd(seed + 11);
  var ph = buildPhrase(t.o, t.vi, t.pi, null);
  var v = ph.verb, c = conjugate(v);
  var wrongPi = (t.pi + 1 + r(5)) % 6;
  var opts = [
    {t: ph.bare, ok: 1,
     w: 'Действие в нужном лице (' + PERSONS[t.pi] + ') и предмет в galininkas: ' + t.o.acc + '.'},
    {t: c.pres[t.pi] + ' ' + t.o.lt, ok: 0,
     w: 'Предмет остался в vardininkas — он назван, но действие на него не направлено. После переходного глагола нужен ответ на ką?'},
    {t: c.pres[wrongPi] + ' ' + t.o.acc, ok: 0,
     w: 'Предмет верен, а глагол стоит в лице «' + PERSONS[wrongPi] + '», хотя нужно «' + PERSONS[t.pi] + '».'},
    {t: c.past[t.pi] + ' ' + t.o.acc, ok: 0,
     w: 'Это прошедшее время (' + houseOf(v.past).n + '), а спрашивали про настоящее.'}
  ];
  return {
    q: 'Вы видите: <b>' + t.o.lt + '</b> <i>(' + t.o.ru + ')</i>. Действие: <b>' + v.inf + '</b> <i>(' + v.ru + ')</i>. Кто: <b>' + PRON[t.pi].lt + '</b>.',
    hint: 'Три главные формы: ' + v.inf + ' · ' + v.pres + ' · ' + v.past + '. Предмет в galininkas: ' + t.o.acc + '.',
    ans: [ph.bare, ph.withPron],
    rule: 'Называем предмет → направляем на него действие → предмет уходит в galininkas.',
    opts: opts,
    bd: ph.parts,
    alt: 'Принимается и с местоимением: «' + ph.withPron + '».'
  };
}

/* 2. Перевод: русская фраза → литовская. Свободный ввод. */
function taskTranslate(seed){
  var t = spaceTriple(seed + 7), r = rnd(seed + 23);
  var useAdj = r(2) === 0;
  var adj = useAdj ? SPACE_ADJ[r(SPACE_ADJ.length)].k : null;
  var ph = buildPhrase(t.o, t.vi, t.pi, adj);
  return {
    q: 'Переведите на литовский: <b>' + ph.ru + '</b>',
    hint: 'Предмет: ' + t.o.lt + ' → ' + t.o.acc + '. Глагол: ' + ph.verb.inf + ' · ' + ph.verb.pres + ' · ' + ph.verb.past + '.',
    ans: [ph.bare, ph.withPron],
    rule: 'Сначала лицо и время у глагола, потом предмет в galininkas. Местоимение можно опустить — окончание уже показывает лицо.',
    bd: ph.parts,
    alt: 'Принимается и с местоимением, и без: «' + ph.bare + '» или «' + ph.withPron + '».',
    free: 1
  };
}

/* 3. Опиши и направь: с прилагательным — образ плюс действие. */
function taskImage(seed){
  var t = spaceTriple(seed + 3), r = rnd(seed + 41);
  var a = SPACE_ADJ[r(SPACE_ADJ.length)];
  var ph = buildPhrase(t.o, t.vi, t.pi, a.k);
  var wrongSlot = (adjSlotLT(t.o) + 1) % 4;
  var opts = [
    {t: ph.bare, ok: 1, w: 'Прилагательное согласовано с предметом (' + t.o.p + ') и оба слова в galininkas.'},
    {t: conjugate(ph.verb).pres[t.pi] + ' ' + a.lt[wrongSlot] + ' ' + t.o.acc, ok: 0,
     w: 'Предмет — ' + t.o.p + ', а прилагательное взято в другой форме: ' + a.lt[wrongSlot] + '. Форма прилагательного всегда идёт за предметом.'},
    {t: conjugate(ph.verb).pres[t.pi] + ' ' + a.nom[adjSlotLT(t.o)] + ' ' + t.o.acc, ok: 0,
     w: 'Прилагательное осталось в словарной форме (vardininkas), а предмет уже ушёл в galininkas. Уходят оба слова.'},
    {t: conjugate(ph.verb).pres[t.pi] + ' ' + a.lt[adjSlotLT(t.o)] + ' ' + t.o.lt, ok: 0,
     w: 'Наоборот: прилагательное в galininkas, а предмет остался в vardininkas.'}
  ];
  return {
    q: 'Опишите и направьте действие: <b>' + a.nom[adjSlotLT(t.o)] + ' ' + t.o.lt + '</b> <i>(' + a.ru[adjSlotRU(t.o)] + ' ' + t.o.ru + ')</i>. Действие: <b>' + ph.verb.inf + '</b>. Кто: <b>' + PRON[t.pi].lt + '</b>.',
    hint: 'Предмет ' + t.o.lt + ' — это ' + t.o.p + ', поэтому прилагательное стоит в форме ' + a.nom[adjSlotLT(t.o)] + '. Теперь оба слова отправляем в galininkas.',
    ans: [ph.bare, ph.withPron],
    rule: 'Предмет решает форму прилагательного, действие отправляет в galininkas оба слова сразу.',
    opts: opts,
    bd: ph.parts
  };
}

/* ============================================================
   12c. КОНСТРУКТОР: посмотрите вокруг
   ============================================================ */
function renderSpace(host){
  var state = { o: SPACE_OBJ[0], v: SPACE_OBJ[0].v[0], pi: 0, adj: null };

  function group(label, hint){
    var g = el('div', 'sp-group');
    var h = el('p', 'sp-lbl', label);
    if (hint) h.appendChild(el('span', null, ' ' + hint));
    g.appendChild(h);
    var row = el('div', 'sp-row');
    g.appendChild(row);
    return { node: g, row: row };
  }

  var gObj  = group('1 · Что вы видите вокруг', '— выберите предмет');
  var gAdj  = group('2 · Какой он', '— необязательно, но с образом запоминается лучше');
  var gVerb = group('3 · Что вы с ним делаете', '— действие');
  var gWho  = group('4 · Кто действует', '');
  var out   = el('div', 'sp-out');

  function chip(text, sub, active, on){
    var b = el('button', 'sp-chip' + (active ? ' on' : ''));
    b.type = 'button';
    b.appendChild(el('b', null, text));
    if (sub) b.appendChild(el('span', null, sub));
    b.addEventListener('click', on);
    return b;
  }

  function paintVerbs(){
    gVerb.row.textContent = '';
    state.o.v.forEach(function(vi){
      var v = VERBS.filter(function(x){ return x.inf === vi; })[0];
      gVerb.row.appendChild(chip(v.inf, v.ru, state.v === vi, function(){ state.v = vi; paint(); }));
    });
  }

  function paint(){
    gObj.row.textContent = '';
    SPACE_OBJ.forEach(function(o){
      gObj.row.appendChild(chip(o.lt, o.ru, state.o === o, function(){
        state.o = o;
        if (o.v.indexOf(state.v) === -1) state.v = o.v[0];
        paint();
      }));
    });

    gAdj.row.textContent = '';
    gAdj.row.appendChild(chip('без описания', '', state.adj === null, function(){ state.adj = null; paint(); }));
    SPACE_ADJ.forEach(function(a){
      gAdj.row.appendChild(chip(a.nom[adjSlotLT(state.o)], a.ru[adjSlotRU(state.o)], state.adj === a.k,
        function(){ state.adj = a.k; paint(); }));
    });

    paintVerbs();

    gWho.row.textContent = '';
    PRON.forEach(function(pr, i){
      gWho.row.appendChild(chip(pr.lt, pr.ru, state.pi === i, function(){ state.pi = i; paint(); }));
    });

    var ph = buildPhrase(state.o, state.v, state.pi, state.adj);
    out.textContent = '';
    out.appendChild(el('p', 'sp-ru', ph.ru));
    var lt = el('p', 'sp-lt');
    lt.textContent = ph.lt;
    out.appendChild(lt);
    var bd = el('ul', 'bd');
    ph.parts.forEach(function(x){
      var li = el('li');
      li.appendChild(el('b', null, x.w));
      li.appendChild(el('span', null, x.e));
      bd.appendChild(li);
    });
    out.appendChild(bd);
  }

  var card = el('section', 'trainer');
  var head = el('div', 'tr-head');
  var left = el('div');
  left.appendChild(el('h3', 'tr-t', 'Посмотрите вокруг себя'));
  left.appendChild(el('p', 'tr-sub', 'Возьмите любой предмет, который видите прямо сейчас. Назовите его, опишите, направьте на него действие — и посмотрите, что получилось и почему.'));
  head.appendChild(left);
  card.appendChild(head);
  [gObj, gAdj, gVerb, gWho].forEach(function(g){ card.appendChild(g.node); });
  card.appendChild(out);
  host.appendChild(card);
  paint();
}

/* ============================================================
   13. МОИ ПРЕДЛОЖЕНИЯ
   ============================================================ */
var MY_STORE = 'vk-mano-v1';
function loadMy(){ try { return JSON.parse(localStorage.getItem(MY_STORE)) || {}; } catch (e) { return {}; } }
function saveMy(d){ try { localStorage.setItem(MY_STORE, JSON.stringify(d)); } catch (e) {} }

function renderMine(host){
  var db = loadMy();
  var grid = el('div', 'themes');

  THEMES.forEach(function(th, i){
    var card = el('div', 'theme');
    card.appendChild(el('span', 'th-n', String(i + 1).padStart(2, '0')));
    card.appendChild(el('h4', 'th-t', th.t));
    card.appendChild(el('p', 'th-d', th.d));
    var hint = el('p', 'th-h');
    hint.appendChild(el('b', null, 'Слова в помощь: '));
    hint.appendChild(document.createTextNode(th.hint));
    card.appendChild(hint);

    var ta = document.createElement('textarea');
    ta.className = 'tq-in tq-area';
    ta.setAttribute('placeholder', 'Напишите свои предложения по-литовски…');
    ta.setAttribute('aria-label', 'Ваши предложения по теме «' + th.t + '»');
    ta.value = db['t' + i] || '';
    card.appendChild(ta);

    var row = el('div', 'th-row');
    var go = el('button', 'btn-go', 'Разобрать написанное');
    go.type = 'button';
    var saved = el('span', 'th-saved', ta.value ? 'сохранено' : '');
    row.appendChild(go);
    row.appendChild(saved);
    card.appendChild(row);

    var out = el('div', 'th-out');
    card.appendChild(out);

    var timer;
    ta.addEventListener('input', function(){
      clearTimeout(timer);
      timer = setTimeout(function(){
        db = loadMy(); db['t' + i] = ta.value; saveMy(db);
        saved.textContent = 'сохранено';
      }, 400);
    });

    go.addEventListener('click', function(){
      out.textContent = '';
      out.className = 'th-out show';
      var a = analyse(ta.value);
      if (!a.words) { out.appendChild(el('p', 'th-empty', 'Сначала напишите хотя бы одно предложение.')); return; }
      if (!a.found.length) {
        out.appendChild(el('p', 'th-empty',
          'Ни одной глагольной формы из базы не нашлось. Это не значит, что вы ошиблись: в базе 131 глагол, а в языке их тысячи. Но если вы хотели употребить глагол отсюда — проверьте форму.'));
        return;
      }
      out.appendChild(el('b', null, 'Что нашлось в вашем тексте'));
      var ul = el('ul', 'bd');
      a.found.forEach(function(f){
        f.recs.slice(0, 2).forEach(function(rec){
          var li = el('li');
          li.appendChild(el('b', null, f.word));
          var s = el('span');
          s.textContent = rec.v.inf + ' (' + rec.v.ru + ') · ' + rec.what + (rec.who !== '—' ? ', ' + rec.who : '') +
                          (f.neg ? ' · с отрицанием ne-' : '') +
                          (rec.v.t ? ' · переходный, требует galininkas' : ' · непереходный');
          li.appendChild(s);
          ul.appendChild(li);
        });
      });
      out.appendChild(ul);
      out.appendChild(el('p', 'th-note',
        'Проверка находит глагольные формы и называет их клетку в таблице. Падежи существительных она не разбирает — это соседняя страница про Vardininkas и Galininkas.'));
    });

    grid.appendChild(card);
  });
  host.appendChild(grid);
}

/* ============================================================
   14. СТАРТ
   ============================================================ */
var h;
if ((h = document.getElementById('vk-schemas'))) renderSchemas(h);
if ((h = document.getElementById('vk-base')))    renderBase(h);
if ((h = document.getElementById('vk-practice'))) renderPractice(h);
if ((h = document.getElementById('vk-mine')))    renderMine(h);

if ((h = document.getElementById('vk-pairs'))) renderPairs(h);

if ((h = document.getElementById('vk-motion'))) {
  var mw = el('div', 'wb-wrap');
  var mt = el('table', 'wb');
  var mh = el('thead'), mr = el('tr');
  ['Приставка', 'Образ', 'eiti — идти', 'Перевод', 'bėgti — бежать', 'Перевод'].forEach(function(x){ mr.appendChild(el('th', null, x)); });
  mh.appendChild(mr); mt.appendChild(mh);
  var mb = el('tbody');
  MOTION.forEach(function(m){
    var pf = PREFIXES.filter(function(x){ return x.p === m.p; })[0] || {};
    var r = el('tr');
    r.appendChild(el('td', 'w', m.p));
    r.appendChild(el('td', 'g', (pf.img || '').split(' →')[0]));
    r.appendChild(el('td', 'f', m.v));
    r.appendChild(el('td', 'g', m.ru));
    r.appendChild(el('td', 'acc', pf.run || '—'));
    r.appendChild(el('td', 'g', pf.rru || '—'));
    mb.appendChild(r);
  });
  mt.appendChild(mb); mw.appendChild(mt);
  h.appendChild(mw);
}

if ((h = document.getElementById('vk-prefixes'))) {
  PREFIXES.forEach(function(pf){
    var card = el('section', 'pref');
    var head = el('div', 'pref-head');
    head.appendChild(el('span', 'pref-p', pf.p));
    var hb = el('div');
    hb.appendChild(el('p', 'pref-img', pf.img));
    hb.appendChild(el('p', 'pref-d', pf.d));
    head.appendChild(hb);
    card.appendChild(head);

    var mv = el('div', 'pref-move');
    [[pf.go, pf.gru, 'eiti — идти'], [pf.run, pf.rru, 'bėgti — бежать']].forEach(function(x){
      var d = el('div');
      d.appendChild(el('b', null, x[0]));
      d.appendChild(el('span', null, x[1]));
      d.appendChild(el('span', 'pref-from', '← ' + x[2]));
      mv.appendChild(d);
    });
    card.appendChild(mv);

    var pr = el('div', 'pref-prep');
    if (pf.prep === '—') {
      pr.appendChild(el('b', null, 'Своего предлога нет'));
      pr.appendChild(el('span', null, 'у at- и par- нет современного предлога-пары, в отличие от į-, iš-, per-, pro-, prie-.'));
    } else {
      pr.appendChild(el('b', null, pf.prep + ' + ' + pf.pcase));
      pr.appendChild(el('span', null, pf.pex + ' — ' + pf.pexru));
    }
    card.appendChild(pr);

    var ul = el('ul', 'pref-br');
    pf.br.forEach(function(b){
      var li = el('li');
      li.appendChild(el('b', null, b.n));
      li.appendChild(el('span', 'pb-ex', b.ex));
      li.appendChild(el('span', 'pb-ru', b.ru));
      ul.appendChild(li);
    });
    card.appendChild(ul);
    h.appendChild(card);
  });
}

if ((h = document.getElementById('vk-lexical'))) {
  var lw = el('div', 'wb-wrap');
  var lt = el('table', 'wb');
  var lh = el('thead'), lr = el('tr');
  ['Глагол', 'Перевод', 'Из чего вырос', 'Почему формула не работает'].forEach(function(x){ lr.appendChild(el('th', null, x)); });
  lh.appendChild(lr); lt.appendChild(lh);
  var lb = el('tbody');
  LEXICAL.forEach(function(x){
    var r = el('tr');
    r.appendChild(el('td', 'w', x.v));
    r.appendChild(el('td', 'f', x.ru));
    r.appendChild(el('td', 'g', x.from));
    r.appendChild(el('td', 'g', x.why));
    lb.appendChild(r);
  });
  lt.appendChild(lb); lw.appendChild(lt);
  h.appendChild(lw);
}

if ((h = document.getElementById('vk-particles'))) {
  var qw = el('div', 'wb-wrap');
  var qt = el('table', 'wb');
  var qh = el('thead'), qr = el('tr');
  ['Элемент', 'Что означает', 'Пример', 'Перевод'].forEach(function(x){ qr.appendChild(el('th', null, x)); });
  qh.appendChild(qr); qt.appendChild(qh);
  var qb = el('tbody');
  PARTICLES.forEach(function(x){
    var r = el('tr');
    r.appendChild(el('td', 'w', x.p));
    r.appendChild(el('td', 'g', x.n));
    r.appendChild(el('td', 'f', x.ex));
    r.appendChild(el('td', 'g', x.ru));
    qb.appendChild(r);
  });
  qt.appendChild(qb); qw.appendChild(qt);
  h.appendChild(qw);
}

if ((h = document.getElementById('vk-detail'))) {
  detailHost = el('div');

  var pick = el('div', 'vpick');
  var find = document.createElement('input');
  find.className = 'vb-search';
  find.type = 'search';
  find.setAttribute('placeholder', 'Найдите глагол: skait, читать, -inti…');
  find.setAttribute('aria-label', 'Поиск глагола для разбора');
  var grid = el('div', 'vpick-grid');
  var more = el('button', 'tr-again', 'Показать все 146');
  more.type = 'button';
  var limited = true;

  function paintPick(){
    var q = flat(find.value);
    var list = VERBS.filter(function(v){
      if (!q) return true;
      var f = famOf(v);
      return flat([v.inf, v.pres, v.past, v.ru, f.n].join(' ')).indexOf(q) !== -1;
    });
    var shown = (limited && !q) ? list.slice(0, 24) : list;
    grid.textContent = '';
    shown.forEach(function(v){
      var b = el('button', 'sp-chip' + (detailPick === v.inf ? ' on' : ''));
      b.type = 'button';
      b.appendChild(el('b', null, v.inf));
      b.appendChild(el('span', null, v.ru));
      b.addEventListener('click', function(){ openDetail(v.inf); });
      grid.appendChild(b);
    });
    if (!shown.length) grid.appendChild(el('p', 'wb-count', 'Ничего не найдено — попробуйте другое слово.'));
    more.hidden = !!q || !limited;
  }
  more.addEventListener('click', function(){ limited = false; paintPick(); });
  repaintPick = paintPick;
  find.addEventListener('input', paintPick);

  pick.appendChild(find);
  pick.appendChild(grid);
  pick.appendChild(more);
  h.appendChild(pick);
  h.appendChild(detailHost);
  openDetail('valgyti');
  paintPick();
}

if ((h = document.getElementById('vk-space'))) renderSpace(h);

})();

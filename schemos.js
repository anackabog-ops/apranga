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
var GROUPS = [
  { k:'inti', n:'Устойчивые -inti',
    cut:'−&nbsp;-ti',
    formula:'gerinti − -ti → gerin-',
    d:'Самая спокойная группа: основа не меняется нигде. Убираем только -ti, и полученный кусок работает и в настоящем, и в прошедшем, и в будущем.',
    pres:'-u · -i · -a · -ame · -ate · -a',
    past:'-au · -ai · -o · -ome · -ote · -o',
    ex:'gerinti · gerina · gerino',
    note:'Почти все глаголы этой группы — переходные: они выросли из прилагательных и означают «делать каким-то». Значит, зовут galininkas: <i>gerinu ką? — rezultatą</i> (улучшаю что? — результат).' },

  { k:'yti', n:'Устойчивые -yti',
    cut:'−&nbsp;-yti',
    formula:'skaityti − -yti → skait-',
    d:'Убираем сразу -yti целиком. Полученная основа даёт настоящее и прошедшее. Буква y возвращается в будущем, в многократном, в условном и в повелительном — там основа берётся от инфинитива.',
    pres:'-au · -ai · -o · -ome · -ote · -o',
    past:'-iau · -ei · -ė · -ėme · -ėte · -ė',
    ex:'skaityti · skaito · skaitė',
    note:'Перед -iau в 1-м лице прошедшего <b>t переходит в č</b>, а <b>d — в dž</b>: skait- + -iau → <i>skaičiau</i> (я читал), rod- + -iau → <i>rodžiau</i> (я показывал). В страдательном причастии прошедшего y сохраняется: <i>skaitytas</i> (прочитанный).' },

  { k:'eti-i', n:'-ėti с настоящим на -i',
    cut:'−&nbsp;-ėti',
    formula:'turėti − -ėti → tur- · прошедшее turėj-',
    d:'В настоящем времени работает короткая основа и II спряжение. В прошедшем возвращается -ėj-, и дальше всё идёт по спокойному -o-типу.',
    pres:'-iu · -i · -i · -ime · -ite · -i',
    past:'-au · -ai · -o · -ome · -ote · -o',
    ex:'turėti · turi · turėjo',
    note:'Сюда попадают самые частые глаголы языка: <i>turėti</i> (иметь), <i>norėti</i> (хотеть), <i>galėti</i> (мочь), <i>mylėti</i> (любить). Их стоит выучить первыми.' },

  { k:'eti-a', n:'-ėti с настоящим на -a',
    cut:'−&nbsp;-ėti',
    formula:'kalbėti − -ėti → kalb- · прошедшее kalbėj-',
    d:'То же самое, но настоящее идёт по I спряжению. Разницу видно только по третьему лицу, поэтому его и заучивают вместе со словом.',
    pres:'-u · -i · -a · -ame · -ate · -a',
    past:'-au · -ai · -o · -ome · -ote · -o',
    ex:'kalbėti · kalba · kalbėjo',
    note:'Пара <i>kalbėti — kalba</i> (говорить) против <i>turėti — turi</i> (иметь) показывает, почему третье лицо входит в главные формы: по инфинитиву его не угадать.' },

  { k:'eti-eja', n:'-ėti со значением «становиться»',
    cut:'−&nbsp;-ti',
    formula:'gerėti − -ti → gerė- · настоящее gerėja',
    d:'Пара к группе -inti. Если -inti означает «делать каким-то», то -ėti означает «становиться каким-то». Действие остаётся при подлежащем и наружу не выходит.',
    pres:'-ju · -ji · -ja · -jame · -jate · -ja',
    past:'-jau · -jai · -jo · -jome · -jote · -jo',
    ex:'gerėti · gerėja · gerėjo',
    note:'Эти глаголы <b>непереходные</b> — galininkas им не нужен: <i>oras gerėja</i> (погода улучшается), но <i>gerinu rezultatą</i> (улучшаю результат). Вся группа парная: gerėti/gerinti, didėti/didinti, mažėti/mažinti.' },

  { k:'uoti', n:'-uoti и -auti с прошедшим на -avo',
    cut:'−&nbsp;-uoti / -auti',
    formula:'dainuoti → dainuoja · dainavo',
    d:'Единственная группа, где основа прошедшего заметно отличается от основы настоящего: -uo- и -au- сменяются на -av-.',
    pres:'-ju · -ji · -ja · -jame · -jate · -ja',
    past:'-au · -ai · -o · -ome · -ote · -o',
    ex:'dainuoti · dainuoja · dainavo',
    note:'Сюда же уходят почти все заимствования: <i>studijuoti</i> (учиться в вузе), <i>sportuoti</i> (заниматься спортом), <i>organizuoti</i> (организовывать). Новое иностранное слово в литовском почти всегда становится глаголом на -uoti.' },

  { k:'oti', n:'-oti',
    cut:'−&nbsp;-ti',
    formula:'galvoti − -ti → galvo- · настоящее galvoja',
    d:'Основа кончается на -o, и к ней добавляется j. Но часть глаголов этой группы идёт без j в настоящем — тем важнее знать третье лицо.',
    pres:'-ju · -ji · -ja · -jame · -jate · -ja',
    past:'-jau · -jai · -jo · -jome · -jote · -jo',
    ex:'galvoti · galvoja · galvojo',
    note:'Сравните: <i>galvoti — galvoja</i> (думать), но <i>ieškoti — ieško</i> (искать) и <i>bijoti — bijo</i> (бояться). Инфинитив одинаковый, настоящее разное. Оба последних требуют kilmininkas: <i>ieškau raktų</i> (ищу ключи), <i>bijau šuns</i> (боюсь собаки).' },

  { k:'kinta', n:'Основа меняется',
    cut:'по трём формам',
    formula:'imti · ima · ėmė',
    d:'Здесь схемы не будет — и это честный ответ. У этих глаголов основа меняется от времени к времени, поэтому три главные формы заучиваются вместе, как одно слово из трёх частей.',
    pres:'по третьему лицу',
    past:'по третьему лицу',
    ex:'imti · ima · ėmė',
    note:'Утешение: таких глаголов немного, но они самые частые — <i>būti</i> (быть), <i>eiti</i> (идти), <i>duoti</i> (давать), <i>imti</i> (брать). Их вы всё равно услышите сотни раз и запомните без таблицы.' }
];

/* ============================================================
   4. БАЗА ГЛАГОЛОВ
   inf — bendratis · pres — esamojo laiko 3 asmuo
   past — būtojo kartinio laiko 3 asmuo · ru — перевод · g — группа
   t:1 — переходный, зовёт galininkas (ką?)
   ============================================================ */
var VERBS = [
  /* ---- устойчивые -inti ---- */
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
  {inf:'turėti', pres:'turi', past:'turėjo', ru:'иметь', g:'eti-i', t:1},
  {inf:'norėti', pres:'nori', past:'norėjo', ru:'хотеть', g:'eti-i'},
  {inf:'galėti', pres:'gali', past:'galėjo', ru:'мочь', g:'eti-i'},
  {inf:'mylėti', pres:'myli', past:'mylėjo', ru:'любить', g:'eti-i', t:1},
  {inf:'girdėti', pres:'girdi', past:'girdėjo', ru:'слышать', g:'eti-i', t:1},
  {inf:'žiūrėti', pres:'žiūri', past:'žiūrėjo', ru:'смотреть', g:'eti-i'},
  {inf:'sėdėti', pres:'sėdi', past:'sėdėjo', ru:'сидеть', g:'eti-i'},
  {inf:'gulėti', pres:'guli', past:'gulėjo', ru:'лежать', g:'eti-i'},
  {inf:'tylėti', pres:'tyli', past:'tylėjo', ru:'молчать', g:'eti-i'},
  {inf:'tikėti', pres:'tiki', past:'tikėjo', ru:'верить', g:'eti-i'},

  /* ---- -ėti с настоящим на -a ---- */
  {inf:'kalbėti', pres:'kalba', past:'kalbėjo', ru:'говорить', g:'eti-a'},
  {inf:'mokėti', pres:'moka', past:'mokėjo', ru:'уметь; платить', g:'eti-a', t:1},
  {inf:'skaudėti', pres:'skauda', past:'skaudėjo', ru:'болеть (о боли)', g:'eti-a'},
  {inf:'skambėti', pres:'skamba', past:'skambėjo', ru:'звучать', g:'eti-a'},

  /* ---- -ėti «становиться» ---- */
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

  /* ---- -uoti / -auti ---- */
  {inf:'dainuoti', pres:'dainuoja', past:'dainavo', ru:'петь', g:'uoti', t:1},
  {inf:'keliauti', pres:'keliauja', past:'keliavo', ru:'путешествовать', g:'uoti'},
  {inf:'važiuoti', pres:'važiuoja', past:'važiavo', ru:'ехать', g:'uoti'},
  {inf:'studijuoti', pres:'studijuoja', past:'studijavo', ru:'учиться (в вузе)', g:'uoti', t:1},
  {inf:'sportuoti', pres:'sportuoja', past:'sportavo', ru:'заниматься спортом', g:'uoti'},
  {inf:'meluoti', pres:'meluoja', past:'melavo', ru:'врать', g:'uoti'},
  {inf:'kainuoti', pres:'kainuoja', past:'kainavo', ru:'стоить', g:'uoti'},
  {inf:'juokauti', pres:'juokauja', past:'juokavo', ru:'шутить', g:'uoti'},
  {inf:'skaičiuoti', pres:'skaičiuoja', past:'skaičiavo', ru:'считать', g:'uoti', t:1},
  {inf:'organizuoti', pres:'organizuoja', past:'organizavo', ru:'организовывать', g:'uoti', t:1},

  /* ---- -oti ---- */
  {inf:'galvoti', pres:'galvoja', past:'galvojo', ru:'думать', g:'oti'},
  {inf:'dovanoti', pres:'dovanoja', past:'dovanojo', ru:'дарить', g:'oti', t:1},
  {inf:'kartoti', pres:'kartoja', past:'kartojo', ru:'повторять', g:'oti', t:1},
  {inf:'vaikščioti', pres:'vaikščioja', past:'vaikščiojo', ru:'ходить', g:'oti'},
  {inf:'nešioti', pres:'nešioja', past:'nešiojo', ru:'носить', g:'oti', t:1},
  {inf:'ieškoti', pres:'ieško', past:'ieškojo', ru:'искать', g:'oti'},
  {inf:'bijoti', pres:'bijo', past:'bijojo', ru:'бояться', g:'oti'},
  {inf:'miegoti', pres:'miega', past:'miegojo', ru:'спать', g:'oti'},
  {inf:'žinoti', pres:'žino', past:'žinojo', ru:'знать', g:'oti', t:1},

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
  {inf:'laukti', pres:'laukia', past:'laukė', ru:'ждать', g:'kinta'},
  {inf:'baigti', pres:'baigia', past:'baigė', ru:'заканчивать', g:'kinta', t:1},
  {inf:'plauti', pres:'plauna', past:'plovė', ru:'мыть', g:'kinta', t:1},
  {inf:'pjauti', pres:'pjauna', past:'pjovė', ru:'резать', g:'kinta', t:1},
  {inf:'gauti', pres:'gauna', past:'gavo', ru:'получать', g:'kinta', t:1},
  {inf:'augti', pres:'auga', past:'augo', ru:'расти', g:'kinta'},
  {inf:'bėgti', pres:'bėga', past:'bėgo', ru:'бежать', g:'kinta'},
  {inf:'lipti', pres:'lipa', past:'lipo', ru:'лезть, подниматься', g:'kinta'},
  {inf:'kristi', pres:'krinta', past:'krito', ru:'падать', g:'kinta'},
  {inf:'gyventi', pres:'gyvena', past:'gyveno', ru:'жить', g:'kinta'},
  {inf:'pažinti', pres:'pažįsta', past:'pažino', ru:'быть знакомым, узнавать', g:'kinta', t:1},
  {inf:'pamiršti', pres:'pamiršta', past:'pamiršo', ru:'забывать', g:'kinta', t:1}
];

/* ============================================================
   5. ПРИСТАВКИ
   ============================================================ */
var PREFIXES = [
  {p:'ap-',  m:'вокруг, охват со всех сторон', ex:'apeiti', exru:'обойти', v:'eiti', vru:'идти'},
  {p:'at-',  m:'приближение или обратное действие', ex:'ateiti', exru:'прийти', v:'eiti', vru:'идти'},
  {p:'į-',   m:'внутрь', ex:'įeiti', exru:'войти', v:'eiti', vru:'идти'},
  {p:'iš-',  m:'наружу; довести до конца', ex:'išeiti', exru:'выйти', v:'eiti', vru:'идти'},
  {p:'nu-',  m:'прочь, вниз; завершение', ex:'nueiti', exru:'уйти', v:'eiti', vru:'идти'},
  {p:'pa-',  m:'немного; довести до конца', ex:'pavalgyti', exru:'поесть', v:'valgyti', vru:'есть'},
  {p:'par-', m:'возвращение домой, назад', ex:'pareiti', exru:'вернуться (пешком)', v:'eiti', vru:'идти'},
  {p:'per-', m:'через; насквозь; пере-', ex:'perskaityti', exru:'прочитать целиком', v:'skaityti', vru:'читать'},
  {p:'pra-', m:'мимо; сквозь; начало действия', ex:'pradėti', exru:'начать', v:'dėti', vru:'класть'},
  {p:'pri-', m:'при-, до-; набрать много', ex:'prieiti', exru:'подойти', v:'eiti', vru:'идти'},
  {p:'su-',  m:'вместе, с-; завершение', ex:'suprasti', exru:'понять', v:'rasti', vru:'находить'},
  {p:'už-',  m:'за-; закрыть; начать', ex:'uždaryti', exru:'закрыть', v:'daryti', vru:'делать'}
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
  GROUPS.forEach(function(g){
    var n = VERBS.filter(function(v){ return v.g === g.k; }).length;
    var card = el('section', 'sch');
    card.id = 'g-' + g.k;

    var head = el('div', 'sch-head');
    var t = el('h3', 'sch-t', g.n);
    head.appendChild(t);
    head.appendChild(el('span', 'sch-n', n + ' в базе'));
    card.appendChild(head);

    var f = el('div', 'sch-f');
    f.innerHTML = g.formula;
    card.appendChild(f);

    card.appendChild(el('p', 'sch-d', g.d));

    var rows = el('div', 'sch-rows');
    [['Настоящее', g.pres], ['Прошедшее однократное', g.past], ['Три главные формы', g.ex]].forEach(function(r){
      var row = el('div', 'sch-row');
      row.appendChild(el('b', null, r[0]));
      row.appendChild(el('span', null, r[1]));
      rows.appendChild(row);
    });
    card.appendChild(rows);

    if (g.note) {
      var nb = el('p', 'sch-note');
      nb.innerHTML = g.note;
      card.appendChild(nb);
    }

    /* список глаголов группы — чипами */
    var chips = el('div', 'chips');
    VERBS.filter(function(v){ return v.g === g.k; }).forEach(function(v){
      var c = el('button', 'chip-v');
      c.type = 'button';
      c.appendChild(el('b', null, v.inf));
      c.appendChild(el('span', null, v.ru));
      c.addEventListener('click', function(){ openDetail(v.inf); });
      chips.appendChild(c);
    });
    card.appendChild(chips);
    host.appendChild(card);
  });
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
  var gname = (GROUPS.filter(function(g){ return g.k === v.g; })[0] || {}).n || '';
  h.appendChild(el('p', 'ct-g', gname + (v.t ? ' · переходный, зовёт ką?' : ' · непереходный')));
  head.appendChild(h);
  wrap.appendChild(head);

  /* три главные формы */
  var main = el('div', 'ct-main');
  [['Bendratis', v.inf, 'инфинитив'],
   ['Esamasis · jis', v.pres, '3-е лицо настоящего'],
   ['Būtasis kartinis · jis', v.past, '3-е лицо прошедшего']].forEach(function(m){
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
    ['Bendratis', 'Esamasis · jis', 'Būtasis · jis', 'Группа', 'Кого зовёт', 'Перевод', ''].forEach(function(x){
      tr.appendChild(el('th', null, x));
    });
    thead.appendChild(tr);
    table.appendChild(thead);
    var tbody = el('tbody'), shown = 0;
    VERBS.forEach(function(x){
      if (cur !== 'all' && x.g !== cur) return;
      var gname = (GROUPS.filter(function(g){ return g.k === x.g; })[0] || {}).n || '';
      var hay = flat([x.inf, x.pres, x.past, x.ru, gname, '-' + x.g].join(' '));
      if (v && hay.indexOf(v) === -1) return;
      shown++;
      var r = el('tr');
      r.appendChild(el('td', 'w', x.inf));
      r.appendChild(el('td', 'f', x.pres));
      r.appendChild(el('td', 'f', x.past));
      r.appendChild(el('td', 'g', gname));
      r.appendChild(el('td', 'acc', x.t ? 'ką? · galininkas' : '—'));
      r.appendChild(el('td', 'g', x.ru));
      var td = el('td');
      var b = el('button', 'vb-open', 'Разбор');
      b.type = 'button';
      b.addEventListener('click', function(){ openDetail(x.inf); });
      td.appendChild(b);
      r.appendChild(td);
      tbody.appendChild(r);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    count.textContent = (v || cur !== 'all')
      ? (shown ? 'Показано глаголов: ' + shown + ' из ' + VERBS.length : 'Ничего не найдено')
      : 'Всего в базе: ' + VERBS.length + ' глаголов · у каждого 24 личные формы плюс причастия';
  }

  [{ k:'all', n:'Все' }].concat(GROUPS.map(function(g){ return { k:g.k, n:g.n }; })).forEach(function(f){
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
var detailHost = null, detailPick = null;
function openDetail(inf){
  if (!detailHost) return;
  var v = VERBS.filter(function(x){ return x.inf === inf; })[0];
  if (!v) return;
  if (detailPick) detailPick.value = inf;
  detailHost.textContent = '';
  detailHost.appendChild(conjTable(v));
  var g = GROUPS.filter(function(x){ return x.k === v.g; })[0];
  if (g) {
    var steps = el('div', 'steps-lt');
    var c = conjugate(v);
    [['Шаг 1 · группа', g.n + '. ' + g.d],
     ['Шаг 2 · основа настоящего', '«' + v.pres + '» — это ' + c.presInfo.n + ' спряжение, основа ' + c.presInfo.stem + '-, окончания ' + c.presInfo.ends + '.'],
     ['Шаг 3 · основа прошедшего', '«' + v.past + '» — тип ' + c.pastInfo.t + ', основа ' + c.pastInfo.stem + '-, окончания ' + c.pastInfo.ends + '.'],
     ['Шаг 4 · будущее', 'От инфинитива: ' + v.inf + ' − -ti → ' + v.inf.replace(/ti$/, '') + '- плюс -s-: ' + c.fut[0] + ', ' + c.fut[2] + '.'],
     ['Шаг 5 · многократное', 'От инфинитива плюс -dav-: ' + c.often[0] + ' — «бывало, ' + v.ru + '».'],
     ['Шаг 6 · падеж дополнения', v.t ? 'Переходный: зовёт galininkas. ' + c.pres[0] + ' ką? — например, knygą (книгу).'
                                     : 'Непереходный: направлять действие не на что, galininkas ему не нужен.']
    ].forEach(function(s){
      var d = el('div', 'step-lt');
      d.appendChild(el('b', null, s[0]));
      d.appendChild(el('p', null, s[1]));
      steps.appendChild(d);
    });
    detailHost.appendChild(steps);
  }
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

function buildTasks(groupKey, n){
  var list = VERBS.filter(function(v){ return groupKey === 'all' || v.g === groupKey; });
  var out = [];
  for (var i = 0; i < n; i++) {
    var v = list[(i * 7 + 3) % list.length];
    var ti = (i * 3 + 1) % TENSES.length;
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

  [{ k:'all', n:'Все группы' }].concat(GROUPS.map(function(g){ return { k:g.k, n:g.n }; })).forEach(function(f){
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
  why.appendChild(el('b', null, 'Разбор всех вариантов'));
  var ul = el('ul', 'wl');
  item.opts.forEach(function(o){
    var li = el('li');
    li.appendChild(el('span', 'mk ' + (o.ok ? 'y' : 'n'), o.ok ? 'верно' : 'мимо'));
    var body = el('div');
    body.appendChild(el('span', 'wt', o.t));
    body.appendChild(el('span', 'wd', o.w));
    li.appendChild(body);
    ul.appendChild(li);
  });
  why.appendChild(ul);
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

  if (mode === 'choice') {
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
    input.setAttribute('placeholder', 'Впишите форму…');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-label', 'Ваш ответ');
    var go = el('button', 'btn-go', 'Проверить');
    go.type = 'button';
    function check(){
      if (closed || !norm(input.value)) return;
      input.disabled = true; go.disabled = true;
      var exact = norm(input.value) === norm(item.ans[0]);
      var loose = flat(input.value) === flat(item.ans[0]);
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

if ((h = document.getElementById('vk-prefixes'))) {
  var tw = el('div', 'wb-wrap');
  var t = el('table', 'wb');
  var thead = el('thead'), tr = el('tr');
  ['Приставка', 'Что добавляет', 'Пример', 'Перевод примера', 'Из какого глагола'].forEach(function(x){ tr.appendChild(el('th', null, x)); });
  thead.appendChild(tr); t.appendChild(thead);
  var tb = el('tbody');
  PREFIXES.forEach(function(p){
    var r = el('tr');
    r.appendChild(el('td', 'w', p.p));
    r.appendChild(el('td', 'g', p.m));
    r.appendChild(el('td', 'f', p.ex));
    r.appendChild(el('td', 'g', p.exru));
    r.appendChild(el('td', 'acc', p.v + ' — ' + p.vru));
    tb.appendChild(r);
  });
  t.appendChild(tb); tw.appendChild(t);
  h.appendChild(tw);
}

if ((h = document.getElementById('vk-detail'))) {
  detailHost = el('div');
  var picker = el('div', 'vb-pick');
  detailPick = document.createElement('select');
  detailPick.className = 'vb-select';
  detailPick.setAttribute('aria-label', 'Выберите глагол для разбора');
  VERBS.slice().sort(function(a, b){ return a.inf.localeCompare(b.inf, 'lt'); }).forEach(function(v){
    var o = document.createElement('option');
    o.value = v.inf;
    o.textContent = v.inf + ' — ' + v.ru;
    detailPick.appendChild(o);
  });
  detailPick.addEventListener('change', function(){ openDetail(detailPick.value); });
  picker.appendChild(el('span', 'vb-plbl', 'Глагол:'));
  picker.appendChild(detailPick);
  h.appendChild(picker);
  h.appendChild(detailHost);
  openDetail('skaityti');
}

})();

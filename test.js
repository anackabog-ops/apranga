/* Проверка базы «Два друга»: node test.js
   Часть 1 — чистые данные (без браузера): контрольные формы из ТЗ,
   уникальность, ссылки сцен, спряжение.
   Часть 2 — если установлен Playwright: сборка заданий в реальном браузере. */
'use strict';
require('./data.js');
var D = globalThis.DD;
var fails = 0, n = 0;
function eq(actual, expected, label) {
  n++;
  var a = JSON.stringify(actual), b = JSON.stringify(expected);
  if (a !== b) { fails++; console.log('FAIL ' + label + ': got ' + a + ', expected ' + b); }
}
function ok(cond, label) { n++; if (!cond) { fails++; console.log('FAIL ' + label); } }

/* --- контрольные существительные --- */
eq(D.NOUN.durys.nom, ['', 'durys'], 'durys nom'); eq(D.NOUN.durys.acc, ['', 'duris'], 'durys acc'); eq(D.NOUN.durys.gender, 'f', 'durys f');
eq(D.NOUN.moteris.gender, 'f', 'moteris f'); eq(D.NOUN.moteris.acc, ['moterį', 'moteris'], 'moteris acc');
eq(D.NOUN.dantis.gender, 'm', 'dantis m'); eq(D.NOUN.dantis.acc, ['dantį', 'dantis'], 'dantis acc');
eq(D.NOUN['šuo'].acc, ['šunį', 'šunis'], 'šuo acc'); eq(D.NOUN['šuo'].nom, ['šuo', 'šunys'], 'šuo nom');
eq(D.NOUN['žmogus'].acc, ['žmogų', 'žmones'], 'žmogus acc');
eq(D.NOUN.brolis.nom, ['brolis', 'broliai'], 'brolis'); eq(D.NOUN.veidrodis.acc, ['veidrodį', 'veidrodžius'], 'veidrodis');
eq(D.NOUN['sesė'].acc, ['sesę', 'seses'], 'sesė'); eq(D.NOUN.kambarys.acc, ['kambarį', 'kambarius'], 'kambarys');
eq(D.NOUN['sūnus'].acc, ['sūnų', 'sūnus'], 'sūnus'); eq(D.NOUN.vanduo.nom, ['vanduo', ''], 'vanduo');
eq(D.NOUN.dubuo.acc, ['dubenį', 'dubenis'], 'dubuo'); eq(D.NOUN['rankšluostis'].nom, ['rankšluostis', 'rankšluosčiai'], 'rankšluostis');
eq(D.NOUN['užduotis'].acc, ['užduotį', 'užduotis'], 'užduotis'); eq(D.NOUN['svečias'].acc, ['svečią', 'svečius'], 'svečias');
eq(D.NOUN.vaisius.acc, ['vaisių', 'vaisius'], 'vaisius'); eq(D.NOUN.televizorius.nom, ['televizorius', 'televizoriai'], 'televizorius');

/* --- контрольные прилагательные (порядок jis, ji, jie, jos) --- */
eq(D.ADJ['gražus'].acc, ['gražų', 'gražią', 'gražius', 'gražias'], 'gražus acc');
eq(D.ADJ['gražus'].nom, ['gražus', 'graži', 'gražūs', 'gražios'], 'gražus nom');
eq(D.ADJ.saldus.acc[1], 'saldžią', 'saldžią'); eq(D.ADJ.saldus.nom, ['saldus', 'saldi', 'saldūs', 'saldžios'], 'saldus nom');
eq(D.ADJ.platus.acc[1], 'plačią', 'plačią'); eq(D.ADJ.platus.acc, ['platų', 'plačią', 'plačius', 'plačias'], 'platus acc');
eq(D.ADJ['tuščias'].nom[2], 'tušti', 'tušti'); eq(D.ADJ['tuščias'].acc, ['tuščią', 'tuščią', 'tuščius', 'tuščias'], 'tuščias acc');
eq(D.ADJ.didelis.nom, ['didelis', 'didelė', 'dideli', 'didelės'], 'didelis nom'); eq(D.ADJ.didelis.acc, ['didelį', 'didelę', 'didelius', 'dideles'], 'didelis acc');
eq(D.ADJ.stiklinis.nom, ['stiklinis', 'stiklinė', 'stikliniai', 'stiklinės'], 'stiklinis nom'); eq(D.ADJ.stiklinis.acc, ['stiklinį', 'stiklinę', 'stiklinius', 'stiklines'], 'stiklinis acc');
eq(D.ADJ['švarus'].nom, ['švarus', 'švari', 'švarūs', 'švarios'], 'švarus'); eq(D.ADJ.naujas.acc, ['naują', 'naują', 'naujus', 'naujas'], 'naujas acc');
eq(D.ADJ['žalias'].nom, ['žalias', 'žalia', 'žali', 'žalios'], 'žalias'); eq(D.ADJ.kartus.nom[3], 'karčios', 'karčios');
eq(D.ADJ.vilnonis.nom, ['vilnonis', 'vilnonė', 'vilnoniai', 'vilnonės'], 'vilnonis'); eq(D.ADJ.ramus.acc[1], 'ramią', 'ramią');

/* --- спряжение --- */
function c(id) { return D.conjugate(D.VERB[id]); }
eq(c('atidaryti').pres, ['atidarau', 'atidarai', 'atidaro', 'atidarome', 'atidarote', 'atidaro'], 'atidaryti pres');
eq(c('plauti').past, ['ploviau', 'plovei', 'plovė', 'plovėme', 'plovėte', 'plovė'], 'plauti past');
eq(c('matyti').past[0], 'mačiau', 'mačiau'); eq(c('kviesti').pres.slice(0, 3), ['kviečiu', 'kvieti', 'kviečia'], 'kviesti');
eq(c('siųsti').fut[2], 'siųs', 'siųs'); eq(c('nešti').fut, ['nešiu', 'neši', 'neš', 'nešime', 'nešite', 'neš'], 'nešti fut');
eq(c('rasti').fut[0], 'rasiu', 'rasiu'); eq(c('mėgti').imp[1], 'mėk', 'mėk'); eq(c('įjungti').imp[1], 'įjunk', 'įjunk');
eq(c('pirkti').imp.slice(1, 5), ['pirk', 'tegul perka', 'pirkime', 'pirkite'], 'pirkti imp'); eq(c('turėti').pres, ['turiu', 'turi', 'turi', 'turime', 'turite', 'turi'], 'turėti');
eq(c('lydėti').pres[0], 'lydžiu', 'lydžiu'); eq(c('gerėti').pres[2], 'gerėja', 'gerėja'); eq(c('mylėti').pres[2], 'myli', 'myli');
eq(c('imti').past[0], 'ėmiau', 'ėmiau'); eq(c('dėti').pres[0], 'dedu', 'dedu'); eq(c('versti').pres[1], 'verti', 'verti');
eq(c('šluostyti').past[0], 'šluosčiau', 'šluosčiau'); eq(c('praleisti').pres[1], 'praleidi', 'praleidi'); eq(c('baigti').imp[1], 'baik', 'baik');
eq(c('gerti').fut[0], 'gersiu', 'gersiu'); eq(c('parduoti').past[0], 'pardaviau', 'pardaviau'); eq(c('kirsti').imp[1], 'kirsk', 'kirsk');

/* --- целостность --- */
var ids = {};
D.NOUNS.forEach(function (x) { ok(!ids['n:' + x.id], 'dup noun ' + x.id); ids['n:' + x.id] = 1;
  ok(x.nom.length === 2 && x.acc.length === 2, 'noun forms ' + x.id);
  ok(x.nom[0] || x.nom[1], 'noun has a form ' + x.id);
  ok((!!x.nom[0]) === (!!x.acc[0]) && (!!x.nom[1]) === (!!x.acc[1]), 'noun nom/acc parity ' + x.id);
  ok(x.gender === 'm' || x.gender === 'f', 'gender ' + x.id); ok(x.ru, 'ru ' + x.id); });
D.ADJS.forEach(function (x) { ok(x.nom.length === 4 && x.acc.length === 4 && x.nom.every(Boolean) && x.acc.every(Boolean), 'adj forms ' + x.id); ok(['as', 'us', 'is'].indexOf(x.group) >= 0, 'adj group ' + x.id); });
D.VERBS.forEach(function (x) { ok(/ti$/.test(x.id), 'verb inf ' + x.id); ok(x.ru, 'verb ru ' + x.id); var cc = c(x.id); ok(cc.pres.every(Boolean) && cc.past.every(Boolean) && cc.fut.every(Boolean), 'conj ' + x.id); });
D.SCENES.forEach(function (s) {
  ok(D.NOUN[s.noun], 'scene noun ' + s.noun);
  ok(s.adjectives.length >= 6 && s.adjectives.length <= 8, 'scene adjs ' + s.noun + ' ' + s.adjectives.length);
  ok(s.actions.length >= 4, 'scene acts ' + s.noun);
  s.adjectives.forEach(function (a) { ok(D.ADJ[a], 'scene adj ref ' + s.noun + ':' + a); });
  s.actions.forEach(function (v) { ok(D.VERB[v], 'scene verb ref ' + s.noun + ':' + v); });
  ok(s.adjectives.length === new Set(s.adjectives).size && s.actions.length === new Set(s.actions).size, 'scene dup ' + s.noun);
});
/* --- сцены опубликованной версии: первые 114, порядок и состав как в приложении 37 --- */
var v4 = Object.keys(D.SCENES_V4);
eq(v4.length, 114, 'v4 count'); eq(v4[0], 'langas', 'v4 first'); eq(v4[113], 'žurnalas', 'v4 last');
v4.forEach(function (id, i) { ok(D.SCENES[i].noun === id && D.SCENES[i].published, 'v4 order ' + id); });
eq(D.SCENE.vonia.adjectives, ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'baltas', 'brangus'], 'vonia adj');
eq(D.SCENE.langas.actions.length, 29, 'langas actions'); eq(D.SCENE.obuolys.actions[7], 'nulupti', 'obuolys nulupti');
eq(c('pasirinkti').pres[0], 'pasirenku', 'pasirenku'); eq(c('apžiūrėti').pres[0], 'apžiūriu', 'apžiūriu'); eq(c('išimti').past[0], 'išėmiau', 'išėmiau');
eq(D.NOUN.vinis.acc, ['vinį', 'vinis'], 'vinis'); eq(D.NOUN.laikrodis.nom[1], 'laikrodžiai', 'laikrodžiai'); eq(D.NOUN.praustuvas.acc[0], 'praustuvą', 'praustuvas');
D.UMAS.forEach(function (u) { ok(D.ADJ[u.adj] && /umas$/.test(u.noun) && u.nounRu, 'umas ' + u.adj); });
D.PAIRS.forEach(function (p) { ok(D.VERB[p.a] && D.VERB[p.b], 'pair ' + p.a); });
D.MATERIALS.forEach(function (m) { ok(D.ADJ[m.adj], 'material ' + m.noun); });
D.TRANSLATIONS.forEach(function (t, i) { ok(t[0] && t[1].length && t[2] && (!t[3] || D.VERB[t[3]]), 'translation ' + (i + 1)); });
ok(D.NOUNS.length >= 177 && D.ADJS.length >= 100 && D.VERBS.length >= 108, 'sizes ' + D.NOUNS.length + '/' + D.ADJS.length + '/' + D.VERBS.length);

console.log('Данные: проверок ' + n + ', ошибок ' + fails);

/* --- часть 2: задания в браузере (если доступен Playwright) --- */
var pw = null;
try { pw = require('playwright'); } catch (e) { try { pw = require('/opt/node22/lib/node_modules/playwright'); } catch (e2) { pw = null; } }
if (!pw) { console.log('Playwright не найден — проверка заданий в браузере пропущена.'); process.exit(fails ? 1 : 0); }
(async function () {
  var fs = require('fs'), path = require('path');
  var scripts = [];
  var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')
    .replace(/<link[^>]+fonts\.googleapis[^>]*>/g, '')
    .replace(/<script src="([^"]+)" defer><\/script>/g, function (m, src) { scripts.push(fs.readFileSync(path.join(__dirname, src), 'utf8')); return ''; })
    .replace(/<link rel="stylesheet" href="([^"]+)">/g, function (m, href) { return '<style>' + fs.readFileSync(path.join(__dirname, href), 'utf8') + '</style>'; });
  html = html.replace('</body>', scripts.map(function (x) { return '<script>' + x + '</script>'; }).join('') + '</body>');
  var browser = await pw.chromium.launch(), page = await browser.newPage();
  var errs = []; page.on('pageerror', function (e) { errs.push(e.message); });
  await page.setContent(html);
  await page.waitForFunction(function () { return window.DDApp; });
  var r = await page.evaluate(function () {
    var T = window.DDApp.TASKS, seen = {}, bad = [];
    T.forEach(function (t) {
      if (seen[t.id]) bad.push('dup ' + t.id); seen[t.id] = 1;
      if (t.labels.length !== t.answers.length) bad.push('labels/answers ' + t.id);
      t.answers.forEach(function (a) { if (!a.length || a.some(function (x) { return !x || /undefined|null/.test(x); })) bad.push('empty answer ' + t.id); });
      if (!t.why || /undefined|null/.test(t.why + t.prompt)) bad.push('why/prompt ' + t.id);
      if (t.mode === 'agreement' || t.mode === 'action') { var an = t.answers[0][0]; if (t.prompt.indexOf('<b>' + an + '</b>') >= 0) bad.push('answer leaked ' + t.id); }
    });
    var N = window.DDApp.normalize, M = window.DDApp.matches;
    if (N('Švarų langą.') !== 'švarų langą') bad.push('normalize case/punct');
    if (N('švarų') === N('svaru')) bad.push('normalize stripped diacritics');
    if (!M('  aš  plaunu švarų langą! ', ['Aš plaunu švarų langą'])) bad.push('matches spaces');
    if (M('', ['x'])) bad.push('matches empty');
    var counts = {}; T.forEach(function (t) { counts[t.mode] = (counts[t.mode] || 0) + 1; });
    return { total: T.length, counts: counts, bad: bad.slice(0, 20), badN: bad.length };
  });
  await browser.close();
  console.log('Задания: ' + r.total + ' ' + JSON.stringify(r.counts));
  if (r.badN) { fails += r.badN; console.log('FAIL задания: ' + r.badN, r.bad); }
  if (errs.length) { fails += errs.length; console.log('FAIL ошибки страницы:', errs); }
  console.log(fails ? 'ЕСТЬ ОШИБКИ: ' + fails : 'Все проверки пройдены.');
  process.exit(fails ? 1 : 0);
})();

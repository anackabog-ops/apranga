/* ============================================================
   «Два друга · Vardininkas и Galininkas» — база слов
   Автор методики: Божена Анацкая · anacka.lt
   © 2026 Божена Анацкая. Все права защищены.

   Файл хранит ТОЛЬКО данные и простые функции форм.
   Всё, что здесь записано, проверяется скриптом dudraugai-test.js.

   Соглашения:
   • Порядок позиций прилагательного везде один: jis, ji, jie, jos.
   • Пустая строка в форме существительного = формы нет в изучаемом
     значении (durys без единственного, vanduo без множественного).
   • Существительные описаны ID и моделью склонения; исключения
     заданы формами целиком, а не «по догадке».
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- вспомогательные ---------- */
  function pal(s) { return s.replace(/t$/, 'č').replace(/d$/, 'dž'); }
  function depal(s) { return s.replace(/č$/, 't').replace(/dž$/, 'd'); }

  /* ---------- существительные ---------- */
  var NOUNS = [];
  var NOUN = {};

  // n(id, перевод, род, модель, профиль сцены, примечание)
  function n(id, ru, g, pat, p, note) {
    var st, nom, acc;
    switch (pat) {
      case 'as':  st = id.slice(0, -2); nom = [id, st + 'ai'];  acc = [st + 'ą', st + 'us']; break;
      case 'ias': st = id.slice(0, -3); nom = [id, st + 'iai']; acc = [st + 'ią', st + 'ius']; break;
      case 'is':  st = id.slice(0, -2); nom = [id, pal(st) + 'iai']; acc = [st + 'į', pal(st) + 'ius']; break;
      case 'ys':  st = id.slice(0, -2); nom = [id, pal(st) + 'iai']; acc = [st + 'į', pal(st) + 'ius']; break;
      case 'us':  st = id.slice(0, -2); nom = [id, st + 'ūs'];  acc = [st + 'ų', st + 'us']; break;
      case 'ius': st = id.slice(0, -3); nom = [id, st + 'iai']; acc = [st + 'ių', st + 'ius']; break;
      case 'a':   st = id.slice(0, -1); nom = [id, st + 'os'];  acc = [st + 'ą', st + 'as']; break;
      case 'ė':   st = id.slice(0, -1); nom = [id, st + 'ės'];  acc = [st + 'ę', st + 'es']; break;
      case 'is3': st = id.slice(0, -2); nom = [id, st + 'ys'];  acc = [st + 'į', st + 'is']; break;
      default: throw new Error('unknown noun pattern ' + pat + ' for ' + id);
    }
    push(id, ru, g, nom, acc, p, note);
  }
  // x(id, перевод, род, [kas ед., kas мн.], [ką ед., ką мн.], профиль, примечание)
  function x(id, ru, g, nom, acc, p, note) { push(id, ru, g, nom, acc, p, note); }
  function push(id, ru, g, nom, acc, p, note) {
    if (NOUN[id]) throw new Error('duplicate noun ' + id);
    var o = { id: id, ru: ru, gender: g, nom: nom, acc: acc, note: note || '', profile: p || '' };
    NOUNS.push(o); NOUN[id] = o;
  }

  /* --- исходные 14 сцен и предметы дома --- */
  n('langas', 'окно', 'm', 'as', 'window');
  n('stalas', 'стол', 'm', 'as', 'furniture');
  n('namas', 'дом', 'm', 'as', 'home');
  n('butas', 'квартира', 'm', 'as', 'home');
  n('kiemas', 'двор', 'm', 'as', 'yard');
  n('parkas', 'парк', 'm', 'as', 'place');
  n('miestas', 'город', 'm', 'as', 'place');
  n('kelias', 'дорога', 'm', 'ias', 'road');
  n('kambarys', 'комната', 'm', 'ys', 'room');
  n('kompiuteris', 'компьютер', 'm', 'is', 'device');
  n('telefonas', 'телефон', 'm', 'as', 'device');
  n('televizorius', 'телевизор', 'm', 'ius', 'device');
  n('siurblys', 'пылесос', 'm', 'ys', 'appliance');
  n('veidrodis', 'зеркало', 'm', 'is', 'mirror');
  n('paveikslas', 'картина', 'm', 'as', 'decor');
  n('puodelis', 'чашка', 'm', 'is', 'cup');
  n('puodas', 'кастрюля', 'm', 'as', 'pot');
  n('peilis', 'нож', 'm', 'is', 'cutting');
  n('šaukštas', 'ложка', 'm', 'as', 'cutlery');
  n('raktas', 'ключ', 'm', 'as', 'key');
  n('krepšys', 'сумка; корзина', 'm', 'ys', 'bag');
  n('obuolys', 'яблоко', 'm', 'ys', 'fruit');
  n('agurkas', 'огурец', 'm', 'as', 'vegetable');
  n('pomidoras', 'помидор', 'm', 'as', 'vegetable');
  n('bananas', 'банан', 'm', 'as', 'fruit-buy');
  n('grybas', 'гриб', 'm', 'as', 'mushroom');
  n('sūris', 'сыр', 'm', 'is', 'food-cut');
  n('laiškas', 'письмо', 'm', 'as', 'letter');
  n('tekstas', 'текст', 'm', 'as', 'text');
  n('sąsiuvinis', 'тетрадь', 'm', 'is', 'notebook');
  n('pieštukas', 'карандаш', 'm', 'as', 'pen');
  n('rašiklis', 'ручка', 'm', 'is', 'pen');
  n('bilietas', 'билет', 'm', 'as', 'ticket');
  n('dokumentas', 'документ', 'm', 'as', 'document');
  n('vaikas', 'ребёнок', 'm', 'as', 'child');
  n('berniukas', 'мальчик', 'm', 'as', 'child');
  n('vyras', 'мужчина', 'm', 'as', 'person');
  n('brolis', 'брат', 'm', 'is', 'person', 'Окончание -is, мужской род: jis brolis. Сравните: ji moteris.');
  n('sūnus', 'сын', 'm', 'us', 'person');
  x('žmogus', 'человек', 'm', ['žmogus', 'žmonės'], ['žmogų', 'žmones'], 'person', 'Мужской род, но во множественном винительном žmones.');
  n('dantis', 'зуб', 'm', 'is3', 'tooth', 'Мужской род третьего склонения: ką? dantis, не dantus.');
  x('šuo', 'собака', 'm', ['šuo', 'šunys'], ['šunį', 'šunis'], 'pet', 'Особая основа šun-. Мужское множественное винительного: šunis.');
  x('vanduo', 'вода', 'm', ['vanduo', ''], ['vandenį', ''], 'liquid', 'В значении вещества тренируем единственное. Vandenys возможно в других значениях.');
  n('knyga', 'книга', 'f', 'a', 'book');
  n('kėdė', 'стул', 'f', 'ė', 'furniture');
  n('lempa', 'лампа', 'f', 'a', 'lamp');
  n('siena', 'стена', 'f', 'a', 'wall');
  n('lova', 'кровать', 'f', 'a', 'bed');
  n('lentyna', 'полка', 'f', 'a', 'furniture');
  n('spinta', 'шкаф', 'f', 'a', 'furniture');
  n('lėkštė', 'тарелка', 'f', 'ė', 'plate');
  n('šakutė', 'вилка', 'f', 'ė', 'cutlery');
  n('dėžė', 'коробка', 'f', 'ė', 'box');
  n('kuprinė', 'рюкзак', 'f', 'ė', 'bag');
  n('mašina', 'машина', 'f', 'a', 'car');
  n('gatvė', 'улица', 'f', 'ė', 'street');
  n('gėlė', 'цветок', 'f', 'ė', 'flower');
  n('kriaušė', 'груша', 'f', 'ė', 'fruit');
  n('bulvė', 'картофелина', 'f', 'ė', 'root-veg');
  n('morka', 'морковь; морковка', 'f', 'a', 'root-veg');
  n('slyva', 'слива', 'f', 'a', 'fruit');
  n('uoga', 'ягода', 'f', 'a', 'berry');
  n('citrina', 'лимон', 'f', 'a', 'fruit-buy');
  n('nuotrauka', 'фотография', 'f', 'a', 'photo');
  n('žinutė', 'сообщение', 'f', 'ė', 'message');
  n('mama', 'мама', 'f', 'a', 'person');
  n('sesė', 'сестра', 'f', 'ė', 'person', 'Винительный множественного: seses, не sesės.');
  n('mergaitė', 'девочка', 'f', 'ė', 'child');
  n('moteris', 'женщина', 'f', 'is3', 'person', 'Окончание -is не гарантирует мужской род: ji moteris, jis brolis.');
  n('širdis', 'сердце', 'f', 'is3', 'heart');
  n('akis', 'глаз', 'f', 'is3', 'eye', 'В литовском женский род. Согласуем по литовскому слову.');
  n('žuvis', 'рыба', 'f', 'is3', 'fish');
  x('durys', 'дверь; двери', 'f', ['', 'durys'], ['', 'duris'], 'door', 'Только множественное: jos. Одну дверь тоже называем durys.');
  x('žirklės', 'ножницы', 'f', ['', 'žirklės'], ['', 'žirkles'], 'cutting', 'Только множественное: jos.');
  x('kelnės', 'брюки', 'f', ['', 'kelnės'], ['', 'kelnes'], 'clothes-legs', 'Только множественное: jos.');
  x('akiniai', 'очки', 'm', ['', 'akiniai'], ['', 'akinius'], 'glasses', 'Только множественное: jie.');
  x('baldai', 'мебель', 'm', ['', 'baldai'], ['', 'baldus'], 'furniture', 'Только множественное в этом значении: jie.');
  n('sofa', 'диван', 'f', 'a', 'soft-furniture');
  n('fotelis', 'кресло', 'm', 'is', 'soft-furniture');
  n('komoda', 'комод', 'f', 'a', 'furniture');
  n('spintelė', 'шкафчик', 'f', 'ė', 'furniture');
  n('suolas', 'скамья', 'm', 'as', 'furniture');
  n('taburetė', 'табурет', 'f', 'ė', 'furniture');
  n('čiužinys', 'матрас', 'm', 'ys', 'soft-furniture');
  n('kilimas', 'ковёр', 'm', 'as', 'rug');
  n('kilimėlis', 'коврик', 'm', 'is', 'rug');
  n('pagalvė', 'подушка', 'f', 'ė', 'bedding');
  n('antklodė', 'одеяло', 'f', 'ė', 'bedding');
  n('paklodė', 'простыня', 'f', 'ė', 'linen');
  n('užvalkalas', 'наволочка; чехол', 'm', 'as', 'linen');
  n('rankšluostis', 'полотенце', 'm', 'is', 'towel');
  n('užuolaida', 'занавеска', 'f', 'a', 'curtain');
  n('staltiesė', 'скатерть', 'f', 'ė', 'linen');
  n('servetėlė', 'салфетка', 'f', 'ė', 'linen');
  n('pledas', 'плед', 'm', 'as', 'bedding');
  n('prijuostė', 'фартук', 'f', 'ė', 'clothes-torso');
  n('šluostė', 'тряпка для протирания', 'f', 'ė', 'towel');
  x('dubuo', 'миска', 'm', ['dubuo', 'dubenys'], ['dubenį', 'dubenis'], 'bowl', 'Особая основа: dubuo → dubenį; dubenys → dubenis.');
  n('dubenėlis', 'мисочка', 'm', 'is', 'bowl');
  n('stiklinė', 'стакан', 'f', 'ė', 'glass');
  n('taurė', 'бокал', 'f', 'ė', 'glass');
  n('ąsotis', 'кувшин', 'm', 'is', 'jug');
  n('butelis', 'бутылка', 'm', 'is', 'jug');
  n('stiklainis', 'стеклянная банка', 'm', 'is', 'jar');
  n('keptuvė', 'сковорода', 'f', 'ė', 'pan');
  n('dangtis', 'крышка', 'm', 'is', 'lid');
  n('arbatinukas', 'заварочный чайник', 'm', 'as', 'teapot');
  n('virdulys', 'электрический чайник', 'm', 'ys', 'kettle');
  n('samtis', 'половник', 'm', 'is', 'cutlery');
  n('trintuvė', 'тёрка', 'f', 'ė', 'tool');
  n('sietelis', 'ситечко', 'm', 'is', 'tool');
  n('padėklas', 'поднос', 'm', 'as', 'tray');
  n('vonia', 'ванна', 'f', 'a', 'bath', 'Vonia — сама ванна. Название комнаты — vonios kambarys.');
  n('praustuvas', 'умывальник', 'm', 'as', 'sink');
  n('kriauklė', 'раковина', 'f', 'ė', 'sink');
  n('čiaupas', 'кран', 'm', 'as', 'tap');
  n('šaldytuvas', 'холодильник', 'm', 'as', 'appliance');
  n('viryklė', 'плита', 'f', 'ė', 'appliance');
  n('orkaitė', 'духовка', 'f', 'ė', 'appliance');
  n('indaplovė', 'посудомоечная машина', 'f', 'ė', 'appliance');
  n('šviestuvas', 'светильник', 'm', 'as', 'lamp');
  n('šluota', 'метла; веник', 'f', 'a', 'tool');
  n('kibiras', 'ведро', 'm', 'as', 'bucket');
  n('šepetys', 'щётка', 'm', 'ys', 'tool');
  n('muilas', 'мыло', 'm', 'as', 'soap');
  n('balkonas', 'балкон', 'm', 'as', 'room');
  n('virtuvė', 'кухня', 'f', 'ė', 'room');
  n('sodas', 'сад', 'm', 'as', 'yard');


  /* --- предметы сцен опубликованной версии (приложение 37 ТЗ) --- */
  n('lentelė', 'дощечка', 'f', 'ė', 'tool');
  n('kočėlas', 'скалка', 'm', 'as', 'tool');
  n('mentelė', 'лопатка', 'f', 'ė', 'tool');
  n('indelis', 'ёмкость; баночка', 'm', 'is', 'jar');
  n('cukrinė', 'сахарница', 'f', 'ė', 'jar');
  n('druskinė', 'солонка', 'f', 'ė', 'jar');
  n('šaldiklis', 'морозильник', 'm', 'is', 'appliance');
  n('mikrobangė', 'микроволновка', 'f', 'ė', 'appliance');
  n('skrudintuvas', 'тостер', 'm', 'as', 'appliance');
  n('plakiklis', 'миксер', 'm', 'is', 'appliance');
  n('trintuvas', 'измельчитель; блендер', 'm', 'as', 'appliance');
  n('skalbyklė', 'стиральная машина', 'f', 'ė', 'appliance');
  n('džiovyklė', 'сушильная машина', 'f', 'ė', 'appliance');
  n('lygintuvas', 'утюг', 'm', 'as', 'appliance');
  n('ventiliatorius', 'вентилятор', 'm', 'ius', 'appliance');
  n('šildytuvas', 'обогреватель', 'm', 'as', 'appliance');
  n('žibintuvėlis', 'фонарик', 'm', 'is', 'device');
  n('radijas', 'радиоприёмник', 'm', 'as', 'device');
  n('spausdintuvas', 'принтер', 'm', 'as', 'device');
  n('monitorius', 'монитор', 'm', 'ius', 'device');
  n('klaviatūra', 'клавиатура', 'f', 'a', 'tool');
  n('pelė', 'компьютерная мышь', 'f', 'ė', 'tool');
  n('pultelis', 'пульт', 'm', 'is', 'tool');
  n('įkroviklis', 'зарядное устройство', 'm', 'is', 'tool');
  n('laidas', 'провод', 'm', 'as', 'tool');
  n('baterija', 'батарейка', 'f', 'a', 'tool');
  n('lemputė', 'лампочка', 'f', 'ė', 'tool');
  n('laikrodis', 'часы', 'm', 'is', 'decor');
  n('vaza', 'ваза', 'f', 'a', 'decor');
  n('žvakė', 'свеча', 'f', 'ė', 'decor');
  n('žvakidė', 'подсвечник', 'f', 'ė', 'decor');
  n('vazonas', 'цветочный горшок', 'm', 'as', 'jar');
  n('rėmelis', 'рамка', 'm', 'is', 'decor');
  n('figūrėlė', 'статуэтка', 'f', 'ė', 'decor');
  n('dėklas', 'футляр; чехол', 'm', 'as', 'tool');
  n('pakaba', 'вешалка', 'f', 'a', 'tool');
  n('kempinė', 'губка', 'f', 'ė', 'tool');
  n('muilinė', 'мыльница', 'f', 'ė', 'jar');
  n('lentynėlė', 'полочка', 'f', 'ė', 'furniture');
  n('stalčius', 'выдвижной ящик', 'm', 'ius', 'box');
  n('rankenėlė', 'ручка; рукоятка', 'f', 'ė', 'tool');
  n('jungiklis', 'выключатель', 'm', 'is', 'tool');
  n('lizdas', 'розетка; гнездо', 'm', 'as', 'tap');
  n('plaktukas', 'молоток', 'm', 'as', 'tool');
  n('atsuktuvas', 'отвёртка', 'm', 'as', 'tool');
  n('varžtas', 'болт; винт', 'm', 'as', 'tool');
  n('vinis', 'гвоздь', 'f', 'is3', 'tool', 'Женский род третьего склонения: ji vinis, ką? vinį; jos vinys, ką? vinis.');
  n('liniuotė', 'линейка', 'f', 'ė', 'tool');
  n('trintukas', 'ластик', 'm', 'as', 'tool');
  n('segtuvas', 'папка-регистратор', 'm', 'as', 'notebook');
  n('vokas', 'конверт', 'm', 'as', 'letter');
  n('kalendorius', 'календарь', 'm', 'ius', 'notebook');
  n('žurnalas', 'журнал', 'm', 'as', 'book');

  /* --- еда и напитки --- */
  n('duona', 'хлеб', 'f', 'a', 'food-cut');
  n('pyragas', 'пирог', 'm', 'as', 'baked');
  n('tortas', 'торт', 'm', 'as', 'baked');
  n('sausainis', 'печенье', 'm', 'is', 'baked');
  n('kiaušinis', 'яйцо', 'm', 'is', 'egg');
  n('mėsa', 'мясо', 'f', 'a', 'meat');
  n('dešra', 'колбаса', 'f', 'a', 'food-cut');
  n('sriuba', 'суп', 'f', 'a', 'soup');
  n('kava', 'кофе', 'f', 'a', 'drink');
  n('arbata', 'чай', 'f', 'a', 'drink');
  n('pienas', 'молоко', 'm', 'as', 'drink');
  x('sultys', 'сок', 'f', ['', 'sultys'], ['', 'sultis'], 'drink', 'Только множественное: jos sultys.');
  n('riešutas', 'орех', 'm', 'as', 'berry');
  n('vaisius', 'фрукт', 'm', 'ius', 'fruit-buy');
  n('daržovė', 'овощ', 'f', 'ė', 'vegetable');
  x('salotos', 'салат', 'f', ['', 'salotos'], ['', 'salotas'], 'dish', 'Только множественное: jos salotos.');
  x('koldūnai', 'пельмени', 'm', ['', 'koldūnai'], ['', 'koldūnus'], 'dish', 'Только множественное: jie koldūnai.');
  x('miltai', 'мука', 'm', ['', 'miltai'], ['', 'miltus'], 'pantry', 'Только множественное: jie miltai.');
  x('cukrus', 'сахар', 'm', ['cukrus', ''], ['cukrų', ''], 'pantry', 'Вещество: тренируем единственное.');
  x('druska', 'соль', 'f', ['druska', ''], ['druską', ''], 'pantry', 'Вещество: тренируем единственное.');
  x('aliejus', 'растительное масло', 'm', ['aliejus', ''], ['aliejų', ''], 'pantry', 'Вещество: тренируем единственное.');
  x('sviestas', 'сливочное масло', 'm', ['sviestas', ''], ['sviestą', ''], 'pantry', 'Вещество: тренируем единственное.');
  x('medus', 'мёд', 'm', ['medus', ''], ['medų', ''], 'pantry', 'Вещество: тренируем единственное.');
  x('ledai', 'мороженое', 'm', ['', 'ledai'], ['', 'ledus'], 'dish', 'Только множественное в этом значении: jie ledai.');

  /* --- одежда --- */
  n('suknelė', 'платье', 'f', 'ė', 'clothes-torso');
  n('sijonas', 'юбка', 'm', 'as', 'clothes-torso');
  n('striukė', 'куртка', 'f', 'ė', 'clothes-torso');
  n('paltas', 'пальто', 'm', 'as', 'clothes-torso');
  x('marškiniai', 'рубашка', 'm', ['', 'marškiniai'], ['', 'marškinius'], 'clothes-torso', 'Только множественное: jie marškiniai — одна рубашка.');
  n('kepurė', 'шапка', 'f', 'ė', 'clothes-head');
  n('batas', 'ботинок', 'm', 'as', 'clothes-feet');
  n('pirštinė', 'перчатка', 'f', 'ė', 'clothes-hands');
  n('šalikas', 'шарф', 'm', 'as', 'clothes-head');
  n('kojinė', 'носок', 'f', 'ė', 'clothes-feet');
  x('drabužiai', 'одежда', 'm', ['', 'drabužiai'], ['', 'drabužius'], 'clothes-torso', 'Только множественное в этом значении: jie drabužiai.');

  /* --- люди, животные --- */
  n('draugas', 'друг', 'm', 'as', 'person');
  n('draugė', 'подруга', 'f', 'ė', 'person');
  n('mokytojas', 'учитель', 'm', 'as', 'person');
  n('mokytoja', 'учительница', 'f', 'a', 'person');
  n('gydytojas', 'врач', 'm', 'as', 'person');
  n('tėvas', 'отец', 'm', 'as', 'person');
  n('tėtis', 'папа', 'm', 'is', 'person');
  n('dukra', 'дочь', 'f', 'a', 'person');
  x('sesuo', 'сестра', 'f', ['sesuo', 'seserys'], ['seserį', 'seseris'], 'person', 'Особая основа seser-. В быту чаще sesė.');
  n('močiutė', 'бабушка', 'f', 'ė', 'person');
  n('senelis', 'дедушка', 'm', 'is', 'person');
  n('kaimynas', 'сосед', 'm', 'as', 'person');
  n('studentas', 'студент', 'm', 'as', 'person');
  n('vairuotojas', 'водитель', 'm', 'as', 'person');
  n('pardavėjas', 'продавец', 'm', 'as', 'person');
  n('klientas', 'клиент', 'm', 'as', 'person');
  n('svečias', 'гость', 'm', 'ias', 'person');
  n('katė', 'кошка', 'f', 'ė', 'pet');
  n('karvė', 'корова', 'f', 'ė', 'farm-animal');
  n('arklys', 'лошадь', 'm', 'ys', 'farm-animal');
  n('kiaulė', 'свинья', 'f', 'ė', 'farm-animal');
  n('avis', 'овца', 'f', 'is3', 'farm-animal');
  n('paukštis', 'птица', 'm', 'is', 'wild-animal');

  /* --- места, транспорт, природа, время --- */
  n('mokykla', 'школа', 'f', 'a', 'building');
  n('biblioteka', 'библиотека', 'f', 'a', 'building');
  n('parduotuvė', 'магазин', 'f', 'ė', 'building');
  n('kavinė', 'кафе', 'f', 'ė', 'building');
  n('vaistinė', 'аптека', 'f', 'ė', 'building');
  n('ligoninė', 'больница', 'f', 'ė', 'building');
  n('bažnyčia', 'церковь', 'f', 'a', 'building');
  n('tiltas', 'мост', 'm', 'as', 'structure');
  n('upė', 'река', 'f', 'ė', 'nature-place');
  n('ežeras', 'озеро', 'm', 'as', 'nature-place');
  n('jūra', 'море', 'f', 'a', 'nature-place');
  n('kalnas', 'гора', 'm', 'as', 'nature-place');
  n('miškas', 'лес', 'm', 'as', 'forest');
  n('laukas', 'поле', 'm', 'as', 'nature-place');
  n('dviratis', 'велосипед', 'm', 'is', 'bike');
  n('autobusas', 'автобус', 'm', 'as', 'transport');
  n('traukinys', 'поезд', 'm', 'ys', 'transport');
  n('lėktuvas', 'самолёт', 'm', 'as', 'transport');
  n('laivas', 'корабль', 'm', 'as', 'transport');
  n('medis', 'дерево', 'm', 'is', 'tree');
  n('lapas', 'лист', 'm', 'as', 'leaf');
  x('akmuo', 'камень', 'm', ['akmuo', 'akmenys'], ['akmenį', 'akmenis'], 'stone', 'Особая основа akmen-.');
  x('sniegas', 'снег', 'm', ['sniegas', ''], ['sniegą', ''], 'snow', 'Тренируем единственное.');
  n('saulė', 'солнце', 'f', 'ė', 'sky');
  n('mėnulis', 'луна', 'm', 'is', 'sky');
  n('žvaigždė', 'звезда', 'f', 'ė', 'sky');
  n('žaislas', 'игрушка', 'm', 'as', 'toy');
  n('kamuolys', 'мяч', 'm', 'ys', 'ball');
  n('lėlė', 'кукла', 'f', 'ė', 'toy');
  n('dovana', 'подарок', 'f', 'a', 'gift');
  x('pinigai', 'деньги', 'm', ['', 'pinigai'], ['', 'pinigus'], 'money', 'Только множественное: jie pinigai.');
  n('darbas', 'работа', 'm', 'as', 'work');
  n('kalba', 'язык (речь)', 'f', 'a', 'language');
  n('žodis', 'слово', 'm', 'is', 'word');
  n('sakinys', 'предложение', 'm', 'ys', 'word');
  n('klausimas', 'вопрос', 'm', 'as', 'question');
  n('atsakymas', 'ответ', 'm', 'as', 'question');
  n('užduotis', 'задание', 'f', 'is3', 'task');
  n('pamoka', 'урок', 'f', 'a', 'lesson');
  n('daina', 'песня', 'f', 'a', 'song');
  n('filmas', 'фильм', 'm', 'as', 'film');
  x('muzika', 'музыка', 'f', ['muzika', ''], ['muziką', ''], 'music', 'Тренируем единственное.');
  n('šventė', 'праздник', 'f', 'ė', 'holiday');
  n('gimtadienis', 'день рождения', 'm', 'is', 'holiday');
  n('diena', 'день', 'f', 'a', 'time');
  n('naktis', 'ночь', 'f', 'is3', 'time');
  n('savaitė', 'неделя', 'f', 'ė', 'time');
  x('mėnuo', 'месяц', 'm', ['mėnuo', 'mėnesiai'], ['mėnesį', 'mėnesius'], 'time', 'Особая основа mėnes-.');
  x('metai', 'год; годы', 'm', ['', 'metai'], ['', 'metus'], 'time', 'Только множественное: jie metai — и один год тоже.');
  n('vasara', 'лето', 'f', 'a', 'season');
  n('žiema', 'зима', 'f', 'a', 'season');
  x('ruduo', 'осень', 'm', ['ruduo', 'rudenys'], ['rudenį', 'rudenis'], 'season', 'Особая основа ruden-. Мужской род.');
  n('pavasaris', 'весна', 'm', 'is', 'season', 'Мужской род, хотя по-русски «весна» — женского.');

  /* ---------- прилагательные ---------- */
  var ADJS = [];
  var ADJ = {};
  // a(id, перевод). Группа определяется по окончанию; kind — точная модель.
  function a(id, ru, kind) {
    var st, nom, acc, group;
    if (!kind) {
      if (/ias$/.test(id)) kind = 'ias';
      else if (/as$/.test(id)) kind = 'as';
      else if (/us$/.test(id)) kind = 'us';
      else if (/inis$|onis$|ienis$/.test(id)) kind = 'inis';
      else if (/is$/.test(id)) kind = 'is';
    }
    switch (kind) {
      case 'as':   st = id.slice(0, -2); group = 'as';
        nom = [id, st + 'a', st + 'i', st + 'os']; acc = [st + 'ą', st + 'ą', st + 'us', st + 'as']; break;
      case 'ias':  st = id.slice(0, -3); group = 'as';
        nom = [id, st + 'ia', depal(st) + 'i', st + 'ios']; acc = [st + 'ią', st + 'ią', st + 'ius', st + 'ias']; break;
      case 'us':   st = id.slice(0, -2); group = 'us';
        nom = [id, st + 'i', st + 'ūs', pal(st) + 'ios']; acc = [st + 'ų', pal(st) + 'ią', pal(st) + 'ius', pal(st) + 'ias']; break;
      case 'is':   st = id.slice(0, -2); group = 'is';
        nom = [id, st + 'ė', st + 'i', st + 'ės']; acc = [st + 'į', st + 'ę', st + 'ius', st + 'es']; break;
      case 'inis': st = id.slice(0, -2); group = 'is';
        nom = [id, st + 'ė', st + 'iai', st + 'ės']; acc = [st + 'į', st + 'ę', st + 'ius', st + 'es']; break;
      default: throw new Error('unknown adjective kind for ' + id);
    }
    if (ADJ[id]) throw new Error('duplicate adjective ' + id);
    var o = { id: id, ru: ru, group: group, kind: kind, nom: nom, acc: acc };
    ADJS.push(o); ADJ[id] = o;
  }

  // -as / -ias
  a('naujas', 'новый'); a('senas', 'старый'); a('geras', 'хороший'); a('blogas', 'плохой');
  a('baltas', 'белый'); a('juodas', 'чёрный'); a('raudonas', 'красный'); a('geltonas', 'жёлтый');
  a('mėlynas', 'синий'); a('rudas', 'коричневый'); a('pilkas', 'серый'); a('rausvas', 'розовый');
  a('žalias', 'зелёный'); a('šlapias', 'мокрый'); a('tuščias', 'пустой'); a('šviežias', 'свежий');
  a('šaltas', 'холодный'); a('karštas', 'горячий'); a('šiltas', 'тёплый'); a('lengvas', 'лёгкий');
  a('mažas', 'маленький'); a('ilgas', 'длинный'); a('trumpas', 'короткий'); a('aukštas', 'высокий');
  a('žemas', 'низкий'); a('storas', 'толстый'); a('plonas', 'тонкий'); a('sausas', 'сухой');
  a('pilnas', 'полный'); a('kreivas', 'кривой'); a('kietas', 'твёрдый'); a('minkštas', 'мягкий');
  a('siauras', 'узкий'); a('silpnas', 'слабый'); a('greitas', 'быстрый'); a('lėtas', 'медленный');
  a('jaunas', 'молодой'); a('linksmas', 'весёлый'); a('liūdnas', 'грустный'); a('protingas', 'умный');
  a('sveikas', 'здоровый'); a('laimingas', 'счастливый'); a('mielas', 'милый'); a('spalvotas', 'цветной');
  a('margas', 'пёстрый'); a('tikras', 'настоящий'); a('paprastas', 'простой'); a('sudėtingas', 'сложный');
  a('skystas', 'жидкий'); a('tirštas', 'густой'); a('sultingas', 'сочный'); a('drėgnas', 'влажный');
  a('mėgstamas', 'любимый'); a('brangus', 'дорогой'); a('pigus', 'дешёвый');
  // -us
  a('gražus', 'красивый'); a('negražus', 'некрасивый'); a('švarus', 'чистый'); a('nešvarus', 'грязный');
  a('ramus', 'спокойный'); a('malonus', 'приятный'); a('saldus', 'сладкий'); a('sūrus', 'солёный');
  a('rūgštus', 'кислый'); a('kartus', 'горький'); a('skanus', 'вкусный'); a('gardus', 'вкусный; лакомый');
  a('platus', 'широкий'); a('gilus', 'глубокий'); a('seklus', 'мелкий (неглубокий)'); a('stiprus', 'сильный');
  a('šviesus', 'светлый'); a('tamsus', 'тёмный'); a('tylus', 'тихий'); a('garsus', 'громкий; известный');
  a('drąsus', 'смелый'); a('švelnus', 'мягкий; нежный'); a('sunkus', 'тяжёлый; трудный'); a('svarbus', 'важный');
  a('įdomus', 'интересный'); a('patogus', 'удобный'); a('nepatogus', 'неудобный'); a('saugus', 'безопасный');
  a('apvalus', 'круглый'); a('tiesus', 'прямой'); a('aštrus', 'острый'); a('skaidrus', 'прозрачный');
  a('ryškus', 'яркий'); a('blyškus', 'бледный'); a('grubus', 'грубый'); a('lygus', 'ровный; гладкий');
  a('šiurkštus', 'шершавый'); a('stambus', 'крупный'); a('smulkus', 'мелкий (небольшой)'); a('sotus', 'сытый');
  a('modernus', 'современный');
  // -is / -inis
  a('didelis', 'большой'); a('nedidelis', 'небольшой');
  a('stiklinis', 'стеклянный'); a('medinis', 'деревянный'); a('metalinis', 'металлический'); a('plastikinis', 'пластиковый');
  a('popierinis', 'бумажный'); a('odinis', 'кожаный'); a('auksinis', 'золотой'); a('sidabrinis', 'серебряный');
  a('akmeninis', 'каменный'); a('molinis', 'глиняный'); a('geležinis', 'железный'); a('vilnonis', 'шерстяной');
  a('medvilninis', 'хлопковый'); a('šilkinis', 'шёлковый'); a('keraminis', 'керамический'); a('porcelianinis', 'фарфоровый');
  a('naminis', 'домашний'); a('kasdienis', 'повседневный'); a('elektrinis', 'электрический'); a('žieminis', 'зимний');
  a('vasarinis', 'летний'); a('rytinis', 'утренний'); a('vakarinis', 'вечерний'); a('senovinis', 'старинный');
  a('virtuvinis', 'кухонный'); a('oranžinis', 'оранжевый'); a('violetinis', 'фиолетовый');
  a('mokyklinis', 'школьный'); a('skaitmeninis', 'цифровой');
  // из сцен опубликованной версии
  a('naudingas', 'полезный'); a('reikalingas', 'нужный'); a('tvirtas', 'прочный'); a('aiškus', 'ясный; понятный');

  /* ---------- глаголы ---------- */
  var VERBS = [];
  var VERB = {};
  // v(инфинитив, перевод, 3-е лицо настоящего, 3-е лицо прошедшего, {fut3, imp, note})
  function v(id, ru, now, past, o) {
    if (VERB[id]) throw new Error('duplicate verb ' + id);
    o = o || {};
    var r = { id: id, ru: ru, now: now, past: past, fut3: o.fut3 || '', imp: o.imp || '', note: o.note || '' };
    VERBS.push(r); VERB[id] = r;
  }
  v('atidaryti', 'открыть; открывать', 'atidaro', 'atidarė');
  v('uždaryti', 'закрыть; закрывать', 'uždaro', 'uždarė');
  v('praverti', 'приоткрыть', 'praveria', 'pravėrė');
  v('plauti', 'мыть', 'plauna', 'plovė');
  v('nuplauti', 'вымыть; смыть', 'nuplauna', 'nuplovė');
  v('išplauti', 'вымыть (изнутри)', 'išplauna', 'išplovė');
  v('valyti', 'чистить; убирать', 'valo', 'valė');
  v('nuvalyti', 'очистить; протереть', 'nuvalo', 'nuvalė');
  v('išvalyti', 'вычистить; убрать', 'išvalo', 'išvalė');
  v('šluostyti', 'вытирать', 'šluosto', 'šluostė');
  v('nušluostyti', 'вытереть', 'nušluosto', 'nušluostė');
  v('keisti', 'менять', 'keičia', 'keitė');
  v('pakeisti', 'заменить', 'pakeičia', 'pakeitė');
  v('matuoti', 'измерять', 'matuoja', 'matavo');
  v('išmatuoti', 'измерить', 'išmatuoja', 'išmatavo');
  v('taisyti', 'чинить', 'taiso', 'taisė');
  v('sutaisyti', 'починить', 'sutaiso', 'sutaisė');
  v('pirkti', 'покупать', 'perka', 'pirko');
  v('nupirkti', 'купить', 'nuperka', 'nupirko');
  v('parduoti', 'продавать; продать', 'parduoda', 'pardavė');
  v('dažyti', 'красить', 'dažo', 'dažė');
  v('nudažyti', 'покрасить', 'nudažo', 'nudažė');
  v('statyti', 'ставить; строить', 'stato', 'statė');
  v('pastatyti', 'поставить; построить', 'pastato', 'pastatė');
  v('dėti', 'класть; ставить', 'deda', 'dėjo');
  v('kelti', 'поднимать', 'kelia', 'kėlė');
  v('pakelti', 'поднять', 'pakelia', 'pakėlė');
  v('nešti', 'нести', 'neša', 'nešė');
  v('atnešti', 'принести', 'atneša', 'atnešė');
  v('imti', 'брать', 'ima', 'ėmė');
  v('paimti', 'взять', 'paima', 'paėmė');
  v('laikyti', 'держать; хранить', 'laiko', 'laikė');
  v('rasti', 'находить; найти', 'randa', 'rado');
  v('surasti', 'отыскать', 'suranda', 'surado');
  v('pamesti', 'потерять', 'pameta', 'pametė');
  v('turėti', 'иметь', 'turi', 'turėjo');
  v('matyti', 'видеть', 'mato', 'matė');
  v('mylėti', 'любить', 'myli', 'mylėjo');
  v('mėgti', 'любить (нравится)', 'mėgsta', 'mėgo');
  v('skaityti', 'читать', 'skaito', 'skaitė');
  v('perskaityti', 'прочитать', 'perskaito', 'perskaitė');
  v('rašyti', 'писать', 'rašo', 'rašė');
  v('parašyti', 'написать', 'parašo', 'parašė');
  v('siųsti', 'отправлять', 'siunčia', 'siuntė');
  v('išsiųsti', 'отправить', 'išsiunčia', 'išsiuntė');
  v('gauti', 'получать; получить', 'gauna', 'gavo');
  v('valgyti', 'есть', 'valgo', 'valgė');
  v('suvalgyti', 'съесть', 'suvalgo', 'suvalgė');
  v('gerti', 'пить', 'geria', 'gėrė');
  v('išgerti', 'выпить', 'išgeria', 'išgėrė');
  v('virti', 'варить', 'verda', 'virė');
  v('išvirti', 'сварить', 'išverda', 'išvirė');
  v('kepti', 'печь; жарить', 'kepa', 'kepė');
  v('iškepti', 'испечь; изжарить', 'iškepa', 'iškepė');
  v('pjaustyti', 'резать (на куски)', 'pjausto', 'pjaustė');
  v('supjaustyti', 'нарезать', 'supjausto', 'supjaustė');
  v('rinkti', 'собирать', 'renka', 'rinko');
  v('surinkti', 'собрать', 'surenka', 'surinko');
  v('skinti', 'рвать; срывать', 'skina', 'skynė');
  v('nuskinti', 'сорвать', 'nuskina', 'nuskynė');
  v('skalbti', 'стирать', 'skalbia', 'skalbė');
  v('išskalbti', 'выстирать', 'išskalbia', 'išskalbė');
  v('lyginti', 'гладить (утюгом)', 'lygina', 'lygino');
  v('išlyginti', 'выгладить', 'išlygina', 'išlygino');
  v('džiovinti', 'сушить', 'džiovina', 'džiovino');
  v('išdžiovinti', 'высушить', 'išdžiovina', 'išdžiovino');
  v('kloti', 'стелить', 'kloja', 'klojo');
  v('pakloti', 'застелить', 'pakloja', 'paklojo');
  v('lankstyti', 'складывать', 'lanksto', 'lankstė');
  v('sulankstyti', 'сложить', 'sulanksto', 'sulankstė');
  v('kabinti', 'вешать', 'kabina', 'kabino');
  v('pakabinti', 'повесить', 'pakabina', 'pakabino');
  v('nukabinti', 'снять (с крючка)', 'nukabina', 'nukabino');
  v('įjungti', 'включить', 'įjungia', 'įjungė');
  v('išjungti', 'выключить', 'išjungia', 'išjungė');
  v('įkrauti', 'зарядить', 'įkrauna', 'įkrovė');
  v('uždegti', 'зажечь', 'uždega', 'uždegė');
  v('užgesinti', 'погасить', 'užgesina', 'užgesino');
  v('pilti', 'лить; наливать', 'pila', 'pylė');
  v('įpilti', 'налить', 'įpila', 'įpylė');
  v('išpilti', 'вылить', 'išpila', 'išpylė');
  v('uždengti', 'накрыть', 'uždengia', 'uždengė');
  v('atidengti', 'открыть (снять крышку)', 'atidengia', 'atidengė');
  v('sudaužyti', 'разбить', 'sudaužo', 'sudaužė');
  v('rakinti', 'запирать', 'rakina', 'rakino');
  v('užrakinti', 'запереть', 'užrakina', 'užrakino');
  v('atrakinti', 'отпереть', 'atrakina', 'atrakino');
  v('tikrinti', 'проверять', 'tikrina', 'tikrino');
  v('patikrinti', 'проверить', 'patikrina', 'patikrino');
  v('rodyti', 'показывать', 'rodo', 'rodė');
  v('parodyti', 'показать', 'parodo', 'parodė');
  v('fotografuoti', 'фотографировать', 'fotografuoja', 'fotografavo');
  v('nufotografuoti', 'сфотографировать', 'nufotografuoja', 'nufotografavo');
  v('tvarkyti', 'убирать; приводить в порядок', 'tvarko', 'tvarkė');
  v('sutvarkyti', 'прибрать', 'sutvarko', 'sutvarkė');
  v('vėdinti', 'проветривать', 'vėdina', 'vėdino');
  v('išvėdinti', 'проветрить', 'išvėdina', 'išvėdino');
  v('šildyti', 'греть', 'šildo', 'šildė');
  v('pašildyti', 'подогреть', 'pašildo', 'pašildė');
  v('stumti', 'толкать; двигать', 'stumia', 'stūmė');
  v('pastumti', 'подвинуть', 'pastumia', 'pastūmė');
  v('traukti', 'тянуть', 'traukia', 'traukė');
  v('ištraukti', 'вытащить', 'ištraukia', 'ištraukė');
  v('sodinti', 'сажать', 'sodina', 'sodino');
  v('pasodinti', 'посадить', 'pasodina', 'pasodino');
  v('laistyti', 'поливать', 'laisto', 'laistė');
  v('palaistyti', 'полить', 'palaisto', 'palaistė');
  v('mesti', 'бросать', 'meta', 'metė');
  v('išmesti', 'выбросить', 'išmeta', 'išmetė');
  v('spausdinti', 'печатать', 'spausdina', 'spausdino');
  v('atspausdinti', 'распечатать', 'atspausdina', 'atspausdino');
  v('pildyti', 'заполнять', 'pildo', 'pildė');
  v('užpildyti', 'заполнить', 'užpildo', 'užpildė');
  v('versti', 'переводить', 'verčia', 'vertė');
  v('išversti', 'перевести', 'išverčia', 'išvertė');
  v('kviesti', 'приглашать; звать', 'kviečia', 'kvietė');
  v('pakviesti', 'пригласить', 'pakviečia', 'pakvietė');
  v('sutikti', 'встречать; встретить', 'sutinka', 'sutiko');
  v('lydėti', 'сопровождать', 'lydi', 'lydėjo');
  v('palydėti', 'проводить (кого-то)', 'palydi', 'palydėjo');
  v('apkabinti', 'обнять', 'apkabina', 'apkabino');
  v('bučiuoti', 'целовать', 'bučiuoja', 'bučiavo');
  v('pabučiuoti', 'поцеловать', 'pabučiuoja', 'pabučiavo');
  v('prausti', 'умывать', 'prausia', 'prausė', { note: 'Будущее aš совпадает с настоящим: prausiu.' });
  v('gerbti', 'уважать', 'gerbia', 'gerbė');
  v('suprasti', 'понимать; понять', 'supranta', 'suprato');
  v('girdėti', 'слышать', 'girdi', 'girdėjo');
  v('aprengti', 'одеть (кого-то)', 'aprengia', 'aprengė');
  v('maitinti', 'кормить', 'maitina', 'maitino');
  v('mokyti', 'учить (кого-то)', 'moko', 'mokė');
  v('gydyti', 'лечить', 'gydo', 'gydė');
  v('vesti', 'вести; выгуливать', 'veda', 'vedė');
  v('glostyti', 'гладить (рукой)', 'glosto', 'glostė');
  v('gaudyti', 'ловить', 'gaudo', 'gaudė');
  v('lankyti', 'посещать', 'lanko', 'lankė');
  v('aplankyti', 'навестить; посетить', 'aplanko', 'aplankė');
  v('nuomoti', 'сдавать (в аренду)', 'nuomoja', 'nuomojo');
  v('remontuoti', 'ремонтировать', 'remontuoja', 'remontavo');
  v('kirsti', 'рубить', 'kerta', 'kirto');
  v('dovanoti', 'дарить', 'dovanoja', 'dovanojo');
  v('padovanoti', 'подарить', 'padovanoja', 'padovanojo');
  v('kasti', 'копать', 'kasa', 'kasė');
  v('piešti', 'рисовать', 'piešia', 'piešė', { note: 'Будущее aš совпадает с настоящим: piešiu.' });
  v('praleisti', 'провести (время); пропустить', 'praleidžia', 'praleido');
  v('planuoti', 'планировать', 'planuoja', 'planavo');
  v('švęsti', 'праздновать', 'švenčia', 'šventė');
  v('vairuoti', 'водить (машину)', 'vairuoja', 'vairavo');
  v('skaičiuoti', 'считать', 'skaičiuoja', 'skaičiavo');
  v('taupyti', 'копить; экономить', 'taupo', 'taupė');
  v('leisti', 'тратить; позволять', 'leidžia', 'leido');
  v('išleisti', 'потратить', 'išleidžia', 'išleido');
  v('mokėti', 'уметь; знать (язык)', 'moka', 'mokėjo');
  v('vartoti', 'употреблять', 'vartoja', 'vartojo');
  v('kartoti', 'повторять', 'kartoja', 'kartojo');
  v('pakartoti', 'повторить', 'pakartoja', 'pakartojo');
  v('sakyti', 'говорить; сказать', 'sako', 'sakė');
  v('pasakyti', 'сказать', 'pasako', 'pasakė');
  v('tarti', 'произносить', 'taria', 'tarė');
  v('ištarti', 'произнести', 'ištaria', 'ištarė');
  v('dainuoti', 'петь', 'dainuoja', 'dainavo');
  v('žiūrėti', 'смотреть', 'žiūri', 'žiūrėjo');
  v('kurti', 'создавать', 'kuria', 'kūrė');
  v('sukurti', 'создать', 'sukuria', 'sukūrė');
  v('pradėti', 'начинать; начать', 'pradeda', 'pradėjo');
  v('baigti', 'заканчивать; закончить', 'baigia', 'baigė');
  v('ragauti', 'пробовать (на вкус)', 'ragauja', 'ragavo');
  v('paragauti', 'попробовать', 'paragauja', 'paragavo');
  v('sūdyti', 'солить', 'sūdo', 'sūdė');
  v('dėvėti', 'носить (одежду)', 'dėvi', 'dėvėjo');
  v('vilkėti', 'носить (на торсе)', 'vilki', 'vilkėjo');
  v('avėti', 'носить (обувь)', 'avi', 'avėjo');
  v('mūvėti', 'носить (перчатки, брюки)', 'mūvi', 'mūvėjo');
  v('dengti', 'покрывать', 'dengia', 'dengė');
  // из сцен опубликованной версии (приложение 37)
  v('atverti', 'открыть; распахнуть', 'atveria', 'atvėrė');
  v('užverti', 'закрыть; притворить', 'užveria', 'užvėrė');
  v('įstatyti', 'вставить', 'įstato', 'įstatė');
  v('išimti', 'вынуть', 'išima', 'išėmė');
  v('dekoruoti', 'украшать', 'dekoruoja', 'dekoravo');
  v('apžiūrėti', 'осмотреть', 'apžiūri', 'apžiūrėjo');
  v('užsakyti', 'заказать', 'užsako', 'užsakė');
  v('pasirinkti', 'выбрать', 'pasirenka', 'pasirinko', { note: 'Возвратный глагол: -si- стоит после приставки, окончания обычные.' });
  v('supakuoti', 'упаковать', 'supakuoja', 'supakavo');
  v('išpakuoti', 'распаковать', 'išpakuoja', 'išpakavo');
  v('nulupti', 'очистить (от кожуры)', 'nulupa', 'nulupo');
  v('pasverti', 'взвесить', 'pasveria', 'pasvėrė');
  v('rūšiuoti', 'сортировать', 'rūšiuoja', 'rūšiavo');
  v('naudoti', 'использовать', 'naudoja', 'naudojo');
  v('kopijuoti', 'копировать', 'kopijuoja', 'kopijavo');
  v('redaguoti', 'редактировать', 'redaguoja', 'redagavo');
  v('perrašyti', 'переписать', 'perrašo', 'perrašė');
  v('auginti', 'выращивать', 'augina', 'augino');
  v('pernešti', 'перенести', 'perneša', 'pernešė');
  v('padėti', 'положить; поставить', 'padeda', 'padėjo', { note: 'В значении «помочь» тот же глагол требует kam? (дательный): padėti draugui. Здесь — только «положить»: padėti knygą.' });
  v('kirpti', 'стричь; резать (ножницами)', 'kerpa', 'kirpo');

  /* ---------- спряжение ---------- */
  function conjugate(verb) {
    var p3 = verb.now, s3 = verb.past, b, pres, past;
    if (/ia$/.test(p3)) { b = p3.slice(0, -2); pres = [b + 'iu', depal(b) + 'i', p3, b + 'iame', b + 'iate', p3]; }
    else if (/a$/.test(p3)) { b = p3.slice(0, -1); pres = [b + 'u', b + 'i', p3, b + 'ame', b + 'ate', p3]; }
    else if (/o$/.test(p3)) { b = p3.slice(0, -1); pres = [b + 'au', b + 'ai', p3, b + 'ome', b + 'ote', p3]; }
    else if (/i$/.test(p3)) { b = p3.slice(0, -1); pres = [pal(b) + 'iu', p3, p3, b + 'ime', b + 'ite', p3]; }
    else throw new Error('present pattern ' + p3);
    if (/o$/.test(s3)) { b = s3.slice(0, -1); past = [b + 'au', b + 'ai', s3, b + 'ome', b + 'ote', s3]; }
    else if (/ė$/.test(s3)) { b = s3.slice(0, -1); past = [pal(b) + 'iau', b + 'ei', s3, b + 'ėme', b + 'ėte', s3]; }
    else throw new Error('past pattern ' + s3);
    var st = verb.id.slice(0, -2), f3 = verb.fut3;
    if (!f3) {
      if (/[šž]$/.test(st)) f3 = st.slice(0, -1) + 'š';
      else if (/z$/.test(st)) f3 = st.slice(0, -1) + 's';
      else if (/s$/.test(st)) f3 = st;
      else f3 = st + 's';
    }
    var fut = [f3 + 'iu', f3 + 'i', f3, f3 + 'ime', f3 + 'ite', f3];
    var i2 = verb.imp;
    if (!i2) {
      if (/g$/.test(st)) i2 = st.slice(0, -1) + 'k';
      else if (/k$/.test(st)) i2 = st;
      else i2 = st + 'k';
    }
    var imp = ['—', i2, 'tegul ' + p3, i2 + 'ime', i2 + 'ite', 'tegul ' + p3];
    return { pres: pres, past: past, fut: fut, imp: imp };
  }

  /* ---------- местоимения действующего ---------- */
  var PRONOUNS = [
    { id: 'aš', ru: 'я', idx: 0 },
    { id: 'tu', ru: 'ты', idx: 1 },
    { id: 'jis', ru: 'он', idx: 2 },
    { id: 'ji', ru: 'она', idx: 2 },
    { id: 'mes', ru: 'мы', idx: 3 },
    { id: 'jūs', ru: 'вы', idx: 4 },
    { id: 'jie', ru: 'они (м. / смешанная группа)', idx: 5 },
    { id: 'jos', ru: 'они (ж.)', idx: 5 }
  ];

  /* ---------- тематические профили сцен ----------
     adj — восемь описаний (порядок важен: первое — стартовое),
     act — переходные действия, у которых объект стоит в Galininkas.  */
  var PROFILES = {
    window:   { adj: ['švarus', 'naujas', 'didelis', 'platus', 'stiklinis', 'šviesus', 'senas', 'nešvarus'],
                act: ['atidaryti', 'uždaryti', 'praverti', 'plauti', 'nuplauti', 'šluostyti', 'keisti', 'matuoti', 'taisyti'] },
    door:     { adj: ['naujas', 'senas', 'sunkus', 'lengvas', 'medinis', 'metalinis', 'baltas', 'rudas'],
                act: ['atidaryti', 'uždaryti', 'praverti', 'užrakinti', 'atrakinti', 'dažyti', 'nudažyti', 'keisti', 'taisyti', 'valyti'] },
    wall:     { adj: ['baltas', 'pilkas', 'aukštas', 'storas', 'plonas', 'švarus', 'lygus', 'akmeninis'],
                act: ['dažyti', 'nudažyti', 'valyti', 'nuvalyti', 'matuoti', 'išmatuoti', 'statyti', 'pastatyti', 'matyti'] },
    room:     { adj: ['didelis', 'mažas', 'šviesus', 'tamsus', 'šiltas', 'švarus', 'ramus', 'patogus'],
                act: ['tvarkyti', 'sutvarkyti', 'valyti', 'išvalyti', 'vėdinti', 'išvėdinti', 'šildyti', 'dažyti', 'remontuoti', 'matuoti', 'nuomoti', 'mėgti'] },
    home:     { adj: ['didelis', 'naujas', 'senas', 'gražus', 'šiltas', 'medinis', 'brangus', 'patogus'],
                act: ['pirkti', 'nupirkti', 'parduoti', 'statyti', 'pastatyti', 'remontuoti', 'nuomoti', 'tvarkyti', 'dažyti', 'matyti', 'mylėti', 'turėti'] },
    yard:     { adj: ['didelis', 'mažas', 'žalias', 'švarus', 'ramus', 'gražus', 'tylus', 'senas'],
                act: ['tvarkyti', 'sutvarkyti', 'valyti', 'matyti', 'mėgti', 'mylėti', 'fotografuoti', 'laistyti', 'turėti'] },
    place:    { adj: ['didelis', 'mažas', 'gražus', 'senas', 'ramus', 'žalias', 'tylus', 'mėgstamas'],
                act: ['matyti', 'mėgti', 'mylėti', 'lankyti', 'aplankyti', 'fotografuoti', 'nufotografuoti', 'rodyti', 'parodyti'] },
    road:     { adj: ['ilgas', 'trumpas', 'platus', 'siauras', 'tiesus', 'kreivas', 'naujas', 'lygus'],
                act: ['matyti', 'rasti', 'surasti', 'rodyti', 'parodyti', 'statyti', 'remontuoti', 'valyti', 'fotografuoti'] },
    street:   { adj: ['ilgas', 'platus', 'siauras', 'tylus', 'garsus', 'švarus', 'gražus', 'senas'],
                act: ['matyti', 'rasti', 'surasti', 'rodyti', 'parodyti', 'valyti', 'fotografuoti', 'mėgti', 'tvarkyti'] },
    building: { adj: ['didelis', 'naujas', 'senas', 'gražus', 'aukštas', 'šviesus', 'modernus', 'mėgstamas'],
                act: ['matyti', 'lankyti', 'aplankyti', 'rasti', 'surasti', 'statyti', 'pastatyti', 'rodyti', 'parodyti', 'fotografuoti', 'mėgti'] },
    structure:{ adj: ['ilgas', 'aukštas', 'naujas', 'senas', 'geležinis', 'akmeninis', 'gražus', 'platus'],
                act: ['matyti', 'statyti', 'pastatyti', 'remontuoti', 'fotografuoti', 'nufotografuoti', 'rodyti', 'dažyti'] },
    'nature-place': { adj: ['didelis', 'gilus', 'seklus', 'ramus', 'šaltas', 'šiltas', 'gražus', 'mėgstamas'],
                act: ['matyti', 'mylėti', 'mėgti', 'fotografuoti', 'nufotografuoti', 'rodyti', 'parodyti', 'piešti', 'lankyti'] },
    forest:   { adj: ['didelis', 'tamsus', 'šviesus', 'senas', 'žalias', 'ramus', 'gražus', 'tylus'],
                act: ['matyti', 'mylėti', 'mėgti', 'lankyti', 'fotografuoti', 'kirsti', 'sodinti', 'piešti', 'rodyti'] },
    furniture:{ adj: ['naujas', 'senas', 'didelis', 'mažas', 'medinis', 'patogus', 'aukštas', 'brangus'],
                act: ['pirkti', 'nupirkti', 'parduoti', 'matuoti', 'išmatuoti', 'stumti', 'pastumti', 'kelti', 'pakelti', 'valyti', 'nuvalyti', 'taisyti', 'sutaisyti', 'dažyti', 'statyti', 'pastatyti', 'keisti', 'turėti'] },
    'soft-furniture': { adj: ['minkštas', 'kietas', 'naujas', 'senas', 'patogus', 'didelis', 'odinis', 'pilkas'],
                act: ['pirkti', 'nupirkti', 'parduoti', 'valyti', 'nuvalyti', 'stumti', 'pastumti', 'matuoti', 'keisti', 'pakeisti', 'turėti', 'mėgti'] },
    bed:      { adj: ['minkštas', 'kietas', 'didelis', 'platus', 'naujas', 'patogus', 'medinis', 'senas'],
                act: ['kloti', 'pakloti', 'pirkti', 'nupirkti', 'stumti', 'pastumti', 'matuoti', 'keisti', 'taisyti', 'turėti'] },
    rug:      { adj: ['minkštas', 'storas', 'plonas', 'spalvotas', 'margas', 'švarus', 'nešvarus', 'vilnonis'],
                act: ['valyti', 'išvalyti', 'plauti', 'nuplauti', 'kloti', 'pakloti', 'lankstyti', 'sulankstyti', 'pirkti', 'nupirkti', 'keisti', 'mėgti'] },
    bedding:  { adj: ['minkštas', 'šiltas', 'šviežias', 'švarus', 'baltas', 'didelis', 'plonas', 'storas'],
                act: ['skalbti', 'išskalbti', 'džiovinti', 'išdžiovinti', 'lankstyti', 'sulankstyti', 'keisti', 'pakeisti', 'pirkti', 'imti', 'paimti', 'turėti'] },
    linen:    { adj: ['švarus', 'nešvarus', 'baltas', 'spalvotas', 'naujas', 'šlapias', 'sausas', 'medvilninis'],
                act: ['skalbti', 'išskalbti', 'lyginti', 'išlyginti', 'džiovinti', 'lankstyti', 'sulankstyti', 'keisti', 'pakeisti', 'pirkti', 'kloti'] },
    towel:    { adj: ['švarus', 'nešvarus', 'šlapias', 'sausas', 'minkštas', 'baltas', 'didelis', 'mažas'],
                act: ['skalbti', 'išskalbti', 'džiovinti', 'išdžiovinti', 'kabinti', 'pakabinti', 'imti', 'paimti', 'keisti', 'pakeisti', 'lankstyti'] },
    curtain:  { adj: ['ilgas', 'šviesus', 'tamsus', 'plonas', 'storas', 'švarus', 'baltas', 'spalvotas'],
                act: ['kabinti', 'pakabinti', 'nukabinti', 'skalbti', 'išskalbti', 'lyginti', 'keisti', 'pakeisti', 'pirkti', 'matuoti'] },
    cup:      { adj: ['švarus', 'nešvarus', 'pilnas', 'tuščias', 'didelis', 'mažas', 'keraminis', 'mėgstamas'],
                act: ['plauti', 'nuplauti', 'imti', 'paimti', 'laikyti', 'dėti', 'pirkti', 'nupirkti', 'sudaužyti', 'rasti', 'keisti', 'turėti'] },
    plate:    { adj: ['švarus', 'nešvarus', 'gilus', 'seklus', 'didelis', 'baltas', 'porcelianinis', 'tuščias'],
                act: ['plauti', 'nuplauti', 'šluostyti', 'nušluostyti', 'imti', 'paimti', 'dėti', 'pirkti', 'sudaužyti', 'keisti', 'laikyti'] },
    bowl:     { adj: ['gilus', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'molinis', 'stiklinis'],
                act: ['plauti', 'nuplauti', 'imti', 'paimti', 'dėti', 'laikyti', 'pirkti', 'nupirkti', 'uždengti', 'sudaužyti'] },
    glass:    { adj: ['pilnas', 'tuščias', 'švarus', 'stiklinis', 'aukštas', 'didelis', 'mažas', 'skaidrus'],
                act: ['plauti', 'nuplauti', 'imti', 'paimti', 'laikyti', 'dėti', 'kelti', 'pakelti', 'sudaužyti', 'pirkti'] },
    jug:      { adj: ['pilnas', 'tuščias', 'didelis', 'stiklinis', 'molinis', 'švarus', 'senas', 'gražus'],
                act: ['plauti', 'išplauti', 'imti', 'paimti', 'laikyti', 'dėti', 'pirkti', 'atidaryti', 'uždaryti', 'sudaužyti'] },
    jar:      { adj: ['pilnas', 'tuščias', 'stiklinis', 'didelis', 'mažas', 'švarus', 'naujas', 'senas'],
                act: ['atidaryti', 'uždaryti', 'plauti', 'išplauti', 'imti', 'paimti', 'laikyti', 'dėti', 'pirkti', 'sudaužyti'] },
    pot:      { adj: ['didelis', 'mažas', 'gilus', 'švarus', 'nešvarus', 'metalinis', 'karštas', 'naujas'],
                act: ['plauti', 'išplauti', 'imti', 'paimti', 'dėti', 'uždengti', 'atidengti', 'pirkti', 'nupirkti', 'laikyti', 'šildyti'] },
    pan:      { adj: ['karštas', 'didelis', 'mažas', 'švarus', 'nešvarus', 'metalinis', 'naujas', 'senas'],
                act: ['plauti', 'išplauti', 'imti', 'paimti', 'šildyti', 'pašildyti', 'dėti', 'pirkti', 'nupirkti', 'uždengti'] },
    lid:      { adj: ['didelis', 'mažas', 'stiklinis', 'metalinis', 'karštas', 'švarus', 'naujas', 'apvalus'],
                act: ['imti', 'paimti', 'dėti', 'kelti', 'pakelti', 'plauti', 'nuplauti', 'laikyti', 'rasti', 'keisti'] },
    teapot:   { adj: ['didelis', 'mažas', 'karštas', 'pilnas', 'tuščias', 'keraminis', 'stiklinis', 'gražus'],
                act: ['plauti', 'išplauti', 'imti', 'paimti', 'pirkti', 'nupirkti', 'dėti', 'laikyti', 'šildyti', 'sudaužyti'] },
    kettle:   { adj: ['naujas', 'senas', 'elektrinis', 'didelis', 'mažas', 'baltas', 'pilnas', 'tuščias'],
                act: ['įjungti', 'išjungti', 'plauti', 'išplauti', 'pirkti', 'nupirkti', 'keisti', 'pakeisti', 'taisyti', 'imti'] },
    cutlery:  { adj: ['švarus', 'nešvarus', 'didelis', 'mažas', 'metalinis', 'sidabrinis', 'medinis', 'naujas'],
                act: ['plauti', 'nuplauti', 'šluostyti', 'nušluostyti', 'imti', 'paimti', 'dėti', 'laikyti', 'pirkti', 'rasti'] },
    cutting:  { adj: ['aštrus', 'naujas', 'senas', 'didelis', 'mažas', 'metalinis', 'geras', 'švarus'],
                act: ['imti', 'paimti', 'laikyti', 'plauti', 'nuplauti', 'rasti', 'surasti', 'pamesti', 'pirkti', 'nupirkti', 'dėti'] },
    tray:     { adj: ['didelis', 'mažas', 'medinis', 'metalinis', 'švarus', 'pilnas', 'tuščias', 'apvalus'],
                act: ['nešti', 'atnešti', 'imti', 'paimti', 'laikyti', 'plauti', 'nuplauti', 'dėti', 'pirkti', 'kelti'] },
    tool:     { adj: ['naujas', 'senas', 'geras', 'didelis', 'mažas', 'plastikinis', 'metalinis', 'švarus'],
                act: ['imti', 'paimti', 'laikyti', 'plauti', 'nuplauti', 'pirkti', 'nupirkti', 'rasti', 'keisti', 'turėti'] },
    bucket:   { adj: ['pilnas', 'tuščias', 'didelis', 'mažas', 'plastikinis', 'metalinis', 'švarus', 'sunkus'],
                act: ['nešti', 'atnešti', 'kelti', 'pakelti', 'imti', 'paimti', 'plauti', 'laikyti', 'pirkti', 'dėti'] },
    soap:     { adj: ['naujas', 'baltas', 'kvapus_', 'mažas', 'didelis', 'naminis', 'brangus', 'pigus'],
                act: ['imti', 'paimti', 'pirkti', 'nupirkti', 'dėti', 'laikyti', 'rasti', 'keisti', 'turėti'] },
    bath:     { adj: ['baltas', 'švarus', 'nešvarus', 'didelis', 'ilgas', 'gilus', 'naujas', 'senas'],
                act: ['plauti', 'nuplauti', 'valyti', 'išvalyti', 'pirkti', 'nupirkti', 'keisti', 'pakeisti', 'matuoti', 'taisyti', 'turėti'] },
    sink:     { adj: ['švarus', 'nešvarus', 'baltas', 'didelis', 'mažas', 'naujas', 'gilus', 'keraminis'],
                act: ['plauti', 'nuplauti', 'valyti', 'išvalyti', 'keisti', 'pakeisti', 'taisyti', 'sutaisyti', 'pirkti', 'matuoti'] },
    tap:      { adj: ['naujas', 'senas', 'metalinis', 'geras', 'blogas', 'švarus', 'brangus', 'pigus'],
                act: ['atidaryti', 'uždaryti', 'taisyti', 'sutaisyti', 'keisti', 'pakeisti', 'valyti', 'nuvalyti', 'pirkti', 'matyti'] },
    mirror:   { adj: ['didelis', 'mažas', 'švarus', 'nešvarus', 'apvalus', 'senas', 'naujas', 'gražus'],
                act: ['valyti', 'nuvalyti', 'šluostyti', 'nušluostyti', 'kabinti', 'pakabinti', 'nukabinti', 'pirkti', 'sudaužyti', 'matyti'] },
    lamp:     { adj: ['naujas', 'senas', 'šviesus', 'mažas', 'didelis', 'elektrinis', 'gražus', 'brangus'],
                act: ['įjungti', 'išjungti', 'pirkti', 'nupirkti', 'kabinti', 'pakabinti', 'keisti', 'pakeisti', 'taisyti', 'valyti'] },
    decor:    { adj: ['gražus', 'didelis', 'mažas', 'senas', 'naujas', 'spalvotas', 'brangus', 'mėgstamas'],
                act: ['kabinti', 'pakabinti', 'nukabinti', 'matyti', 'mėgti', 'rodyti', 'parodyti', 'pirkti', 'nupirkti', 'valyti', 'fotografuoti'] },
    photo:    { adj: ['gražus', 'senas', 'naujas', 'spalvotas', 'ryškus', 'blyškus', 'didelis', 'mėgstamas'],
                act: ['rodyti', 'parodyti', 'siųsti', 'išsiųsti', 'gauti', 'spausdinti', 'atspausdinti', 'matyti', 'mėgti', 'laikyti', 'rasti'] },
    device:   { adj: ['naujas', 'senas', 'geras', 'greitas', 'lėtas', 'brangus', 'pigus', 'modernus'],
                act: ['įjungti', 'išjungti', 'įkrauti', 'pirkti', 'nupirkti', 'parduoti', 'taisyti', 'sutaisyti', 'valyti', 'keisti', 'turėti', 'rasti', 'pamesti'] },
    appliance:{ adj: ['naujas', 'senas', 'didelis', 'mažas', 'baltas', 'elektrinis', 'geras', 'tylus'],
                act: ['įjungti', 'išjungti', 'pirkti', 'nupirkti', 'valyti', 'išvalyti', 'taisyti', 'sutaisyti', 'keisti', 'pakeisti', 'turėti'] },
    key:      { adj: ['naujas', 'senas', 'mažas', 'didelis', 'metalinis', 'auksinis', 'geras', 'sidabrinis'],
                act: ['imti', 'paimti', 'laikyti', 'rasti', 'surasti', 'pamesti', 'turėti', 'keisti', 'pakeisti', 'dėti', 'rodyti'] },
    box:      { adj: ['didelis', 'mažas', 'pilnas', 'tuščias', 'sunkus', 'lengvas', 'popierinis', 'medinis'],
                act: ['atidaryti', 'uždaryti', 'nešti', 'atnešti', 'kelti', 'pakelti', 'imti', 'paimti', 'dėti', 'siųsti', 'gauti', 'laikyti'] },
    bag:      { adj: ['didelis', 'mažas', 'sunkus', 'lengvas', 'naujas', 'odinis', 'pilnas', 'tuščias'],
                act: ['nešti', 'atnešti', 'imti', 'paimti', 'laikyti', 'atidaryti', 'uždaryti', 'pirkti', 'nupirkti', 'pamesti', 'rasti', 'turėti'] },
    book:     { adj: ['įdomus', 'naujas', 'senas', 'storas', 'plonas', 'geras', 'mėgstamas', 'sudėtingas'],
                act: ['skaityti', 'perskaityti', 'pirkti', 'nupirkti', 'imti', 'paimti', 'rašyti', 'parašyti', 'versti', 'išversti', 'rodyti', 'dovanoti', 'turėti', 'mėgti'] },
    letter:   { adj: ['ilgas', 'trumpas', 'naujas', 'senas', 'svarbus', 'malonus', 'linksmas', 'liūdnas'],
                act: ['rašyti', 'parašyti', 'skaityti', 'perskaityti', 'siųsti', 'išsiųsti', 'gauti', 'laikyti', 'rasti', 'atidaryti', 'spausdinti'] },
    message:  { adj: ['trumpas', 'ilgas', 'naujas', 'svarbus', 'malonus', 'linksmas', 'paprastas', 'sudėtingas'],
                act: ['rašyti', 'parašyti', 'siųsti', 'išsiųsti', 'gauti', 'skaityti', 'perskaityti', 'versti', 'išversti', 'rodyti', 'parodyti'] },
    text:     { adj: ['ilgas', 'trumpas', 'sudėtingas', 'paprastas', 'įdomus', 'naujas', 'geras', 'svarbus'],
                act: ['skaityti', 'perskaityti', 'rašyti', 'parašyti', 'versti', 'išversti', 'tikrinti', 'patikrinti', 'spausdinti', 'atspausdinti', 'suprasti', 'kartoti'] },
    notebook: { adj: ['naujas', 'senas', 'storas', 'plonas', 'švarus', 'mėlynas', 'žalias', 'pilnas'],
                act: ['imti', 'paimti', 'pirkti', 'nupirkti', 'atidaryti', 'uždaryti', 'rasti', 'pamesti', 'laikyti', 'rodyti', 'turėti'] },
    pen:      { adj: ['naujas', 'senas', 'geras', 'mėlynas', 'juodas', 'raudonas', 'ilgas', 'trumpas'],
                act: ['imti', 'paimti', 'laikyti', 'pirkti', 'nupirkti', 'rasti', 'surasti', 'pamesti', 'dėti', 'turėti', 'keisti'] },
    ticket:   { adj: ['brangus', 'pigus', 'naujas', 'senas', 'geras', 'popierinis', 'elektroninis_', 'svarbus'],
                act: ['pirkti', 'nupirkti', 'parduoti', 'rodyti', 'parodyti', 'tikrinti', 'patikrinti', 'laikyti', 'rasti', 'pamesti', 'turėti', 'gauti'] },
    document: { adj: ['svarbus', 'naujas', 'senas', 'ilgas', 'trumpas', 'sudėtingas', 'paprastas', 'popierinis'],
                act: ['pildyti', 'užpildyti', 'skaityti', 'perskaityti', 'tikrinti', 'patikrinti', 'siųsti', 'išsiųsti', 'gauti', 'spausdinti', 'atspausdinti', 'laikyti', 'rasti', 'rodyti'] },
    child:    { adj: ['mažas', 'linksmas', 'ramus', 'protingas', 'mielas', 'sveikas', 'laimingas', 'drąsus'],
                act: ['matyti', 'mylėti', 'aprengti', 'prausti', 'maitinti', 'mokyti', 'apkabinti', 'bučiuoti', 'lydėti', 'palydėti', 'kviesti', 'girdėti', 'suprasti'] },
    person:   { adj: ['geras', 'jaunas', 'senas', 'linksmas', 'protingas', 'ramus', 'mielas', 'laimingas'],
                act: ['matyti', 'mylėti', 'mėgti', 'kviesti', 'pakviesti', 'sutikti', 'lydėti', 'palydėti', 'apkabinti', 'bučiuoti', 'gerbti', 'suprasti', 'girdėti', 'fotografuoti', 'turėti'] },
    pet:      { adj: ['mažas', 'didelis', 'jaunas', 'senas', 'juodas', 'baltas', 'mielas', 'ramus'],
                act: ['matyti', 'mylėti', 'mėgti', 'turėti', 'maitinti', 'prausti', 'glostyti', 'vesti', 'fotografuoti', 'nufotografuoti', 'girdėti', 'gydyti'] },
    'farm-animal': { adj: ['didelis', 'mažas', 'jaunas', 'senas', 'baltas', 'rudas', 'ramus', 'stiprus'],
                act: ['matyti', 'turėti', 'maitinti', 'vesti', 'glostyti', 'pirkti', 'parduoti', 'fotografuoti', 'gydyti', 'mylėti'] },
    'wild-animal': { adj: ['mažas', 'didelis', 'gražus', 'greitas', 'margas', 'juodas', 'baltas', 'pilkas'],
                act: ['matyti', 'girdėti', 'fotografuoti', 'nufotografuoti', 'maitinti', 'gaudyti', 'piešti', 'mėgti', 'mylėti'] },
    fish:     { adj: ['didelis', 'mažas', 'šviežias', 'skanus', 'sūrus', 'pilkas', 'greitas', 'gražus'],
                act: ['gaudyti', 'valgyti', 'suvalgyti', 'kepti', 'iškepti', 'virti', 'pirkti', 'nupirkti', 'pjaustyti', 'sūdyti', 'matyti'] },
    fruit:    { adj: ['saldus', 'rūgštus', 'skanus', 'šviežias', 'didelis', 'mažas', 'sultingas', 'žalias'],
                act: ['valgyti', 'suvalgyti', 'pirkti', 'nupirkti', 'plauti', 'nuplauti', 'skinti', 'nuskinti', 'pjaustyti', 'supjaustyti', 'rinkti', 'mėgti', 'ragauti'] },
    'fruit-buy': { adj: ['saldus', 'rūgštus', 'skanus', 'šviežias', 'geltonas', 'didelis', 'mažas', 'brangus'],
                act: ['valgyti', 'suvalgyti', 'pirkti', 'nupirkti', 'plauti', 'nuplauti', 'pjaustyti', 'supjaustyti', 'mėgti', 'ragauti', 'turėti'] },
    berry:    { adj: ['saldus', 'rūgštus', 'skanus', 'šviežias', 'raudonas', 'mažas', 'mėgstamas', 'sausas'],
                act: ['rinkti', 'surinkti', 'valgyti', 'suvalgyti', 'skinti', 'plauti', 'nuplauti', 'pirkti', 'mėgti', 'džiovinti', 'ragauti'] },
    vegetable:{ adj: ['šviežias', 'skanus', 'žalias', 'raudonas', 'didelis', 'mažas', 'sūrus', 'naminis'],
                act: ['valgyti', 'suvalgyti', 'pirkti', 'nupirkti', 'plauti', 'nuplauti', 'pjaustyti', 'supjaustyti', 'sodinti', 'rinkti', 'mėgti', 'ragauti'] },
    'root-veg': { adj: ['šviežias', 'didelis', 'mažas', 'skanus', 'saldus', 'sausas', 'naminis', 'senas'],
                act: ['virti', 'išvirti', 'kepti', 'iškepti', 'pjaustyti', 'supjaustyti', 'plauti', 'nuplauti', 'sodinti', 'pasodinti', 'kasti', 'pirkti', 'valgyti'] },
    mushroom: { adj: ['didelis', 'mažas', 'šviežias', 'skanus', 'rudas', 'baltas', 'sausas', 'geras'],
                act: ['rinkti', 'surinkti', 'rasti', 'surasti', 'valyti', 'nuvalyti', 'virti', 'kepti', 'pjaustyti', 'džiovinti', 'valgyti', 'matyti'] },
    'food-cut': { adj: ['šviežias', 'skanus', 'sūrus', 'minkštas', 'kietas', 'naminis', 'brangus', 'pigus'],
                act: ['pjaustyti', 'supjaustyti', 'valgyti', 'suvalgyti', 'pirkti', 'nupirkti', 'kepti', 'ragauti', 'mėgti', 'laikyti', 'turėti'] },
    baked:    { adj: ['saldus', 'skanus', 'gardus', 'šiltas', 'šviežias', 'didelis', 'mažas', 'naminis'],
                act: ['kepti', 'iškepti', 'valgyti', 'suvalgyti', 'pirkti', 'nupirkti', 'pjaustyti', 'supjaustyti', 'ragauti', 'paragauti', 'mėgti', 'dovanoti'] },
    egg:      { adj: ['šviežias', 'didelis', 'mažas', 'baltas', 'rudas', 'kietas', 'minkštas', 'naminis'],
                act: ['virti', 'išvirti', 'kepti', 'iškepti', 'valgyti', 'suvalgyti', 'pirkti', 'nupirkti', 'imti', 'sudaužyti', 'dėti'] },
    meat:     { adj: ['šviežias', 'skanus', 'sūrus', 'minkštas', 'kietas', 'brangus', 'pigus', 'naminis'],
                act: ['kepti', 'iškepti', 'virti', 'išvirti', 'pjaustyti', 'supjaustyti', 'pirkti', 'nupirkti', 'valgyti', 'sūdyti', 'ragauti', 'šildyti'] },
    soup:     { adj: ['karštas', 'šiltas', 'šaltas', 'skanus', 'gardus', 'sūrus', 'tirštas', 'skystas'],
                act: ['virti', 'išvirti', 'valgyti', 'suvalgyti', 'šildyti', 'pašildyti', 'pilti', 'įpilti', 'sūdyti', 'ragauti', 'paragauti', 'mėgti'] },
    drink:    { adj: ['karštas', 'šiltas', 'šaltas', 'saldus', 'skanus', 'stiprus', 'šviežias', 'mėgstamas'],
                act: ['gerti', 'išgerti', 'pilti', 'įpilti', 'išpilti', 'pirkti', 'nupirkti', 'šildyti', 'pašildyti', 'ragauti', 'mėgti', 'virti'] },
    liquid:   { adj: ['šaltas', 'šiltas', 'karštas', 'švarus', 'skaidrus', 'sūrus', 'saldus', 'geras'],
                act: ['gerti', 'išgerti', 'pilti', 'įpilti', 'išpilti', 'šildyti', 'pašildyti', 'virti', 'nešti', 'atnešti', 'pirkti', 'turėti'] },
    dish:     { adj: ['skanus', 'gardus', 'šviežias', 'šaltas', 'šiltas', 'saldus', 'sūrus', 'mėgstamas'],
                act: ['valgyti', 'suvalgyti', 'pirkti', 'nupirkti', 'ragauti', 'paragauti', 'mėgti', 'virti', 'išvirti', 'dėti', 'turėti'] },
    pantry:   { adj: ['šviežias', 'geras', 'saldus', 'sūrus', 'brangus', 'pigus', 'naminis', 'baltas'],
                act: ['pirkti', 'nupirkti', 'imti', 'paimti', 'dėti', 'laikyti', 'turėti', 'mėgti', 'ragauti', 'rasti'] },
    'clothes-torso': { adj: ['naujas', 'senas', 'švarus', 'šiltas', 'gražus', 'ilgas', 'brangus', 'mėgstamas'],
                act: ['dėvėti', 'vilkėti', 'skalbti', 'išskalbti', 'lyginti', 'išlyginti', 'džiovinti', 'pirkti', 'nupirkti', 'parduoti', 'kabinti', 'pakabinti', 'lankstyti', 'taisyti', 'keisti', 'turėti', 'mėgti'] },
    'clothes-legs': { adj: ['naujas', 'senas', 'ilgas', 'trumpas', 'juodas', 'patogus', 'šiltas', 'švarus'],
                act: ['dėvėti', 'mūvėti', 'skalbti', 'išskalbti', 'lyginti', 'išlyginti', 'džiovinti', 'pirkti', 'nupirkti', 'lankstyti', 'sulankstyti', 'taisyti', 'keisti', 'turėti'] },
    'clothes-head': { adj: ['šiltas', 'naujas', 'senas', 'vilnonis', 'ilgas', 'gražus', 'mėlynas', 'mėgstamas'],
                act: ['dėvėti', 'skalbti', 'išskalbti', 'džiovinti', 'pirkti', 'nupirkti', 'imti', 'paimti', 'rasti', 'pamesti', 'turėti', 'mėgti', 'dovanoti'] },
    'clothes-feet': { adj: ['naujas', 'senas', 'šiltas', 'patogus', 'nepatogus', 'odinis', 'juodas', 'švarus'],
                act: ['avėti', 'dėvėti', 'pirkti', 'nupirkti', 'valyti', 'nuvalyti', 'plauti', 'skalbti', 'džiovinti', 'taisyti', 'sutaisyti', 'keisti', 'turėti'] },
    'clothes-hands': { adj: ['šiltas', 'naujas', 'odinis', 'vilnonis', 'plonas', 'storas', 'juodas', 'švarus'],
                act: ['mūvėti', 'dėvėti', 'pirkti', 'nupirkti', 'skalbti', 'džiovinti', 'rasti', 'pamesti', 'imti', 'paimti', 'turėti', 'dovanoti'] },
    glasses:  { adj: ['naujas', 'senas', 'stiprus', 'tamsus', 'brangus', 'pigus', 'apvalus', 'mėgstamas'],
                act: ['dėvėti', 'valyti', 'nuvalyti', 'pirkti', 'nupirkti', 'imti', 'paimti', 'rasti', 'surasti', 'pamesti', 'keisti', 'turėti'] },
    car:      { adj: ['naujas', 'senas', 'greitas', 'lėtas', 'brangus', 'pigus', 'švarus', 'nešvarus'],
                act: ['vairuoti', 'plauti', 'nuplauti', 'pirkti', 'nupirkti', 'parduoti', 'taisyti', 'sutaisyti', 'valyti', 'statyti', 'pastatyti', 'rakinti', 'užrakinti', 'atrakinti', 'turėti', 'matyti'] },
    bike:     { adj: ['naujas', 'senas', 'greitas', 'lengvas', 'sunkus', 'raudonas', 'mėlynas', 'patogus'],
                act: ['pirkti', 'nupirkti', 'parduoti', 'taisyti', 'sutaisyti', 'plauti', 'valyti', 'statyti', 'pastatyti', 'rakinti', 'užrakinti', 'turėti', 'mėgti'] },
    transport:{ adj: ['naujas', 'senas', 'greitas', 'lėtas', 'didelis', 'patogus', 'baltas', 'modernus'],
                act: ['matyti', 'vairuoti', 'fotografuoti', 'nufotografuoti', 'mėgti', 'rodyti', 'parodyti', 'piešti', 'valyti', 'taisyti'] },
    flower:   { adj: ['gražus', 'raudonas', 'baltas', 'geltonas', 'šviežias', 'mažas', 'didelis', 'mėgstamas'],
                act: ['skinti', 'nuskinti', 'laistyti', 'palaistyti', 'sodinti', 'pasodinti', 'pirkti', 'nupirkti', 'dovanoti', 'padovanoti', 'matyti', 'mėgti', 'fotografuoti', 'piešti'] },
    tree:     { adj: ['aukštas', 'žemas', 'senas', 'jaunas', 'didelis', 'žalias', 'storas', 'gražus'],
                act: ['sodinti', 'pasodinti', 'laistyti', 'kirsti', 'matyti', 'mylėti', 'fotografuoti', 'piešti', 'rodyti', 'turėti'] },
    leaf:     { adj: ['žalias', 'geltonas', 'raudonas', 'sausas', 'šlapias', 'didelis', 'mažas', 'gražus'],
                act: ['rinkti', 'surinkti', 'imti', 'paimti', 'matyti', 'piešti', 'fotografuoti', 'skinti', 'nuskinti', 'džiovinti'] },
    stone:    { adj: ['didelis', 'mažas', 'sunkus', 'lengvas', 'apvalus', 'pilkas', 'baltas', 'kietas'],
                act: ['kelti', 'pakelti', 'mesti', 'išmesti', 'imti', 'paimti', 'rasti', 'surasti', 'laikyti', 'dažyti', 'matyti', 'fotografuoti'] },
    snow:     { adj: ['baltas', 'šaltas', 'šlapias', 'sausas', 'minkštas', 'kietas', 'švarus', 'gilus'],
                act: ['valyti', 'nuvalyti', 'kasti', 'matyti', 'mėgti', 'mylėti', 'fotografuoti', 'piešti'] },
    sky:      { adj: ['ryškus', 'gražus', 'didelis', 'šviesus', 'tolimas_', 'mėgstamas', 'šiltas', 'geltonas'],
                act: ['matyti', 'mėgti', 'mylėti', 'fotografuoti', 'nufotografuoti', 'piešti', 'rodyti', 'parodyti'] },
    toy:      { adj: ['naujas', 'senas', 'mažas', 'didelis', 'minkštas', 'spalvotas', 'mėgstamas', 'mielas'],
                act: ['pirkti', 'nupirkti', 'dovanoti', 'padovanoti', 'imti', 'paimti', 'laikyti', 'rasti', 'surasti', 'pamesti', 'turėti', 'mėgti', 'rodyti', 'valyti', 'dėti'] },
    ball:     { adj: ['naujas', 'senas', 'didelis', 'mažas', 'apvalus', 'raudonas', 'mėlynas', 'spalvotas'],
                act: ['mesti', 'išmesti', 'imti', 'paimti', 'gaudyti', 'pirkti', 'nupirkti', 'rasti', 'surasti', 'pamesti', 'turėti', 'laikyti'] },
    gift:     { adj: ['gražus', 'didelis', 'mažas', 'brangus', 'pigus', 'geras', 'malonus', 'naujas'],
                act: ['pirkti', 'nupirkti', 'dovanoti', 'padovanoti', 'gauti', 'atidaryti', 'siųsti', 'išsiųsti', 'rodyti', 'parodyti', 'laikyti', 'turėti', 'mėgti'] },
    money:    { adj: ['didelis', 'mažas', 'naujas', 'senas', 'geras', 'svarbus', 'popierinis', 'tikras'],
                act: ['turėti', 'gauti', 'skaičiuoti', 'taupyti', 'leisti', 'išleisti', 'laikyti', 'rasti', 'surasti', 'pamesti', 'keisti', 'imti', 'paimti', 'siųsti', 'išsiųsti'] },
    work:     { adj: ['geras', 'blogas', 'naujas', 'senas', 'sunkus', 'lengvas', 'įdomus', 'svarbus'],
                act: ['turėti', 'rasti', 'surasti', 'pradėti', 'baigti', 'mėgti', 'mylėti', 'keisti', 'pakeisti', 'planuoti', 'tikrinti', 'rodyti'] },
    language: { adj: ['sudėtingas', 'paprastas', 'gražus', 'įdomus', 'senas', 'naujas', 'svarbus', 'mėgstamas'],
                act: ['mokėti', 'suprasti', 'girdėti', 'mėgti', 'mylėti', 'vartoti', 'kartoti', 'mokyti', 'turėti'] },
    word:     { adj: ['naujas', 'senas', 'ilgas', 'trumpas', 'sudėtingas', 'paprastas', 'svarbus', 'gražus'],
                act: ['rašyti', 'parašyti', 'skaityti', 'perskaityti', 'versti', 'išversti', 'kartoti', 'pakartoti', 'suprasti', 'girdėti', 'mokėti', 'sakyti', 'pasakyti', 'tarti', 'ištarti', 'rasti', 'tikrinti'] },
    question: { adj: ['sudėtingas', 'paprastas', 'svarbus', 'įdomus', 'geras', 'ilgas', 'trumpas', 'naujas'],
                act: ['turėti', 'rašyti', 'parašyti', 'skaityti', 'girdėti', 'suprasti', 'versti', 'išversti', 'kartoti', 'pakartoti', 'tikrinti', 'patikrinti', 'gauti', 'siųsti'] },
    task:     { adj: ['sunkus', 'lengvas', 'naujas', 'įdomus', 'ilgas', 'trumpas', 'svarbus', 'paprastas'],
                act: ['turėti', 'skaityti', 'perskaityti', 'rašyti', 'tikrinti', 'patikrinti', 'pradėti', 'baigti', 'suprasti', 'gauti', 'siųsti', 'išsiųsti', 'kartoti'] },
    lesson:   { adj: ['įdomus', 'sunkus', 'lengvas', 'ilgas', 'trumpas', 'naujas', 'geras', 'mėgstamas'],
                act: ['turėti', 'pradėti', 'baigti', 'planuoti', 'vesti', 'praleisti', 'kartoti', 'pakartoti', 'mėgti', 'mylėti', 'suprasti'] },
    song:     { adj: ['gražus', 'linksmas', 'liūdnas', 'senas', 'naujas', 'ilgas', 'trumpas', 'mėgstamas'],
                act: ['dainuoti', 'girdėti', 'mėgti', 'mylėti', 'rašyti', 'parašyti', 'kurti', 'sukurti', 'mokėti', 'kartoti', 'pakartoti'] },
    film:     { adj: ['įdomus', 'geras', 'blogas', 'ilgas', 'trumpas', 'naujas', 'senas', 'mėgstamas'],
                act: ['žiūrėti', 'mėgti', 'mylėti', 'rodyti', 'parodyti', 'kurti', 'sukurti', 'suprasti', 'matyti', 'fotografuoti'] },
    music:    { adj: ['garsus', 'tylus', 'gražus', 'ramus', 'linksmas', 'liūdnas', 'senas', 'mėgstamas'],
                act: ['girdėti', 'mėgti', 'mylėti', 'įjungti', 'išjungti', 'kurti', 'sukurti', 'suprasti'] },
    holiday:  { adj: ['linksmas', 'didelis', 'mažas', 'gražus', 'svarbus', 'ramus', 'šiltas', 'mėgstamas'],
                act: ['švęsti', 'turėti', 'planuoti', 'mėgti', 'mylėti', 'praleisti', 'pradėti', 'baigti', 'fotografuoti'] },
    time:     { adj: ['ilgas', 'trumpas', 'geras', 'sunkus', 'lengvas', 'ramus', 'linksmas', 'šiltas'],
                act: ['turėti', 'praleisti', 'planuoti', 'mėgti', 'pradėti', 'baigti', 'skaičiuoti'] },
    season:   { adj: ['šiltas', 'šaltas', 'ilgas', 'trumpas', 'gražus', 'sausas', 'drėgnas', 'mėgstamas'],
                act: ['mėgti', 'mylėti', 'turėti', 'praleisti', 'planuoti', 'fotografuoti', 'piešti'] },
    heart:    { adj: ['geras', 'stiprus', 'silpnas', 'sveikas', 'didelis', 'ramus', 'šiltas', 'jaunas'],
                act: ['turėti', 'tikrinti', 'patikrinti', 'gydyti', 'girdėti', 'stiprinti_', 'matyti', 'saugoti_'] },
    eye:      { adj: ['mėlynas', 'rudas', 'žalias', 'pilkas', 'didelis', 'gražus', 'sveikas', 'ryškus'],
                act: ['turėti', 'matyti', 'tikrinti', 'patikrinti', 'gydyti', 'atidaryti', 'uždaryti', 'piešti'] },
    tooth:    { adj: ['baltas', 'sveikas', 'stiprus', 'didelis', 'mažas', 'naujas', 'geras', 'blogas'],
                act: ['valyti', 'išvalyti', 'turėti', 'tikrinti', 'patikrinti', 'gydyti', 'matyti', 'rodyti'] }
  };
  // убираем «черновые» пометки с подчёркиванием — такие слова в базе не описаны,
  // их место занимают следующие описания профиля
  Object.keys(PROFILES).forEach(function (k) {
    PROFILES[k].adj = PROFILES[k].adj.filter(function (id) { return ADJ[id]; });
    PROFILES[k].act = PROFILES[k].act.filter(function (id) { return VERB[id]; });
  });

  /* ---------- сцены опубликованной версии 4 (приложение 37 ТЗ) ----------
     Точные связи «предмет → описания → действия». Порядок — как в ТЗ;
     эти предметы идут в конструкторе первыми. ---------- */
  var SCENES_V4 = {
    langas: { adj: ['švarus', 'naujas', 'didelis', 'platus', 'stiklinis', 'šviesus', 'senas', 'nešvarus'],
      act: ['atidaryti', 'uždaryti', 'atverti', 'užverti', 'praverti', 'valyti', 'nuvalyti', 'plauti', 'šluostyti', 'pakeisti', 'keisti', 'įstatyti', 'išimti', 'dažyti', 'nudažyti', 'dekoruoti', 'fotografuoti', 'matuoti', 'išmatuoti', 'taisyti', 'remontuoti', 'sudaužyti', 'apžiūrėti', 'tikrinti', 'patikrinti', 'pirkti', 'nupirkti', 'užsakyti', 'pasirinkti'] },
    durys: { adj: ['naujas', 'senas', 'platus', 'medinis', 'baltas', 'sunkus', 'gražus', 'švarus'],
      act: ['atidaryti', 'uždaryti', 'atverti', 'užverti', 'praverti', 'valyti', 'nuvalyti', 'pakeisti', 'dažyti', 'nudažyti', 'dekoruoti', 'matuoti', 'taisyti', 'apžiūrėti', 'pirkti'] },
    knyga: { adj: ['įdomus', 'naujas', 'senas', 'storas', 'plonas', 'brangus', 'naudingas', 'popierinis'],
      act: ['skaityti', 'perskaityti', 'rašyti', 'pirkti', 'parduoti', 'paimti', 'nešti', 'rasti', 'pamesti', 'padovanoti', 'supakuoti', 'fotografuoti'] },
    stalas: { adj: ['naujas', 'senas', 'medinis', 'švarus', 'didelis', 'mažas', 'stiklinis', 'sunkus'],
      act: ['valyti', 'plauti', 'šluostyti', 'pakeisti', 'dažyti', 'matuoti', 'taisyti', 'pirkti', 'pastumti', 'pastatyti', 'pernešti', 'surinkti'] },
    kėdė: { adj: ['patogus', 'naujas', 'senas', 'medinis', 'minkštas', 'lengvas', 'tvirtas', 'gražus'],
      act: ['valyti', 'pakeisti', 'dažyti', 'taisyti', 'pirkti', 'parduoti', 'pastumti', 'pastatyti', 'pakelti', 'pernešti'] },
    obuolys: { adj: ['raudonas', 'žalias', 'didelis', 'mažas', 'saldus', 'rūgštus', 'šviežias', 'skanus'],
      act: ['matyti', 'pirkti', 'plauti', 'valgyti', 'suvalgyti', 'pjaustyti', 'supjaustyti', 'nulupti', 'ragauti', 'pasverti', 'rinkti', 'rūšiuoti'] },
    siurblys: { adj: ['naujas', 'senas', 'elektrinis', 'brangus', 'pigus', 'garsus', 'patogus', 'lengvas'],
      act: ['pirkti', 'parduoti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'sutaisyti', 'tikrinti', 'pakelti', 'pernešti', 'išpakuoti'] },
    telefonas: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'patogus', 'mažas', 'juodas', 'lengvas'],
      act: ['pirkti', 'parduoti', 'įjungti', 'išjungti', 'įkrauti', 'naudoti', 'taisyti', 'rasti', 'pamesti', 'paimti', 'padovanoti'] },
    puodelis: { adj: ['baltas', 'naujas', 'švarus', 'nešvarus', 'stiklinis', 'keraminis', 'gražus', 'mažas'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'laikyti', 'padėti', 'padovanoti', 'supakuoti', 'sudaužyti'] },
    mašina: { adj: ['naujas', 'senas', 'greitas', 'raudonas', 'patogus', 'brangus', 'pigus', 'švarus'],
      act: ['matyti', 'pirkti', 'parduoti', 'plauti', 'nuplauti', 'taisyti', 'remontuoti', 'tikrinti', 'apžiūrėti', 'fotografuoti'] },
    kuprinė: { adj: ['naujas', 'senas', 'sunkus', 'lengvas', 'patogus', 'mokyklinis', 'juodas', 'mažas'],
      act: ['pirkti', 'parduoti', 'paimti', 'nešti', 'rasti', 'pamesti', 'naudoti', 'atidaryti', 'uždaryti', 'padovanoti'] },
    nuotrauka: { adj: ['gražus', 'naujas', 'senas', 'įdomus', 'spalvotas', 'skaitmeninis', 'didelis', 'mažas'],
      act: ['matyti', 'spausdinti', 'kopijuoti', 'siųsti', 'išsiųsti', 'gauti', 'redaguoti', 'rasti', 'pasirinkti'] },
    tekstas: { adj: ['įdomus', 'trumpas', 'ilgas', 'aiškus', 'sudėtingas', 'paprastas', 'naudingas', 'svarbus'],
      act: ['skaityti', 'perskaityti', 'rašyti', 'parašyti', 'perrašyti', 'redaguoti', 'spausdinti', 'kopijuoti', 'išversti', 'siųsti', 'tikrinti'] },
    gėlė: { adj: ['gražus', 'baltas', 'raudonas', 'mažas', 'didelis', 'geltonas', 'mėlynas', 'šviežias'],
      act: ['matyti', 'pirkti', 'auginti', 'sodinti', 'laistyti', 'fotografuoti', 'padovanoti', 'apžiūrėti'] },
    sofa: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'švarus', 'nešvarus', 'sunkus'],
      act: ['matyti', 'pirkti', 'parduoti', 'valyti', 'pakeisti', 'apžiūrėti', 'fotografuoti', 'pasirinkti'] },
    fotelis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'švarus', 'nešvarus', 'sunkus'],
      act: ['matyti', 'pirkti', 'parduoti', 'valyti', 'pakeisti', 'apžiūrėti', 'fotografuoti', 'pasirinkti'] },
    komoda: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'švarus', 'nešvarus', 'sunkus'],
      act: ['matyti', 'pirkti', 'parduoti', 'valyti', 'pakeisti', 'apžiūrėti', 'fotografuoti', 'pasirinkti'] },
    spintelė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'švarus', 'nešvarus', 'sunkus'],
      act: ['matyti', 'pirkti', 'parduoti', 'valyti', 'pakeisti', 'apžiūrėti', 'fotografuoti', 'pasirinkti'] },
    suolas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'švarus', 'nešvarus', 'sunkus'],
      act: ['matyti', 'pirkti', 'parduoti', 'valyti', 'pakeisti', 'apžiūrėti', 'fotografuoti', 'pasirinkti'] },
    taburetė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'švarus', 'nešvarus', 'sunkus'],
      act: ['matyti', 'pirkti', 'parduoti', 'valyti', 'pakeisti', 'apžiūrėti', 'fotografuoti', 'pasirinkti'] },
    čiužinys: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'švarus', 'nešvarus', 'sunkus'],
      act: ['matyti', 'pirkti', 'parduoti', 'valyti', 'pakeisti', 'apžiūrėti', 'fotografuoti', 'pasirinkti'] },
    kilimas: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    kilimėlis: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    pagalvė: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    antklodė: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    paklodė: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    užvalkalas: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    rankšluostis: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    užuolaida: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    staltiesė: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    servetėlė: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    pledas: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    prijuostė: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'baltas', 'juodas', 'gražus', 'patogus'],
      act: ['matyti', 'pirkti', 'pasirinkti', 'paimti', 'padėti', 'rasti', 'padovanoti', 'supakuoti'] },
    šluostė: { adj: ['naujas', 'senas', 'minkštas', 'švarus', 'nešvarus', 'baltas', 'spalvotas', 'gražus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'pakeisti', 'pasirinkti', 'padovanoti'] },
    dubuo: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    dubenėlis: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    stiklinė: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    taurė: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    ąsotis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'nešvarus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'pasirinkti', 'plauti'] },
    butelis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'nešvarus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'pasirinkti', 'plauti'] },
    stiklainis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'nešvarus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'pasirinkti', 'plauti'] },
    keptuvė: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    dangtis: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    arbatinukas: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    virdulys: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    samtis: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    trintuvė: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    sietelis: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    padėklas: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    lentelė: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    kočėlas: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    mentelė: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'gražus', 'sunkus'],
      act: ['matyti', 'pirkti', 'plauti', 'nuplauti', 'paimti', 'padėti', 'naudoti', 'pasirinkti'] },
    indelis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'nešvarus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'pasirinkti', 'plauti'] },
    cukrinė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'nešvarus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'pasirinkti', 'plauti'] },
    druskinė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'nešvarus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'pasirinkti', 'plauti'] },
    šaldytuvas: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    šaldiklis: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    orkaitė: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    viryklė: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    mikrobangė: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    skrudintuvas: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    plakiklis: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    trintuvas: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    indaplovė: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    skalbyklė: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    džiovyklė: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    lygintuvas: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    ventiliatorius: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    šildytuvas: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    šviestuvas: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    žibintuvėlis: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    radijas: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    spausdintuvas: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    monitorius: { adj: ['naujas', 'senas', 'brangus', 'pigus', 'didelis', 'mažas', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'įjungti', 'išjungti', 'naudoti', 'taisyti', 'tikrinti', 'pakeisti'] },
    klaviatūra: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    pelė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    pultelis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    įkroviklis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    laidas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    baterija: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    lemputė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    laikrodis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'baltas', 'spalvotas', 'brangus'],
      act: ['matyti', 'pirkti', 'pasirinkti', 'padovanoti', 'paimti', 'padėti', 'fotografuoti', 'supakuoti'] },
    vaza: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'baltas', 'spalvotas', 'brangus'],
      act: ['matyti', 'pirkti', 'pasirinkti', 'padovanoti', 'paimti', 'padėti', 'fotografuoti', 'supakuoti'] },
    žvakė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'baltas', 'spalvotas', 'brangus'],
      act: ['matyti', 'pirkti', 'pasirinkti', 'padovanoti', 'paimti', 'padėti', 'fotografuoti', 'supakuoti'] },
    žvakidė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'baltas', 'spalvotas', 'brangus'],
      act: ['matyti', 'pirkti', 'pasirinkti', 'padovanoti', 'paimti', 'padėti', 'fotografuoti', 'supakuoti'] },
    vazonas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'nešvarus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'pasirinkti', 'plauti'] },
    rėmelis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'baltas', 'spalvotas', 'brangus'],
      act: ['matyti', 'pirkti', 'pasirinkti', 'padovanoti', 'paimti', 'padėti', 'fotografuoti', 'supakuoti'] },
    figūrėlė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'baltas', 'spalvotas', 'brangus'],
      act: ['matyti', 'pirkti', 'pasirinkti', 'padovanoti', 'paimti', 'padėti', 'fotografuoti', 'supakuoti'] },
    dėklas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    pakaba: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    šepetys: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    šluota: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    kibiras: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'nešvarus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'pasirinkti', 'plauti'] },
    kempinė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    muilinė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'nešvarus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'pasirinkti', 'plauti'] },
    praustuvas: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'baltas', 'brangus'],
      act: ['matyti', 'valyti', 'apžiūrėti', 'fotografuoti', 'pakeisti', 'pirkti', 'tikrinti', 'pasirinkti'] },
    kriauklė: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'baltas', 'brangus'],
      act: ['matyti', 'valyti', 'apžiūrėti', 'fotografuoti', 'pakeisti', 'pirkti', 'tikrinti', 'pasirinkti'] },
    vonia: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'baltas', 'brangus'],
      act: ['matyti', 'valyti', 'apžiūrėti', 'fotografuoti', 'pakeisti', 'pirkti', 'tikrinti', 'pasirinkti'] },
    čiaupas: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'baltas', 'brangus'],
      act: ['matyti', 'valyti', 'apžiūrėti', 'fotografuoti', 'pakeisti', 'pirkti', 'tikrinti', 'pasirinkti'] },
    lentynėlė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'gražus', 'švarus', 'nešvarus', 'sunkus'],
      act: ['matyti', 'pirkti', 'parduoti', 'valyti', 'pakeisti', 'apžiūrėti', 'fotografuoti', 'pasirinkti'] },
    stalčius: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'pilnas', 'tuščias', 'švarus', 'nešvarus'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'pasirinkti', 'plauti'] },
    rankenėlė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    jungiklis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    lizdas: { adj: ['naujas', 'senas', 'švarus', 'nešvarus', 'didelis', 'mažas', 'baltas', 'brangus'],
      act: ['matyti', 'valyti', 'apžiūrėti', 'fotografuoti', 'pakeisti', 'pirkti', 'tikrinti', 'pasirinkti'] },
    plaktukas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    atsuktuvas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    varžtas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    vinis: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    liniuotė: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    trintukas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'lengvas', 'sunkus', 'naudingas', 'reikalingas'],
      act: ['matyti', 'pirkti', 'paimti', 'laikyti', 'padėti', 'naudoti', 'rasti', 'pasirinkti'] },
    segtuvas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'baltas', 'spalvotas', 'gražus', 'plonas'],
      act: ['matyti', 'pirkti', 'paimti', 'padėti', 'rasti', 'pasirinkti', 'fotografuoti', 'laikyti'] },
    vokas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'baltas', 'spalvotas', 'gražus', 'plonas'],
      act: ['matyti', 'pirkti', 'paimti', 'padėti', 'rasti', 'pasirinkti', 'fotografuoti', 'laikyti'] },
    kalendorius: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'baltas', 'spalvotas', 'gražus', 'plonas'],
      act: ['matyti', 'pirkti', 'paimti', 'padėti', 'rasti', 'pasirinkti', 'fotografuoti', 'laikyti'] },
    žurnalas: { adj: ['naujas', 'senas', 'didelis', 'mažas', 'baltas', 'spalvotas', 'gražus', 'plonas'],
      act: ['matyti', 'pirkti', 'paimti', 'padėti', 'rasti', 'pasirinkti', 'fotografuoti', 'laikyti'] }
  };

  /* ---------- сцены ---------- */
  var SCENES = [];
  var SCENE = {};
  Object.keys(SCENES_V4).forEach(function (id) {
    if (!NOUN[id]) throw new Error('scene noun missing ' + id);
    var s = { noun: id, adjectives: SCENES_V4[id].adj.slice(), actions: SCENES_V4[id].act.slice(), published: true };
    s.adjectives.forEach(function (w) { if (!ADJ[w]) throw new Error('scene adj missing ' + id + ':' + w); });
    s.actions.forEach(function (w) { if (!VERB[w]) throw new Error('scene verb missing ' + id + ':' + w); });
    SCENES.push(s); SCENE[id] = s;
  });
  NOUNS.forEach(function (nn) {
    if (!nn.profile || SCENE[nn.id]) return;
    var p = PROFILES[nn.profile];
    if (!p) throw new Error('no profile ' + nn.profile + ' for ' + nn.id);
    var s = { noun: nn.id, adjectives: p.adj.slice(0, 8), actions: p.act.slice(), published: false };
    SCENES.push(s); SCENE[nn.id] = s;
  });

  /* ---------- словообразование ---------- */
  var UMAS = ['gražus', 'ramus', 'malonus', 'geras', 'saldus', 'kartus', 'sūrus', 'rūgštus', 'platus', 'gilus',
    'aukštas', 'ilgas', 'trumpas', 'greitas', 'lėtas', 'šiltas', 'šaltas', 'švelnus', 'sunkus', 'lengvas',
    'stiprus', 'silpnas', 'drąsus', 'tylus', 'garsus', 'linksmas', 'jaunas', 'senas', 'švarus', 'tamsus',
    'šviesus', 'skanus', 'patogus', 'minkštas', 'kietas', 'saugus'].map(function (id) {
      var adj = ADJ[id];
      var stem = id.replace(/(ias|as|us)$/, '');
      return { adj: id, ru: adj.ru, noun: stem + 'umas', nounRu: '' };
    });
  var UMAS_RU = { gražus: 'красота', ramus: 'спокойствие', malonus: 'приятность; удовольствие', geras: 'доброта', saldus: 'сладость',
    kartus: 'горечь', sūrus: 'солёность', rūgštus: 'кислота (вкус)', platus: 'ширина', gilus: 'глубина', aukštas: 'высота',
    ilgas: 'длина', trumpas: 'краткость', greitas: 'быстрота', lėtas: 'медлительность', šiltas: 'тепло', šaltas: 'холод',
    švelnus: 'мягкость; нежность', sunkus: 'тяжесть; трудность', lengvas: 'лёгкость', stiprus: 'сила; крепость',
    silpnas: 'слабость', drąsus: 'смелость', tylus: 'тишина', garsus: 'громкость', linksmas: 'весёлость', jaunas: 'молодость',
    senas: 'старость', švarus: 'чистота', tamsus: 'темнота', šviesus: 'светлость', skanus: 'вкусность', patogus: 'удобство',
    minkštas: 'мягкость', kietas: 'твёрдость', saugus: 'безопасность' };
  UMAS.forEach(function (u) { u.nounRu = UMAS_RU[u.adj]; });

  // пары «меняется само → изменяем что-то»
  var PAIRS = [
    { a: 'gerėti', aRu: 'становиться лучше', a3: 'gerėja', b: 'gerinti', bRu: 'делать лучше', b1: 'gerinu', subj: 'Oras', subjRu: 'Погода', obj: 'tekstą', objRu: 'текст' },
    { a: 'blogėti', aRu: 'ухудшаться', a3: 'blogėja', b: 'bloginti', bRu: 'ухудшать', b1: 'bloginu', subj: 'Padėtis', subjRu: 'Положение', obj: 'nuotaiką', objRu: 'настроение' },
    { a: 'didėti', aRu: 'увеличиваться', a3: 'didėja', b: 'didinti', bRu: 'увеличивать', b1: 'didinu', subj: 'Miestas', subjRu: 'Город', obj: 'kambarį', objRu: 'комнату' },
    { a: 'mažėti', aRu: 'уменьшаться', a3: 'mažėja', b: 'mažinti', bRu: 'уменьшать', b1: 'mažinu', subj: 'Kaina', subjRu: 'Цена', obj: 'kainą', objRu: 'цену' },
    { a: 'ilgėti', aRu: 'удлиняться', a3: 'ilgėja', b: 'ilginti', bRu: 'удлинять', b1: 'ilginu', subj: 'Diena', subjRu: 'День', obj: 'suknelę', objRu: 'платье' },
    { a: 'trumpėti', aRu: 'укорачиваться', a3: 'trumpėja', b: 'trumpinti', bRu: 'укорачивать', b1: 'trumpinu', subj: 'Naktis', subjRu: 'Ночь', obj: 'tekstą', objRu: 'текст' },
    { a: 'greitėti', aRu: 'ускоряться', a3: 'greitėja', b: 'greitinti', bRu: 'ускорять', b1: 'greitinu', subj: 'Mašina', subjRu: 'Машина', obj: 'darbą', objRu: 'работу' },
    { a: 'lėtėti', aRu: 'замедляться', a3: 'lėtėja', b: 'lėtinti', bRu: 'замедлять', b1: 'lėtinu', subj: 'Traukinys', subjRu: 'Поезд', obj: 'mašiną', objRu: 'машину' },
    { a: 'stiprėti', aRu: 'усиливаться; крепнуть', a3: 'stiprėja', b: 'stiprinti', bRu: 'усиливать; укреплять', b1: 'stiprinu', subj: 'Vėjas', subjRu: 'Ветер', obj: 'širdį', objRu: 'сердце' },
    { a: 'silpnėti', aRu: 'ослабевать', a3: 'silpnėja', b: 'silpninti', bRu: 'ослаблять', b1: 'silpninu', subj: 'Vėjas', subjRu: 'Ветер', obj: 'garsą', objRu: 'звук' },
    { a: 'platėti', aRu: 'расширяться', a3: 'platėja', b: 'platinti', bRu: 'расширять', b1: 'platinu', subj: 'Kelias', subjRu: 'Дорога', obj: 'kelią', objRu: 'дорогу' },
    { a: 'gilėti', aRu: 'углубляться', a3: 'gilėja', b: 'gilinti', bRu: 'углублять', b1: 'gilinu', subj: 'Upė', subjRu: 'Река', obj: 'upę', objRu: 'реку' },
    { a: 'gražėti', aRu: 'хорошеть', a3: 'gražėja', b: 'gražinti', bRu: 'украшать; делать красивее', b1: 'gražinu', subj: 'Sodas', subjRu: 'Сад', obj: 'sodą', objRu: 'сад' }
  ];
  PAIRS.forEach(function (p) {
    v(p.a, p.aRu, p.a3, p.a3.replace(/ja$/, 'jo'), { note: 'Непереходный: у него нет объекта в Galininkas.' });
    v(p.b, p.bRu, p.b1.replace(/u$/, 'a'), p.b1.replace(/u$/, 'o'));
  });

  // материал → описание
  var MATERIALS = [
    { noun: 'stiklas', ru: 'стекло', adj: 'stiklinis', note: 'stikl- + -inis' },
    { noun: 'metalas', ru: 'металл', adj: 'metalinis', note: 'metal- + -inis' },
    { noun: 'akmuo', ru: 'камень', adj: 'akmeninis', note: 'основа меняется: akmuo → akmen- + -inis' },
    { noun: 'medis', ru: 'дерево', adj: 'medinis', note: 'med- + -inis' },
    { noun: 'popierius', ru: 'бумага', adj: 'popierinis', note: 'popier- + -inis' },
    { noun: 'oda', ru: 'кожа', adj: 'odinis', note: 'od- + -inis' },
    { noun: 'auksas', ru: 'золото', adj: 'auksinis', note: 'auks- + -inis' },
    { noun: 'sidabras', ru: 'серебро', adj: 'sidabrinis', note: 'sidabr- + -inis' },
    { noun: 'molis', ru: 'глина', adj: 'molinis', note: 'mol- + -inis' },
    { noun: 'geležis', ru: 'железо', adj: 'geležinis', note: 'gelež- + -inis' }
  ];

  /* ---------- полный перевод ---------- */
  // [русское предложение, [допустимые литовские варианты], объяснение, (глагол)]
  var TRANSLATIONS = [
    ['Я мою чистое окно.', ['Aš plaunu švarų langą', 'Plaunu švarų langą', 'Aš švarų langą plaunu'], 'langas — jis; ką? švarų langą. Личное местоимение можно опустить: форма plaunu уже показывает «я».', 'plauti'],
    ['Ты открываешь новую дверь.', ['Tu atidarai naujas duris', 'Atidarai naujas duris'], 'durys — только множественное, jos. Ką? naujas duris.', 'atidaryti'],
    ['Он читает интересную книгу.', ['Jis skaito įdomią knygą', 'Jis įdomią knygą skaito'], 'knyga — ji. Ką? įdomią knygą: у -us перед -ią появляется i.', 'skaityti'],
    ['Она покупает красивые цветы.', ['Ji perka gražias gėles', 'Ji gražias gėles perka'], 'gėlės — jos. Ką? gražias gėles.', 'pirkti'],
    ['Мы видим большой дом.', ['Mes matome didelį namą', 'Matome didelį namą'], 'namas — jis. Ką? didelį namą.', 'matyti'],
    ['Вы пишете длинное письмо.', ['Jūs rašote ilgą laišką', 'Rašote ilgą laišką'], 'laiškas — jis. Ką? ilgą laišką.', 'rašyti'],
    ['Они (м.) моют грязную машину.', ['Jie plauna nešvarią mašiną'], 'mašina — ji. Ką? nešvarią mašiną.', 'plauti'],
    ['Они (ж.) едят сладкие яблоки.', ['Jos valgo saldžius obuolius'], 'obuoliai — jie. Ką? saldžius obuolius: d → dž перед i.', 'valgyti'],
    ['Я люблю тёплое молоко.', ['Aš mėgstu šiltą pieną', 'Mėgstu šiltą pieną'], 'О еде и напитках говорим mėgti. pienas — jis; ką? šiltą pieną.', 'mėgti'],
    ['Ты чинишь старый стул.', ['Tu taisai seną kėdę', 'Taisai seną kėdę'], 'kėdė — ji, хотя «стул» по-русски мужского рода. Ką? seną kėdę.', 'taisyti'],
    ['Мы покупаем новую мебель.', ['Mes perkame naujus baldus', 'Perkame naujus baldus'], 'baldai — только множественное, jie. Ką? naujus baldus.', 'pirkti'],
    ['Я вижу белую собаку.', ['Aš matau baltą šunį', 'Matau baltą šunį'], 'šuo — jis, основа šun-. Ką? baltą šunį.', 'matyti'],
    ['Он режет свежий хлеб.', ['Jis pjausto šviežią duoną'], 'duona — ji. Ką? šviežią duoną.', 'pjaustyti'],
    ['Мы стираем грязные брюки.', ['Mes skalbiame nešvarias kelnes', 'Skalbiame nešvarias kelnes'], 'kelnės — только множественное, jos. Ką? nešvarias kelnes.', 'skalbti'],
    ['Она гладит белую рубашку.', ['Ji lygina baltus marškinius'], 'marškiniai — только множественное, jie, даже об одной рубашке. Ką? baltus marškinius.', 'lyginti'],
    ['Я пью горячий кофе.', ['Aš geriu karštą kavą', 'Geriu karštą kavą'], 'kava — ji, хотя «кофе» по-русски мужского рода. Ką? karštą kavą.', 'gerti'],
    ['Дети любят сладкий торт.', ['Vaikai mėgsta saldų tortą'], 'vaikai — jie; глагол в 3-м лице: mėgsta. Ką? saldų tortą.', 'mėgti'],
    ['Мама варит вкусный суп.', ['Mama verda skanią sriubą', 'Mama verda gardžią sriubą'], 'sriuba — ji. Ką? skanią sriubą.', 'virti'],
    ['Брат фотографирует старый мост.', ['Brolis fotografuoja seną tiltą'], 'tiltas — jis. Ką? seną tiltą.', 'fotografuoti'],
    ['Я приглашаю хорошего друга.', ['Aš kviečiu gerą draugą', 'Kviečiu gerą draugą'], 'draugas — jis. Ką? gerą draugą. Одушевлённость на форму не влияет.', 'kviesti'],
    ['Мы встречаем весёлую сестру.', ['Mes sutinkame linksmą sesę', 'Sutinkame linksmą sesę', 'Mes sutinkame linksmą seserį', 'Sutinkame linksmą seserį'], 'sesė — ji; ką? linksmą sesę. Литературное sesuo даёт seserį.', 'sutikti'],
    ['Ты видишь чистые окна.', ['Tu matai švarius langus', 'Matai švarius langus'], 'langai — jie. Ką? švarius langus.', 'matyti'],
    ['Он покупает новые очки.', ['Jis perka naujus akinius'], 'akiniai — только множественное, jie. Ką? naujus akinius.', 'pirkti'],
    ['Она открывает большую коробку.', ['Ji atidaro didelę dėžę'], 'dėžė — ji. Ką? didelę dėžę: didelis даёт didelę.', 'atidaryti'],
    ['Я меняю старую лампу.', ['Aš keičiu seną lempą', 'Keičiu seną lempą'], 'lempa — ji. Ką? seną lempą.', 'keisti'],
    ['Мы читаем короткие тексты.', ['Mes skaitome trumpus tekstus', 'Skaitome trumpus tekstus'], 'tekstai — jie. Ką? trumpus tekstus.', 'skaityti'],
    ['Вы моете глубокие тарелки.', ['Jūs plaunate gilias lėkštes', 'Plaunate gilias lėkštes'], 'lėkštės — jos. Ką? gilias lėkštes.', 'plauti'],
    ['Они (ж.) сушат мокрые полотенца.', ['Jos džiovina šlapius rankšluosčius'], 'rankšluosčiai — jie: t → č перед -iai. Ką? šlapius rankšluosčius.', 'džiovinti'],
    ['Я держу острый нож.', ['Aš laikau aštrų peilį', 'Laikau aštrų peilį'], 'peilis — jis. Ką? aštrų peilį.', 'laikyti'],
    ['Ты закрываешь тяжёлую дверь.', ['Tu uždarai sunkias duris', 'Uždarai sunkias duris'], 'durys — jos. Ką? sunkias duris.', 'uždaryti'],
    ['Он проветривает маленькую комнату.', ['Jis vėdina mažą kambarį'], 'kambarys — jis. Ką? mažą kambarį.', 'vėdinti'],
    ['Мы красим серую стену.', ['Mes dažome pilką sieną', 'Dažome pilką sieną'], 'siena — ji. Ką? pilką sieną.', 'dažyti'],
    ['Я пишу новое сообщение.', ['Aš rašau naują žinutę', 'Rašau naują žinutę'], 'žinutė — ji. Ką? naują žinutę.', 'rašyti'],
    ['Она получает длинное письмо.', ['Ji gauna ilgą laišką'], 'laiškas — jis. Ką? ilgą laišką.', 'gauti'],
    ['Они (м.) строят высокий дом.', ['Jie stato aukštą namą'], 'namas — jis. Ką? aukštą namą.', 'statyti'],
    ['У меня есть хорошая работа.', ['Aš turiu gerą darbą', 'Turiu gerą darbą'], 'Русское «у меня есть» — литовское turėti + ką? Объект в Galininkas: gerą darbą.', 'turėti'],
    ['У тебя есть большая собака.', ['Tu turi didelį šunį', 'Turi didelį šunį'], 'turėti + ką? didelį šunį.', 'turėti'],
    ['У нас есть тёплые одеяла.', ['Mes turime šiltas antklodes', 'Turime šiltas antklodes'], 'antklodės — jos. Ką? šiltas antklodes.', 'turėti'],
    ['Учительница проверяет трудные задания.', ['Mokytoja tikrina sunkias užduotis'], 'užduotys — jos, третье склонение: ką? užduotis. Описание sunkias согласуется по jos.', 'tikrinti'],
    ['Я вижу красивую женщину.', ['Aš matau gražią moterį', 'Matau gražią moterį'], 'moteris — ji, несмотря на -is. Ką? gražią moterį.', 'matyti'],
    ['Дедушка сажает молодое дерево.', ['Senelis sodina jauną medį'], 'medis — jis. Ką? jauną medį.', 'sodinti'],
    ['Ты поливаешь красные цветы.', ['Tu laistai raudonas gėles', 'Laistai raudonas gėles'], 'gėlės — jos. Ką? raudonas gėles.', 'laistyti'],
    ['Мы любим спокойное море.', ['Mes mylime ramią jūrą', 'Mylime ramią jūrą', 'Mes mėgstame ramią jūrą', 'Mėgstame ramią jūrą'], 'jūra — ji. Ką? ramią jūrą. Возможны и mylėti, и mėgti.', 'mylėti'],
    ['Вы слышите громкую музыку.', ['Jūs girdite garsią muziką', 'Girdite garsią muziką'], 'muzika — ji. Ką? garsią muziką.', 'girdėti'],
    ['Я понимаю литовский язык.', ['Aš suprantu lietuvių kalbą', 'Suprantu lietuvių kalbą'], 'kalba — ji; ką? kalbą. Lietuvių — родительный множественного от lietuvis: «язык литовцев».', 'suprasti']
  ];

  /* ---------- экспорт ---------- */
  global.DD = {
    NOUNS: NOUNS, NOUN: NOUN, ADJS: ADJS, ADJ: ADJ, VERBS: VERBS, VERB: VERB,
    PRONOUNS: PRONOUNS, PROFILES: PROFILES, SCENES: SCENES, SCENE: SCENE, SCENES_V4: SCENES_V4,
    UMAS: UMAS, PAIRS: PAIRS, MATERIALS: MATERIALS, TRANSLATIONS: TRANSLATIONS,
    conjugate: conjugate, pal: pal, depal: depal
  };
})(typeof window !== 'undefined' ? window : globalThis);

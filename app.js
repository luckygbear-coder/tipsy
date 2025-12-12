// ========= 圖片路徑容錯（Images/ 或 images/ 都可） =========
const IMG_TRY = ["Images/tipsy-bear.png", "images/tipsy-bear.png"];
function setBearImages(){
  const targets = ["bearIconTop","bearHeroImg","loadBear"];
  let idx = 0;
  const apply = () => targets.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.src = IMG_TRY[idx];
  });
  apply();
  const hero = document.getElementById("bearHeroImg");
  if(hero){
    hero.onerror = () => { idx = Math.min(idx+1, IMG_TRY.length-1); apply(); };
  }
}

// ========= 基本 =========
const IG_URL = "https://instagram.com/luckygbear";
const KEY_HISTORY = "tipsyBear_history_v6";
const KEY_FAV = "tipsyBear_fav_v6";

const $ = (id)=>document.getElementById(id);
const toast = $("toast");
const loading = $("loading");

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>toast.classList.remove("show"), 1400);
}
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }
function safeJSONParse(s, fallback){ try{ return JSON.parse(s) ?? fallback; }catch(e){ return fallback; } }
function getHistory(){ return safeJSONParse(localStorage.getItem(KEY_HISTORY), []); }
function setHistory(list){ localStorage.setItem(KEY_HISTORY, JSON.stringify(list)); }
function getFav(){ return safeJSONParse(localStorage.getItem(KEY_FAV), []); }
function setFav(list){ localStorage.setItem(KEY_FAV, JSON.stringify(list)); }

function addHistory(entry){
  const list = getHistory();
  list.unshift(entry);
  setHistory(list.slice(0, 120));
}
function updateHistoryMemo(ts, memo){
  const list = getHistory();
  const i = list.findIndex(x => x.ts === ts);
  if(i >= 0){
    list[i].memo = memo;
    setHistory(list);
    return true;
  }
  return false;
}
function toggleFav(drinkId){
  const list = getFav();
  const i = list.indexOf(drinkId);
  if(i>=0){ list.splice(i,1); setFav(list); return false; }
  list.unshift(drinkId);
  setFav(Array.from(new Set(list)).slice(0, 200));
  return true;
}
function isFav(drinkId){ return getFav().includes(drinkId); }

function formatTime(ts){
  const d = new Date(ts);
  const pad = (n)=>String(n).padStart(2,"0");
  return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function withLoading(fn){
  loading.classList.add("show");
  const minDelay = new Promise(res=>setTimeout(res, 750));
  const run = Promise.resolve().then(fn);
  await Promise.all([minDelay, run]);
  loading.classList.remove("show");
}

// ========= 文案 =========
const TODAY_LINES = [
  "「今晚不用很堅強，剛剛好就好。」",
  "「你不用解釋，我陪你坐一下。」",
  "「慢慢聊，慢慢把今天放下。」",
  "「不喝也沒關係，我陪你聊聊就好。」",
  "「今天的你辛苦了，來一口溫柔。」"
];

const GENERAL_WARN = [
  "⚠️ 未滿 18 歲請勿飲酒。",
  "⚠️ 喝酒不開車、開車不喝酒。",
  "⚠️ 酒量因人而異，小口慢慢喝。",
  "⚠️ 孕婦、服藥中或身體不適者，請避免飲酒。",
  "⚠️ 若心情非常低落，酒不是解答，請找可信任的人或專業協助。"
];

const MOOD_3 = {
  "放鬆": [
    "🐻「先把肩膀放下來一點點。」",
    "🐻「今天就到這裡也可以。」",
    "🐻「我們慢慢來，先讓身體鬆一點。」"
  ],
  "想聊聊": [
    "🐻「你說，我聽。」",
    "🐻「把心事倒出來，杯子就不那麼重了。」",
    "🐻「不用整理好再來，亂亂的也可以。」"
  ],
  "想慶祝": [
    "🐻「來～為你努力到現在乾杯！」",
    "🐻「小小的勝利也值得。」",
    "🐻「你值得被好好稱讚一次。」"
  ]
};

const BEAR_CHAT_30 = [
  "🐻「你來了就好，我在。」",
  "🐻「今天的你辛苦了。」",
  "🐻「不用把自己逼太緊，真的。」",
  "🐻「你不用表現得很堅強。」",
  "🐻「你願意說一點點就好。」",
  "🐻「如果你想哭，也沒關係。」",
  "🐻「你不是一個人。」",
  "🐻「我可以陪你把今天收起來。」",
  "🐻「先深呼吸一下，好嗎？」",
  "🐻「你做得比你想的還多。」",
  "🐻「我想抱抱你（如果你願意）。」",
  "🐻「你可以慢慢來，沒人催你。」",
  "🐻「你不需要立刻好起來。」",
  "🐻「你的感受很重要。」",
  "🐻「我在聽，你說。」",
  "🐻「今天最累的是哪裡？」",
  "🐻「你最想被理解的是什麼？」",
  "🐻「你願意對自己溫柔一點嗎？」",
  "🐻「你已經很努力了，真的。」",
  "🐻「如果可以放下 1%，你想放下什麼？」",
  "🐻「你值得被好好對待。」",
  "🐻「不用急著給答案。」",
  "🐻「你可以先休息，再決定。」",
  "🐻「今晚只做一件事：照顧你。」",
  "🐻「你想要陪伴，還是想要方向？」",
  "🐻「你願意把心事說給我聽嗎？」",
  "🐻「我不評價你，我只陪你。」",
  "🐻「你今天有一點點快樂嗎？」",
  "🐻「明天的事，明天再說。」",
  "🐻「你願意原諒自己一次嗎？」"
];

// ========= 酒資料（沿用你原本 33 杯，只是「顯示」分類變少） =========
// cat: beer / red / white / spirit / cocktail / na
const DRINKS = [
  {id:1, cat:"beer", emoji:"🍺", name:"拉格（Lager）", tag:"清爽・順口・日常小確幸", moods:["放鬆","想聊聊"],
    story:"拉格像把一天的汗與煩躁洗掉：乾淨、清爽、很可靠。",
    flavor:"清爽麥香＋淡淡啤酒花，收口乾淨。",
    warn:"別空腹；容易脹氣者配點食物更舒服。",
    followUps:["你今天最想洗掉的是哪一件事？","你想先被安慰，還是先被理解？"]},
  {id:2, cat:"beer", emoji:"🍺", name:"皮爾森（Pilsner）", tag:"乾爽・俐落・啤酒花香", moods:["放鬆","想聊聊"],
    story:"像把『今天』切成俐落的一刀：清、脆、乾爽，思緒會更乾淨。",
    flavor:"啤酒花更明顯，苦韻俐落、清爽。",
    warn:"酸苦感可能刺激胃，請搭配食物。",
    followUps:["你腦袋裡最吵的那句話是什麼？","你想把哪段思緒先放下？"]},
  {id:3, cat:"beer", emoji:"🍺", name:"艾爾（Ale）", tag:"麥香溫暖・耐聊", moods:["想聊聊","放鬆"],
    story:"艾爾像會陪你聊的朋友：溫暖、有香氣，讓心事變好說。",
    flavor:"厚一點的麥芽香，常帶果香或焦糖感。",
    warn:"酒感較明顯，別急著喝快。",
    followUps:["你希望今晚的聊天偏溫柔還是直接？","最想被理解的是哪一件事？"]},
  {id:4, cat:"beer", emoji:"🍺", name:"IPA", tag:"苦香醒腦・反差回甘", moods:["想聊聊","想慶祝"],
    story:"先苦後回甘像成長：承認累，才會回甜。",
    flavor:"柑橘/松針啤酒花香，苦韻明顯。",
    warn:"初學者少量；苦味可能讓你喝更快，記得慢。",
    followUps:["你覺得苦的是事情，還是期待？","回甘那刻你想對自己說什麼？"]},
  {id:5, cat:"beer", emoji:"🍺", name:"小麥啤酒（Wheat）", tag:"柔和果香・像雲", moods:["放鬆","想聊聊"],
    story:"像一團雲把你包住：不刺、不硬，緊繃會鬆一點。",
    flavor:"柔和麥香，可能帶輕果香（依風格）。",
    warn:"對麩質敏感者避免；甜感也容易喝多。",
    followUps:["你想對自己溫柔一點的是哪裡？","你願意放過自己一次嗎？"]},
  {id:6, cat:"beer", emoji:"🍺", name:"黑啤（Stout）", tag:"可可烘焙・夜晚擁抱", moods:["放鬆","想聊聊"],
    story:"厚厚的黑啤像夜晚的抱抱：慢慢喝，心也慢慢安。",
    flavor:"可可/咖啡烘焙香，尾韻厚實。",
    warn:"口感濃別猛灌；配甜點/鹹食都很棒。",
    followUps:["今晚你最需要安慰還是肯定？","你願意允許自己慢下來嗎？"]},

  {id:7, cat:"red", emoji:"🍷", name:"卡本內蘇維濃", tag:"成熟有力・結構感紅酒", moods:["想聊聊","想慶祝"],
    story:"像一位有肩膀的大人：你可以靠一下，然後想起你其實也很強。",
    flavor:"黑醋栗＋木質感，單寧較明顯。",
    warn:"酒感較強，搭配食物更舒服。",
    followUps:["你最近最撐的是哪件事？","你願意把責任放下一點點嗎？"]},
  {id:8, cat:"red", emoji:"🍷", name:"梅洛（Merlot）", tag:"柔順圓潤・溫柔紅酒", moods:["放鬆","想聊聊"],
    story:"它不逼你勇敢，只輕輕說：你已經做得很好了。",
    flavor:"紅莓/李子香氣，口感柔順。",
    warn:"甜柔容易喝多；慢慢來。",
    followUps:["你希望有人對你說『你很好』嗎？","你最想被稱讚的一件事是？"]},

  {id:9, cat:"white", emoji:"🥂", name:"夏多內（Chardonnay）", tag:"白酒經典・柔光質地", moods:["想慶祝","放鬆"],
    story:"像把日子調成柔光：舒服不刺眼，讓你願意對自己更好。",
    flavor:"蘋果/柑橘；部分帶奶油或烤麵包感。",
    warn:"別冰過頭；太冰會壓掉香氣。",
    followUps:["你想怎麼犒賞自己？","你今天值得被好好對待的理由是？"]},
  {id:10, cat:"white", emoji:"🥂", name:"白蘇維濃（Sauvignon Blanc）", tag:"清新草本・像清晨", moods:["放鬆"],
    story:"像早晨開窗那口風：清爽、明亮，讓你想重新開始。",
    flavor:"草本＋柑橘，酸度明亮。",
    warn:"胃酸敏感者配食物；慢喝。",
    followUps:["你想重新開始的第一步是？","你最想清爽掉的是什麼？"]},
  {id:11, cat:"white", emoji:"🍷", name:"粉紅酒（Rosé）", tag:"輕盈可愛・剛剛好", moods:["想慶祝","想聊聊"],
    story:"像一句剛剛好的稱讚：不過度、不敷衍，很剛好。",
    flavor:"莓果＋花香，輕盈順口（依風格）。",
    warn:"甜口更容易不知不覺喝多。",
    followUps:["你想把今晚變可愛一點嗎？","你最近的小幸福是什麼？"]},
  {id:12, cat:"white", emoji:"🥂", name:"氣泡酒（Sparkling）", tag:"泡泡儀式感・把日子變亮", moods:["想慶祝"],
    story:"每個泡泡都在說：你值得開心。小快樂也值得乾杯。",
    flavor:"清脆氣泡＋果香，收口俐落。",
    warn:"氣泡會加速吸收，慢慢喝。",
    followUps:["你想為哪件小事乾杯？","今天最亮的瞬間是？"]},

  {id:13, cat:"spirit", emoji:"🥃", name:"威士忌（Whisky）", tag:"深沉木質・慢慢聊", moods:["想聊聊","放鬆"],
    story:"像深夜對話：不急著結論，只陪你把真心說完。",
    flavor:"木質＋香草＋焦糖（依桶陳）。",
    warn:"酒精濃度高，小口即可。",
    followUps:["你最想說的真心是哪句？","你想要陪伴還是方向？"]},
  {id:14, cat:"spirit", emoji:"🥃", name:"波本（Bourbon）", tag:"香草焦糖・像壁爐", moods:["放鬆","想聊聊"],
    story:"像冬夜的毯子：甜甜的，但不膩，讓你想照顧自己。",
    flavor:"香草＋焦糖＋烤橡木。",
    warn:"甜感會讓人低估酒精，小心。",
    followUps:["你今天最想被照顧的是心還是身體？","你願意對自己溫暖一下嗎？"]},
  {id:15, cat:"spirit", emoji:"🥃", name:"蘇格蘭（Scotch）", tag:"煙燻泥煤・回憶感", moods:["想聊聊"],
    story:"煙燻像回憶：有些刺、有些暖，入口後更懂自己。",
    flavor:"煙燻/泥煤，可能帶海風鹹感（依產區）。",
    warn:"初次可加一點水；不要急喝。",
    followUps:["那段回憶你想留著還是放下？","你願意原諒當時的自己嗎？"]},
  {id:16, cat:"spirit", emoji:"🍸", name:"琴酒（Gin）", tag:"草本清醒・俐落微醺", moods:["放鬆","想聊聊"],
    story:"像把腦袋整理好：清爽俐落，但仍有香氣的情緒。",
    flavor:"杜松子＋草本＋柑橘皮香。",
    warn:"搭配含糖飲很容易喝快，記得慢。",
    followUps:["你想把混亂整理成哪三個字？","你願意先把自己放回中心嗎？"]},
  {id:17, cat:"spirit", emoji:"🍸", name:"伏特加（Vodka）", tag:"乾淨中性・很好配", moods:["想慶祝"],
    story:"像白紙：你怎麼搭，它就怎麼陪你。你可以決定今晚味道。",
    flavor:"乾淨、酒感直接、香氣少。",
    warn:"順口不代表弱，請慢慢喝。",
    followUps:["你想把今晚調成什麼味道？","你最想自己決定的是什麼？"]},
  {id:18, cat:"spirit", emoji:"🥃", name:"龍舌蘭（Tequila）", tag:"陽光冒險・直球熱烈", moods:["想慶祝"],
    story:"像沙漠太陽：直接、熱烈。喝的不是刺激，是勇敢。",
    flavor:"植物香＋胡椒感，收口乾爽。",
    warn:"別連續 shot；慢喝最安全。",
    followUps:["你願意勇敢一次會選哪件事？","你想把熱情放回哪裡？"]},

  {id:19, cat:"cocktail", emoji:"🍸", name:"莫希托（Mojito）", tag:"薄荷清爽・透氣自由", moods:["放鬆","想慶祝"],
    story:"像把心裡的悶打開一條縫：讓你呼吸到自由。",
    flavor:"薄荷＋萊姆清酸＋氣泡清爽。",
    warn:"清爽很容易喝多，慢慢喝。",
    followUps:["你想吐掉的那口悶氣是什麼？","你願意先讓自己喘口氣嗎？"]},
  {id:20, cat:"cocktail", emoji:"🍸", name:"瑪格麗特（Margarita）", tag:"酸甜鹽邊・有態度", moods:["想慶祝"],
    story:"鹽邊像界線：你可以溫柔，但不必委屈自己。",
    flavor:"萊姆酸＋龍舌蘭，鹽邊提味。",
    warn:"酸度高；胃敏感者搭食物。",
    followUps:["你最想對哪件事說『不』？","你想守護的界線是什麼？"]},
  {id:21, cat:"cocktail", emoji:"🥃", name:"老古典（Old Fashioned）", tag:"經典穩重・慢甜", moods:["想聊聊","放鬆"],
    story:"不追流行，只把基本做好。像你：其實很可靠。",
    flavor:"威士忌＋糖＋苦精＋橙皮香。",
    warn:"濃度高，小口就很夠。",
    followUps:["你最可靠的一面是什麼？","你願意承認你也需要被照顧嗎？"]},
  {id:22, cat:"cocktail", emoji:"🍸", name:"尼格羅尼（Negroni）", tag:"苦甜平衡・成熟反差", moods:["想聊聊"],
    story:"先苦後回甘：不是每次都舒服，但會更懂自己。",
    flavor:"苦甜草本＋柑橘皮香，尾韻長。",
    warn:"苦感明顯，初學者少量。",
    followUps:["你最近在練習的成熟是什麼？","你願意把『苦』說出口嗎？"]},
  {id:23, cat:"cocktail", emoji:"🍸", name:"馬丁尼（Martini）", tag:"極簡乾淨・高冷優雅", moods:["放鬆","想聊聊"],
    story:"像一句短句：不多，但很準。今晚不解釋也可以。",
    flavor:"乾淨草本，可能帶橄欖鹹香。",
    warn:"濃度高，慢慢喝。",
    followUps:["你今天最想停止解釋的是什麼？","你願意回到自己的中心嗎？"]},
  {id:24, cat:"cocktail", emoji:"🍸", name:"琴通寧（Gin Tonic）", tag:"清爽草本・簡單耐喝", moods:["放鬆","想慶祝"],
    story:"像把今天清掉：你不必贏，只要把自己照顧好。",
    flavor:"杜松草本＋通寧微苦＋氣泡。",
    warn:"氣泡加速吸收；慢喝。",
    followUps:["你想把今天清掉的第一件事是？","你需要放鬆還是肯定？"]},
  {id:25, cat:"cocktail", emoji:"🍅", name:"血腥瑪麗（Bloody Mary）", tag:"香料番茄・醒腦湯感", moods:["想聊聊"],
    story:"像一碗勇敢的湯：有點辣、有點鹹，喝完會覺得我還可以。",
    flavor:"番茄＋香料＋胡椒（依配方）。",
    warn:"含鹽香料；血壓/腎臟需留意者慎飲。",
    followUps:["你願意為自己打氣一句嗎？","你的『還可以』來自哪裡？"]},
  {id:26, cat:"cocktail", emoji:"🥃", name:"威士忌酸（Whiskey Sour）", tag:"酸甜平衡・柔和轉折", moods:["放鬆","想聊聊"],
    story:"像一句道歉：不卑微、不逞強，只是把關係拉回剛剛好。",
    flavor:"檸檬酸＋威士忌，甜度平衡。",
    warn:"酸度＋酒精都在，慢慢喝。",
    followUps:["你想修補的是關係，還是你自己？","你願意給自己一個轉折嗎？"]},
  {id:27, cat:"cocktail", emoji:"🍹", name:"長島冰茶（Long Island Iced Tea）", tag:"看似溫柔其實很猛", moods:["想慶祝"],
    story:"像『看起來沒事』的你：表面輕鬆，裡面其實撐很久。",
    flavor:"多基酒混合＋柑橘與可樂感，酒感隱藏。",
    warn:"濃度高！務必慢喝；喝酒不開車。",
    followUps:["你有哪件事其實撐很久？","你願意讓自己不用假裝嗎？"]},

  {id:28, cat:"spirit", emoji:"🍶", name:"清酒（日本酒）", tag:"米香柔和・安靜陪伴", moods:["放鬆","想聊聊"],
    story:"像靜靜點燈：不吵，但讓你覺得有人在。",
    flavor:"米香＋柔和甜旨，尾韻乾淨（依風格）。",
    warn:"別猛灌；溫飲/冷飲皆可。",
    followUps:["你想要安靜，還是被理解？","今晚你想把心放在哪？"]},
  {id:29, cat:"cocktail", emoji:"🍑", name:"梅酒", tag:"酸甜果香・可愛但別小看", moods:["想慶祝","想聊聊"],
    story:"像一句撒嬌：甜甜帶酸，讓心變得好打開。",
    flavor:"梅子果香＋酸甜平衡，柔順。",
    warn:"甜口很容易喝多；慢慢喝。",
    followUps:["你今天想要的甜是哪一種？","你最近的小確幸是什麼？"]},
  {id:30, cat:"spirit", emoji:"🍶", name:"紹興酒", tag:"醇厚米香・家常溫暖", moods:["放鬆","想聊聊"],
    story:"像長輩的關心：不花俏，但很真。有時被照顧很幸福。",
    flavor:"米麴香＋醇厚尾韻，溫暖。",
    warn:"酒感厚；搭配食物更舒服。",
    followUps:["你最近有被好好照顧嗎？","你最想回到的『家』是什麼感覺？"]},
  {id:31, cat:"spirit", emoji:"🥃", name:"高粱酒", tag:"直球辛香・存在感強", moods:["想慶祝"],
    story:"像一句真話：不拐彎抹角。但真話也要溫柔地說。",
    flavor:"辛香＋穀物香，酒感直接。",
    warn:"濃度高！小口即可，避免連續杯。",
    followUps:["你最想說的真話是什麼？","你想把哪個糾結斷開？"]},

  {id:32, cat:"na", emoji:"🫧", name:"無酒精調酒（Mocktail）", tag:"不喝也很酷・享受氛圍", moods:["放鬆","想聊聊","想慶祝"],
    story:"你不需要酒精才能放鬆。你值得的是被好好對待的夜晚。",
    flavor:"果香/草本/氣泡都可能（依配方），清爽感高。",
    warn:"仍可能含糖較高；注意攝取。",
    followUps:["今晚不喝也沒關係，你想怎麼溫柔自己？","如果只選一個舒服的小事，你選什麼？"]},
  {id:33, cat:"na", emoji:"🥂", name:"低酒精氣泡調飲", tag:"微甜微醺・輕盈不負擔", moods:["放鬆","想慶祝","想聊聊"],
    story:"像把疲憊調得更輕：不硬撐，也不放縱。剛剛好最美。",
    flavor:"輕果香＋細緻氣泡，甜度柔和。",
    warn:"仍含酒精；未滿 18 禁止飲用。",
    followUps:["你想把今天變輕的第一步是什麼？","你想要的快樂是安靜還是熱鬧？"]}
];

// ========= 狀態 =========
let currentMood = null;
let currentDrink = null;
let currentHistoryTs = null;

// ========= 漫畫氣泡（主畫面） =========
function refreshComicBubble(){
  const b = $("comicBubble");
  if(!b) return;
  if(currentMood){
    b.textContent = pick(MOOD_3[currentMood] || BEAR_CHAT_30);
  }else{
    b.textContent = pick(BEAR_CHAT_30);
  }
}

function getPool(){
  if(!currentMood) return DRINKS;
  return DRINKS.filter(d => (d.moods||[]).includes(currentMood));
}

function findDrink(id){ return DRINKS.find(d=>d.id===id) || null; }

function setFavButton(){
  if(!currentDrink){ $("btnFav").textContent = "⭐ 收藏"; return; }
  $("btnFav").textContent = isFav(currentDrink.id) ? "✅ 已收藏" : "⭐ 收藏";
}

// ========= 酒卡跳窗 =========
const drinkMask = $("drinkMask");
function openDrinkModal(){ drinkMask.classList.add("show"); }
function closeDrinkModal(){ drinkMask.classList.remove("show"); }
$("drinkClose").addEventListener("click", closeDrinkModal);
drinkMask.addEventListener("click", (e)=>{ if(e.target===drinkMask) closeDrinkModal(); });

function renderDrinkModal(drink, moodUsed, modeLabel, historyTs){
  currentDrink = drink;
  currentHistoryTs = historyTs ?? null;

  $("drinkTitle").textContent = modeLabel || "今晚的一杯";
  $("drinkEmoji").textContent = drink.emoji;
  $("drinkName").textContent = drink.name;
  $("drinkTag").textContent = drink.tag;

  $("drinkMoodLine").style.display = moodUsed ? "inline-block" : "none";
  if(moodUsed){
    $("drinkMoodLine").textContent = `依心情：${moodUsed}｜適合：${(drink.moods||[]).join("、")}`;
  }

  $("drinkStory").textContent  = drink.story;
  $("drinkFlavor").textContent = drink.flavor;
  $("drinkFollow").textContent = "🐻「" + pick(drink.followUps || ["你今天還好嗎？"]) + "」";
  $("drinkWarn").textContent   = drink.warn + "\n" + pick(GENERAL_WARN);

  // memo 預填
  const memoInput = $("memoInput");
  memoInput.value = "";
  if(historyTs){
    const h = getHistory();
    const row = h.find(x=>x.ts===historyTs);
    if(row && row.memo) memoInput.value = row.memo;
  }

  setFavButton();
  openDrinkModal();
}

// 保存 memo
$("btnSaveMemo").addEventListener("click", ()=>{
  const memo = ($("memoInput").value || "").trim();
  if(!memo){ showToast("先寫一句再保存 📝"); return; }

  if(!currentHistoryTs){
    const ts = Date.now();
    currentHistoryTs = ts;
    addHistory({ ts, mood: currentMood, drinkId: currentDrink ? currentDrink.id : null, via:"memoOnly", memo });
    showToast("已保存到紀錄 📝");
    return;
  }
  const ok = updateHistoryMemo(currentHistoryTs, memo);
  showToast(ok ? "已保存到紀錄 📝" : "保存失敗（找不到紀錄）");
});

// 收藏 / 複製
$("btnFav").addEventListener("click", ()=>{
  if(!currentDrink){ showToast("先選一杯再收藏 🐻"); return; }
  const on = toggleFav(currentDrink.id);
  setFavButton();
  showToast(on ? "已收藏 ⭐" : "已取消收藏");
  if(listMask.classList.contains("show")) renderList();
});

$("btnCopy").addEventListener("click", ()=>{
  const text =
`今晚的一杯：${$("drinkName").textContent}
${$("drinkTag").textContent}

故事：
${$("drinkStory").textContent}

風味：
${$("drinkFlavor").textContent}

熊熊追問：
${$("drinkFollow").textContent}

提醒：
${$("drinkWarn").textContent}`.trim();

  navigator.clipboard?.writeText(text);
  showToast("已複製今晚卡片 🐻🍷");
});

// ========= 清單/歷史/收藏 =========
const listMask = $("listMask");
const listContent = $("listContent");
const searchRow = $("searchRow");
const searchInput = $("searchInput");
const filterRow = $("filterRow");
const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));

let listTab = "catalog"; // catalog / history / fav
let catFilter = "all";

function openListModal(tab){
  listTab = tab || "catalog";
  listMask.classList.add("show");
  setTabs();
  renderList();
  if(listTab==="catalog") searchInput.focus();
}
function closeListModal(){ listMask.classList.remove("show"); }
$("listClose").addEventListener("click", closeListModal);
listMask.addEventListener("click", (e)=>{ if(e.target===listMask) closeListModal(); });

function setTabs(){
  $("tabCatalog").classList.toggle("active", listTab==="catalog");
  $("tabHistory").classList.toggle("active", listTab==="history");
  $("tabFav").classList.toggle("active", listTab==="fav");

  $("listTitle").textContent =
    listTab==="catalog" ? "📚 酒清單" :
    listTab==="history" ? "🕰️ 紀錄" : "⭐ 收藏";

  const showCatalog = (listTab==="catalog");
  searchRow.style.display = showCatalog ? "flex" : "none";
  filterRow.style.display = showCatalog ? "flex" : "none";
}

$("tabCatalog").addEventListener("click", ()=>{ listTab="catalog"; setTabs(); renderList(); });
$("tabHistory").addEventListener("click", ()=>{ listTab="history"; setTabs(); renderList(); });
$("tabFav").addEventListener("click", ()=>{ listTab="fav"; setTabs(); renderList(); });

$("btnSearchClear").addEventListener("click", ()=>{ searchInput.value=""; renderList(); });
searchInput.addEventListener("input", ()=>renderList());

filterBtns.forEach(b=>{
  b.addEventListener("click", ()=>{
    catFilter = b.dataset.cat;
    filterBtns.forEach(x=>x.classList.toggle("active", x.dataset.cat===catFilter));
    renderList();
  });
});

function renderList(){
  listContent.innerHTML = "";

  if(listTab==="catalog"){
    const q = (searchInput.value || "").trim();
    let pool = DRINKS.slice();

    if(catFilter !== "all") pool = pool.filter(d => d.cat === catFilter);
    if(q) pool = pool.filter(d => (d.name + " " + d.tag).includes(q));

    if(pool.length===0){
      listContent.innerHTML = `<div class="smallnote">找不到符合條件的酒～換個分類或關鍵字試試 🐻</div>`;
      return;
    }

    pool.forEach(d=>{
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div class="item-top">
          <div class="item-emoji">${d.emoji}</div>
          <div style="flex:1">
            <h5>${d.name}</h5>
            <div class="meta">${d.tag}<br>適合：${(d.moods||[]).join("、")}</div>
          </div>
        </div>
        <div class="item-actions">
          <button class="btn small" data-action="open" data-id="${d.id}">打開</button>
          <button class="btn small secondary" data-action="fav" data-id="${d.id}">
            ${isFav(d.id) ? "取消收藏" : "收藏"}
          </button>
        </div>
      `;
      listContent.appendChild(div);
    });
    return;
  }

  if(listTab==="history"){
    const h = getHistory();
    if(h.length===0){
      listContent.innerHTML = `<div class="smallnote">還沒有紀錄～先去選一杯 🐻🍷</div>`;
      return;
    }
    h.slice(0,120).forEach(row=>{
      const d = row.drinkId ? findDrink(row.drinkId) : null;
      const title = d ? `${d.emoji} ${d.name}` : "📝 心情紀錄";
      const memoLine = row.memo ? `📝 ${row.memo}` : "";
      const moodLine = `心情：${row.mood ?? "未選擇"}`;

      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div class="item-top">
          <div class="item-emoji">${d ? d.emoji : "📝"}</div>
          <div style="flex:1">
            <h5>${title}</h5>
            <div class="meta">${formatTime(row.ts)}｜${moodLine}${memoLine ? "<br>"+memoLine : ""}</div>
          </div>
        </div>
        <div class="item-actions">
          ${d ? `<button class="btn small" data-action="openHistory" data-id="${d.id}" data-ts="${row.ts}" data-mood="${row.mood ?? ""}">打開</button>` : ""}
          ${d ? `<button class="btn small secondary" data-action="fav" data-id="${d.id}">${isFav(d.id) ? "取消收藏" : "收藏"}</button>` : ""}
          <button class="btn small secondary" data-action="editMemo" data-ts="${row.ts}">編輯心情</button>
        </div>
      `;
      listContent.appendChild(div);
    });
    return;
  }

  if(listTab==="fav"){
    const f = getFav();
    if(f.length===0){
      listContent.innerHTML = `<div class="smallnote">你還沒有收藏～看到喜歡的酒就點 ⭐</div>`;
      return;
    }
    f.forEach(id=>{
      const d = findDrink(id);
      if(!d) return;
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div class="item-top">
          <div class="item-emoji">${d.emoji}</div>
          <div style="flex:1">
            <h5>${d.name}</h5>
            <div class="meta">${d.tag}<br>適合：${(d.moods||[]).join("、")}</div>
          </div>
        </div>
        <div class="item-actions">
          <button class="btn small" data-action="open" data-id="${d.id}">打開</button>
          <button class="btn small secondary" data-action="fav" data-id="${d.id}">取消收藏</button>
        </div>
      `;
      listContent.appendChild(div);
    });
  }
}

listContent.addEventListener("click", async (e)=>{
  const btn = e.target.closest("button");
  if(!btn) return;
  const action = btn.dataset.action;

  if(action==="fav"){
    const id = Number(btn.dataset.id);
    toggleFav(id);
    renderList();
    if(currentDrink && currentDrink.id===id) setFavButton();
    showToast(isFav(id) ? "已收藏 ⭐" : "已取消收藏");
    return;
  }

  if(action==="open"){
    const id = Number(btn.dataset.id);
    const d = findDrink(id);
    if(!d) return;

    closeListModal(); // ✅ 先關清單，畫面更乾淨

    await withLoading(()=>{
      const ts = Date.now();
      addHistory({ts, mood: currentMood, drinkId: d.id, via:"catalog"});
      renderDrinkModal(d, currentMood, "📚 你選的酒", ts);
    });
    return;
  }

  if(action==="openHistory"){
    const id = Number(btn.dataset.id);
    const ts = Number(btn.dataset.ts);
    const mood = btn.dataset.mood || null;
    const d = findDrink(id);
    if(!d) return;

    closeListModal(); // ✅ 先關清單

    await withLoading(()=>renderDrinkModal(d, mood || currentMood, "🕰️ 紀錄回顧", ts));
    return;
  }

  if(action==="editMemo"){
    const ts = Number(btn.dataset.ts);
    const h = getHistory();
    const row = h.find(x=>x.ts===ts);
    const old = row?.memo || "";
    const memo = prompt("今晚我想記住（最多 60 字）", old);
    if(memo===null) return;
    const v = (memo || "").trim().slice(0,60);
    updateHistoryMemo(ts, v);
    renderList();
    showToast("已更新心情 📝");
    return;
  }
});

// 清空
$("btnClearHistory").addEventListener("click", ()=>{ localStorage.removeItem(KEY_HISTORY); renderList(); showToast("已清空紀錄"); });
$("btnClearFav").addEventListener("click", ()=>{ localStorage.removeItem(KEY_FAV); renderList(); if(currentDrink) setFavButton(); showToast("已清空收藏"); });

// ========= 主畫面按鈕 =========
$("btnIG").addEventListener("click", ()=>window.open(IG_URL, "_blank"));

$("btnRandom").addEventListener("click", async ()=>{
  await withLoading(()=>{
    const pool = getPool();
    const chosen = pool.length ? pick(pool) : pick(DRINKS);
    const ts = Date.now();
    addHistory({ts, mood: currentMood, drinkId: chosen.id, via:"random"});
    renderDrinkModal(chosen, currentMood, "🎲 隨機一杯", ts);
    if(currentMood && pool.length===0) showToast("這個心情沒有對應酒款，改用全酒窖隨機 🐻");
  });
});

$("btnPickList").addEventListener("click", ()=>openListModal("catalog"));
$("btnHistory").addEventListener("click", ()=>openListModal("history"));
$("btnFavList").addEventListener("click", ()=>openListModal("fav"));

// ==================== 🎉 派對小遊戲：真心話 / 大冒險（各 15 題） ====================
const PARTY_TRUTH_15 = [
  "最近一次讓你真心開心的是什麼？",
  "你現在最想被誰理解？（可以只說角色：朋友/家人/自己）",
  "如果今天可以不用負責，你最想做什麼？",
  "你覺得自己其實很棒，但很少說出口的一點是？",
  "最近有沒有一件事，你其實有點累但還在撐？",
  "你想對『未來的自己』說一句什麼？",
  "有沒有一首歌，一聽就會想到某個人？",
  "最近一次被感動，是因為什麼？",
  "你覺得現在的生活，比一年前更好嗎？為什麼？",
  "如果今天可以重來一次，你會改變哪個小決定？",
  "你現在最想感謝的人是誰？（可以不說名字）",
  "你最近的小確幸是什麼？",
  "最近最讓你安心的一個瞬間是？",
  "如果今晚什麼都不用完成，你希望怎麼結束這一天？",
  "用一句話形容現在的你。"
];

const PARTY_DARE_15 = [
  "選一個人，對他說一句真心稱讚。",
  "用一句話形容『今天的你』，但不能用形容詞。",
  "幫大家拍一張現在的合照（或自拍）。",
  "模仿熊熊的語氣說一句安慰人的話。",
  "分享一張手機裡最近的一張照片（不用解釋）。",
  "幫下一個人選一個『心情 emoji』。",
  "說一句最近對自己最溫柔的話。",
  "選一首歌，讓大家聽 15 秒。",
  "用三個字形容今天的聚會。",
  "幫大家倒水或整理桌面一次（小小的也可以）。",
  "用一句話祝福在場的所有人。",
  "分享一個你最近學到的小發現。",
  "跟大家一起深呼吸 3 次（帶節奏：吸-停-吐）。",
  "選一個人，問他一個你真的好奇的問題。",
  "用一句話幫今天的派對收尾。"
];

// 熊熊派對開場（輕量跟心情連動；不跟喝酒狀態連動）
const PARTY_BEAR_LINES = {
  base: [
    "🐻「玩輕鬆的就好，不想做就換題！」",
    "🐻「我們以舒服為主，尷尬就跳過～」",
    "🐻「今天的目標：笑一下就賺到了。」"
  ],
  chat: [
    "🐻「想聊天很棒～慢慢說就好。」",
    "🐻「真心話不用很深，真就好。」"
  ],
  celebrate: [
    "🐻「派對模式開啟！做不到就換題～」",
    "🐻「大冒險也要可愛安全那種喔！」"
  ],
  sober: [
    "🐻「清醒也能玩超嗨！不喝也很酷。」",
    "🐻「安全第一～我們玩氣氛不玩逞強。」"
  ]
};

let partyMode = null;     // "truth" | "dare"
let partyLastIndex = -1;

const partyMask = document.getElementById("partyMask");
const partyTitle = document.getElementById("partyTitle");
const partyType = document.getElementById("partyType");
const partyTask = document.getElementById("partyTask");
const partyBearLine = document.getElementById("partyBearLine");
const partyAvatar = document.getElementById("partyAvatar");

function partyPick(arr){
  if(arr.length <= 1) return arr[0];
  let i = Math.floor(Math.random()*arr.length);
  if(i === partyLastIndex) i = (i + 1) % arr.length;
  partyLastIndex = i;
  return arr[i];
}

function partyBearSpeak(){
  const mood = (typeof currentMood !== "undefined") ? currentMood : null;
  const lines = [...PARTY_BEAR_LINES.base];

  if(mood === "想聊天") lines.push(...PARTY_BEAR_LINES.chat);
  if(mood === "想慶祝") lines.push(...PARTY_BEAR_LINES.celebrate);
  if(mood === "清醒也好") lines.push(...PARTY_BEAR_LINES.sober);

  return partyPick(lines);
}

function openPartyModal(mode){
  partyMode = mode;

  // ✅ 同步熊熊頭像（沿用你原本 IMG_TRY 容錯）
  if(partyAvatar){
    partyAvatar.src = (typeof IMG_TRY !== "undefined") ? IMG_TRY[0] : partyAvatar.src;
    partyAvatar.onerror = ()=> {
      if(typeof IMG_TRY !== "undefined") partyAvatar.src = IMG_TRY[1];
    };
  }

  const isTruth = mode === "truth";
  partyTitle.textContent = isTruth ? "💬 真心話" : "🎯 大冒險";
  partyType.textContent = isTruth ? "💬 真心話｜抽一題" : "🎯 大冒險｜抽一題";

  partyBearLine.textContent = partyBearSpeak();
  partyTask.textContent = isTruth ? partyPick(PARTY_TRUTH_15) : partyPick(PARTY_DARE_15);

  partyMask.classList.add("show");
}

function closePartyModal(){
  partyMask.classList.remove("show");
}

document.getElementById("btnPartyTruth")?.addEventListener("click", ()=>openPartyModal("truth"));
document.getElementById("btnPartyDare")?.addEventListener("click", ()=>openPartyModal("dare"));

document.getElementById("partyClose")?.addEventListener("click", closePartyModal);
partyMask?.addEventListener("click", (e)=>{ if(e.target === partyMask) closePartyModal(); });

document.getElementById("partyNext")?.addEventListener("click", ()=>{
  if(!partyMode) return;
  partyBearLine.textContent = partyBearSpeak();
  partyTask.textContent = partyMode === "truth" ? partyPick(PARTY_TRUTH_15) : partyPick(PARTY_DARE_15);
  if(typeof showToast === "function") showToast("下一題來囉 🎉");
});

// 點熊熊話語換一句
partyBearLine?.addEventListener("click", ()=>{
  partyBearLine.textContent = partyBearSpeak();
  if(typeof showToast === "function") showToast("熊熊換一句 🐻");
});

// 複製題目
document.getElementById("partyCopy")?.addEventListener("click", ()=>{
  const t = `${partyTitle.textContent}\n${partyTask.textContent}`.trim();
  navigator.clipboard?.writeText(t);
  if(typeof showToast === "function") showToast("已複製題目 📋");
});
// ========= 心情（三種） =========
const moodButtons = Array.from(document.querySelectorAll(".mood-btn"));
moodButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const mood = btn.dataset.mood;
    if(currentMood===mood){
      currentMood=null;
      moodButtons.forEach(b=>b.classList.remove("active"));
      $("moodPill").textContent="未選擇";
      showToast("已取消心情");
    }else{
      currentMood=mood;
      moodButtons.forEach(b=>b.classList.toggle("active", b.dataset.mood===mood));
      const pool=getPool();
      $("moodPill").textContent=`${mood}（${pool.length} 杯）`;
      showToast(`已選擇：${mood}`);
    }
    refreshComicBubble(); // ✅ 讓熊熊氣泡跟著心情變
  });
});

// ========= 主畫面點熊熊：換一句（不跳窗） =========
function bindHeroComic(){
  const heroTap = $("heroTap");
  const bubble = $("comicBubble");
  const next = ()=>{
    refreshComicBubble();
    showToast("熊熊換一句 🐻");
  };
  if(heroTap) heroTap.addEventListener("click", next);
  if(bubble){
    bubble.addEventListener("click", (e)=>{ e.stopPropagation(); next(); });
    bubble.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); next(); }});
  }
}

// ========= PWA：安裝 =========
let deferredPrompt = null;
const installBtn = $("btnInstall");
window.addEventListener("beforeinstallprompt", (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "flex";
});
installBtn.addEventListener("click", async ()=>{
  if(!deferredPrompt){
    showToast("iPhone：Safari 分享 → 加到主畫面");
    return;
  }
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  if(choice && choice.outcome==="accepted"){
    showToast("已開始安裝到主畫面 📲");
    installBtn.style.display = "none";
  }else{
    showToast("沒關係～想裝再來找我 🐻");
  }
});

// ========= 初始化 =========
setBearImages();
$("todayLine").textContent = pick(TODAY_LINES);
$("countBadge").textContent = `🍇 微醺酒窖｜已收錄 ${DRINKS.length} 杯`;
bindHeroComic();
refreshComicBubble();

// ========= Service Worker =========
if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}

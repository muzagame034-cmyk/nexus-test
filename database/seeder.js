/**
 * NEXUS Database Seeder v2
 * Barcha 15 kategoriya uchun savollar + admin user
 * Run: node database/seeder.js
 */

require('dotenv').config({ path: '../server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true },
  password: String, role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
  stats: { totalTests: {type:Number,default:0}, totalScore: {type:Number,default:0}, averageScore: {type:Number,default:0}, bestScore: {type:Number,default:0}, totalQuestions: {type:Number,default:0}, correctAnswers: {type:Number,default:0} }
});
const questionSchema = new mongoose.Schema({
  text: String, options: Array, correctAnswer: String,
  explanation: String, category: String, difficulty: String,
  tags: Array, isActive: { type: Boolean, default: true },
  isAIGenerated: { type: Boolean, default: false },
  stats: { timesUsed: {type:Number,default:0}, timesCorrect: {type:Number,default:0}, successRate: {type:Number,default:0} }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Question = mongoose.model('Question', questionSchema);

function q(category, difficulty, text, A, B, C, D, correct, explanation, tags) {
  return {
    category, difficulty, text,
    options: [{id:'A',text:A},{id:'B',text:B},{id:'C',text:C},{id:'D',text:D}],
    correctAnswer: correct, explanation, tags: tags || [category]
  };
}

const questions = [

  // ──────────────────────────────────────────
  // MATEMATIKA (math) — 30 savol
  // ──────────────────────────────────────────
  q('math','easy','2 + 2 × 3 = ?','10','8','14','7','B','Avval ko\'paytirish: 2×3=6, keyin qo\'shish: 2+6=8',['math','arithmetic']),
  q('math','easy','100 ning 25% i nechaga teng?','20','25','30','15','B','25% = 25/100 = 0.25; 100 × 0.25 = 25',['math','percentage']),
  q('math','easy','To\'g\'ri to\'rtburchakning perimetri. Eni 5, bo\'yi 8. Perimetr = ?','26','40','13','30','A','P = 2(a+b) = 2(5+8) = 2×13 = 26',['math','geometry']),
  q('math','easy','√144 = ?','11','13','12','14','C','12 × 12 = 144, demak √144 = 12',['math','roots']),
  q('math','easy','3! (3 faktorial) = ?','6','9','3','12','A','3! = 3×2×1 = 6',['math','factorial']),
  q('math','easy','0.5 × 0.5 = ?','0.25','0.5','1','0.1','A','0.5 × 0.5 = 0.25',['math','decimals']),
  q('math','easy','Agar x + 7 = 15 bo\'lsa, x = ?','7','8','9','6','B','x = 15 - 7 = 8',['math','algebra']),
  q('math','easy','Uchburchak burchaklari yig\'indisi necha gradus?','90°','180°','270°','360°','B','Har qanday uchburchak burchaklari yig\'indisi = 180°',['math','geometry']),
  q('math','medium','log₂(8) = ?','2','4','3','8','C','2³ = 8, demak log₂(8) = 3',['math','logarithm']),
  q('math','medium','Agar 2x - 3 = 11 bo\'lsa, x = ?','5','7','4','8','B','2x = 14, x = 7',['math','algebra']),
  q('math','medium','(a+b)² = ?','a²+b²','a²+2ab+b²','a²-2ab+b²','2a+2b','B','To\'la kvadrat: a²+2ab+b²',['math','algebra']),
  q('math','medium','Doira yuzasi formulasi? (r — radius)','πr','2πr','πr²','2πr²','C','S = πr²',['math','geometry']),
  q('math','medium','Arifmetik progressiya: 2, 5, 8, 11, ... Keyingi son?','13','14','15','12','B','d=3; 11+3=14',['math','sequences']),
  q('math','medium','Agar a=3, b=4 bo\'lsa, a²+b² = ?','25','14','7','49','A','9+16=25',['math','algebra']),
  q('math','medium','Sinuslar teoremasi: a/sinA = ?','b/sinB','c/sinC','2R','Hammasi to\'g\'ri','D','a/sinA = b/sinB = c/sinC = 2R',['math','trigonometry']),
  q('math','hard','∫x dx = ?','x²','x²/2 + C','2x + C','x² + C','B','Oddiy integral: xⁿ dx = xⁿ⁺¹/(n+1)+C',['math','calculus']),
  q('math','hard','lim(x→0) sin(x)/x = ?','0','∞','1','π','C',"L'Opital' yoki trigonometrik limit: =1",['math','limits']),
  q('math','hard','Fibonachchi ketma-ketligi: 1,1,2,3,5,8,13,... Keyingi?','19','20','21','22','C','8+13=21',['math','sequences']),
  q('math','hard','2^10 = ?','512','1024','2048','256','B','2^10 = 1024',['math','powers']),
  q('math','hard','sin²(x) + cos²(x) = ?','0','2','π','1','D','Asosiy trigonometrik identlik',['math','trigonometry']),
  q('math','easy','20 ÷ 4 + 3 × 2 = ?','11','13','8','14','A','20÷4=5; 3×2=6; 5+6=11 (amallar tartibi)',['math','arithmetic']),
  q('math','easy','Uchburchak gipotenuzasi = 5, bir kateti = 3. Ikkinchi katet = ?','4','3','6','2','A','3²+b²=5²; 9+b²=25; b²=16; b=4 (Pifagor)',['math','geometry']),
  q('math','medium','x² - 5x + 6 = 0 ning yechimlari?','x=2, x=3','x=1, x=6','x=-2, x=-3','x=5, x=1','A','(x-2)(x-3)=0 → x=2, x=3',['math','quadratic']),
  q('math','medium','Ikki son yig\'indisi 20, ko\'paytmasi 96. Kichik son?','8','10','12','6','A','x+y=20; xy=96 → x=8,y=12',['math','algebra']),
  q('math','hard','e^(iπ) + 1 = ?','0','2','π','i','A','Eyler formulasi: e^(iπ) = -1, -1+1=0',['math','complex']),
  q('math','easy','Nechta juft son 1 dan 20 gacha?','8','10','9','11','B','2,4,6,8,10,12,14,16,18,20 — 10 ta',['math','numbers']),
  q('math','medium','Agar f(x) = x² + 2x + 1 bo\'lsa, f(3) = ?','12','14','16','10','C','9+6+1=16',['math','functions']),
  q('math','easy','(-3)² = ?','-9','9','-6','6','B','(-3)×(-3)=9 (manfiy × manfiy = musbat)',['math','arithmetic']),
  q('math','medium','Vektorlar a=(1,2), b=(3,4). Skalar ko\'paytma?','10','11','14','5','B','1×3+2×4=3+8=11',['math','vectors']),
  q('math','hard','Agar permutatsiya P(n,2)=30 bo\'lsa, n=?','5','6','7','8','B','n(n-1)=30 → 6×5=30, n=6',['math','combinatorics']),

  // ──────────────────────────────────────────
  // FIZIKA (physics) — 30 savol
  // ──────────────────────────────────────────
  q('physics','easy','Yorug\'lik tezligi vakuumda taxminan qancha?','3×10⁸ m/s','3×10⁶ m/s','3×10⁵ km/h','3×10⁴ m/s','A','c ≈ 3×10⁸ m/s = 300,000 km/s',['physics','optics']),
  q('physics','easy','Nyutonning 2-qonuni: F = ?','ma','mv','m/a','a/m','A',"Kuch = massa × tezlanish (Newton 2-qonuni)",['physics','mechanics']),
  q('physics','easy','Elektr kuchi birligi nima?','Volt','Amper','Om','Vatt','D',"Kuch birlimi — Vatt (W = J/s)",['physics','electricity']),
  q('physics','easy','Issiqlik miqdori birlimi?','Joule','Kal','Vatt','Nyuton','A','SI sistemasida issiqlik miqdori — Joule',['physics','thermodynamics']),
  q('physics','easy','Yer yuzasida erkin tushish tezlanishi taxminan?','9.8 m/s²','10.8 m/s²','8.9 m/s²','11 m/s²','A','g ≈ 9.8 m/s² (taxminan 10 m/s²)',['physics','mechanics']),
  q('physics','easy','Tovushning havo muhitida tezligi taxminan?','340 m/s','3400 m/s','34 m/s','1500 m/s','A','Havoda tovush tezligi ≈ 340 m/s (20°C da)',['physics','acoustics']),
  q('physics','easy','Elektr qarshilik birlimi?','Volt','Amper','Om (Ω)','Farad','C','Elektr qarshiligi Om (Ω) da o\'lchanadi',['physics','electricity']),
  q('physics','easy','Kim "tortishish qonuni"ni kashf etdi?','Einstein','Galiley','Nyuton','Faraday','C','Isaak Nyuton 1687-yilda umumjahon tortishish qonunini e\'lon qildi',['physics','mechanics']),
  q('physics','medium','Kinematik energiya formulasi?','E = mv','E = ½mv²','E = mgh','E = mv²','B','Kinetik energiya: Ek = ½mv²',['physics','mechanics']),
  q('physics','medium','Potentsial energiya (balandlikda)?','½mv²','mgh','mv²','Fd','B','Potentsial energiya: Ep = mgh',['physics','mechanics']),
  q('physics','medium','Om qonuni: I = ?','V/R','VR','R/V','V+R','A','Tok = Kuchlanish / Qarshilik (I=V/R)',['physics','electricity']),
  q('physics','medium','Nyutonning 3-qonuni nima?','Inersiya qonuni','Harakat miqdori qonuni','Ta\'sir va ta\'sir qilish qonuni','Tortishish qonuni','C','Har bir ta\'sirga teng va qarama-qarshi ta\'sir mavjud',['physics','mechanics']),
  q('physics','medium','Foton energiyasi: E = ?','hf','mc²','½mv²','mgh','A','Foton energiyasi: E = hf (h — Plank doimiysi)',['physics','quantum']),
  q('physics','medium','Ideal gaz qonuni: PV = ?','nRT','nR/T','RT/n','nT/R','A','PV = nRT (n-mol, R-gaz doimiysi, T-temperatura)',['physics','thermodynamics']),
  q('physics','medium','Solishtirma issiqlik sig\'imi birlimi?','J/(kg·K)','J/kg','W/m','kg/J','A','c = J/(kg·K)',['physics','thermodynamics']),
  q('physics','hard','Heyzenberg noaniqlik printsipi: ΔxΔp ≥ ?','h/4π','h','h/2','ℏ/2','A','ΔxΔp ≥ ħ/2 = h/(4π)',['physics','quantum']),
  q('physics','hard',"Maxsus nisbiylik nazariyasida massa-energiya: E = ?",'mc²','½mc²','mgh','mv²','A',"Eynshteyn formulasi: E = mc²",['physics','relativity']),
  q('physics','hard','Furye qonuni issiqlik o\'tkazish uchun: q = ?','-λA(dT/dx)','mghA','σT⁴A','εσT⁴','A','q = -λA·(dT/dx) — Furye issiqlik o\'tkazish qonuni',['physics','thermodynamics']),
  q('physics','hard','Bolsman doimiysi k ≈ ?','1.38×10⁻²³ J/K','6.62×10⁻³⁴ J·s','9.11×10⁻³¹ kg','6.02×10²³','A','k = 1.38×10⁻²³ J/K',['physics','constants']),
  q('physics','easy','Prizma qaysi hodisaga asoslanadi?','Difraksiya','Refraktsiya (sinish)','Qayish','Interferensiya','B','Prizma yorug\'likni nurlanish (refraktsiya) orqali ajratadi',['physics','optics']),
  q('physics','medium','Magnit induksiyasi birlimi?','Tesla (T)','Gauss','Veber','Henri','A','Magnit induksiyasi birlimi — Tesla (T)',['physics','electromagnetism']),
  q('physics','medium','Yopiq zanjirda Kirchhoff 1-qoidasi nimani anglatadi?','Kuchlanish yig\'indisi','Energiya saqlanishi','Toklarning tugunga kelishi va ketishining yig\'indisi 0','Ish qoida','C','∑I = 0 — toklarning algebrik yig\'indisi 0',['physics','electricity']),
  q('physics','easy','1 kVt = ?','100 Vt','1000 Vt','10 Vt','10000 Vt','B','1 kilovat = 1000 vat',['physics','electricity']),
  q('physics','medium','Dopler effekti nimaga oid?','Nur sinishi','Tovush yoki to\'lqin chastotasining o\'zgarishi','Magnit maydon','Issiqlik o\'tkazish','B','Dopler effekti — manba yoki kuzatuvchi harakatida to\'lqin chastotasi o\'zgaradi',['physics','waves']),
  q('physics','hard','Radioaktiv yarilik davri formulasi: N = ?','N₀·e^(-λt)','N₀·e^(λt)','N₀/(1+λt)','λ·N₀','A','N(t) = N₀·e^(-λt)',['physics','nuclear']),
  q('physics','easy','Qaysi hodisada yorug\'lik to\'lqini ikki muhit chegarasida qaytadi?','Difraktsiya','Dispersiya','Aks etish','Polyarizatsiya','C','Aks etish (reflek­siya) — muhit chegarasida yorug\'lik qaytishi',['physics','optics']),
  q('physics','medium','Elektrik maydon kuchlanganligining birlimi?','V/m','A/m','N/C² (ham to\'g\'ri)','V/m yoki N/C','D','E = V/m = N/C — ikkalasi ham to\'g\'ri',['physics','electricity']),
  q('physics','hard','Kvant mexanikasida Shredinger tenglamasi qanday fizik kattalikni aniqlaydi?','To\'lqin funksiyasi ψ','Impuls','Koordinata','Energiya','A','Shredinger tenglamasi to\'lqin funksiyasi ψ ni topadi',['physics','quantum']),
  q('physics','medium','Issiqlikni o\'tkazishning 3 yo\'li?','Konduksiya, konveksiya, radiatsiya','Diffuziya, konduksiya, radiatsiya','Konveksiya, diffuziya, absorbsiya','Radiatsiya, refraktsiya, refleksiya','A','Issiqlik konduksiya, konveksiya va radiatsiya orqali uzatiladi',['physics','thermodynamics']),
  q('physics','easy','Impuls formulasi: p = ?','mv','ma','F/t','½mv','A','Impuls (momentum): p = mv',['physics','mechanics']),

  // ──────────────────────────────────────────
  // KIMYO (chemistry) — 25 savol
  // ──────────────────────────────────────────
  q('chemistry','easy','Suvning kimyoviy formulasi?','HO','H₂O₂','H₂O','OH₂','C','Suv molekulasi — 2 vodorod + 1 kislorod atomi',['chemistry','compounds']),
  q('chemistry','easy','Davriy jadvalning yaratuvchisi?','Einshteyn','Kyuri','Mendeleyev','Lavoyzye','C','D.I.Mendeleyev 1869-yilda davriy jadvalni yaratdi',['chemistry','history']),
  q('chemistry','easy','Oltin kimyoviy belgisi?','Go','Gd','Au','Or','C','Au — lotincha "Aurum" so\'zidan olingan',['chemistry','elements']),
  q('chemistry','easy','CO₂ nima?','Karbon oksid','Karbonat angidrid','Karbon dioksid','B va C to\'g\'ri','D','CO₂ = karbon dioksid = karbonat angidrid',['chemistry','compounds']),
  q('chemistry','easy','Qaysi element Yer qobig\'ida eng ko\'p uchraydi?','Temir','Kremniy','Kislorod','Alyuminiy','C','Kislorod (O) Yer qobig\'ining ≈46% ini tashkil etadi',['chemistry','elements']),
  q('chemistry','easy','NaCl nima?','Natriy sulfat','Osh tuzi (Natriy xlorid)','Natriy karbonat','Kalsiy xlorid','B','NaCl — osh tuzi, natriy xlorid',['chemistry','compounds']),
  q('chemistry','medium','Avogadro soni taxminan?','6.02×10²³','3.14×10¹⁵','1.38×10⁻²³','9.81×10²⁴','A','N_A ≈ 6.022×10²³ mol⁻¹',['chemistry','constants']),
  q('chemistry','medium','Kislota pH qiymati qanday bo\'ladi?','7 dan katta','7 ga teng','7 dan kichik','0 ga teng','C','Kislotalar uchun pH < 7',['chemistry','acids_bases']),
  q('chemistry','medium','Ishlatiladigan organik polimer plastmassa asosi?','Etilen','Polietilen','Metan','Benzol','B','Ko\'p plastmassalar polietilen asosida yasaladi',['chemistry','organic']),
  q('chemistry','medium','H₂SO₄ nima?','Xlorid kislota','Nitrat kislota','Sulfat kislota','Fosfat kislota','C','H₂SO₄ — sulfat (oltingugurt) kislotasi',['chemistry','acids_bases']),
  q('chemistry','medium','Elektroliz nima?','Kimyoviy reaksiya','Elektr toki orqali moddani parchalash','Qotishma hosil qilish','Kimyoviy sintez','B','Elektroliz — elektr toki yordamida moddani parchalash jarayoni',['chemistry','electrochemistry']),
  q('chemistry','medium','Kimyoviy tenglamada nima saqlanadi?','Faqat atomlar soni','Faqat massa','Atom va massa','Faqat zaryadlar','C','Kimyoviy reaksiyada massa ham, atomlar soni ham saqlanadi',['chemistry','reactions']),
  q('chemistry','hard','Benzol formulasi?','C₆H₁₂','C₆H₆','C₆H₅OH','C₆H₄','B','Benzol — C₆H₆, aromatik uglevodorod',['chemistry','organic']),
  q('chemistry','hard','Qaysi reaksiya ekzotermik?','Fotosintez','Yonish','Muz erishi','Elektroliz','B','Yonish — issiqlik ajralib chiqadigan ekzotermik reaksiya',['chemistry','thermochemistry']),
  q('chemistry','easy','Vodorod atomining proton soni?','1','2','0','3','A','Vodorod — 1 proton, atom raqami Z=1',['chemistry','atomic']),
  q('chemistry','medium','Organik kimyoning asosiy elementi?','Azot','Kislorod','Uglerod','Vodorod','C','Organik kimyo — uglerod birikmalarini o\'rganadi',['chemistry','organic']),
  q('chemistry','easy','Fe kimyoviy belgisi nima elementi?','Ftor','Temir','Fosfor','Frantsiy','B','Fe — "Ferrum" (lotincha) — Temir',['chemistry','elements']),
  q('chemistry','medium','Kation nima?','Manfiy ion','Musbat ion','Neytral zarracha','Elektron','B','Kation — musbat zaryadlangan ion (elektronlarini yo\'qotgan)',['chemistry','ions']),
  q('chemistry','hard','Le Shatelye printsipi nimaga tegishli?','Kinetika','Muvozanat almashinishi','Termodinamika','Elektrokimyo','B','Le Shatelye: tashqi ta\'sir muvozanatni o\'zgartirsa, sistema uni qaytaradi',['chemistry','equilibrium']),
  q('chemistry','hard','Alkangomolog qator formulasi?','CₙH₂ₙ','CₙH₂ₙ₋₂','CₙH₂ₙ₊₂','CₙH₂ₙ₊₁','C','Alkanlar: CₙH₂ₙ₊₂ (to\'yingan uglevodorodlar)',['chemistry','organic']),
  q('chemistry','easy','Havo tarkibida eng ko\'p qaysi gaz?','Kislorod','Karbon dioksid','Azot','Argon','C','Havo tarkibi: azot ≈78%, kislorod ≈21%',['chemistry','gases']),
  q('chemistry','medium','Ionlar hosil bo\'lishi jarayoni?','Oksidlanish','Ionlanish (Ionizatsiya)','Kondensatsiya','Sublimatsiya','B','Ionizatsiya — atom yoki molekuladan elektron ajralishi yoki qo\'shilishi',['chemistry','atomic']),
  q('chemistry','easy','Suvning qaynash harorati (normal sharoitda)?','90°C','100°C','110°C','80°C','B','Suv 100°C da qaynaydi (1 atm bosimda)',['chemistry','properties']),
  q('chemistry','hard','Kovalent bog\' qanday hosil bo\'ladi?','Elektron o\'tishi','Umumiy elektron juftligi','Ion tortishishi','Proton almashinishi','B','Kovalent bog\' — atomlar o\'rtasida umumiy elektron jufti',['chemistry','bonding']),
  q('chemistry','medium','pH = 7 qanday muhitni anglatadi?','Kislotali','Ishqoriy','Neytral','Kuchli kislotali','C','pH = 7 — neytral muhit (toza suv)',['chemistry','acids_bases']),

  // ──────────────────────────────────────────
  // BIOLOGIYA (biology) — 25 savol
  // ──────────────────────────────────────────
  q('biology','easy','Hujayra quvvat stansiyasi (ATP ishlab chiqaruvchi organella)?','Yadro','Mitoxondriya','Ribosoma','Lizosoma','B','Mitoxondriya — hujayraning "energetik stansiyasi"',['biology','cell']),
  q('biology','easy','Fotosintez qayerda sodir bo\'ladi?','Mitoxondriya','Ribosoma','Xloroplast','Vakuol','C','Fotosintez xloroplastlarda, xlorofil ishtirokida amalga oshadi',['biology','plants']),
  q('biology','easy','DNK nima uchun?','Protein sintezi uchun to\'g\'ridan','Irsiy ma\'lumotni saqlash va uzatish','Energiya olish','Fermentlar sintezi','B','DNK — deoksiribonuklein kislota, irsiyat haqidagi ma\'lumotni saqlaydi',['biology','genetics']),
  q('biology','easy','Odam hujayralarining soni taxminan qancha?','1 mlrd','37 trln','100 mln','1 trln','B','Odam tanasida ≈37 trillion hujayra mavjud',['biology','human']),
  q('biology','easy','Qon guruhlari nechtadan iborat (ABO tizimi)?','2','3','4','5','C','ABO tizimida 4 ta qon guruhi: I(0), II(A), III(B), IV(AB)',['biology','human']),
  q('biology','easy','Fotosintezda asosiy pigment nima?','Karotin','Ksantofill','Xlorofill','Antotsiyan','C','Xlorofill — yashil pigment, fotosintezning asosiy pigmenti',['biology','plants']),
  q('biology','easy','Hujayra membrananining asosiy tarkibi?','Uglevodlar','Oqsillar','Lipidlar (fosfolipidlar)','DNK','C','Membrana — ikki qavatli fosfolipid bilan oqsillardan tuzilgan',['biology','cell']),
  q('biology','medium','Mitoz natijasida nechta qiz hujayra hosil bo\'ladi?','1','2','4','8','B','Mitoz: 1 ona hujayra → 2 ta genetik identik qiz hujayra',['biology','cell_division']),
  q('biology','medium','Meyoz natijasida nechta haploid hujayra hosil bo\'ladi?','2','3','4','8','C','Meyoz: 1 hujayra → 4 ta haploid gametalar',['biology','cell_division']),
  q('biology','medium','DNK nukleotidlari to\'la to\'liqlik qoidasi (Chargaff): A ga mos?','T','G','C','U','A','A-T, G-C juftlashuv qoidasi (Chargaff qoidasi)',['biology','genetics']),
  q('biology','medium','Ferment nima?','Energiya manbai','Biologik katalizator','Irsiy material','Gormonal moddа','B','Fermentlar — biologik katalizatorlar bo\'lgan oqsillar',['biology','biochemistry']),
  q('biology','medium','Qaysi organella ribosomasiz oqsil sintez qilmaydi?','Yadro','Xloroplast','Mitoxondriya','Endoplazmatik to\'r','D','Oqsil sintezi ribosomada amalga oshadi; EPS ribosomalarni tashiydi',['biology','cell']),
  q('biology','medium','Evoluatsiya nazariyasini kim yaratdi?','Mendel','Darvin','Watson','Lemark','B','Charlz Darvin 1859-yilda "Turlarning kelib chiqishi" asarini yozdi',['biology','evolution']),
  q('biology','medium','Qaysi qon hujayrasi kislorod tashiydi?','Leykotsit','Trombosit','Eritrotsit','Makrofag','C','Eritrotsitlar (qizil qon tanachalari) — gemoglobin orqali O₂ tashiydi',['biology','human']),
  q('biology','hard','Mendel birinchi qonuni (Dominantlik qonuni) degani?','Ajralish','F1 da dominant belgi namoyon bo\'lishi','Mustaqil birikma','Mutatsiya','B',"Mendel 1-qonuni: F1 avlodda faqat dominant belgi namoyon bo'ladi",['biology','genetics']),
  q('biology','hard','Transkriptsiya nima?','DNK → RNK ko\'chirish','RNK → Oqsil','DNK → DNK','RNK → DNK','A','Transkriptsiya: DNK matrisasida mRNK sintezi',['biology','genetics']),
  q('biology','hard','Translyatsiya qayerda amalga oshadi?','Yadro','Mitoxondriya','Ribosoma','Lizosoma','C','Translyatsiya: ribosomada mRNK bo\'yicha oqsil sintezi',['biology','genetics']),
  q('biology','easy','Insonda necha juft xromosoma bor?','23 juft (46 ta)','24 juft','22 juft','25 juft','A','Odam somatik hujayralarida 46 ta (23 juft) xromosoma',['biology','genetics']),
  q('biology','medium','Qaysi vitamin D vitamini manbai?','Meva','Quyosh nurlari','Go\'sht','Yog\'','B','D vitamini quyosh nuri ta\'sirida terida sintez bo\'ladi',['biology','human']),
  q('biology','easy','Bakteriyalar qaysi xil organizmlar?','Eukariot','Prokariot','Virus','Zamburug\'','B','Bakteriyalar — prokariotlar (yadrosiz hujayra)',['biology','microbiology']),
  q('biology','medium','Osmoz nima?','Moddalar aktiv tashilishi','Suv molekulalarining yarim o\'tkazgich membrana orqali diffuziyasi','Ferment faolligi','Hujayra bo\'linishi','B','Osmoz — suv molekulalarining past konsentratsiyadan yuqori tomonga diffuziyasi',['biology','cell']),
  q('biology','hard','Krebb sikli qayerda joylashgan?','Sitoplazma','Mitoxondriya matritsasi','Xloroplast','Yadro','B','Krebb (sitrat) sikli mitoxondriya matritsasida sodir bo\'ladi',['biology','biochemistry']),
  q('biology','easy','Fotosintez tenglamasi asosiy mahsuloti?','O₂ va CO₂','Glyukoza va O₂','H₂O va CO₂','ATP va H₂O','B','Fotosintez: 6CO₂+6H₂O → C₆H₁₂O₆+6O₂',['biology','plants']),
  q('biology','medium','Qaysi bezlar endokrin bezlarga kiradi?','So\'lak bezlari','Qalqonsimon bez','Ter bezlari','Yog\' bezlari','B','Qalqonsimon bez — endokrin (ichki sekresiya) bezi',['biology','human']),
  q('biology','hard','Apoptoz nima?','Hujayra bo\'linishi','Dasturlashtirilgan hujayra o\'limi','Oqsil sintezi','Mutatsiya','B','Apoptoz — hujayraning dasturlashtirilgan o\'z-o\'zini yo\'q qilishi',['biology','cell']),

  // ──────────────────────────────────────────
  // TARIX (history) — 25 savol
  // ──────────────────────────────────────────
  q('history','easy',"O'zbekiston mustaqilligini qachon e'lon qildi?",'1989','1991','1993','1990','B',"O'zbekiston mustaqilligini 1991-yil 31-avgustda e'lon qildi",['history','uzbekistan']),
  q('history','easy',"O'zbekistonning birinchi prezidenti kim?",'Shavkat Mirziyoyev','Islom Karimov','Nursulton Nazarboyev','Askar Akayev','B',"Islom Karimov O'zbekistonning birinchi prezidenti (1991-2016)",['history','uzbekistan']),
  q('history','easy','Amir Temur qachon yashagan?','1336-1405','1200-1260','1444-1510','1100-1150','A','Sohibqiron Amir Temur 1336-1405-yillarda yashagan',['history','uzbekistan']),
  q('history','easy','Birinchi jahon urushi qachon boshlangan?','1914','1918','1939','1904','A','Birinchi jahon urushi 1914-1918-yillarda bo\'lib o\'tdi',['history','world']),
  q('history','easy','Ikkinchi jahon urushi qachon tugagan?','1944','1945','1946','1943','B','Ikkinchi jahon urushi 1945-yil 2-sentabrda tugadi (Yaponiya taslim bo\'lishi)',['history','world']),
  q('history','easy','Buyuk Ipak yo\'li qaysi shaharlarni bog\'lagan?','London-Pekin','Xitoy-Rim (O\'rta Yer dengizi)','Hindiston-Misr','Arabiston-Rossiya','B','Buyuk Ipak yo\'li Xitoydan O\'rta Yer dengizigacha cho\'zilgan',['history','uzbekistan']),
  q('history','easy','Kim Samarqandni Temuriylar imperiyasi poytaxtiga aylantirdi?','Ulug\'bek','Amir Temur','Bobur','Abulxayrxon','B','Amir Temur Samarqandni o\'z imperiyasining poytaxti qildi',['history','uzbekistan']),
  q('history','medium','Ulug\'bek kim edi?','Shoirlar shoiri','Astronom va matematik','Jangovor sarkarda','Din arbobi','B','Muhammad Tarag\'ay — Ulug\'bek mashhur astronom va matematik sulton',['history','uzbekistan']),
  q('history','medium','Frantsiya inqilobi qachon boshlangan?','1776','1789','1799','1815','B','Frantsiya burjua inqilobi 1789-1794-yillarda bo\'lib o\'tdi',['history','world']),
  q('history','medium','Kim Hindistonning mustaqilligi uchun nozo\'rlik yo\'lida kurashdi?','Neru','Bose','Gandhi','Lal Bahadur','C','Mahatma Gandhi tinchlik va nozo\'rlik (ahimsa) usulida kurashdi',['history','world']),
  q('history','medium','Rossiyada oktyabr inqilobi qachon bo\'ldi?','1905','1917','1924','1935','B','Buyuk Oktyabr sotsialistik inqilobi 1917-yil 25-oktabrda (yangi uslub — 7-noyabr)',['history','world']),
  q('history','medium','Buyuk Britaniya parlamentizmi qaysi hujjatga asoslangan?','Magna Carta','Bill of Rights','Konstitutsiia','Mustaqillik deklaratsiyasi','A','Magna Carta (1215) — ingliz huquqi va parlamentizmning asosi',['history','world']),
  q('history','medium','Qaysi sivilizatsiya Giza ehromlarini qurdi?','Mesopotamiya','Yunoniston','Misr','Rim','C','Giza ehromlari Qadimgi Misr tomonidan qurilgan (MIL.AV.2560-2540)',['history','world']),
  q('history','medium','Amerika Qo\'shma Shtatlari qachon mustaqilligini e\'lon qildi?','1774','1776','1783','1770','B','AQSh 1776-yil 4-iyulda Mustaqillik deklaratsiyasini imzoladi',['history','world']),
  q('history','hard','Konstantinopol qachon fath qilindi?','1345','1453','1492','1520','B','Usmonli Turk sultoni Fotiх II Konstantinopolni 1453-yilda fath qildi',['history','world']),
  q('history','hard','Nuri ko\'zi yosh tariхi — Holokost necha odamni yo\'q qildi?','1 million','4 million','6 million','10 million','C','Holokost (1941-1945) taxminan 6 million yahudiyni qirib tashladi',['history','world']),
  q('history','easy',"Ibn Sino qaysi sohada mashhur?",'Riyoziyot','Tibbiyot va falsafa','Astronomiya','Tarix','B',"Ibn Sino (Avitsenna) — buyuk tabib va faylasuf, \"Tib qonunlari\" muallifi",['history','uzbekistan']),
  q('history','medium','Birinchi kosmosga uchgan inson?','Nil Armstrong','Yuriy Gagarin','Valentina Tereshkova','Alan Shepard','B','Yuriy Gagarin 1961-yil 12-aprelda kosmosga birinchi bo\'lib uchdi',['history','world']),
  q('history','medium','Nantsk pakti (1939) kim o\'rtasida tuzildi?','Germaniya va Italiya','SSSR va Germaniya','Germaniya va Yaponiya','Britaniya va Frantsiya','B','Molotov-Ribbentrop pakti (1939) SSSR va Germaniya o\'rtasida',['history','world']),
  q('history','easy','Shumerlar qayerda yashagan?','Nil daryosi bo\'yida','Mesopotamiyada (hozirgi Iroq)','Hindiston daryosi bo\'yida','O\'rta Osiyo','B','Shumerlar — Mesopotamiya (Tigr va Frot daryo oralig\'i) sivilizatsiyasi',['history','ancient']),
  q('history','hard',"Chingizxon qachon Movarounnahrni bosib oldi?",'1206-1210','1219-1221','1234-1240','1260-1265','B',"Chingizxon 1219-1221-yillarda O'rta Osiyoni bosib oldi",['history','uzbekistan']),
  q('history','medium',"Bobur kimning nabirasi edi?",'Amir Temur','Ulug\'bek','Shahrux','Mirzo Xo\'sandek','A',"Zahiriddin Muhammad Bobur — Amir Temurning avlodi (nabirasi)",['history','uzbekistan']),
  q('history','easy','Ikkinchi jahon urushida ittifoqchilar qaysilar?','Germaniya,Italiya,Yaponiya','SSSR,AQSH,Britaniya,Frantsiya','Germaniya,SSSR','Yaponiya,Italiya','B','Antihitler koalitsiyasi: SSSR, AQSH, Britaniya, Frantsiya va boshqalar',['history','world']),
  q('history','medium','Renessans (Uyg\'onish davri) qayerda boshlandi?','Ispaniya','Frantsiya','Italiya','Germaniya','C','Renessans XIV-XVI asrlarda Italiyada boshlandi',['history','world']),
  q('history','hard','Konfutsiy ta\'limoti qaysi mamlakatga tegishli?','Yaponiya','Hindiston','Xitoy','Koreya','C','Konfutsiy (Kongzi) — Qadimgi Xitoy faylasufi (MIL.AV.551-479)',['history','world']),

  // ──────────────────────────────────────────
  // GEOGRAFIYA (geography) — 20 savol
  // ──────────────────────────────────────────
  q('geography','easy',"O'zbekiston poytaxti?",'Samarqand','Buxoro','Toshkent','Namangan','C',"Toshkent — O'zbekistonning poytaxti va eng katta shahri",['geography','uzbekistan']),
  q('geography','easy','Dunyodagi eng uzun daryo?','Amazon','Nil','Yantszi','Mississipi','B','Nil (6650 km) — dunyodagi eng uzun daryo',['geography','rivers']),
  q('geography','easy','Dunyoning eng katta okeani?','Atlantika','Hind','Shimoliy Muz','Tinch','D','Tinch okeani — dunyodagi eng katta okean (165 mln km²)',['geography','oceans']),
  q('geography','easy','Dunyodagi eng baland tog\' cho\'qqisi?','K2','Kanchendzanga','Everest','Lotstse','C','Everest (Chomolungma) — 8848 m, dunyodagi eng baland cho\'qqi',['geography','mountains']),
  q('geography','easy','Qaysi qit\'a eng katta?','Shimoliy Amerika','Yevropa','Avstraliya','Osiyo','D',"Osiyo — dunyoning eng katta qit'asi (44,6 mln km²)",['geography','continents']),
  q('geography','easy','Dunyodagi eng katta cho\'l?','Gobi','Sahara','Arabiston','Taka-Makan','B','Sahara — 9,2 mln km² bilan dunyodagi eng katta issiq cho\'l',['geography','deserts']),
  q('geography','medium',"O'rta Osiyo qaysi mamlakatlardan iborat?",'5 ta: O\'zbek, Qozog\'iston, Qirg\'iziston, Tojikiston, Turkmaniston','4 ta mamlakat','6 ta mamlakat','3 ta mamlakat','A',"O'rta Osiyo 5 ta respublikadan: UZ, KZ, KG, TJ, TM",['geography','central_asia']),
  q('geography','medium','Amudaryo va Sirdaryoning qayoqqa quyiladi?','Kaspiy','Qora dengiz','Orol dengizi','Balxash','C','Amudaryo va Sirdaryo Orol dengiziga quyiladi',['geography','uzbekistan']),
  q('geography','medium','Dunyodagi eng chuqur ko\'l?','Kaspiy','Baykal','Tanganika','Viktoriya','B','Baykal ko\'li — 1642 m chuqurligi bilan dunyodagi eng chuqur ko\'l',['geography','lakes']),
  q('geography','medium','Braziliya poytaxti?','San-Paulo','Rio-de-Janeyro','Brazilia','Manaus','C',"Braziliya — 1960-yildan Brazilia (maxsus qurilgan poytaxt)",['geography','capitals']),
  q('geography','medium','Yaponiya dengizining sharqiy qismida joylashgan davlat?','Xitoy','Koreya','Rossiya','Yaponiya','D','Yaponiya Tinch okean va Yaponiya dengizi o\'rtasidagi orollarda',['geography','asia']),
  q('geography','medium','Dunyodagi eng katta mamlakat (maydon bo\'yicha)?','Kanada','AQSH','Xitoy','Rossiya','D',"Rossiya — 17,1 mln km² bilan dunyoning eng yirik davlati",['geography','countries']),
  q('geography','hard','Ekvator qaysi qit\'alardan o\'tadi?','Faqat Afrika','Afrika, Janubiy Amerika, Osiyo','Afrika, Janubiy Amerika, Tinch okeani orollari','Janubiy Amerika, Afrika, Avstraliya','B','Ekvator Afrika, Janubiy Amerika va Osiyo (Indonesia) qit\'alaridan o\'tadi',['geography','equator']),
  q('geography','easy','Yer qaysi shaklga ega?','Aniq doira','Geoid (tekislashgan sfera)','Kubsimon','Konus','B',"Yer — geoid shakli, qutblarda tekislashgan",['geography','earth']),
  q('geography','easy',"O'zbekistonning qaysi qo'shni davlati dengizga chiqishga ega?",'Turkmaniston','Qirg\'iziston','Qozog\'iston','Tojikiston','C',"Qozog\'iston Kaspiy dengiziga chiqishga ega",['geography','central_asia']),
  q('geography','medium','Amazon daryosi qaysi qit\'ada?','Afrika','Shimoliy Amerika','Janubiy Amerika','Osiyo','C','Amazon — Janubiy Amerika (Braziliya), Atlantikaga quyiladi',['geography','rivers']),
  q('geography','medium','Skandinaviya mamlakatlari?','Norvegiya, Shvetsiya, Finlandiya','Daniya, Belgiya, Niderlandiya','Norvegiya, Shvetsiya, Daniya','Finlandiya, Estoniya, Latviya','C',"Skandinaviya: Norvegiya, Shvetsiya, Daniya (ba'zan Finlandiya ham kiritiladi)",['geography','europe']),
  q('geography','hard','Dunyo aholisi 2024-yil taxminan?','6 mlrd','7 mlrd','8 mlrd','9 mlrd','C','2024-yilda Yer aholisi ≈8,1 mlrd kishi',['geography','population']),
  q('geography','easy','Qaysi ko\'l dunyoda eng katta tuz ko\'li?','Orol','Baykal','Kaspiy','Qizil dengiz','C','Kaspiy dengizi (aslida ko\'l) — 371,000 km² bilan eng katta ko\'l',['geography','lakes']),
  q('geography','medium',"O'zbekiston necha viloyatdan iborat?",'11','12','13','14','C',"O'zbekiston 12 viloyat + 1 avtonom respublika (Qoraqalpog'iston) + Toshkent shahri = 14 ma'muriy birlik. Viloyatlar 12 ta",['geography','uzbekistan']),

  // ──────────────────────────────────────────
  // INFORMATIKA (it) — 20 savol
  // ──────────────────────────────────────────
  q('it','easy','HTML nima?','Dasturlash tili','Veb-sahifalar uchun belgilash tili','Ma\'lumotlar bazasi','Operatsion tizim','B',"HTML — HyperText Markup Language, veb-sahifalar tuzilishini belgilaydi",['it','web']),
  q('it','easy','CPU nima?','Markaziy protsessor','Karta drayveri','Operatsion xotira','Qattiq disk','A',"CPU — Central Processing Unit, kompyuterning \"miyasi\"",['it','hardware']),
  q('it','easy','1 byte necha bitdan iborat?','4','8','16','2','B','1 bayt = 8 bit (bit — eng kichik ma\'lumot birligi)',['it','binary']),
  q('it','easy','Python qanday dasturlash tili?','Kompilyatsiya','Interpretatsiya','Assembler','Mashina tili','B',"Python — interpretatsiya qilinadigan yuqori darajali dasturlash tili",['it','programming']),
  q('it','easy','SQL nima uchun?','Grafik dizayn','Ma\'lumotlar bazasini boshqarish','Tarmoq xavfsizligi','Veb-dizayn','B',"SQL — Structured Query Language, ma'lumotlar bazasi bilan ishlash tili",['it','databases']),
  q('it','medium','OOP ning asosiy tushunchalari?','Sinf, ob\'yekt, meros, polimorfizm','Funksiya, o\'zgaruvchi, sikl','Massiv, ko\'rsatgich, fayl','Algoritm, ma\'lumot, tuzilma','A','OOP: Class, Object, Inheritance (meros), Encapsulation, Polymorphism',['it','programming']),
  q('it','medium','Git nima?','Dasturlash tili','Versiyalarni boshqarish tizimi','Veb-brauzer','Ma\'lumotlar bazasi','B','Git — distributed version control system (tarqatilgan versiya boshqarish tizimi)',['it','tools']),
  q('it','medium','HTTP va HTTPS farqi?','HTTPS shifrlangan (SSL/TLS)','HTTP tezroq','HTTPS eski protokol','Farqi yo\'q','A','HTTPS = HTTP + SSL/TLS shifrlash — ma\'lumotlar himoyalangan',['it','networking']),
  q('it','medium','Massivda birinchi elementning indeksi odatda?','1','0','-1','Ixtiyoriy','B',"Ko'pgina dasturlash tillarida (Python, JS, C) indeks 0 dan boshlanadi",['it','programming']),
  q('it','medium','Big O notatsiyasi nima?','Xotira o\'lchovi','Algoritmning murakkablik bahosi','Tarmoq tezligi','Ma\'lumotlar tuzilmasi','B','Big O — algoritmning vaqt va xotira murakkabligini ifodalash usuli',['it','algorithms']),
  q('it','hard','Binary search eng yaxshi holda: O(?) ','O(1)','O(n)','O(log n)','O(n²)','A','Binary search eng yaxshi holda: O(1) — birinchi tekshirishda topilsa',['it','algorithms']),
  q('it','hard','TCP/IP modelida qancha qatlam bor?','4','7','5','3','A','TCP/IP modeli: 4 qatlam — Ilova, Transport, Internet, Tarmoq interfeysi',['it','networking']),
  q('it','easy','RAM nima?','Doimiy xotira','Operativ (tez) xotira','Protsessor','Kesh xotira','B',"RAM — Random Access Memory, vaqtinchalik operativ xotira",['it','hardware']),
  q('it','medium','Qaysi ma\'lumot tuzilmasi LIFO tartibida ishlaydi?','Navbat (Queue)','Stek (Stack)','Ro\'yxat (List)','Daraxt (Tree)','B',"Stack — Last In First Out (LIFO), so'nggi qo'shilgan birinchi chiqadi",['it','data_structures']),
  q('it','medium','DNS nima?','Xavfsizlik protokoli','Domen nomini IP-manzilga o\'girish tizimi','Ma\'lumotlar bazasi','Brauzer turi','B',"DNS — Domain Name System, inson o'qiy oladigan nomni IP-manzilga aylantiradi",['it','networking']),
  q('it','hard','Blockchain texnologiyasining asosiy xususiyati?','Markazlashgan boshqaruv','O\'zgartirib bo\'lmaydigan taqsimlangan daftar','Tez ma\'lumot uzatish','Past xavfsizlik','B',"Blockchain — immutable distributed ledger, o'zgartirish imkonsiz",['it','blockchain']),
  q('it','easy','Qaysi protokol elektron pochta uchun?','HTTP','FTP','SMTP','SSH','C','SMTP — Simple Mail Transfer Protocol, elektron pochta yuborish uchun',['it','networking']),
  q('it','medium','Rekursiya nima?','Sikl turi','Funksiyaning o\'zini-o\'zi chaqirishi','Ma\'lumotlar tuzilmasi','Kompilyator','B',"Rekursiya — funksiyaning to'xtatish sharti bo'lgunga qadar o'zini chaqirishi",['it','programming']),
  q('it','hard','Quicksort ning o\'rtacha holda vaqt murakkabligi?','O(n)','O(n log n)','O(n²)','O(log n)','B',"Quicksort o'rtacha: O(n log n), eng yomon holda: O(n²)",['it','algorithms']),
  q('it','medium','Qaysi CSS xususiyati elementni markazga qo\'yadi (flexbox)?','text-align','margin: auto','justify-content: center','align-items','C','Flexbox da justify-content: center gorizontal markazga qo\'yadi',['it','web']),

  // ──────────────────────────────────────────
  // ADABIYOT (literature) — 20 savol
  // ──────────────────────────────────────────
  q('literature','easy',"Alisher Navoiy qaysi asrda yashagan?",'XIV asr','XV asr','XVI asr','XIII asr','B',"Alisher Navoiy 1441-1501-yillarda yashagan, XV asrning buyuk shoiri",['literature','uzbek']),
  q('literature','easy',"Navoiyning mashhur asari?",'Boburnoma','Xamsa','Qutadg\'u bilig','Devonu lug\'otit turk','B',"Navoiyning \"Xamsa\"si (5 doston) o'zbek adabiyotining durdonasi",['literature','uzbek']),
  q('literature','easy',"Boburnomani kim yozgan?",'Navoiy','Ulug\'bek','Zahiriddin Bobur','Amir Temur','C',"\"Boburnoma\" — Zahiriddin Muhammad Boburning avtobiografiyasi",['literature','uzbek']),
  q('literature','easy',"Muhamad Yusuf qaysi janrda ijod qilgan?",'Roman','She\'riyat','Dramaturgiya','Nasriy hikoya','B',"Muhammad Yusuf (1954-2015) — o'zbek she'riyatining yirik vakili",['literature','uzbek']),
  q('literature','easy','Shekspirning mashhur fojeaviy asari?','Otello','Romeo va Juletta','Hamlet','King Lear','C',"\"Hamlet\" — Shekspirning eng mashhur fojeaviy asari (taxminan 1600-1601)",['literature','world']),
  q('literature','easy',"Leo Tolstoyning epik romani?",'Jinoyat va jazo','Anna Karenina','Urush va tinchlik','Usta va Margarita','C',"\"Urush va tinchlik\" (1869) — Tolstoyning buyuk epopeyasi",['literature','world']),
  q('literature','medium',"Abdulla Qodiriy qaysi roman bilan mashhur?",'Shum bola','O\'tgan kunlar','Mehrobdan chayon','Sarob','B',"\"O'tgan kunlar\" (1926) — Abdulla Qodiriyning birinchi o'zbek romani",['literature','uzbek']),
  q('literature','medium',"Cho'lpon qaysi sohada ijod qilgan?",'Dramaturgiya','She\'riyat va nasriyot','Tarix','San\'at','B',"Abdulhamid Cho'lpon (1897-1938) — shoir, dramaturg va romanchи",['literature','uzbek']),
  q('literature','medium','Dante kim?','Frantsuz shoiri','Italyan shoiri (Ilohiy komediya muallifi)','Ingliz romanchisi','Ispan dramaturgi','B',"Dante Aligeri (1265-1321) — \"Ilohiy komediya\" muallifi",['literature','world']),
  q('literature','medium','Dostoevskiy qaysi asari bilan mashhur?','Urush va tinchlik','Jinoyat va jazo','Anna Karenina','Otalar va bolalar','B',"\"Jinoyat va jazo\" (1866) — F.M.Dostoevskiyning psixologik romani",['literature','world']),
  q('literature','medium',"Yusuf Xos Hojib qaysi asarni yozgan?",'Devonu lug\'otit turk','Qutadg\'u bilig','Hibat ul-haqoyiq','Divani hikmat','B',"\"Qutadg'u bilig\" (1069) — Yusuf Xos Hojibning didaktik dostoni",['literature','uzbek']),
  q('literature','medium',"Mahmud Koshg'ariy qaysi asarni yozgan?",'Qutadg\'u bilig','Devonu lug\'otit turk','Xamsa','Muhabbatnoma','B',"\"Devonu lug'otit turk\" (1072-1074) — turk tillarining ensiklopediyasi",['literature','uzbek']),
  q('literature','hard',"G'arb adabiyotida Kafka qanday yo'nalishda yozgan?",'Realizm','Romantizm','Absurdizm va ekzistensializm','Naturalizm','C',"Franz Kafka (1883-1924) — absurd va ekzistensial adabiyot vakili",['literature','world']),
  q('literature','hard','Magik realizm vakili?','Borxes','Heminguey','Flober','Balzak','A',"Xorxe Luis Borxes — magik realizm yo'nalishining asoschilaridan",['literature','world']),
  q('literature','easy',"Navoiy qaysi tilda asosiy asarlarini yozgan?",'Arab','Fors','Chig\'atoy (eski o\'zbek)','Rus','C',"Navoiy asosiy asarlarini chig'atoy turk (eski o'zbek) tilida yozgan",['literature','uzbek']),
  q('literature','medium',"O'zbek adabiyotining otasi deb kim ataladi?",'Navoiy','Bobur','Cho\'lpon','Qodiriy','A',"Alisher Navoiy o'zbek adabiyotining otasi deb e'tirof etiladi",['literature','uzbek']),
  q('literature','easy',"Shekspir qaysi millat vakili?",'Frantsuz','Italyan','Ingliz','Nemis','C',"Uilyam Shekspir (1564-1616) — ingliz dramaturgi va shoiri",['literature','world']),
  q('literature','medium','Viktor Gyugo qaysi romani bilan mashhur?','Xo\'rlik va shafqat','Yovuz odamlar','Miskin odamlar (Le Miserables)','Notre-Dam sobori','C',"\"Les Misérables\" (1862) — V.Gyugoning mashhur romani",['literature','world']),
  q('literature','hard',"O'zbek sovet adabiyotining murakkab taqdirli vakili?",'G\'ayratiy','Hamza','Cho\'lpon','Aybek','C',"Abdulhamid Cho'lpon — repressiya qurboni, o'zbek adabiyotining muhtasham vakili",['literature','uzbek']),
  q('literature','easy',"\"Romeo va Juletta\" asarida voqealar qaysi shaharda kechadi?",'Verona','Rim','Florentsiya','Milan','A',"Shekspir asarida voqealar Italiyaning Verona shahrida ro'y beradi",['literature','world']),

  // ──────────────────────────────────────────
  // MANTIQ (logic) — 20 savol
  // ──────────────────────────────────────────
  q('logic','easy','Agar barcha mushuklar hayvon, ba\'zi hayvonlar uy hayvoni bo\'lsa, xulosa?','Barcha mushuklar uy hayvoni','Ba\'zi mushuklar uy hayvoni bo\'lishi mumkin','Mushuklar hayvon emas','Uy hayvonlari mushuk emas','B','Syllogizm: ba\'zi A — B, barcha C — A, demak ba\'zi C — B',['logic','syllogism']),
  q('logic','easy','Agar 2 + 2 = 4 va 3 + 3 = 6 bo\'lsa, 4 + 4 = ?','6','8','10','12','B','Induksiya: 4+4=8',['logic','deduction']),
  q('logic','easy','Seriyadagi naqsh: 2, 4, 8, 16, ... Keyingi?','24','30','32','64','C','Har qadamda × 2: 16 × 2 = 32',['logic','sequences']),
  q('logic','easy','1, 4, 9, 16, 25, ... Keyingi?','30','36','35','49','B','To\'liq kvadratlar: 6² = 36',['logic','sequences']),
  q('logic','easy','Qaysi so\'z qatorga to\'g\'ri kelmaydi? Alma, Olcha, Gilos, Sabzi, Shaftoli','Alma','Olcha','Sabzi','Shaftoli','C','Sabzi — sabzavot, qolganlari — meva',['logic','classification']),
  q('logic','easy','A = B va B = C bo\'lsa, A = C. Bu qanday mantiqiy qoida?','Induksiya','Deduksiya','Tranzitivlik','Kontrapozizia','C','Tenglikda tranzitivlik qoidasi: A=B, B=C → A=C',['logic','rules']),
  q('logic','medium','Agar "Barcha A — B" va "Hech qanday B — C emas" bo\'lsa?','Ba\'zi A — C','Hech qanday A — C emas','Barcha A — C','Ba\'zi A — C emas','B','Syllogizm: Barcha A→B, Hech bir B→C emas, demak Hech bir A→C emas',['logic','syllogism']),
  q('logic','medium','2, 3, 5, 7, 11, 13, ... Keyingi?','15','17','16','19','B','Tub sonlar ketma-ketligi: 17',['logic','sequences']),
  q('logic','medium','Bir odam 3 kunда 3 ish qilsa, 9 odam 9 kunda nechta ish qiladi?','9','27','81','18','C','3 ish / 3 kun = 1 ish/kun; 9 odam × 9 kun = 81',['logic','math_logic']),
  q('logic','medium','P → Q va ¬Q bo\'lsa, ¬P bo\'ladimi?','Ha (Modus Tollens)','Yo\'q','Faqat ba\'zi hollarda','Noma\'lum','A','Modus Tollens: P→Q, ¬Q → ¬P',['logic','propositional']),
  q('logic','medium','Qaysi raqam bir xil birdan ko\'paytirilsa ham, ayirilsa ham natiia o\'zgarmaydi?','1','0','∞','-1','B','0 + 0 = 0, 0 - 0 = 0, 0 × 0 = 0',['logic','math_logic']),
  q('logic','medium','Agar kecha ertangi kundan oldin bo\'lsa, bugun qaysi kun?','Dushanba','Seshanba','Noma\'lum','Qarashmaydi','C','Umumiy holda kunni aniqlab bo\'lmaydi',['logic','riddle']),
  q('logic','hard','Agar P↔Q (bikonditsional) va P yolg\'on bo\'lsa, Q qanday?','To\'g\'ri','Yolg\'on','Noma\'lum','Ikkalasi ham','B','P↔Q: faqat ikkalasi bir xil bo\'lganda to\'g\'ri; P=F → Q=F',['logic','propositional']),
  q('logic','easy','Yuqoridagilarning barchasiga asoslanib, qaysi xulosani chiqarish mumkin? Barcha qushlar uchadi. Pingvin qush. Demak?','Pingvin uchadi','Pingvin uchmasligi mumkin','Mantiqiy xulosa: uchishi kerak','Mantiqiy xato yo\'q','C','Deduktiv xulosa: uchadi (ammo amalda pingvinlar uchmas — bu mantiqiy ziddiyat)',['logic','deduction']),
  q('logic','hard','Turing testi nimani baholaydi?','Kompyuter tezligi','Sun\'iy intellektning inson kabi muloqot qila olishini','Dastur kodi sifati','Xotira sig\'imi','B',"Turing testi — AI ning inson kabi fikrlash qobiliyatini o'lchash usuli",['logic','AI']),
  q('logic','medium','1, 1, 2, 3, 5, 8, 13, 21, ... Keyingi?','29','34','32','28','B','Fibonachchi: 13+21=34',['logic','sequences']),
  q('logic','easy','Agар qoʻy otdan kichik, ot esa fildan kichik boʻlsa, qoʻy fildan kichikmi?','Ha','Yoʻq','Noma\'lum','Teng','A','Tranzitivlik: qo\'y < ot < fil → qo\'y < fil',['logic','comparison']),
  q('logic','medium','Uchburchak so\'zi nechta harfdan iborat?','7','8','9','10','C',"Uchburchak: U-CH-B-U-R-CH-A-K = 9 harf (o'zbekcha)",['logic','language']),
  q('logic','hard','Gödel to\'liqsizlik teoremasi nimani isbotladi?','Matematik sistemalar o\'z-o\'zini isbotlay olmaydi','Barcha matematik haqiqatlar isboтlanishi mumkin','Mantiq va matematika bir xil','Raqamlar cheksiz','A',"Gödel (1931): har qanday to'liq matematik sistema o'z ichida isbotlanmagan haqiqatlarga ega",['logic','philosophy']),
  q('logic','easy','Qaysi raqam juft ham, tub ham?','1','2','4','6','B','2 — yagona juft tub son',['logic','math_logic']),

  // ──────────────────────────────────────────
  // GENERAL KNOWLEDGE — 15 savol (qo'shimcha)
  // ──────────────────────────────────────────
  q('general-knowledge','easy','Yer yuzasining necha foizi suv?','50%','60%','71%','80%','C','Yer yuzasining taxminan 71% ini suv qoplaydi',['general','geography']),
  q('general-knowledge','easy','Inson tanasida nechta suyak bor (kattada)?','196','206','216','186','B','Katta yoshli insonda 206 ta suyak bor',['general','biology']),
  q('general-knowledge','medium','Qaysi davlat dunyoda eng ko\'p aholi bo\'yicha birinchi o\'rinda?','Hindiston','Xitoy','AQSH','Indonesia','A','2023-yildan Hindiston Xitoyni o\'tib, dunyoda eng ko\'p aholili davlatga aylandi',['general','world']),
  q('general-knowledge','easy','Nobel mukofoti qaysi yili birinchi marta berilgan?','1895','1901','1905','1910','B','Nobel mukofoti birinchi marta 1901-yilda berildi',['general','history']),
  q('general-knowledge','medium','Kompyuterni ixtiro qilgan?','Bill Gates','Alan Turing','Charlz Babbage','John von Neumann','C','Charlz Babbage (1791-1871) mexanik hisoblash mashinasini ixtiro qildi',['general','technology']),
  q('general-knowledge','easy','Qaysi metal eng yengil?','Alyuminiy','Magniy','Litiy','Titan','C','Litiy (Li) — eng yengil metal (zichligi: 0.534 g/cm³)',['general','chemistry']),
  q('general-knowledge','medium','Internet qachon ixtiro qilingan?','1969','1980','1991','1975','A','ARPANET (internet asosi) 1969-yilda yaratildi; WWW 1991-yilda',['general','technology']),
  q('general-knowledge','easy','Olimpiya o\'yinlari necha yilda bir marta o\'tkaziladi?','2','4','6','8','B','Yozgi va Qishki olimpiya o\'yinlari har 4 yilda bir marta',['general','sports']),
  q('general-knowledge','medium','Qaysi vitamini kamligida raxit kasalligi kelib chiqadi?','A vitamini','B vitamini','C vitamini','D vitamini','D','D vitamini tanqisligi bolalarda raxit kasalligiga olib keladi',['general','health']),
  q('general-knowledge','easy','Quyosh sistemasida eng katta sayyora?','Saturn','Neptun','Yupiter','Uran','C','Yupiter — quyosh sistemasidagi eng katta sayyora',['general','space']),
  q('general-knowledge','medium','Birinchi telefon kim tomonidan ixtiro qilingan?','Edison','Aleksandr Bell','Nyuton','Tesla','B','Aleksandr Graham Bell 1876-yilda birinchi telefonni ixtiro qildi',['general','technology']),
  q('general-knowledge','easy','Dengizning sho\'rlik darajasi taxminan necha foiz?','2%','3.5%','5%','1%','B','Dengiz suvining sho\'rlik darajasi taxminan 3.5%',['general','nature']),
  q('general-knowledge','medium','Shaxmat o\'yinini qaysi davlat ixtiro qilgan deb hisoblanadi?','Xitoy','Arabiston','Hindiston','Eron','C','Shaxmat Hindistonda V-VI asrlarda paydo bo\'lgan (Chaturanga)',['general','games']),
  q('general-knowledge','easy','Qaysi organ qonni tozalaydi?','Jigar','Yurak','Buyrak','O\'pka','C','Buyrak — qonni tozalash va siydik hosil qilishning asosiy organi',['general','biology']),
  q('general-knowledge','hard','Dunyo bo\'yicha qancha til mavjud (taxminan)?','1000','3000','7000','500','C','Dunyoda taxminan 7000+ til mavjud (hozirda 6500-7000 atrofida)',['general','linguistics']),

  // ──────────────────────────────────────────
  // ENGLISH VOCABULARY — 10 qo'shimcha savol
  // ──────────────────────────────────────────
  q('english-vocabulary','medium','What does "METICULOUS" mean?','Careless and sloppy','Extremely careful and precise','Very loud','Lazy','B','"Meticulous" means showing great attention to detail.',['vocabulary','ielts']),
  q('english-vocabulary','hard','What does "SYCOPHANT" mean?','A brave person','A person who acts obsequiously to gain favor','An honest critic','A loud speaker','B','"Sycophant" means a person who uses flattery to gain advantage.',['vocabulary','ielts']),
  q('english-vocabulary','medium','Choose the synonym for "CONCISE":','Lengthy','Verbose','Brief and clear','Confusing','C','"Concise" means giving a lot of information clearly in few words.',['vocabulary','synonyms']),
  q('english-vocabulary','easy','What is the antonym of "ANCIENT"?','Old','Historic','Modern','Classic','C','"Modern" means relating to present times — the opposite of ancient.',['vocabulary','antonyms']),
  q('english-vocabulary','hard','TENACIOUS means:','Weak and fragile','Very determined; not giving up','Generous','Timid','B','"Tenacious" means keeping a firm hold of something; persistent.',['vocabulary','ielts']),
  q('english-vocabulary','medium','DILIGENT means:','Lazy','Careless','Hard-working and careful','Reckless','C','"Diligent" means having or showing care in one\'s work.',['vocabulary','adjectives']),
  q('english-vocabulary','easy','What does "VAST" mean?','Small','Tiny','Immensely large','Narrow','C','"Vast" means of very great extent or quantity.',['vocabulary','basic']),
  q('english-vocabulary','medium','PROFOUND means:','Shallow','Very deep or intense','Simple','Brief','B','"Profound" means very great or intense; having deep insight.',['vocabulary','ielts']),
  q('english-vocabulary','hard','LOQUACIOUS means:','Silent','Speaking a lot; talkative','Intelligent','Angry','B','"Loquacious" means tending to talk a great deal.',['vocabulary','ielts']),
  q('english-vocabulary','medium','VERSATILE means:','Inflexible','Able to adapt to many functions','Stubborn','Outdated','B','"Versatile" means able to adapt to many different functions or activities.',['vocabulary','ielts']),

  // ──────────────────────────────────────────
  // GRAMMAR — 10 qo'shimcha savol
  // ──────────────────────────────────────────
  q('grammar','easy','Choose the correct form: "She ___ to school every day."','go','goes','going','gone','B','Third person singular (she): goes',['grammar','present_simple']),
  q('grammar','medium','Which sentence is in the Past Perfect tense?','She had finished before I arrived.','She finished before I arrive.','She has finished before I arrived.','She was finishing before I arrived.','A','Past Perfect = had + past participle',['grammar','tenses']),
  q('grammar','easy','The plural of "child" is:','Childs','Childen','Children','Childer','C','Irregular plural: child → children',['grammar','plurals']),
  q('grammar','medium','Choose the correct sentence:','Neither of them are ready.','Neither of them is ready.','Neither of them were ready.','None of above','B','Neither + singular verb: "Neither of them IS ready"',['grammar','agreement']),
  q('grammar','hard','Identify the dangling modifier: "Running quickly, the bus was caught."','No error','Running quickly (who was running?)','The bus','Was caught','B','Dangling modifier: "Running quickly" has no clear subject — should be the person',['grammar','modifiers']),
  q('grammar','easy','Which word is a conjunction?','Quickly','Beautiful','Although','Carefully','C','Although — subordinating conjunction',['grammar','parts_of_speech']),
  q('grammar','medium','"I wish I ___ more time." Choose the correct form:','have','had','will have','would have','B','I wish + past simple (had) — expressing wish about present',['grammar','subjunctive']),
  q('grammar','easy','The comparative form of "good" is:','Gooder','More good','Better','Best','C','Irregular comparative: good → better → best',['grammar','comparatives']),
  q('grammar','medium','Choose the correct passive voice: "Someone broke the window."','The window broke.','The window was broken.','The window is broken.','The window had broken.','B','Simple past passive: was/were + past participle',['grammar','passive_voice']),
  q('grammar','hard','"Despite ___ tired, she continued working." Choose the correct form:','being','to be','she was','been','A','Despite + V-ing (gerund): "Despite being tired"',['grammar','gerunds']),

  // ──────────────────────────────────────────
  // READING — 10 qo'shimcha savol
  // ──────────────────────────────────────────
  q('reading','easy','Read: "The library closes at 9pm on weekdays and 6pm on weekends." When does it close on Saturday?','9pm','6pm','8pm','Always open','B','Saturday = weekend → closes at 6pm',['reading','comprehension']),
  q('reading','medium','Read: "While the new policy was welcomed by most employees, some expressed concerns about its implementation." What is implied?','All employees support the policy','Most but not all support the policy','No one supports the policy','Only management supports it','B','"Most... some expressed concerns" shows majority support with minority opposition',['reading','inference']),
  q('reading','hard','What is the main purpose of a thesis statement in academic writing?','To provide examples','To state the main argument or claim of the paper','To give background information','To conclude the essay','B','A thesis statement expresses the central claim the paper will argue',['reading','academic']),
  q('reading','medium','Read: "The author suggests that rapid urbanization, while driving economic growth, places significant strain on natural resources." The author\'s view is:','Urbanization is entirely beneficial','Urbanization has both benefits and drawbacks','Urbanization should be stopped','Natural resources are unlimited','B','The contrast "while...strain" shows the balanced view',['reading','analysis']),
  q('reading','easy','What does "inference" mean in reading comprehension?','Reading aloud','Understanding literal meaning only','Drawing conclusions from implied information','Memorizing text','C','Inference = reading between the lines to find implied meaning',['reading','skills']),
  q('reading','medium','A "rhetorical question" in a text is:','A question requiring a factual answer','A question asked for effect, not an actual answer','A grammar exercise','A type of comparison','B','Rhetorical questions are asked to make a point, not for answers',['reading','rhetoric']),
  q('reading','hard','In academic texts, "hedging language" (e.g., "may", "might", "appears to") serves what purpose?','To express certainty','To indicate tentativeness or uncertainty','To show emotion','To give commands','B','Hedging language shows caution about claims — important in academic writing',['reading','academic']),
  q('reading','easy','Read: "Despite heavy rain, the game continued." What is "Despite" doing here?','Showing cause','Showing contrast/concession','Showing addition','Showing result','B','Despite = contrast: rain (negative) vs. game continued (positive)',['reading','cohesion']),
  q('reading','medium','What is the difference between "implicit" and "explicit" information in a text?','No difference','Explicit is directly stated; implicit is implied','Implicit is direct; explicit is hidden','Both mean hidden','B','Explicit = clearly stated; Implicit = suggested or implied',['reading','comprehension']),
  q('reading','hard','In IELTS Reading, "True/False/Not Given" — "Not Given" means:','The statement is false','The statement contradicts the text','The text neither confirms nor denies the statement','The statement is not important','C','Not Given = no information in the passage to confirm or deny',['reading','ielts']),

  // ──────────────────────────────────────────
  // LISTENING — 10 qo'shimcha savol
  // ──────────────────────────────────────────
  q('listening','easy','In IELTS Listening, how many sections are there?','2','3','4','5','C','IELTS Listening: 4 sections, 10 questions each = 40 total',['listening','ielts']),
  q('listening','medium','What type of recording is used in IELTS Listening Section 3?','A monologue','A social conversation','A discussion between 2-4 people in an academic context','A radio broadcast','C','Section 3: up to 4 speakers in academic context (tutorial/seminar)',['listening','ielts']),
  q('listening','easy','What is "active listening"?','Listening while doing other tasks','Fully concentrating, understanding and responding thoughtfully','Listening to music','Taking notes only','B','Active listening = focused, engaged attention to the speaker',['listening','skills']),
  q('listening','medium','Which strategy helps most in IELTS Listening?','Reading the questions before the audio plays','Listening without looking at questions','Answering every question after all audio','Guessing all answers','A','Pre-reading questions before audio helps predict and focus',['listening','strategies']),
  q('listening','medium','What does "note-taking" during listening help with?','Distracts attention','Captures key information and aids memory','Is not allowed in IELTS','Only for speaking','B','Effective note-taking captures main points during listening',['listening','skills']),
  q('listening','hard','What is "prosody" in spoken language?','Vocabulary choice','The rhythm, stress and intonation patterns of speech','Grammar rules','Pronunciation of vowels','B','Prosody includes rhythm, stress, and intonation — vital for comprehension',['listening','phonetics']),
  q('listening','easy','If a speaker says "However, the results were positive," what discourse marker is used?','Addition','Contrast','Cause','Sequence','B','"However" = contrast/concession discourse marker',['listening','discourse']),
  q('listening','medium','What does "bottom-up processing" in listening mean?','Understanding from overall context','Decoding sounds → words → meaning sequentially','Using background knowledge only','Listening for main idea','B','Bottom-up: processing from sounds to letters to words to meaning',['listening','theory']),
  q('listening','hard','What is the main challenge of "fast speech" for non-native listeners?','Too loud','Connected speech phenomena (linking, reduction, elision)','Strong grammar','Clear pronunciation','B','Fast speech causes linking (gonna, wanna), elision and reduction — hard to decode',['listening','phonetics']),
  q('listening','medium','IELTS Listening Section 4 is typically about:','A social situation','Travel information','A university lecture or talk','A job interview','C','Section 4: academic monologue (lecture), hardest section',['listening','ielts']),

  // IELTS MOCK — qo'shimcha
  q('ielts-mock','easy','What is the word limit for IELTS Academic Writing Task 1?','100 words minimum','150 words minimum','200 words minimum','250 words minimum','B','Task 1 requires minimum 150 words describing visual data',['ielts','writing']),
  q('ielts-mock','easy','IELTS Speaking test has how many parts?','2','3','4','5','B','IELTS Speaking: Part 1 (introduction), Part 2 (long turn), Part 3 (discussion)',['ielts','speaking']),
  q('ielts-mock','medium','In IELTS Writing Task 2, what does "Discuss both views" mean?','Give only your opinion','Present both sides equally then give your view','Only agree with one view','Write about 3 views','B','Discuss both views: present arguments for and against, then personal opinion',['ielts','writing']),
  q('ielts-mock','medium','Which band score indicates "Competent User" in IELTS?','Band 5','Band 6','Band 7','Band 8','B','Band 6 = Competent User: generally effective command with some inaccuracies',['ielts','scores']),
  q('ielts-mock','hard','In IELTS Speaking Part 2, how long do you have to prepare?','30 seconds','1 minute','2 minutes','3 minutes','B','Part 2: 1 minute preparation, then speak for 1-2 minutes',['ielts','speaking']),
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexus_test_db';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB ga ulanildi');

    await Question.deleteMany({});
    console.log('🗑️  Eski savollar o\'chirildi');

    const result = await Question.insertMany(questions);
    console.log(`✅ ${result.length} ta savol qo'shildi`);

    // Kategoriyalar soni
    const cats = {};
    questions.forEach(q => { cats[q.category] = (cats[q.category]||0)+1; });
    console.log('\n📊 Kategoriyalar bo\'yicha:');
    Object.entries(cats).sort((a,b)=>b[1]-a[1]).forEach(([cat,cnt])=>{
      console.log(`   ${cat}: ${cnt} ta savol`);
    });

    // Admin yaratish
    await User.deleteMany({ role: 'admin' });
    const hashedPwd = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12);
    await User.create({
      name: process.env.ADMIN_NAME || 'Super Admin',
      email: process.env.ADMIN_EMAIL || 'admin@nexustest.com',
      password: hashedPwd,
      role: 'admin'
    });
    console.log('\n✅ Admin yaratildi:');
    console.log(`   Email:    ${process.env.ADMIN_EMAIL || 'admin@nexustest.com'}`);
    console.log(`   Parol:    ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('\n🎉 Ma\'lumotlar bazasi muvaffaqiyatli to\'ldirildi!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Xato:', err.message);
    process.exit(1);
  }
};

seedDatabase();

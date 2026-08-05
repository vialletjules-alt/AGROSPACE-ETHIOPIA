try {

if (typeof gsap !== 'undefined') {
  try {
    gsap.to('.header', {
      scrollTrigger: { trigger: 'body', start: '80px top', end: '100px top', scrub: 0.5 },
      background: 'rgba(255,255,255,0.22)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.1), 0 0 120px rgba(46,139,87,0.12)'
    });
  } catch(e) { console.warn('GSAP header:', e.message); }
}
document.addEventListener('scroll', function() {
  var h = document.querySelector('.header');
  h.classList.toggle('scrolled', window.scrollY > 60);
  var darkSections = document.querySelectorAll('.hero-full, .stats-dynamic, .footer, .parallax');
  var isDark = false;
  var mid = window.scrollY + 40;
  for (var i = 0; i < darkSections.length; i++) {
    var r = darkSections[i].getBoundingClientRect();
    if (r.top <= 60 && r.bottom > 40) { isDark = true; break; }
  }
  h.classList.toggle('header-light', isDark);
});

var hg = document.getElementById('heroGrid');
if (hg) {
  for (var i = 0; i < 36; i++) {
    var c = document.createElement('div');
    c.className = 'hero-cell' + (i % 5 === 0 ? ' filled' : '') + (i % 11 === 0 ? ' accent' : '');
    hg.appendChild(c);
  }
}

if (typeof gsap !== 'undefined') {
  try {
    gsap.to('#parallaxBg', {
      y: '14%',
      ease: 'none',
      scrollTrigger: { trigger: '.parallax', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
  } catch(e) { console.warn('GSAP parallax:', e.message); }
}

var articles = [
  {id:1, title:"The Ethiopian Coffee Industry", date:"2024-01-18", category:"COFFEE", desc:"A deep dive into Ethiopia's coffee supply chain: from traditional production to the challenges of valorization and export.", time:"7 min read", body:"Ethiopia is the historical birthplace of Coffea arabica. It is in the southwestern highlands, in the province of Kaffa, that the first coffee plants were discovered and consumed more than a thousand years ago. From this single region, the plant travelled across the Red Sea to Yemen and, from there, to the rest of the world. Today, coffee remains at the very heart of the Ethiopian economy, representing close to 30 percent of the country's export earnings and directly supporting the livelihoods of an estimated fifteen million people.\n\nThe overwhelming majority of Ethiopian coffee growers are smallholders who cultivate their trees on plots of less than two hectares. Production methods remain largely traditional, with meticulous attention paid to the ripeness of the cherries and to natural drying on raised beds. This artisanal approach, far from being a weakness, is precisely what gives Ethiopian coffee its extraordinary aromatic complexity and its reputation among specialty roasters.\n\nAlongside these traditional practices, a growing number of washing stations and cooperatives are adopting modern wet-processing techniques, controlled fermentation, and moisture monitoring. The coexistence of ancestral know-how and contemporary quality control defines the current moment of the Ethiopian coffee sector."},
  {id:2, title:"Ethiopia and the Valorization of Coffee", date:"2024-10-15", category:"COFFEE", desc:"The Paradox of Abundance: how Ethiopia possesses 6,000 to 10,000 coffee varieties that remain undifferentiated in global markets.", time:"8 min read", body:"Ethiopia possesses an estimated 6,000 to 10,000 distinct varieties of Coffea arabica L., representing approximately 95 percent of the global genetic pool of the species. The southwestern forests \u2014 Kaffa, Bench-Maji, Illubabor \u2014 constitute the natural cradle from which all arabica coffee cultivated worldwide descends. Yet this extraordinary biological wealth functions paradoxically as an undifferentiated mass in the global market.\n\nThe problem is not the absence of diversity."},
  {id:3, title:"Ethiopia's US$6 Billion Coffee Ambition", date:"2026-07-04", category:"COFFEE", desc:"Ethiopia has set an ambitious target of US$6 billion in annual coffee export earnings by 2031.", time:"7 min read", body:"Ethiopia has recorded one of the strongest performances in its coffee export history, generating nearly US$3 billion in foreign exchange from coffee in the 2025/26 fiscal year."},
  {id:4, title:"Germany's Coffee Revolution", date:"2026-05-18", category:"COFFEE", desc:"Germany's coffee market is shifting from commodity consumption toward specialty coffee and origin-focused consumption.", time:"7 min read", body:"Germany's coffee market is undergoing a transformation that extends far beyond traditional commodity trading. Subscription-based coffee platforms now represent 25\u201330 percent of market value."},
  {id:5, title:"Ethiopia and the Global Sesame Market", date:"2024-12-05", category:"SESAME AND OILSEEDS", desc:"Ethiopia faces the structural challenge of value addition rather than raw seed export.", time:"9 min read", body:"Ethiopia occupies a distinctive position in the global sesame market. The worldwide reputation of Humera sesame is well established as one of the country's most desirable export products."},
  {id:6, title:"Ethiopia's Emerging Fruit and Vegetable Export Sector", date:"2026-01-15", category:"FRUITS AND VEGETABLES", desc:"Ethiopia's horticulture sector is growing at 15% annually, driven by demand for avocados and cut flowers.", time:"5 min read", body:"Ethiopia's fruit and vegetable sector has emerged as one of the fastest-growing segments of agricultural exports. Avocado exports grew 240% between 2020 and 2025."},
  {id:7, title:"Teff: Ethiopia's Super Grain Goes Global", date:"2026-02-28", category:"TEFF AND CEREALS", desc:"Teff production reached a record 6.2 million tons in 2025.", time:"6 min read", body:"Teff (Eragrostis tef) is Ethiopia's indigenous staple grain, occupying 3 million hectares of farmland. Production reached 6.2 million tons in 2025."},
  {id:8, title:"Ethiopian Spices: Korarima and Berbere", date:"2026-03-20", category:"SPICES AND AROMATICS", desc:"Ethiopia's spice sector, led by korarima and black cumin, exports to 35 countries.", time:"5 min read", body:"Ethiopia is one of the world's most diverse centers of spice production, with over 20 commercial spice species."},
  {id:9, title:"Ethiopian Honey: Africa's Largest Producer", date:"2026-04-10", category:"HONEY", desc:"Ethiopia produces 65,000 tons of honey annually yet less than 5% is exported.", time:"5 min read", body:"Ethiopia is Africa's largest honey producer with 65,000 tons annually. Export volumes are negligible at less than 3,000 tons."},
  {id:10, title:"EUDR Compliance Roadmap for Ethiopian Exporters", date:"2026-06-15", category:"SUPPLY CHAIN", desc:"A practical guide to achieving EU Deforestation Regulation compliance.", time:"8 min read", body:"The EU Deforestation Regulation requires operators to conduct due diligence proving no deforestation after December 31, 2020."},
  {id:11, title:"Ethiopia's Logistics Corridors", date:"2026-04-05", category:"SUPPLY CHAIN", desc:"A comprehensive overview of Ethiopia's trade logistics infrastructure.", time:"6 min read", body:"Ethiopia's logistics infrastructure is in a phase of rapid transformation. The Addis Ababa\u2013Djibouti railway carries 5 million tons of cargo annually."},
  {id:12, title:"Blockchain for Coffee Traceability", date:"2026-05-28", category:"SUPPLY CHAIN", desc:"Pilot programs demonstrate 30% premium capture for fully traceable lots.", time:"7 min read", body:"Blockchain-based traceability is transforming the Ethiopian coffee supply chain."},
  {id:13, title:"GIS Mapping and Precision Agriculture", date:"2026-06-20", category:"SUPPLY CHAIN", desc:"Satellite imagery deployed across 1.2 million hectares of Ethiopian farmland for precision agriculture, enabling real-time crop monitoring and resource optimization.", time:"5 min read", body:"Precision agriculture is gaining momentum in Ethiopia. Satellite imagery deployed across 1.2 million hectares of farmland enables real-time crop monitoring and resource optimization. Farmers and cooperatives can now access NDVI data, soil moisture analytics, and yield prediction models through mobile platforms.\n\nThe Ethiopian Space Science and Technology Institute has partnered with international agencies to provide free satellite data access to agricultural stakeholders. This initiative covers coffee, sesame, and cereal-growing regions, helping farmers optimize irrigation schedules and fertilizer application. Early adopters report 20-30% reduction in water usage and 15% increase in yields.\n\nThe Ministry of Agriculture has set a target to expand precision agriculture coverage to 5 million hectares by 2028, with particular focus on high-value export crops like coffee and sesame."},
  {id:14, title:"Why Ethiopia is the Next Frontier for Investment", date:"2026-03-10", category:"INVESTMENT", desc:"Ethiopia offers 74 million hectares of arable land and diverse agro-ecological zones.", time:"6 min read", body:"Ethiopia represents one of the last great frontiers for agricultural investment."},
  {id:15, title:"Agri-Fintech Opportunities in Ethiopia", date:"2026-04-22", category:"INVESTMENT", desc:"Only 35% of adults have formal financial access in Ethiopia.", time:"5 min read", body:"Financial inclusion is the single most transformative lever for Ethiopian agriculture."},
  {id:16, title:"Special Economic Zones and Agri-Processing Parks", date:"2026-05-15", category:"INVESTMENT", desc:"Ethiopia's industrial parks include dedicated agro-processing zones.", time:"7 min read", body:"The Industrial Parks Development Corporation manages 13 operational industrial parks."},
  {id:17, title:"Ethiopia's Historic Export Year", date:"2026-07-11", category:"INVESTMENT", desc:"Ethiopia recorded US$10.7 billion in exports, a 29% increase.", time:"6 min read", body:"Ethiopia recorded its highest-ever annual export performance."},
  {id:18, title:"Navigating EUDR Compliance", date:"2026-06-01", category:"INVESTMENT", desc:"The EUDR presents both a compliance burden and a strategic opportunity.", time:"8 min read", body:"The EU Deforestation Regulation requires all commodities entering the EU market to be deforestation-free."},
  {id:19, title:"Land Tenure and Investment Law in Ethiopia", date:"2026-02-20", category:"INVESTMENT", desc:"Understanding Ethiopia's unique land governance system.", time:"7 min read", body:"Under the 1995 Constitution, all land in Ethiopia is owned by the state."},
  {id:20, title:"Logistics Bottlenecks and Port Dependency", date:"2026-04-08", category:"INVESTMENT", desc:"Ethiopia's reliance on the Port of Djibouti for 95% of trade.", time:"6 min read", body:"The Port of Djibouti handles approximately 95% of Ethiopia's maritime trade."}
];

function shortLabel(cat) {
  var m = {'COFFEE':'Coffee','SESAME AND OILSEEDS':'Sesame','FRUITS AND VEGETABLES':'Fruits','TEFF AND CEREALS':'Teff','SPICES AND AROMATICS':'Spices','HONEY':'Honey','SUPPLY CHAIN':'Supply Chain','INVESTMENT':'Investment'};
  return m[cat] || cat;
}

function vignette(cat, id) {
  var artUrls = {
     1:'https://images.unsplash.com/photo-1529333320936-e2193f4e3b32?auto=format&fit=crop&w=1200&q=80',
    2:'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=60',
    3:'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?auto=format&fit=crop&w=800&q=60',
    4:'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=60',
    5:'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=800&q=60',
    6:'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=60',
    7:'https://images.unsplash.com/photo-1594911869720-d0c7b3ecb6e0?auto=format&fit=crop&w=800&q=60',
    8:'https://images.unsplash.com/photo-1596040033229-a9821ebd0581?auto=format&fit=crop&w=800&q=60',
    9:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=60',
    10:'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=60',
    11:'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=60',
    12:'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=60',
     13:'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80',
    14:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=60',
    15:'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=800&q=60',
    16:'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=60',
    17:'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=60',
    18:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=60',
    19:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=60',
    20:'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&q=60'
  };
  var fallback = {
    coffee:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=60',
    sesame:'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=800&q=60',
    teff:'https://images.unsplash.com/photo-1594911869720-d0c7b3ecb6e0?auto=format&fit=crop&w=800&q=60',
    honey:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=60',
    spice:'https://images.unsplash.com/photo-1596040033229-a9821ebd0581?auto=format&fit=crop&w=800&q=60',
    fruit:'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=60',
    supply:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=60',
    invest:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=60'
  };
  var imgUrl = artUrls[id] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=60';
  var c = (cat || '').toLowerCase();
  if (!artUrls[id]) {
    if (c.indexOf('coffee') > -1) imgUrl = fallback.coffee;
    else if (c.indexOf('sesame') > -1) imgUrl = fallback.sesame;
    else if (c.indexOf('teff') > -1 || c.indexOf('cereal') > -1) imgUrl = fallback.teff;
    else if (c.indexOf('honey') > -1) imgUrl = fallback.honey;
    else if (c.indexOf('spice') > -1) imgUrl = fallback.spice;
    else if (c.indexOf('fruit') > -1 || c.indexOf('vegetable') > -1) imgUrl = fallback.fruit;
    else if (c.indexOf('supply') > -1) imgUrl = fallback.supply;
    else if (c.indexOf('invest') > -1) imgUrl = fallback.invest;
  }
  return '<div style="width:100%;height:100%;background:#C5DFC9;overflow:hidden;position:relative"><img src="' + imgUrl + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(27,67,50,0.15),transparent 60%)"></div></div>';
}

function fmtDate(d) {
  var dt = new Date(d);
  return dt.toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'});
}

function countCat(cat) {
  var n = 0;
  for (var i = 0; i < articles.length; i++) {
    if (cat === 'ALL' || articles[i].category === cat) n++;
  }
  return n;
}

var currentFilter = 'ALL';
var currentProduct = 'COFFEE';

var PRODUCT_STATS = {
  'ALL': { label1:'Arable Land', val1:'74M ha', desc1:'Total agricultural potential', label2:'Smallholders', val2:'15M+', desc2:'Farming households', label3:'Agro-Zones', val3:'18', desc3:'Ecological diversity', ticker:'Arable land 74M ha &bull; Farmers 15M+ &bull; Agro-zones 18 &bull; Irrigable 5M ha &bull; Coffee $3B &bull; GDP share 35%' },
  'COFFEE': { label1:'PRODUCTION 2024/25', val1:'8.5M bags', desc1:'Total coffee production', label2:'TEFF PRODUCTION 2025', val2:'6.2M t', desc2:'Record annual teff grain production', label3:'ARABLE LAND', val3:'74M ha ▲', desc3:'Total arable land potential', ticker:'Coffee exports +18% &bull; Specialty share 35% &bull; Germany imports +22% &bull; Organic certified 75K ha &bull; 5M+ farmers &bull; 4.5B cups daily' },
  'SESAME AND OILSEEDS': { label1:'Origin', val1:'Humera', desc1:'Premium sesame growing region', label2:'Global Rank', val2:'#2', desc2:'Largest exporters worldwide', label3:'Revenue', val3:'$1.2B', desc3:'Annual export earnings', ticker:'Sesame exports +12% &bull; Premium grade 65% &bull; Humera origin premium +20% &bull; 350K farmers &bull; 40+ countries' },
  'TEFF AND CEREALS': { label1:'Origin', val1:'Shewa', desc1:'Highlands cultivation', label2:'Production', val2:'6.2M t', desc2:'Record output 2025', label3:'Target', val3:'1M t', desc3:'Export goal by 2030', ticker:'Teff production +8% &bull; Export growth +22% &bull; Gluten-free demand +35% &bull; Area 3M ha &bull; Export <5%' },
  'HONEY': { label1:'Origin', val1:'Tigray', desc1:'Traditional apiculture', label2:'Annual Output', val2:'65K t', desc2:'Largest in Africa', label3:'Exported', val3:'<5%', desc3:'Significant headroom', ticker:'Honey production 65K t &bull; Export <3K t &bull; Organic potential high &bull; White honey premium &bull; 2M beehives' },
  'SPICES AND AROMATICS': { label1:'Origin', val1:'Bale', desc1:'Diverse spice corridor', label2:'Varieties', val2:'20+', desc2:'Commercial spice species', label3:'Target', val3:'$200M', desc3:'Export potential', ticker:'Spice exports +15% &bull; Korarima premium &bull; Berbere global &bull; Black cumin organic &bull; 35 country markets' },
  'FRUITS AND VEGETABLES': { label1:'Origin', val1:'Rift Valley', desc1:'Horticulture belt', label2:'Growth Rate', val2:'+15%', desc2:'Annual sector growth', label3:'Avocado', val3:'+240%', desc3:'Export growth 2020&ndash;25', ticker:'Horticulture +15% &bull; Avocado boom 240% &bull; Cut flowers #2 Africa &bull; 200K farmers &bull; EU market access' }
};

function updateStats(product) {

  var s = PRODUCT_STATS[product] || PRODUCT_STATS['COFFEE'];
  document.getElementById('dynLabel1').textContent = s.label1;
  document.getElementById('dynVal1').textContent = s.val1;
  document.getElementById('dynDesc1').textContent = s.desc1;
  document.getElementById('dynLabel2').textContent = s.label2;
  document.getElementById('dynVal2').textContent = s.val2;
  document.getElementById('dynDesc2').textContent = s.desc2;
  document.getElementById('dynLabel3').textContent = s.label3;
  document.getElementById('dynVal3').textContent = s.val3;
  document.getElementById('dynTicker').innerHTML =
    '<span><span class="bull">&bull;</span> ' + s.ticker.replace(/ &bull; /g, ' <span class="bull">&bull;</span> ') + '</span>' +
    '<span><span class="bull">&bull;</span> ' + s.ticker.replace(/ &bull; /g, ' <span class="bull">&bull;</span> ') + '</span>';
}

function renderTags() {
  var cats = ['ALL','COFFEE','SESAME','TEFF','HONEY','SPICES'];
  var full = {'ALL':'ALL','COFFEE':'COFFEE','SESAME':'SESAME AND OILSEEDS','TEFF':'TEFF AND CEREALS','HONEY':'HONEY','SPICES':'SPICES AND AROMATICS'};
  var label = {'ALL':'All','COFFEE':'Coffee','SESAME':'Sesame','TEFF':'Teff','HONEY':'Honey','SPICES':'Spices'};
  var html = '';
  for (var i = 0; i < cats.length; i++) {
    var c = cats[i];
    var f = full[c];
    var cnt = c === 'ALL' ? articles.length : countCat(f);
    var active = currentFilter === f ? ' active' : '';
    var navMap = {'COFFEE':'products-coffee','SESAME AND OILSEEDS':'products-sesame','TEFF AND CEREALS':'products-teff','HONEY':'products-honey','SPICES AND AROMATICS':'products-spices','FRUITS AND VEGETABLES':'products-fruits'};
    var page = navMap[f];
    if (page) {
      html += '<button class="stats-dynamic-tag' + active + '" onclick="navigateTo(\'' + page + '\')">' + label[c] + ' <span class="count">' + cnt + '</span></button>';
    } else {
      html += '<button class="stats-dynamic-tag' + active + '" onclick="filterByTag(\'' + f + '\');updateStats(\'' + f + '\');currentProduct=\'' + f + '\'">' + label[c] + ' <span class="count">' + cnt + '</span></button>';
    }
  }
  document.getElementById('statsTagRow').innerHTML = html;
}

function filterByTag(tag) {
  var el = document.getElementById('pageContainer');
  if (el && el.classList.contains('active')) goHome();
  currentFilter = tag;
  document.getElementById('breadcrumbLast').textContent = currentFilter === 'ALL' ? 'All Articles' : shortLabel(currentFilter);
  renderTags();
  renderArticles();
}

function renderArticles() {
  var arr = [];
  for (var i = 0; i < articles.length; i++) {
    if (currentFilter === 'ALL' || articles[i].category === currentFilter) {
      arr.push(articles[i]);
    }
  }
  arr.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  var html = '';
  for (var i = 0; i < arr.length; i++) {
    var a = arr[i];
    var wide = i === 0 ? ' article-card-wide' : '';
    html += '<div class="article-card' + wide + '" onclick="openArticleViewer(' + a.id + ')">';
    html += '<div class="article-card-img">' + vignette(a.category, a.id) + '</div>';
    html += '<div class="article-card-body">';
    html += '<div class="article-card-cat">' + shortLabel(a.category) + '</div>';
    html += '<h3>' + a.title + '</h3>';
    html += '<p>' + a.desc + '</p>';
    html += '<div class="article-card-meta"><span>' + fmtDate(a.date) + '</span><span class="dot"></span><span>' + a.time + '</span></div>';
    html += '</div>';
    html += '<button class="article-card-read" onclick="event.stopPropagation();event.target.style.transform=\'scale(1.15)\';setTimeout(function(){openArticleViewer(' + a.id + ')},80)">Read</button>';
    html += '</div>';
  }
  document.getElementById('articleGrid').innerHTML = html;
  document.getElementById('sectionTitle').textContent = currentFilter === 'ALL' ? 'Articles' : shortLabel(currentFilter);
}

function renderContent() {
  var gis = null;
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].id === 13) { gis = articles[i]; break; }
  }
  if (!gis) return;
  var paras = gis.body.split('\n');
  var textPara = '';
  for (var i = 0; i < paras.length && i < 2; i++) {
    if (paras[i].trim()) textPara += '<p>' + paras[i] + '</p>';
  }
  document.getElementById('contentSection').innerHTML =
    '<div class="content-main"><h2><span class="lite">Supply Chain</span> ' + gis.title + '</h2>' + textPara + '</div>' +
    '<div class="content-side">' +
    '<div class="note"><div class="note-label">Published</div><div class="note-value" style="font-size:14px">' + fmtDate(gis.date) + '</div><div class="note-desc">Most recent supply chain analysis</div></div>' +
    '<div class="note-line"></div>' +
    '<div class="note"><div class="note-label">Reading</div><div class="note-value" style="font-size:14px">' + gis.time + '</div><div class="note-desc">Full analysis available</div></div>' +
    '<div class="note-line"></div>' +
    '<div class="note"><div class="note-label">Read full</div><div class="note-value" style="font-size:14px;cursor:pointer;color:var(--emerald)" onclick="openArticleViewer(' + gis.id + ')">Open article &rarr;</div><div class="note-desc">Click to view full analysis</div></div>' +
    '</div>';
}

var carouselIdx = 2;

function renderCarousel() {
  var invest = [];
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].category === 'INVESTMENT') invest.push(articles[i]);
  }
  invest.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  var slides = invest.slice(0, 5);
  var html = '';
  for (var i = 0; i < slides.length; i++) {
    html += '<div class="carousel-slide" onclick="openArticleViewer(' + slides[i].id + ')">';
    html += '<div style="position:relative">' + vignette('investment', slides[i].id) + '<button class="article-card-read" onclick="event.stopPropagation();event.target.style.transform=\'scale(1.15)\';setTimeout(function(){openArticleViewer(' + slides[i].id + ')},80)" style="position:absolute;bottom:10px;right:10px;z-index:10">Read</button></div>';
    html += '<div class="slide-info"><h4>' + slides[i].title + '</h4><div class="meta">' + slides[i].time + '</div></div></div>';
  }
  document.getElementById('carouselTrack').innerHTML = html;
  updateCarousel();
}

function updateCarousel() {
  var els = document.querySelectorAll('#carouselTrack .carousel-slide');
  var pos = ['pos-far-left','pos-left','pos-center','pos-right','pos-far-right'];
  for (var i = 0; i < els.length; i++) {
    var p = (i - carouselIdx + els.length) % els.length;
    els[i].className = 'carousel-slide ' + (pos[p] || 'pos-center');
  }
}

function carouselNext() {
  var els = document.querySelectorAll('#carouselTrack .carousel-slide');
  carouselIdx = (carouselIdx + 1) % els.length;
  updateCarousel();
}

function carouselPrev() {
  var els = document.querySelectorAll('#carouselTrack .carousel-slide');
  carouselIdx = (carouselIdx - 1 + els.length) % els.length;
  updateCarousel();
}

var articleClicks = JSON.parse(sessionStorage.getItem('articleClicks') || '{}');

function trackClick(id) {
  articleClicks[id] = (articleClicks[id] || 0) + 1;
  sessionStorage.setItem('articleClicks', JSON.stringify(articleClicks));
}

function getMostRead() {
  var best = null;
  var bestCount = 0;
  for (var k in articleClicks) {
    if (articleClicks[k] > bestCount) { bestCount = articleClicks[k]; best = k; }
  }
  if (!best) return null;
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].id === parseInt(best)) return articles[i];
  }
  return null;
}

function renderMostRead() {
  var mr = getMostRead();
  var el = document.getElementById('mostReadSection');
  if (!el) return;
  if (!mr) {
    var first = articles[0];
    for (var i = 0; i < articles.length; i++) { if (articles[i].category === 'COFFEE') { first = articles[i]; break; } }
    var paras = first.body.split('\n');
    var excerpt = (paras[0] || '').substring(0, 180) + (paras[0] && paras[0].length > 180 ? '...' : '');
    el.innerHTML = '<div class="content-main" style="grid-column:1/-1"><div style="font-size:8px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--emerald);margin-bottom:8px">Most Read</div><h3 style="font-size:20px;font-weight:600;margin-bottom:6px">' + first.title + '</h3><p style="font-size:13px;color:var(--grey);line-height:1.6">' + excerpt + '</p></div>';
    return;
  }
  var paras = mr.body.split('\n');
  var excerpt = (paras[0] || '').substring(0, 180) + (paras[0] && paras[0].length > 180 ? '...' : '');
  el.innerHTML = '<div class="content-main" style="grid-column:1/-1"><div style="font-size:8px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--emerald);margin-bottom:8px">Most Read</div><h3 style="font-size:20px;font-weight:600;margin-bottom:6px">' + mr.title + '</h3><p style="font-size:13px;color:var(--grey);line-height:1.6">' + excerpt + '</p></div>';
}

function openArticleViewer(id) {
  trackClick(id);
  var a = null;
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].id === id) { a = articles[i]; break; }
  }
  if (!a) return;
  document.getElementById('viewerVignette').innerHTML = vignette(a.category, a.id);
  document.getElementById('viewerCat').textContent = shortLabel(a.category);
  document.getElementById('viewerDate').textContent = fmtDate(a.date);
  document.getElementById('viewerReadingTime').textContent = a.time;
  document.getElementById('viewerTitle').textContent = a.title;
  document.getElementById('viewerSubtitle').textContent = a.desc;
  var bodyHtml = '';
  var lines = a.body.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim()) bodyHtml += '<p>' + lines[i] + '</p>';
  }
  document.getElementById('viewerBody').innerHTML = bodyHtml;
  document.getElementById('articleViewer').classList.add('open');
  renderMostRead();
}

function closeArticleViewer() {
  document.getElementById('articleViewer').classList.remove('open');
}

document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeArticleViewer(); });

function liveSearch(q) {
  var dd = document.getElementById('searchDropdown');
  if (!q || q.length < 2) { dd.classList.remove('open'); return; }
  var term = q.toLowerCase();
  var results = [];
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].title.toLowerCase().indexOf(term) > -1 || articles[i].desc.toLowerCase().indexOf(term) > -1) {
      results.push(articles[i]);
    }
  }
  var top = results.slice(0, 3);
  if (top.length === 0) { dd.classList.remove('open'); return; }
  var html = '';
  for (var i = 0; i < top.length; i++) {
    var a = top[i];
    html += '<div class="search-dropdown-item" onclick="closeSearch();openArticleViewer(' + a.id + ')">';
    html += '<div class="sd-img">' + vignette(a.category, a.id) + '</div>';
    html += '<div class="sd-info"><div class="sd-title">' + a.title + '</div><div class="sd-cat">' + shortLabel(a.category) + '</div></div></div>';
  }
  if (results.length > 3) html += '<div class="search-dropdown-more" onclick="closeSearch();doSearch(\'' + q.replace(/'/g, "\\'") + '\')">+' + (results.length - 3) + ' more results &rarr;</div>';
  dd.innerHTML = html;
  dd.classList.add('open');
}

function closeSearch() { document.getElementById('searchDropdown').classList.remove('open'); }

function doSearch(q) { document.getElementById('searchInput').value = q; searchArticles(q); }

function searchArticles(q) {
  closeSearch();
  if (!q || q.length < 2) { filterByTag(currentFilter); return; }
  var term = q.toLowerCase();
  var results = [];
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].title.toLowerCase().indexOf(term) > -1 || articles[i].desc.toLowerCase().indexOf(term) > -1) {
      results.push(articles[i]);
    }
  }
  navigateTo('overview');
  document.getElementById('pageTitle').innerHTML = 'Search: "' + q + '"';
  document.getElementById('pageDesc').innerHTML = results.length + ' article' + (results.length !== 1 ? 's' : '') + ' found';
  var html = '<div class="article-grid">';
  if (results.length === 0) {
    html = '<div style="text-align:center;padding:60px 0;color:var(--grey);font-size:14px">No articles found for "' + q + '"</div>';
  } else {
    for (var i = 0; i < results.length; i++) {
      var a = results[i];
      var wide = i === 0 ? ' article-card-wide' : '';
    html += '<div class="article-card' + wide + '" onclick="openArticleViewer(' + a.id + ')">';
    html += '<div class="article-card-img">' + vignette(a.category, a.id) + '</div>';
      html += '<div class="article-card-body"><div class="article-card-cat">' + shortLabel(a.category) + '</div>';
      html += '<h3>' + a.title + '</h3><p>' + a.desc + '</p>';
      html += '<div class="article-card-meta"><span>' + fmtDate(a.date) + '</span><span class="dot"></span><span>' + a.time + '</span></div></div>';
    html += '<button class="article-card-read" onclick="event.stopPropagation();event.target.style.transform=\'scale(1.15)\';setTimeout(function(){openArticleViewer(' + a.id + ')},80)">Read</button>';
    html += '</div>';
    }
  }
  html += '</div>';
  document.getElementById('pageContent').innerHTML = html;
  document.getElementById('breadcrumbLast').textContent = 'Search: "' + q + '"';
}

document.addEventListener('click', function(e) { var dd = document.getElementById('searchDropdown'); if (dd && !e.target.closest('.header-search')) dd.classList.remove('open'); });

function renderFilteredArticles(filter, containerId) {
  var arr = [];
  for (var i = 0; i < articles.length; i++) {
    if (filter === 'ALL' || articles[i].category === filter) arr.push(articles[i]);
  }
  arr.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  var html = '<div class="article-grid">';
  for (var i = 0; i < arr.length; i++) {
    var a = arr[i];
    var wide = i === 0 ? ' article-card-wide' : '';
    html += '<div class="article-card' + wide + '" onclick="openArticleViewer(' + a.id + ')">';
    html += '<div class="article-card-img">' + vignette(a.category, a.id) + '</div>';
    html += '<div class="article-card-body">';
    html += '<div class="article-card-cat">' + shortLabel(a.category) + '</div>';
    html += '<h3>' + a.title + '</h3><p>' + a.desc + '</p>';
    html += '<div class="article-card-meta"><span>' + fmtDate(a.date) + '</span><span class="dot"></span><span>' + a.time + '</span></div>';
    html += '</div>';
    html += '<button class="article-card-read" onclick="event.stopPropagation();event.target.style.transform=\'scale(1.15)\';setTimeout(function(){openArticleViewer(' + a.id + ')},80)">Read</button>';
    html += '</div>';
  }
  html += '</div>';
  document.getElementById(containerId || 'pageContent').innerHTML = html;
}

var DATA_ROOM = [

  var data = PAGE_DATA[pageId];
  if (!data) return;
  var sections = document.querySelectorAll('.home-section');
  for (var i = 0; i < sections.length; i++) sections[i].classList.add('hidden');
  document.getElementById('pageContainer').classList.add('active');
  document.getElementById('breadcrumbLast').textContent = data.title.replace(/<[^>]+>/g, '');
  document.getElementById('pageTitle').innerHTML = data.title;
  document.getElementById('pageDesc').innerHTML = data.desc;
  var sb = document.getElementById('sidebarNav');
  if (sb) sb.style.display = 'none';
  window.scrollTo(0, 0);
  if (data.html) {
    document.getElementById('pageContent').innerHTML = data.html;
  } else if (data.filter) {
    renderFilteredArticles(data.filter, 'pageContent');
  }
  if (pageId === 'data' || pageId.indexOf('overview-data') > -1) { if (typeof renderDataRoom === 'function') renderDataRoom(); }
}

function goHome() {
  var sections = document.querySelectorAll('.home-section');
  for (var i = 0; i < sections.length; i++) sections[i].classList.remove('hidden');
  document.getElementById('pageContainer').classList.remove('active');
  document.getElementById('breadcrumbLast').textContent = 'All Articles';
  var sb = document.getElementById('sidebarNav');
  if (sb) sb.style.display = '';
  window.scrollTo(0, 0);
}

var currentIdx = 0;
function openModal(i) { currentIdx = i; updateModalContent(); document.getElementById('galleryModal').classList.add('open'); }
function closeModal() { document.getElementById('galleryModal').classList.remove('open'); }
function prevImage() { currentIdx = (currentIdx - 1 + galleryData.length) % galleryData.length; updateModalContent(); }
function nextImage() { currentIdx = (currentIdx + 1) % galleryData.length; updateModalContent(); }
function updateModalContent() { var d = galleryData[currentIdx]; document.querySelector('#modalContent').innerHTML = d.svg; document.querySelector('#modalCap h2').textContent = d.title; document.querySelector('#modalCap p').textContent = d.desc; }
document.getElementById('galleryModal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
function openMobile() { document.getElementById('mobileMenu').classList.add('open'); }
function closeMobile() { document.getElementById('mobileMenu').classList.remove('open'); }
document.getElementById('searchInput').addEventListener('focus', function() { this.parentElement.style.borderColor = 'var(--emerald)'; });
document.getElementById('searchInput').addEventListener('blur', function() { this.parentElement.style.borderColor = 'transparent'; });

window.filterByTag = filterByTag;
window.openArticleViewer = openArticleViewer;
window.closeArticleViewer = closeArticleViewer;
window.openDrOverlay = openDrOverlay;
window.closeDrOverlay = closeDrOverlay;
window.carouselNext = carouselNext;
window.carouselPrev = carouselPrev;
window.openMobile = openMobile;
window.closeMobile = closeMobile;
window.searchArticles = searchArticles;
window.openModal = openModal;
window.closeModal = closeModal;
window.prevImage = prevImage;
window.nextImage = nextImage;
window.navigateTo = navigateTo;
window.goHome = goHome;
window.switchDataCat = switchDataCat;
window.toggleCat = toggleCat;
window.saveCurrentView = saveCurrentView;
window.exportDataAsCSV = exportDataAsCSV;
window.showLineage = showLineage;
window.fetchAndRenderPrices = fetchAndRenderPrices;
window.openPriceDetail = openPriceDetail;

// ===== WHATSAPP CHAT =====
function toggleWhatsAppChat() {
  var chat = document.getElementById('whatsappChat');
  if (chat) chat.classList.toggle('open');
}
function sendWhatsApp() {
  var input = document.getElementById('whatsappInput');
  var btn = document.getElementById('whatsappSendBtn');
  if (!input || !btn) return;
  var msg = input.value.trim();
  if (!msg) return;
  btn.classList.add('sent');
  setTimeout(function() { btn.classList.remove('sent'); }, 600);
  var url = 'https://wa.me/251904003068?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
  input.value = '';
}
window.toggleWhatsAppChat = toggleWhatsAppChat;
window.sendWhatsApp = sendWhatsApp;

// ===== SIDEBAR =====
(function(){
var SECTIONS = [
  { id: 'mainHeader', label: 'Home' },
  { id: 'contentSection', label: 'Supply Ch.' },
  { id: 'articleSection', label: 'Articles' },
  { id: 'carouselSection', label: 'Reports' },
  { id: 'ethiopiaMapSection', label: 'Satellite' },
  { id: 'footerSection', label: 'Contact' }
];
var nav = document.getElementById('sidebarNav');
if (nav) {
  nav.innerHTML = '<div class="sidebar-label">Nav</div>';
  for (var si = 0; si < SECTIONS.length; si++) {
    (function(idx){
      var dot = document.createElement('button');
      dot.className = 'sidebar-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', SECTIONS[idx].label);
      dot.addEventListener('click', function(){
        var el = document.getElementById(SECTIONS[idx].id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
      nav.appendChild(dot);
    })(si);
  }
  var dots = nav.querySelectorAll('.sidebar-dot');
  function updateSidebar() {
    var scrollY = window.scrollY + window.innerHeight / 3;
    var activeIdx = 0;
    for (var si = 0; si < SECTIONS.length; si++) {
      var el = document.getElementById(SECTIONS[si].id);
      if (el && el.offsetTop > 0 && el.offsetTop <= scrollY) activeIdx = si;
    }
    for (var di = 0; di < dots.length; di++) {
      dots[di].classList.toggle('active', di === activeIdx);
    }
  }
  window.addEventListener('scroll', updateSidebar);
  updateSidebar();
}
})();

// ===== DARK MODE =====
(function(){
var btn = document.getElementById('darkToggle');
if (btn) {
  btn.addEventListener('click', function(){
    document.body.classList.toggle('dark');
    var isDark = document.body.classList.contains('dark');
    btn.textContent = isDark ? '\u2600' : '\u263E';
  });
}
})();

// ===== PROGRESS BAR =====
(function(){
var bar = document.getElementById('progressBar');
if (bar) {
  window.addEventListener('scroll', function(){
    var p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = Math.round(p * 100) + '%';
  });
}
})();

// ===== ETHIOPIA MAP =====

// Navigation
function navigateTo(pageId) {
  var data = PAGES[pageId];
  if (!data) return;
  var sections = document.querySelectorAll(".home-section");
  for (var i = 0; i < sections.length; i++) sections[i].classList.add("hidden");
  document.getElementById("pageContainer").classList.add("active");
  document.getElementById("breadcrumbLast").textContent = data.title.replace(/<[^>]+>/g, "");
  document.getElementById("pageTitle").innerHTML = data.title;
  document.getElementById("pageDesc").innerHTML = data.desc;
  var sb = document.getElementById("sidebarNav");
  if (sb) sb.style.display = "none";
  window.scrollTo(0, 0);
  if (data.html) {
    document.getElementById("pageContent").innerHTML = data.html;
  } else if (data.filter) {
    renderFilteredArticles(data.filter, "pageContent");
  }
  if (pageId === "data" || pageId.indexOf("overview-data") > -1) { if (typeof renderDataRoom === "function") renderDataRoom(); }
}

function goHome() {
  var sections = document.querySelectorAll(".home-section");
  for (var i = 0; i < sections.length; i++) sections[i].classList.remove("hidden");
  document.getElementById("pageContainer").classList.remove("active");
  document.getElementById("breadcrumbLast").textContent = "All Articles";
  var sb = document.getElementById("sidebarNav");
  if (sb) sb.style.display = "";
  window.scrollTo(0, 0);
}

var currentIdx = 0;
function openModal(i) { currentIdx = i; updateModalContent(); document.getElementById("galleryModal").classList.add("open"); }
function closeModal() { document.getElementById("galleryModal").classList.remove("open"); }
function prevImage() { currentIdx = (currentIdx - 1 + galleryData.length) % galleryData.length; updateModalContent(); }
function nextImage() { currentIdx = (currentIdx + 1) % galleryData.length; updateModalContent(); }
function updateModalContent() { var d = galleryData[currentIdx]; document.querySelector("#modalContent").innerHTML = d.svg; document.querySelector("#modalCap h2").textContent = d.title; document.querySelector("#modalCap p").textContent = d.desc; }
document.getElementById("galleryModal").addEventListener("click", function(e) { if (e.target === this) closeModal(); });
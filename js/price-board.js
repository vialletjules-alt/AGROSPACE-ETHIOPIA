var ebFilter = 'ALL';
var ebRefreshTimer = null;

function fetchAndRenderPrices(tbodyId, updatedId) {
  fetch('/api/prices')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var prices = data.prices || [];
      var updatedEl = document.getElementById(updatedId);
      if(updatedEl) {
        var d = new Date(data.updatedAt);
        updatedEl.textContent = 'Updated ' + d.toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'});
      }
      var fxEl = document.getElementById('ebFx');
      if(fxEl && data.fx) {
        var fxChange = '';
        if(data.fxChange24h) {
          var fxd = data.fxChange24h;
          fxChange = (fxd >= 0 ? ' ▲ ' : ' ▼ ') + Math.abs(fxd).toFixed(2) + '% 24h';
        }
        fxEl.innerHTML = (data.fxSource === 'cache' ? 'NBE~' : 'NBE ') + data.fx.toFixed(2) + ' ETB/USD'
          + '<span style="font-size:8px;color:#999;margin-left:4px">' + (data.fxUpdatedAt ? new Date(data.fxUpdatedAt).toLocaleDateString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '') + '</span>'
          + (fxChange ? '<span style="font-size:8px;margin-left:4px"' + (data.fxChange24h >= 0 ? ' class="up"' : ' class="down"') + '>' + fxChange + '</span>' : '');
      }
      var filtered = ebFilter === 'ALL' ? prices : prices.filter(function(p){ return p.category === ebFilter; });
      filtered.sort(function(a,b){ return a.commodity.localeCompare(b.commodity); });
      var html = '';
      for(var i=0;i<filtered.length;i++){
        var p = filtered[i];
        var isUp = p.change >= 0;
        var dir = isUp ? '▲' : '▼';
        var cls = isUp ? 'up' : 'down';
        if(p.change === 0) cls = 'neutral';
        var catColors = { Softs:'#2E8B57', Oilseeds:'#B8863A', Grains:'#8DBC76', Specialty:'#C5DFC9', Others:'#6B6B6B' };
        var dotColor = catColors[p.category] || '#6B6B6B';
        var sparkId = 'spk-' + p.slug + '-' + tbodyId;
        var changeStr = dir + ' ' + Math.abs(p.change).toFixed(2) + ' (' + (isUp?'+':'') + p.changePct.toFixed(1) + '%)';
        html += '<tr onclick="openPriceDetail(\'' + p.slug + '\')" style="cursor:pointer">' +
          '<td><div class="eb-commodity"><span class="eb-cat-dot" style="background:'+dotColor+'"></span>' + p.commodity + '</div></td>' +
          '<td class="eb-price ' + cls + '">' + p.price.toFixed(2) + '</td>' +
          '<td class="eb-price">' + (typeof p.priceETB !== 'undefined' ? p.priceETB.toFixed(2) : '-') + '</td>' +
          '<td class="eb-change ' + cls + '">' + changeStr + '</td>' +
          '<td class="eb-bidask">' + p.bid.toFixed(3) + ' / ' + p.ask.toFixed(3) + '</td>' +
          '<td class="eb-bidask">' + p.spread.toFixed(3) + '</td>' +
          '<td class="eb-highlow">' + p.low24.toFixed(2) + ' – ' + p.high24.toFixed(2) + '</td>' +
          '<td class="eb-spark"><svg width="60" height="20" viewBox="0 0 60 20" id="' + sparkId + '"></svg></td>' +
          '<td class="eb-vol">' + (p.volume/1000).toFixed(0) + 'K</td></tr>';
      }
      var tbody = document.getElementById(tbodyId);
      if(tbody) tbody.innerHTML = html;
      // Fetch sparkline data for each commodity
      for(var i=0;i<filtered.length;i++){
        drawSparkline(filtered[i].slug, tbodyId);
      }
    })
    .catch(function(err){
      var tbody = document.getElementById(tbodyId);
      if(tbody) tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:24px;color:#6B6B6B;font-size:12px">Price data temporarily unavailable. Retrying...</td></tr>';
    });
}

function drawSparkline(slug, tbodyId){
  fetch('/api/prices/history?slug=' + slug + '&days=30')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var hist = data.history || [];
      var svg = document.getElementById('spk-' + slug + '-' + tbodyId);
      if(!svg || hist.length < 2) return;
      var w=60,h=20,pad=2;
      var cw=w-pad*2,ch=h-pad*2;
      var vals = hist.map(function(d){ return d.p; });
      var min=Math.min.apply(null,vals),max=Math.max.apply(null,vals);
      var range=max-min||1;
      var pts = vals.map(function(v,i){
        var x=pad+(i/(vals.length-1))*cw;
        var y=pad+ch-((v-min)/range)*ch;
        return x.toFixed(1)+','+y.toFixed(1);
      });
      var isUp = vals[vals.length-1] >= vals[0];
      var color = isUp ? '#16A34A' : '#DC2626';
      svg.innerHTML = '<polyline points="'+pts.join(' ')+'" fill="none" stroke="'+color+'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
    })
    .catch(function(){});
}

function initPriceBoard(){
  ebFilter = 'ALL';
  var controls = document.getElementById('ebControls');
  if(controls){
    var cats = ['ALL','Softs','Oilseeds','Grains','Specialty'];
    var html = '';
    for(var i=0;i<cats.length;i++){
      var a = cats[i]===ebFilter?' active':'';
      html += '<button class="eb-filter-btn'+a+'" onclick="ebFilter=\''+cats[i]+'\';document.querySelectorAll(\'.eb-filter-btn\').forEach(function(b){b.classList.remove(\'active\')});this.classList.add(\'active\');fetchAndRenderPrices(\'ebBody\',\'ebUpdated\')">'+cats[i]+'</button>';
    }
    controls.innerHTML = html;
  }
  fetchAndRenderPrices('ebBody','ebUpdated');
  if(ebRefreshTimer) clearInterval(ebRefreshTimer);
  ebRefreshTimer = setInterval(function(){ fetchAndRenderPrices('ebBody','ebUpdated'); }, 30000);
}

function openPriceDetail(slug){
  var catData = null;
  for(var i=0;i<DATA_ROOM.length;i++){
    if(DATA_ROOM[i].cat === slug.split('-')[0] || slug.indexOf(DATA_ROOM[i].cat) > -1){ catData=DATA_ROOM[i]; break; }
  }
  if(catData){
    sessionStorage.setItem('dataRoomCat', catData.cat);
    navigateTo('data');
  }
}

function openDrOverlay(lbl,val,desc,src) {
  document.getElementById('drOlbl').textContent = lbl;
  document.getElementById('drOval').textContent = val;
  document.getElementById('drOdesc').innerHTML = '<div class="lg-note">'+desc+'</div>';
  document.getElementById('drOsrc').textContent = src;
  document.getElementById('drOverlay').classList.add('open');
}
function closeDrOverlay() { document.getElementById('drOverlay').classList.remove('open'); }
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDrOverlay();});

var PAGE_DATA = {
  'overview': { title:'Overview', desc:'Browse all market analysis and intelligence reports covering Ethiopia&apos;s agricultural export sectors.', filter:'ALL' },
  'overview-all-articles': { title:'All Articles &amp; Market Analysis', desc:'Complete archive of market intelligence reports.', filter:'ALL' },
  'overview-latest-reports': { title:'Latest Reports', desc:'Most recent publications and market intelligence updates.', filter:'ALL' },
  'overview-data-dashboard': { title:'Data Dashboard', desc:'Export statistics and market indicators.', html:'<div class="stats-banner" style="border-radius:0"><div class="stats-banner-grid"><div class="stats-banner-item"><div class="stats-banner-label">Total Exports</div><div class="stats-banner-value">$10.7B</div><div class="stats-banner-desc">2025/26 fiscal year</div></div><div class="stats-banner-item"><div class="stats-banner-label">Coffee Revenue</div><div class="stats-banner-value">$3B</div><div class="stats-banner-desc">30% of total exports</div></div><div class="stats-banner-item"><div class="stats-banner-label">Arable Land</div><div class="stats-banner-value">74M ha</div><div class="stats-banner-desc">Diverse agro-ecological zones</div></div></div></div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:32px"><div style="padding:32px;border:1px solid var(--pastel);background:var(--off-white)"><h3 style="font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--emerald)">Coffee</h3><div style="font-size:36px;font-weight:700;margin-top:8px">$3B</div><div style="font-size:11px;color:var(--text);margin-top:4px">Export revenue 2025/26</div></div><div style="padding:32px;border:1px solid var(--pastel);background:var(--off-white)"><h3 style="font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--emerald)">Sesame</h3><div style="font-size:36px;font-weight:700;margin-top:8px">$1.2B</div><div style="font-size:11px;color:var(--text);margin-top:4px">Export revenue 2025/26</div></div><div style="padding:32px;border:1px solid var(--pastel);background:var(--off-white)"><h3 style="font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--emerald)">Teff</h3><div style="font-size:36px;font-weight:700;margin-top:8px">6.2M t</div><div style="font-size:11px;color:var(--text);margin-top:4px">Production 2025</div></div><div style="padding:32px;border:1px solid var(--pastel);background:var(--off-white)"><h3 style="font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--emerald)">Honey</h3><div style="font-size:36px;font-weight:700;margin-top:8px">65K t</div><div style="font-size:11px;color:var(--text);margin-top:4px">Annual production</div></div></div>' },
  'overview-platform-guide': { title:'Platform Guide', desc:'How to use AgroSpace Ethiopia&apos;s market intelligence tools.', html:'<div class="page-static"><div class="section"><h3>1. Browse Articles</h3><p>Use the navigation menu or tag filters to explore articles by sector.</p></div><div class="section"><h3>2. Filter by Category</h3><p>Click on tag filters (Coffee, Sesame, Teff, etc.) to view articles from specific sectors.</p></div><div class="section"><h3>3. Search</h3><p>Use the search bar in the header to find articles by keyword.</p></div><div class="section"><h3>4. Read Full Articles</h3><p>Click any article card to open the full reader view.</p></div><div class="section"><h3>5. Explore Investment</h3><p>The Investment section features a carousel of sector analyses and opportunities.</p></div></div>' },
  'products': { title:'Products', desc:'Explore Ethiopia&apos;s agricultural export sectors. Click any category to view articles.', html:'<div class="page-grid-2" style="grid-template-columns:repeat(3,1fr)"><a href="#" onclick="navigateTo(\'products-coffee\');return false" class="page-card"><div class="vignette-box"><svg viewBox="0 0 800 450" width="100%" height="100%"><rect width="800" height="450" fill="#C5DFC9"/><circle cx="400" cy="225" r="80" fill="#2E8B57" opacity="0.12"/></svg></div><h3>Coffee</h3><p>$3B export industry — birthplace of Coffea arabica</p></a><a href="#" onclick="navigateTo(\'products-sesame\');return false" class="page-card"><div class="vignette-box"><svg viewBox="0 0 800 450" width="100%" height="100%"><rect width="800" height="450" fill="#E8F0EA"/><polygon points="200,80 500,80 600,300 100,300" fill="none" stroke="#8DBC76" stroke-width="1" opacity="0.25"/></svg></div><h3>Sesame &amp; Oilseeds</h3><p>Global premium — 2nd largest exporter worldwide</p></a><a href="#" onclick="navigateTo(\'products-fruits\');return false" class="page-card"><div class="vignette-box"><svg viewBox="0 0 800 450" width="100%" height="100%"><rect width="800" height="450" fill="#C5DFC9"/><circle cx="250" cy="200" r="70" fill="#8DBC76" opacity="0.2"/></svg></div><h3>Fruits &amp; Vegetables</h3><p>Avocado exports up 240% — horticulture growing 15%/yr</p></a><a href="#" onclick="navigateTo(\'products-teff\');return false" class="page-card"><div class="vignette-box"><svg viewBox="0 0 800 450" width="100%" height="100%"><rect width="800" height="450" fill="#8DBC76" opacity="0.35"/><rect x="100" y="150" width="600" height="4" fill="#2E8B57" opacity="0.2"/></svg></div><h3>Teff &amp; Cereals</h3><p>Super grain — 6.2M tons produced in 2025</p></a><a href="#" onclick="navigateTo(\'products-spices\');return false" class="page-card"><div class="vignette-box"><svg viewBox="0 0 800 450" width="100%" height="100%"><rect width="800" height="450" fill="#1B4332"/><rect x="80" y="150" width="640" height="1" fill="#8DBC76" opacity="0.12"/></svg></div><h3>Spices &amp; Aromatics</h3><p>Korarima, berbere — exported to 35 countries</p></a><a href="#" onclick="navigateTo(\'products-honey\');return false" class="page-card"><div class="vignette-box"><svg viewBox="0 0 800 450" width="100%" height="100%"><rect width="800" height="450" fill="#E8F0EA"/><polygon points="350,100 500,100 550,250 300,250" fill="#8DBC76" opacity="0.2"/></svg></div><h3>Honey</h3><p>Africa&apos;s largest producer — 65K tons annually</p></a></div>' },
  'products-coffee': { title:'Coffee', desc:'Ethiopia is the birthplace of Coffea arabica and the largest coffee producer in Africa. The sector employs 15 million people.', filter:'COFFEE' },
  'products-sesame': { title:'Sesame &amp; Oilseeds', desc:'Ethiopia is the second-largest sesame exporter in the world. Humera sesame commands premium prices.', filter:'SESAME AND OILSEEDS' },
  'products-fruits': { title:'Fruits &amp; Vegetables', desc:'Ethiopia\'s horticulture sector is growing at 15% annually. Avocado exports grew 240% between 2020 and 2025.', filter:'FRUITS AND VEGETABLES' },
  'products-teff': { title:'Teff &amp; Cereals', desc:'Teff is Ethiopia\'s indigenous staple grain. Production reached a record 6.2 million tons in 2025.', filter:'TEFF AND CEREALS' },
  'products-spices': { title:'Spices &amp; Aromatics', desc:'Over 20 commercial spice species. Korarima, berbere, and black cumin exported to 35 countries.', filter:'SPICES AND AROMATICS' },
  'products-honey': { title:'Honey', desc:'Africa\'s largest honey producer with 65,000 tons annually. Less than 5% exported — a significant opportunity.', filter:'HONEY' },
  'supply-chain': { title:'Supply Chain', desc:'Standards, logistics, and compliance requirements for Ethiopian agricultural exports.', html:'<div class="page-grid-2" style="grid-template-columns:repeat(2,1fr);margin-bottom:40px"><a href="#" onclick="navigateTo(\'supply-chain-national-standards\');return false" class="page-card"><h3>National Standards</h3><p>Ethiopian quality and certification frameworks</p></a><a href="#" onclick="navigateTo(\'supply-chain-international-requirements\');return false" class="page-card"><h3>International Requirements</h3><p>Global standards for export compliance</p></a><a href="#" onclick="navigateTo(\'supply-chain-traceability\');return false" class="page-card"><h3>Traceability</h3><p>Blockchain and GIS mapping initiatives</p></a><a href="#" onclick="navigateTo(\'supply-chain-eudr-compliance\');return false" class="page-card"><h3>EUDR Compliance</h3><p>Deforestation regulation roadmap</p></a></div>', filter:'SUPPLY CHAIN' },
  'supply-chain-national-standards': { title:'National Standards', desc:'Ethiopia has established quality standards through the Ethiopian Standards Agency (ESA) covering grading, testing, and certification.', html:'<div class="page-static"><div class="section"><p>Coffee grading standards (Q1-Q5) based on cup quality and bean size</p></div><div class="section"><p>Sesame seed classification by purity, oil content, and moisture</p></div><div class="section"><p>Teff grading system for domestic and export markets</p></div><div class="section"><p>Honey quality standards for moisture, purity, and HMF levels</p></div><div class="section"><p>ESA certification and laboratory testing protocols</p></div></div>' },
  'supply-chain-international-requirements': { title:'International Requirements', desc:'Ethiopian exporters must comply with EU food safety regulations, US FDA requirements, and global certification schemes.', html:'<div class="page-static"><div class="section"><p>EU food safety and hygiene regulations for market access</p></div><div class="section"><p>US FDA Foreign Supplier Verification Program (FSVP)</p></div><div class="section"><p>GlobalG.A.P. certification for fresh produce</p></div><div class="section"><p>Organic certification (EU/USDA standards)</p></div><div class="section"><p>Fair Trade and Rainforest Alliance certifications</p></div></div>' },
  'supply-chain-traceability': { title:'Traceability', desc:'Blockchain and GIS-based traceability initiatives transforming Ethiopian agricultural supply chains.', html:'<div class="page-static"><div class="section"><p>Blockchain pilot programs for specialty coffee traceability</p></div><div class="section"><p>GIS mapping deployed across 1.2 million hectares</p></div><div class="section"><p>Satellite imagery for farm plot verification</p></div><div class="section"><p>Digital ledger for lot-level tracking through processing</p></div><div class="section"><p>30% premium capture for fully traceable export lots</p></div></div>' },
  'supply-chain-eudr-compliance': { title:'EUDR Compliance', desc:'The EU Deforestation Regulation requires due diligence proving deforestation-free production after December 31, 2020.', html:'<div class="page-static"><div class="section"><p>Due diligence requirements for all commodities</p></div><div class="section"><p>Geolocation data for all production plots</p></div><div class="section"><p>Risk assessment framework for deforestation-free supply chains</p></div><div class="section"><p>Timeline and phased implementation roadmap</p></div><div class="section"><p>Support programs for smallholder compliance</p></div></div>' },
  'investment': { title:'Investment', desc:'Investment opportunities in Ethiopia\'s agricultural sector — from agri-fintech to agro-processing zones.', html:'<div class="page-grid-2" style="grid-template-columns:repeat(2,1fr);margin-bottom:40px"><a href="#" onclick="navigateTo(\'investment-sector-analysis\');return false" class="page-card"><h3>Sector Analysis</h3><p>Deep dive into investment opportunities across sectors</p></a><a href="#" onclick="navigateTo(\'investment-zones-incentives\');return false" class="page-card"><h3>Zones &amp; Potential</h3><p>Industrial parks and special economic zones</p></a><a href="#" onclick="navigateTo(\'investment-challenges\');return false" class="page-card"><h3>Challenges</h3><p>Land tenure, logistics, and regulatory considerations</p></a></div>', filter:'INVESTMENT' },
  'investment-sector-analysis': { title:'Sector Analysis', desc:'Ethiopia offers 74 million hectares of arable land — one of the last great frontiers for agricultural investment.', filter:'INVESTMENT' },
  'investment-zones-incentives': { title:'Zones &amp; Potential', desc:'13 operational industrial parks including dedicated agro-processing zones with tax holidays.', filter:'INVESTMENT' },
  'investment-challenges': { title:'Challenges', desc:'Understanding land governance and infrastructure constraints is essential for successful investment.', filter:'INVESTMENT' },
  'about': { title:'About', desc:'AgroSpace Ethiopia provides market intelligence and supply chain analysis for Ethiopian agricultural exports.', html:'<div class="page-grid-2" style="grid-template-columns:repeat(2,1fr)"><a href="#" onclick="navigateTo(\'about-mission\');return false" class="page-card"><h3>Our mission</h3><p>Empowering data-driven decisions</p></a><a href="#" onclick="navigateTo(\'about-platform\');return false" class="page-card"><h3>The platform</h3><p>How our system works</p></a></div>' },
  'about-mission': { title:'Our Mission', desc:'To provide comprehensive market intelligence that empowers stakeholders across Ethiopia\'s agricultural value chain.', html:'<div class="page-static"><div class="section"><p>Deliver real-time market analysis for Ethiopian export sectors</p></div><div class="section"><p>Bridge the information gap between producers and global markets</p></div><div class="section"><p>Promote transparency in supply chain operations</p></div><div class="section"><p>Support sustainable agricultural practices through data</p></div><div class="section"><p>Facilitate investment through actionable sector insights</p></div></div>' },
  'about-platform': { title:'The Platform', desc:'A comprehensive market intelligence platform combining data analytics, supply chain tracking, and sector analysis.', html:'<div class="page-static"><div class="section"><p>Multi-sector article database with search and filter capabilities</p></div><div class="section"><p>Interactive data dashboards with export statistics</p></div><div class="section"><p>Supply chain traceability tools including EUDR compliance</p></div><div class="section"><p>Investment analysis with zone and incentive mapping</p></div><div class="section"><p>Real-time market indicators and trend tracking</p></div></div>' },
  'about-team': { title:'Team', desc:'The analysts, researchers, and technologists building Ethiopia\'s agricultural market intelligence platform.', html:'<div class="page-static"><div class="author"><div class="author-avatar">AE</div><div class="author-info"><span class="author-name">AgroSpace Ethiopia</span><span class="author-role">Market Intelligence Unit</span></div></div><div class="author"><div class="author-avatar">SK</div><div class="author-info"><span class="author-name">Saba Kebede</span><span class="author-role">Lead Analyst, Coffee Sector</span></div></div><div class="author"><div class="author-avatar">MT</div><div class="author-info"><span class="author-name">Mekdes Tilahun</span><span class="author-role">Supply Chain Researcher</span></div></div><div class="author"><div class="author-avatar">BH</div><div class="author-info"><span class="author-name">Biruk Hailu</span><span class="author-role">Data Scientist &amp; GIS Specialist</span></div></div><div class="author"><div class="author-avatar">AW</div><div class="author-info"><span class="author-name">Azeb Wondimu</span><span class="author-role">Investment &amp; Policy Analyst</span></div></div></div>' },
  'about-careers': { title:'Careers', desc:'Join our team of professionals working at the intersection of agriculture, data, and market intelligence.', html:'<div class="page-static"><div class="section"><p>Market Analyst &mdash; Coffee and beverage crops</p></div><div class="section"><p>Supply Chain Researcher &mdash; Logistics and compliance</p></div><div class="section"><p>Data Engineer &mdash; Pipeline and dashboard development</p></div><div class="section"><p>Policy Researcher &mdash; Trade and investment regulation</p></div><div class="section"><p>Communications Lead &mdash; Content and outreach</p></div></div>' },
  'data': { title:'Data Room', desc:'Export statistics, market indicators, and interactive data for Ethiopian agricultural sectors.', html:'<div id="dataroom" class="data-room"></div>' },
  'contact': { title:'Contact', desc:'Get in touch with the AgroSpace Ethiopia team.', html:'<div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-top:24px"><div><h3 style="font-size:14px;font-weight:600">Email</h3><p style="font-size:12px;color:var(--emerald);margin-top:4px">agrospace.eth@gmail.com</p></div><div><h3 style="font-size:14px;font-weight:600">Location</h3><p style="font-size:12px;color:var(--text);margin-top:4px">Addis Ababa, Ethiopia</p></div></div><div style="margin-top:32px;padding:32px;border:1px solid var(--pastel);border-radius:12px"><div style="display:flex;align-items:center;gap:12px;margin-bottom:20px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><h3 style="font-size:14px;font-weight:600">Send a message</h3></div><div style="display:grid;gap:16px"><input type="text" placeholder="Your name" style="padding:12px 16px;border:1px solid var(--pastel);border-radius:10px;font-family:Jost;font-size:12px;outline:none;transition:border-color 0.3s" onfocus="this.style.borderColor=\'var(--emerald)\'" onblur="this.style.borderColor=\'\'"><input type="email" placeholder="Your email" style="padding:12px 16px;border:1px solid var(--pastel);border-radius:10px;font-family:Jost;font-size:12px;outline:none;transition:border-color 0.3s" onfocus="this.style.borderColor=\'var(--emerald)\'" onblur="this.style.borderColor=\'\'"><textarea placeholder="Your message" rows="5" style="padding:12px 16px;border:1px solid var(--pastel);border-radius:10px;font-family:Jost;font-size:12px;outline:none;resize:vertical;transition:border-color 0.3s" onfocus="this.style.borderColor=\'var(--emerald)\'" onblur="this.style.borderColor=\'\'"></textarea><button style="padding:12px 24px;background:var(--emerald);color:var(--white);border:none;border-radius:10px;font-family:Jost;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;cursor:pointer;width:fit-content;transition:background 0.3s" onmouseover="this.style.background=\'#1B4332\'" onmouseout="this.style.background=\'\'">Send message</button></div></div>' }
};

function navigateTo(pageId) {
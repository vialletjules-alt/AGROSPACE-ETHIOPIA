function getPtRegion(cat,label){return (REGION_SOURCE[cat]&&REGION_SOURCE[cat][label])?REGION_SOURCE[cat][label].r:National;}

function getPtSourceType(cat,label){return (REGION_SOURCE[cat]&&REGION_SOURCE[cat][label])?REGION_SOURCE[cat][label].st:official;}

function getAllRegions(cat){var r={};if(!REGION_SOURCE[cat])return["National"];for(var k in REGION_SOURCE[cat]){var v=REGION_SOURCE[cat][k].r;v.split("/").forEach(function(x){r[x.trim()]=1;});}var a=[];for(var x in r)a.push(x);return a.sort();}

function getAllYears(data){var y={};for(var i=0;i<data.length;i++){for(var j=0;j<data[i].pts.length;j++){if(data[i].pts[j].y)y[data[i].pts[j].y]=1;}}var a=[];for(var x in y)a.push(x);return a.sort();}

  {cat:'coffee',cl:'Coffee',svg:'<circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="1.5"/>',pts:[{l:'Production 2024/25',v:'8.5M bags (510K t)',d:'Total coffee production — 60% washed, 40% natural',s:'USDA FAS',y:'2025'},{l:'Arabica Share',v:'100%',d:'Ethiopia produces exclusively Coffea arabica',s:'ICO',y:'2025'},{l:'Export Volume 2024/25',v:'4.2M bags',d:'Total export volume (green bean equivalent)',s:'NBE',y:'2025'},{l:'Export Revenue 2025/26',v:'$3B',d:'Record annual coffee export earnings',s:'NBE',y:'2026'},{l:'Smallholder Farmers',v:'5M+',d:'Estimated number of coffee-growing households',s:'CSA',y:'2024'},{l:'Coffee Area',v:'800K ha',d:'Total land under coffee cultivation',s:'CSA',y:'2024'},{l:'Specialty Share',v:'35%',d:'Share of exports meeting specialty grade (SCA 80+)',s:'ECX',y:'2025'},{l:'Average Yield',v:'0.6 t/ha',d:'Low yield due to aging trees and traditional practices',s:'FAO',y:'2024'},{l:'Local Consumption',v:'50%',d:'Approximately half of production is consumed domestically',s:'ICO',y:'2024'},{l:'Export Price Avg 2025',v:'$7.20/kg',d:'Average FOB price for Ethiopian green coffee',s:'ECX',y:'2025'},{l:'Disease Loss',v:'15%',d:'Estimated annual loss to coffee berry disease (CBD)',s:'EIAR',y:'2024'},{l:'Organic Certified',v:'75K ha',d:'Certified organic coffee production area',s:'IFOAM',y:'2024'},{l:'Forest Coffee Share',v:'35%',d:'Share of production from forest and semi-forest systems',s:'CSA',y:'2024'},{l:'Garden Coffee Share',v:'50%',d:'Share from garden coffee systems (with enset, crops)',s:'CSA',y:'2024'},{l:'State Farms Share',v:'5%',d:'Share from state-owned coffee plantations',s:'CSA',y:'2024'}]},
  {cat:'sesame',cl:'Sesame',svg:'<polygon points="15,40 30,5 45,40" fill="none" stroke="currentColor" stroke-width="1.5"/>',pts:[{l:'Production 2024/25',v:'650K t',d:'Total sesame seed production',s:'USDA FAS',y:'2025'},{l:'Export Volume',v:'500K t',d:'Annual sesame export volume',s:'ITC Trademap',y:'2025'},{l:'Export Revenue',v:'$1.2B',d:'Foreign exchange from sesame exports',s:'NBE',y:'2025'},{l:'Global Rank',v:'#2',d:'Second largest sesame exporter after Sudan',s:'ITC Trademap',y:'2025'},{l:'Humera Premium',v:'+20%',d:'Humera-type sesame commands 20% above benchmark',s:'ECX',y:'2025'},{l:'Growing Zones',v:'Tigray, Amhara, Oromia',d:'Three main producing regions',s:'CSA',y:'2024'},{l:'Smallholder Share',v:'90%',d:'Share of production from smallholder farmers',s:'CSA',y:'2024'},{l:'Oil Content',v:'50-55%',d:'Average seed oil content (high quality)',s:'EIAR',y:'2024'},{l:'Main Markets',v:'China, Israel, Turkey, Japan',d:'Largest export destinations',s:'ITC Trademap',y:'2025'},{l:'Yield Avg',v:'0.8 t/ha',d:'Average yield per hectare',s:'FAO',y:'2024'}]},
  {cat:'teff',cl:'Teff &amp; Cereals',svg:'<rect x="10" y="25" width="40" height="2" fill="currentColor" opacity="0.4"/><rect x="15" y="30" width="30" height="2" fill="currentColor" opacity="0.3"/><rect x="12" y="35" width="36" height="2" fill="currentColor" opacity="0.2"/>',pts:[{l:'Teff Production 2025',v:'6.2M t',d:'Record annual teff grain production',s:'CSA',y:'2025'},{l:'Teff Area',v:'3M ha',d:'Total land under teff cultivation',s:'CSA',y:'2025'},{l:'Teff Share of Cereals',v:'28%',d:'Teff as percentage of total cereal production',s:'CSA',y:'2025'},{l:'Total Cereal Production',v:'24M t',d:'All cereals including teff, maize, wheat, barley, sorghum',s:'CSA',y:'2025'},{l:'Maize Production',v:'11M t',d:'Largest cereal crop by volume',s:'CSA',y:'2025'},{l:'Wheat Production',v:'7M t',d:'Second-largest cereal, growing rapidly',s:'CSA',y:'2025'},{l:'Sorghum Production',v:'5M t',d:'Key drought-resistant staple',s:'CSA',y:'2025'},{l:'Teff Yield',v:'1.7 t/ha',d:'Improved variety yields up to 2.5 t/ha',s:'EIAR',y:'2025'},{l:'Teff Export 2025',v:'85K t',d:'Export volume (less than 2% of production)',s:'ITC Trademap',y:'2025'},{l:'Injera Consumption',v:'60% daily',d:'Percentage of population consuming injera daily',s:'CSA',y:'2024'}]},
  {cat:'honey',cl:'Honey',svg:'<polygon points="15,35 30,10 45,35" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="35" x2="15" y2="45" stroke="currentColor" stroke-width="1"/><line x1="45" y1="35" x2="45" y2="45" stroke="currentColor" stroke-width="1"/>',pts:[{l:'Annual Production',v:'65K t',d:'Total honey production — largest in Africa',s:'FAO',y:'2024'},{l:'Africa Rank',v:'#1',d:'Largest honey producer on the continent',s:'FAO',y:'2024'},{l:'Global Rank',v:'#10',d:'Among global honey producers',s:'FAO',y:'2024'},{l:'Export Volume',v:'<3K t',d:'Less than 5% of production exported',s:'ITC Trademap',y:'2025'},{l:'Beehives',v:'2M+',d:'Estimated managed beehives (traditional + modern)',s:'CSA',y:'2024'},{l:'Beekeepers',v:'1.5M',d:'Estimated number of beekeeping households',s:'CSA',y:'2024'},{l:'White Honey Premium',v:'+40%',d:'Premium for high-grade white honey in export markets',s:'EIAR',y:'2024'},{l:'Wax Production',v:'5K t',d:'Annual beeswax production (export commodity)',s:'FAO',y:'2024'}]},
  {cat:'spices',cl:'Spices',svg:'<circle cx="20" cy="25" r="4" fill="currentColor" opacity="0.4"/><circle cx="30" cy="20" r="3" fill="currentColor" opacity="0.3"/><circle cx="35" cy="30" r="5" fill="currentColor" opacity="0.25"/><circle cx="25" cy="35" r="3.5" fill="currentColor" opacity="0.2"/>',pts:[{l:'Commercial Species',v:'20+',d:'Number of commercially traded spice species',s:'EIAR',y:'2024'},{l:'Export Revenue',v:'$120M',d:'Annual spice export earnings',s:'NBE',y:'2025'},{l:'Korarima Production',v:'15K t',d:'Ethiopian cardamom production (Aframomum corrorima)',s:'CSA',y:'2024'},{l:'Black Cumin Export',v:'8K t',d:'Nigella sativa seed export volume',s:'ITC Trademap',y:'2025'},{l:'Berbere Export',v:'2K t',d:'Processed spice blend export volume',s:'ITC Trademap',y:'2025'},{l:'Growing Regions',v:'SNNP, Oromia, Amhara',d:'Main spice-producing regions',s:'CSA',y:'2024'},{l:'Export Growth',v:'+15% YoY',d:'Export value growth rate for spices',s:'NBE',y:'2025'},{l:'Destination Countries',v:'35',d:'Number of countries importing Ethiopian spices',s:'ITC Trademap',y:'2025'}]},
  {cat:'fruits',cl:'Fruits &amp; Veg',svg:'<circle cx="20" cy="25" r="8" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="35" cy="22" r="6" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="28" cy="35" r="5" fill="none" stroke="currentColor" stroke-width="0.8"/>',pts:[{l:'Sector Growth',v:'+15% YoY',d:'Annual horticulture export growth rate',s:'NBE',y:'2025'},{l:'Avocado Export Growth',v:'+240%',d:'Growth in avocado export volume 2020-2025',s:'ITC Trademap',y:'2025'},{l:'Avocado Production',v:'150K t',d:'Total avocado production',s:'CSA',y:'2025'},{l:'Cut Flowers Rank',v:'#2 Africa',d:'Second largest cut flower exporter in Africa (after Kenya)',s:'ITC Trademap',y:'2025'},{l:'Fresh Fruit Export',v:'$250M',d:'Annual fresh fruit export value',s:'NBE',y:'2025'},{l:'Vegetable Export',v:'$180M',d:'Annual vegetable export value (incl. frozen)',s:'NBE',y:'2025'},{l:'Irrigated Area',v:'2.5M ha',d:'Estimated irrigable land for horticulture',s:'MoA',y:'2024'},{l:'HH Farmers',v:'200K+',d:'Households engaged in horticulture export',s:'CSA',y:'2024'}]},
  {cat:'livestock',cl:'Livestock',svg:'<rect x="15" y="20" rx="4" width="12" height="18" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="30" y="15" rx="3" width="14" height="23" fill="none" stroke="currentColor" stroke-width="1"/>',pts:[{l:'Cattle Herd',v:'70M head',d:'Largest cattle herd in Africa',s:'CSA',y:'2024'},{l:'Sheep &amp; Goats',v:'80M head',d:'Combined sheep and goat population',s:'CSA',y:'2024'},{l:'Camels',v:'2.5M head',d:'Largest camel herd outside Horn of Africa',s:'CSA',y:'2024'},{l:'Poultry',v:'60M birds',d:'Estimated poultry population (mostly indigenous)',s:'CSA',y:'2024'},{l:'Milk Production',v:'5B L/year',d:'Annual milk production (90% from traditional systems)',s:'FAO',y:'2024'},{l:'Meat Production',v:'1.5M t',d:'Annual meat production (beef, mutton, goat, camel)',s:'FAO',y:'2024'},{l:'Export Revenue',v:'$450M',d:'Livestock and livestock product export earnings',s:'NBE',y:'2025'},{l:'Live Animal Export',v:'2M head',d:'Annual live animal export to Middle East (incl. informal)',s:'ITC Trademap',y:'2025'},{l:'Leather Export',v:'$150M',d:'Processed leather and leather goods export',s:'NBE',y:'2025'},{l:'Pastoralist Population',v:'12M',d:'Estimated population relying primarily on livestock',s:'CSA',y:'2024'}]},
  {cat:'trade',cl:'Trade &amp; Economy',svg:'<rect x="10" y="30" width="10" height="15" fill="currentColor" opacity="0.3"/><rect x="23" y="20" width="10" height="25" fill="currentColor" opacity="0.4"/><rect x="36" y="25" width="10" height="20" fill="currentColor" opacity="0.35"/>',pts:[{l:'Total Exports 2025/26',v:'$10.7B',d:'Record annual export earnings',s:'NBE',y:'2026'},{l:'Export Growth YoY',v:'+29%',d:'Year-over-year increase in total exports',s:'NBE',y:'2026'},{l:'Coffee Share',v:'30%',d:'Coffee percentage of total export earnings',s:'NBE',y:'2026'},{l:'Gold Share',v:'20%',d:'Gold as share of total exports (~$2.1B)',s:'NBE',y:'2026'},{l:'Sesame Share',v:'11%',d:'Sesame as share of total exports (~$1.2B)',s:'NBE',y:'2026'},{l:'China Trade',v:'$7B+',d:'Bilateral trade with China (exports + imports)',s:'IMF DOTS',y:'2025'},{l:'Top Export Destination',v:'China',d:'Largest single export destination',s:'ITC Trademap',y:'2025'},{l:'EU Export Share',v:'25%',d:'Share of exports destined for the European Union',s:'ITC Trademap',y:'2025'},{l:'Trade Deficit',v:'-$15B',d:'Estimated annual merchandise trade deficit',s:'NBE',y:'2025'},{l:'Foreign Reserves',v:'$3.5B',d:'Gross international reserves (approx.1.5 months imports)',s:'IMF',y:'2025'},{l:'Inflation (Food)',v:'25%',d:'Food inflation rate (headline CPI ~20%)',s:'CSA',y:'2025'},{l:'GDP Growth',v:'6.5%',d:'Real GDP growth rate (2024/25 estimate)',s:'IMF WEO',y:'2025'}]},
  {cat:'land',cl:'Land &amp; Env.',svg:'<rect x="10" y="20" width="40" height="25" rx="2" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M15 28 Q30 35 45 28" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>',pts:[{l:'Total Area',v:'1.1M km²',d:'Ethiopia is the 27th largest country by area',s:'CSA',y:'2024'},{l:'Arable Land',v:'74M ha',d:'Total arable land potential (currently ~20M used)',s:'MoA',y:'2024'},{l:'Cultivated Area',v:'20M ha',d:'Total land currently under cultivation',s:'CSA',y:'2024'},{l:'Agro-ecological Zones',v:'18',d:'Distinct farming systems across altitude/climate zones',s:'EIAR',y:'2024'},{l:'Highland Share',v:'45%',d:'Land area above 1,500m where most crops are grown',s:'CSA',y:'2024'},{l:'Irrigation Potential',v:'5M ha',d:'Land suitable for irrigation (currently <1M developed)',s:'MoA',y:'2024'},{l:'Irrigated Area',v:'900K ha',d:'Currently irrigated agricultural land',s:'CSA',y:'2024'},{l:'Forest Cover',v:'15%',d:'Percentage of land area under forest (17.3M ha)',s:'FAO',y:'2024'},{l:'Rainfall (Highlands)',v:'1,200-2,500mm/yr',d:'Annual rainfall range in main agricultural zones',s:'NMA',y:'2024'},{l:'Rainfall (Lowlands)',v:'200-600mm/yr',d:'Annual rainfall in pastoral and agro-pastoral zones',s:'NMA',y:'2024'}]},
  {cat:'demo',cl:'Demographics',svg:'<circle cx="30" cy="22" r="8" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M15 42 Q15 32 22 28 Q30 24 38 28 Q45 32 45 42" fill="none" stroke="currentColor" stroke-width="1"/>',pts:[{l:'Population 2025',v:'132M',d:'Estimated total population (2nd most populous in Africa)',s:'CSA',y:'2025'},{l:'Rural Share',v:'78%',d:'Percentage of population living in rural areas',s:'CSA',y:'2025'},{l:'Ag Labor Force',v:'70%',d:'Share of labor force employed in agriculture',s:'World Bank',y:'2024'},{l:'Under 25 Share',v:'60%',d:'Percentage of population under age 25',s:'CSA',y:'2025'},{l:'Farm Size Avg',v:'<1 ha',d:'Average smallholder farm size',s:'CSA',y:'2024'},{l:'Food Insecure',v:'20M',d:'Estimated population facing acute food insecurity',s:'WFP',y:'2025'},{l:'Population Growth',v:'2.5%/yr',d:'Annual population growth rate',s:'CSA',y:'2025'},{l:'Urbanization Rate',v:'4.5%/yr',d:'Annual urban growth rate (fastest in Africa)',s:'World Bank',y:'2025'}]},
  {cat:'other',cl:'Other Commodities',svg:'<polygon points="20,15 35,15 40,30 15,30" fill="none" stroke="currentColor" stroke-width="1.2"/><line x1="27" y1="20" x2="27" y2="35" stroke="currentColor" stroke-width="0.8"/>',pts:[{l:'Khat Production',v:'350K t',d:'Estimated annual khat (chat) leaf production',s:'CSA',y:'2024'},{l:'Khat Export Revenue',v:'$400M',d:'Estimated annual export earnings from khat',s:'NBE',y:'2025'},{l:'Sugar Production',v:'500K t',d:'Refined sugar production (from state-owned factories)',s:'Sugar Corp',y:'2025'},{l:'Cut Flower Export',v:'$350M',d:'Annual cut flower export value',s:'NBE',y:'2025'},{l:'Cotton Production',v:'60K t',d:'Annual cotton fiber production',s:'CSA',y:'2024'},{l:'Cotton Import',v:'$50M',d:'Cotton and textile raw material imports',s:'ITC Trademap',y:'2025'}]}
];

var SEASONS = [
  {c:'Teff',g:'Cereals',r:'Amhara, Oromia, SNNP',sw:[7,8],hv:[11,12]},
  {c:'Maize (Meher)',g:'Cereals',r:'Oromia, Amhara, SNNP',sw:[6,7],hv:[10,12]},
  {c:'Maize (Belg)',g:'Cereals',r:'SNNP, Oromia',sw:[3,4],hv:[7,8]},
  {c:'Wheat',g:'Cereals',r:'Oromia, Amhara, Tigray',sw:[6,7],hv:[10,11]},
  {c:'Barley',g:'Cereals',r:'Amhara, Oromia, Tigray',sw:[6,7],hv:[10,11]},
  {c:'Sorghum (Meher)',g:'Cereals',r:'Amhara, Tigray, Oromia',sw:[6,7],hv:[11,12]},
  {c:'Chickpeas',g:'Pulses',r:'Amhara, Oromia, SNNP',sw:[8,9],hv:[12,1]},
  {c:'Lentils',g:'Pulses',r:'Amhara, Oromia',sw:[7,8],hv:[11,12]},
  {c:'Faba Beans',g:'Pulses',r:'Amhara, Oromia, Tigray',sw:[6,7],hv:[10,11]},
  {c:'Haricot Beans',g:'Pulses',r:'Amhara, Oromia, SNNP',sw:[7,8],hv:[10,11]},
  {c:'Sesame',g:'Oilseeds',r:'Tigray, Amhara, Oromia',sw:[6,7],hv:[10,11]},
  {c:'Groundnuts',g:'Oilseeds',r:'Oromia, Amhara, Tigray',sw:[6,7],hv:[10,11]},
  {c:'Coffee Arabica',g:'Cash Crops',r:'Oromia, SNNP, Sidama',hv:[10,1],note:'Perennial'},
  {c:'Cotton',g:'Cash Crops',r:'Amhara, Oromia, Afar',sw:[6,7],hv:[11,1]},
  {c:'Sugarcane',g:'Cash Crops',r:'Afar, Amhara, SNNP',note:'12-18mo cycle, year-round harvest'},
  {c:'Avocado',g:'Fruits',r:'SNNP, Oromia',hv:[5,9],note:'Perennial'},
  {c:'Mango',g:'Fruits',r:'SNNP, Oromia, Afar',hv:[5,8],note:'Perennial'},
  {c:'Banana',g:'Fruits',r:'SNNP, Oromia',note:'Perennial, year-round harvest'},
  {c:'Grapes',g:'Fruits',r:'Tigray, Amhara',hv:[8,10]},
  {c:'Khat',g:'Cash Crops',r:'Oromia, SNNP',note:'Year-round harvest'},
];
var SEASONS_CATS = ['Cereals','Pulses','Oilseeds','Cash Crops','Fruits'];
var REGION_SOURCE = {
  coffee:{
    'Production 2024/25':{r:'Oromia/SNNP/Sidama',st:'official'},'Arabica Share':{r:'National',st:'official'},'Export Volume 2024/25':{r:'National',st:'official'},'Export Revenue 2025/26':{r:'National',st:'official'},'Smallholder Farmers':{r:'National',st:'official'},'Coffee Area':{r:'Oromia/SNNP',st:'official'},'Specialty Share':{r:'Sidama/Yirgacheffe',st:'estimate'},'Average Yield':{r:'National',st:'official'},'Local Consumption':{r:'National',st:'estimate'},'Export Price Avg 2025':{r:'National',st:'official'},'Disease Loss':{r:'National',st:'estimate'},'Organic Certified':{r:'Sidama/Yirgacheffe',st:'official'},
    'Forest Coffee Share':{r:'Kaffa/Bench-Maji',st:'estimate'},'Garden Coffee Share':{r:'Sidama/SNNP',st:'estimate'},'State Farms Share':{r:'National',st:'official'}
  },
  sesame:{
    'Production 2024/25':{r:'Tigray/Amhara',st:'official'},'Export Volume':{r:'National',st:'official'},'Export Revenue':{r:'National',st:'official'},'Global Rank':{r:'National',st:'official'},'Humera Premium':{r:'Tigray/Humera',st:'estimate'},'Growing Zones':{r:'Tigray/Amhara/Oromia',st:'official'},'Smallholder Share':{r:'National',st:'official'},'Oil Content':{r:'National',st:'official'},'Main Markets':{r:'National',st:'official'},'Yield Avg':{r:'National',st:'official'}
  },
  teff:{
    'Teff Production 2025':{r:'Amhara/Oromia',st:'official'},'Teff Area':{r:'Amhara/Oromia/SNNP',st:'official'},'Teff Share of Cereals':{r:'National',st:'official'},'Total Cereal Production':{r:'National',st:'official'},'Maize Production':{r:'Oromia/Amhara',st:'official'},'Wheat Production':{r:'Oromia/Amhara',st:'official'},'Sorghum Production':{r:'Amhara/Tigray',st:'official'},'Teff Yield':{r:'National',st:'estimate'},'Teff Export 2025':{r:'National',st:'official'},'Injera Consumption':{r:'National',st:'estimate'}
  },
  honey:{
    'Annual Production':{r:'Tigray/SNNP',st:'official'},'Africa Rank':{r:'National',st:'official'},'Global Rank':{r:'National',st:'official'},'Export Volume':{r:'National',st:'official'},'Beehives':{r:'National',st:'estimate'},'Beekeepers':{r:'National',st:'estimate'},'White Honey Premium':{r:'Tigray',st:'estimate'},'Wax Production':{r:'National',st:'official'}
  },
  spices:{
    'Commercial Species':{r:'National',st:'official'},'Export Revenue':{r:'National',st:'official'},'Korarima Production':{r:'SNNP/Bale',st:'official'},'Black Cumin Export':{r:'Amhara/SNNP',st:'official'},'Berbere Export':{r:'National',st:'official'},'Growing Regions':{r:'SNNP/Oromia/Amhara',st:'official'},'Export Growth':{r:'National',st:'official'},'Destination Countries':{r:'National',st:'official'}
  },
  fruits:{
    'Sector Growth':{r:'National',st:'official'},'Avocado Export Growth':{r:'SNNP/Oromia',st:'official'},'Avocado Production':{r:'SNNP/Oromia',st:'official'},'Cut Flowers Rank':{r:'National',st:'official'},'Fresh Fruit Export':{r:'National',st:'official'},'Vegetable Export':{r:'National',st:'official'},'Irrigated Area':{r:'Rift Valley',st:'official'},'HH Farmers':{r:'National',st:'official'}
  },
  livestock:{
    'Cattle Herd':{r:'Oromia/Amhara/SNNP',st:'official'},'Sheep & Goats':{r:'Somali/Afar/Oromia',st:'official'},'Camels':{r:'Somali/Afar',st:'official'},'Poultry':{r:'National',st:'estimate'},'Milk Production':{r:'National',st:'official'},'Meat Production':{r:'National',st:'official'},'Export Revenue':{r:'National',st:'official'},'Live Animal Export':{r:'Somali/Afar',st:'official'},'Leather Export':{r:'National',st:'official'},'Pastoralist Population':{r:'Somali/Afar/Oromia',st:'estimate'}
  },
  trade:{
    'Total Exports 2025/26':{r:'National',st:'official'},'Export Growth YoY':{r:'National',st:'official'},'Coffee Share':{r:'National',st:'official'},'Gold Share':{r:'National',st:'official'},'Sesame Share':{r:'National',st:'official'},'China Trade':{r:'National',st:'official'},'Top Export Destination':{r:'National',st:'official'},'EU Export Share':{r:'National',st:'official'},'Trade Deficit':{r:'National',st:'official'},'Foreign Reserves':{r:'National',st:'official'},'Inflation (Food)':{r:'National',st:'official'},'GDP Growth':{r:'National',st:'estimate'}
  },
  land:{
    'Total Area':{r:'National',st:'official'},'Arable Land':{r:'National',st:'official'},'Cultivated Area':{r:'National',st:'official'},'Agro-ecological Zones':{r:'National',st:'official'},'Highland Share':{r:'National',st:'official'},'Irrigation Potential':{r:'National',st:'estimate'},'Irrigated Area':{r:'National',st:'official'},'Forest Cover':{r:'National',st:'official'},'Rainfall (Highlands)':{r:'Highlands',st:'official'},'Rainfall (Lowlands)':{r:'Lowlands',st:'official'}
  },
  demo:{
    'Population 2025':{r:'National',st:'official'},'Rural Share':{r:'National',st:'official'},'Ag Labor Force':{r:'National',st:'official'},'Under 25 Share':{r:'National',st:'official'},'Farm Size Avg':{r:'National',st:'official'},'Food Insecure':{r:'Tigray/Amhara/Somali',st:'estimate'},'Population Growth':{r:'National',st:'official'},'Urbanization Rate':{r:'National',st:'estimate'}
  },
  other:{
    'Khat Production':{r:'Oromia/SNNP',st:'estimate'},'Khat Export Revenue':{r:'National',st:'estimate'},'Sugar Production':{r:'Afar/Amhara',st:'official'},'Cut Flower Export':{r:'National',st:'official'},'Cotton Production':{r:'Amhara/Oromia',st:'official'},'Cotton Import':{r:'National',st:'official'}
  }
};
function getPtRegion(cat,label){return (REGION_SOURCE[cat]&&REGION_SOURCE[cat][label])?REGION_SOURCE[cat][label].r:'National';}
function getPtSourceType(cat,label){return (REGION_SOURCE[cat]&&REGION_SOURCE[cat][label])?REGION_SOURCE[cat][label].st:'official';}
function getAllRegions(cat){var r={};if(!REGION_SOURCE[cat])return['National'];for(var k in REGION_SOURCE[cat]){var v=REGION_SOURCE[cat][k].r;v.split('/').forEach(function(x){r[x.trim()]=1;});}var a=[];for(var x in r)a.push(x);return a.sort();}
function getAllYears(data){var y={};for(var i=0;i<data.length;i++){for(var j=0;j<data[i].pts.length;j++){if(data[i].pts[j].y)y[data[i].pts[j].y]=1;}}var a=[];for(var x in y)a.push(x);return a.sort();}

var DATA_ILLS = {
  coffee:'<circle cx="30" cy="25" r="14" fill="none" stroke="currentColor" stroke-width="1"/><path d="M20 35 L24 42 L36 42 L40 35" fill="none" stroke="currentColor" stroke-width="0.8"/><path d="M28 42 L28 48 M32 42 L32 48" stroke="currentColor" stroke-width="0.6"/>',
  sesame:'<polygon points="15,38 30,7 45,38" fill="none" stroke="currentColor" stroke-width="1"/><line x1="30" y1="7" x2="30" y2="45" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>',
  teff:'<rect x="10" y="28" width="40" height="1.5" fill="currentColor" opacity="0.3"/><rect x="14" y="32" width="32" height="1.5" fill="currentColor" opacity="0.25"/><rect x="12" y="36" width="36" height="1.5" fill="currentColor" opacity="0.2"/><rect x="18" y="40" width="24" height="1.5" fill="currentColor" opacity="0.15"/>',
  honey:'<polygon points="15,38 30,7 45,38" fill="none" stroke="currentColor" stroke-width="1"/><line x1="30" y1="7" x2="30" y2="45" stroke="currentColor" stroke-width="0.5" opacity="0.3"/><circle cx="30" cy="25" r="8" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>',
  spices:'<circle cx="20" cy="25" r="5" fill="currentColor" opacity="0.4"/><circle cx="30" cy="20" r="4" fill="currentColor" opacity="0.3"/><circle cx="35" cy="30" r="6" fill="currentColor" opacity="0.25"/><circle cx="25" cy="35" r="4" fill="currentColor" opacity="0.2"/>',
  fruits:'<circle cx="20" cy="25" r="10" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="35" cy="22" r="7" fill="none" stroke="currentColor" stroke-width="0.8"/><circle cx="28" cy="36" r="6" fill="none" stroke="currentColor" stroke-width="0.6"/>',
  livestock:'<rect x="16" y="18" rx="3" width="12" height="22" fill="none" stroke="currentColor" stroke-width="1"/><rect x="32" y="12" rx="2" width="12" height="28" fill="none" stroke="currentColor" stroke-width="1"/>',
  trade:'<rect x="10" y="30" width="10" height="15" fill="currentColor" opacity="0.25"/><rect x="23" y="20" width="10" height="25" fill="currentColor" opacity="0.35"/><rect x="36" y="25" width="10" height="20" fill="currentColor" opacity="0.3"/>',
  land:'<rect x="12" y="18" width="36" height="26" rx="2" fill="none" stroke="currentColor" stroke-width="1"/><path d="M18 28 Q30 34 42 28" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>',
  demo:'<circle cx="30" cy="20" r="10" fill="none" stroke="currentColor" stroke-width="1"/><path d="M14 44 Q14 32 22 28 Q30 24 38 28 Q46 32 46 44" fill="none" stroke="currentColor" stroke-width="1"/>',
  other:'<polygon points="20,15 40,15 45,30 15,30" fill="none" stroke="currentColor" stroke-width="1"/><line x1="30" y1="18" x2="30" y2="38" stroke="currentColor" stroke-width="0.7"/>'
};

var DATA_CAT_ORDER = ['coffee','sesame','teff','honey','spices','fruits','livestock','trade','land','demo','other'];

var savedView = JSON.parse(localStorage.getItem('drSavedView') || 'null');
var hiddenCats = JSON.parse(localStorage.getItem('drHiddenCats') || '[]');
var drRegionFilter = '';
var drYearFilter = '';

function getFilteredPts(catData){
  var pts = [];
  for(var i=0;i<catData.pts.length;i++){
    var p=catData.pts[i];
    var region=getPtRegion(catData.cat,p.l);
    if(drRegionFilter && region.indexOf(drRegionFilter)===-1) continue;
    if(drYearFilter && p.y!==drYearFilter) continue;
    pts.push(p);
  }
  return pts;
}

function renderDataRoom(targetId) {
  if (!targetId) targetId = 'dataroom';
  var cats = DATA_ROOM;
  var active = sessionStorage.getItem('dataRoomCat') || 'coffee';
  var catData = null;
  for (var i = 0; i < cats.length; i++) { if (cats[i].cat === active) { catData = cats[i]; break; } }
  if (!catData) catData = cats[0];
  var totalPts = 0;
  for (var i = 0; i < cats.length; i++) totalPts += cats[i].pts.length;

  var filteredPts = getFilteredPts(catData);
  var allYears = getAllYears(cats);
  var allRegions = getAllRegions(catData.cat);

  var metaHtml = '<div class="dr-meta" style="display:flex;gap:0;border:1px solid #DCE3D8;border-radius:10px;overflow:hidden;margin-bottom:28px;background:var(--white)">' +
    '<div class="dr-meta-item" style="flex:1;padding:14px 20px;display:flex;align-items:baseline;gap:8px;border-right:1px solid #DCE3D8"><span style="font-size:20px;font-weight:700;color:#1A1A1A">' + totalPts + '</span><span style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6B6B6B;font-weight:600">Data points</span></div>' +
    '<div class="dr-meta-item" style="flex:1;padding:14px 20px;display:flex;align-items:baseline;gap:8px;border-right:1px solid #DCE3D8"><span style="font-size:20px;font-weight:700;color:#1A1A1A">' + cats.length + '</span><span style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6B6B6B;font-weight:600">Categories</span></div>' +
    '<div class="dr-meta-item" style="flex:1;padding:14px 20px;display:flex;align-items:baseline;gap:8px;border-right:1px solid #DCE3D8"><span style="font-size:20px;font-weight:700;color:#1A1A1A">12+</span><span style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6B6B6B;font-weight:600">Institutional sources</span></div>' +
    '<div class="dr-meta-item" style="flex:1;padding:14px 20px;display:flex;align-items:baseline;gap:8px"><span style="font-size:20px;font-weight:700;color:#1A1A1A">' + filteredPts.length + '</span><span style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6B6B6B;font-weight:600">Visible</span></div></div>';

  var exportBar = '<div class="dr-export-bar">' +
    '<span style="font-size:10px;color:#6B6B6B;font-weight:500;margin-right:auto">' + filteredPts.length + ' data point' + (filteredPts.length!==1?'s':'') + ' visible</span>' +
    '<button class="dr-export-btn" onclick="exportDataAsCSV(\'' + catData.cat + '\')">Export CSV</button>' +
    '<button class="dr-save-btn' + (savedView ? ' saved' : '') + '" onclick="saveCurrentView()" id="drSaveBtn">' + (savedView ? 'View Saved' : 'Save View') + '</button>' +
    '</div>';

  var pillsHtml = '<div class="dr-pills">';
  for (var i = 0; i < cats.length; i++) {
    var a = cats[i].cat === active ? ' active' : '';
    var cleanLabel = cats[i].cl.replace(/<[^>]+>/g, '');
    pillsHtml += '<div class="dr-pill' + a + '" onclick="switchDataCat(\'' + cats[i].cat + '\')"><span>' + cleanLabel + '</span><span class="count">' + cats[i].pts.length + '</span></div>';
  }
  pillsHtml += '</div>';

  var toggleRow = '<div class="dr-toggle-row">';
  for(var i=0;i<cats.length;i++){
    var cl=cats[i].cl.replace(/<[^>]+>/g,'');
    var h=hiddenCats.indexOf(cats[i].cat)>-1?' hidden-cat':'';
    toggleRow += '<span class="dr-toggle-cat' + h + '" onclick="toggleCat(\'' + cats[i].cat + '\')" data-cat="' + cats[i].cat + '">' + cl + ' <span class="count">' + cats[i].pts.length + '</span></span>';
  }
  toggleRow += '</div>';

  var filterRow = '<div class="dr-filters">' +
    '<label style="font-size:10px;font-weight:600;color:#6B6B6B;letter-spacing:.05em;text-transform:uppercase">Filter by</label>' +
    '<select class="dr-filter-select" onchange="drRegionFilter=this.value;renderDataRoom()">' +
    '<option value="">All Regions</option>';
  for(var ri=0;ri<allRegions.length;ri++){
    var sel=drRegionFilter===allRegions[ri]?' selected':'';
    filterRow += '<option value="' + allRegions[ri] + '"' + sel + '>' + allRegions[ri] + '</option>';
  }
  filterRow += '</select>' +
    '<select class="dr-filter-select" onchange="drYearFilter=this.value;renderDataRoom()">' +
    '<option value="">All Years</option>';
  for(var yi=0;yi<allYears.length;yi++){
    var sel=drYearFilter===allYears[yi]?' selected':'';
    filterRow += '<option value="' + allYears[yi] + '"' + sel + '>' + allYears[yi] + '</option>';
  }
  filterRow += '</select>' +
    '<span style="font-size:10px;color:#6B6B6B;font-weight:400">' + filteredPts.length + ' results</span></div>';

  var hero=filteredPts.length>0?filteredPts[0]:null;
  var heroHtml='';
  if(hero){
    var chartPts=filteredPts.slice(0,8);
    var maxV=0;
    for(var b=0;b<chartPts.length;b++){
      var bv=parseFloat(chartPts[b].v.replace(/[^0-9.]/g,''));
      if(!isNaN(bv)&&bv>maxV)maxV=bv;
    }
    var areaW=340,areaH=130;
    var padL=10,padR=10,padT=10,padB=20;
    var chartW=areaW-padL-padR;
    var chartH=areaH-padT-padB;
    var pathParts=[];
    var gridLabels='';
    for(var b=0;b<chartPts.length;b++){
      var bv=parseFloat(chartPts[b].v.replace(/[^0-9.]/g,''));
      var x=padL+(b/(chartPts.length-1||1))*chartW;
      var y=maxV>0&&!isNaN(bv)?padT+chartH-(bv/maxV)*chartH:padT+chartH/2;
      if(b===0)pathParts.push('M'+x.toFixed(1)+','+y.toFixed(1));
      else pathParts.push('L'+x.toFixed(1)+','+y.toFixed(1));
      gridLabels+='<text x="'+x.toFixed(1)+'" y="'+(areaH-4)+'" font-size="7" fill="#6B6B6B" text-anchor="middle" font-weight="400">'+chartPts[b].y+'</text>';
    }
    var fillPath=pathParts.join(' ')+' L'+(padL+chartW)+','+(padT+chartH)+' L'+padL+','+(padT+chartH)+' Z';
    var heroReg=getPtRegion(catData.cat,hero.l);
    var heroSt=getPtSourceType(catData.cat,hero.l);
    var lineageBadge=heroSt==='estimate'?'<span class="dr-lineage-badge estimate">Estimate</span>':'<span class="dr-lineage-badge">Official</span>';
    heroHtml='<div class="dr-hero"><div class="dr-hero-left"><div class="dr-hero-tag">'+hero.l+' <button class="dr-info-btn" onclick="event.stopPropagation();showLineage(\''+hero.l.replace(/'/g,"\\'")+'\',\''+hero.v.replace(/'/g,"\\'")+'\',\''+hero.s.replace(/'/g,"\\'")+'\',\''+hero.y+'\',\''+heroReg+'\',\''+heroSt+'\')">i</button></div><div class="dr-hero-value">'+hero.v+'</div><div class="dr-hero-desc">'+hero.d+'</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><div class="dr-src-badge">'+hero.s+' · '+hero.y+'</div>'+lineageBadge+'<div class="dr-src-badge" style="background:#E4ECE0;color:#3E6642">'+heroReg+'</div></div></div><div class="dr-hero-right"><div class="dr-cht-label">'+catData.cl.replace(/<[^>]+>/g,'')+' · Trend (by year)</div><svg viewBox="0 0 '+areaW+' '+areaH+'" width="100%" height="135"><defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3E6642" stop-opacity="0.3"/><stop offset="100%" stop-color="#3E6642" stop-opacity="0.02"/></linearGradient></defs><path d="'+fillPath+'" fill="url(#areaGrad)"/><path d="'+pathParts.join(' ')+'" fill="none" stroke="#3E6642" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'+gridLabels+'</svg></div></div>';
  }else{
    heroHtml='<div class="dr-hero"><div class="dr-hero-left"><div class="dr-hero-tag">No data</div><div class="dr-hero-desc">No data points match the current filter criteria. Try clearing filters.</div></div></div>';
  }

  var tableHtml='<div class="dr-table-wrap"><table class="dr-table"><thead><tr><th>Indicator</th><th>Value</th><th>Region</th><th>Source</th><th>Year</th><th>Type</th></tr></thead><tbody>';
  var visiblePts=filteredPts.length>0?filteredPts:catData.pts;
  for(var i=0;i<visiblePts.length;i++){
    var p=visiblePts[i];
    var reg=getPtRegion(catData.cat,p.l);
    var st=getPtSourceType(catData.cat,p.l);
    var stLabel=st==='estimate'?'Estimate':'Official';
    var stCls=st==='estimate'?' estimate':'';
    tableHtml+='<tr><td style="font-weight:500">'+p.l+'<button class="dr-info-btn" onclick="event.stopPropagation();showLineage(\''+p.l.replace(/'/g,"\\'")+'\',\''+p.v.replace(/'/g,"\\'")+'\',\''+p.s.replace(/'/g,"\\'")+'\',\''+p.y+'\',\''+reg+'\',\''+st+'\')">i</button></td><td style="font-weight:700">'+p.v+'</td><td class="dr-src-cell">'+reg+'</td><td class="dr-src-cell">'+p.s+'</td><td class="dr-src-cell">'+p.y+'</td><td><span class="dr-lineage-badge'+stCls+'">'+stLabel+'</span></td></tr>';
  }
  tableHtml+='</tbody></table></div>';

  var pbId = targetId === 'dataroom' ? 'drPriceBoard' : 'drPriceBoard_' + targetId;
  document.getElementById(targetId).innerHTML = '<div class="data-room">' + metaHtml + exportBar + pillsHtml + toggleRow + filterRow + '<hr class="dr-hr">' + heroHtml + tableHtml + '<hr class="dr-hr">' + buildSeasonalGantt() + '<hr class="dr-hr"><div id="' + pbId + '"></div></div>';
  renderPriceBoardInDr(pbId);
}

function buildSeasonalGantt() {
  var catFilter = sessionStorage.getItem('scCatFilter') || 'All';
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var now = new Date();
  var todayMonth = now.getMonth();
  var html = '<div class="sc-head">' +
    '<div class="sc-head-left"><h3>Seasonal Calendar</h3>' +
    '<div class="sc-legend">' +
    '<div class="sc-legend-item"><div class="sc-legend-swatch sow"></div> Sowing</div>' +
    '<div class="sc-legend-item"><div class="sc-legend-swatch har"></div> Harvest</div>' +
    '<div class="sc-legend-item"><div class="sc-legend-swatch year"></div> Year-round</div>' +
    '</div></div>' +
    '<div class="sc-select-wrap"><select class="sc-select" id="scCatSelect" onchange="sessionStorage.setItem(\'scCatFilter\',this.value);renderDataRoom()">' +
    '<option value="All"' + (catFilter==='All'?' selected':'') + '>All Categories</option>';
  for (var si = 0; si < SEASONS_CATS.length; si++) {
    var sel = catFilter === SEASONS_CATS[si] ? ' selected' : '';
    html += '<option value="' + SEASONS_CATS[si] + '"' + sel + '>' + SEASONS_CATS[si] + '</option>';
  }
  html += '</select><span class="sc-select-chevron">&#9662;</span></div></div>';

  html += '<div class="sc-gantt-wrap"><table class="sc-gantt"><thead><tr><th>Crop</th>';
  for (var mi = 0; mi < 12; mi++) {
    html += '<th class="sc-month"' + (mi === todayMonth ? ' style="color:#E85D5D"' : '') + '>' + months[mi] + '</th>';
  }
  html += '</tr></thead><tbody>';

  var filtered = catFilter === 'All' ? SEASONS : SEASONS.filter(function(s){ return s.g === catFilter; });
  var prevCat = '';
  for (var si = 0; si < filtered.length; si++) {
    var s = filtered[si];
    if (s.g !== prevCat) {
      if (prevCat) html += '<tr class="sc-cat-sep"><td colspan="13"></td></tr>';
      var catColor = ({Cereals:'sc-cat-cereals',Pulses:'sc-cat-pulses',Oilseeds:'sc-cat-oilseeds','Cash Crops':'sc-cat-cash-crops',Fruits:'sc-cat-fruits'})[s.g] || 'sc-cat-cereals';
      html += '<tr class="sc-cat-label-row"><td colspan="13"><span class="sc-cat-badge ' + catColor + '">' + s.g + '</span></td></tr>';
      prevCat = s.g;
    }
    var hasSow = s.sw && s.sw.length === 2;
    var hasHar = s.hv && s.hv.length === 2;
    var yearRound = !hasSow && !hasHar;
    html += '<tr onclick="scShowCropDetail(\'' + s.c.replace(/'/g,"\\'") + '\')">';
    html += '<td class="sc-row-label">' + s.c + '<span class="sc-row-sub">' + (s.r || '') + (s.note ? ' &middot; ' + s.note : '') + '</span></td>';
    for (var mi = 0; mi < 12; mi++) {
      var col = mi + 1;
      var bars = '';
      if (hasSow) {
        var sowStart = s.sw[0], sowEnd = s.sw[1];
        if (sowEnd < sowStart) sowEnd += 12;
        if (col >= sowStart && col <= sowEnd) {
          var left = ((col - sowStart) / (sowEnd - sowStart + 1)) * 100;
          var width = (1 / (sowEnd - sowStart + 1)) * 100;
          bars += '<div class="sc-bar sc-bar-sow" style="left:' + left + '%;width:' + width + '%" onmouseenter="scShowTip(event,\'Sowing\',\'' + s.c.replace(/'/g,"\\'") + '\',\'' + months[s.sw[0]-1] + '–' + months[(s.sw[1]-1)%12] + '\')" onmouseleave="scHideTip()"></div>';
        }
      }
      if (hasHar) {
        var harStart = s.hv[0], harEnd = s.hv[1];
        if (harEnd < harStart) harEnd += 12;
        if (col >= harStart && col <= harEnd) {
          var left = ((col - harStart) / (harEnd - harStart + 1)) * 100;
          var width = (1 / (harEnd - harStart + 1)) * 100;
          bars += '<div class="sc-bar sc-bar-har" style="left:' + left + '%;width:' + width + '%" onmouseenter="scShowTip(event,\'Harvest\',\'' + s.c.replace(/'/g,"\\'") + '\',\'' + months[s.hv[0]-1] + '–' + months[(s.hv[1]-1)%12] + '\')" onmouseleave="scHideTip()"></div>';
        }
      }
      if (yearRound) {
        bars += '<div class="sc-bar sc-bar-year" style="left:0;width:100%" onmouseenter="scShowTip(event,\'Year-round\',\'' + s.c.replace(/'/g,"\\'") + '\',\'' + (s.note||'') + '\')" onmouseleave="scHideTip()"></div>';
      }
      var today = col - 1 === todayMonth ? '<div class="sc-today-line"></div>' : '';
      html += '<td class="sc-cell">' + today + bars + '</td>';
    }
    html += '</tr>';
  }
  html += '</tbody></table></div>';
  html += '<div style="font-size:9px;color:#888;margin-top:12px;text-align:right;border-top:1px solid #eee;padding-top:8px">Source: FEWS NET (fews.net), Ethiopian Central Statistical Agency (CSA), Ministry of Agriculture (MoA). Calendar reflects typical Meher &amp; Belg seasons.</div>';
  return '<div style="background:var(--white);border-radius:10px;padding:20px">' + html + '</div>';
}

function renderPriceBoardInDr(pbId){
  var el=document.getElementById(pbId || 'drPriceBoard');
  if(!el)return;
  var bodyId = (pbId || 'drPriceBoard') + '_tbody';
  el.innerHTML='<div class="exchange-board" style="margin:0;border-radius:10px"><div class="exchange-board-header"><h3><span class="live-dot"></span>ECX — Live Prices</h3><span class="eb-updated">Loading...</span></div><div style="overflow-x:auto"><table><thead><tr><th>Commodity</th><th>Last</th><th>ETB</th><th>Change</th><th>Bid/Ask</th><th>Chart</th><th>Vol</th></tr></thead><tbody id="' + bodyId + '"></tbody></table></div></div>';
  fetchAndRenderPrices(bodyId,'ebUpdated');
}

function switchDataCat(c) {
  sessionStorage.setItem('dataRoomCat', c);
  drRegionFilter='';
  drYearFilter='';
  renderDataRoom();
}

function showLineage(lbl,val,src,y,reg,st){
  var stDesc=st==='estimate'?'This value is an <span class="lg-label">estimate</span> derived from modeling, proxy indicators, or partial data. May be revised when official figures are published.':'This value comes from an <span class="lg-label">official</span> published source (government agency, international organization, or verified industry body).';
  document.getElementById('drOlbl').textContent=lbl;
  document.getElementById('drOval').textContent=val;
  var lineageHtml='<div class="lg-row"><span class="lg-key">Source</span><span class="lg-val">'+src+'</span></div>'+
    '<div class="lg-row"><span class="lg-key">Last update</span><span class="lg-val">'+y+'</span></div>'+
    '<div class="lg-row"><span class="lg-key">Region</span><span class="lg-val">'+reg+'</span></div>'+
    '<div class="lg-row"><span class="lg-key">Data type</span><span class="lg-val">'+(st==='estimate'?'Estimate (modeled)':'Official (published)')+'</span></div>'+
    '<div class="lg-note">'+stDesc+'</div>';
  document.getElementById('drOdesc').innerHTML=lineageHtml;
  document.getElementById('drOsrc').textContent=src+' \u00b7 '+y+' \u00b7 '+reg+' \u00b7 '+(st==='estimate'?'Estimate':'Official');
  document.getElementById('drOverlay').classList.add('open');
}

function toggleCat(cat){
  var idx=hiddenCats.indexOf(cat);
  if(idx>-1)hiddenCats.splice(idx,1);
  else hiddenCats.push(cat);
  localStorage.setItem('drHiddenCats',JSON.stringify(hiddenCats));
  renderDataRoom();
}

function saveCurrentView(){
  var view={
    cat:sessionStorage.getItem('dataRoomCat')||'coffee',
    region:drRegionFilter,
    year:drYearFilter,
    hidden:hiddenCats,
    savedAt:new Date().toISOString()
  };
  localStorage.setItem('drSavedView',JSON.stringify(view));
  savedView=view;
  renderDataRoom();
}

function exportDataAsCSV(catKey){
  var catData=null;
  for(var i=0;i<DATA_ROOM.length;i++){if(DATA_ROOM[i].cat===catKey){catData=DATA_ROOM[i];break;}}
  if(!catData)return;
  var pts=getFilteredPts(catData);
  if(pts.length===0)pts=catData.pts;
  var rows=[['Indicator','Value','Description','Source','Year','Region','Data Type']];
  for(var i=0;i<pts.length;i++){
    var p=pts[i];
    rows.push([p.l,p.v,p.d,p.s,p.y,getPtRegion(catKey,p.l),getPtSourceType(catKey,p.l)]);
  }
  var csv='';
  for(var i=0;i<rows.length;i++){
    var cells=[];
    for(var j=0;j<rows[i].length;j++){
      var c=String(rows[i][j]).replace(/"/g,'""');
      cells.push('"'+c+'"');
    }
    csv+=cells.join(',')+'\n';
  }
  var blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  var link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download='agrospace_'+catKey+'_data.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// Restore saved view on load
(function(){
  if(savedView){
    drRegionFilter=savedView.region||'';
    drYearFilter=savedView.year||'';
    hiddenCats=savedView.hidden||[];
    if(savedView.cat) sessionStorage.setItem('dataRoomCat',savedView.cat);
  }
})();

/* ── ECX Price Board ── */
var ethMap = null;
var ethBaseLayers = {};
var ethActiveLayer = 'satellite';
var ethUserLayerGroup = null;
var ethCurrentGJLayer = null;
var ethDefaultLayers = [];

function switchMapLayer(val) {
  ethActiveLayer = val;
  if (!ethMap) return;
  for (var k in ethBaseLayers) {
    if (ethBaseLayers[k]) ethMap.removeLayer(ethBaseLayers[k]);
  }
  if (ethBaseLayers[val]) ethBaseLayers[val].addTo(ethMap);
}

function handleShpUpload(files) {
  if (!files || files.length === 0) return;
  var statusEl = document.getElementById('shpStatus');
  statusEl.textContent = 'Reading ' + files.length + ' file(s)...';
  var zipFile = null;
  for (var i = 0; i < files.length; i++) {
    if (files[i].name.match(/\.zip$/i)) { zipFile = files[i]; break; }
  }
  if (zipFile) {
    var reader = new FileReader();
    reader.onload = function(e) {
      statusEl.textContent = 'Parsing ' + zipFile.name + '...';
      try {
        shp(e.target.result).then(function(geo) {
          addGeoJSONToMap(geo, zipFile.name.replace(/\.zip$/,''));
          statusEl.textContent = zipFile.name + ' loaded';
        }).catch(function(err) {
          statusEl.textContent = 'Error: ' + err.message;
        });
      } catch(err) {
        statusEl.textContent = 'Error: ' + err.message;
      }
    };
    reader.readAsArrayBuffer(zipFile);
    return;
  }
  var shpFile = null, dbfFile = null, shxFile = null;
  for (var i = 0; i < files.length; i++) {
    var n = files[i].name.toLowerCase();
    if (n.endsWith('.shp')) shpFile = files[i];
    else if (n.endsWith('.dbf')) dbfFile = files[i];
    else if (n.endsWith('.shx')) shxFile = files[i];
  }
  if (!shpFile) { statusEl.textContent = 'No .shp file found'; return; }
  var readers = [];
  readers.push(new Promise(function(r){ var fr=new FileReader(); fr.onload=function(){r(fr.result);}; fr.readAsArrayBuffer(shpFile); }));
  if (dbfFile) readers.push(new Promise(function(r){ var fr=new FileReader(); fr.onload=function(){r(fr.result);}; fr.readAsArrayBuffer(dbfFile); }));
  if (shxFile) readers.push(new Promise(function(r){ var fr=new FileReader(); fr.onload=function(){r(fr.result);}; fr.readAsArrayBuffer(shxFile); }));
  Promise.all(readers).then(function(buffers) {
    statusEl.textContent = 'Parsing...';
    try {
      var combined = shp.combine(buffers);
      addGeoJSONToMap(combined, (shpFile.name.replace(/\.shp$/,'') || 'layer'));
      statusEl.textContent = shpFile.name + ' loaded';
    } catch(err) {
      statusEl.textContent = 'Error: ' + err.message;
    }
  });
}

function addGeoJSONToMap(geo, name) {
  if (!ethMap || !geo) return;
  if (ethUserLayerGroup) ethUserLayerGroup.clearLayers();
  else ethUserLayerGroup = L.layerGroup().addTo(ethMap);
  ethCurrentGJLayer = null;
  var baseOpacity = 0.85;
  var baseFillOpacity = 0.15;
  var style = { color: '#2E8B57', weight: 2, opacity: baseOpacity, fillOpacity: baseFillOpacity, fillColor: '#2E8B57' };
  var gj = L.geoJSON(geo, {
    style: style,
    pointToLayer: function(f, latlng) {
      return L.circleMarker(latlng, { radius: 6, color: '#2E8B57', fillColor: '#C5DFC9', fillOpacity: 0.8, weight: 2 });
    },
    onEachFeature: function(f, layer) {
      var props = f.properties || {};
      var html = '<div style="font-family:Jost,sans-serif;font-size:11px;line-height:1.6">';
      var keys = Object.keys(props);
      if (keys.length > 0) {
        for (var i = 0; i < Math.min(keys.length, 12); i++) {
          html += '<div style="display:flex;gap:8px;border-bottom:1px solid #f0f2ee;padding:2px 0"><span style="font-weight:600;color:#4A6B3F;min-width:80px">' + keys[i] + '</span><span style="color:#333">' + props[keys[i]] + '</span></div>';
        }
        if (keys.length > 12) html += '<div style="color:#999;font-size:9px;margin-top:2px">+' + (keys.length - 12) + ' more fields</div>';
      } else {
        html += '<div style="color:#6B6B6B">' + (name || 'Feature') + '</div>';
      }
      html += '</div>';
      layer.bindPopup(html, { className: 'eth-popup', closeButton: true, maxWidth: 320 });
    }
  });
  gj.addTo(ethUserLayerGroup);
  ethCurrentGJLayer = gj;
  // show opacity slider
  var wrap = document.getElementById('shpOpacityWrap');
  if (wrap) wrap.style.display = 'block';
  var slider = document.getElementById('shpOpacitySlider');
  if (slider) { slider.value = 85; }
  ethMap.fitBounds(gj.getBounds().pad(0.1));
}

function setShpOpacity(val) {
  if (ethCurrentGJLayer) {
    ethCurrentGJLayer.setStyle({ opacity: val, fillOpacity: val * 0.176 });
  }
}

function clearUserLayers() {
  if (ethUserLayerGroup) ethUserLayerGroup.clearLayers();
  ethCurrentGJLayer = null;
  document.getElementById('shpStatus').textContent = 'Ready';
  var wrap = document.getElementById('shpOpacityWrap');
  if (wrap) wrap.style.display = 'none';
}

// Expose map functions globally for inline HTML handlers
window.switchMapLayer = switchMapLayer;
window.handleShpUpload = handleShpUpload;
window.setShpOpacity = setShpOpacity;
window.clearUserLayers = clearUserLayers;

(function(){
var el = document.getElementById('ethiopiaMap');
if (el && typeof L !== 'undefined') {
  try {
    ethMap = L.map('ethiopiaMap', {
      center: [8.5, 39.5],
      zoom: 6.5,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
      dragging: true
    });
    ethBaseLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics', maxZoom: 18
    });
    ethBaseLayers.osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OSM</a>', maxZoom: 19
    });
    ethBaseLayers.terrain = L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>', maxZoom: 17
    });
    ethBaseLayers.satellite.addTo(ethMap);
    var ethBounds = L.latLngBounds([3.3, 33.0], [15.0, 48.0]);
    ethMap.fitBounds(ethBounds, { padding: [20, 20] });
    ethMap.on('mouseenter', function(){ ethMap.scrollWheelZoom.enable(); });
    ethMap.on('mouseleave', function(){ ethMap.scrollWheelZoom.disable(); });

    // Ethiopia real border from Natural Earth
    fetch('/ethiopia-border.geojson').then(function(r){ return r.json(); }).then(function(geo){
      var border = L.geoJSON(geo, {
        style: { color: '#C5DFC9', weight: 2, opacity: 0.9, fill: false },
        onEachFeature: function(f, layer) {
          layer.bindPopup('<div style="font-family:Jost;font-size:11px;color:#4A6B3F;font-weight:500">Federal Democratic Republic of Ethiopia</div><div style="font-family:Jost;font-size:9px;color:#6B6B6B">' + f.properties.ADMIN + ' &middot; ' + (f.properties.ISO_A3 || 'ETH') + '</div>');
        }
      }).addTo(ethMap);
      ethDefaultLayers.push(border);
    }).catch(function(){});

    // 10 largest cities — malachite dot + white halo + Jost label with backlight
    var cities = [
      { n:'Addis Ababa',  lat:9.03, lng:38.75, pop:'5.2M' },
      { n:'Dire Dawa',   lat:9.60, lng:41.85, pop:'504K' },
      { n:'Mekelle',     lat:13.50,lng:39.47, pop:'494K' },
      { n:'Adama',       lat:8.53, lng:39.27, pop:'435K' },
      { n:'Bahir Dar',   lat:11.60,lng:37.39, pop:'365K' },
      { n:'Gondar',      lat:12.60,lng:37.47, pop:'360K' },
      { n:'Dessie',      lat:11.13,lng:39.63, pop:'270K' },
      { n:'Jimma',       lat:7.67, lng:36.83, pop:'207K' },
      { n:'Hawassa',     lat:7.05, lng:38.47, pop:'200K' },
      { n:'Jijiga',      lat:9.35, lng:42.80, pop:'200K' }
    ];

    var cityLayer = L.layerGroup().addTo(ethMap);
    for (var ci = 0; ci < cities.length; ci++) {
      (function(c){
        // White halo circle
        L.circleMarker([c.lat, c.lng], {
          radius: 8, color: '#ffffff', weight: 2.5, fillColor: '#1B4332', fillOpacity: 0.95, opacity: 0.9
        }).addTo(cityLayer);
        // Label with text-shadow backlight
        var lbl = L.marker([c.lat, c.lng], {
          icon: L.divIcon({
            className: 'city-label',
            html: '<div style="font-family:Jost,sans-serif;font-size:11px;font-weight:500;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,0.7),0 0 20px rgba(0,0,0,0.4);white-space:nowrap;letter-spacing:.02em;transform:translate(14px,-10px);pointer-events:none">' + c.n + '</div>',
            iconSize: [0, 0]
          })
        }).addTo(cityLayer);
        // Click popup
        L.circleMarker([c.lat, c.lng], {
          radius: 12, color: 'transparent', fillColor: 'transparent', fillOpacity: 0
        }).addTo(cityLayer).bindPopup('<div style="font-family:Jost,sans-serif;font-size:12px;line-height:1.6"><div style="font-weight:600;color:#1B4332">' + c.n + '</div><div style="color:#6B6B6B;font-size:10px">Population: ' + c.pop + '</div></div>');
      })(cities[ci]);
    }
    ethDefaultLayers.push(cityLayer);

    // Legend
    var legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function() {
      var div = L.DomUtil.create('div');
      div.style.cssText = 'background:rgba(255,255,255,0.88);backdrop-filter:blur(12px);padding:10px 14px;border-radius:10px;font-family:Jost,sans-serif;font-size:9px;line-height:1.8;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid rgba(46,139,87,0.12)';
      div.innerHTML = '<div style="font-weight:600;color:#3E6642;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em;font-size:8px">Legend</div>' +
        '<div><span style="display:inline-block;width:14px;height:2px;background:#C5DFC9;margin-right:7px;vertical-align:middle"></span>International boundary</div>' +
        '<div><span style="display:inline-block;width:8px;height:8px;border:2px solid #fff;border-radius:50%;background:#1B4332;margin-right:7px;vertical-align:middle"></span>Major city</div>';
      return div;
    };
    legend.addTo(ethMap);

    var obsMap = new IntersectionObserver(function(es){
      if (es[0].isIntersecting) { setTimeout(function(){ if(ethMap) ethMap.invalidateSize(); }, 300); }
    }, { threshold: 0.1 });
    obsMap.observe(document.getElementById('ethiopiaMapSection'));
  } catch(e) {}
}
})();

// ===== SCROLL REVEAL =====
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.format.GeoJSON');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.loadingstrategy');
goog.require('ol.source.BingMaps');
goog.require('ol.source.Vector');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');
goog.require('ol.tilegrid.XYZ');


// format used to parse WFS GetFeature responses
var geojsonFormat = new ol.format.GeoJSON();

var vectorSource = new ol.source.Vector({
  loader: function(extent, resolution, projection) {
    var url = 'http://demo.boundlessgeo.com/geoserver/wfs?service=WFS&' +
        'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
        'outputFormat=text/javascript&format_options=callback:loadFeatures' +
        '&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
    // use jsonp: false to prevent jQuery from adding the "callback"
    // parameter to the URL
    $.ajax({url: url, dataType: 'jsonp', jsonp: false});
  },
  strategy: ol.loadingstrategy.tile(new ol.tilegrid.XYZ({
    maxZoom: 19
  }))
});

// the global function whose name is specified in the URL of JSONP WFS
// GetFeature requests
var loadFeatures = function(response) {
  vectorSource.addFeatures(geojsonFormat.readFeatures(response));
};

var vector = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 255, 1.0)',
      width: 2
    })
  })
});

var raster = new ol.layer.Tile({
  source: new ol.source.BingMaps({
    imagerySet: 'Aerial',
    key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3'
  })
});

var map = new ol.Map({
  layers: [raster, vector],
  target: document.getElementById('map'),
  view: new ol.View({
    center: [-8908887.277395891, 5381918.072437216],
    maxZoom: 19,
    zoom: 12
  })
});

/// Google Earth Engine Code Displaying Landsat 8 (2015-2016) derived NDVI values by Stephanie Ly

// Assigning Images to cloud-free Landsat Scenes for June 2015 and 2016, respectively. Assigning image from April 2013 to compare El Nino results with normal year.
// Clip Landsat composite to Elkhorn Slough boundary import.
var beforeImage = ee.Image('LANDSAT/LC8_L1T_TOA_FMASK/LC80440342015176LGN00').clip(upper);
var afterImage = ee.Image('LANDSAT/LC8_L1T_TOA_FMASK/LC80440342016179LGN00').clip(upper);


/// Calculating NDWI.

// Applying NDWI to each image.
var ndwiBefore = beforeImage.normalizedDifference(['B3', 'B5']);
var ndwiAfter = afterImage.normalizedDifference(['B3', 'B5']);
var vizParams = {
  bands: ['B4', 'B3', 'B2']
  };


// Applying mask to NDWI images // Masks out known water areas from study area.
var beforeimageMasked = beforeImage.mask(ndwiBefore.lte(0.1));
var beforendwiViz = {min: 0, max: 1, palette: ['00FFFF', '0000FF']};
var afterimageMasked = afterImage.mask(ndwiAfter.lte(0.1));
var afterndwiViz = {min: 0, max: 1, palette: ['00FFFF', '0000FF']};

/// Calculating NDVI.

// Find NDVI.
var beforeNDVI = beforeimageMasked.expression(
   '(NIR - RED) / (NIR + RED)', {
     'NIR': beforeimageMasked.select('B5'),
     'RED': beforeimageMasked.select('B4')
});

var afterNDVI = afterimageMasked.expression(
   '(NIR - RED) / (NIR + RED)', {
     'NIR': afterimageMasked.select('B5'),
     'RED': afterimageMasked.select('B4')
});


// Calculates NDVI change between 2015 and 2016 composites. Result is positive if NDVI increased, negative if it decreased.
var difference = afterNDVI.subtract(beforeNDVI);

// Apply color palette to visualize NDVI change.
var ndvi_palette =
    'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,'
    '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301';
var palette = ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
             '74A901', '66A000', '529400', '3E8601', '207401', '056201',
             '004C00', '023B01', '012E01', '011D01', '011301'];


/// Add layers to Map:
Map.addLayer(beforeimageMasked, vizParams, 'BeforeMasked'); // Adds 2015 image with water areas masked out.
Map.addLayer(afterimageMasked, vizParams, 'AfterMasked'); // Adds 2016 image with water areas masked out.
Map.addLayer(ndwiBefore, beforendwiViz, 'beforeNDWI');
Map.addLayer(ndwiAfter, afterndwiViz, 'afterNDWI');
Map.addLayer(beforeNDVI, {palette: palette, min: -0.1, max: 0.6}, 'before');
Map.addLayer(afterNDVI, {palette: palette, min: -0.1, max: 0.6}, 'after');
Map.addLayer(difference, {palette: 'FF0000, FFFFFF, 00FF00', min: -1, max: 1}, 'difference'); // Adds NDVI change layer.


/// Exporting raster to Drive for import into ArcMap.

// Export.image.toDrive({
// image: difference,
// description: '2015-2016',
// scale: 30
// });

/// Histogram of (3) layers

// June 2015
var options = {
  title: 'Elkhorn Slough NDVI Histogram 2015',
  fontSize: 20,
  hAxis: {title: 'NDVI'},
  vAxis: {title: 'count'},
  series: {
    0: {color: 'blue'}}
 };
 var histogram_15 = Chart.image.histogram(beforeNDVI, upper, 50)
  .setSeriesNames(['NDVI'])
  .setOptions(options);
 print(histogram_15);

// June 2016
var options = {
  title: 'Elkhorn Slough NDVI Histogram 2016',
  fontSize: 20,
  hAxis: {title: 'NDVI'},
  vAxis: {title: 'count'},
  series: {
    0: {color: 'red'}}
 };
 var histogram_16 = Chart.image.histogram(afterNDVI, upper, 50)
  .setSeriesNames(['NDVI'])
  .setOptions(options);
 print(histogram_16);
 

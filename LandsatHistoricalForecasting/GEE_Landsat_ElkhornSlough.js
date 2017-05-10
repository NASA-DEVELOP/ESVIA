// Notices:
// Copyright 2017 United States Government as represented by the Administrator of the
// National Aeronautics and Space Administration. All Rights Reserved.
 
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the 
// License at
 
//    http://www.apache.org/licenses/LICENSE-2.0
 
// Unless required by applicable law or agreed to in writing, software distributed 
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR 
// CONDITIONS OF ANY KIND, either express or implied. See the License for the 
// specific language governing permissions and limitations under the License.
 
// Disclaimers
// No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF ANY 
// KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, ANY
// WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS, ANY IMPLIED
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR FREEDOM FROM
// INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE ERROR FREE, OR ANY
// WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO THE SUBJECT SOFTWARE.
// THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN ENDORSEMENT BY GOVERNMENT
// AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS, RESULTING DESIGNS, HARDWARE,
// SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS RESULTING FROM USE OF THE SUBJECT 
// SOFTWARE.  FURTHER, GOVERNMENT AGENCY DISCLAIMS ALL WARRANTIES AND LIABILITIES 
// REGARDING THIRD-PARTY SOFTWARE, IF PRESENT IN THE ORIGINAL SOFTWARE, AND
// DISTRIBUTES IT "AS IS."
 
// Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST THE 
// UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY PRIOR 
// RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN ANY LIABILITIES,
// DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE, INCLUDING ANY DAMAGES
// FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S USE OF THE SUBJECT 
// SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE UNITED STATES 
// GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY PRIOR RECIPIENT, 
// TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR ANY SUCH MATTER SHALL 
// BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS AGREEMENT.


// https://code.earthengine.google.com/1aaadbd4bc0da06736620c2c56c1493a

/// Google Earth Engine Code Displaying Landsat 5 (1997-1998) derived NDVI values by Stephanie Ly

// Assigning Images to cloud-free Landsat Scenes for June 1997 and 1998, respectively. 
// Clip Landsat composite to Elkhorn Slough boundary import.
var beforeImage = ee.Image('LANDSAT/LT5_L1T_TOA_FMASK/LT50440341997174AAA01').clip(middle);
var afterImage = ee.Image('LANDSAT/LT5_L1T_TOA_FMASK/LT50440341998177XXX02').clip(middle);


/// Calculating NDWI. 

// Applying NDWI to each image and visualizing parameters.
var ndwiBefore = beforeImage.normalizedDifference(['B2', 'B4']);
var ndwiAfter = afterImage.normalizedDifference(['B2', 'B4']);
var vizParams = {
  bands: ['B3', 'B2', 'B1']
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
     'NIR': beforeimageMasked.select('B4'),
     'RED': beforeimageMasked.select('B3')
}); 

var afterNDVI = afterimageMasked.expression(
   '(NIR - RED) / (NIR + RED)', {
     'NIR': afterimageMasked.select('B4'),
     'RED': afterimageMasked.select('B3')
}); 


// Calculates NDVI change between 1997 and 1998 composites, and change between 1996 and 1997. Result is positive if NDVI increased, negative if decreased.
var difference = afterNDVI.subtract(beforeNDVI);

// Apply color palette to visualize NDVI change.    
var ndvi_palette =
    'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,'
    '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301';
var palette = ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
             '74A901', '66A000', '529400', '3E8601', '207401', '056201',
             '004C00', '023B01', '012E01', '011D01', '011301'];
             

/// Add layers to Map: 
Map.addLayer(beforeimageMasked, vizParams, 'BeforeMasked'); // Adds 1997 image with water areas masked out.
Map.addLayer(afterimageMasked, vizParams, 'AfterMasked'); // Adds 1998 image with water areas masked out. 
Map.addLayer(ndwiBefore, beforendwiViz, 'beforeNDWI');
Map.addLayer(ndwiAfter, afterndwiViz, 'afterNDWI');
Map.addLayer(beforeNDVI, {palette: palette, min: -0.1, max: 0.6}, 'before'); 
Map.addLayer(afterNDVI, {palette: palette, min: -0.1, max: 0.6}, 'after');
Map.addLayer(difference, {palette: 'FF0000, FFFFFF, 00FF00', min: -1, max: 1}, 'difference'); // Adds NDVI change layer.


// June 1997
var options = {
  title: 'Elkhorn Slough NDVI Histogram 1997',
  fontSize: 20,
  hAxis: {title: 'NDVI'},
  vAxis: {title: 'count'},
  series: {
    0: {color: 'blue'}}
 };
 var histogram_97 = Chart.image.histogram(beforeNDVI, middle, 50)
  .setSeriesNames(['NDVI'])
  .setOptions(options);
 print(histogram_97);
 
// June 1998
var options = {
  title: 'Elkhorn Slough NDVI Histogram 1998',
  fontSize: 20,
  hAxis: {title: 'NDVI'},
  vAxis: {title: 'count'},
  series: {
    0: {color: 'red'}}
 };
 var histogram_98 = Chart.image.histogram(afterNDVI, middle, 50)
  .setSeriesNames(['NDVI'])
  .setOptions(options);
 print(histogram_98);
 
				
				
				
				
				
				
				
				
				
				
				
				
				
{\rtf1\ansi\ansicpg1252\cocoartf1404\cocoasubrtf470
{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
\margl1440\margr1440\vieww12920\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Notices:\
// Copyright 2017 United States Government as represented by the Administrator of the\
// National Aeronautics and Space Administration. All Rights Reserved.\
 \
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use\
// this file except in compliance with the License. You may obtain a copy of the \
// License at\
 \
//    http://www.apache.org/licenses/LICENSE-2.0\
 \
// Unless required by applicable law or agreed to in writing, software distributed \
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR \
// CONDITIONS OF ANY KIND, either express or implied. See the License for the \
// specific language governing permissions and limitations under the License.\
 \
// Disclaimers\
// No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF ANY \
// KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, ANY\
// WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS, ANY IMPLIED\
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR FREEDOM FROM\
// INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE ERROR FREE, OR ANY\
// WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO THE SUBJECT SOFTWARE.\
// THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN ENDORSEMENT BY GOVERNMENT\
// AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS, RESULTING DESIGNS, HARDWARE,\
// SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS RESULTING FROM USE OF THE SUBJECT \
// SOFTWARE.  FURTHER, GOVERNMENT AGENCY DISCLAIMS ALL WARRANTIES AND LIABILITIES \
// REGARDING THIRD-PARTY SOFTWARE, IF PRESENT IN THE ORIGINAL SOFTWARE, AND\
// DISTRIBUTES IT "AS IS."\
 \
// Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST THE \
// UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY PRIOR \
// RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN ANY LIABILITIES,\
// DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE, INCLUDING ANY DAMAGES\
// FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S USE OF THE SUBJECT \
// SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE UNITED STATES \
// GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY PRIOR RECIPIENT, \
// TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR ANY SUCH MATTER SHALL \
// BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS AGREEMENT.\
\
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 ////////////////////\
//Google Earth Engine code collected and populated by Hannah Friedrich from the Elkhorn Slough Ecological\
//Forecasting Team II at NASA DEVELOP Ames Research Center in Fall of 2016. The following code takes a \
//Sentinel 2A image from August 13, 2016 and applies three different vegetation indices and exports them \
//to Google Drive.\
//Citation: Google Earth Engine Team. "Google Earth Engine API" 2016. https://developers.google.com/earth-engine/\
///////////////////\
\
\
// Create study area variable based on KML imported to a Fusion Table. That Fusion Table ID is the what \
// the Feature Collection in this line calls upon // \
var studyArea = ee.FeatureCollection("ft:1lPYFHWVKQsH3975r5H7wiyJv_hYuCg9cNtxuZOOd");\
\
// Center map on Elkhorn Slough Study Area at a zoom level of 10 // \
Map.centerObject(studyArea, 10);\
\
// Palette for visualizing vegetation indices //\
var palette = ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',\
              '74A901', '66A000', '529400', '3E8601', '207401', '056201',\
              '004C00', '023B01', '012E01', '011D01', '011301']; \
\
// Load Sentinel 2A Image that includes Elkhorn Slough from August 13, 2016 //\
var image = ee.Image('COPERNICUS/S2/20160813T190352_20160813T234829_T10SFF'); \
\
// Load Sentinel 2A Image that includes Elkhorn Slough from August 13, 2016 //\
var s2 = ee.Image('COPERNICUS/S2/20160813T190352_20160813T234829_T10SFF').clip(studyArea); \
\
// Normalized Difference Water Index (NDVI) variable created from clipped Sentinel 2A image\
var ndwi = s2.normalizedDifference(['B3', 'B8']).clip(studyArea);\
\
// Visualizes ndwi variable, applying minimum and maximum values as well as a blue color palette // \
var ndwiViz = \{min: 0, max: 1, palette: ['00FFFF', '0000FF']\};\
\
// Mask out any NDWI values greater then 0.1 therefore the s2Maked variable displays pixels that have // \
// NDWI values less than 0.1.//\
var s2Masked = s2.mask(ndwi.lte(0.1));\
\
// Create variable called NDVI variable which applies NDVI equation (NIR-RED)/(NIR+RED) to water masked out Sentinel 2A image //\
var NDVI = s2Masked.expression(\
    '(NIR - RED) / (NIR + RED)', \{\
      'NIR': s2Masked.select('B8'),\
      'RED': s2Masked.select('B4')\
    .clip(studyArea)\
\});\
\
\
// Create variable called NDI45 variable which applies NDI45 equation (NIR-RED)/(NIR+RED) with Sentinel 2A red-ege bands //\
// to water masked out Sentinel 2A image //\
var NDI45 = s2.expression(\
    '(NIR - RED) / (NIR + RED)', \{\
      'NIR': s2Masked.select('B5'),\
      'RED': s2Masked.select('B4')\
    .clip(studyArea)\
\});\
\
\
// Create variable called NDI45 variable which applies NDI45 equation (NIR-RED)/(NIR+RED) with Sentinel 2A red-ege bands //\
// to water masked out Sentinel 2A image //\
var IRECI = s2.expression(\
    '(NIR - RED) / (RE1/RE2)', \{\
      'NIR': s2Masked.select('B7'),\
      'RED': s2Masked.select('B4'),\
      'RE1': s2Masked.select('B5'),\
      'RE2': s2Masked.select('B6')\
    .clip(studyArea)\
\});\
\
// Add True Color version of unclipped Sentinel 2A Image to map console // \
Map.addLayer(image, \{bands: ['B4', 'B3', 'B2'], max: 2048\}, 'Unclipped Sentinel 2A Image');\
\
// Add True Color version of clipped Sentinel 2A Image to map console // \
Map.addLayer(s2, \{bands: ['B4', 'B3', 'B2'], max: 2048\}, 'Clipped Sentinel 2A Image');\
\
// Add supplementary visualizations to highlight vegetation //\
Map.addLayer(s2, \{bands: ['B8', 'B4', 'B3'], max: 2048\}, 'NIR Highlight');\
Map.addLayer(s2, \{bands: ['B12', 'B8', 'B3'], max: 2048\}, 'Vegetation Highlight');\
\
// Add ndwi varible to map console with applied ndwi visualization parameters // \
Map.addLayer(ndwi, ndwiViz, 'NDWI');\
\
// Add water masked out True Color image to map console // \
Map.addLayer(s2Masked, \{bands: ['B4', 'B3', 'B2'], max: 2048\}, 'True Color Masked');\
\
// Add vegetation index variables with palette and minimum and maximums derived from histograms as visual parameters // \
Map.addLayer(NDVI, \{min: -0.2, max: 0.3, palette:palette\}, 'NDVI');\
Map.addLayer(NDI45, \{min: 0.08, max: 0.14, palette:palette\}, 'NDI45');\
Map.addLayer(IRECI, \{min: 250, max: 850, palette:palette\}, 'IRECI');\
\
\
// Export masked and clipped true color study area image as well as the three masked vegetation indices to Google Drive as TIFs// \
\
Export.image.toDrive(\{\
  image: s2Masked,\
  description: 'SingleBand_s2Masked',\
  scale: 10,\
\});\
\
Export.image.toDrive(\{\
  image: NDVI,\
  description: 'SingleBand_NDVI',\
  scale: 10,\
\});\
\
Export.image.toDrive(\{\
  image: NDI45,\
  description: 'SingleBand_NDI45',\
  scale: 10,\
\});\
\
\
Export.image.toDrive(\{\
  image: IRECI,\
  description: 'SingleBand_IRECI',\
  scale: 10,\
\});\
\
\
\
}
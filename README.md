
LANDSAT HISTORICAL FORECASTING 

Overview
—————————
This is a tool to apply NDVI on Landsat imagery to analyze plant health. The intention of using this script is to perform a simple NDVI change detection, create histograms showing data distribution,
and export the results in order to assess historical and current day vegetation health trends of a given area.

Algorithm
——————————
For each image:
-load the Landsat scene and clip to the boundary of desired area.
-apply NDWI to each imported image and visualize using appropriate bands associated with the Landsat satellite
-apply mask to the NDWI image to remove water areas from the study area

-calculate NDVI formula by selecting appropriate NIR and Red bands associated with the satellite
-apply NDVI to the masked image

-calculate the NDVI change between the two Landsat composites using var difference = afterNDVI.subtract(beforeNDVI)
Result is positive if NDVI increased, negative if decreased.
-apply a color palette to visualize the NDVI change
-add layers to Map for comparison

-export images to drive as a raster file for further analysis in GIS program
-(optional) produce histograms in Google Earth Engine



SENTINEL 2 2016 VEGETATION ANALYSIS

Overview
—————————
Google Earth Engine code collected and populated by Hannah Friedrich from the Elkhorn Slough Ecological Forecasting Team II at NASA DEVELOP Ames Research Center in Fall of 2016. 

The following code takes a Sentinel 2A image from August 13, 2016 and applies three different vegetation indices (NDVI, NDI45, and IRECI) and exports them to Google Drive. When using this script, choose an image date which is useful for your study area. For this particular study, August 13th was the closest Sentinel 2 image date to when field data was collected which was compared with imagery analysis. 

Code is commented step by step, but main workflow is below.

Algorithm
——————————
1) Add study area kml as a fusion table feature collection. 
2) Create variable which is your study area.
3) Center map on study area
4) Add color palette variable, which will be used later on to visualize vegetation indices
5) Load the Sentinel 2 image you wish to analyze 
6) Create NDWI variable and NDWI visualization variables
7) Mask out pixels from your clipped Sentinel 2 image which have water greater than NDWI value of 0.1 (this number can be adjusted based on your study site) 
8) Apply NDVI index to clipped Sentinel 2 image
9) Apply ND45I index to clipped Sentinel 2 image
10) Apply IRECI index to clipped Sentinel 2 image
11) Add true color image of clipped and unclipped image, and different band combinations to highlight vegetation signals to map
12) Add all three vegetation indices to map
13) Export images as single band tiffs to Google Drive associated with GEE account
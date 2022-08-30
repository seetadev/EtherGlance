# This project utilizes AirQualityQuotient (AQQ) Tool and maps it with anonymized radiology chest X Rays data on Orthanc PACS server for early detection of respiratory diseases and infections.

We wish to provide meaningful insights and tools leveraging "ASDI OpenAQ" dataset on how air quality of the city has changed over the years. This will empower  citizens with necessary information to question policy makers and bring about a change for the better and increase livability and sustainabilty of the city.



## MVP

Hackathons come with time constraints, given the limited time below are the features of our solution 
* Visualization provides ability to view different air quality parameters like CO, O3, PPM, NO2, PM10, PM25, SO2 across the globe for major cities for time period selected. Visualization can be integrated into thrid party applications.
* Visualization provides ability to select a particular city and view different air quality parameters for the time period selected. Visualization can be integrated into thrid party applications
* ML algorithm to forecast PPM count for NewDelhi with range slider showing visualization of historical data as jupyter notebook.

## Future
    
* AirQualityQuotient will leverage machine learning and forecast different air quality paramteres for multiple cities.
* Expose forecasted air quality paramters as a API service for thrid party developers to integrate within their application.

# How did we do it

Our solution leverages the power of cloud and is built on top of AWS managed services. Architecture covers current and future state of our application implementation.

![alt text](https://github.com/sssDeveloper/AirQualityQuotient/blob/master/AQQ.jpeg "Architecture Diagram")

# Visualization of Solution

We are adding images of the dashboard as AWS only allows members of the same account to view the dashboard and work with it.

## Visualization of air quality parameters for selected time range

![alt text](https://github.com/sssDeveloper/AirQualityQuotient/blob/master/DataViz.png "Data Visualization of multiple cities")

## Machine Learning Notebook

openaq_analysis.ipynb provides in depth exploratory analysis of openaq data and also creates a forecast prediction model using AWS forecast as an API to predict the next 14 days air quality index for the city of New Delhi

### New Delhi PM25 time series visualization

![alt text](https://github.com/sssDeveloper/AirQualityQuotient/blob/master/PM25.png "New Delhi PM25 time series visualization")

### Most polluted countries
![alt text](https://github.com/sssDeveloper/AirQualityQuotient/blob/master/Top10.png "Top 10 most poluted countries")


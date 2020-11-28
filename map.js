
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
  ], function(Map, MapView, Graphic, GraphicsLayer) {

 
        var map = new Map({
            basemap: "streets-navigation-vector"
        });


        var view = new MapView({
            container: "viewDiv",  // Calls the viewDiv class in the HTML
            map: map,              // The basemap we created above
            center: [-98.7896876, 30.8260227], // starting longitude, latitude
            zoom: 2               // zoom in level
        });

        var graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);        

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            //Parses the response as JSON
            var data = JSON.parse(this.responseText);
            
                
              for (i of data.list){ //Loops each city required data

                    var temp = i.main.temp;
                    var place = i.name;
                    var country = i.sys.country;
                    var humidity = i.main.humidity;
                    var description = i.weather[0].description;
                    

                    var textSymbol = {
                        type: "text",  // autocasts as new TextSymbol()
                        color: "white",
                        haloColor: "black",
                        haloSize: "1px",
                        text: "You are here",
                        xoffset: 3,
                        yoffset: 3,
                        font: {  // autocasts as new Font()
                        size: 12,
                        family: "Josefin Slab",
                        weight: "bold"
                        }
                    }

                    //Defines the location of the point
                    var point = {
                        type: "point",
                        longitude: i.coord.lon,
                        latitude: i.coord.lat,
                        textSymbol: textSymbol
                        };

                    //Selects the different point color based on the temperature
                    var temp_color;
                    if (temp < 1) {
                        temp_color = [52, 210, 235];
                    }
                    else if (temp < 11) {
                        temp_color = [52, 235, 180];
                    }
                    else if (temp < 21) {
                        temp_color = [211, 235, 52];
                    }
                    else if (temp < 31) {
                        temp_color = [235, 116, 52];
                    }
                    else {
                        temp_color = [247, 5, 13];
                    }

                    var simpleMarkerSymbol = {
                        type: "simple-marker",
                        size: 13,
                        style: "circle",
                        color: temp_color,  
                        outline: {
                        color: [255, 255, 255], // white
                        width: 1,
                
                        }
                    };


                    var pointGraphic = new Graphic({
                        geometry: point,
                        symbol: simpleMarkerSymbol,
                        
                    });



                    pointGraphic.popupTemplate = {
                        "title" : `<b>${place}, ${country}</b>`,
                        "content" : `<b>Temperature:</b> ${temp}°C <br><b>Humidity:</b> ${humidity}% <br><b>Description:</b> ${description}`,
                    }

                    graphicsLayer.add(pointGraphic);

            } // End of Loop
        }
        }; // End of XML Call back Function
        
        //Variable for 20 different cities openWeather IDs
        city_ids ="2565341,2319480,2332459,5128581,4140963,5776715,5605242,2643743,5368361,3530597,2306104,5809844,4407066,993800,3469058,4164138,4887398,4684904,3165524,1850147"
        
        xhttp.open("GET", `http://api.openweathermap.org/data/2.5/group?id=${city_ids}&units=metric&appid=64597b3665f4c8b9f918b0da999890ad`, true);
        xhttp.send();
        
        


        

});
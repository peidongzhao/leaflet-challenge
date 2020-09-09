var myMap = L.map("map", {
    center: [39.93, -98.54],
    zoom: 4
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

function markerSize(mag){
    return mag * 10000;
};

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

d3.json(url, function(data){
    var mags = []
    for(var i = 0; i < data.metadata.count; i++){
        mags.push(data.features[i].properties.mag)
    };
    
    min_mag = mags.reduce((a,b) => Math.min(a,b));
    if(min_mag < 0){
        min_mag = 0;
    }
    max_mag = mags.reduce((a,b) => Math.max(a,b));
    
    colors = (max_mag-min_mag)/6
    
    col1 = min_mag+colors*1;
    col2 = min_mag+colors*2;
    col3 = min_mag+colors*3;
    col4 = min_mag+colors*4;
    col5 = min_mag+colors*5;
    col6 = min_mag+colors*6;
});

d3.json(url, function(data){
    var last_updated = data.metadata.generated
    date_time = new Date(last_updated)
    update_date = date_time.toLocaleDateString('en-US')
    update_time = date_time.toLocaleTimeString('en-US')
    
    for(var i = 0; i < data.metadata.count; i++){
        var mag = data.features[i].properties.mag
        
        var color = "";
        if(mag < col1){
            var color = "#228B22";
        }else if (mag < col2){
            var color = "#8FBC8F";
        }else if (mag < col3){
            var color = "#FFD700";
        }else if (mag < col4){
            var color = "#FFA500";
        }else if (mag < col5){
            var color = "#FF8C00";
        }else{
            var color = "#FF0000";
        }
        
        var lat = data.features[i].geometry.coordinates[1]
        var long = data.features[i].geometry.coordinates[0]
        var loc = [lat,long]
        var place = data.features[i].properties.place
        
        var time = data.features[i].properties.time
        var date = new Date(time)
        var only_date = date.toLocaleDateString('en-US')
        var only_time = date.toLocaleTimeString('en-US')
        L.circle(loc, {
            stroke:true,
            color: "gray",
            width:0.1,
            fillColor:color,
            fillOpacity: 0.80,
            radius: markerSize(mag)
        }).bindPopup("<h2>Magnitude: </h2>" + mag+ "<hr><b>Place: </b>" + place + "<br><b>Date: </b>"+only_date + "<br><b>Time: </b>" + only_time).addTo(myMap);
   
       legendUpdate(date_time);
    }
});
var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function(){
    var div = L.DomUtil.create("div","legend");
    return div;
};

legend.addTo(myMap);

function legendUpdate(time) {
    document.querySelector(".legend").innerHTML = [
        "<p><b>Plot Updated: </b> <br>" + update_date +"<br>"+ update_time + "</p><hr>",
        "<p class='one'>" + "&#9632;" +"</p><p id='in-line'>" + "0-" + Math.round(col1) + "</p><br>",
        "<p class='two'>" + "&#9632;" +"</p><p id='in-line'>" + Math.round(col1) + "-" + Math.round(col2) + "</p><br>",
        "<p class='three'>"+"&#9632;" + "</p><p id='in-line'>" + Math.round(col2) + "-" + Math.round(col3) + "</p><br>",
        "<p class='four'>" + "&#9632;" +"</p><p id='in-line'>" + Math.round(col3) + "-" + Math.round(col4) + "</p><br>",
        "<p class='five'>" + "&#9632;" +"</p><p id='in-line'>" + Math.round(col4) + "-" + Math.round(col5) + "</p><br>",
        "<p class='six'>" + "&#9632;" +"</p><p id='in-line'>" + "> " + Math.round(col5) + "</p>"
    ].join("");
}  

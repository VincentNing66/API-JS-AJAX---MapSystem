var mymap,
	fg, // featureGroup
	largeMarker,
	rctLL1,
	request,
	rctLL2;

function setMap() {   //The function which will be run at the start, this function will set up the basic map from leaflet api

    fg = L.featureGroup();

    var titleLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
	{
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery   <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 14,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoidmluY2VudG5pbmciLCJhIjoiY2p2ZjBxZmtqMHBpNzN6cG5sMnhqMjB3MSJ9.rLoWQ7gSdjQkjECFVxMShw'
	});        //Get the base map 

    largeMarker = L.icon(
	{
	    iconUrl: 'https://assets.mapquestapi.com/icon/v2/marker-lg.png&flush=true',
	    iconRetinaUrl: 'https://assets.mapquestapi.com/icon/v2/marker-lg@2x.png&flush=true',
	    iconSize: [42, 53],
	    iconAnchor: [21, 53],
	    popupAnchor: [2, -53]
	});				//Set up the marker

    mymap = L.map('mapid',
 	{
 	    center: [-36.86667, 174.76667],
 	    layers: [titleLayer, fg],
 	    zoom: 13
 	});		
}
function initialiseGeocoder() {				//will be run on load and starting set up the map
    setMap();
}

function getLocation() {					//This function will be called when seach button is clicked, it will request form mapquest api for geocoding, and the response will be returned in JSON format
    var location = document.getElementById("usript").value;			//Get the user input

    fetch("https://www.mapquestapi.com/geocoding/v1/address?key=prA3GgwIGgROGwBTmaM9uT5MEumq1RPL&location=" + location + ",NZ")
	.then(response => response.json())   //parses the json from the response
	.then(json => showLocation(json));			//after geting the response, send it to the call back function - showLocation()

}

function getSun(locLat, locLng) {  				//This function will be called after get the location on map and trying to get sunrise and sunset time from the api
    fetch("sunRiseSet.php?lat=" + locLat + "&lng=" + locLng)		//It sends required values to the php file, then send the request to api though the php file
	.then(response => response.json())   //parses the json from the response
	.then(json => showSun(json));			//after geting the response, send it to the call back function - showSun()
}

getWeather = function(locLat, locLng){			//This function will be called after getting sun rise and sun set
												//This function will get the weather of the place whcih the user searched
	let key = "3d5a3dddb0c95f86be00b061b03c47f7"
	request = new XMLHttpRequest();
	url = "weather.php?key=" + key + "&lat=" + locLat + "&lng=" + locLng;
	request.open("GET",url);
	request.onreadystatechange = function(){					//As required, it using a AJAX function request the weather api thought a php file
		if(request.readyState == 4) {
    		if (request.status == 200) {
    			result = request.responseText;
    			showWeather(result);							//callback function to showWeather()
			}
		}
	};
	request.send();
	

	//fetch("weather.php?lat=" + locLat + "&lng=" + locLng + "&key=" + key)
	//.then(response => response.json())   //parses the json from the response
	//.then(json => showWeather(json));


}
setUpRecent = function (setTo, getFrom, rctLatLng) {			//This function will be used to process recent search and give them values which was stored
    document.getElementById(setTo).innerHTML = getFrom
    document.getElementById(setTo).style.cursor = 'pointer';
    document.getElementById(setTo).onclick = function () {
		fg.removeLayer(fg.getLayers()[0]);
		L.marker([rctLatLng.lat, rctLatLng.lng], { icon: largeMarker }).addTo(fg);
		mymap.setView(new L.LatLng(rctLatLng.lat, rctLatLng.lng), 13);			//onclick function to interact with map without sending api request again
		getSun(rctLatLng.lat, rctLatLng.lng);
		getWeather(rctLatLng.lat, rctLatLng.lng);
    }

}
showLocation = function (result) {			//callback function of getLocation, gets response, then set up the map and rencent search, then call sun and weather functions


    if (result.results[0].locations[0].adminArea1 == 'NZ') {
        var rct0 = result.results[0].locations[0].adminArea5
        var rct1 = document.getElementById("recent1").innerHTML
        var rct2 = document.getElementById("recent2").innerHTML
        var rct3 = document.getElementById("recent3").innerHTML
        var rctLatLng = result.results[0].locations[0].latLng
		var location = result.results[0].providedLocation.location;

		fg.removeLayer(fg.getLayers()[0]);
		L.marker([rctLatLng.lat, rctLatLng.lng], { icon: largeMarker }).addTo(fg);
		mymap.setView(new L.LatLng(rctLatLng.lat, rctLatLng.lng), 13);

        if (rct1 == "") {
            setUpRecent("recent1", rct0)
            rctLL1 = rctLatLng
        }
        else if (rct2 == "" && rct1 != "") {

            setUpRecent("recent2", rct1, rctLL1)
            setUpRecent("recent1", rct0, rctLatLng)
			rctLL2 = rctLL1
            rctLL1 = rctLatLng
            
        }
        else if (rct3 == "" && rct2 != "") {
            setUpRecent("recent3", rct2, rctLL2)
            setUpRecent("recent2", rct1, rctLL1)
            setUpRecent("recent1", rct0, rctLatLng)
            rctLL2 = rctLL1
            rctLL1 = rctLatLng
            
        }
        else if (rct3 !== "") {
            setUpRecent("recent3", rct2, rctLL2)
            setUpRecent("recent2", rct1, rctLL1)
            setUpRecent("recent1", rct0, rctLatLng)
            rctLL2 = rctLL1
            rctLL1 = rctLatLng

        }

        getSun(rctLatLng.lat, rctLatLng.lng);
		getWeather(rctLatLng.lat, rctLatLng.lng);
    }
    else {
        alert("Please type in a valid city name in New Zealand!")		//Limits user to search only inside of NZ
    }
}


showSun = function (result) {			//callback function of getSun, gets response and display them on to the page
    document.getElementById("sunRise").innerHTML = result.results.sunrise;
    document.getElementById("sunSet").innerHTML = result.results.sunset;

}

showWeather = function(result){			//callback function of getSun, gets response, convert it to XML and display them on to the page
	let parser = new DOMParser();
	xmlDoc = parser.parseFromString(result,"text/xml");

	main = xmlDoc.getElementsByTagName("current")[0];
	weather = xmlDoc.getElementsByTagName("weather")[0].getAttribute('value');
	maxTemp = xmlDoc.getElementsByTagName("temperature")[0].getAttribute('max');		//reads value from xml and return to the page
	minTemp = xmlDoc.getElementsByTagName("temperature")[0].getAttribute('min');

	outputText = "Current weather : " + weather + "<br>Max temp : " + maxTemp  + "<br>Min temp : " + minTemp 
	document.getElementById("weather").innerHTML = outputText 

}


<?php
	$apikey = $_GET["key"];
	$lat = $_GET["lat"];
	$lng = $_GET["lng"];

	$url = "api.openweathermap.org/data/2.5/weather?lat=" . $lat . "&lon=" . $lng . "&APPID=" . $apikey . "&mode=xml" ;

  	$process = curl_init($url);
  
  	curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
  	$return = curl_exec($process);
	
	echo $return;

  	curl_close($process);

			    /* 	This php is for requesting sunrise and sunset api
      	 			it gets value from JavaScript and uses curl as required
					return the output back to JavaScript in default JSON format		*/

?>


<?php
	$lat = $_GET["lat"];
	$lng = $_GET["lng"];

	$url = "https://api.sunrise-sunset.org/json?lat=" . $lat . "&lng=" . $lng ;
	//default return type is json

  	$process = curl_init($url);
  
  	curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
  	$return = curl_exec($process);

  	echo $return;

  	curl_close($process);
 							/* 	This php is for requesting weather api
      	 						it gets value from JavaScript and uses curl as required
								return the output back to JavaScript in default JSON format
								and it will be converted to XML format in JS file		*/
?>

						  


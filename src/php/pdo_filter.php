<?php

// include_once(YOUR_PHPMYADMIN_CONFIG);

// Parameter aus dem Filter Formular
$param = $_POST["Bezirk"];

$dsn = 'mysql:host=mysql-localhost;dbname=testdb';
$username = "root";
$password = "root";

//$user & $password should come from config file
$conn = new PDO($dsn,$username,$password);
if (!$conn) {
	echo 'no connection\n';
	exit;
}
$sql = "SELECT * FROM Daten_Berlin where lower(Bezirk) LIKE lower('%".$param."%')";

$rs = $conn->query($sql);
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}

$geojson = array (
	'type'	=> 'FeatureCollection',
	'features'	=> array()
);

while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
	$properties = $row;
	unset($properties['lat']);
	unset($properties['lon']);
	$feature = array(
		'type'	=> 'Feature',
		'geometry' => array(
			'type' => 'Point',
			'coordinates' => array(
					$row['lon'],            // hier auf Reihenfolge lon/lat achten - https://geojsonlint.com/ zum testen der erzeugten Geojson
					$row['lat']
                    // floatval($row['lon']), // wir wollen die Koordinaten als float ohne ""
					// floatval($row['lat']) // erstmal lon, dann lat
					)
			),
		'properties' => $properties
	);
	array_push($geojson['features'], $feature);
}

header('Content-type: application/json');
echo json_encode($geojson, JSON_PRETTY_PRINT);

//for local json files use code below

/*$fp = fopen('data.json', 'w');
fwrite($fp, geoJson($json));
fclose($fp);*/

$conn = NULL;

?> 
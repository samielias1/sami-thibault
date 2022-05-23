
<?php
$servername = "mysql-localhost";
$username = "root";
$password = "root";

// Verbindungsaufbau und Auswahl der Datenbank
$conn = mysqli_connect($servername, $user, $password)
    or die('Verbindungsaufbau fehlgeschlagen: ' . mysqli_connect_error());

// Eine SQL-Abfrge ausführen
$query = "SELECT row_to_json(fc)
 FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
 FROM (SELECT 'Feature' As type
    , ST_AsGeoJSON(lg.geom)::json As geometry
    , row_to_json((SELECT l FROM (SELECT x,y,title As l
      )) As properties
   FROM wochenmaerkte2 As lg   ) As f )  As fc;";
$result = mysqli_query($query) or die('Abfrage fehlgeschlagen: ' . mysqli_connect_error());

// Ergebnisse als GEOJSON ausgeben
while ($line = mysqli_fetch_array($result, null, MYSQL_ASSOC)) {
	 foreach ($line as $col_value) {
        echo json_encode($col_value, JSON_NUMERIC_CHECK);
    }
}

// Speicher freigeben
mysqli_free_result($result);

// Verbindung schließen
mysqli_close($conn);
?>

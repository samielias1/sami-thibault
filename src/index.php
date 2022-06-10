<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="author" content="Sami Elias and Thibault Le Calvez">
  <meta name="keyword" content="GIS Akademie Projekt">
  <meta name="description" content="Hassgewalt gegenüber queeren Menschen in Berlin">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hassgewalt in Berlin</title>
  <?php
      $webpack_manifest = file_get_contents("./manifest.json");
      $files = json_decode($webpack_manifest, true);
      echo "<link rel='stylesheet' href='" . $files["app.css"] . "'>";
    ?>
</head>
<body>

<!-- DIV Navigation -->
<div class="topnav">
        <a>Hassgewalt gegenüber queeren Menschen in Berlin</a>
    </div>

<!-- DIV Map -->
<div id="map">
  <div id="popup">
    <a href="#" id="popup-closer"></a>
      <div id="popup-content">
        <ul>
          <li></li>
        </ul>  
      </div>  
  </div>
</div>

<!-- DIV Menu -->
<div id="menu">
  
   <!-- // DIV Filter -->
    <div id="divFilter">
      <div id="divUhrzeit">
        <p>Uhrzeit</p>
          <!-- wird in index.js gefüllt -->
      </div> 
      <div id="divJahr">
        <p>Jahr</p>
          <!-- wird in index.js gefüllt -->
      </div> 
      <div id="divDelikt">
        <p>Deliktformen</p>
          <!-- wird in index.js gefüllt -->
      </div> 
      <br>
      <br>
      <br>
      <br>
      <input type="submit" value="Filtern" id="bttnSelect">
      <br>    
    <input type="submit" value="Auswahl zurücksetzen" id="bttnAlle">   
      
    </div>
     <!-- DIV Bezirk -->
 <div id="divBezirk">
    <div id="contentBezirk">
      <p>Bezirk</p>
      <br>
      <!-- wird in index.js gefüllt -->
    </div>
    <br>
    <br>  
    <input type="submit" value="Zoom auf Bezirk" id="bttnBezirk">
   
  </div>
  <br>  
    <br>
    <br>
    <br>
 
    <img src="../img/gis-akademie.png" id="img">
</div>
<?php
echo "<script src=" . $files["app.js"] . "></script>";
?>
</body>
</html>

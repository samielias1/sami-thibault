<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="author" content="Sami Elias and Thibault Le Calvez">
  <meta name="keyword" content="GIS Akademie Projekt">
  <meta name="description" content="Queer Hate Crime Map Berlin">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Queer Hate Crime Map Berlin</title>
  <?php
      $webpack_manifest = file_get_contents("./manifest.json");
      $files = json_decode($webpack_manifest, true);
      echo "<link rel='stylesheet' href='" . $files["app.css"] . "'>";
    ?>
</head>
<body>

<!-- DIV Navigation -->
<div class="topnav">
        <a>Queer Hate Crime Map Berlin</a>
        <!-- <a>ClickMaster</a>
        <a>GuessTheNumber</a>
        <a>MathQuiz</a> -->
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
      <input type="submit" value="Auswählen" id="bttnSelect">
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
    <input type="submit" value="Zoom Bezirke" id="bttnBezirk">
   
  </div>
  <br>  
    <br>
    <br>
    <br>
 
    <img src="../img/maneo.jpg" id="img">
</div>



<!-- <ul id="menue">
  <li class="ui-state-disabled"><div>Toys (n/a)</div></li>
  <li><div>Books</div></li>
  <li><div>Clothing</div></li>
  <li><div>Electronics</div>
    <ul>
      <li class="ui-state-disabled"><div>Home Entertainment</div></li>
      <li><div>Car Hifi</div></li>
      <li><div>Utilities</div></li>
    </ul>
  </li>
  <li><div>Movies</div></li>
  <li><div>Music</div>
    <ul>
      <li><div>Rock</div>
        <ul>
          <li><div>Alternative</div></li>
          <li><div>Classic</div></li>
        </ul>
      </li>
      <li><div>Jazz</div>
        <ul>
          <li><div>Freejazz</div></li>
          <li><div>Big Band</div></li>
          <li><div>Modern</div></li>
        </ul>
      </li>
      <li><div>Pop</div></li>
    </ul>
  </li>
  <li class="ui-state-disabled"><div>Specials (n/a)</div></li>
</ul> -->




<?php
echo "<script src=" . $files["app.js"] . "></script>";
?>
</body>
</html>

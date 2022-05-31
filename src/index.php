<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
  <?php
      $webpack_manifest = file_get_contents("./manifest.json");
      $files = json_decode($webpack_manifest, true);
      echo "<link rel='stylesheet' href='" . $files["app.css"] . "'>";
    ?>
</head>
<body>
<div class="topnav">
        <a>Startseite</a>
        <a>ClickMaster</a>
        <a>GuessTheNumber</a>
        <a>MathQuiz</a>
    </div>
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
<div id="menu">
 <div id="divBezirk">
 <div id="contentBezirk">
  <p>Bezirk</p>
  <!-- wird in index.js gefüllt -->
  </div> 
  <input type="submit" value="Zoom Bezirke" id="bttnBezirk"> 
  </div>
  <div id="divFilter">
  <div id="divUhrzeit">
  <p>Uhrzeit</p>
    <!-- wird in index.js gefüllt -->
      </div> 

    <div id="divJahr">
  <p>Jahresgang</p>
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
  

</div>

<ul id="menue">
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
</ul>




<?php
echo "<script src=" . $files["app.js"] . "></script>";
?>
</body>
</html>

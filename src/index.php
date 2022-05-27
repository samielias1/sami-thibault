<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
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

  <p>Bezirk</p>
  <input type="radio" id="charlottenburg" name="txtbezirk" value="charlottenburg">
  <label for="charlottenburg">Charlottenburg-Wilmersdorf</label><br>
  <input type="radio" id="mitte" name="txtbezirk" value="mitte">
  <label for="mitte">Mitte</label><br>
  <input type="radio" id="neukölln" name="txtbezirk" value="neukölln">
  <label for="neukölln">Neukölln</label>

  <input type="submit" value="Bezirke auswählen" id=bttnBezirke>
 
  <p>Uhrzeit</p>
  <input type="radio" id="nacht" name="txUhr" value="nacht">
  <label for="nacht">Nachts : 22h - 7h</label><br>
  <input type="radio" id="tagsueber" name="txtuhr" value="tagsueber">
  <label for="tagsueber">Tagsüber : 7h - 22h </label><br>
    <input type="submit" value="Uhrzeit auswählen" id=bttnUhr>
<br>
    <input type="submit" value="Auswahl zurücksetzen" id=bttnAlle>
  </div> 

</div>

<?php
echo "<script src=" . $files["app.js"] . "></script>";
?>
</body>
</html>
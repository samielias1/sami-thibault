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
<div id="menu"></div>

<?php
echo "<script src=" . $files["app.js"] . "></script>";
?>
</body>
</html>
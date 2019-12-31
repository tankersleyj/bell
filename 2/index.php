<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style><?php echo file_get_contents("style.css"); ?></style>
  <script>
    <?php 
        echo file_get_contents("text.js");
        echo file_get_contents("pcg-random.js");
        echo file_get_contents("code.js"); 
    ?>
  </script>
</head>
<body onload='handleOnload();'>
  <div id="window">
    <b><span id='title'></span></b><br>
    <i><span id='author'></span>, <span id='version'></span></i><br>
    <div id="canHead"></div>
    <canvas id="canvas" width="600" height="300px"></canvas>
    <div id="controls">
      Mode: 
      <select id='mode' onchange='handleMode()'>
          <option value="Quantum">Quantum</option>
          <option value="Karma_Peny">Karma Peny</option>
          <option value="Realistic" selected>Realistic</option>
          <option value="Perfect_1">Perfect 1</option>
          <option value="Perfect_2">Perfect 2</option>
          <option value="Experiment_1">Experiment 1</option>
      </select>
      <button class="space-left" onclick="handleReset()">Random Seed</button>
      <button class="space-left" onclick="handleStartStop()">Freeze</button>
      <button class="space-left" onclick="handleRate(15)">Slow</button>
      <button onclick="handleRate(60)">Medium</button>
      <button onclick="handleRate(300)">Fast</button>
      <span class="space-left" id="statusBar"></span>
    </div>
    <div id="canFoot"></div>
    <div id="header1"></div><div id="terminal1"></div><div id="footer1"></div>
    <div id="header2"></div><div id="terminal2"></div><div id="footer2"></div>
    <div id="header3"></div><div id="terminal3"></div><div id="footer3"></div>
    <div id="header4"></div><div id="terminal4"></div><div id="footer4"></div>
    <div id="header5"></div><div id="terminal5"></div><div id="footer5"></div>
    <div id="debug"></div>
  </div>
</body>
</html>
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
  <script type="text/javascript" src="text.js"></script>
  <script type="text/javascript" src="code.js"></script>
</head>
<body onload='handleOnload();'>
  <div id="window">
    <b><span id='title'></span></b><br>
    <i><span id='author'></span>, <span id='version'></span></i><br>
    <div id="canHead"></div>
    <canvas id="canvas" width="600" height="250px"></canvas>
    <div id="controls">
      <button class="space-right" onclick="handleStartStop()">Stop</button>
      <button onclick="handleRate(15)">Slow</button>
      <button onclick="handleRate(60)">Medium</button>
      <button onclick="handleRate(600)">Fast</button>
      <button class="space-left" onclick="handleWave()" disabled>Wave</button>
      <button class="space-right" onclick="handleReset()">Reset</button>
      <span id="statusBar"></span>
    </div>
    <div id="canFoot"></div>
    <div id="header1"></div>
    <div id="terminal1"></div>
    <div id="footer1"></div>
    <div id="header2"></div>
    <div id="terminal2"></div>
    <div id="footer2"></div>
    <div id="debug"></div>
  </div>
</body>
</html>
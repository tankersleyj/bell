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
    <canvas id="canvas" width="600" height="300px"></canvas>
    <div id="controls">
      <button class="space-right" onclick="handleStartStop()">Freeze</button>
      <button onclick="handleRate(15)">Slow</button>
      <button onclick="handleRate(60)">Medium</button>
      <button class="space-right" onclick="handleRate(300)">Fast</button>
      Mode: 
      <select id='mode'>
          <option value="classic">classic</option>
          <option value="quantum">quantum</option>
          <option value="cos" selected>cos²(θ)</option>
      </select>
      <button class="space-right" onclick="handleReset()">Reset</button>
      <span id="statusBar"></span>
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
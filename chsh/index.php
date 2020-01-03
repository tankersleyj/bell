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
          <option value="Custom">Custom</option>
        </select>
    <button class="space-left" onclick="handleReset()">Seed</button>
    <span class="space-left">Rate:</span>
    <select id='rate' onchange='setRate(this.value)'>
        <option value="15">Slow</option>
        <option value="60" selected>Medium</option>
        <option value="2400">Fast</option>
    </select>
    <input id="freezeChk" class="space-left" type="checkbox" onchange="freeze(this.checked)">Freeze</input>
    <input id="animateChk" class="space-left" type="checkbox" checked>Animate</input>
    <span class="space-left" id="statusBar"></span>
    </div>
    <div id="custom" class="form-div" style="display:none">  <!-- style="display:none" -->
        <table>
        <tr>
            <td class='form-tab'></td>
            <td>
                <table>
                <tr>
                    <td class='form-name'>Polarizer Degrees:</td>
                    <td class='form-tab'></td>
                    <td class='form-name'>a:</td> 
                    <td class='form-data'><input type="text" id="polarizeA1" size="4" value="0" disabled></td>
                    <td class='form-tab'></td>
                    <td class='form-name'>a':</td> 
                    <td class='form-data'><input type="text" id="polarizeA2" size="4" value="45" disabled></td>
                    <td class='form-tab'></td>
                    <td class='form-name'>b:</td> 
                    <td class='form-data'><input type="text" id="polarizeB1" size="4" value="22.5" disabled></td>
                    <td class='form-tab'></td>
                    <td class='form-name'>b':</td> 
                    <td class='form-data'><input type="text" id="polarizeB2" size="4" value="67.5" disabled></td>
                </tr>
                </table>
                <table>
                <tr>
                    <td class='form-name'>Polarize +:</td> 
                    <td class='form-data'>
                        <select id='polarizeMode' disabled>
                          <option value="Quantum">QM correlated cos²(Δ) probability</option>
                          <option value="Realistic" selected>Real cos²(Δ) probability</option>
                          <option value="Karma_Peny">Peny cos²(Δ) >= 0.5</option>
                        </select>                   
                    </td>
                </tr>
                <tr>
                    <td class='form-name'>Detect Rate:</td> 
                    <td class='form-data'>
                        <select id='detectMode' disabled>
                          <option value="Quantum">Perfect 100%</option>
                          <option value="Realistic" selected>Real cos²(2Δ) probability</option>
                          <option value="Karma_Peny">Peny 0.37+(0.63*|cos(2Δ)|) probability</option>
                        </select>                   
                    </td>
                </tr>
                </table>
            </td>
            <td class='form-tab'></td>
            <td class='form-tab'></td>
            <td class='form-data'>
                <button id='customEdit' onclick="handleCustomEdit()">Edit</button>
                <button id='customRun' onclick="handleCustomRun()" disabled>Run</button><br>
                <span class="data-note">In Development</span>
            </td>
        </tr>
        </table>
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
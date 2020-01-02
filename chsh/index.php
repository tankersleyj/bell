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
          <!--<option value="Custom">Custom</option>-->
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
                    <td class='form-data'><input type="text" id="a1" size="4" value="45"></td>
                    <td class='form-tab'></td>
                    <td class='form-name'>a':</td> 
                    <td class='form-data'><input type="text" id="a2" size="4" value="0"></td>
                    <td class='form-tab'></td>
                    <td class='form-name'>b:</td> 
                    <td class='form-data'><input type="text" id="b1" size="4" value="22.5"></td>
                    <td class='form-tab'></td>
                    <td class='form-name'>b':</td> 
                    <td class='form-data'><input type="text" id="b2" size="4" value="67.5"></td>
                </tr>
                </table>
                <table>
                <tr>
                    <td class='form-name'>Polarize Method:</td> 
                    <td class='form-data'>
                        <select id='polarMode' onchange='handleMode()'>
                          <option value="Quantum">Quantum</option>
                          <option value="Karma_Peny">Karma Peny</option>
                          <option value="Realistic" selected>Realistic</option>
                          <option value="Perfect_1">Perfect 1</option>
                          <option value="Perfect_2">Perfect 2</option>
                          <option value="Custom">Custom</option>
                        </select>                   
                    </td>
                </tr>
                <tr>
                    <td class='form-name'>Detection Method:</td> 
                    <td class='form-data'>
                        <select id='detectMode' onchange='handleMode()'>
                          <option value="Quantum">Quantum</option>
                          <option value="Karma_Peny">Karma Peny</option>
                          <option value="Realistic" selected>Realistic</option>
                          <option value="Perfect_1">Perfect 1</option>
                          <option value="Perfect_2">Perfect 2</option>
                          <option value="Custom">Custom</option>
                        </select>                   
                    </td>
                </tr>
                </table>
                <table>
                <tr>
                    <td class='form-name'>Emitter Random:</td> 
                    <td class='form-data'>
                        <select id='polarMode' onchange='handleMode()'>
                          <option value="random">Math.random</option>
                          <option value="LCG-31">LCG-31</option>
                          <option value="PCG-53" selected>PCG-53</option>
                        </select>                   
                    </td>
                    <td class='form-tab'></td>
                    <td class='form-name'>Seed:</td> 
                    <td class='form-data'><input type="text" id="a1" size="24" value=""></td>
                    <td class='form-tab'></td>
                    <td class='form-name'>Index:</td> 
                    <td class='form-data'><span id="a1"></span></td>
                </tr>
                <tr>
                    <td class='form-name'>Polarizer A Random:</td> 
                    <td class='form-data'>
                        <select id='detectMode' onchange='handleMode()'>
                          <option value="random">Math.random</option>
                          <option value="LCG-31">LCG-31</option>
                          <option value="PCG-53" selected>PCG-53</option>
                        </select>                   
                    </td>
                    <td class='form-tab'></td>
                    <td class='form-name'>Seed:</td> 
                    <td class='form-data'><input type="text" id="a1" size="24" value=""></td>
                    <td class='form-tab'></td>
                    <td class='form-name'>Index:</td> 
                    <td class='form-data'><span id="a1"></span></td>
                </tr>
                <tr>
                    <td class='form-name'>Polarizer B Random:</td> 
                    <td class='form-data'>
                        <select id='detectMode' onchange='handleMode()'>
                          <option value="random">Math.random</option>
                          <option value="LCG-31">LCG-31</option>
                          <option value="PCG-53" selected>PCG-53</option>
                        </select>                   
                    </td>
                    <td class='form-tab'></td>
                    <td class='form-name'>Seed:</td> 
                    <td class='form-data'><input type="text" id="a1" size="24" value=""></td>
                    <td class='form-tab'></td>
                    <td class='form-name'>Index:</td> 
                    <td class='form-data'><span id="a1"></span></td>
                </tr>
                </table>
            </td>
            <td class='form-tab'></td>
            <td class='form-data'><button onclick="handleRate(15)">Save</button><br><button onclick="handleRate(15)" disabled>Edit</button></td>
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
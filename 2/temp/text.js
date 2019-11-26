const textJson = {
    "title": "Testing Bell's Theorem - CHSH Experiment",
    "canHead": `<br>
        Bell CHSH computer experiment violates Bell's Inequalities with Realistic and Karma Peny math.<br>
        <small>Refer to <a target='tab' href='https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper'>Testing Bell's Theorem</a> [I]
        & <a target='tab' href='https://www.youtube.com/watch?v=yOtsEgbg1-s'>Explained & Debunked</a> [II] for theoretical background.</small>`,
    "canFoot": '<br>',
    "header1": "<b>Totals:</b><br>",
    "header2": "<b>Test 1 Results</b> <i>(a=0°, b=22.5°)</i><b>:</b><br>",
    "header3": "<b>Test 2 Results</b> <i>(a=0°, b′=67.5°)</i><b>:</b></b><br>",
    "header4": "<b>Test 3 Results</b> <i>(a′=45°, b=22.5°)</i><b>:</b></b><br>",
    "header5": "<b>Test 4 Results</b> <i>(a′=45°, b′=67.5°)</i><b>:</b></b><br>",
    "footer1": "<br>",
    "footer2": "<br>",
    "footer3": "<br>",
    "footer4": "<br>",
    "footer5": `<br>
        <div><b>Polarization and Detection Graph</b> (<i>Realistic</i>):<br>
          <div class='tab-left'>
            <img src="graph.png" alt="Detection and Polarization Graph, https://codeserver.net/bell/2/graph.png"><br>
            <table>
              <tr><td class='graph-head'>X Axis</td><td class='graph-note'>θ as difference between photon polarization angle and polarizer angle</td></tr>
              <tr><td class='graph-head'>Red</td><td class='graph-note'>Probability of passing through polarizer (<i>vertical, +</i>) instead of being reflected (<i>horizontal, -</i>), |cos²(x)|</td></tr>
              <tr><td class='graph-head'>Green</td><td class='graph-note'>Detection Probability, |cos(2x)|</td></tr>
            </table>
          </div>
        </div><br>
        <b>Overview</b><br>
        <div class='tab-left overview'>
            Sets of photons are repeatedly created with opposite polarization angles <i>(pre-set to between 0° and 360° for non-quantum modes)</i>.
            Polarizers a, a′, b and b′ are set to angles of 0°, 45°, 22.5° and 67.5° respectively.
            Polarizer angles (<i>a or a′ and b or b′</i>) are randomly selected before each set of photons are measured.<br><br>
            Results are recorded as <b>N++</b>, <b>N+-</b>, <b>N-+</b> and <b>N--</b><br>
            Detail tests calculated as E = (<b>N++</b> - <b>N+-</b> - <b>N-+</b> + <b>N--</b>) / (<b>N++</b> + <b>N+-</b> + <b>N-+</b> + <b>N--</b>).<br>
            QM expects <b>S>=2</b> where <b>S = E(a,b) - E(a,b′) + E(a′,b) + E(a′,b′)</b><br>
            Select [Fast] to speed up experiment. Select [Freeze] to freeze & unfreeze photons.<br>
        </div><br>
        <b>Mode</b> may be set to:<br>
        <div class='tab-left'>
          <table>
            <tr><td class='mode-head'>Quantum</td><td class='mode-note'>non-local communication, <u>polarize</u> = anti-correlated cos²(θ) probability, <u>detection</u> = 50% probability</td></tr>
            <tr><td class='mode-head'>Realistic</td><td class='mode-note'>local hidden variables, <u>polarize</u> = cos²(θ) probability, <u>detection</u> = |cos(2θ)| probability</td></tr>
            <tr><td class='mode-head'>Karma Peny</td><td class='mode-note'>local hidden variables, <u>polarize</u> = cos²(θ) >= 0.5, <u>detection</u> = 0.37+(0.63*|cos(2θ)|) probability [IV]</td></tr>
            <tr><td class='mode-head'>Alternate 1</td><td class='mode-note'>local hidden variables, <u>polarize</u> = cos²(θ) >= 0.5, <u>detection</u> = |cos(2θ)| probability</td></tr>
            <tr><td class='mode-head'>Alternate 2</td><td class='mode-note'>local hidden variables, <u>polarize</u> = cos²(θ) probability, <u>detection</u> = 0.37+(0.63*|cos(2θ)|) probability</span></td></tr>
          </table>
        </div>
        <br>
        <div>Paper:<br>
          <div class='tab-left ref'>
            <table>
              <tr><td class='ref-num'>[I]</td><td><span class='ref-author'>J.Tankersley</span>, Nov 2019, <span class='ref-title'>Testing Bell's Theorem (<i>with Realistic & Karma Peny math</i>)</span>
              <a class='sub-link' target='tab' href='https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper'>https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper</a></td></tr>
            </table>
          </div>
        </div><br>       
        <div>Video:<br>
          <div class='tab-left ref'>
            <table>
              <tr><td class='ref-num'>[II]</td><td><span class='ref-author'>Karma Peny</span>, Apr 2018, <span class='ref-title'>Explained & Debunked: Quantum Entanglement & Bell Test Experiments</span>
              <a class='sub-link' target='tab' href='https://www.youtube.com/watch?v=yOtsEgbg1-s'>https://www.youtube.com/watch?v=yOtsEgbg1-s</a></td></tr>
            </table>
          </div>
        </div><br>
        <div>Forums:<br>
          <div class='tab-left ref'>
            <table>
              <tr><td class='ref-num'>[III]</td><td>SciPhysicsForums <span class='ref-author'>(with Joy Christian)</span> <span class='ref-title'>Karma Peny Simulation Appears to Violate Bell</span>,
                <a class='sub-link' target='tab' href='http://www.sciphysicsforums.com/spfbb1/viewtopic.php?f=6&t=417'>http://www.sciphysicsforums.com/spfbb1/viewtopic.php?f=6&t=417</a></td></tr>
              <tr><td class='ref-num'>[IV]</td><td>Bell inequalities and quantum foundations <span class='ref-author'>(with Richard Gill)</span> <span class='ref-title'>Karma Peny Math Appears to Violate Bell</span>,
                <a class='sub-link' target='tab' href='https://groups.google.com/forum/#!topic/bell_quantum_foundations/CdvTO7aIOXs'>https://groups.google.com/forum/#!topic/bell_quantum_foundations/CdvTO7aIOXs</a></td></tr>
            </table>
          </div>
        </div><br>
        <div>Code:<br>
          <div class='tab-left ref'>
            <table>
              <tr><td class='ref-num'>[V]</td><td>CodeServer <a target='tab' href='https://codeserver.net/bell/2'>https://codeserver.net/bell/2</a>, <span class='sub-text'>right-click Chrome background & View Page Source</span></td></tr>
              <tr><td class='ref-num'>[VI]</td><td>GitHub <a target='tab' href='https://github.com/tankersleyj/bell'>https://github.com/tankersleyj/bell</a></td></tr>
            </table>
          </div>
        </div><br>`
}
const reportExpected = {
    "1": ["cos²(22.5)/2 = 43%", "(1-cos²(22.5))/2 = 7%", "(1-cos²(22.5))/2 = 7%", "cos²(22.5)/2 = 43%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.71"],
    "2": ["cos²(67.5)/2 = 7%", "(1-cos²(67.5))/2 = 43%", "(1-cos²(67.5))/2 = 43%", "cos²(67.5)/2 = 7%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=-0.71"],
    "3": ["cos²(22.5)/2 = 43%", "(1-cos²(22.5))/2 = 7%", "(1-cos²(22.5))/2 = 7%", "cos²(22.5)/2 = 43%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.71"],
    "4": ["cos²(22.5)/2 = 43%", "(1-cos²(22.5))/2 = 7%", "(1-cos²(22.5))/2 = 7%", "cos²(22.5)/2 = 43%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.71"],
    "5": ["0.707", "-0.707", "0.707", "0.707", "E1-E2+E3+E4=2.83 (>=2)", "not detected"]
}
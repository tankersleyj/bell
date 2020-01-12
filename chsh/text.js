const textJson = {
    "title": "Testing Bell's Theorem - CHSH Experiment",
    "promptSeed": `Random Seed:
\u2022 0 = Math.random (no seed)
\u2022 integer = 31 bit Lehmer LCG
\u2022 decimal = 53 bit PCG (recommended)`,
    "canHead": `<br>
        CHSH Bell Inequalities simulation with QT (<i>Quantum Theory</i>) and LHV (<i>Local Hidden Variable</i>) models.<br>
        Scroll down for <b>Run Instructions</b>.
        <small>See <a target='tab' href='https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper'>Testing Bell's Theorem</a> [I]
        & <a target='tab' href='https://www.youtube.com/watch?v=yOtsEgbg1-s'>Explained & Debunked</a> [II] for theoretical background.</small>`,
    "canFoot": '<br>',
    "header1": "<b>Totals:</b><br>",
    "header2": "<b>Test Part 1</b> <i>(a=0°, b=22.5°)</i><b>:</b><br>",
    "header3": "<b>Test Part 2</b> <i>(a=0°, b′=67.5°)</i><b>:</b></b><br>",
    "header4": "<b>Test Part 3</b> <i>(a′=45°, b=22.5°)</i><b>:</b></b><br>",
    "header5": "<b>Test Part 4</b> <i>(a′=45°, b′=67.5°)</i><b>:</b></b><br>",
    "footer1": "<br>",
    "footer2": "<br>",
    "footer3": "<br>",
    "footer4": "<br>",
    "footer5": `<br>
        <b>Purpose</b><br>
        <div class='tab-left paragraph'>
            Physical Bell experiments attempt to prove that quantum systems are non-deterministic<br>
            (<i>and involve some form of mysterious instantaneous communication between particles</i>).<br>
            Simulations attempt to prove that quantum systems could be deterministic<br>
            (<i>no "spooky actions at a distance"</i>) as Prof. Einstein argued in his 1935 EPR paper.
        </div><br>
        <b>Instructions</b><br>
        <div class='tab-left paragraph'>
            Select [Mode], [Seed] and [Rate] to start experiment.<br>
            In Custom mode, press [Edit] to customize parameters and press [Run].<br>
            Allow experiment to run for at least a few minutes at <b>Fast</b> rate to generate sufficient results.<br>
            Check [Freeze] to pause the expermiment and review results.<br>
        </div><br>
        <b>Modes</b>:<br>
        <div class='tab-left'>
          <table>
            <tr><td class='mode-head'>Quantum Theory</td><td class='mode-note'>
                non-local,
                <u>polarize +</u> = cos²(Δ) correlated ,
                <u>detect rate</u> = 100%
            </td></tr>
            <tr><td class='mode-head'>Karma Peny</td><td class='mode-note'>
                local,
                <u>polarize +</u> = cos²(Δ) >= 0.5,
                <u>detect rate</u> = 0.37+(0.63*|cos(2Δ)|) probability
            </td></tr>
            <tr><td class='mode-head'>Realistic</td><td class='mode-note'>
                local,
                <u>polarize +</u> = cos²(Δ) probability,
                <u>detect rate</u> = cos²(2Δ) probability
            </td></tr>
            <tr><td class='mode-head'>Perfect</td><td class='mode-note'>
                local,
                <u>polarize +</u> = cos²(Δ) >= 0.5,
                <u>detect rate</u> = 100%
            </td></tr>
            <tr><td class='mode-head'>Real Perfect</td><td class='mode-note'>
                local,
                <u>polarize +</u> = cos²(Δ) probability,
                <u>detect rate</u> = 100%
            </td></tr>
            <tr><td class='mode-head'>Low Loss</td><td class='mode-note'>
                local,
                <u>polarize +</u> = cos²(Δ) >= 0.5,
                <u>detect rate</u> = 1-(0.333*sin^32(2Δ)) probability
            </td></tr>
            <tr><td class='mode-head'>Custom</td><td class='mode-note'>
                Customize polarizer angles and polarization and detection formulas
            </td></tr>
          </table>
        </div><br>
        <b>Expermiment</b><br>
        <div class='tab-left paragraph'>
            Sets of photons are repeatedly created with opposite polarization angles <i>(pre-set to between 0° and 360° for non-quantum modes)</i>.<br>
            Polarizers a, a′, b and b′ are set to default angles of 0°, 45°, 22.5° and 67.5° respectively.<br>
            Polarizer angles (<i>a or a′ and b or b′</i>) are randomly selected before each set of photons are measured.<br><br>
            Results are recorded as <b>N++</b>, <b>N+-</b>, <b>N-+</b> and <b>N--</b><br>
            Detail tests calculated as E = (<b>N++</b> - <b>N+-</b> - <b>N-+</b> + <b>N--</b>) / (<b>N++</b> + <b>N+-</b> + <b>N-+</b> + <b>N--</b>).<br>
            Quantum Theory expects <b>S>=2, approaching 2.83</b> where <b>S = E(a,b) - E(a,b′) + E(a′,b) + E(a′,b′)</b><br>
            Eberhard <b>J>0</b> where J = Coincidence(a,b) + Coincidence(a,b′) + Coincidence(a′,b) - Coincidence(a′,b′) - Single(a) - Single(b)</b><br>
            <br>
            Quantum Theory mode violates Bell's inequalities (<i>S>2, ~=2.83</i>) by simulating '<i>spooky action at a distance</i>'.<br>
            All other modes also violate Bell's inequalities using local hidden variable (<i>non-communicating</i>) models.<br>
            <br>
            These experiments demonstrate the 'detection loophole', (<i>photon loss when a photon's polarization<br>
            angle is approximately half way between it's Polarizer's pass-through and reflection angles</i>),<br>
            and may be responsible for similar results in physical (<i>non-simulated</i>) CHSH experiments.<br>
        </div><br>
        <div><b>Probabilities Graph</b> (<i>Realistic, single photon polariaze & detect</i>):<br>
          <div class='tab-left'>
            <img src="graph-realistic.png" alt="Detection and Polarization Probabilities Graph, https://codeserver.net/bell/2/graph-realistic.png"><br>
            <table>
              <tr><td class='graph-head'>X Axis</td><td class='graph-note'>Δ (<i>delta</i>) = difference in polarization angles between a photon (<i>Pa or Pb</i>) and it's polarizer (<i>a or b</i>)</td></tr>
              <tr><td class='graph-head'>Red</td><td class='graph-note'>Probability of a photon being detected (<i>not undetected</i>) = cos²(2Δ)</td></tr>
              <tr><td class='graph-head'>Green</td><td class='graph-note'>Probability of a photon passing through it's polarizer (<i>+</i>) (<i>instead of being reflected -</i>) = cos²(Δ)</td></tr>
              <tr><td class='graph-head'>Net +</td><td class='graph-note'>Net Probability of + result <i>(Red * Green)</i> = cos²(2Δ) * cos²(Δ)</td></tr>
              <tr><td class='graph-head'>Net -</td><td class='graph-note'>Net Probability of - result <i>(Red * (1-Green))</i> = cos²(2Δ) * (1-cos²(Δ))</td></tr>
            </table>
          </div>
        </div><br>
        <div><b>Symbols</b>:<br>
          <div class='tab-left'>
            <table>
              <tr><td class='key-head'><b>Pa or Pb</b></td><td class='graph-note'><u>Photon</u> with hidden polarization angle λ (<i>lambda</i>)</td></tr>
              <tr><td class='key-head'><b>a or b</b></td><td class='graph-note'><u>Polarizer</u> with pre-set polarization angle φ (<i>phi</i>)</td></tr>
              <tr><td class='key-head'><b>Δ</b> (<i>delta</i>)</td><td class='graph-note'><u>Difference</u> in polarization angles between a <u>photon</u> (<i>Pa or Pb</i>) λ and it's <u>polarizer</u> (<i>a or b</i>) φ</td></tr>
              <tr><td class='key-head'><b>D+ or D-</b></td><td class='graph-note'><u>Detector</u> pass-through (<i><b>+</b></i>) or reflected (<i><b>-</b></i>)</td></tr>
            </table>
          </div>
        </div><br>
        <div>Paper:<br>
          <div class='tab-left ref'>
            <table>
              <tr><td class='ref-num'>[I]</td><td><span class='ref-author'>J.Tankersley</span> 2020, <span class='ref-title'>Testing Bell's Theorem (<i>with Realistic & Karma Peny math</i>)</span><br>
              <a class='sub-link' target='tab' href='https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper'>https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper</a></td></tr>
            </table>
          </div>
        </div><br>       
        <div>Video:<br>
          <div class='tab-left ref'>
            <table>
              <tr><td class='ref-num'>[II]</td><td><span class='ref-author'>Karma Peny</span>, Apr 2018, <span class='ref-title'>Explained & Debunked: Quantum Entanglement & Bell Test Experiments</span><br>
              <a class='sub-link' target='tab' href='https://www.youtube.com/watch?v=yOtsEgbg1-s'>https://www.youtube.com/watch?v=yOtsEgbg1-s</a></td></tr>
            </table>
          </div>
        </div><br>
        <div>Forums:<br>
          <div class='tab-left ref'>
            <table>
              <tr><td class='ref-num'>[III]</td><td>SciPhysicsForums <span class='ref-author'>(with Joy Christian)</span> <span class='ref-title'>Karma Peny Simulation Appears to Violate Bell</span><br>
                <a class='sub-link' target='tab' href='http://www.sciphysicsforums.com/spfbb1/viewtopic.php?f=6&t=417'>http://www.sciphysicsforums.com/spfbb1/viewtopic.php?f=6&t=417</a></td></tr>
              <tr><td class='ref-num'>[IV]</td><td>Bell inequalities and quantum foundations <span class='ref-author'>(with Richard Gill)</span> <span class='ref-title'>Karma Peny Math Appears to Violate Bell</span><br>
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
    "1": ["QM Expected (<i>a-b=22.5</i>)", "cos²(a-b)/2 = 43%", "(1-cos²(a-b))/2 = 7%",  "(1-cos²(a-b))/2 = 7%",  "cos²(a-b)/2 = 43%", "([1]-[2]-[3]+[4]) / ([1]+[2]+[3]+[4])=0.71",  "+,lost", "-,lost", "lost,+", "lost,-", "lost,lost", "Lost a or b"],
    "2": ["QM Expected (<i>a-b′=67.5</i>)", "cos²(a-b′)/2 = 7%",  "(1-cos²(a-b′))/2 = 43%", "(1-cos²(a-b′))/2 = 43%", "cos²(a-b′)/2 = 7%",  "([1]-[2]-[3]+[4]) / ([1]+[2]+[3]+[4])=-0.71", "+,lost", "-,lost", "lost,+", "lost,-", "lost,lost", "Lost a or b"],
    "3": ["QM Expected (<i>a′-b=22.5</i>)", "cos²(a′-b)/2 = 43%", "(1-cos²(a′-b))/2 = 7%",  "(1-cos²(a′-b))/2 = 7%",  "cos²(a′-b)/2 = 43%", "([1]-[2]-[3]+[4]) / ([1]+[2]+[3]+[4])=0.71",  "+,lost", "-,lost", "lost,+", "lost,-", "lost,lost", "Lost a or b"],
    "4": ["QM Expected (<i>a′-b′=22.5</i>)", "cos²(a′-b′)/2 = 3%", "(1-cos²(a′-b′))/2 = 7%",  "(1-cos²(a′-b′))/2 = 7%",  "cos²(a′-b′)/2 = 43%", "([1]-[2]-[3]+[4]) / ([1]+[2]+[3]+[4])=0.71",  "+,lost", "-,lost", "lost,+", "lost,-", "lost,lost", "Lost a or b"],
    "5": ["QM Expected", "0.707", "-0.707", "0.707", "0.707", "E1-E2+E3+E4>=2, ideal=2.83", "Lost a or b", "Coincidence(a,b)", "Coincidence(a,b′)", "Coincidence(a′,b)", "Coincidence(a′,b′)", "Single(a)", "Single(b)", "C1+C2+C3-C4-S1-S2 > 0"]
}
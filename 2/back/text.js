const textJson = {
    "title": "Bell's Inequalities CHSH test",
    "canHead": "Multi-mode computer simulation of Bell's Inequalities.",
    "canFoot": `Sets of photons are repeatedly created with opposite polarization angles between 0° and 360°.<br>
        Polarizers a, a′, b and b′ are set to angles of 0°, 45°, 22.5° and 67.5° respectively.<br>
        Polarizer angles (<i>a or a′ and b or b′</i>) are randomly selected before each set of photons are measured.<br>
        Mode may be set to:<br>
        <span class='tab-left'><b>classic</b> (<i>local hidden variables with 100% detection efficiency</i>)</span><br>
        <span class='tab-left'><b>quantum</b> (<i>simulated 'spooky action at a distance'</i>)</span><br>
        <span class='tab-left'><b>cos²(θ)</b> (<i>local hidden variables with cos²(θ) detection efficiency</i>)</span><br>`,
    "header1": "Totals",
    "header2": "Test Results: a, b (0°, 22.5°)",
    "header3": "Test Results: a, b′ (0°, 67.5°)",
    "header4": "Test Results: a′, b (45°, 22.5°)",
    "header5": "Test Results: a′, b′ (45°, 67.5°)",
    "footer1": `
        Results are recorded as <b>N++</b>, <b>N+-</b>, <b>N-+</b> and <b>N--</b><br>
        Detail tests calculated as E = (<b>N++</b> - <b>N+-</b> - <b>N-+</b> + <b>N--</b>) / (<b>N++</b> + <b>N+-</b> + <b>N-+</b> + <b>N--</b>).<br>
        QM expects <b>S>=2</b> where <b>S = E(a,b) - E(a,b′) + E(a′,b) + E(a′,b′)</b><br>
        `,
    "footer2": "",
    "footer3": "",
    "footer4": "",
    "footer5": `
        <p>See forum discussion at <a href='http://www.sciphysicsforums.com/spfbb1/viewtopic.php?f=6&t=416' target='new'>http://www.sciphysicsforums.com/spfbb1/viewtopic.php?f=6&t=416</a></p>
        [I] Bell Tests <a target='tab' href='https://en.wikipedia.org/wiki/Bell_test_experiments'>https://en.wikipedia.org/wiki/Bell_test_experiments</a><br>
        [II] Bell Original Paper <a target='tab' href='http://www.drchinese.com/David/Bell.pdf'>http://www.drchinese.com/David/Bell.pdf</a><br>
        [III] Are Hidden-Variable Theories for Pilot-Wave Systems Possible? <a target='tab' href='https://arxiv.org/pdf/1701.08194.pdf'>https://arxiv.org/pdf/1701.08194.pdf</a><br>
        [IV] Paper <a target='tab' href='https://sites.google.com/site/physicschecker/unsettled-physics/bell-chsh-simulation'>https://sites.google.com/site/physicschecker/unsettled-physics/bell-chsh-simulation</a><br>
        [V] App <a target='tab' href='https://codeserver.net/bell/2'>https://codeserver.net/bell/2</a><br>
        [VI] Code <a target='tab' href='https://github.com/tankersleyj/bell'>https://github.com/tankersleyj/bell</a><br>
        [VII] Expected CHSH values <a target='tab' href='https://arxiv.org/pdf/1207.5103.pdf'>https://arxiv.org/pdf/1207.5103.pdf</a><br>
        [VIII] Karma Peny cos²(θ) Detection Efficiency <a target='tab' href='https://www.youtube.com/watch?v=yOtsEgbg1-s'>https://www.youtube.com/watch?v=yOtsEgbg1-s</a><br>
        Other for review: <a target='tab' href='https://arxiv.org/pdf/1604.08105.pdf'>https://arxiv.org/pdf/1604.08105.pdf</a>, <a target='tab' href='https://arxiv.org/pdf/1704.02876.pdf'>https://arxiv.org/pdf/1704.02876.pdf</a>, <a target='tab' href='https://arxiv.org/pdf/quant-ph/0304066.pdf'>https://arxiv.org/pdf/quant-ph/0304066.pdf</a>
        `
}
const reportExpected = {
    "1": {
        "classic": ["25%", "25%", "25%", "25%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.00"],
        "quantum": ["cos²(22.5)/2 = 43%", "(1-cos²(22.5))/2 = 7%", "(1-cos²(22.5))/2 = 7%", "cos²(22.5)/2 = 43%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.71"],
        "cos": ["cos²(22.5)/2 = 43%", "(1-cos²(22.5))/2 = 7%", "(1-cos²(22.5))/2 = 7%", "cos²(22.5)/2 = 43%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.71"]
    },
    "2": {
        "classic": ["25%", "25%", "25%", "25%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.00"],
        "quantum": ["cos²(67.5)/2 = 7%", "(1-cos²(67.5))/2 = 43%", "(1-cos²(67.5))/2 = 43%", "cos²(67.5)/2 = 7%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=-0.71"],
        "cos": ["cos²(67.5)/2 = 7%", "(1-cos²(67.5))/2 = 43%", "(1-cos²(67.5))/2 = 43%", "cos²(67.5)/2 = 7%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=-0.71"]
    },
    "3": {
        "classic": ["25%", "25%", "25%", "25%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.00"],
        "quantum": ["cos²(22.5)/2 = 43%", "(1-cos²(22.5))/2 = 7%", "(1-cos²(22.5))/2 = 7%", "cos²(22.5)/2 = 43%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.71"],
        "cos": ["cos²(22.5)/2 = 43%", "(1-cos²(22.5))/2 = 7%", "(1-cos²(22.5))/2 = 7%", "cos²(22.5)/2 = 43%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.71"]
    },
    "4": {
        "classic": ["25%", "25%", "25%", "25%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.00"],
        "quantum": ["cos²(22.5)/2 = 43%", "(1-cos²(22.5))/2 = 7%", "(1-cos²(22.5))/2 = 7%", "cos²(22.5)/2 = 43%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.71"],
        "cos": ["cos²(22.5)/2 = 43%", "(1-cos²(22.5))/2 = 7%", "(1-cos²(22.5))/2 = 7%", "cos²(22.5)/2 = 43%", "([1]-[2]-[3]+[4])/([1]+[2]+[3]+[4])=0.71"]
    },
    "5": {
        "classic": ["0.00", "-0.00", "0.00", "0.00", "E1-E2+E3+E4=0.00"],
        "quantum": ["0.707", "-0.707", "0.707", "0.707", "E1-E2+E3+E4=2.83"],
        "cos": ["0.707", "-0.707", "0.707", "0.707", "E1-E2+E3+E4=2.83"]
    },
}
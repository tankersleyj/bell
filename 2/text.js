const textJson = {
    "title": "Bell's Inequalities CHSH test",
    "canHead": "Computer simulation with <i>real local properties</i> before measurement.",
    "canFoot": `Sets of photons are repeatedly created with opposite polarization angles between 0° and 360°.<br>
        Detectors a, a′, b and b′ are set to 0, 45°, 22.5° and 67.5° respectively.<br>
        Detectors (<i>a or a′ and b or b′</i>) are randomly selected before each set of photons are measured.`,
    "header1": "Test Results",
    "footer1": `Results are recorded as N++, N+-, N-+ and N--<br>
        Results are calculated as E = (N++ - N+- - N-+ + N--) / (N++ + N+- + N-+ + N--).<br>
        It should not be possible for E > 2 (<i>violate the CHSH inequality</i>) with this non-quantum simulation.<br>
        Current math used does not allow values > 1 unless cases [2] and/or [3] are negative.<br>
        Next, determine what math is used by real-world experiments that is able to generate <b>E>=2</b> or even <b>E>1</b>
        <p>See forum discussion at <a href='http://www.sciphysicsforums.com/spfbb1/viewtopic.php?f=6&t=416' target='new'>http://www.sciphysicsforums.com/spfbb1/viewtopic.php?f=6&t=416</a></p>`,
    "header2": "",
    "footer2": `
        [I] Bell Tests <a target='tab' href='https://en.wikipedia.org/wiki/Bell_test_experiments'>https://en.wikipedia.org/wiki/Bell_test_experiments</a><br>
        [II] Bell Original Paper <a target='tab' href='http://www.drchinese.com/David/Bell.pdf'>http://www.drchinese.com/David/Bell.pdf</a><br>
        [III] Are Hidden-Variable Theories for Pilot-Wave Systems Possible? <a target='tab' href='https://arxiv.org/pdf/1701.08194.pdf'>https://arxiv.org/pdf/1701.08194.pdf</a><br>
        [IV] Paper <a target='tab' href='https://sites.google.com/site/physicschecker/unsettled-physics/bell-chsh-simulation'>https://sites.google.com/site/physicschecker/unsettled-physics/bell-chsh-simulation</a><br>
        [V] App <a target='tab' href='https://codeserver.net/bell/2'>https://codeserver.net/bell/2</a><br>
        [VI] Code <a target='tab' href='https://github.com/tankersleyj/bell'>https://github.com/tankersleyj/bell</a>`
}
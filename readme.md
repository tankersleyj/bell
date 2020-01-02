# Bell: CHSH tests of Bell's theorem with local hidden variables in JavaScript

This computer experiment violates Bell's Inequalities with Realistic and Karma Peny math.

For information on the computer experiment, see [here](https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper).

Code is compatible with modern browsers, generating up to 2,400 particle pairs per minute, and results are repeatable using random seeds.

A choice of 3 PRNGs (_Pseudo Random Number Generators_) are provided.

## Documentation

### `Instructions`

Run code on any device (_phone, tablet, netbook, laptop or desktop_) with a modern browser (_for example: Google Chrome, Apple Safari or Mozilla Firefox_)

**Select Mode**
* `Quanum`: non-local wave collapse model
* `Karma Peny`: local hidden variable model
* `Realistic`: local hidden variable model (_default setting_)
* `Custom`: user defined settings

**Set Random Seeds**
_Source, Polarizer A, Polarizer B_
* `0`: Math.random (_no seed_)
* `integer`: 31 bit Lehmer LCG (_31 bit non-zero integer seed_)
* `decimal`: 53 bit PCG (_64 bit decimal seed_) **_recommended_**

**Set Rate**
* `slow`: 15 photon pairs per minute
* `medium`: 60 photon pairs per minute
* `fast`: 2400 photon pairs per minute **_recommended_**

Allow the experiment to run for at least **a few minutes** at **fast** speed.

An explanation of experiment theory, setup and expected results may be found [here](https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper)

### `Project Status`

Development Priorities.

- `Completed Features:`
    + `Violations`: Violated Bell's in-equalities with local hidden variables
    + `Quality`: S values of 2.83 achieved in multiple modes
    + `Method`: Photon loss as a probability function of polarization angles (_photon & polarizer_)
    + `Method`: Correlation as a probability function of polarization angles (_photon & polarizer_)
    
- `Needed Features:`
    + `Customize`: Custom Polarizer/Detector Angles
    + `Validation`: Eberhard photon loss calculations
    + `Quality`: Violation with photon loss between 0% and 20%
    
- `Wanted Features`
    + `R`: Simplified numeric only translation to R for academic use
    + `3D`: Visual simulation in 2.5D or 3D

## Caveats and Attributions

Significant contributions and/or guidance from Karma Peny, Chantal Roth and Richard Gill.

53-bit PCG PRNG (https://github.com/thomcc/pcg-random) Copyright 2014 Thom Chiovoloni, under MIT license 

## License
The MIT License (MIT)

Copyright (c) 2019-2020 James Tankersley Jr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
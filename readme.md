# Bell: CHSH tests of Bell's theorem with local hidden variables in JavaScript

This computer experiment violates Bell's Inequalities with Realistic and Karma Peny math.

For information on the computer experiment, see [here](https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper).

Code is runnable on modern browsers, and results are repeatable by re-using random seeds.

## Documentation

### `Instructions`

Select Mode

- `Mode` 
    + `Quanum`: non-local, wave collapse, photon communication model
    + `Karma Peny`: local hidden variable model
    + `Realistic`: local hidden variable model
    + `Other`: other local hidden variable models, more detail [here](https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper)

Enter a random seed (53 bit PCG recommended)

- `Random Seed`
    + `0`: no seed, browser.Math.random()
    + `seed`: 31 bit Lehmer LCG (one 31 bit seed)
    + `seedHi, seedLow`: 53 bit PCG (two 32 bit seeds)

Set speed

- `Speed`
   + `freeze`: Stop/start action
   + `slow`: 15 photon pairs per minute
   + `medium`: 60 photon pairs per minute (default)
   + `fast`: 300 photon pairs per minute (recommended)

An explanation of expected experimental results may be found [here](https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper)

### `Project Status`

Development Priorities.

- `Completed Features:`
    + `Violations`: Violated Bell's in-equalities with local hidden variables
    + `Quality`: S values of 2.83 achieved in multiple modes
    + `Method`: Photon loss as a probability function of polarization angles (photon & polarizer)
    + `Method`: Correlation as a probability function of polarization angles (photon & polarizer)
    
- `Needed Features:`
    + `Customize`: Custom Polarizer/Detector Angles
    + `Validation`: Eberhard photon loss calculations
    + `Quality`: Violation with photon loss between 0% and 20%
    
- `Wanted Features`
    + `R`: Simplified numeric only translation to R for academic use
    + `3D`: Visual simulation in 2.5D or 3D

## Caveats

This is a collaborative effort between multiple volunteer developers and scientists.

## License
The MIT License (MIT)

Copyright (c) 2019 James Tankersley Jr

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
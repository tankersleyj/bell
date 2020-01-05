// https://github.com/tankersleyj/bell
// Copyright 2019 JTankersley, released under the MIT license.

// global variables
var degChr=String.fromCharCode(176), primeChr=String.fromCharCode(180), animationId=0, author='J.Tankersley', version='1.7.15, 2020-01-04', imageTitle='Bell CHSH';
var experiment, canvas, context, mode, canHead, canFoot, statusBar, terminal1, terminal2, terminal3, terminal4, terminal5;
var header1, header2, header3, header4, header5, footer1, footer2, footer3, footer4, footer5;

// global objects

// Lehmer LCG Random, https://gist.github.com/blixt/f17b47c62508be59987b
class LcgRandom {
    constructor(seed) {this.setSeed(seed)}
    number() {
        this.seed = (this.seed * 48271) % 2147483647;
        return this.seed / 2147483647;
    }
    setSeed(seed) {this.seed=Math.abs(Math.floor(seed)) % 2147483647}
    state() {return this.seed}
}

// Random Handler
class RandomHandler {
    // Seed: 0=Math.random(), integer=LcgRandom(), seedHi,seedLo=PcgRandom()
    constructor(seed) {this.setSeed(seed)}
    number() {
        this.index++;
        if (this.mode==="LCG-31") {return this.lcgRandom.number()}
        else if (this.mode==="PCG-53") {return this.pcgRandom.number()}
        else {return Math.random()}
    }
    setSeed(seed) {
        this.seed=seed; this.index=0;
        // convert seed to array of integers
        if (Array.isArray(seed)) {this.seeds=seed}
        else {this.seeds=(seed||0).toString().split(".").map(n => Math.floor(Number(n)))}
        // set random mode
        if (this.seeds.length > 1) {
            // 53 bit PGC RNG, https://en.wikipedia.org/wiki/Permuted_congruential_generator
            this.mode="PCG-53";
            PcgRandom.prototype.state = function() {return [this.state_[0], this.state_[1]]}; // add state method
            this.pcgRandom = new PcgRandom(this.seeds[0], this.seeds[1]);
        } else if (this.seeds[0] > 0) {
            // 31 bit Lehmer LCG RNG, https://en.wikipedia.org/wiki/Lehmer_random_number_generator
            this.mode="LCG-31";
            this.lcgRandom = new LcgRandom(this.seeds[0]);
        } else {
            // browser dependent, commonly xorshift128+, no user seed, https://v8.dev/blog/math-random
            this.mode="Math.random";
        }        
    }
    state() {
        if (this.mode==="LCG-31") {return this.lcgRandom.state()}
        else if (this.mode==="PCG-53") {return this.pcgRandom.state()}
        else {return "not available"}
    }
}
// RandomHandler
var random = new RandomHandler(randomSeed());

function animationStart() {if (!animationId && !eid("freezeChk").checked) {experiment.start(); animationId=window.requestAnimationFrame(animationStep)}}
function animationStep(time) {experiment.step(time); animationId=window.requestAnimationFrame(animationStep)}
function animationStop() {if (animationId) {experiment.stop(); window.cancelAnimationFrame(animationId); animationId=0}}
function eid(name) {return document.getElementById(name)}
function eid_enable(name,enable) {document.getElementById(name).disabled=!enable}
function freeze(val) {if (val===true) {animationStop()} else {animationStart()}}
function enableCustom(enable) {
    eid_enable('freezeChk',!enable); eid("freezeChk").checked=enable;
    eid_enable('customEdit',!enable); eid_enable('customRun',enable);
    eid_enable('polarizeA1',enable); eid_enable('polarizeA2',enable);
    eid_enable('polarizeB1',enable); eid_enable('polarizeB2',enable);
    eid_enable('polarizeMode',enable); eid_enable('detectMode',enable);
}
function handleCustomEdit() {
    enableCustom(true);
    animationStop();
}
function handleCustomRun() {
    enableCustom(false);
    experiment.init();
    animationStart();
}
function handleMode() {
    random.setSeed(randomSeed());
    enableCustom(false);
    experiment.init();
    animationStart();
}
function handleOnload() {
  canvas=document.getElementById("canvas"); context=canvas.getContext("2d"); mode=eid("mode");
  canHead=eid("canHead"); canFoot=eid("canFoot"); statusBar=eid("statusBar");
  terminal1=eid("terminal1"); terminal2=eid("terminal2"); terminal3=eid("terminal3"); terminal4=eid("terminal4"); terminal5=eid("terminal5");
  header1=eid("header1"); header2=eid("header2"); header3=eid("header3"); header4=eid("header4"); header5=eid("header5");
  footer1=eid("footer1"); footer2=eid("footer2"); footer3=eid("footer3"); footer4=eid("footer4"); footer5=eid("footer5");
  experiment=new Experiment({
      canvas:canvas, context:context, mode:mode, canHead:canHead, canFoot:canFoot, statusBar:statusBar,
      terminal1:terminal1, terminal2:terminal2, terminal3:terminal3, terminal4:terminal4, terminal5:terminal5,
      header1:header1, header2:header2, header3:header3, header4:header4, header5:header5,
      footer1:footer1, footer2:footer2, footer3:footer3, footer4:footer4, footer5:footer5
  });
  setIdHtml('title',textJson.title); setIdHtml('author',author); setIdHtml('version',version);
  experiment.init();
  animationStart();
}
function handleReset() {animationStop(); experiment.reset(); animationStart()}
function randomSeed(double=true) {return (double) ? Number((Math.random()*998+1).toFixed(3)) : Math.floor(Math.random()*999998+1)}
function roundTo(val,dec=0) {return Number.parseFloat(Number.parseFloat(val).toFixed(dec))}
function roundToStr(val,dec=0) {return Number.parseFloat(val).toFixed(dec)}
function setIdHtml(id,html) {document.getElementById(id).innerHTML=html}
function setRate(rate) {animationStop(); experiment.rate=rate; experiment.updateStatus(); animationStart()}
function setVis(ele,vis) {if (vis) {ele.style.display="inline-block"} else {ele.style.display="none"}}

// 2d (x,y) point class
class Point {
    constructor(params={x:0,y:0}) {for (var prop in params) {this[prop] = params[prop]}}
    static shiftX(angle,distance) {return Math.cos(angle*Math.PI/-180)*distance;}
    static shiftY(angle,distance) {return Math.sin(angle*Math.PI/-180)*-distance;}
    static rotateXY(angle,x,y,pivotX=0,pivotY=0) {
        function rot(angle,x,y) {
            let cos=Math.cos(angle*(Math.PI/180)), sin=Math.sin(angle*(Math.PI/180)); 
            return {x:(cos*x)-(sin*y),y:(cos*y)+(sin*x)}; // jtankersley, 1989-2019
        }
        return rot(angle, x-pivotX, y-pivotY);
    }
    rotate(angle,pivotX=0,pivotY=0) {const {x,y}=Point.rotateXY(angle,this.x,this.y,pivotX,pivotY); this.x=x+pivotX; this.y=y+pivotY;}
    shift(angle,distance) {this.x+=Point.shiftX(angle,distance); this.y+=Point.shiftY(angle,distance);}
}

// 2d shape base class
class Control {
    constructor(params={}) {for (var prop in params) {this[prop]=params[prop]}}
    draw_text(ctx,x,y,text,stroke='black',fill='lightgray') {
        ctx.font=this.font?this.font:"18px Arial";
        let width=ctx.measureText(text).width,height=parseInt(ctx.font.match(/\d+/),10);
        let textX=x+width/-2, textY=y+height/3;
        ctx.strokeStyle=stroke; ctx.strokeText(text,textX,textY);
        ctx.fillStyle=fill; ctx.fillText(text,textX,textY);
    }
    buildText() {return `${this.name}`;}
}

// 2d label class
class Label extends Control {
    constructor (params={x:0,y:0,color:'black'}) {super(params)}
    draw(ctx) {if (this.text) {this.draw_text(ctx,this.x,this.y,this.text)}}
}

// particle (photon, axis=polarization degrees) class
class Particle extends Control {
    constructor(params={x:0,y:0,radius:0,axis:0,color1:'orange',color2:'indigo',type:'Real',lost:false}) {super(params)}
    draw(ctx) {
        function draw_arc(x,y,r,start,end,color) {
            let rad1=(start+0)*Math.PI/180, rad2=(end+0)*Math.PI/180;
            let grad=ctx.createRadialGradient(x,y,0,x,y,r);
            grad.addColorStop(0,color); grad.addColorStop(1,'white'); ctx.fillStyle=grad;
            ctx.beginPath(); ctx.arc(x,y,r,rad1,rad2); ctx.fill();
        }
        const x=this.x, y=this.y, r=this.radius, axis=this.axis, type=this.type, lost=this.lost;
        const qcolor='lightgray', col1=(type=='QT'||lost)?qcolor:this.color1, col2=(type=='QT'||lost)?qcolor:this.color2, text=(type=='QT'||lost)?'?':this.text;
        if (axis===undefined) {draw_arc(x,y,r,0,360,qcolor)}
        else {draw_arc(x,y,r,axis+90,axis+180+90,col1); draw_arc(x,y,r,axis+180+90,axis+90,col2)}
        if (text) {this.draw_text(ctx,x,y,text,'black','white');}
    }
    shift (angle,distance) {this.x+=Point.shiftX(angle,distance); this.y+=Point.shiftY(angle,distance)}
    buildText() {return (["+","-"].includes(this.polarized)) ? this.polarized : `${roundTo(this.axis,1)}°`}
    getStatus() {return (this.lost) ? "<i>lost</i>" : this.polarized}
}

// 2d gauge (visualize polarization axis degrees) class
class Gauge extends Control {
    constructor(params={x:0,y:0,radius:0,axis:0,color1:'gray',color2:'yellow'}) {super(params)}
    draw(ctx) {
        function draw_arc(x,y,r,start,end,color) {
            let rad1=(start+0)*Math.PI/180, rad2=(end+0)*Math.PI/180;
            let grad=ctx.createRadialGradient(x,y,0,x,y,r);
            grad.addColorStop(0,color); grad.addColorStop(1,'white'); ctx.fillStyle=grad;
            ctx.beginPath(); ctx.arc(x,y,r,rad1,rad2); ctx.fill();
        }
        const x=this.x, y=this.y, r=this.radius, axis=this.axis;
        const col1=this.color1, col2=this.color2, text=this.text;
        draw_arc(x,y,r,axis+90,axis+180+90,col1); draw_arc(x,y,r,axis+180+90,axis+90,col2); 
    }
}

// 2d circle class
class CircleControl extends Control {
    constructor(params={x:0,y:0,radius:0,color:'blue'}) {super(params)}
    draw(ctx) {
        function draw_circle(x,y,r,color) {
            let rad1=(0)*Math.PI/180, rad2=(360)*Math.PI/180;
            ctx.beginPath(); ctx.arc(x,y,r,rad1,rad2); ctx.strokeStyle=color; ctx.stroke();
        }
        let x=this.x, y=this.y, radius=this.radius, color=this.color;
        draw_circle(x,y,radius,color); 
        if (this.text) {this.draw_text(ctx,x,y,this.text);}
    }
}

// 2d rectangle class
class RectControl extends Control {
    constructor(params={x:0,y:0, width:0, height:0, axis:0, color:'blue'}) {super(params)}
    draw(ctx) {
        function draw_rect(x,y,w,h,axis,color) {
            let hW=Math.round(w/2), hH=Math.round(h/2);
            let lP1=new Point({x:x-hW,y:y-hH}), lP2=new Point({x:x-hW,y:y+hH});
            let rP1=new Point({x:x+hW,y:y-hH}), rP2=new Point({x:x+hW,y:y+hH});
            lP1.rotate(axis,x,y); lP2.rotate(axis,x,y); rP1.rotate(axis,x,y); rP2.rotate(axis,x,y);
            ctx.beginPath(); ctx.moveTo(lP1.x,lP1.y);
            ctx.lineTo(rP1.x,rP1.y); ctx.lineTo(rP2.x,rP2.y); ctx.lineTo(lP2.x,lP2.y); ctx.lineTo(lP1.x,lP1.y);
            ctx.strokeStyle=color; ctx.stroke();
        }
        let x=this.x, y=this.y, w=this.width, h=this.height, axis=this.axis, color=this.color;
        draw_rect(x,y,w,h,axis,color); 
        if (this.text) {this.draw_text(ctx,x,y,this.text);}
    }
}

// polarizer class (axis=polarization degrees)
class Polarizer extends Control {
    constructor(params={x:0,y:0, width:0, height:0, axis:0, zAxis:0, color:'blue'}) {super(params)}
    draw(ctx) {
        function draw_rect(x,y,w,h,axis,color) {
            let hW=Math.round(w/2), hH=Math.round(h/2);
            let lP1=new Point({x:x-hW,y:y-hH}), lP2=new Point({x:x-hW,y:y+hH});
            let rP1=new Point({x:x+hW,y:y-hH}), rP2=new Point({x:x+hW,y:y+hH});
            lP1.rotate(axis-45,x,y); lP2.rotate(axis-45,x,y); rP1.rotate(axis-45,x,y); rP2.rotate(axis-45,x,y);
            ctx.beginPath(); ctx.moveTo(lP1.x,lP1.y);
            ctx.lineTo(rP1.x,rP1.y); ctx.lineTo(rP2.x,rP2.y); ctx.lineTo(lP2.x,lP2.y); ctx.lineTo(lP1.x,lP1.y);
            ctx.moveTo(rP1.x,rP1.y); ctx.lineTo(lP2.x,lP2.y);
            ctx.strokeStyle=color; ctx.stroke();
        }
        const x=this.x, y=this.y, w=this.width, h=this.height, axis=this.axis, zAxis=this.zAxis, rotate=this.rotate, color=this.color;
        draw_rect(x,y,w,h,this.zAxis,color); 
        if (this.text) {this.draw_text(ctx,x,y,this.text);}
    }
    buildText() {return `${this.name}=${this.axis}°`;}
}

// 2d detector visualization
class Detector extends Control {
    constructor(params={x:0,y:0, width:0, height:0, axis:0, color:'blue'}) {super(params)}
    draw(ctx) {
        function draw_rect(x,y,w,h,axis,color) {
            let hW=Math.round(w/2), hH=Math.round(h/2);
            let lP1=new Point({x:x,y:y-hH}), lP2=new Point({x:x,y:y+hH});
            let rP1=new Point({x:x+hW,y:y-hH}), rP2=new Point({x:x+hW,y:y+hH});
            lP1.rotate(axis-90,x,y); lP2.rotate(axis-90,x,y); rP1.rotate(axis-90,x,y); rP2.rotate(axis-90,x,y);
            ctx.beginPath(); ctx.moveTo(lP1.x,lP1.y);
            ctx.lineTo(rP1.x,rP1.y); ctx.lineTo(rP2.x,rP2.y); ctx.lineTo(lP2.x,lP2.y);
            let rad1=(axis)*Math.PI/180, rad2=(axis+180)*Math.PI/180, r=hW;
            let dP=new Point({x:x,y:y});
            ctx.arc(dP.x,dP.y,r,rad1,rad2);
            ctx.strokeStyle=color; ctx.stroke();
        }
        const x=this.x, y=this.y, w=this.width, h=this.height, axis=this.axis, color=this.color, pol=this.pol, text=this.text;
        draw_rect(x,y,w,h,axis,color); 
        if (text) {this.draw_text(ctx,x,y,text)}
    }
}

// 2d emitter (source) visualization class
class Emitter extends CircleControl {constructor (params) {super(params)}}

// Experiment class
class Experiment {
    constructor(params={canvas, context, canHead, canFoot, header1, terminal1, footer1, statusBar}) {
        for (var prop in params) {this[prop]=params[prop];}
    }
    init () {
        // properties
        this.rate=eid('rate').value;
        this.phase=0;
        this.distance=0;
        this.statText='';
        this.totals={
            "Count":0, 
            "C1":0, "C2":0, "C3":0, "C4":0, 
            "Detected1":0, "Detected2":0, "Detected3":0, "Detected4":0,
            "E1":0, "E2":0, "E3":0, "E4":0, 
            "J":0,
            "Lost":0, "Lost1":0, "Lost2":0, "Lost3":0, "Lost4":0,
            "S":0, "S1":0, "S2":0
        };
        this.debug={};

        // Custom Settings
        const isCustom = (this.mode.value=='Custom');
        setVis(eid('custom'),isCustom);
        this.polarizeA1 = (isCustom) ? Number(eid('polarizeA1').value) : 0;
        this.polarizeA2 = (isCustom) ? Number(eid('polarizeA2').value) : 45;
        this.polarizeB1 = (isCustom) ? Number(eid('polarizeB1').value) : 22.5;
        this.polarizeB2 = (isCustom) ? Number(eid('polarizeB2').value) : 67.5;
        this.polarizeMode = (isCustom) ? eid('polarizeMode').value : this.mode.value;
        this.detectMode = (isCustom) ? eid('detectMode').value : this.mode.value;
        
        // report 1 (a, b)
        this.report1=[
            {row:1, key:'++',a:"+",b:"+",count:0,total:0},
            {row:2, key:'+-',a:"+",b:"-",count:0,total:0},
            {row:3, key:'-+',a:"-",b:"+",count:0,total:0},
            {row:4, key:'--',a:"-",b:"-",count:0,total:0},
            {row:5, key:'+!',a:"+",b:"!",count:0,total:0},
            {row:6, key:'-!',a:"-",b:"!",count:0,total:0},
            {row:7, key:'!+',a:"!",b:"+",count:0,total:0},
            {row:8, key:'!-',a:"!",b:"-",count:0,total:0},
            {row:9, key:'!!',a:"!",b:"!",count:0,total:0}
        ];
        this.report1Indexes={'++':0,'+-':1,'-+':2,'--':3,'+!':4,'-!':5,'!+':6,'!-':7,'!!':8};
        
        // report 2 (a, b′)
        this.report2=[
            {row:1, key:'++',a:"+",b:"+",count:0,total:0},
            {row:2, key:'+-',a:"+",b:"-",count:0,total:0},
            {row:3, key:'-+',a:"-",b:"+",count:0,total:0},
            {row:4, key:'--',a:"-",b:"-",count:0,total:0},
            {row:5, key:'+!',a:"+",b:"!",count:0,total:0},
            {row:6, key:'-!',a:"-",b:"!",count:0,total:0},
            {row:7, key:'!+',a:"!",b:"+",count:0,total:0},
            {row:8, key:'!-',a:"!",b:"-",count:0,total:0},
            {row:9, key:'!!',a:"!",b:"!",count:0,total:0}
        ];
        this.report2Indexes={'++':0,'+-':1,'-+':2,'--':3,'+!':4,'-!':5,'!+':6,'!-':7,'!!':8};
        
        // report 3 (a′, b)
        this.report3=[
            {row:1, key:'++',a:"+",b:"+",count:0,total:0},
            {row:2, key:'+-',a:"+",b:"-",count:0,total:0},
            {row:3, key:'-+',a:"-",b:"+",count:0,total:0},
            {row:4, key:'--',a:"-",b:"-",count:0,total:0},
            {row:5, key:'+!',a:"+",b:"!",count:0,total:0},
            {row:6, key:'-!',a:"-",b:"!",count:0,total:0},
            {row:7, key:'!+',a:"!",b:"+",count:0,total:0},
            {row:8, key:'!-',a:"!",b:"-",count:0,total:0},
            {row:9, key:'!!',a:"!",b:"!",count:0,total:0}
        ];
        this.report3Indexes={'++':0,'+-':1,'-+':2,'--':3,'+!':4,'-!':5,'!+':6,'!-':7,'!!':8};
        
        // report 4 (a′, b′)
        this.report4=[
            {row:1, key:'++',a:"+",b:"+",count:0,total:0},
            {row:2, key:'+-',a:"+",b:"-",count:0,total:0},
            {row:3, key:'-+',a:"-",b:"+",count:0,total:0},
            {row:4, key:'--',a:"-",b:"-",count:0,total:0},
            {row:5, key:'+!',a:"+",b:"!",count:0,total:0},
            {row:6, key:'-!',a:"-",b:"!",count:0,total:0},
            {row:7, key:'!+',a:"!",b:"+",count:0,total:0},
            {row:8, key:'!-',a:"!",b:"-",count:0,total:0},
            {row:9, key:'!!',a:"!",b:"!",count:0,total:0}
        ];
        this.report4Indexes={'++':0,'+-':1,'-+':2,'--':3,'+!':4,'-!':5,'!+':6,'!-':7,'!!':8};

        // emitter (source)
        this.emitterS = new Emitter({x:300,y:150,radius:20,color:'skyblue',name:"S"});
        const emitterS=this.emitterS;
        emitterS.text=emitterS.buildText();

        // particles
        this.photonA = new Particle({x:300,y:150,radius:20,axis:0,color1:'orange',color2:'skyblue',name:"a",polarized:"",type:'Real',lost:false});
        this.photonB = new Particle({x:300,y:150,radius:20,axis:0,color1:'orange',color2:'skyblue',name:"b",polarized:"",type:'Real',lost:false});
        const photonA=this.photonA, photonB=this.photonB;
        photonA.text=photonA.buildText(); photonB.text=photonB.buildText();

        // Polarizers
        this.polarizerA = new Polarizer({x:150,y:150,width:40,height:40,axis:this.polarizeA1,zAxis:45,color:'indianred',name:"a"});
        this.polarizerB = new Polarizer({x:450,y:150,width:40,height:40,axis:this.polarizeB1,zAxis:-45,color:'indianred',name:"b"});
        const polarizerA=this.polarizerA, polarizerB=this.polarizerB;
        polarizerA.text=polarizerA.buildText(); polarizerB.text=polarizerB.buildText();

        // Gauges
        this.gaugeA = new Gauge({x:150,y:150,radius:60,axis:polarizerA.axis,color1:'greenyellow',color2:'yellowgreen'});
        this.gaugeB = new Gauge({x:450,y:150,radius:60,axis:polarizerB.axis,color1:'greenyellow',color2:'yellowgreen'});
        
         // Detectors
        this.detectorA1 = new Detector({x:50,y:150,width:40,height:40,axis:90,color:'green',name:"D+"});
        this.detectorA2 = new Detector({x:150,y:250,width:40,height:40,axis:0,color:'green',name:"D-"});
        this.detectorB1 = new Detector({x:550,y:150,width:40,height:40,axis:-90,color:'green',name:"D+"});
        this.detectorB2 = new Detector({x:450,y:250,width:40,height:40,axis:0,color:'green',name:"D-"});
        const detectorA1=this.detectorA1, detectorA2=this.detectorA2, detectorB1=this.detectorB1, detectorB2=this.detectorB2;
        detectorA1.text=detectorA1.buildText();
        detectorA2.text=detectorA2.buildText();
        detectorB1.text=detectorB1.buildText();
        detectorB2.text=detectorB2.buildText();     
        
        // Labels
        this.lab0 = new Label({x:300,y:50,color:'blue',name:imageTitle,font:"18px Arial"});
        this.lab1 = new Label({x:50,y:50,color:'black',name:"A",font:"36px Arial"});
        this.lab2 = new Label({x:550,y:50,color:'black',name:"B",font:"36px Arial"});
        this.lab0.text=this.lab0.buildText(); this.lab1.text=this.lab1.buildText(); this.lab2.text=this.lab2.buildText();     
        
        // text
        this.canHead.innerHTML=`${textJson.canHead}`;
        this.canFoot.innerHTML=`${textJson.canFoot}`;
        this.header1.innerHTML=`${textJson.header1}`;
        this.header2.innerHTML=`${textJson.header2}`;
        this.header3.innerHTML=`${textJson.header3}`;
        this.header4.innerHTML=`${textJson.header4}`;
        this.header5.innerHTML=`${textJson.header5}`;
        this.footer1.innerHTML=`${textJson.footer1}`;
        this.footer2.innerHTML=`${textJson.footer2}`;
        this.footer3.innerHTML=`${textJson.footer3}`;
        this.footer4.innerHTML=`${textJson.footer4}`;
        this.footer5.innerHTML=`${textJson.footer5}`;

        // draw
        this.clear();
        this.drawEmitters();
        this.drawPolarizers();
        this.drawDetectors();
        this.drawLabels();
        this.drawParticles();

        // report
        this.updateReports({updateTotals:false});
        this.updateStatus();
    }
    drawEmitters () {
        const ctx=this.context;
        this.emitterS.draw(ctx);
    }
    drawPolarizers () {
        const ctx=this.context;
        this.gaugeA.draw(ctx); this.gaugeB.draw(ctx); this.polarizerA.draw(ctx); this.polarizerB.draw(ctx);
    }
    drawDetectors () {
        const ctx=this.context;
        this.detectorA1.draw(ctx); this.detectorA2.draw(ctx); this.detectorB1.draw(ctx); this.detectorB2.draw(ctx);
    }
    drawLabels () {
        const ctx=this.context;
        this.lab0.draw(ctx); this.lab1.draw(ctx); this.lab2.draw(ctx);
    }
    drawParticles () {
        const ctx=this.context;
        this.photonA.draw(ctx); this.photonB.draw(ctx);
    }
    
    // Timed Experiment Steps (photon movement, then polarization and detection)
    step (time) {

        // Quantum Anti-Correlated Calculations (wave collapse, communicating particles)
        function getQuantumAntiPolarized(photonA,photonB,polarizerA,polarizerB,side,randomNumber) {
            let polarized="", delta, cosDelta, probability;
            if (side==1) {
                delta=Math.abs(Math.abs(polarizerA.axis)-Math.abs(photonA.axis)), cosDelta=Math.cos(delta*Math.PI/180), probability=cosDelta*cosDelta;
                polarized=(randomNumber<=probability) ? "+" : "-";  // cos^2(x) probability, 1=passthrough(+), 0=reflect(-)
                photonA.type='Real';
                photonB.axis= (polarizerA.axis>=180) ? polarizerA.axis-180 : polarizerA.axis+180;  // anti-correlate entangled particle
            } else {
                delta=Math.abs(Math.abs(polarizerB.axis)-Math.abs(photonB.axis)), cosDelta=Math.cos(delta*Math.PI/180), probability=cosDelta*cosDelta;
                polarized=(randomNumber<=probability) ? "+" : "-";  // cos^2(x) probability, 1=passthrough(+), 0=reflect(-)
                photonB.type='Real';
                photonA.axis= (polarizerB.axis>=180) ? polarizerB.axis-180 : polarizerB.axis+180;  // anti-correlate entangled particle
            }
            return polarized; // f(x)=communicating probability, 1=passthrough(+), 0=reflect(-)
        }
        function getQuantumAntiDetected() {return true}

        // Quantum_Theory Calculations (wave collapse, communicating particles)
        function getQuantumTheoryPolarized(photonA,photonB,polarizerA,polarizerB,side,randomNumber) {
            let polarized="";
            const delta=Math.abs(Math.abs(polarizerB.axis)-Math.abs(polarizerA.axis)), cosDelta=Math.abs(Math.cos(delta*Math.PI/180)), probability=cosDelta*cosDelta;
            if (side==1) {
                if (photonB.type=='Real') {
                    if (photonB.polarized==="+") {polarized=(randomNumber<=probability)?"+":"-"} else {polarized=(randomNumber<=probability)?"-":"+"}
                    photonA.type='Real';
                } else {
                    polarized=(randomNumber>=0.5) ? "+" : "-";
                    photonA.type='Real';
                }
            } else {
                if (photonA.type=='Real') {
                    if (photonA.polarized==="+") {polarized=(randomNumber<=probability)?"+":"-"} else {polarized=(randomNumber<=probability)?"-":"+"}
                    photonB.type='Real';
                } else {
                    polarized=(randomNumber>=0.5) ? "+" : "-";
                    photonB.type='Real';
                }
            }
            return polarized; // f(x)=communicating probability, 1=passthrough(+), 0=reflect(-)
        }
        function getQuantumTheoryDetected() {return true}
        
        // Karma Peny Calculations
        function getKarmaPenyPolarized(photon_degrees, polarizer_degrees) {
            const delta=Math.abs(Math.abs(polarizer_degrees)-Math.abs(photon_degrees)), cosDelta=Math.cos(delta*Math.PI/180), cosSqrDelta=cosDelta*cosDelta;
            return (cosSqrDelta>=0.5)?"+":"-";  // f(x)=non-probabilistic, 1=passthrough(+), 0=reflect(-)
        }
        function getKarmaPenyDetected(photon_degrees, polarizer_degrees, randomNumber) {
            const delta=Math.abs(Math.abs(polarizer_degrees)-Math.abs(photon_degrees)), probability=Math.abs(Math.cos((delta+delta)*Math.PI/180));
            return (randomNumber<=0.37+(0.63*probability))?true:false;  // f(x) probability, 1=detected, 0=not detected
        }
        
        // Realistic Calculations
        function getRealisticPolarized(photon_degrees, polarizer_degrees, randomNumber) {
            const delta=Math.abs(Math.abs(polarizer_degrees)-Math.abs(photon_degrees)), cosDelta=Math.cos(delta*Math.PI/180), probability=cosDelta*cosDelta;
            return (randomNumber<=probability)?"+":"-";  // cos^2(x) probability, 1=passthrough(+), 0=reflect(-)
        }
        function getRealisticDetected(photon_degrees, polarizer_degrees, randomNumber) {
            const delta=Math.abs(Math.abs(polarizer_degrees)-Math.abs(photon_degrees)), cos2Delta=Math.cos((delta+delta)*Math.PI/180), probability=cos2Delta*cos2Delta;
            return (randomNumber<=probability)?true:false; // cos^2(2x) probability, 1=detected, 0=not detected
        }
        
        // Perfect Calculations
        function getPerfectPolarized(photon_degrees, polarizer_degrees) {
            const delta=Math.abs(Math.abs(polarizer_degrees)-Math.abs(photon_degrees)), cosDelta=Math.cos(delta*Math.PI/180), cosSqrDelta=cosDelta*cosDelta;
            return (cosSqrDelta>=0.5)?"+":"-";  // f(x)=non-probabilistic, 1=passthrough(+), 0=reflect(-)
        }
        function getPerfectDetected() {
            return true; // f(x)=1, 1=detected, 0=not detected
        }

        // Test Calculations
        function getTestPolarized(photon_degrees, polarizer_degrees, randomNumber) {
            const delta=Math.abs(Math.abs(polarizer_degrees)-Math.abs(photon_degrees)), cosDelta=Math.cos(delta*Math.PI/180), probability=cosDelta*cosDelta;
            return (randomNumber<=probability)?"+":"-";  // cos^2(x) probability, 1=passthrough(+), 0=reflect(-)
        }
        function getTestDetected(photon_degrees, polarizer_degrees, randomNumber) {
            const delta=Math.abs(Math.abs(polarizer_degrees)-Math.abs(photon_degrees)), cos2Delta=Math.cos((delta+delta)*Math.PI/180), probability=cos2Delta*cos2Delta; // probability=0+(1*cos2Delta);
            return (randomNumber<=probability)?true:false; // cos^2(2x) probability, 1=detected, 0=not detected
        }

        // Polarize photon as vertical or horizontal
        function getNewAxis(dAxis,polarized,passAdd,reflectAdd) {return (polarized==="+") ? dAxis+passAdd : dAxis+reflectAdd;}
        
        // Exerpiment Steps
        this.timeLast=this.timeLast?this.timeLast:time;  this.timeDiff=time-this.timeLast; this.timeLast=time;
        const photonA=this.photonA, photonB=this.photonB, polarizerA=this.polarizerA, polarizerB=this.polarizerB, gaugeA=this.gaugeA, gaugeB=this.gaugeB, mode=this.mode.value, debug=this.debug;
        const startX=300, midX=450, endX=600, startY=150, endY=300, gapPix=50, sec=this.timeDiff/1000, perSec=this.rate/60, movePix=sec*perSec*(endX-startX);

        // Phase 0, Initialize new particle
        if (this.phase===0) {
            this.animate=eid("animateChk").checked;  // start|stop animation
            this.phase=1;
            this.distance=0;
            if (mode=='Quantum_Theory' || mode=='Quantum_Anti') {
                photonA.type='QT'; photonA.lost=false; photonA.polarized=""; photonA.axis=undefined;
                photonB.type='QT'; photonB.lost=false; photonB.polarized=""; photonB.axis=undefined;         
            } else {
                const axis=random.number()*360;  // fixed (Mark Payne, 2019-11-23)
                photonA.type='Real'; photonA.lost=false; photonA.polarized=""; photonA.axis=axis; 
                photonB.type='Real'; photonB.lost=false; photonB.polarized=""; photonB.axis= (axis>=180) ? axis-180 : axis+180;  // created with opposite polarization
            }
            polarizerA.prime=Math.round(random.number())==1?true:false;
            polarizerB.prime=Math.round(random.number())==1?true:false;
            if (polarizerA.prime) {polarizerA.axis=this.polarizeA2; polarizerA.name=`a${primeChr}`} else {polarizerA.axis=this.polarizeA1; polarizerA.name='a'}
            if (polarizerB.prime) {polarizerB.axis=this.polarizeB2; polarizerB.name=`b${primeChr}`} else {polarizerB.axis=this.polarizeB1; polarizerB.name='b'}
            
            // animation (initialize)
            if (this.animate) {
                photonA.x=startX; photonA.y=startY; photonA.text=photonA.buildText();
                photonB.x=startX; photonB.y=startY; photonB.text=photonB.buildText();
                gaugeA.axis=polarizerA.axis; gaugeB.axis=polarizerB.axis;
                polarizerA.text=polarizerA.buildText(); polarizerB.text=polarizerB.buildText();
            }
        }

        // Phase 1, Travel to Polarizer 
        if (this.phase===1) {
            this.distance+=movePix;
            if (this.distance>=(midX-startX)) {this.phase=2; this.distance=(midX-startX)}
            
            // animation (move)
            if (this.animate) {
                if (this.distance>=(midX-startX)) {
                    photonA.x=startX-(midX-startX); photonA.y=startY;
                    photonB.x=midX; photonB.y=startY;
                } else {
                    photonA.moveX=-movePix; photonA.x+=photonA.moveX; // photonA.moveY=0; photonA.y+=photonA.moveY;
                    photonB.moveX=movePix; photonB.x+=photonB.moveX; // photonB.moveY=0; photonB.y+=photonB.moveY;
                }
            }
        }

        // Phase 2 - Polarize
        if (this.phase==2) {
            // Calculated Polarization ("+"=pass-through, "-"=Reflected)
            if (this.polarizeMode=='Quantum_Anti') {
                if (random.number()>=0.5) {
                    // photon 1 encounters polarizer first (first measurement)
                    photonA.axis=random.number()*360; 
                    photonA.polarized=getQuantumAntiPolarized(photonA, photonB, polarizerA, polarizerB, 1, random.number());
                    photonB.polarized=getQuantumAntiPolarized(photonA, photonB, polarizerA, polarizerB, 2, random.number());;
                } else {
                    // photon 2 encounters polarizer first (first measurement)
                    photonB.axis=random.number()*360;
                    photonB.polarized=getQuantumAntiPolarized(photonA, photonB, polarizerA, polarizerB, 2, random.number());
                    photonA.polarized=getQuantumAntiPolarized(photonA, photonB, polarizerA, polarizerB, 1, random.number());
                }
            }
            if (this.polarizeMode=='Quantum_Theory') {
                if (random.number()>=0.5) {
                    // photon 1 encounters polarizer first (first measurement)
                    photonA.polarized=getQuantumTheoryPolarized(photonA, photonB, polarizerA, polarizerB, 1, random.number());
                    photonB.polarized=getQuantumTheoryPolarized(photonA, photonB, polarizerA, polarizerB, 2, random.number());
                } else {
                    // photon 2 encounters polarizer first (first measurement)
                    photonB.polarized=getQuantumTheoryPolarized(photonA, photonB, polarizerA, polarizerB, 2, random.number());
                    photonA.polarized=getQuantumTheoryPolarized(photonA, photonB, polarizerA, polarizerB, 1, random.number());
                }
            }
            if (this.polarizeMode=='Karma_Peny') {
                photonA.polarized=getKarmaPenyPolarized(photonA.axis, polarizerA.axis);
                photonB.polarized=getKarmaPenyPolarized(photonB.axis, polarizerB.axis);
            }
            if (this.polarizeMode=='Realistic' || this.polarizeMode=='Real_Perfect') {
                photonA.polarized=getRealisticPolarized(photonA.axis, polarizerA.axis, random.number());
                photonB.polarized=getRealisticPolarized(photonB.axis, polarizerB.axis, random.number());
            }
            if (this.polarizeMode=='Perfect') {
                photonA.polarized=getPerfectPolarized(photonA.axis, polarizerA.axis);
                photonB.polarized=getPerfectPolarized(photonB.axis, polarizerB.axis);
            }
            if (this.polarizeMode=='Test') {
                photonA.polarized=getTestPolarized(photonA.axis, polarizerA.axis, random.number());
                photonB.polarized=getTestPolarized(photonB.axis, polarizerB.axis, random.number());
            }
            
            // Calculate Detected at all (lost or not)
            if (this.detectMode=='Quantum_Theory') {
                photonA.lost=!getQuantumTheoryDetected();
                photonB.lost=!getQuantumTheoryDetected();
            }
            if (this.detectMode=='Quantum_Anti') {
                photonA.lost=!getQuantumAntiDetected();
                photonB.lost=!getQuantumAntiDetected();
            }
            if (this.detectMode=='Karma_Peny') {
                photonA.lost=!getKarmaPenyDetected(photonA.axis, polarizerA.axis ,random.number());
                photonB.lost=!getKarmaPenyDetected(photonB.axis, polarizerB.axis, random.number());
            }
            if (this.detectMode=='Realistic') {
                photonA.lost=!getRealisticDetected(photonA.axis, polarizerA.axis, random.number());
                photonB.lost=!getRealisticDetected(photonB.axis, polarizerB.axis, random.number());
            }
            if (this.detectMode=='Perfect' || this.detectMode=='Real_Perfect') {
                photonA.lost=!getPerfectDetected(photonA.axis, polarizerA.axis);
                photonB.lost=!getPerfectDetected(photonB.axis, polarizerB.axis);
            }
            if (this.detectMode=='Test') {
                photonA.lost=!getTestDetected(photonA.axis, polarizerA.axis, random.number());
                photonB.lost=!getTestDetected(photonB.axis, polarizerB.axis, random.number());
            }

            // Calculate Axis
            photonA.origAxis=photonA.axis; photonA.axis=getNewAxis(polarizerA.axis, photonA.polarized, 0, 90);
            photonB.origAxis=photonB.axis; photonB.axis=getNewAxis(polarizerB.axis, photonB.polarized, 0, 90);

            // animation 
            if (this.animate) {
                // calculate trignometric move ratios
                photonA.text=photonA.buildText(); photonB.text=photonB.buildText();
                if (photonA.polarized==="-") {let moveAngle=polarizerA.zAxis+45; photonA.moveCos=Math.cos(moveAngle*(Math.PI/180)); photonA.moveSin=Math.sin(moveAngle*(Math.PI/180))}
                else {let moveAngle=polarizerA.zAxis-45; photonA.moveCos=Math.cos(moveAngle*(Math.PI/180)); photonA.moveSin=Math.sin(moveAngle*(Math.PI/180))}
                if (photonB.polarized==="-") {let moveAngle=polarizerB.zAxis-45; photonB.moveCos=Math.cos(moveAngle*(Math.PI/180)); photonB.moveSin=Math.sin(moveAngle*(Math.PI/180))}
                else {let moveAngle=polarizerB.zAxis+45; photonB.moveCos=Math.cos(moveAngle*(Math.PI/180)); photonB.moveSin=Math.sin(moveAngle*(Math.PI/180))}
            }
                
            // Update report and status
            this.updateReports({updateTotals:true});
            this.statText=`(${photonA.getStatus()},${photonB.getStatus()})`;
            this.updateStatus();
            this.phase=3;
        }
        
        // Phase 3 - Travel to Detector
        if (this.phase===3) {
            this.distance+=movePix;
            if (this.distance>=(endX-startX)) {this.phase=0}  // restart
            
            // animation
            if (this.animate) {
                if (this.distance>=(endX-startX-gapPix)) {
                    // stop at detector
                    if (!photonA.lost) {
                        if (photonA.polarized==="+") {photonA.x=startX-(endX-startX)+gapPix; photonA.y=startY}
                        else {photonA.x=startX-(midX-startX); photonA.y=endY-gapPix}
                    }
                    if (!photonB.lost) {
                        if (photonB.polarized==="+") {photonB.x=endX-gapPix; photonB.y=startY}
                        else {photonB.x=midX; photonB.y=endY-gapPix}
                    }
                } else {
                    // calculate move increment
                    if (photonA.lost) {photonA.moveX=0; photonA.moveY=0}
                    else {
                        if (photonA.polarized==="-") {photonA.moveX=movePix*photonA.moveCos; photonA.moveY=movePix*photonA.moveSin}
                        else {photonA.moveX=-movePix*photonA.moveCos; photonA.moveY=-movePix*photonA.moveSin}
                    }
                    if (photonB.lost) {photonB.moveX=0; photonB.moveY=0}
                    else {
                        if (photonB.polarized==="-") {photonB.moveX=-movePix*photonB.moveCos; photonB.moveY=-movePix*photonB.moveSin}
                        else {photonB.moveX=movePix*photonB.moveCos; photonB.moveY=movePix*photonB.moveSin}
                    }
                    // move
                    photonA.x+=photonA.moveX; photonA.y+=photonA.moveY;
                    photonB.x+=photonB.moveX; photonB.y+=photonB.moveY;
                }
            }
        }

        // Animation (Draw Experiment)
        if (this.animate) {
            this.clear();
            this.drawEmitters();
            this.drawPolarizers();
            this.drawDetectors();
            this.drawLabels();
            this.drawParticles();
        }
    }
    
    // Experiment functions
    clear () {let cvs=this.canvas; context.clearRect(0,0,cvs.width,cvs.height);}
    reset () {
        var seed=prompt(textJson.promptSeed,`${randomSeed()}`);
        if (seed) {random.setSeed(seed); this.init(); return true}
    }
    start () {this.timeLast=window.performance.now()}
    stop () {}
    updateStatus () {this.statusBar.innerHTML=`<span'>${this.rate}/min ${this.statText}</span>`;}
    getHeaderHtml(reportRows,aName,bName,totalHead,expectHead,footNote) {
        return `
<table class='rpt-table'>
    <tr class='rpt-row rpt-head'>
        <td>Case</td><td>${aName}</td><td>${bName}</td><td>Count</td><td>${totalHead}</td><td class='rpt-note'>${expectHead}</td>
    </tr>${reportRows}
</table><div><i><small>${footNote}</small></i></div>`;
    }
    getRowHtml (num,a,b,tot,percent,note,cls) {
        return `<tr class='rpt-row ${cls}'><td class='rpt-title'>${num}</td>
        <td>${a}</td><td>${b}</td><td>${tot}</td><td>${percent}</td>
        <td class='rpt-note'>${note}</td></tr>`;
    }
    getRowHtmlFromRow (r, row, cls) {return this.getRowHtml(r,row.a,row.b,`<b>${row.count}</b>`,`${row.total>=0?row.total+'%':''}`,row.note,cls)}
    updateReports (params={updateTotals:false}) {
        function getRowIndex(photonA,photonB,reportIndexes) {
            const res1=photonA.lost?'!':photonA.polarized, res2=photonB.lost?'!':photonB.polarized;
            return reportIndexes[`${res1}${res2}`]}
        function getE(pp,pm,mp,mm) {
            let e1=pp-pm-mp+mm, e2=pp+pm+mp+mm;
            return e1/e2;
        }
        function seedStatus(seed) {
            var numSeeds = [seed].map(n => Number(n));
            if (numSeeds.indexOf(0) >= 0) {return "<span class='data-seed'>Non-repeatable seed</span>"}
            else {return `Seed: <span class='data-seed'>${numSeeds.join(', ')}</span>`}
        }

        // set constants and declare variables
        const photonA=this.photonA, photonB=this.photonB, polarizerA=this.polarizerA, polarizerB=this.polarizerB;
        const mode=this.mode.value, debug=this.debug, totals=this.totals, eberhard=eid('eberhardChk').checked, lossDetail=eid('lossDetailChk').checked;
        let header, terminal, report, reportIndex, reportIndexes, aValue, bValue;
        let aName, bName, cName, detectedName, eName, lostName, reportRows='', summaryRows='', reportStatus='';
        if (!polarizerA.prime && !polarizerB.prime) {
            header=this.header2; terminal=this.terminal2; report=this.report1; reportIndex=1;
            reportIndexes=this.report1Indexes; aValue=this.polarizeA1; bValue=this.polarizeB1;
            aName='a'; bName='b'; cName='C1'; detectedName='Detected1'; eName='E1'; lostName='Lost1';
        }
        if (!polarizerA.prime && polarizerB.prime) {
            header=this.header3; terminal=this.terminal3; report=this.report2; reportIndex=2;
            reportIndexes=this.report2Indexes; aValue=this.polarizeA1; bValue=this.polarizeB2;
            aName='a'; bName='b′'; cName='C2'; detectedName='Detected2'; eName='E2'; lostName='Lost2';
        }
        if (polarizerA.prime && !polarizerB.prime) {
            header=this.header4; terminal=this.terminal4; report=this.report3; reportIndex=3;
            reportIndexes=this.report3Indexes; aValue=this.polarizeA2; bValue=this.polarizeB1;
            aName='a′'; bName='b'; cName='C3'; detectedName='Detected3'; eName='E3'; lostName='Lost3';
        }
        if (polarizerA.prime && polarizerB.prime) {
            header=this.header5; terminal=this.terminal5; report=this.report4; reportIndex=4; 
            reportIndexes=this.report4Indexes; aValue=this.polarizeA2; bValue=this.polarizeB2;
            aName='a′'; bName='b′'; cName='C4'; detectedName='Detected4'; eName='E4';  lostName='Lost4';
        }
        const na="<i>n/a</i>", rowIndex=getRowIndex(photonA, photonB, reportIndexes);

        // Update Totals
        if (params.updateTotals===true) {
            report[rowIndex].count+=1;
            if (!photonA.lost && !polarizerA.prime) {
                if (photonB.lost) {totals.S1+=1}
            }
            if (!photonB.lost && !polarizerB.prime) {
                if (photonA.lost) {totals.S2+=1}
            }
            if (!photonA.lost && !photonB.lost) {
                totals[detectedName]+=1;
                totals.Count+=1;
                totals[cName]+=1;  // if (photonA.polarized===photonB.polarized) {totals[cName]+=1}
            } else {
                totals[lostName]+=1;
                totals.Lost+=1; 
            }
            totals[eName]=getE(report[0].total, report[1].total, report[2].total, report[3].total);
            totals.S = totals.E1 - totals.E2 + totals.E3 + totals.E4;
            totals.J = totals.C1 + totals.C2 + totals.C3 - totals.C4 - totals.S1 - totals.S2;
        }

        // Build Sub-Report 1,2,3 or 4 (display in terminal 2,3,4 or 5)
        for (let r=1; r<=4; r++) {
            report[r-1].total=roundTo((report[r-1].count/totals[detectedName])*100,1);
            report[r-1].note=reportExpected[`${reportIndex}`][r];
            reportRows+=this.getRowHtmlFromRow(`[${r}]`, report[r-1],'rpt-detail');
        }
        reportRows+=this.getRowHtml(`<b>${eName}</b>`,na,na,roundTo(totals[detectedName],4),`<b>${roundTo(totals[eName],4)}</b>`,reportExpected[`${reportIndex}`][5],'rpt-subtotal');
        
        // undetected rows 5-9
        if (lossDetail) {
            for (let r=5; r<=9; r++) { 
                report[r-1].total=roundTo((report[r-1].count/(totals[detectedName] + totals[lostName]))*100,1);
                report[r-1].note=reportExpected[`${reportIndex}`][r+1];
                reportRows+=this.getRowHtmlFromRow(`[${r}]`, report[r-1],'rpt-undetected');
            }
        }
        let lostTotal = (report[4].count + report[5].count + report[6].count + report[7].count + report[8].count) / (totals[detectedName] + totals[lostName]) * 100;
        reportRows+=this.getRowHtml(`${lostName}`,na,na,roundTo(totals[lostName],4),`${roundTo(lostTotal,1)}%`,reportExpected[`${reportIndex}`][11],'rpt-detect');
        
        // status
        if (mode=='Quantum_Theory' || mode=='Quantum_Anti') {reportStatus=`(${photonA.getStatus()},${photonB.getStatus()})`}
        else {reportStatus=`A=${roundTo(photonA.origAxis,1)}°, B=${roundTo(photonB.origAxis,1)}° (${photonA.getStatus()},${photonB.getStatus()})`}
        const eberhardStatus = (eberhard) ? `, <span class='rpt-subtotal'>C${reportIndex}=${totals[cName]}</span>` : "";
        header.innerHTML=`<b>Test Part ${reportIndex}</b> <i>(${aName}=${aValue}°, ${bName}=${bValue}°${eberhardStatus})</i><b>:</b></b><br>`;
        terminal.innerHTML=this.getHeaderHtml(reportRows, aName, bName, "Total", reportExpected[`${reportIndex}`][0], reportStatus);

        // Build Total Report 5 (display in terminal 1)
        this.header1.innerHTML=`<b>Totals</b> <i>(${mode}, ${seedStatus(random.seed)})</i><b>:</b><br>`;
        this.footer1.innerHTML=`<small><i>Random=${random.mode}, Seed=${random.seed}, Index=${random.index}, State=${random.state()}</i></small><br><br>`;
        summaryRows+=this.getRowHtml(`E1`,`${this.polarizeA1}°`,`${this.polarizeB1}°`, roundTo(totals.detect1,4),`${roundTo(totals.E1,4)}`,reportExpected['5'][1],'rpt-detail');
        summaryRows+=this.getRowHtml(`E2`,`${this.polarizeA1}°`,`${this.polarizeB2}°`, roundTo(totals.detect2,4),`${roundTo(totals.E2,4)}`,reportExpected['5'][2],'rpt-detail');
        summaryRows+=this.getRowHtml(`E3`,`${this.polarizeA2}°`,`${this.polarizeB1}°`,roundTo(totals.detect3,4),`${roundTo(totals.E3,4)}`,reportExpected['5'][3],'rpt-detail');
        summaryRows+=this.getRowHtml(`E4`,`${this.polarizeA2}°`,`${this.polarizeB2}°`,roundTo(totals.detect4,4),`${roundTo(totals.E4,4)}`,reportExpected['5'][4],'rpt-detail');
        summaryRows+=this.getRowHtml(`<b>S</b>`,na,na,  roundTo(totals.Count,4), `<b><big>${roundTo(totals.S,4)}</big></b>`, reportExpected['5'][5],'rpt-total');
        summaryRows+=this.getRowHtml(`Lost`,na,na,totals.Lost,`<i>${roundTo((totals.Lost/(totals.Count+totals.Lost))*100,1)}%</i>`,`<i>${reportExpected['5'][6]}</i>`,'rpt-detect');
        if (eberhard) {
            summaryRows+=this.getRowHtml(`C1`,na,na,totals.C1,na,`<i>${reportExpected['5'][7]}</i>`,'rpt-detail');
            summaryRows+=this.getRowHtml(`C2`,na,na,totals.C2,na,`<i>${reportExpected['5'][8]}</i>`,'rpt-detail');
            summaryRows+=this.getRowHtml(`C3`,na,na,totals.C3,na,`<i>${reportExpected['5'][9]}</i>`,'rpt-detail');
            summaryRows+=this.getRowHtml(`C4`,na,na,totals.C4,na,`<i>${reportExpected['5'][10]}</i>`,'rpt-detail');
            
            summaryRows+=this.getRowHtml(`S1`,na,na,totals.S1,na,`<i>${reportExpected['5'][11]}</i>`,'rpt-detail');
            summaryRows+=this.getRowHtml(`S2`,na,na,totals.S2,na,`<i>${reportExpected['5'][12]}</i>`,'rpt-detail');
            summaryRows+=this.getRowHtml(`<b>J</b>`,na,na,na,`<i><b>${roundTo(totals.J,1)}</b></i>`,`<i>${reportExpected['5'][13]}</i>`,'rpt-total');
        }
        this.terminal1.innerHTML=this.getHeaderHtml(summaryRows, 'a or a′', 'b or b′', "Total", reportExpected['5'][0], '');
        // setIdHtml('debug', `debug=${JSON.stringify(debug)}`);
    }
}
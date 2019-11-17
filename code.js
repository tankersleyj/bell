// variables
var degChr=String.fromCharCode(176), frwTck=String.fromCharCode(180), animationId=0, author='J.Tankersley', version='0.3.00';
var canvas, context, canHead, canFoot, terminal1, terminal2, statusBar, header1, header2, footer1, footer2, experiment;
// functions
function animationStart() {experiment.start(); animationId=window.requestAnimationFrame(animationStep)}
function animationStep(time) {experiment.step(time); animationId=window.requestAnimationFrame(animationStep)}
function animationStop() {if (animationId) {experiment.stop(); window.cancelAnimationFrame(animationId); animationId=0}}
function handleOnload() {
  canvas=document.getElementById("canvas"); 
  context=canvas.getContext("2d");
  canHead=document.getElementById("canHead");
  canFoot=document.getElementById("canFoot");
  terminal1=document.getElementById("terminal1");
  terminal2=document.getElementById("terminal2");
  statusBar=document.getElementById("statusBar");
  header1=document.getElementById("header1");
  header2=document.getElementById("header2");
  footer1=document.getElementById("footer1");
  footer2=document.getElementById("footer2"); 
  experiment=new Experiment({
      canvas:canvas, context:context, terminal1:terminal1, terminal2:terminal2,
      canHead:canHead, canFoot:canFoot, header1:header1, header2:header2, 
      footer1:footer1, footer2:footer2, statusBar:statusBar
  });
  setIdHtml('title',textJson.title); setIdHtml('author',author); setIdHtml('version',version);
  experiment.init();
  animationStart();
}
function handleRate(rate) {animationStop(); experiment.rate=rate; experiment.phase=0; experiment.updateStatus(); animationStart()}
function handleReset() {animationStop(); if (!experiment.reset()) {animationStart()}}
function handleStartStop() {if (animationId) {animationStop()} else {animationStart()}}
function roundTo(val,dec=0) {return Number.parseFloat(Number.parseFloat(val).toFixed(dec))}
function roundToStr(val,dec=0) {return Number.parseFloat(val).toFixed(dec)}
function setIdHtml(id,html) {document.getElementById(id).innerHTML=html}
// classes
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
class Label extends Control {
    constructor (params={x:0,y:0,color:'black'}) {super(params)}
    draw(ctx) {if (this.text) {this.draw_text(ctx,this.x,this.y,this.text)}}
}
class Particle extends Control {
    constructor(params={x:0,y:0,radius:0,axis:0,color1:'orange',color2:'indigo'}) {super(params)}
    draw(ctx) {
        function draw_arc(x,y,r,start,end,color) {
            let rad1=(start+0)*Math.PI/180, rad2=(end+0)*Math.PI/180;
            let grad=ctx.createRadialGradient(x,y,0,x,y,r);
            grad.addColorStop(0,color); grad.addColorStop(1,'white'); ctx.fillStyle=grad;
            ctx.beginPath(); ctx.arc(x,y,r,rad1,rad2); ctx.fill();
        }
        let x=this.x, y=this.y, r=this.radius, axis=this.axis, col1=this.color1, col2=this.color2;
        draw_arc(x,y,r,axis+90,axis+180+90,col1); draw_arc(x,y,r,axis+180+90,axis+90,col2); 
        if (this.text) {this.draw_text(ctx,x,y,this.text,'black','white');}
    }
    shift (angle,distance) {this.x+=Point.shiftX(angle,distance); this.y+=Point.shiftY(angle,distance);}
    buildText() {
        let resultText=['-','+'], axisText=roundTo(this.axis,1);
        return this.result in [0,1]?`${resultText[this.result]}`:`${axisText}${degChr}`;
    }
}
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
class Polarizer extends Control {
    constructor(params={x:0,y:0, width:0, height:0, axis:0, color:'blue'}) {super(params)}
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
        let x=this.x, y=this.y, w=this.width, h=this.height, axis=this.axis, color=this.color;
        draw_rect(x,y,w,h,axis,color); 
        if (this.text) {this.draw_text(ctx,x,y,this.text);}
    }
    buildText() {return `${this.name}=${this.axis}${degChr}`;}
}
class Detector extends Control {
    constructor(params={x:0,y:0, width:0, height:0, axis:0, color:'blue', pol:null}) {super(params)}
    draw(ctx) {
        function draw_rect(x,y,w,h,axis,color) {
            let hW=Math.round(w/2), hH=Math.round(h/2);
            let lP1=new Point({x:x,y:y-hH}), lP2=new Point({x:x,y:y+hH});
            let rP1=new Point({x:x+hW,y:y-hH}), rP2=new Point({x:x+hW,y:y+hH});
            lP1.rotate(axis,x,y); lP2.rotate(axis,x,y); rP1.rotate(axis,x,y); rP2.rotate(axis,x,y);
            if (pol) {lP1.rotate(detAxis,pol.x,pol.y); lP2.rotate(detAxis,pol.x,pol.y); rP1.rotate(detAxis,pol.x,pol.y); rP2.rotate(detAxis,pol.x,pol.y)}
            ctx.beginPath(); ctx.moveTo(lP1.x,lP1.y);
            ctx.lineTo(rP1.x,rP1.y); ctx.lineTo(rP2.x,rP2.y); ctx.lineTo(lP2.x,lP2.y);
            if (pol) {
                let rad1=(axis+detAxis+90)*Math.PI/180, rad2=(axis+detAxis+270)*Math.PI/180, r=hW;
                let dP=new Point({x:x,y:y});
                dP.rotate(detAxis,pol.x,pol.y);
                ctx.arc(dP.x,dP.y,r,rad1,rad2);
            } else {
                let rad1=(axis+90)*Math.PI/180, rad2=(axis+270)*Math.PI/180, r=hW;
                ctx.arc(x,y,r,rad1,rad2);
            }
            ctx.strokeStyle=color; ctx.stroke();
        }
        let x=this.x, y=this.y, w=this.width, h=this.height, axis=this.axis, color=this.color, pol=this.pol, detAxis=0;
        if (pol) {detAxis=pol.axis-45}
        draw_rect(x,y,w,h,axis,color); 
        if (this.text) {
            if (pol) {
                let tp=new Point({x:x,y:y});
                tp.rotate(detAxis,pol.x,pol.y);
                this.draw_text(ctx,tp.x,tp.y,this.text);
            } else {this.draw_text(ctx,x,y,this.text)}
        }
    }
}
class Emitter extends CircleControl {constructor (params) {super(params)}}
class Experiment {
    constructor(params={canvas, context, terminal1, terminal2, canHead, canFoot, header1, header2, footer1, footer2, statusBar}) {
        for (var prop in params) {this[prop]=params[prop];}
    }
    init () {
        this.rate=15;
        this.phase=0;
        this.total=0;
        this.distance=0;
        this.statText='';

        // report 1
        this.report1=[
            {row:1,key:'+++',a:"+",b:"+",c:"+",tot:0,pct:0,spc:0},
            {row:2,key:'+-+',a:"+",b:"-",c:"+",tot:0,pct:0,spc:1},
            {row:3,key:'++-',a:"+",b:"+",c:"-",tot:0,pct:0,spc:0},
            {row:4,key:'+--',a:"+",b:"-",c:"-",tot:0,pct:0,spc:0},
            {row:5,key:'-++',a:"-",b:"+",c:"+",tot:0,pct:0,spc:0},
            {row:6,key:'--+',a:"-",b:"-",c:"+",tot:0,pct:0,spc:0},
            {row:7,key:'-+-',a:"-",b:"+",c:"-",tot:0,pct:0,spc:1},
            {row:8,key:'---',a:"-",b:"-",c:"-",tot:0,pct:0,spc:0}
        ];
        this.report1Indexes={'111':0,'101':1,'110':2,'100':3,'011':4,'001':5,'010':6,'000':7};
        this.report1Keys={'111':'+++','101':'+-+','110':'++-','100':'+--','011':'-++','001':'--+','010':'-+-','000':'---'};

        // report 2
        // this.report2=[
        //     {row:1,key:'+ +',a:"+",b:" ",c:"+",tot:0,pct:0,spc:0},
        //     {row:2,key:'+ -',a:"+",b:" ",c:"-",tot:0,pct:0,spc:0},
        //     {row:3,key:'- +',a:"-",b:" ",c:"+",tot:0,pct:0,spc:0},
        //     {row:4,key:'- -',a:"-",b:" ",c:"-",tot:0,pct:0,spc:0}
        // ];
        // this.report2Indexes={'1 1':0,'1 0':1,'0 1':2,'0 0':3};
        // this.report2Keys={'1 1':'+ +','1 0':'+ -','0 1':'- +','0 0':'- -'};

        this.clear();
        // emitters
        this.emitter = new Emitter({x:300,y:150,radius:20,color:'red',name:"S"});
        const emitter=this.emitter;
        emitter.text=emitter.buildText();

        // particles
        this.prt1 = new Particle({x:300,y:150,radius:20,axis:0,color1:'orange',color2:'indigo',name:"a",result:-1});
        this.prt2 = new Particle({x:300,y:150,radius:20,axis:0,color1:'orange',color2:'indigo',name:"b",result:-1});
        const prt1=this.prt1, prt2=this.prt2;
        prt1.text=prt1.buildText(); prt2.text=prt2.buildText();

        // Polarizers
        this.pol1 = new Polarizer({x:150,y:150,width:40,height:40,axis:0,color:'green',name:"a"});
        this.pol2 = new Polarizer({x:450,y:150,width:40,height:40,axis:0,color:'green',name:"b"});
        const pol1=this.pol1, pol2=this.pol2;
        pol1.text=pol1.buildText(); pol2.text=pol2.buildText();

         // Detectors
        this.det1 = new Detector({x:50,y:150,width:40,height:40,axis:0,color:'black',name:"D+",pol:pol1});
        this.det2 = new Detector({x:150,y:250,width:40,height:40,axis:270,color:'black',name:"D-",pol:pol1});
        this.det3 = new Detector({x:350,y:150,width:40,height:40,axis:0,color:'black',name:"D-",pol:pol2});
        this.det4 = new Detector({x:450,y:250,width:40,height:40,axis:270,color:'black',name:"D+",pol:pol2});
        const det1=this.det1, det2=this.det2, det3=this.det3, det4=this.det4;
        det1.text=det1.buildText(); det2.text=det2.buildText(), det3.text=det3.buildText(); det4.text=det4.buildText();     
        
        // Labels
        this.lab1 = new Label({x:50,y:100,color:'black',name:"A",font:"36px Arial"});
        this.lab2 = new Label({x:550,y:100,color:'black',name:"B",font:"36px Arial"});
        const lab1=this.lab1, lab2=this.lab2;
        lab1.text=lab1.buildText(); lab2.text=lab2.buildText();     
        
        // text
        this.canHead.innerHTML=`<p>${textJson.canHead}</p>`;
        this.canFoot.innerHTML=`<p>${textJson.canFoot}</p>`;
        this.header1.innerHTML=`<b>${textJson.header1}</b><br>`;
        this.footer1.innerHTML=`<p>${textJson.footer1}</p>`;
        this.header2.innerHTML=`<b>${textJson.header2}</b><br>`;
        this.footer2.innerHTML=`<p>${textJson.footer2}</p>`;

        // draw
        this.clear();
        this.drawEmitters();
        this.drawPolarizers();
        this.drawDetectors();
        this.drawLabels();
        this.drawParticles();

        // report
        this.updateStatus();
        this.updateReport1();
        // this.updateReport2();
    }
    drawEmitters () {
        const ctx=this.context;
        this.emitter.draw(ctx);
    }
    drawPolarizers () {
        const ctx=this.context;
        this.pol1.draw(ctx); this.pol2.draw(ctx);
    }
    drawDetectors () {
        const ctx=this.context;
        this.det1.draw(ctx); this.det2.draw(ctx); this.det3.draw(ctx); this.det4.draw(ctx);
    }
    drawLabels () {
        const ctx=this.context;
        this.lab1.draw(ctx); this.lab2.draw(ctx);
    }
    drawParticles () {
        const ctx=this.context;
        this.prt1.draw(ctx); this.prt2.draw(ctx);
    }
    step (time) {
        function getResult(pAxis,dAxis) {return (Math.abs(dAxis-pAxis)<=90||Math.abs(dAxis-pAxis)>270) ? 1 : 0;}
        function getIndex1(res1,res2,res3,report1Indexes) {return report1Indexes[`${res1}${res2}${res3}`]}
        function getKey1(res1,res2,res3,report1Keys) { return report1Keys[`${res1}${res2}${res3}`]}
        // function getIndex2(res1,res3,report2Indexes) {return report2Indexes[`${res1} ${res3}`]}
        this.timeLast=this.timeLast ? this.timeLast : time; 
        this.timeDiff=time-this.timeLast;
        const prt1=this.prt1, prt2=this.prt2;
        const pol1=this.pol1, pol2=this.pol2;
        let startX=300, midX=450, endX=600, startY=150, sec=this.timeDiff/1000, perSec=this.rate/60, movePix=sec*perSec*(endX-startX);
        // debug
        this.debug={
            debugStep:this.debugStep,
            timeLast:this.timeLast,
            timeDiff:this.timeDiff,
            phase:this.phase,
            distance:this.distance,
            startX:startX,
            midX:midX,
            endX:endX,
            startY:startY,
            sec:sec,
            perSec:perSec,
            movePix:movePix,
            prt1:prt1,
            prt2:prt2
        }
        this.timeLast=time;
        if (this.phase===0) {
            this.phase=1;
            this.debugStep=0;
            this.distance=0;
            this.axis=Math.random()*361;
            let axis=this.axis;
            prt1.axis=axis; prt1.result=-1; prt1.x=startX; prt1.y=startY; prt1.text=prt1.buildText(); 
            prt2.axis=-axis+180; prt2.result=-1; prt2.x=startX; prt2.y=startY; prt2.text=prt2.buildText();
            this.updateReport1();
            // this.updateReport2();
        }
        if (this.phase==1 && this.distance>=(midX-startX)) {
            // alert(`midpoint, debug=${JSON.stringify(this.debug)}`);
            this.phase=2;
            this.total+=1;
            prt1.result=getResult(prt1.axis,pol1.axis); prt1.text=prt1.buildText();
            prt2.result=1-getResult(prt2.axis,pol2.axis); prt2.text=prt2.buildText();
            let index1=getIndex1(prt1.result,prt2.result,0,this.report1Indexes);
            this.statText=`(${getKey1(prt1.result,prt2.result,0,this.report1Keys)})`;
            this.updateStatus();
            this.report1[index1].tot+=1;
            this.updateReport1();
            // let index2=getIndex2(prt1.result,0,this.report2Indexes);
            // this.report2[index2].tot+=1;
            // this.updateReport2();
        }
        // move 
        this.debugStep+=1;
        this.distance+=movePix; 
        if (this.distance>=(endX-startX)) {this.phase=0} // restart
        else if (this.distance>=(endX-startX-50)) {prt1.moveX=0; prt1.moveY=0; prt2.moveX=0; prt2.moveY=0} // freeze
        else if (this.phase==2) {
            if (prt1.result===0) {
                let detAgl=pol1.axis+45, cos=Math.cos(detAgl*(Math.PI/180)), sin=Math.sin(detAgl*(Math.PI/180));
                prt1.axis=pol1.axis-180;
                prt1.moveX=movePix*cos;
                prt1.moveY=movePix*sin;
            } else {
                let detAgl=pol1.axis-45, cos=Math.cos(detAgl*(Math.PI/180)), sin=Math.sin(detAgl*(Math.PI/180)); 
                prt1.axis=pol1.axis;
                prt1.moveX=-movePix*cos;
                prt1.moveY=-movePix*sin;               
            }
            if (prt2.result===0) {
                let detAgl=pol2.axis-45, cos=Math.cos(detAgl*(Math.PI/180)), sin=Math.sin(detAgl*(Math.PI/180));
                prt2.axis=pol2.axis;
                prt2.moveX=-movePix*cos;
                prt2.moveY=-movePix*sin;                 
            } else {
                let detAgl=pol2.axis+45, cos=Math.cos(detAgl*(Math.PI/180)), sin=Math.sin(detAgl*(Math.PI/180));
                prt2.axis=pol2.axis-180;
                prt2.moveX=movePix*cos;
                prt2.moveY=movePix*sin;            
            }            
        } else {prt1.moveX=-movePix, prt1.moveY=0, prt2.moveX=movePix, prt2.moveY=0}
        prt1.x+=prt1.moveX;
        prt1.y+=prt1.moveY;
        prt2.x+=prt2.moveX;
        prt2.y+=prt2.moveY;
        this.clear();
        this.drawEmitters();
        this.drawPolarizers();
        this.drawDetectors();
        this.drawLabels();
        this.drawParticles();
    }
    clear () {let cvs=this.canvas; context.clearRect(0,0,cvs.width,cvs.height);}
    reset () {if (window.confirm("Reset?\n\nClick [Slow], [Medium] or [Fast] to re-start")) {this.init(); return true}}
    start () {this.timeLast=window.performance.now()}
    stop () {}
    updateStatus () {this.statusBar.innerHTML=`<span'>${this.rate}/min ${this.statText}</span>`;}
    getHeaderHtml(degChr,reportRows,total,axis) {
        return `
<table cellpadding="0" cellspacing="0" border="1">
    <tr valign="top">
        <td>Case</td><td>A=0${degChr}</td><td>B=45${degChr}</td><td>C=67.5${degChr}</td><td>Total</td><td>Percent</td><td>Expected</td>
    </tr>${reportRows}
</table><div><i>total=${total}, axis=${axis}${degChr}</i><div>`;
    }
    getRowHtml (num,a,b,c,tot,pct,exp) {
        let cent=`style='text-align:center'`;
        return `<tr><td style='color:blue; text-align:center'>${num}</td>
        <td ${cent}>${a}</td><td ${cent}>${b}</td><td ${cent}>${c}</td><td ${cent}>${tot}</td><td ${cent}>${pct}</td>
        <td>${exp}</td></tr>`;
    }
    getRowHtmlFromRow (r, row) {
        let special=(row.spc==1) ? ' <i>*special case</i>' : '', exp=`>=0${special}`;
        return this.getRowHtml(r,row.a,row.b,row.c,row.tot,row.pct,exp);
    }    
    updateReport1 () {
        let report1Rows = '', na="<i>n/a</i>";
        for (let r=1; r<=8; r++) {
            this.report1[r-1].pct=roundTo(this.report1[r-1].tot/this.total*100,4);
            report1Rows+=this.getRowHtmlFromRow(`[${r}]`, this.report1[r-1]);
        }
        this.XPct = this.report1[0].pct + this.report1[1].pct + this.report1[6].pct + this.report1[7].pct;
        this.YPct = this.report1[1].pct + this.report1[3].pct + this.report1[4].pct + this.report1[6].pct;
        this.ZPct = this.report1[0].pct + this.report1[3].pct + this.report1[4].pct + this.report1[7].pct;
        report1Rows+=this.getRowHtml("X",na,na,na,na,roundTo(this.XPct,4),"case [1]+[2]+[7]+[8] %");
        report1Rows+=this.getRowHtml("Y",na,na,na,na,roundTo(this.YPct,4),"case [2]+[4]+[5]+[7] %");
        report1Rows+=this.getRowHtml("Z",na,na,na,na,roundTo(this.ZPct,4),"case [1]+[4]+[5]+[8] %");
        this.terminal1.innerHTML=this.getHeaderHtml(degChr, report1Rows, this.total, roundTo(this.axis,2));
        setIdHtml('debug', `debug=${JSON.stringify(this.debug)}`);
    }
    // updateReport2 () {
    //     let report2Rows = '', na="<i>n/a</i>";
    //     for (let r=1; r<=4; r++) {
    //         this.report2[r-1].pct=roundTo(this.report2[r-1].tot/this.total*100,4);
    //         this.report2[r-1].b=na;
    //         report2Rows+=this.getRowHtmlFromRow(`${r}'`, this.report2[r-1]);
    //     }
    //     this.XYZDiv2 = (this.XPct + this.YPct - this.ZPct) / 2;
    //     report2Rows+=this.getRowHtml("(X+Y-Z)/2",na,na,na,this.total,roundTo(this.XYZDiv2,4),"<= 0% (<i>predicted -.1036</i>)");
    //     this.terminal2.innerHTML=this.getHeaderHtml(degChr, report2Rows, this.total, roundTo(this.axis,2));
    // }
}
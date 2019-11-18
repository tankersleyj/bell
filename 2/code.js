// variables
var degChr=String.fromCharCode(176), primeChr=String.fromCharCode(180), animationId=0, author='J.Tankersley', version='0.3.23', imageTitle='Bell CHSH (alpha/incomplete math)';
var canvas, context, canHead, canFoot, terminal1, terminal2, terminal3, terminal4, terminal5, header1, header2, header3, header4, header5, footer1, footer2, footer3, footer4, footer5, statusBar, experiment;
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
  terminal3=document.getElementById("terminal3");
  terminal4=document.getElementById("terminal4");
  terminal5=document.getElementById("terminal5");
  header1=document.getElementById("header1");
  header2=document.getElementById("header2");
  header3=document.getElementById("header3");
  header4=document.getElementById("header4");
  header5=document.getElementById("header5");
  footer1=document.getElementById("footer1");
  footer2=document.getElementById("footer2");
  footer3=document.getElementById("footer3");
  footer4=document.getElementById("footer4");
  footer5=document.getElementById("footer5");
  statusBar=document.getElementById("statusBar");
  experiment=new Experiment({
      canvas:canvas, context:context, canHead:canHead, canFoot:canFoot, statusBar:statusBar,
      terminal1:terminal1, terminal2:terminal2, terminal3:terminal3, terminal4:terminal4, terminal5:terminal5,
      header1:header1, header2:header2, header3:header3, header4:header4, header5:header5,
      footer1:footer1, footer2:footer2, footer3:footer3, footer4:footer4, footer5:footer5
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
        return this.result in [0,1]?`${resultText[this.result]}`:`${axisText}°`;
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
    buildText() {return `${this.name}=${this.axis}°`;}
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
    constructor(params={canvas, context, canHead, canFoot, header1, terminal1, footer1, statusBar}) {
        for (var prop in params) {this[prop]=params[prop];}
    }
    init () {
        this.rate=60;
        this.phase=0;
        this.total=0;
        this.distance=0;
        this.statText='';
        this.totals={"E1":0, "E2":0, "E3":0, "E4":0, "S":0, "C1":0, "C2":0, "C3":0, "C4":0, "C":0};

        // report 1
        this.report1=[
            {row:1, key:'++',a:"+",b:"+",tot:0,pct:0,note:"a,b"},
            {row:2, key:'+-',a:"+",b:"-",tot:0,pct:0,note:"a,b"},
            {row:3, key:'-+',a:"-",b:"+",tot:0,pct:0,note:"a,b"},
            {row:4, key:'--',a:"-",b:"-",tot:0,pct:0,note:"a,b"}
        ];
        this.report1Indexes={'11':0,'10':1,'01':2,'00':3};
        this.report1Keys={'11':'++','10':'+-','01':'-+','00':'--'};
        
        // report 2
        this.report2=[
            {row:1, key:'++',a:"+",b:"+",tot:0,pct:0,note:"a,b´"},
            {row:2, key:'+-',a:"+",b:"-",tot:0,pct:0,note:"a,b´"},
            {row:3, key:'-+',a:"-",b:"+",tot:0,pct:0,note:"a,b´"},
            {row:4, key:'--',a:"-",b:"-",tot:0,pct:0,note:"a,b´"}
        ];
        this.report2Indexes={'11':0,'10':1,'01':2,'00':3};
        this.report2Keys={'11':'++','10':'+-','01':'-+','00':'--'};
        
        // report 3
        this.report3=[
            {row:1, key:'++',a:"+",b:"+",tot:0,pct:0,note:"a´,b"},
            {row:2, key:'+-',a:"+",b:"-",tot:0,pct:0,note:"a´,b"},
            {row:3, key:'-+',a:"-",b:"+",tot:0,pct:0,note:"a´,b"},
            {row:4, key:'--',a:"-",b:"-",tot:0,pct:0,note:"a´,b"}
        ];
        this.report3Indexes={'11':0,'10':1,'01':2,'00':3};
        this.report3Keys={'11':'++','10':'+-','01':'-+','00':'--'};
        
        // report 4
        this.report4=[
            {row:1, key:'++',a:"+",b:"+",tot:0,pct:0,note:"a´,b´"},
            {row:2, key:'+-',a:"+",b:"-",tot:0,pct:0,note:"a´,b´"},
            {row:3, key:'-+',a:"-",b:"+",tot:0,pct:0,note:"a´,b´"},
            {row:4, key:'--',a:"-",b:"-",tot:0,pct:0,note:"a´,b´"}
        ];
        this.report4Indexes={'11':0,'10':1,'01':2,'00':3};
        this.report4Keys={'11':'++','10':'+-','01':'-+','00':'--'};

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
        this.pol1 = new Polarizer({x:150,y:150,width:40,height:40,axis:45,color:'green',name:"a"});
        this.pol2 = new Polarizer({x:450,y:150,width:40,height:40,axis:-67.5,color:'green',name:"b"});
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
        this.lab0 = new Label({x:300,y:50,color:'blue',name:imageTitle,font:"18px Arial"});
        this.lab1 = new Label({x:50,y:50,color:'black',name:"A",font:"36px Arial"});
        this.lab2 = new Label({x:550,y:50,color:'black',name:"B",font:"36px Arial"});
        this.lab0.text=this.lab0.buildText(); this.lab1.text=this.lab1.buildText(); this.lab2.text=this.lab2.buildText();     
        
        // text
        this.canHead.innerHTML=`<p>${textJson.canHead}</p>`;
        this.canFoot.innerHTML=`<p>${textJson.canFoot}</p>`;
        this.header1.innerHTML=`<b>${textJson.header1}</b><br>`;
        this.header2.innerHTML=`<b>${textJson.header2}</b><br>`;
        this.header3.innerHTML=`<b>${textJson.header3}</b><br>`;
        this.header4.innerHTML=`<b>${textJson.header4}</b><br>`;
        this.header5.innerHTML=`<b>${textJson.header5}</b><br>`;
        this.footer1.innerHTML=`<p>${textJson.footer1}</p>`;
        this.footer2.innerHTML=`<p>${textJson.footer2}</p>`;
        this.footer3.innerHTML=`<p>${textJson.footer3}</p>`;
        this.footer4.innerHTML=`<p>${textJson.footer4}</p>`;
        this.footer5.innerHTML=`<p>${textJson.footer5}</p>`;

        // draw
        this.clear();
        this.drawEmitters();
        this.drawPolarizers();
        this.drawDetectors();
        this.drawLabels();
        this.drawParticles();

        // report
        this.updateStatus();
        // this.updateReports();
        
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
        this.lab0.draw(ctx); this.lab1.draw(ctx); this.lab2.draw(ctx);
    }
    drawParticles () {
        const ctx=this.context;
        this.prt1.draw(ctx); this.prt2.draw(ctx);
    }
    step (time) {
        function getResult(pAxis,dAxis) {return (Math.abs(dAxis-pAxis)<=90||Math.abs(dAxis-pAxis)>270) ? 1 : 0;}
        function getKey(res1,res2,reportKeys) { return reportKeys[`${res1}${res2}`]}
        this.timeLast=this.timeLast ? this.timeLast : time; 
        this.timeDiff=time-this.timeLast;
        const prt1=this.prt1, prt2=this.prt2;
        const pol1=this.pol1, pol2=this.pol2;
        let startX=300, midX=450, endX=600, startY=150, sec=this.timeDiff/1000, perSec=this.rate/60, movePix=sec*perSec*(endX-startX);
        this.timeLast=time;
        if (this.phase===0) {
            this.phase=1;
            this.distance=0;
            this.axis=Math.random()*361;
            prt1.axis=this.axis; prt1.result=-1; prt1.x=startX; prt1.y=startY; prt1.text=prt1.buildText(); 
            prt2.axis=this.axis>=180?this.axis-180:this.axis+180; prt2.result=-1; prt2.x=startX; prt2.y=startY; prt2.text=prt2.buildText();
            pol1.prime=Math.round(Math.random())==1?true:false;
            pol2.prime=Math.round(Math.random())==1?true:false;
            if (pol1.prime) {pol1.axis=45; pol1.name=`a${primeChr}`} else {pol1.axis=0; pol1.name='a'}
            if (pol2.prime) {pol2.axis=-67.5; pol2.name=`b${primeChr}`} else {pol2.axis=-22.5; pol2.name='b'}
            pol1.text=pol1.buildText(); pol2.text=pol2.buildText();
        }
        if (this.phase==1 && this.distance>=(midX-startX)) {
            this.phase=2;
            this.total+=1;
            prt1.result=getResult(prt1.axis,pol1.axis); prt1.text=prt1.buildText();
            prt2.result=1-getResult(prt2.axis,pol2.axis); prt2.text=prt2.buildText();
            if (prt1.result===0) {let detAgl=pol1.axis+45; prt1.cos=Math.cos(detAgl*(Math.PI/180)); prt1.sin=Math.sin(detAgl*(Math.PI/180)); prt1.axis=pol1.axis-180}
            else {let detAgl=pol1.axis-45; prt1.cos=Math.cos(detAgl*(Math.PI/180)); prt1.sin=Math.sin(detAgl*(Math.PI/180)); prt1.axis=pol1.axis}
            if (prt2.result===0) {let detAgl=pol2.axis-45; prt2.cos=Math.cos(detAgl*(Math.PI/180)); prt2.sin=Math.sin(detAgl*(Math.PI/180)); prt2.axis=pol2.axis}
            else {let detAgl=pol2.axis+45; prt2.cos=Math.cos(detAgl*(Math.PI/180)); prt2.sin=Math.sin(detAgl*(Math.PI/180)); prt2.axis=pol2.axis-180}    
            this.statText=`(${getKey(prt1.result, prt2.result, this.report1Keys)})`;
            this.updateStatus();
            this.updateReports(true);
        }
        // move 
        this.distance+=movePix; 
        if (this.distance>=(endX-startX)) {this.phase=0} // restart
        else if (this.distance>=(endX-startX-50)) {prt1.moveX=0; prt1.moveY=0; prt2.moveX=0; prt2.moveY=0} // freeze
        else if (this.phase==2) {
            if (prt1.result===0) {prt1.moveX=movePix*prt1.cos; prt1.moveY=movePix*prt1.sin}
            else {prt1.moveX=-movePix*prt1.cos; prt1.moveY=-movePix*prt1.sin}
            if (prt2.result===0) {prt2.moveX=-movePix*prt2.cos; prt2.moveY=-movePix*prt2.sin}
            else {prt2.moveX=movePix*prt2.cos; prt2.moveY=movePix*prt2.sin}            
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
    getHeaderHtml(reportRows,aName,bName) {
        return `
<table cellpadding="0" cellspacing="0" border="1">
    <tr valign="top">
        <td>Case</td><td>${aName}</td><td>${bName}</td><td>Total</td><td>Percent</td><td>Notes</td>
    </tr>${reportRows}
</table>`;
    }
    getRowHtml (num,a,b,tot,pct,note) {
        let cent=`style='text-align:center'`;
        return `<tr><td style='color:blue; text-align:center'>${num}</td>
        <td ${cent}>${a}</td><td ${cent}>${b}</td><td ${cent}>${tot}</td><td ${cent}>${pct}</td>
        <td>${note}</td></tr>`;
    }
    getRowHtmlFromRow (r, row) {
        return this.getRowHtml(r,row.a,row.b,row.tot,row.pct,row.note);
    }
    updateReports (increment=false) {
        function getIndex(res1,res2,reportIndexes) {return reportIndexes[`${res1}${res2}`]}
        function getE(pp,pm,mp,mm) {
            let e1=pp-pm-mp+mm, e2=pp+pm+mp+mm;
            return e1/e2;
        }
        let prt1=this.prt1, prt2=this.prt2, pol1=this.pol1, pol2=this.pol2;
        let terminal, reportIndexes, report, cName, eName, aName, bName;
        if (!pol1.prime && !pol2.prime) {
            terminal=this.terminal2;
            report=this.report1;
            reportIndexes=this.report1Indexes;
            cName='C1'; eName='E1'; aName='a'; bName='b';
        }
        if (!pol1.prime && pol2.prime) {
            terminal=this.terminal3;
            report=this.report2;
            reportIndexes=this.report2Indexes;
            this.E2=0;
            cName='C2'; eName='E2'; aName='a'; bName='b′';
        }
        if (pol1.prime && !pol2.prime) {
            terminal=this.terminal4;
            report=this.report3;
            reportIndexes=this.report3Indexes;
            this.E3=0;
            cName='C3'; eName='E3'; aName='a′'; bName='b';
        }
        if (pol1.prime && pol2.prime) {
            terminal=this.terminal5;
            report=this.report4;
            reportIndexes=this.report4Indexes
            this.E4=0;
            cName='C4'; eName='E4'; aName='a′'; bName='b′';
        }
        if (increment) {
            let index=getIndex(prt1.result, prt2.result, reportIndexes);
            report[index].tot+=1;
            this.totals[cName]+=1;
            this.totals["C"]+=1;
        }
        // this.updateReport1();
        let reportRows='', summaryRows='', na="<i>n/a</i>";
        for (let r=1; r<=4; r++) {
            report[r-1].pct=roundTo(report[r-1].tot/this.total*100,4);
            reportRows+=this.getRowHtmlFromRow(`[${r}]`, report[r-1]);
        }
        this.totals[eName]=getE(report[0].pct, report[1].pct, report[2].pct, report[3].pct);
        reportRows+=this.getRowHtml(eName,na,na,roundTo(this.totals[cName],4),roundTo(this.totals[eName],4),"([1]-[2]-[3]+[4]) / ([1]+[2]+[3]+[4])");
        terminal.innerHTML=this.getHeaderHtml(reportRows, aName, bName);
        
        // Summary
        this.totals["S"]=this.totals['E1']+this.totals['E2']-this.totals['E3']+this.totals['E4'];
        summaryRows+=this.getRowHtml(`E1`,na,na,roundTo(this.totals['C1'],4),roundTo(this.totals['E1'],4),"a,b");
        summaryRows+=this.getRowHtml(`E2`,na,na,roundTo(this.totals['C2'],4),roundTo(this.totals['E2'],4),"a,b′");
        summaryRows+=this.getRowHtml(`E3`,na,na,roundTo(this.totals['C3'],4),roundTo(this.totals['E3'],4),"a′,b");
        summaryRows+=this.getRowHtml(`E4`,na,na,roundTo(this.totals['C4'],4),roundTo(this.totals['E4'],4),"a′,b′");
        summaryRows+=this.getRowHtml(`S`,na,na,roundTo(this.totals['C'],4),roundTo(this.totals["S"],4),"E1 - E2 + E3 + E4");
        this.terminal1.innerHTML=this.getHeaderHtml(summaryRows, 'a or a′', 'b or b′');
        // setIdHtml('debug', `debug=${JSON.stringify(this)}`);
    }
}
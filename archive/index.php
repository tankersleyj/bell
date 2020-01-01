<!DOCTYPE html>
<html>
<body>

<script type="text/javascript" src="bell1.js"></script>
<div style="padding: 16px 16px 16px 16px" id="window">
    <a href="https://sites.google.com/site/physicschecker/unsettled-physics/testing-bells-theorem-paper" target="_new">Bell's Theorem Prototype Test</a><br>
        <i>by J.Tankersley, 0.2.14, codeserver.net/nb</i><br>
    <div id="canHead"></div>
    <canvas id="canvas" width="320" height="225px"></canvas>
    <div id="controls">
        <button onclick="animationStart();">Start</button>
        <button onclick="animationStop();">Stop</button>
        <button onclick="experiment.reset();">Reset</button>
        <button onclick="experiment.setRate();">Rate</button>
        <button onclick="experiment.slower();">-</button>
        <button onclick="experiment.faster();">+</button>
        <span id="statusBar"></span>
    </div>
    <div id="canFoot"></div>
    <div id="header1"></div>
    <div id="terminal1"></div>
    <div id="footer1"></div>
    <div id="header2"></div>
    <div id="terminal2"></div>
    <div id="footer2"></div>
    <div id="debug"></div>
</div>
<style>
    html, body {margin: 0;}
    #canvas {background: linear-gradient(to bottom, white 0%, azure 100%);}
</style>

<script>
// classes
class Point {
    constructor(params={x:0, y:0}) {
        for (var prop in params) {this[prop] = params[prop];}
    }
    static shiftX(angle,distance) {return Math.cos(angle*Math.PI/-180)*distance;}
    static shiftY(angle,distance) {return Math.sin(angle*Math.PI/-180)*-distance;}
    static rotateXY(angle,x,y,pivotX=0,pivotY=0) {
        function rot(angle,x,y) {
            let cos=Math.cos(angle*(Math.PI/180)), sin=Math.sin(angle*(Math.PI/180)); 
            return {x:(cos*x)-(sin*y),y:(cos*y)+(sin*x)} // jtankersley, 1989-2019
        }
        return rot(angle, x-pivotX, y-pivotY);
    }
    rotate(angle,pivotX=0,pivotY=0) {const {x,y}=Point.rotateXY(angle,this.x,this.y,pivotX,pivotY); this.x=x+pivotX; this.y=y+pivotY;}
    shift(angle,distance) {this.x+=Point.shiftX(angle,distance); this.y+=Point.shiftY(angle,distance);}
}
class Particle {
    constructor(params={x:0,y:0,radius:0,axis:0,color1:'orange',color2:'indigo',dir:1}) {
        for (var prop in params) {this[prop]=params[prop];}
    }
    draw(ctx,text) {
        function draw_arc(x,y,r,start,end,color) {
            let rad1=(start+0)*Math.PI/180, rad2=(end+0)*Math.PI/180;
            let grad=ctx.createRadialGradient(x,y,0,x,y,r);
            grad.addColorStop(0,color); grad.addColorStop(1,'white'); ctx.fillStyle=grad;
            ctx.beginPath(); ctx.arc(x,y,r,rad1,rad2); ctx.fill();
        }
        function draw_text(x,y,text) {
            ctx.font="18px Arial";
            let width=ctx.measureText(text).width, height=parseInt(ctx.font.match(/\d+/),10);
            let textX=x+width/-2, textY=y+height/3;
            ctx.strokeStyle="black"; ctx.strokeText(text,textX,textY);
            ctx.fillStyle="white"; ctx.fillText(text,textX,textY);
        }
        let x=this.x, y=this.y, r=this.radius, axis=this.axis, col1=this.color1, col2=this.color2;
        draw_arc(x,y,r,axis,axis+180,col1); draw_arc(x,y,r,axis+180,axis,col2); 
        if (this.text) {draw_text(x,y,this.text);}
    }
    shift (angle,distance) {this.x+=Point.shiftX(angle,distance); this.y+=Point.shiftY(angle,distance);}
    buildText() {
        let resultText=['-','+'], axisText=roundTo(this.axis,1);
        return this.result in [0,1]?`${this.name}'=${resultText[this.result]}`:`${this.name}=${axisText}${degChr}`;
    }
}
class Control {
    constructor(params={x:0,y:0, width:0, height:0, axis:0, color:'blue'}) {
        for (var prop in params) {this[prop]=params[prop];}
    }
    draw(ctx,text) {
        function draw_rec(x,y,w,h,axis,color) {
            let hW=Math.round(w/2), hH=Math.round(h/2);
            let lP1=new Point({x:x-hW,y:y-hH}), lP2=new Point({x:x-hW,y:y+hH});
            let rP1=new Point({x:x+hW,y:y-hH}), rP2=new Point({x:x+hW,y:y+hH});
            lP1.rotate(axis,x,y); lP2.rotate(axis,x,y); rP1.rotate(axis,x,y); rP2.rotate(axis,x,y);
            ctx.beginPath(); ctx.moveTo(lP1.x,lP1.y);
            ctx.lineTo(rP1.x,rP1.y); ctx.lineTo(rP2.x,rP2.y); ctx.lineTo(lP2.x,lP2.y); ctx.lineTo(lP1.x,lP1.y);
            ctx.strokeStyle=color; ctx.stroke();
        }
        function draw_text(x,y,text) {
            ctx.font="18px Arial";
            let width=ctx.measureText(text).width,height=parseInt(ctx.font.match(/\d+/),10);
            let textX=x+width/-2, textY=y+height/3;
            ctx.strokeStyle="black"; ctx.strokeText(text,textX,textY);
            ctx.fillStyle="lightgray"; ctx.fillText(text,textX,textY);
        }
        let x=this.x, y=this.y, w=this.width, h=this.height, axis=this.axis, color=this.color;
        draw_rec(x,y,w,h,axis,color); 
        if (this.text) {draw_text(x,y,this.text);}
    }
}
class Emitter extends Control {
    constructor (params) {super(params);}
    buildText() {return `${this.name}`;}
}
class Detector extends Control {
    constructor (params) {super(params);}
    buildText() {return `${this.name}=${this.axis}${degChr}`;}
}
class Experiment {
    constructor(params={canvas, context, terminal1, terminal2, canHead, canFoot, header1, header2, footer1, footer2, statusBar}) {
        for (var prop in params) {this[prop]=params[prop];}
    }
    init () {
        this.rate=30;
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
        ]
        this.report1Indexes={'111':0,'101':1,'110':2,'100':3,'011':4,'001':5,'010':6,'000':7};
        this.report1Keys={'111':'+++','101':'+-+','110':'++-','100':'+--','011':'-++','001':'--+','010':'-+-','000':'---'};
        
        // report 2
        this.report2=[
            {row:1,key:'+ +',a:"+",b:" ",c:"+",tot:0,pct:0,spc:0},
            {row:2,key:'+ -',a:"+",b:" ",c:"-",tot:0,pct:0,spc:0},
            {row:3,key:'- +',a:"-",b:" ",c:"+",tot:0,pct:0,spc:0},
            {row:4,key:'- -',a:"-",b:" ",c:"-",tot:0,pct:0,spc:0}
        ]
        this.report2Indexes={'1 1':0,'1 0':1,'0 1':2,'0 0':3};
        this.report2Keys={'1 1':'+ +','1 0':'+ -','0 1':'- +','0 0':'- -'};
        
        this.clear();
        // emitters
        this.emt1 = new Emitter({x:50,y:20,width:40,height:10,axis:0,color:'red',name:"E1"});
        this.emt2 = new Emitter({x:150,y:20,width:40,height:10,axis:0,color:'red',name:"E2"});
        this.emt3 = new Emitter({x:250,y:20,width:40,height:10,axis:0,color:'red',name:"E3"});
        const emt1=this.emt1, emt2=this.emt2, emt3=this.emt3;
        emt1.text=emt1.buildText(); emt2.text=emt2.buildText(); emt3.text=emt3.buildText();
        this.drawEmitters();
        // particles
        this.prt1 = new Particle({x:50,y:25,radius:20,axis:45,color1:'orange',color2:'indigo',name:"a",result:-1,dir:1});
        this.prt2 = new Particle({x:150,y:25,radius:20,axis:45,color1:'orange',color2:'indigo',name:"b",result:-1,dir:1});
        this.prt3 = new Particle({x:250,y:25,radius:20,axis:45,color1:'orange',color2:'indigo',name:"c",result:-1,dir:1});
        const prt1=this.prt1, prt2=this.prt2, prt3=this.prt3;
        prt1.text=prt1.buildText(); prt2.text=prt2.buildText(); prt3.text=prt3.buildText();
        // detectors
        this.det1 = new Detector({x:50,y:150,width:40,height:10,axis:0,color:'blue',name:"A"});
        this.det2 = new Detector({x:150,y:150,width:40,height:10,axis:45,color:'blue',name:"B"});
        this.det3 = new Detector({x:250,y:150,width:40,height:10,axis:67.5,color:'blue',name:"C"});
        const det1=this.det1, det2=this.det2, det3=this.det3;
        det1.text=det1.buildText(); det2.text=det2.buildText(); det3.text=det3.buildText();
        this.drawDetectors();
        this.updateStatus();
        this.updateReport1();
        this.updateReport2();
        this.canHead.innerHTML=`<p>${textJson.canHead}</p>`;
        this.canFoot.innerHTML=`<p>${textJson.canFoot}</p>`;
        this.header1.innerHTML=`<b>${textJson.header1}</b><br>`;
        this.footer1.innerHTML=`<p>${textJson.footer1}</p>`;
        this.header2.innerHTML=`<b>${textJson.header2}</b><br>`;
        this.footer2.innerHTML= `
        <p>${textJson.footer2}</p>
        <p>${textJson.simLinks}</p>
        <p>
            [I] Schneider <a target='tab' href="${textJson.schneiderUrl2}">${textJson.schneiderUrl2}</a><br>
            [II] Schneider <a target='tab' href="${textJson.schneiderUrl1}">${textJson.schneiderUrl1}</a><br>
            [III] Paper <a target='tab' href="${textJson.paperUrl}">${textJson.paperUrl}</a><br>
            [IV] App <a target='tab' href="${textJson.appUrl}">${textJson.appUrl}</a><br>
            [V] Code <a target='tab' href="${textJson.codeUrl}">${textJson.codeUrl}</a><br>
        </p>`;
    }
    drawEmitters () {
        const ctx=this.context;
        this.emt1.draw(ctx); this.emt2.draw(ctx); this.emt3.draw(ctx);
    }
    drawDetectors () {
        const ctx=this.context;
        this.det1.draw(ctx); this.det2.draw(ctx); this.det3.draw(ctx);
    }
    drawParticles () {
        const ctx=this.context;
        this.prt1.draw(ctx); this.prt2.draw(ctx); this.prt3.draw(ctx);
    }
    step (time) {
        function getResult(pAxis,dAxis) {return (Math.abs(dAxis-pAxis)<=90||Math.abs(dAxis-pAxis)>270) ? 1 : 0;}
        function getAxis(pAxis,dAxis) {return (Math.abs(dAxis-pAxis)<=90||Math.abs(dAxis-pAxis)>270) ? dAxis : dAxis+180;}
        function getIndex1(res1,res2,res3,report1Indexes) {return report1Indexes[`${res1}${res2}${res3}`]}
        function getKey1(res1,res2,res3,report1Keys) { return report1Keys[`${res1}${res2}${res3}`]}
        function getIndex2(res1,res3,report2Indexes) {return report2Indexes[`${res1} ${res3}`]}
        // function getKey2(res1,res3,report2Keys) { return report2Keys[`${res1} ${res3}`]}
        this.timeLast=this.timeLast ? this.timeLast : time; 
        this.timeDiff=time-this.timeLast;
        let startY=25, endY=225, sec=this.timeDiff/1000, perSec=this.rate/60, movePix=sec*perSec*(endY-startY);
        if (movePix>=0.75) {
            this.timeLast=time;
            const prt1=this.prt1, prt2=this.prt2, prt3=this.prt3;
            const det1=this.det1, det2=this.det2, det3=this.det3;
            if (this.phase==0) {
                this.phase=1;
                this.distance=0;
                this.axis=Math.random()*361;
                let axis=this.axis;
                prt1.axis=axis; prt1.result=-1; prt1.y=startY; prt1.dir=1; prt1.text=prt1.buildText(); 
                prt2.axis=axis; prt2.result=-1; prt2.y=startY; prt2.dir=1; prt2.text=prt2.buildText(); 
                prt3.axis=axis; prt3.result=-1; prt3.y=startY; prt3.dir=1; prt3.text=prt3.buildText(); 
                this.updateReport1();
                this.updateReport2();
            } else { this.distance+=movePix; prt1.y+=(movePix*prt1.dir); prt2.y+=(movePix*prt2.dir); prt3.y+=(movePix*prt3.dir); }
            if (this.phase==1 && prt1.y>=this.det1.y) {
                this.phase=2;
                this.total+=1;
                prt1.result=getResult(prt1.axis,det1.axis); prt1.axis=getAxis(prt1.axis,det1.axis); prt1.text=prt1.buildText(); prt1.dir=prt1.result;
                prt2.result=getResult(prt2.axis,det2.axis); prt2.axis=getAxis(prt2.axis,det2.axis); prt2.text=prt2.buildText(); prt2.dir=prt2.result; 
                prt3.result=getResult(prt3.axis,det3.axis); prt3.axis=getAxis(prt3.axis,det3.axis); prt3.text=prt3.buildText(); prt3.dir=prt3.result;
                if (prt1.result==0) {prt1.dir=-1};
                if (prt2.result==0) {prt2.dir=-1};
                if (prt3.result==0) {prt3.dir=-1};
                let index1=getIndex1(prt1.result,prt2.result,prt3.result,this.report1Indexes);
                this.statText=`(${getKey1(prt1.result,prt2.result,prt3.result,this.report1Keys)})`;
                this.updateStatus()
                this.report1[index1]['tot']+=1;
                this.updateReport1();
                let index2=getIndex2(prt1.result,prt3.result,this.report2Indexes);
                this.report2[index2]['tot']+=1;
                this.updateReport2();
            }
            if (this.distance>=(endY-startY-25)) {prt1.dir=0; prt2.dir=0; prt3.dir=0;} // freeze
            if (this.distance>=(endY-startY)) {this.phase=0;} // restart
            this.clear();
            this.drawEmitters();
            this.drawDetectors();
            this.drawParticles();
        }
    }
    clear () {let cvs=this.canvas; context.clearRect(0,0,cvs.width,cvs.height);}
    reset () {if (window.confirm("Reset?")) {this.init()}}
    start () {this.timeLast=window.performance.now()}
    faster () {this.rate+=1; this.updateStatus(); if (this.rate==1) {this.start();}}
    slower () {if (this.rate>0) {this.rate-=1; this.updateStatus();}}
    stop () {}
    setRate () {
        let rate=window.prompt("Rate (0-999) per minute\n(minus emitter & processor lag)", this.rate);
        if (rate && Number(rate)>=0 && Number(rate<=999)) {
            this.rate=Number(rate); this.updateStatus();
        } else {alert(`${rate} is not between 0 and 999`)}
    }
    updateStatus () {this.statusBar.innerHTML=`<span'>${this.rate}/min ${this.statText}</span>`;}
    getHeaderHtml(degChr,reportRows,total,axis) {
        return `
<table cellpadding="0" cellspacing="0" border="1">
    <tr valign="top">
        <td>Case</td><td>A=0${degChr}</td><td>B=45${degChr}</td><td>C=67.5${degChr}</td><td>Total</td><td>Percent</td><td>Expected</td>
    </tr>${reportRows}
</table><div><i>total=${total}, axis=${axis}${degChr}</i><div>`    
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
            this.report1[r-1]['pct']=roundTo(this.report1[r-1]['tot']/this.total*100,4);
            report1Rows+=this.getRowHtmlFromRow(`[${r}]`, this.report1[r-1]);
        }
        this.XPct = this.report1[0]['pct'] + this.report1[1]['pct'] + this.report1[6]['pct'] + this.report1[7]['pct'];
        this.YPct = this.report1[1]['pct'] + this.report1[3]['pct'] + this.report1[4]['pct'] + this.report1[6]['pct'];
        this.ZPct = this.report1[0]['pct'] + this.report1[3]['pct'] + this.report1[4]['pct'] + this.report1[7]['pct'];
        report1Rows+=this.getRowHtml("X",na,na,na,na,roundTo(this.XPct,4),"case [1]+[2]+[7]+[8] %");
        report1Rows+=this.getRowHtml("Y",na,na,na,na,roundTo(this.YPct,4),"case [2]+[4]+[5]+[7] %");
        report1Rows+=this.getRowHtml("Z",na,na,na,na,roundTo(this.ZPct,4),"case [1]+[4]+[5]+[8] %");
        this.terminal1.innerHTML=this.getHeaderHtml(degChr, report1Rows, this.total, roundTo(this.axis,2));
        setIdHtml('debug', `X=${this.XPct}, Y=${this.YPct}, Z=${this.ZPct}`);
    }
    updateReport2 () {
        let report2Rows = '', na="<i>n/a</i>";
        for (let r=1; r<=4; r++) {
            this.report2[r-1]['pct']=roundTo(this.report2[r-1]['tot']/this.total*100,4);
            this.report2[r-1]['b']=na;
            report2Rows+=this.getRowHtmlFromRow(`${r}'`, this.report2[r-1]);
        }
        this.XYZDiv2 = (this.XPct + this.YPct - this.ZPct) / 2;
        report2Rows+=this.getRowHtml("(X+Y-Z)/2",na,na,na,this.total,roundTo(this.XYZDiv2,4),"<= 0% (<i>predicted -.1036</i>)");
        this.terminal2.innerHTML=this.getHeaderHtml(degChr, report2Rows, this.total, roundTo(this.axis,2));
    }
}
// variables
var degChr=String.fromCharCode(176), animationId=0;
var canvas=document.getElementById("canvas"); context=canvas.getContext("2d"); canHead=document.getElementById("canHead"); canFoot=document.getElementById("canFoot");
var terminal1=document.getElementById("terminal1"); terminal2=document.getElementById("terminal2"); statusBar=document.getElementById("statusBar");
var header1=document.getElementById("header1"); header2=document.getElementById("header2"); footer1=document.getElementById("footer1"); footer2=document.getElementById("footer2"); 
var experiment=new Experiment({canvas:canvas, context:context, terminal1:terminal1, terminal2:terminal2, canHead:canHead, canFoot, canFoot, header1:header1, header2:header2, footer1:footer1, footer2:footer2, statusBar:statusBar});
// functions
function roundTo(value,decimals=0) {
    mult=1;
    for (i=0;i<decimals;i++) {mult*=10}
    return Math.round(value*mult)/mult;
}
function setIdHtml(id,html) {document.getElementById(id).innerHTML=html}
function animationStep(time) {experiment.step(time); animationId=window.requestAnimationFrame(animationStep);}
function animationStart() {experiment.start(); animationId=window.requestAnimationFrame(animationStep);}
function animationStop() {if (animationId) {experiment.stop(); window.cancelAnimationFrame(animationId); animationId=0;}}
// initialize
experiment.init();
animationStart();
</script> 

</body>
</html>
/* EmbeddedLab 1.0: deterministic educational model, not AVR emulation. */
(function(root){
'use strict';
function parse(src){
 const lines=src.split(/\r?\n/).map(x=>x.replace(/\/\/.*$/,'').trim()).filter(Boolean);
 const cfg={pwm:128,step:32,mode:'FALLING',top:249,n:64,compare:false};
 const rules={PWM:/^\d+$/,STEP:/^-?\d+$/,EDGE:/^(FALLING|RISING|CHANGE)$/,TOP:/^\d+$/,PRESCALE:/^\d+$/,TIMER:/^(ON|OFF)$/};
 const seen=new Set();
 for(const line of lines){const m=line.match(/^([A-Z]+)\s*=\s*(\S+)$/);if(!m||!Object.hasOwn(rules,m[1])||!rules[m[1]].test(m[2])||seen.has(m[1]))throw Error('Invalid or duplicate model instruction: '+line);seen.add(m[1]);const v=m[2];switch(m[1]){case'PWM':cfg.pwm=+v;break;case'STEP':cfg.step=+v;break;case'EDGE':cfg.mode=v;break;case'TOP':cfg.top=+v;break;case'PRESCALE':cfg.n=+v;break;case'TIMER':cfg.compare=v==='ON';}}
 if(cfg.top<3||cfg.top>65535||cfg.pwm<0||cfg.pwm>cfg.top+1||Math.abs(cfg.step)>65536||![1,8,64,256,1024].includes(cfg.n))throw Error('Values outside model range (PWM 0..TOP+1, TOP 3..65535).');
 return cfg;
}
function create(cfg){return {cfg:{...cfg},ocr:cfg.pwm,level:1,ext:0,timer:0,enabled:true,extMask:true,time:0,phase:0,pending:false,timerPending:false,trace:[]}}
function record(s,event){s.trace.push({time:s.time,event,level:s.level,ocr:s.ocr,ext:s.ext,timer:s.timer});if(s.trace.length>100)s.trace.shift()}
function service(s){if(!s.enabled)return;if(s.extMask&&s.pending){s.pending=false;s.ext++;s.ocr=Math.max(0,Math.min(s.cfg.top+1,s.ocr+s.cfg.step));record(s,'INT0 ISR')}if(s.timerPending&&s.cfg.compare){s.timerPending=false;s.timer++;record(s,'Timer1 compare ISR')}}
function edge(s,next){if(next!==0&&next!==1)throw Error('Invalid pin level');const old=s.level;s.level=next;if(old!==next&&(s.cfg.mode==='CHANGE'||(s.cfg.mode==='FALLING'&&next===0)||(s.cfg.mode==='RISING'&&next===1)))s.pending=true;record(s,'D2 '+next);service(s)}
function advance(s,ms){if(!Number.isFinite(ms)||ms<0||ms>10000)throw Error('Invalid time step');const ticks=ms*16000/s.cfg.n;const period=s.cfg.top+1;const total=s.phase+ticks;const events=Math.floor(total/period);s.phase=total%period;s.time+=ms;if(events&&s.cfg.compare){if(s.enabled){s.timer+=events;record(s,events+' timer compare events (batched)')}else{s.timerPending=true;record(s,'Timer flag pending')}}return events}
function electrical(s,wires,resistance){const parent={};function find(a){if(!Object.hasOwn(parent,a))parent[a]=a;return parent[a]===a?a:(parent[a]=find(parent[a]))}function join(a,b){parent[find(a)]=find(b)}for(const [a,b] of wires)join(a,b);const same=(a,b)=>find(a)===find(b);const short=same('D9','GND');const valid=!short&&same('D9','R1')&&same('R2','A')&&same('K','GND')&&!same('R1','R2')&&!same('A','K')&&!same('D9','A')&&!same('R2','GND');const button=same('D2','BTN1')&&same('BTN2','GND')&&!same('D2','GND');const duty=s.ocr/(s.cfg.top+1);const current=valid?3000/resistance:0;return {short,valid,button,duty,current,average:current*duty,frequency:16000000/(s.cfg.n*(s.cfg.top+1))}}
root.EmbeddedEngine={parse,create,edge,advance,service,electrical,record};
})(typeof globalThis!=='undefined'?globalThis:this);
import assert from 'node:assert/strict';
import {CPU,avrInstruction,AVRIOPort,AVRTimer,portBConfig,portDConfig,timer1Config,PinState} from 'avr8js';
import {demoWords,loadHex,hexFromWords} from './avr-hex.mjs';
const cpu=new CPU(loadHex(hexFromWords(demoWords())));
const b=new AVRIOPort(cpu,portBConfig),d=new AVRIOPort(cpu,portDConfig);new AVRTimer(cpu,timer1Config);d.setPin(2,true);
function run(n){const end=cpu.cycles+n;let old=b.pinState(1)===PinState.High,rises=[],high=0,prev=cpu.cycles,toggles=0,led=b.pinState(5);while(cpu.cycles<end){avrInstruction(cpu);cpu.tick();const v=b.pinState(1)===PinState.High;if(old)high+=cpu.cycles-prev;if(v&&!old)rises.push(cpu.cycles);old=v;prev=cpu.cycles;const next=b.pinState(5);if(next!==led){toggles++;led=next}}return {duty:high/n,hz:16000000*(rises.length-1)/(rises.at(-1)-rises[0]),toggles}}
run(100000);assert.equal(cpu.data[0x24],0x22);assert.equal(cpu.data[0x80],0x81);assert.equal(cpu.data[0x81],0x0b);assert.equal(cpu.data[0x88],64);
const before=run(327680);assert.ok(Math.abs(before.hz-976.5625)<2);assert.ok(Math.abs(before.duty-.25)<.02);assert.ok(before.toggles>=19);
d.setPin(2,false);run(100000);assert.equal(cpu.data[0x88],192);const after=run(327680);assert.ok(Math.abs(after.duty-.75)<.02);assert.ok(Math.abs(after.hz-976.5625)<2);d.setPin(2,true);run(10000);assert.equal(cpu.data[0x88],192);d.setPin(2,false);run(10000);assert.equal(cpu.data[0x88],64);console.log({before,after});

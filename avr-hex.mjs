/* Intel HEX loader for ATmega328P flash. */
export function loadHex(text){
 const bytes=new Uint8Array(32768).fill(255);let base=0,eof=false,count=0;
 for(const raw of text.trim().split(/\r?\n/)){const line=raw.trim();if(!line)continue;if(eof||!/^:[0-9a-f]+$/i.test(line)||line.length%2!==1)throw Error('Invalid HEX record');
 const a=line.slice(1).match(/../g).map(x=>parseInt(x,16));if(a.length<5||a.length!==a[0]+5||(a.reduce((x,y)=>x+y,0)&255)!==0)throw Error('HEX length/checksum error');
 const n=a[0],addr=a[1]*256+a[2],type=a[3];if(type===0){if(base+addr+n>bytes.length)throw Error('Outside Uno flash');bytes.set(a.slice(4,4+n),base+addr);count+=n}
 else if(type===1&&n===0&&addr===0)eof=true;
 else if((type===2||type===4)&&n===2&&addr===0)base=(a[4]*256+a[5])*(type===2?16:65536);
 else if((type===3||type===5)&&n===4){}else throw Error('Unsupported HEX record');
 }if(!eof||!count)throw Error('Missing EOF or firmware data');const words=new Uint16Array(16384);for(let i=0;i<words.length;i++)words[i]=bytes[i*2]|bytes[i*2+1]<<8;return words;
}
export function hexFromWords(words){const bytes=words.flatMap(w=>[w&255,w>>8]);let lines=[];for(let i=0;i<bytes.length;i+=16){const b=bytes.slice(i,i+16),a=[b.length,i>>8,i&255,0,...b];a.push((-a.reduce((x,y)=>x+y,0))&255);lines.push(':'+a.map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase())}return lines.join('\n')+'\n:00000001FF'}
// Hand-encoded AVR machine instructions. Vector table uses two words per vector.
// INT0 toggles OCR1AL between 64 and 192; Timer1 overflow toggles D13.
export function demoWords(){
 const w=Array(52).fill(0);const emit=(...a)=>w.push(...a);const rjmp=(from,to)=>0xc000|((to-from-1)&4095);
 const ldi=(r,k)=>0xe000|((k&240)<<4)|((r-16)<<4)|(k&15);
 const out=(a,r)=>0xb800|((a&48)<<5)|(r<<4)|(a&15);
 const sts=(a,r)=>[0x9200|(r<<4),a];const lds=(r,a)=>[0x9000|(r<<4),a];
 const setup=w.length;emit(ldi(16,8),out(0x3e,16),ldi(16,255),out(0x3d,16)); // SP=0x08ff
 emit(ldi(16,0x22),out(4,16),ldi(16,4),out(11,16)); // PB1/PB5 outputs, PD2 pull-up
 emit(ldi(16,0x81),...sts(0x80,16),ldi(16,0x0b),...sts(0x81,16)); // Fast PWM 8-bit, /64
 emit(ldi(16,64),...sts(0x88,16),ldi(16,2),...sts(0x69,16),ldi(16,1),out(0x1d,16),...sts(0x6f,16),0x9478);
 emit(0xcfff);const ext=w.length;emit(...lds(17,0x88),ldi(18,128),0x2700|(1<<4)|2|0x200,...sts(0x88,17),0x9518); // EOR r17,r18
 const timer=w.length;emit(ldi(19,32),out(3,19),0x9518); // PINB write toggles PB5
 w[0]=rjmp(0,setup);w[2]=rjmp(2,ext);w[26]=rjmp(26,timer);return w;
}
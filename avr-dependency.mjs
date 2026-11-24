let api;try{api=await import('./vendor/avr8js.mjs')}catch{try{api=await import('https://cdn.jsdelivr.net/npm/avr8js@0.21.1/+esm')}catch{api=await import('https://esm.sh/avr8js@0.21.1?bundle')}}
export const {CPU,avrInstruction,AVRIOPort,AVRTimer,portBConfig,portDConfig,timer1Config,PinState}=api;

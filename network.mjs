// Ideal DC digital network, not SPICE. Resistive networks solved by nodal analysis.
export function solveNetwork({edges=[],drivers=[],resistors=[],leds=[]}){
 const parent=new Map();function root(x){if(!parent.has(x))parent.set(x,x);let p=parent.get(x);if(p!==x){p=root(p);parent.set(x,p)}return p}
 for(const [a,b] of edges)parent.set(root(a),root(b));
 for(const x of drivers)root(x.pin);for(const x of [...resistors,...leds]){root(x.a);root(x.b)}
 const fixed=new Map(),faults=[];for(const d of drivers){const n=root(d.pin);if(fixed.has(n)&&Math.abs(fixed.get(n)-d.v)>0.01)faults.push('Output contention at '+d.pin);else fixed.set(n,d.v)}
 const nodes=[...new Set([...parent.keys()].map(root))],free=nodes.filter(n=>!fixed.has(n)),idx=new Map(free.map((n,i)=>[n,i]));
 let values=new Map(fixed);for(const n of free)values.set(n,0);
 function voltage(p){return values.get(root(p))??0}
 // Piecewise linear LED: 2 V forward drop, 10 ohm dynamic resistance.
 let active=new Set();
 for(let iteration=0;iteration<16;iteration++){
 const m=free.map((_,i)=>Array.from({length:free.length+1},(_,j)=>i===j?1e-12:0));
 function branch(a,b,r,drop=0){if(!Number.isFinite(r)||r<=0)return;const x=root(a),y=root(b);if(x===y)return;const g=1/r;for(const [u,v,s] of [[x,y,1],[y,x,-1]]){const i=idx.get(u);if(i===undefined)continue;m[i][i]+=g;const j=idx.get(v);if(j===undefined)m[i][free.length]+=g*(fixed.get(v)??0);else m[i][j]-=g;m[i][free.length]+=s*g*drop}}
 for(const r of resistors)branch(r.a,r.b,r.ohms);
 for(const l of leds)if(active.has(l.id))branch(l.a,l.b,10,2);
 for(let i=0;i<free.length;i++){let p=i;for(let j=i+1;j<free.length;j++)if(Math.abs(m[j][i])>Math.abs(m[p][i]))p=j;[m[i],m[p]]=[m[p],m[i]];const q=m[i][i];for(let k=i;k<=free.length;k++)m[i][k]/=q;for(let j=0;j<free.length;j++)if(j!==i){const q=m[j][i];for(let k=i;k<=free.length;k++)m[j][k]-=q*m[i][k]}}
 for(let i=0;i<free.length;i++)values.set(free[i],m[i][free.length]);
 const next=new Set(leds.filter(l=>voltage(l.a)-voltage(l.b)>2+1e-8).map(l=>l.id));if([...next].every(x=>active.has(x))&&next.size===active.size)break;active=next;if(iteration===15)faults.push('LED network did not converge');
 }
 const currents=leds.map(l=>({id:l.id,mA:Math.max(0,(voltage(l.a)-voltage(l.b)-2)*100)}));for(const l of currents)if(l.mA>20)faults.push(l.id+' exceeds 20 mA');
 return {voltage,faults,currents};
}

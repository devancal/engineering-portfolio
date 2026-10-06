// Port of v8_kinematics.py at 8424f27b058f3213513e921fa1c24d8373887156.
// Dimensions in mm; displacement positive away from TDC. Constant RPM.
export const radius=40,rodLength=250;
export function motion(degrees,rpm){
 const theta=degrees*Math.PI/180,s=Math.sin(theta),c=Math.cos(theta),r=radius,L=rodLength;
 const A=L*L-r*r*s*s,root=Math.sqrt(A),omega=rpm*2*Math.PI/60;
 const position=r*c+root;
 return {position,displacement:r+L-position,crankX:r*s,crankY:r*c,
 velocity:(r*s+r*r*s*c/root)*omega/1000,
 acceleration:omega*omega*(r*c+r*r*Math.cos(2*theta)/root+r**4*s*s*c*c/A**1.5)/1000};
}
export function peaks(rpm){let speed=0,acceleration=0;for(let i=0;i<=3600;i++){const m=motion(i/10,rpm);speed=Math.max(speed,Math.abs(m.velocity));acceleration=Math.max(acceleration,Math.abs(m.acceleration));}return {speed,acceleration};}
export const number=(n,d=2)=>n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
export function mechanism(degrees){const m=motion(degrees,3000);const x=135+m.crankX,y=370-m.crankY,py=370-m.position;
 return `<svg class="mechanism" viewBox="0 0 360 440" role="img" aria-labelledby="mechanism-title"><title id="mechanism-title">One crank-slider mechanism: 40 mm crank radius, 250 mm rod, 80 mm stroke</title><path d="M85 45V190M185 45V190" class="guide"/><path d="M135 55V420" class="centerline"/><circle cx="135" cy="370" r="40" class="guide"/><path d="M200 80h15v80h-15" class="dimension"/><text x="225" y="115">80 mm</text><text x="225" y="135">stroke</text><text x="38" y="65">TDC</text><text x="38" y="177">BDC</text><line id="crank-line" x1="135" y1="370" x2="${x}" y2="${y}" class="crank"/><line id="rod-line" x1="${x}" y1="${y}" x2="135" y2="${py}" class="rod"/><rect id="piston-body" x="100" y="${py-22.5}" width="70" height="45" rx="3" class="piston"/><circle cx="135" cy="370" r="6" class="joint"/><circle id="crank-pin" cx="${x}" cy="${y}" r="6" class="joint"/><circle id="piston-pin" cx="135" cy="${py}" r="5" class="joint"/><text x="200" y="245">250 mm rod</text><text x="200" y="365">40 mm crank</text><text x="80" y="425">Crankshaft center</text></svg>`;
}
export function plot(key,rpm){
 const specs={displacement:['Displacement','mm',0,80],velocity:['Velocity','m/s',-Math.max(14,peaks(rpm).speed*1.1),Math.max(14,peaks(rpm).speed*1.1)],acceleration:['Acceleration','m/s²',-Math.max(5000,peaks(rpm).acceleration*1.1),Math.max(5000,peaks(rpm).acceleration*1.1)]};
 const [label,unit,min,max]=specs[key],y=v=>112-(v-min)/(max-min)*82;
 const path=speed=>Array.from({length:361},(_,a)=>`${a?'L':'M'}${(62+a/360*426).toFixed(2)},${y(motion(a,speed)[key]).toFixed(2)}`).join(' ');
 return `<svg viewBox="0 0 520 150" role="img" aria-label="${label} in ${unit} versus crank angle at ${rpm} RPM"><text x="62" y="17" class="plot-title">${label} (${unit})</text>${[min,(min+max)/2,max].map(v=>`<path d="M62 ${y(v)}H488" class="gridline"/><text x="54" y="${y(v)+4}" text-anchor="end">${number(v,Math.abs(v)>100?0:1)}</text>`).join('')}${[0,90,180,270,360].map(a=>`<text x="${62+a/360*426}" y="135" text-anchor="middle">${a}°</text>`).join('')}<path d="${path(3000)}" class="reference-curve"/><path d="${path(rpm)}" class="motion-curve"/><line data-cursor x1="62" x2="62" y1="27" y2="116" class="plot-cursor"/></svg>`;
}

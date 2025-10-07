/* ================================
   game.js — Simplified
   - Player name modal
   - Collision fixes + physics
   - Coins, goombas, flagpole, leaderboard
   ================================= */

/* ------- DOM ------- */
const $ = id => document.getElementById(id);
const viewport     = $('viewport');
const world        = $('world');
const marioEl      = $('mario');
const coinCountEl  = $('coinCount');
const flagpoleEl   = $('flagpole');
const flagBannerEl = $('flagBanner');
const castleEl     = $('castle');

/* ------- CONFIG ------- */
const VIEW_W = 980, VIEW_H = 540;
const WORLD_W = 3200, GROUND_H = 80;
const MAX_FALL = 24, MAX_RISE = 18;
const TOP_TOL = 6;

/* ------- PLAYER ------- */
let playerName = localStorage.getItem('currentPlayerName') || null;
let coinsCollected = 0, flagDropped = false, ended = false, camX = 0;
const player = {
  x: 120, y: GROUND_H, w: 44, h: 48,
  vx: 0, vy: 0, acc: 0.45, decel: 0.6, maxSpeed: 5.2,
  jumpVel: 100, gravity: -1,
  onGround: true, facing: 1, alive: true, celebrating: false
};
const keys = { left:0, right:0, jump:0 };

/* ------- INPUT ------- */
document.addEventListener('keydown', e => {
  if (["ArrowLeft","KeyA"].includes(e.code)) keys.left = 1;
  if (["ArrowRight","KeyD"].includes(e.code)) keys.right = 1;
  if (["Space","ArrowUp","KeyW"].includes(e.code)) keys.jump = 1;
});
document.addEventListener('keyup', e => {
  if (["ArrowLeft","KeyA"].includes(e.code)) keys.left = 0;
  if (["ArrowRight","KeyD"].includes(e.code)) keys.right = 0;
  if (["Space","ArrowUp","KeyW"].includes(e.code)) keys.jump = 0;
});

/* ------- HELPERS ------- */
const clamp = (v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const num = v => +v || 0;
const elRect = el => ({x:el.offsetLeft,y:world.offsetHeight-(el.offsetTop+el.offsetHeight),w:el.offsetWidth,h:el.offsetHeight});
const overlap = (a,b)=>!(a.x+a.w<=b.x||a.x>=b.x+b.w||a.y+a.h<=b.y||a.y>=b.y+b.h);

/* ------- SOLIDS ------- */
function getSolids(){ return [...document.querySelectorAll('[data-solid]')].map(el=>({el,...elRect(el)})); }

/* ------- GOOMBAS ------- */
let goombas=[];
function buildGoombas(){
  goombas=[...document.querySelectorAll('.goomba')].map(el=>{
    const r=elRect(el),range=num(el.dataset.range||140);
    return {el,...r,minX:r.x-range/2,maxX:r.x+range/2,speed:num(el.dataset.speed||1),vx:num(el.dataset.speed||1),alive:true};
  });
}

/* ------- CAMERA ------- */
function updateCamera(){
  camX=clamp(player.x+player.w/2-VIEW_W/2,0,WORLD_W-VIEW_W);
  world.style.transform=`translate3d(${-camX}px,0,0)`;
}

/* ------- PHYSICS ------- */
function applyGravity(){
  player.vy=clamp(player.vy+player.gravity,-MAX_FALL,MAX_RISE);
  let y=player.y+player.vy;
  if(y<=GROUND_H){y=GROUND_H;player.vy=0;player.onGround=true;}else player.onGround=false;
  player.y=y;
}
function collideSolids(){
  let {x,y}=player;
  for(const s of getSolids()){
    const p={x,y,w:player.w,h:player.h};
    if(!overlap(p,s)) continue;
    const dx=Math.min(p.x+p.w,s.x+s.w)-Math.max(p.x,s.x);
    const dy=Math.min(p.y+p.h,s.y+s.h)-Math.max(p.y,s.y);
    if(dy<dx){ // vertical
      if(player.vy<0){y=s.y+s.h;player.onGround=true;}
      else y=s.y-player.h;
      player.vy=0;
    }else{ // horizontal
      const onTop=player.y>=s.y+s.h-TOP_TOL;
      if(!onTop){ x=player.vx>0?s.x-player.w:s.x+s.w; player.vx=0; }
    }
  }
  player.x=clamp(x,0,WORLD_W-player.w);
  player.y=Math.max(y,GROUND_H);
}

/* ------- COINS ------- */
function updateCoins(){
  for(const el of document.querySelectorAll('.coin')){
    if(el.dataset.taken) continue;
    if(overlap({x:player.x,y:player.y,w:player.w,h:player.h},elRect(el))){
      el.dataset.taken=1; el.style.visibility='hidden';
      coinsCollected++; coinCountEl.textContent=String(coinsCollected).padStart(2,'0');
    }
  }
}

/* ------- GOOMBAS ------- */
function updateGoombas(){
  for(const g of goombas){
    if(!g.alive) continue;
    g.x+=g.vx;
    if(g.x<=g.minX||g.x+g.w>=g.maxX){g.vx*=-1;}
    g.el.style.left=`${g.x}px`;
    const p={x:player.x,y:player.y,w:player.w,h:player.h},r={x:g.x,y:g.y,w:g.w,h:g.h};
    if(!overlap(p,r)) continue;
    const dx=Math.min(p.x+p.w,r.x+r.w)-Math.max(p.x,r.x);
    const dy=Math.min(p.y+p.h,r.y+r.h)-Math.max(p.y,r.y);
    if(dy<dx && player.vy<0){ // stomp
      g.alive=false; g.el.classList.add('squashed');
      setTimeout(()=>g.el.style.visibility='hidden',140);
      player.vy=player.jumpVel*0.55; player.onGround=false;
    } else return gameOver(false);
  }
}

/* ------- FLAG ------- */
function checkFlag(){
  if(!flagpoleEl||player.celebrating) return;
  const pole=elRect(flagpoleEl),p={x:player.x,y:player.y,w:player.w,h:player.h};
  if(p.x+p.w>pole.x&&p.x<pole.x+pole.w && player.y<=pole.y+pole.h+6){
    player.celebrating=true; player.vx=0; player.x=pole.x-player.w+6;
    if(flagBannerEl&&!flagDropped){
      flagDropped=true; let t=0,start=elRect(flagBannerEl).y,target=GROUND_H+24;
      const drop=setInterval(()=>{t+=16;const k=clamp(t/600,0,1);flagBannerEl.style.bottom=`${start+(target-start)*k}px`;if(k>=1)clearInterval(drop);},16);
    }
    const slide=setInterval(()=>{player.y=Math.max(GROUND_H,player.y-6.5);if(player.y<=GROUND_H){clearInterval(slide);walkToCastle();}},16);
  }
}
function walkToCastle(){
  const target=castleEl?castleEl.offsetLeft+10:player.x;
  const t=setInterval(()=>{player.x+=2.5;if(player.x>=target){clearInterval(t);gameOver(true);}},16);
}

/* ------- GAMEOVER ------- */
function gameOver(won){
  if(ended) return; ended=true;
  const lb=JSON.parse(localStorage.getItem('leaderboard')||'[]');
  lb.push({name:playerName||'Player',score:coinsCollected,ts:Date.now()});
  localStorage.setItem('leaderboard',JSON.stringify(lb));
  setTimeout(()=>location.href='leaderboard.html',won?700:400);
}

/* ------- PLAYER MOTION ------- */
function updatePlayer(){
  if(keys.right) player.vx=clamp(player.vx+player.acc,-player.maxSpeed,player.maxSpeed),player.facing=1;
  else if(keys.left) player.vx=clamp(player.vx-player.acc,-player.maxSpeed,player.maxSpeed),player.facing=-1;
  else player.vx+=player.vx>0?-player.decel:player.vx<0?player.decel:0;
  if(keys.jump&&player.onGround&&!player.celebrating){player.vy=player.jumpVel;player.onGround=false;}
  player.x=clamp(player.x+player.vx,0,WORLD_W-player.w);
}

/* ------- RENDER ------- */
function render(){
  marioEl.style.left=`${player.x}px`;
  marioEl.style.bottom=`${player.y}px`;
  marioEl.style.transform=`scaleX(${player.facing})`;
}

/* ------- MAIN LOOP ------- */
function tick(){
  if(!player.alive) return;
  updatePlayer(); applyGravity(); collideSolids();
  updateCoins(); updateGoombas(); checkFlag();
  updateCamera(); render();
  requestAnimationFrame(tick);
}

/* ------- NAME MODAL ------- */
function askName(){
  const overlay=document.createElement('div');
  overlay.style.cssText="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:9999";
  overlay.innerHTML=`<div style="background:#fff;padding:18px;border-radius:10px;min-width:320px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.4)">
    <div style="font-weight:700;margin-bottom:8px">Welcome — Enter your name</div>
    <input id="nameInput" placeholder="Player" style="width:100%;padding:8px 10px;font-size:16px;border-radius:6px;border:1px solid #ccc"><br>
    <button id="startBtn" style="margin-top:10px;padding:8px 12px;border-radius:6px;cursor:pointer">Start Game</button>
  </div>`;
  document.body.appendChild(overlay);
  const input=overlay.querySelector('#nameInput'),btn=overlay.querySelector('#startBtn');
  input.focus();
  const start=()=>{playerName=(input.value||'Player').trim().slice(0,32)||'Player';localStorage.setItem('currentPlayerName',playerName);overlay.remove();tick();};
  btn.onclick=start; input.onkeydown=e=>{if(e.key==='Enter')start();};
}

/* ------- INIT ------- */
(function init(){
  world.style.height=`${VIEW_H}px`;
  viewport.style.cssText=`width:${VIEW_W}px;height:${VIEW_H}px`;
  buildGoombas(); coinCountEl.textContent="00";
  player.x=clamp(player.x,0,WORLD_W-player.w);
  askName();
})();

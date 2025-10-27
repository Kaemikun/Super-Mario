const $ =id => document.getElementById(id); // just a short hand trick tht i learned while implementing its common in jquerry to do this :)
const world =$('world');
const mario =$('mario');
const flagpole=$('flagpole');
const coinCountEl =$('coinCount');

let player ={  //this here tells the initial postion nd the state of our mario(character) :D
  x: 120,
  y: 80,
  w: 44,
  h : 48,
  vx: 0,
  vy: 0,
  onGround: false,
  facing: 1,
  alive: true
};

let coins =0;
let playerName =localStorage.getItem('currentPlayerName') || null;
let gameEnded =false;
 const GRAVITY =-0.9;
const JUMP_VEL =18;
const MOVE_SPEED =5;
const GROUND_Y =80;
const VIEWPORT_WIDTH=800; 
const WORLD_MAX_X =3000;   

const keys ={ left: false, right: false, up: false };
document.addEventListener('keydown', e => {
  if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left =true; //this e.code is for the array of keys we(players) gonna press it will just check if its pressed :)
  if (['ArrowRight', 'KeyD'].includes(e.code))keys.right =true;
  if (['ArrowUp', 'Space', 'KeyW'].includes(e.code)) keys.up =true;
});
document.addEventListener('keyup', e => {
  if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left =false;
  if(['ArrowRight', 'KeyD'].includes(e.code))keys.right =false;
  if (['ArrowUp', 'Space', 'KeyW'].includes(e.code)) keys.up =false;
});

function overlap(a, b) {
  return !(a.x + a.w< b.x || a.x >b.x + b.w || a.y + a.h <b.y || a.y >b.y + b.h);
}

function rect(el) {
  const s =window.getComputedStyle(el);  //this here give the css left bottom etc properties
  return {
    x: parseFloat(s.left), //if u wonder why we doin parseFloat well we have to convert out for eg "125px" to 125 int so ye.. 
    y: parseFloat(s.bottom),
    w: parseFloat(s.width),
    h: parseFloat(s.height)
  };
}

function getSolids() {
  return [...document.querySelectorAll('[data-solid]')].map(rect); // here i did data destructuring nd used the dataset property of dom objects
}


let goombas =[];
function initGoombas() {
  goombas =[...document.querySelectorAll('.goomba')].map(el => {
    const r =rect(el);
    return {
      el,
      x: r.x,
      y : r.y,
      w: r.w,
      h: r.h,
      vx: 1,
      minX: +el.dataset.min || r.x-100,
      maxX: +el.dataset.max || r.x+100,
      alive: true
    };
  });
}

function updateGoombas() {
  for (const g of goombas) {
    if (!g.alive) continue;
    g.x +=g.vx;
    if (g.x <=g.minX || g.x + g.w >=g.maxX) g.vx *=-1;
    g.el.style.left =g.x +'px';

    const pr ={ x: player.x, y: player.y, w: player.w, h: player.h };
    if(!overlap(pr, g)) continue;


    if (player.vy <0 && player.y+player.h >g.y+g.h*0.6) {
      g.alive =false;
      g.el.style.visibility ='hidden';
      player.vy =JUMP_VEL *0.6;
    } 
    else {
      endGame(false);
    }
  }
}


function applyPhysics() {

  if (keys.left) {
    player.vx =-MOVE_SPEED;
    player.facing =-1;
  } 
  else if (keys.right) {
    player.vx =MOVE_SPEED;
    player.facing =1;
  } 
  else player.vx =0;

  
  if (keys.up && player.onGround) {
    player.vy =JUMP_VEL;
    player.onGround =false;
  }

  
  player.vy +=GRAVITY;
  player.x +=player.vx;
  player.y +=player.vy;

  
  if (player.x <0) player.x =0;
  if (player.x >WORLD_MAX_X -player.w) player.x =WORLD_MAX_X -player.w;

  
  if (player.y <=GROUND_Y) {
    player.y =GROUND_Y;
    player.vy =0;
    player.onGround =true;
  }

  
  for (const s of getSolids()) {
    if (!overlap(player, s)) continue;

    
    if (player.vy <=0 && player.y + player.h > s.y && player.y < s.y + s.h) {
      player.y =s.y + s.h;
      player.vy =0;
      player.onGround =true;
    } 
    else if (player.vx > 0) {
      player.x =s.x - player.w;
    } 
    else if (player.vx < 0) {
      player.x =s.x + s.w;
    }
  }
}


function updateCoins() {
  for (const el of document.querySelectorAll('.coin')) {
    if (el.dataset.taken) continue;
    const c =rect(el);
    if (overlap(player, c)) {
      el.dataset.taken =1;
      el.style.visibility ='hidden';
      coins++;
      coinCountEl.textContent =coins;
    }
  }
}


function checkFlag() {
  const f =rect(flagpole);
  if (overlap(player, f)) endGame(true);
}


function endGame(win) {
  if (gameEnded) return;
  gameEnded =true;

  const lb =JSON.parse(localStorage.getItem('leaderboard') || '[]');
  //this makes sure tht only highest scores will be displayed by each user ;)
  const existing =lb.find(entry => entry.name ===playerName);
  if (existing) {
    if (coins > existing.score) {
      existing.score =coins;
      existing.ts =Date.now();
    }
  } 
  else {
    lb.push({ name: playerName || 'Player', score: coins, ts: Date.now() });
  }

  localStorage.setItem('leaderboard', JSON.stringify(lb));

  alert(win ? `You reached the flag :) ! Coins: ${coins}` : `Game Over :( ! Coins: ${coins}`);
  window.location.href ='leaderboard.html';
}



function render() {
  
  const cameraX =Math.min(
    Math.max(player.x - VIEWPORT_WIDTH / 2, 0),
    WORLD_MAX_X - VIEWPORT_WIDTH
  );
  world.style.transform =`translateX(${-cameraX}px)`;

  
  mario.style.left =player.x + 'px';
  mario.style.bottom =player.y + 'px';
  mario.style.transform =`scaleX(${player.facing})`;
}


function tick() {
  if (gameEnded) return;
  applyPhysics();
  updateCoins();
  updateGoombas();
  checkFlag();
  render();
  requestAnimationFrame(tick); 
  //this is one of the most core things to look at cuz i could have used setTimeout or setInterval
  //i didnt use them cuz they were not in sync nd were laggy nd they are also quite heavy for cpu
  //so thts why i used the requestAnimationFrame cuz it refreshes evey 16 ms nd works on 60fps
  //i also didnt use the while loop cuz tht will just block my main thread
}


function askName() {
  const overlay =document.createElement('div');
  overlay.style.cssText =`
    position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,0.6);z-index:9999;
  `;
  overlay.innerHTML =`
    <div style="background:#fff; padding:18px; border-radius:10px; min-width:320px; text-align:center">
      <div style="font-weight:bold;margin-bottom:8px">Welcome to Super Mario :) !</div>
      <input id="nameInput" placeholder="Your Name" style="width:100%;padding:8px;font-size:16px;border-radius:6px;border:1px solid #ccc"><br>
      <button id="startBtn" style="margin-top:10px;padding:8px 12px;border-radius:6px;cursor:pointer">Start Game</button>
    </div>
    `;
  
  document.body.appendChild(overlay);
  const input =overlay.querySelector('#nameInput');
  const btn =overlay.querySelector('#startBtn');

  const start =() => {
    playerName =(input.value || 'Player').trim();
    localStorage.setItem('currentPlayerName', playerName);
    overlay.remove();
    tick();
  };
  btn.onclick =start;
  input.onkeydown =e => { if (e.key ==='Enter') start(); };
  input.focus();
}


(function init() {
  initGoombas();
  coinCountEl.textContent ='0';
  askName();
})();



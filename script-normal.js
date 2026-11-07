const nav=document.getElementById('mainNav');
const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>60);
  btt.classList.toggle('show',window.scrollY>500);
},{passive:true});

let mobOpen=false;
function toggleMob(){
  mobOpen=!mobOpen;
  document.getElementById('mobDrawer').classList.toggle('open',mobOpen);
  document.getElementById('mobBackdrop').classList.toggle('open',mobOpen);
  document.getElementById('ham').classList.toggle('open',mobOpen);
  document.getElementById('ham').setAttribute('aria-expanded',mobOpen);
  document.body.style.overflow=mobOpen?'hidden':'';
}
function closeMob(){
  mobOpen=false;
  document.getElementById('mobDrawer').classList.remove('open');
  document.getElementById('mobBackdrop').classList.remove('open');
  document.getElementById('ham').classList.remove('open');
  document.getElementById('ham').setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobOpen)closeMob()});

/* Tap anywhere on empty space inside the drawer (not a link/button) to dismiss it */
document.getElementById('mobDrawer').addEventListener('click',function(e){
  if(!e.target.closest('a,button')) closeMob();
});

/* LIGHTBOX */
function openLightbox(src){
  document.getElementById('lightboxImg').src=src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});

let cur=0,tot=7,timer;
function goSlide(i){
  document.querySelectorAll('.hero-slide')[cur].classList.remove('active');
  document.querySelectorAll('.h-dot')[cur].classList.remove('on');
  cur=i;
  document.querySelectorAll('.hero-slide')[cur].classList.add('active');
  document.querySelectorAll('.h-dot')[cur].classList.add('on');
  clearInterval(timer);startTimer();
}
function startTimer(){timer=setInterval(()=>goSlide((cur+1)%tot),5000)}
startTimer();

let tx=null;
const heroEl=document.querySelector('.hero');
heroEl.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
heroEl.addEventListener('touchend',e=>{
  if(tx===null)return;
  const dx=e.changedTouches[0].clientX-tx;
  if(Math.abs(dx)>50)goSlide(dx<0?(cur+1)%tot:(cur-1+tot)%tot);
  tx=null;
},{passive:true});

function mTab(btn,id){
  document.querySelectorAll('.mtab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.mpanel').forEach(p=>p.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('p-'+id).classList.add('on');
}

function toggleLegal(){
  const btn=document.getElementById('legalToggle');
  const content=document.getElementById('legalContent');
  const plus=document.getElementById('legalPlus');
  const open=content.classList.toggle('open');
  btn.setAttribute('aria-expanded',open);
  plus.textContent=open?'×':'+';
}

const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')});
},{threshold:.08});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

const nums=document.querySelectorAll('.s-num');
const numObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target, final=parseInt(el.dataset.final,10), suffix=el.dataset.suffix||'';
      let start=null;
      const dur=1100;
      function step(ts){
        if(!start)start=ts;
        const p=Math.min((ts-start)/dur,1);
        const eased=1-Math.pow(1-p,3);
        el.textContent=Math.round(final*eased)+suffix;
        if(p<1)requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      numObs.unobserve(el);
    }
  });
},{threshold:.6});
nums.forEach(el=>numObs.observe(el));

const spySections=['about','menu','events','raeume','location'].map(id=>document.getElementById(id));
const navLinks=document.querySelectorAll('.nl');
const spy=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+entry.target.id));
    }
  });
},{rootMargin:'-45% 0px -50% 0px'});
spySections.forEach(s=>s&&spy.observe(s));

document.getElementById('year').textContent=new Date().getFullYear();

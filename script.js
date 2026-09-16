const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

$$("[data-scroll]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.scroll)?.scrollIntoView({behavior:"smooth"})));

const questions=[
 {q:"Be honest… who is the bigger headache in this friendship? 😂",a:["Obviously Mohit","Obviously Shejal","Both are equally problematic","This question is unfair 😭"],correct:3,ok:"Correct. The question WAS unfair. 😌"},
 {q:"How many times have you promised me “I'll send you the pictures later”? 😂",a:["2–3 times","10+ times","I don't remember 😌","Nice try. I'm not exposing myself."],correct:1,ok:"The evidence says 10+. The defence rests. 💀"},
 {q:"If I ask you AGAIN to meet, what are you most likely to say? 😂",a:["Yes, finally!","I'll see…","I'm busy.","Ask my parents first. 💀"],correct:1,ok:"Exactly. “I'll see…” — the national anthem of this friendship. 😂"},
 {q:"Who usually starts the conversation? 👀",a:["Shejal","Mohit","Whoever remembers the other person exists 😂","Nobody. We communicate telepathically."],correct:1,ok:"Correct. I have accepted my destiny. 😭"},
 {q:"What was Mohit thinking after the legendary “Namaste Didi” incident? 😂",a:["Harami, bas bezzati karati haii 😭","Mere yaha aane se pehle bhi bata sakti thi ye 😭","Why are they laughing at me?","All of the above"],correct:1,ok:"YES. THAT EXACT THOUGHT. 😂"}];

let qi=0;
function renderQ(){
 const q=questions[qi], box=$("#questionBox");
 $("#progressBar").style.width=((qi)/questions.length*100)+"%";
 box.innerHTML=`<div class="q-count">Question ${qi+1} / ${questions.length}</div><div class="question">${q.q}</div><div class="answers">${q.a.map((x,i)=>`<button class="answer" data-i="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join("")}</div>`;
 $$(".answer").forEach(btn=>btn.addEventListener("click",()=>answer(+btn.dataset.i)));
}
function answer(i){
 const q=questions[qi], buttons=$$(".answer");
 buttons.forEach(b=>b.disabled=true);
 buttons[q.correct].classList.add("correct");
 if(i!==q.correct) buttons[i].classList.add("wrong");
 $("#quizResult").textContent=i===q.correct?q.ok:"Wrong. But honestly, I'll allow it. 😂";
 setTimeout(()=>{
   qi++;
   if(qi<questions.length) renderQ();
   else {
     $("#progressBar").style.width="100%";
     $("#questionBox").innerHTML=`<div class="q-count">TEST COMPLETE</div><div class="question">Congratulations. You survived the friendship audit. 🎓</div><button class="primary-btn" data-scroll="#secret">There is still something →</button>`;
     $("#quizResult").textContent="Score isn't important. Your friendship is. (Yes, that was disgustingly wholesome.)";
     $("#questionBox .primary-btn").addEventListener("click",()=>document.querySelector(".secret-section").scrollIntoView({behavior:"smooth"}));
   }
 },900);
}
renderQ();

$("#secretBtn").addEventListener("click",()=>{
 $("#secretMessage").classList.add("show");
 $("#secretBtn").style.display="none";
});

const noBtn=$("#noBtn"), noText=$("#noText");
let noClicks=0;
function dodge(){
 noClicks++;
 const messages=["Are you sure? 👀","Think again.","Shejal... seriously? 😭","NO HAS LEFT THE CHAT 💀","Nice try. 😂"];
 noText.textContent=messages[Math.min(noClicks-1,messages.length-1)];
 const area=document.querySelector(".choice-area");
 const maxX=Math.max(0,area.clientWidth/2-80), maxY=35;
 noBtn.style.position="absolute";
 noBtn.style.transform=`translate(${(Math.random()*2-1)*maxX}px,${(Math.random()*2-1)*maxY}px)`;
}
noBtn.addEventListener("mouseenter",dodge);
noBtn.addEventListener("touchstart",(e)=>{e.preventDefault();dodge()});
noBtn.addEventListener("click",dodge);

$("#yesBtn").addEventListener("click",()=>{
 $("#finale").style.display="none";
 const c=$("#celebration"); c.classList.add("active");
 c.scrollIntoView({behavior:"smooth"});
 launchConfetti();
});

function launchConfetti(){
 const canvas=$("#confetti"),ctx=canvas.getContext("2d");
 let W=canvas.width=innerWidth*devicePixelRatio,H=canvas.height=innerHeight*devicePixelRatio;
 canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.scale(devicePixelRatio,devicePixelRatio);
 W=innerWidth;H=innerHeight;
 const pieces=Array.from({length:130},()=>({x:Math.random()*W,y:-20-Math.random()*H*.4,r:3+Math.random()*4,v:2+Math.random()*4,a:Math.random()*Math.PI*2,s:(Math.random()-.5)*.08}));
 let start=performance.now();
 function frame(t){
   ctx.clearRect(0,0,W,H);
   pieces.forEach(p=>{
     p.y+=p.v;p.x+=Math.sin(t/500+p.x)*.6;p.a+=p.s;
     ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);
     ctx.fillStyle=["#f2a9ca","#c9a6ee","#f4d6a0","#b4e0d0","#ffffff"][Math.floor(Math.random()*5)];
     ctx.fillRect(-p.r,-p.r,p.r*2,p.r*2);ctx.restore();
     if(p.y>H+20)p.y=-20;
   });
   if(t-start<9000) requestAnimationFrame(frame); else ctx.clearRect(0,0,W,H);
 }
 requestAnimationFrame(frame);
}
window.addEventListener("resize",()=>{});


// ===== ADVANCED INTERACTION LAYER =====
(() => {
  const loader = document.getElementById("pageLoader");
  const progress = document.getElementById("readingProgress");
  const backTop = document.getElementById("backTop");
  const toast = document.getElementById("toast");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxText = document.getElementById("lightboxText");
  const lightboxIndex = document.getElementById("lightboxIndex");
  const close = document.getElementById("lightboxClose");
  const prev = document.getElementById("lightboxPrev");
  const next = document.getElementById("lightboxNext");
  let gallery = [], current = 0, toastTimer;

  window.addEventListener("load", () => setTimeout(() => loader?.classList.add("hidden"), 350), {once:true});

  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 0;
    if(progress) progress.style.width = pct + "%";
    backTop?.classList.toggle("show", scrollY > innerHeight * .65);
  };
  addEventListener("scroll", updateScrollUI, {passive:true});
  updateScrollUI();
  backTop?.addEventListener("click", () => scrollTo({top:0, behavior:"smooth"}));

  // Scroll reveal: content enters only when it becomes relevant.
  const revealItems = document.querySelectorAll("[data-reveal]");
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add("revealed"); io.unobserve(e.target); }
    }), {threshold:.12, rootMargin:"0px 0px -35px 0px"});
    revealItems.forEach(el => io.observe(el));
  } else revealItems.forEach(el => el.classList.add("revealed"));

  // Build one unified image gallery from all tappable photos.
  const images = [...document.querySelectorAll(".photo-card img, .place-card img, .final-photo")];
  gallery = images.map((img, i) => {
    const card = img.closest("figure, .place-card, .celebration-content");
    const title = card?.querySelector("figcaption b")?.textContent?.trim() ||
                  (img.closest(".place-card") ? "Favourite place" : "Shejal");
    const fallback = card?.querySelector("figcaption span")?.textContent?.trim() || img.dataset.caption || img.alt;
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "Open photo: " + (img.alt || "Shejal"));
    return {img, src:img.currentSrc || img.src, alt:img.alt, title, text:fallback};
  });

  function show(index){
    if(!gallery.length) return;
    current = (index + gallery.length) % gallery.length;
    const item = gallery[current];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxTitle.textContent = item.title;
    lightboxText.textContent = item.text;
    lightboxIndex.textContent = `Photo ${current + 1} of ${gallery.length}`;
    prev.disabled = gallery.length < 2;
    next.disabled = gallery.length < 2;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function hide(){
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
    setTimeout(() => { if(!lightbox.classList.contains("open")) lightboxImage.src=""; }, 350);
  }
  images.forEach((img, i) => {
    img.addEventListener("click", () => show(i));
    img.addEventListener("keydown", e => { if(e.key === "Enter" || e.key === " "){e.preventDefault(); show(i);} });
  });
  close?.addEventListener("click", hide);
  prev?.addEventListener("click", e => {e.stopPropagation(); show(current - 1)});
  next?.addEventListener("click", e => {e.stopPropagation(); show(current + 1)});
  lightbox?.addEventListener("click", e => { if(e.target === lightbox) hide(); });
  addEventListener("keydown", e => {
    if(!lightbox?.classList.contains("open")) return;
    if(e.key === "Escape") hide();
    if(e.key === "ArrowLeft") show(current - 1);
    if(e.key === "ArrowRight") show(current + 1);
  });

  // Swipe navigation on phones.
  let touchX = 0;
  lightbox?.addEventListener("touchstart", e => { touchX = e.changedTouches[0].clientX; }, {passive:true});
  lightbox?.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if(Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  }, {passive:true});

  // Tiny contextual toast when a user first discovers the gallery.
  let galleryHintShown = false;
  const gallerySection = document.getElementById("photos");
  if(gallerySection && "IntersectionObserver" in window){
    const hint = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && !galleryHintShown){
        galleryHintShown = true;
        toast.textContent = "Tap a photo to open it ✨";
        toast.classList.add("show");
        clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
        hint.disconnect();
      }
    }, {threshold:.3});
    hint.observe(gallerySection);
  }
})();

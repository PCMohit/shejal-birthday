const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

/* ===== CONFIG ===== */
const SITE_CONFIG = window.SHEJAL_CONFIG || {replyEndpoint:""};

/* ===== BASIC SCROLL ACTIONS ===== */
$$('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>$(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));

/* ===== QUIZ ===== */
const questions=[
 {q:"Be honest… who is the bigger headache in this friendship? 😂",a:["Obviously Mohit","Obviously Shejal","Both are equally problematic","This question is unfair 😭"],correct:3,ok:"Correct. The question WAS unfair. 😌"},
 {q:"How many times have you promised me “I'll send you the pictures later”? 😂",a:["2–3 times","10+ times","I don't remember 😌","Nice try. I'm not exposing myself."],correct:1,ok:"The evidence says 10+. The defence rests. 💀"},
 {q:"If I ask you AGAIN to meet, what are you most likely to say? 😂",a:["Yes, finally!","I'll see…","I'm busy.","Ask my parents first. 💀"],correct:1,ok:"Exactly. “I'll see…” — the national anthem of this friendship. 😂"},
 {q:"Who usually starts the conversation? 👀",a:["Shejal","Mohit","Whoever remembers the other person exists 😂","Nobody. We communicate telepathically."],correct:1,ok:"Correct. I have accepted my destiny. 😭"},
 {q:"What was Mohit thinking after the legendary “Namaste Didi” incident? 😂",a:["Harami, bas bezzati karati haii 😭","Mere yaha aane se pehle bhi bata sakti thi ye 😭","Why are they laughing at me?","All of the above"],correct:1,ok:"YES. THAT EXACT THOUGHT. 😂"}
];
let qi=0;
let quizScore=0;
const quizAnswers=[];

function syncQuizMeta(){
  const scoreInput=$('#quizScoreHidden');
  const answersInput=$('#quizAnswersHidden');
  if(scoreInput) scoreInput.value=`${quizScore}/${questions.length}`;
  if(answersInput) answersInput.value=quizAnswers.map((a,i)=>`Q${i+1}:${a}`).join(' | ');
}

function renderQ(){
 const q=questions[qi],box=$('#questionBox');
 if(!q || !box) return;
 $('#progressBar').style.width=((qi)/questions.length*100)+'%';
 box.innerHTML=`<div class="q-count">Question ${qi+1} / ${questions.length}</div><div class="question">${q.q}</div><div class="answers">${q.a.map((x,i)=>`<button class="answer" type="button" data-i="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join('')}</div>`;
 $('#quizResult').textContent=`Score: ${quizScore} / ${questions.length}`; $('#quizScorePill') && ($('#quizScorePill').textContent=`${quizScore} / ${questions.length}`);
 $$('.answer').forEach(btn=>btn.addEventListener('click',()=>answer(+btn.dataset.i),{once:true}));
}

function answer(i){
 const q=questions[qi],buttons=$$('.answer');
 if(!q || !buttons.length) return;
 buttons.forEach(b=>b.disabled=true);
 buttons[q.correct]?.classList.add('correct');
 if(i!==q.correct) buttons[i]?.classList.add('wrong');
 if(i===q.correct) quizScore++;
 quizAnswers.push(i===q.correct ? `Correct (${String.fromCharCode(65+i)})` : `Wrong (${String.fromCharCode(65+i)}; correct ${String.fromCharCode(65+q.correct)})`);
 syncQuizMeta();
 $('#quizResult').textContent=`${i===q.correct?q.ok:'Wrong. But honestly, I\'ll allow it. 😂'}  ·  Score: ${quizScore}/${questions.length}`; $('#quizScorePill') && ($('#quizScorePill').textContent=`${quizScore} / ${questions.length}`);
 window.setTimeout(()=>{
   qi++;
   if(qi<questions.length){
     renderQ();
   }else{
     $('#progressBar').style.width='100%';
     $('#questionBox').innerHTML=`<div class="q-count">TEST COMPLETE</div><div class="quiz-final-score"><span>Your memory-check score</span><strong>${quizScore} / ${questions.length}</strong><small>${quizScore===questions.length?'Perfect score. Suspiciously impressive. 😌':quizScore>=3?'Not bad. The friendship survives another memory check. 😂':'Okay… we clearly need another 15 years of friendship training. 😭'}</small></div><button class="primary-btn" type="button" data-scroll="#secret">There is still something →</button>`;
     $('#quizResult').textContent=`Final result: ${quizScore}/${questions.length}. Your answers will also be included with your reply.`;
     $('#questionBox .primary-btn')?.addEventListener('click',()=>$('#secret')?.scrollIntoView({behavior:'smooth'}),{once:true});
     syncQuizMeta(); $('#quizScorePill') && ($('#quizScorePill').textContent=`${quizScore} / ${questions.length}`);
   }
 },700);
}
renderQ();

/* ===== SECRET ===== */
$('#secretBtn')?.addEventListener('click',()=>{
 $('#secretMessage')?.classList.add('show');
 const btn=$('#secretBtn'); if(btn) btn.style.display='none';
});

/* ===== SOFT LAUNCH MODAL ===== */
(()=>{
 const modal=$('#softLaunchModal');
 const openBtn=$('#openSoftLaunch');
 const closeBtn=$('#softLaunchClose');
 const yes=$('#softReplyYes');
 const later=$('#softReplyLater');
 const reply=$('#reply');
 let returnFocus=null;
 const open=()=>{
   if(!modal) return;
   returnFocus=document.activeElement;
   modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
   document.body.style.overflow='hidden';
   window.setTimeout(()=>closeBtn?.focus(),50);
 };
 const close=()=>{
   modal?.classList.remove('open'); modal?.setAttribute('aria-hidden','true'); document.body.style.overflow='';
   returnFocus?.focus?.();
 };
 openBtn?.addEventListener('click',open);
 closeBtn?.addEventListener('click',close);
 modal?.addEventListener('click',e=>{if(e.target.dataset.softClose!==undefined) close();});
 yes?.addEventListener('click',()=>{close(); reply?.scrollIntoView({behavior:'smooth'}); window.setTimeout(()=>$('#softAnswer')?.focus(),500);});
 later?.addEventListener('click',()=>{close(); reply?.scrollIntoView({behavior:'smooth'}); window.setTimeout(()=>{const sel=$('#softAnswer'); if(sel){sel.focus();sel.value='Maybe… let me think. 😭';}},500);});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open')) close();});
 // Open once when the dedicated section becomes relevant.
 const section=$('#soft-launch');
 if(section && 'IntersectionObserver' in window){
   const io=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){io.disconnect();window.setTimeout(open,650);}}, {threshold:.45});
   io.observe(section);
 }
})();

/* ===== HONEST FINAL QUESTION ===== */
const noBtn=$('#noBtn'),noText=$('#noText'),choiceArea=document.querySelector('.choice-area');
let noClicks=0;
let lastDodge=0;

function dodgeNoButton(pointerX=null,pointerY=null){
  if(!noBtn || !choiceArea) return;
  const now=performance.now();
  if(now-lastDodge<220) return;
  lastDodge=now;
  noClicks++;

  const messages=[
    'Are you sure? 👀',
    'Think again. 😭',
    'That button is suspiciously fast. 😂',
    'NO is trying to escape the conversation. 💀',
    'Nice try. 😌'
  ];
  if(noText) noText.textContent=messages[Math.min(noClicks-1,messages.length-1)];

  const areaRect=choiceArea.getBoundingClientRect();
  const btnRect=noBtn.getBoundingClientRect();
  const pad=8;
  const maxX=Math.max(0,(areaRect.width-btnRect.width)/2-pad);
  const maxY=Math.max(0,(areaRect.height-btnRect.height)/2-pad);

  // Keep the button inside the choice area and, when possible, away from the pointer.
  let x=0,y=0;
  for(let n=0;n<18;n++){
    x=(Math.random()*2-1)*maxX;
    y=(Math.random()*2-1)*maxY;
    if(pointerX==null || pointerY==null) break;
    const targetX=areaRect.left+areaRect.width/2+x;
    const targetY=areaRect.top+areaRect.height/2+y;
    if(Math.hypot(targetX-pointerX,targetY-pointerY)>110) break;
  }
  noBtn.style.position='absolute';
  noBtn.style.left='50%';
  noBtn.style.top='50%';
  noBtn.style.transform=`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

noBtn?.addEventListener('pointerenter',e=>dodgeNoButton(e.clientX,e.clientY));
choiceArea?.addEventListener('pointermove',e=>{
  if(!noBtn || e.pointerType==='touch') return;
  const r=noBtn.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  if(Math.hypot(e.clientX-cx,e.clientY-cy)<115) dodgeNoButton(e.clientX,e.clientY);
},{passive:true});
noBtn?.addEventListener('touchstart',e=>{e.preventDefault();dodgeNoButton(e.touches[0]?.clientX,e.touches[0]?.clientY);},{passive:false});
noBtn?.addEventListener('click',e=>{e.preventDefault();dodgeNoButton(e.clientX,e.clientY);});

$('#yesBtn')?.addEventListener('click',()=>{
 $('#finale').style.display='none';
 const c=$('#celebration'); c.classList.add('active'); c.scrollIntoView({behavior:'smooth'}); launchConfetti();
});

function launchConfetti(){
 const canvas=$('#confetti'),ctx=canvas.getContext('2d');
 let W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,2);
 const resize=()=>{W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);};
 resize();
 const pieces=Array.from({length:120},()=>({x:Math.random()*W,y:-20-Math.random()*H*.4,r:3+Math.random()*4,v:2+Math.random()*4,a:Math.random()*Math.PI*2,s:(Math.random()-.5)*.08}));
 let start=performance.now();
 function frame(t){
   ctx.clearRect(0,0,W,H);
   pieces.forEach(p=>{p.y+=p.v;p.x+=Math.sin(t/500+p.x)*.6;p.a+=p.s;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=['#f2a9ca','#c9a6ee','#f4d6a0','#b4e0d0','#ffffff'][Math.floor(Math.random()*5)];ctx.fillRect(-p.r,-p.r,p.r*2,p.r*2);ctx.restore();if(p.y>H+20)p.y=-20;});
   if(t-start<7000) requestAnimationFrame(frame); else ctx.clearRect(0,0,W,H);
 }
 addEventListener('resize',resize,{passive:true}); requestAnimationFrame(frame);
}

/* ===== ADVANCED PAGE UI ===== */
(()=>{
 const loader=$('#pageLoader'),progress=$('#readingProgress'),backTop=$('#backTop'),toast=$('#toast');
 const lightbox=$('#lightbox'),lightboxImage=$('#lightboxImage'),lightboxTitle=$('#lightboxTitle'),lightboxText=$('#lightboxText'),lightboxIndex=$('#lightboxIndex');
 const close=$('#lightboxClose'),prev=$('#lightboxPrev'),next=$('#lightboxNext');
 let gallery=[],current=0,toastTimer=0;

 addEventListener('load',()=>window.setTimeout(()=>loader?.classList.add('hidden'),180),{once:true});
 let scrollTick=false;
 const updateScrollUI=()=>{
   const max=document.documentElement.scrollHeight-innerHeight,pct=max>0?(scrollY/max)*100:0;
   if(progress) progress.style.width=pct+'%';
   backTop?.classList.toggle('show',scrollY>innerHeight*.65);
   scrollTick=false;
 };
 addEventListener('scroll',()=>{if(!scrollTick){requestAnimationFrame(updateScrollUI);scrollTick=true;}},{passive:true});
 updateScrollUI();
 backTop?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

 const revealItems=document.querySelectorAll('[data-reveal]');
 if('IntersectionObserver' in window){
   const io=new IntersectionObserver(entries=>entries.forEach(e=>{
     if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target);}
   }),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
   revealItems.forEach(el=>io.observe(el));
 }else revealItems.forEach(el=>el.classList.add('revealed'));

 /* ----- Gallery / memory viewer ----- */
 const imageNodes=[...document.querySelectorAll('.photo-card img,.place-card img,.final-photo')];
 gallery=imageNodes.map((img,index)=>{
   const card=img.closest('.photo-card,.place-card,.celebration-content');
   const title=card?.querySelector('figcaption b')?.textContent?.trim()
     ||(img.closest('.place-card')?'Favourite place':'Shejal');
   const text=card?.querySelector('figcaption span')?.textContent?.trim()
     ||img.dataset.caption||img.alt||'';
   const src=img.getAttribute('src')||img.currentSrc||'';
   img.dataset.memoryIndex=String(index);
   img.setAttribute('tabindex','0');
   img.setAttribute('role','button');
   img.setAttribute('aria-label','Open photo: '+(img.alt||'Shejal'));
   const owner=img.closest('.photo-card,.place-card,.celebration-content');
   if(owner){
     owner.dataset.memoryIndex=String(index);
     owner.setAttribute('tabindex','0');
     owner.setAttribute('role','button');
     owner.setAttribute('aria-label','Open photo: '+(img.alt||'Shejal'));
   }
   return {img,src,alt:img.alt||'Shejal',title,text};
 });

 const setViewerOpen=(open)=>{
   if(!lightbox) return;
   lightbox.classList.toggle('open',open);
   lightbox.setAttribute('aria-hidden',open?'false':'true');
   document.body.classList.toggle('lightbox-active',open);
   document.body.style.overflow=open?'hidden':'';
 };

 function preload(index){
   if(!gallery.length) return;
   const item=gallery[(index+gallery.length)%gallery.length];
   if(!item?.src) return;
   const probe=new Image();
   probe.decoding='async';
   probe.src=item.src;
 }

 function show(index){
   if(!gallery.length || !lightbox || !lightboxImage) return;
   current=(index+gallery.length)%gallery.length;
   const item=gallery[current];
   lightboxImage.classList.remove('loaded');
   lightboxImage.alt=item.alt;
   lightboxImage.src=item.src;
   if(lightboxTitle) lightboxTitle.textContent=item.title;
   if(lightboxText) lightboxText.textContent=item.text;
   if(lightboxIndex) lightboxIndex.textContent=`Photo ${current+1} of ${gallery.length}`;
   if(prev) prev.disabled=gallery.length<2;
   if(next) next.disabled=gallery.length<2;
   setViewerOpen(true);
   preload(current+1);
   preload(current-1);
 }

 function hide(){
   if(!lightbox) return;
   setViewerOpen(false);
   window.setTimeout(()=>{
     if(!lightbox.classList.contains('open') && lightboxImage){
       lightboxImage.src='';
       lightboxImage.classList.remove('loaded');
     }
   },220);
 }

 lightboxImage?.addEventListener('load',()=>lightboxImage.classList.add('loaded'));

 /* Delegation is intentional: clicks anywhere inside the card, including its caption and overlay,
    resolve to the same photo. This avoids fragile per-element hit-testing on transformed cards. */
 const openFromTarget=(target)=>{
   if(!(target instanceof Element)) return false;
   const owner=target.closest('.photo-card,.place-card,.celebration-content');
   if(!owner) return false;
   const img=owner.querySelector('img[data-memory-index]');
   if(!img) return false;
   const idx=Number(img.dataset.memoryIndex);
   if(Number.isNaN(idx)) return false;
   show(idx);
   return true;
 };

 document.addEventListener('click',(e)=>{
   if(lightbox?.classList.contains('open')) return;
   openFromTarget(e.target);
 },true);

 document.addEventListener('keydown',(e)=>{
   if(lightbox?.classList.contains('open')){
     if(e.key==='Escape'){e.preventDefault();hide();}
     else if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}
     else if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}
     return;
   }
   if(e.key==='Enter'||e.key===' '){
     const active=document.activeElement;
     if(active?.matches('.photo-card,.place-card,.celebration-content')){
       e.preventDefault();
       openFromTarget(active);
     }
   }
 });

 close?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();hide();});
 prev?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(current-1);});
 next?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(current+1);});
 lightbox?.addEventListener('click',e=>{if(e.target===lightbox) hide();});

 let touchX=0;
 lightbox?.addEventListener('touchstart',e=>{touchX=e.changedTouches[0]?.clientX||0;},{passive:true});
 lightbox?.addEventListener('touchend',e=>{
   if(!lightbox.classList.contains('open')) return;
   const dx=(e.changedTouches[0]?.clientX||0)-touchX;
   if(Math.abs(dx)>50) show(current+(dx<0?1:-1));
 },{passive:true});

 const gallerySection=$('#photos');
 if(gallerySection&&'IntersectionObserver' in window){
   const hint=new IntersectionObserver(entries=>{
     if(entries[0].isIntersecting){
       if(toast){
         toast.textContent='Tap any photo to open it ✨';
         toast.classList.add('show');
         clearTimeout(toastTimer);
         toastTimer=setTimeout(()=>toast.classList.remove('show'),2600);
       }
       hint.disconnect();
     }
   },{threshold:.3});
   hint.observe(gallerySection);
 }
})();

/* ===== LAZY VIDEO LOADING ===== */
(()=>{
 const videos=[...document.querySelectorAll('video[data-src]')];
 const loadVideo=(video)=>{
   if(video.dataset.loaded==='true')return;
   const source=video.querySelector('source[data-src]');
   if(source){source.src=source.dataset.src;source.removeAttribute('data-src');}
   video.load();video.dataset.loaded='true';
 };
 if('IntersectionObserver'in window){
   const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){loadVideo(e.target);io.unobserve(e.target);}}),{rootMargin:'450px 0px'});
   videos.forEach(v=>io.observe(v));
 }else videos.forEach(loadVideo);
 const birthday=$('#birthdayVideo'),play=$('#birthdayPlay'),frame=document.querySelector('.birthday-video-frame');
 if(birthday&&play&&frame){
   const sync=()=>{const playing=!birthday.paused&&!birthday.ended;frame.classList.toggle('playing',playing);play.setAttribute('aria-label',playing?'Pause birthday video':'Play birthday video');play.querySelector('span').textContent=playing?'Ⅱ':'▶';};
   const toggle=e=>{e?.preventDefault();if(birthday.dataset.loaded!=='true')loadVideo(birthday);if(birthday.paused||birthday.ended)birthday.play().catch(()=>{});else birthday.pause();};
   play.addEventListener('click',toggle);birthday.addEventListener('click',toggle);birthday.addEventListener('play',sync);birthday.addEventListener('pause',sync);birthday.addEventListener('ended',sync);sync();
 }
})();

/* ===== REPLY FORM + VOICE NOTE ===== */
(()=>{
 const form=$('#replyForm'),status=$('#replyStatus'),submit=$('#replySubmit'),count=$('#charCount'),extra=$('#extraMessage');
 if(!form)return;
 form.action=SITE_CONFIG.replyEndpoint||'';
 const updateCount=()=>{if(count&&extra)count.textContent=extra.value.length;};
 extra?.addEventListener('input',updateCount);updateCount();
 syncQuizMeta();

 // Voice recorder state — deliberately kept separate from the preview so stopping the
 // microphone can never cancel the Blob before the audio player receives it.
 const recordBtn=$('#voiceRecordBtn'),recordText=$('#voiceRecordText'),timerEl=$('#voiceTimer'),stateEl=$('#voiceState');
 const previewWrap=$('#voicePreviewWrap'),preview=$('#voicePreview'),playBtn=$('#voicePlayBtn'),previewMeta=$('#voicePreviewMeta'),clearBtn=$('#voiceClearBtn'),fileInput=$('#voiceNoteFile'),voiceStatus=$('#voiceNoteStatus');
 let recorder=null,stream=null,chunks=[],startedAt=0,timerId=null,audioUrl='';
 const MAX_RECORDING_MS=4*60*1000;
 const MAX_VOICE_FILE_BYTES=15*1024*1024;
 const formatTime=ms=>{const total=Math.floor(Math.max(0,ms)/1000);return String(Math.floor(total/60)).padStart(2,'0')+':'+String(total%60).padStart(2,'0');};
 const setVoiceStatus=(msg,type='')=>{if(voiceStatus){voiceStatus.textContent=msg;voiceStatus.className='voice-note-status'+(type?' '+type:'');}};
 const supportedMime=()=>{
   if(!window.MediaRecorder)return '';
   const types=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'];
   return types.find(t=>MediaRecorder.isTypeSupported?.(t))||'';
 };
 const extForMime=mime=>mime.includes('mp4')?'m4a':mime.includes('ogg')?'ogg':'webm';
 const stopTracks=()=>{if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}};
 const resetTimer=()=>{if(timerId)clearInterval(timerId);timerId=null;startedAt=0;if(timerEl)timerEl.textContent='00:00';};
 const clearPreview=()=>{
   if(fileInput)fileInput.value='';
   if(preview){preview.pause();preview.removeAttribute('src');preview.load();}
   if(playBtn){playBtn.textContent='▶ Listen to my voice note';playBtn.disabled=true;}
   if(previewMeta)previewMeta.textContent='Ready to preview before sending.';
   if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl='';}
   if(previewWrap)previewWrap.hidden=true;
 };
 const resetVoiceUI=()=>{
   resetTimer();
   clearPreview();
   chunks=[];
   if(recordBtn){recordBtn.classList.remove('recording');recordBtn.setAttribute('aria-pressed','false');}
   if(recordText)recordText.textContent='Start recording';
   if(stateEl)stateEl.textContent='A voice note is required before you can send this reply.';
   setVoiceStatus('');
 };
 const clearVoice=()=>{
   if(recorder && recorder.state!=='inactive'){
     try{recorder.stop();}catch(_){/* ignore */}
   }
   stopTracks();
   recorder=null;
   resetVoiceUI();
 };
 const attachBlob=blob=>{
   if(!fileInput||!blob)return false;
   if(blob.size>MAX_VOICE_FILE_BYTES){
     setVoiceStatus(`Voice note is ${Math.round(blob.size/1024/1024*10)/10} MB. Please keep it under 15 MB.`,'error');
     return false;
   }
   const mime=blob.type||'audio/webm';
   const file=new File([blob],`shejal-voice-note-${Date.now()}.${extForMime(mime)}`,{type:mime,lastModified:Date.now()});
   try{
     const dt=new DataTransfer();
     dt.items.add(file);
     fileInput.files=dt.files;
     if(fileInput.files.length!==1){
       setVoiceStatus('The browser could not attach the recorded note. Please try again.','error');
       return false;
     }
     return true;
   }catch(err){
     setVoiceStatus('Your browser recorded the note, but could not attach it to the form. Please try Chrome or Edge.','error');
     return false;
   }
 };
 const finishRecording=()=>{
   const current=recorder;
   if(!current || current.state!=='recording')return;
   if(stateEl)stateEl.textContent='Finishing your note…';
   try{current.stop();}catch(_){return;}
   stopTracks();
   if(timerId)clearInterval(timerId);timerId=null;
   if(recordBtn){recordBtn.classList.remove('recording');recordBtn.setAttribute('aria-pressed','false');}
   if(recordText)recordText.textContent='Record again';
 };
 const startRecording=async()=>{
   if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){setVoiceStatus('Voice recording is not supported by this browser. Try Chrome, Edge, Safari, or Firefox.','error');return;}
   if(recorder && recorder.state==='recording'){finishRecording();return;}
   // Clear any older preview before creating a new recording session.
   if(recorder && recorder.state==='inactive')recorder=null;
   clearPreview();
   chunks=[];
   try{
     const audioStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
     stream=audioStream;
     const mime=supportedMime();
     const options={audioBitsPerSecond:96000};
     if(mime)options.mimeType=mime;
     const current=new MediaRecorder(stream,options);
     recorder=current;
     const sessionChunks=[];
     const sessionStartedAt=performance.now();
     startedAt=sessionStartedAt;

     current.ondataavailable=e=>{if(e.data&&e.data.size)sessionChunks.push(e.data);};
     current.onerror=()=>setVoiceStatus('Something interrupted the recording. Please try again.','error');
     current.onstop=()=>{
       // IMPORTANT: use the closed-over recorder + chunk list. Do not depend on the
       // global recorder variable, because the UI may have already moved to another state.
       const mimeType=current.mimeType||mime||'audio/webm';
       const blob=new Blob(sessionChunks,{type:mimeType});
       const durationMs=Math.max(1,performance.now()-sessionStartedAt);
       sessionChunks.length=0;
       chunks=[];
       if(current===recorder)recorder=null;
       if(blob.size<1000){
         setVoiceStatus('That recording was too short. Please record a little longer.','error');
         if(stateEl)stateEl.textContent='No usable voice note yet. Tap Start recording to try again.';
         return;
       }
       const attached=attachBlob(blob);
       if(!attached){
         if(stateEl)stateEl.textContent='The voice note could not be attached. Please record again.';
         return;
       }
       audioUrl=URL.createObjectURL(blob);
       if(preview){
         preview.src=audioUrl;
         preview.preload='auto';
         preview.load();
       }
       if(previewWrap)previewWrap.hidden=false;
       if(playBtn)playBtn.disabled=false;
       if(previewMeta)previewMeta.textContent=`Preview ready · ${formatTime(durationMs)} · listen before sending.`;
       if(stateEl)stateEl.textContent='Voice note ready. Listen once, then send it with your reply. ❤️';
       setVoiceStatus(`Voice note attached · ${formatTime(durationMs)} · ${Math.max(1,Math.round(blob.size/1024))} KB`,'success');
     };

     current.start(250);
     if(recordBtn){recordBtn.classList.add('recording');recordBtn.setAttribute('aria-pressed','true');}
     if(recordText)recordText.textContent='Stop recording';
     if(stateEl)stateEl.textContent='Recording… say whatever you want. ❤️';
     resetTimer();
     startedAt=sessionStartedAt;
     timerId=setInterval(()=>{
       const elapsed=performance.now()-sessionStartedAt;
       if(timerEl)timerEl.textContent=formatTime(elapsed);
       if(elapsed>=MAX_RECORDING_MS){
         if(stateEl)stateEl.textContent='Four minutes reached. Finishing your note…';
         finishRecording();
       }
     },250);
     setVoiceStatus('Microphone active. You will be able to listen before sending.');
   }catch(err){
     stopTracks();recorder=null;resetTimer();
     setVoiceStatus(err?.name==='NotAllowedError'?'Microphone permission was denied. Allow microphone access and try again.':'Could not start the microphone. Please try again.','error');
     if(stateEl)stateEl.textContent='A voice note is still required.';
   }
 };
 recordBtn?.addEventListener('click',startRecording);
 playBtn?.addEventListener('click',()=>{
   if(!preview || !preview.src)return;
   if(preview.paused || preview.ended){
     preview.play().catch(()=>setVoiceStatus('The preview could not start. Use the audio controls below to play it.','error'));
   }else{
     preview.pause();
   }
 });
 preview?.addEventListener('play',()=>{if(playBtn)playBtn.textContent='Ⅱ Pause voice note';});
 preview?.addEventListener('pause',()=>{if(playBtn)playBtn.textContent='▶ Listen to my voice note';});
 preview?.addEventListener('ended',()=>{if(playBtn)playBtn.textContent='▶ Listen to my voice note';});
 preview?.addEventListener('loadedmetadata',()=>{
   if(previewMeta && Number.isFinite(preview.duration))previewMeta.textContent=`Preview ready · ${formatTime(preview.duration*1000)} · listen before sending.`;
 });
 clearBtn?.addEventListener('click',()=>{clearVoice();recordBtn?.focus();});

 // Native multipart/form-data submission is deliberate here: FormSubmit documents file
 // uploads on the normal form endpoint, while its AJAX endpoint is documented separately.
 // Sending the form to a new tab avoids the hidden-iframe hang and lets the recipient see
 // FormSubmit's own confirmation/activation page.
 const nextUrl=$('#replyNextUrl'),sourceUrl=$('#replySourceUrl');
 const prepareReplyDestination=()=>{
   if(nextUrl){
     const u=new URL('thanks.html',window.location.href);
     u.searchParams.set('reply','sent');
     nextUrl.value=u.href;
   }
   if(sourceUrl)sourceUrl.value=window.location.href.split('#')[0];
 };
 form.addEventListener('submit',e=>{
   if(!SITE_CONFIG.replyEndpoint){e.preventDefault();status.textContent='Reply service is not configured yet. Replace the endpoint in config.js with your FormSubmit URL.';status.className='reply-status error';return;}
   const required=[...form.querySelectorAll('[required]')];
   const missing=required.find(el=>!el.value);
   if(missing){
     e.preventDefault();
     if(missing===fileInput){
       setVoiceStatus('Please record your voice note before sending. ❤️','error');
       stateEl?.scrollIntoView({behavior:'smooth',block:'center'});
       recordBtn?.focus();
       status.textContent='Your voice note is required before sending. ❤️';
     }else{
       missing.focus();
       status.textContent='Please complete all required fields before sending. ❤️';
     }
     status.className='reply-status error';
     return;
   }
   if(form.querySelector('input[name="_honey"]')?.value){e.preventDefault();return;}
   syncQuizMeta();
   if(recorder && recorder.state==='recording'){
     e.preventDefault();
     setVoiceStatus('Stop the recording before sending so I can attach the full voice note.','error');
     recordBtn?.focus();
     return;
   }
   if(!fileInput?.files?.length){
     e.preventDefault();
     setVoiceStatus('Please record a voice note first.','error');
     recordBtn?.focus();
     status.textContent='Your voice note is required before sending. ❤️';
     status.className='reply-status error';
     return;
   }

   prepareReplyDestination();
   // Let the browser perform the real multipart form POST. This is important for
   // the audio attachment; do not replace it with fetch/AJAX.
   submit.disabled=true;
   submit.textContent='Opening submission…';
   status.textContent='Your reply is opening in a new tab. Please complete the FormSubmit confirmation there. ❤️';
   status.className='reply-status';
   setVoiceStatus(`Voice note attached and ready to send · ${Math.max(1,Math.round(fileInput.files[0].size/1024))} KB`,'success');
   window.setTimeout(()=>{
     submit.disabled=false;
     submit.textContent='Send my reply 💌';
   },2500);
 });
 window.addEventListener('beforeunload',stopTracks);
})();


/* ===== BIRTHDAY JOURNEY NAV ===== */
(()=>{
 const dots=[...document.querySelectorAll('[data-journey]')];
 const targets=dots.map(btn=>document.getElementById(btn.dataset.journey)).filter(Boolean);
 const counter=$('#journeyCount');
 const setActive=(id)=>{
   const idx=dots.findIndex(d=>d.dataset.journey===id);
   dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===idx)));
   if(counter) counter.textContent=String(Math.max(1,idx+1)).padStart(2,'0');
 };
 dots.forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.journey)?.scrollIntoView({behavior:'smooth',block:'start'})));
 if('IntersectionObserver' in window){
   const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)}),{rootMargin:'-38% 0px -48% 0px',threshold:0});
   targets.forEach(t=>io.observe(t));
 }
})();

/* ===== PHOTO MICRO-INTERACTION ===== */
(()=>{
 if(matchMedia('(pointer:fine)').matches){
   document.querySelectorAll('.photo-card').forEach(card=>{
     card.addEventListener('pointermove',e=>{
       const r=card.getBoundingClientRect();
       const x=(e.clientX-r.left)/r.width-.5;
       const y=(e.clientY-r.top)/r.height-.5;
       card.style.transform=`translateY(-5px) rotateX(${-y*3}deg) rotateY(${x*3}deg)`;
     });
     card.addEventListener('pointerleave',()=>card.style.transform='');
   });
 }
})();

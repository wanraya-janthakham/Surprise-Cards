function qs(){
  const p=new URLSearchParams(location.search)
  const o=p.get("occasion")||"anniversary"
  const name=p.get("name")|| (p.get("lang")==="en"?"My special one":"คนพิเศษของฉัน")
  const msg=p.get("message")|| (p.get("lang")==="en"?"Thank you for being by my side every day. Love you":"ขอบคุณที่อยู่ด้วยกันในทุกๆ วัน รักนะ")
  const date=p.get("date")||""
  const palette=p.get("palette")||"pink"
  const lang=p.get("lang")||"th"
  const image=p.get("image")||""
  const backType=p.get("backType")||"image"
  const music=p.get("music")||""
  return{occasion:o,name,msg,date,palette,lang,image,backType,music}
}
function titleFor(o,lang){
const th={anniversary:"วันครบรอบ",birthday:"สุขสันต์วันเกิด",valentine:"สุขสันต์วันวาเลนไทน์",newyear:"สวัสดีปีใหม่",christmas:"สุขสันต์วันคริสต์มาส",thankyou:"ขอบคุณจากใจ",cafe:"คาเฟ่หวานๆ",flower:"ดอกไม้บาน",sea:"ทะเลใส"}
const en={anniversary:"Anniversary",birthday:"Happy Birthday",valentine:"Happy Valentine",newyear:"Happy New Year",christmas:"Merry Christmas",thankyou:"Thank you",cafe:"Cafe Date",flower:"Blooming Flowers",sea:"Sea Breeze"}
const table=lang==="en"?en:th
return table[o]|| (lang==="en"?"Special Day":"โอกาสพิเศษ")
}
function fmtDate(d,lang){
if(!d)return""
try{const dt=new Date(d);const loc=lang==="en"?"en-US":"th-TH";return new Intl.DateTimeFormat(loc,{dateStyle:"long"}).format(dt)}catch(e){return d}
}
const data=qs()
const card=document.getElementById("card")
const themeClass=data.occasion==="other"?"theme-custom":`theme-${data.occasion}`
card.classList.add(themeClass)
card.classList.add(`palette-${data.palette}`)
const customTitle=new URLSearchParams(location.search).get("title")
document.getElementById("title").textContent=customTitle||titleFor(data.occasion,data.lang)
document.getElementById("msg").textContent=data.msg
document.getElementById("who").textContent=data.name
document.getElementById("when").textContent=fmtDate(data.date,data.lang)
document.title=customTitle||titleFor(data.occasion,data.lang)
const backImg=document.getElementById("backImage")
const imgHint=document.getElementById("imgHint")
const musicWrap=document.getElementById("musicWrap")
const musicPlayer=document.getElementById("musicPlayer")
const musicLink=document.getElementById("musicLink")
const flipHint=null
const flipBtn=null
const flipIcon=document.getElementById("flipIcon")
let currentBackType=data.backType
let musicEmbedUrl=""
let recentlyClosedUntil=0
function safeSrc(s){
  if(!s) return ""
  try{
    const u=new URL(s, location.href)
    if(u.protocol==="http:"||u.protocol==="https:") return s
  }catch(e){/* ignore */}
  if(String(s).startsWith("data:")) return s
  return ""
}
function toMusicEmbed(u){
  if(!u) return ""
  try{
    const x=new URL(u, location.href)
    const h=x.hostname.replace('www.','')
    if(h==='youtu.be'){
      const id=x.pathname.slice(1)
      const t=x.searchParams.get('t')
      const start=t? parseInt(t,10) : undefined
      if(id) return `https://www.youtube-nocookie.com/embed/${id}${start?`?start=${start}&rel=0`:"?rel=0"}`
    }
    if(h==='youtube.com'){
      const v=x.searchParams.get('v'); const list=x.searchParams.get('list'); const t=x.searchParams.get('t')
      if(x.pathname.startsWith('/shorts/')){
        const id=x.pathname.split('/')[2]
        if(id) return `https://www.youtube-nocookie.com/embed/${id}?rel=0`
      }
      if(list) return `https://www.youtube-nocookie.com/embed/videoseries?list=${list}&rel=0`
      if(v){
        const start=t? parseInt(t,10) : undefined
        return `https://www.youtube-nocookie.com/embed/${v}${start?`?start=${start}&rel=0`:"?rel=0"}`
      }
    }
    if(h==='music.youtube.com'){
      const v=x.searchParams.get('v')
      if(v) return `https://www.youtube-nocookie.com/embed/${v}?rel=0`
    }
    if(h==='open.spotify.com'){return `https://open.spotify.com/embed${x.pathname}`}
  }catch(e){}
  return ""
}
function linkTextFor(u){
  if(!u) return 'เปิดเพลง'
  try{
    const x=new URL(u, location.href)
    const h=x.hostname.replace('www.','')
    if(h.includes('youtube')) return 'เปิดบน YouTube'
    if(h.includes('spotify')) return 'เปิดบน Spotify'
  }catch(e){}
  return 'เปิดเพลง'
}
if(backImg){
  if(data.backType==='image'){
    const src=safeSrc(data.image)
    backImg.style.display= src? 'block':'none'
    if(src) backImg.src=src
    if(musicWrap) musicWrap.style.display='none'
    if(imgHint) imgHint.style.display= src? 'none':'block'
  } else {
    currentBackType='music'
    musicEmbedUrl=toMusicEmbed(data.music)
    if(musicWrap) musicWrap.style.display='grid'
    backImg.style.display='none'
    if(imgHint) imgHint.style.display='none'
    if(musicPlayer){musicPlayer.style.display='none'; musicPlayer.src=''}
    if(musicLink){musicLink.style.display='inline-flex'; musicLink.innerHTML='<svg class="icon"><use href="icons/icons.svg#play"/></svg>'; musicLink.href=data.music||''}
    
  }
  backImg.addEventListener('error',()=>{if(imgHint) imgHint.style.display='block'})
  backImg.addEventListener('load',()=>{if(imgHint) imgHint.style.display='none'})
}
const wrap=document.querySelector(".envelope-wrap")
const env=document.querySelector(".envelope")
const q=new URLSearchParams(location.search)
const envStyle=q.get('envelope')||'classic'
const stage=document.getElementById('stage')
if(env){
  env.classList.remove('style-classic','style-heart','style-ribbon','style-minimal','style-kawaii','style-euro','style-kitty')
  env.classList.remove('decor-emoji','decor-icon')
  env.classList.add(`style-${envStyle}`)
  const ids = envStyle==='kitty'? ['paw','bow','star'] : ['heart','star','bow']
  env.classList.add('decor-icon')
  const topRow=document.querySelector('.top-row')
  if(topRow){
    topRow.innerHTML=ids.map(id=>`<svg class="icon"><use href="icons/icons.svg#${id}"/></svg>`).join('')
  }
}
if(!env || envStyle==='none'){
  if(wrap) wrap.classList.add('no-envelope')
  card.classList.remove('letter')
  const spark=card.querySelector('.sparkles'); if(spark) spark.style.display='none'
  const rootStyles=getComputedStyle(document.documentElement)
  const w=rootStyles.getPropertyValue('--card-w').trim()||'420px'
  const h=rootStyles.getPropertyValue('--card-h').trim()||'620px'
  card.style.position='relative'
  card.style.left=''
  card.style.top=''
  card.style.width=w
  card.style.minHeight=h
  card.style.transform='none'
  card.style.transition=''
  const page=document.querySelector('.card-page')
  if(page){ page.appendChild(card) }
  card.classList.add('on-stage')
function fitCard(){
  const rect=card.getBoundingClientRect()
  const availH=window.innerHeight-40
  const availW=window.innerWidth-24
  const scale=Math.min(1, availH/rect.height, availW/rect.width)
  card.style.transform=`scale(${scale})`
  card.style.transformOrigin='top center'
}
if(q.get('preview')==='1'){requestAnimationFrame(fitCard)}
}
if(q.get('autoOpen')==='1' && env){
  // เปิดซองอัตโนมัติสำหรับพรีวิว
  (function(){
    const wrap=document.querySelector('.envelope-wrap')
    if(wrap){wrap.classList.add('opened');setTimeout(()=>wrap.classList.add('revealed'),600)}
  })()
  if(q.get('preview')==='1'){setTimeout(fitCard,650)}
}
let resizeTimer
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{try{fitCard()}catch(e){}},120)})
window.addEventListener('message',e=>{
  const payload=e.data
  if(!payload||payload.type!=="update") return
  const d=payload.data||{}
  if(typeof d.title==="string"&&d.title){document.getElementById("title").textContent=d.title}
  if(typeof d.message==="string"){document.getElementById("msg").textContent=d.message}
  if(typeof d.name==="string"){document.getElementById("who").textContent=d.name}
  if(typeof d.date==="string"){document.getElementById("when").textContent=fmtDate(d.date,data.lang)}
  if(backImg){
    currentBackType=typeof d.backType==='string'?d.backType:data.backType
    if(currentBackType==='image'){
      const src=safeSrc(d.image)
      backImg.style.display= src? 'block':'none'
      if(src) backImg.src=src
      if(musicWrap) musicWrap.style.display='none'
      if(imgHint) imgHint.style.display= src? 'none':'block'
    } else {
      musicEmbedUrl=toMusicEmbed(d.music||data.music)
      if(musicWrap) musicWrap.style.display='grid'
      backImg.style.display='none'
      if(imgHint) imgHint.style.display='none'
      const flipped=card.classList.contains('flipped')
      if(flipped && musicEmbedUrl){
        if(musicPlayer){musicPlayer.style.display='block'; musicPlayer.src=musicEmbedUrl}
        if(musicLink){musicLink.style.display='inline-flex'; musicLink.innerHTML='<svg class="icon"><use href="icons/icons.svg#play"/></svg>'; musicLink.href=(d.music||data.music)||''}
        
      } else {
        if(musicPlayer){musicPlayer.style.display='none'; musicPlayer.src=''}
        if(musicLink){musicLink.style.display='inline-flex'; musicLink.innerHTML='<svg class="icon"><use href="icons/icons.svg#play"/></svg>'; musicLink.href = (d.music||data.music)||''}
        
      }
    }
  }
})
if(envStyle==='none'){
  if(wrap) wrap.style.display='none'
  card.classList.remove('letter')
  const spark=card.querySelector('.sparkles'); if(spark) spark.style.display='none'
  if(stage&&card){ stage.appendChild(card); card.classList.add('on-stage') }
}
function openEnvelope(){
  if(typeof openEnvelope.opening==='undefined') openEnvelope.opening=false
  if(openEnvelope.opening|| (wrap&&wrap.classList.contains('opened'))) return
  openEnvelope.opening=true
  if(!wrap)return
  wrap.classList.remove("closed")
  wrap.classList.add("opened")
  wrap.classList.remove('hide-seal')
  setTimeout(()=>{
    const rect=card.getBoundingClientRect()
    const stage=document.getElementById('stage')
  if(stage&&card){
      stage.style.pointerEvents='auto'
      card.style.position='fixed'
      card.style.left=`${rect.left}px`
      card.style.top=`${rect.top}px`
      card.style.width=`${rect.width}px`
      card.style.height=`${rect.height}px`
      card.style.margin='0'
      card.style.transform='none'
      card.style.transition='left .6s ease, top .6s ease, transform .6s ease, box-shadow .6s ease'
      stage.appendChild(card)
      requestAnimationFrame(()=>{
        const targetLeft=(window.innerWidth-rect.width)/2
        const targetTop=(window.innerHeight-rect.height)/2
        card.style.left=`${targetLeft}px`
        card.style.top=`${targetTop}px`
        card.style.transform='scale(1)'
        card.classList.add('on-stage')
      })
  }
  setTimeout(()=>{wrap.classList.add('revealed');openEnvelope.opening=false},400)
  },350)
}
if(env){
  env.addEventListener("click",e=>{e.stopPropagation();openEnvelope()})
  env.addEventListener("touchstart",e=>{openEnvelope()})
}
const wrapClick=document.querySelector('.envelope-wrap')
if(wrapClick){
  wrapClick.addEventListener('click',e=>{
    if(!wrap.classList.contains('revealed')){
      if(Date.now() < recentlyClosedUntil) { e.stopPropagation(); return }
      e.stopPropagation()
      openEnvelope()
    }
    // เมื่อเปิดแล้ว ไม่หยุด propagation เพื่อให้คลิกนอกการ์ดปิดซองได้
  })
  wrapClick.addEventListener('touchstart',e=>{
    if(!wrap.classList.contains('revealed')){
      if(Date.now() < recentlyClosedUntil) { return }
      openEnvelope()
    }
  })
}
document.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")openEnvelope()})
let flipping=false
function toggleFlip(e){
  if(flipping) return
  if(e){
    const el=e.target
    if(el && (el.closest('#musicPlayer')||el.closest('#musicLink'))){
      return
    }
  }
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  flipping=true
  card.classList.toggle('flipped')
  card.classList.add('flipping')
  const nowFlipped=card.classList.contains('flipped')
  const wrapEl=document.querySelector('.envelope-wrap')
  const envStyleClass=`style-${new URLSearchParams(location.search).get('envelope')||'classic'}`
  if(wrapEl && document.querySelector('.envelope').classList.contains('style-kitty')){
    wrapEl.classList.toggle('hide-seal', nowFlipped && currentBackType==='music')
  }
  if(currentBackType==='music'){
    if(nowFlipped && musicEmbedUrl){
      if(musicPlayer){musicPlayer.style.display='block'; musicPlayer.src=musicEmbedUrl}
      if(musicLink){musicLink.style.display='inline-flex'}
    } else {
      if(musicPlayer){musicPlayer.style.display='none'; musicPlayer.src=''}
      if(musicLink){musicLink.style.display='inline-flex'}
    }
  }
  setTimeout(()=>{card.classList.remove('flipping'); flipping=false}, reduce? 200: 900)
}
card.addEventListener('click',e=>toggleFlip(e))
card.addEventListener('touchstart',e=>{e.preventDefault();toggleFlip(e)})
if(musicLink){
  musicLink.addEventListener('click',e=>{e.stopPropagation()})
  musicLink.addEventListener('touchstart',e=>{e.stopPropagation()})
}
function closeEnvelope(){
  if(!env) return
  const stage=document.getElementById('stage')
  const slot=env.querySelector('.slot')
  if(stage&&card){
    card.classList.remove('on-stage')
    card.style.position=''
    card.style.left=''
    card.style.top=''
    card.style.width=''
    card.style.height=''
    card.style.margin=''
    card.style.transform=''
    card.style.transition=''
    if(slot) slot.appendChild(card)
    if(stage) stage.style.pointerEvents='none'
  }
  if(wrap){
    wrap.classList.remove('revealed')
    wrap.classList.remove('opened')
    wrap.classList.add('closed')
    wrap.classList.remove('hide-seal')
    recentlyClosedUntil=Date.now()+300
  }
  if(card.classList.contains('flipped')) card.classList.remove('flipped')
  if(musicPlayer){musicPlayer.style.display='none'; musicPlayer.src=''}
}
document.addEventListener('click',e=>{
  if(!wrap||!wrap.classList.contains('revealed')) return
  if(card && !card.contains(e.target)) { closeEnvelope(); e.stopPropagation() }
})
document.addEventListener('touchstart',e=>{
  if(!wrap||!wrap.classList.contains('revealed')) return
  const t=e.target
  if(card && !card.contains(t)) { closeEnvelope(); e.stopPropagation() }
})
if(stage){
  stage.addEventListener('click',e=>{
    if(!wrap||!wrap.classList.contains('revealed')) return
    if(card && !card.contains(e.target)) { closeEnvelope(); e.stopPropagation() }
  })
  stage.addEventListener('touchstart',e=>{
    if(!wrap||!wrap.classList.contains('revealed')) return
    const t=e.target
    if(card && !card.contains(t)) { closeEnvelope(); e.stopPropagation() }
  })
}
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeEnvelope()})
if(flipIcon){
  flipIcon.addEventListener('click',e=>{e.stopPropagation(); toggleFlip(e)})
  flipIcon.addEventListener('touchstart',e=>{e.stopPropagation(); toggleFlip(e)})
}
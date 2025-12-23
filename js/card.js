function qs(){
const p=new URLSearchParams(location.search)
const o=p.get("occasion")||"anniversary"
const name=p.get("name")|| (p.get("lang")==="en"?"My special one":"คนพิเศษของฉัน")
const msg=p.get("message")|| (p.get("lang")==="en"?"Thank you for being by my side every day. Love you":"ขอบคุณที่อยู่ด้วยกันในทุกๆ วัน รักนะ")
const date=p.get("date")||""
const palette=p.get("palette")||"pink"
const lang=p.get("lang")||"th"
return{occasion:o,name,msg,date,palette,lang}
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
const wrap=document.querySelector(".envelope-wrap")
const env=document.querySelector(".envelope")
const q=new URLSearchParams(location.search)
const envStyle=q.get('envelope')||'classic'
const stage=document.getElementById('stage')
if(env){
  env.classList.remove('style-classic','style-heart','style-ribbon','style-minimal')
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
})
if(envStyle==='none'){
  if(wrap) wrap.style.display='none'
  card.classList.remove('letter')
  const spark=card.querySelector('.sparkles'); if(spark) spark.style.display='none'
  if(stage&&card){ stage.appendChild(card); card.classList.add('on-stage') }
}
function openEnvelope(){
  if(!wrap)return
  wrap.classList.remove("closed")
  wrap.classList.add("opened")
  setTimeout(()=>{
    const rect=card.getBoundingClientRect()
    const stage=document.getElementById('stage')
    if(stage&&card){
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
    setTimeout(()=>{wrap.classList.add('revealed')},400)
  },350)
}
if(env){env.addEventListener("click",openEnvelope);env.addEventListener("touchstart",e=>{e.preventDefault();openEnvelope()})}
const wrapClick=document.querySelector('.envelope-wrap')
if(wrapClick){wrapClick.addEventListener('click',openEnvelope);wrapClick.addEventListener('touchstart',e=>{e.preventDefault();openEnvelope()})}
document.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")openEnvelope()})
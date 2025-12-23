const occasionEl=document.getElementById("occasion")
const occasionCustomEl=document.getElementById("occasionCustom")
const nameEl=document.getElementById("name")
const dateEl=document.getElementById("date")
const messageEl=document.getElementById("message")
const paletteEl=document.getElementById("palette")
const langEl=document.getElementById("lang")
const envelopeEl=document.getElementById("envelope")
const previewBtn=document.getElementById("previewBtn")
const copyLinkBtn=document.getElementById("copyLinkBtn")
const openCard=document.getElementById("openCard")
const navLangEl=document.getElementById("navLang")
const frame=document.getElementById("previewFrame")
function buildUrl(){
const p=new URLSearchParams()
const occ=occasionEl.value
p.set("occasion",occ)
if(occ==="other"&&occasionCustomEl&&occasionCustomEl.value.trim()){
  p.set("title",occasionCustomEl.value.trim())
}
if(nameEl.value.trim())p.set("name",nameEl.value.trim())
if(messageEl.value.trim())p.set("message",messageEl.value.trim())
if(dateEl.value)p.set("date",dateEl.value)
p.set("palette",paletteEl.value)
 if(langEl&&langEl.value)p.set("lang",langEl.value)
 if(envelopeEl&&envelopeEl.value)p.set("envelope",envelopeEl.value)
return `card.html?${p.toString()}`
}
let textUpdateTimer
function reloadPreviewStructural(){
  const u=new URL(buildUrl(),location.href)
  u.searchParams.set('autoOpen','1')
  u.searchParams.set('preview','1')
  if(frame) frame.src=u.toString()
  if(openCard) openCard.href=buildUrl()
}
function collectData(){
  const occ=occasionEl.value
  return {
    name: nameEl.value.trim(),
    message: messageEl.value.trim(),
    date: dateEl.value||"",
    title: occ==="other"&&occasionCustomEl?occasionCustomEl.value.trim():undefined
  }
}
function sendTextUpdate(){
  if(textUpdateTimer) clearTimeout(textUpdateTimer)
  textUpdateTimer=setTimeout(()=>{
    if(frame&&frame.contentWindow){
      frame.contentWindow.postMessage({type:"update",data:collectData()},"*")
    }
    if(openCard) openCard.href=buildUrl()
  },120)
}
function toggleOccasion(){
  const wrap=document.getElementById("occasionCustomWrap")
  if(!wrap) return
  const show=occasionEl&&occasionEl.value==="other"
  wrap.style.display=show?"grid":"none"
}
if(previewBtn)previewBtn.addEventListener("click",reloadPreviewStructural)
;[nameEl,dateEl,messageEl].forEach(el=>{if(el)el.addEventListener("input",sendTextUpdate)})
if(occasionCustomEl){occasionCustomEl.addEventListener("input",sendTextUpdate)}
;[occasionEl,paletteEl,envelopeEl,langEl].forEach(el=>{if(el)el.addEventListener("change",reloadPreviewStructural)})
if(navLangEl){
  const uLang=new URLSearchParams(location.search).get('lang')
  if(uLang&&langEl)langEl.value=uLang
  navLangEl.value=uLang||langEl?.value||'th'
  navLangEl.addEventListener('change',()=>{
    const u=new URL(location.href);u.searchParams.set('lang',navLangEl.value);location.href=u.toString()
  })
}
if(occasionEl){occasionEl.addEventListener("change",()=>{toggleOccasion();reloadPreviewStructural()})}
if(occasionCustomEl){occasionCustomEl.addEventListener("input",sendTextUpdate)}
toggleOccasion()
copyLinkBtn.addEventListener("click",async()=>{
const url=new URL(buildUrl(),location.href).href
try{await navigator.clipboard.writeText(url)}catch(e){}
copyLinkBtn.textContent="คัดลอกแล้ว"
setTimeout(()=>copyLinkBtn.textContent="คัดลอกลิงก์",1500)
})
if(frame){frame.addEventListener("load",sendTextUpdate)}
reloadPreviewStructural()
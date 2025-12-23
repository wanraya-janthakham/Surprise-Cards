const occasionEl=document.getElementById("occasion")
const occasionCustomEl=document.getElementById("occasionCustom")
const nameEl=document.getElementById("name")
const dateEl=document.getElementById("date")
const messageEl=document.getElementById("message")
const imageEl=document.getElementById("image")
const imageFileEl=document.getElementById("imageFile")
const embedImageBtn=document.getElementById("embedImageBtn")
const backTypeEl=document.getElementById("backType")
const musicEl=document.getElementById("music")
const paletteEl=document.getElementById("palette")
const langEl=document.getElementById("lang")
const envelopeEl=document.getElementById("envelope")
const previewBtn=document.getElementById("previewBtn")
const copyLinkBtn=document.getElementById("copyLinkBtn")
const openCard=document.getElementById("openCard")
const navLangEl=document.getElementById("navLang")
const frame=document.getElementById("previewFrame")
const uploadDestEl=document.getElementById("uploadDest")
const cloudNameEl=document.getElementById("cloudName")
const uploadPresetEl=document.getElementById("uploadPreset")
const imgurClientIdEl=document.getElementById("imgurClientId")
const uploadRemoteBtn=document.getElementById("uploadRemoteBtn")
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
  if(imageEl&&imageEl.value.trim())p.set("image",imageEl.value.trim())
  if(backTypeEl&&backTypeEl.value)p.set("backType",backTypeEl.value)
  if(musicEl&&musicEl.value.trim())p.set("music",musicEl.value.trim())
  p.set("palette",paletteEl.value)
  if(langEl&&langEl.value)p.set("lang",langEl.value)
  if(envelopeEl&&envelopeEl.value)p.set("envelope",envelopeEl.value)
  return `card.html?${p.toString()}`
}
let textUpdateTimer
let imageBlobUrl=""
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
    title: occ==="other"&&occasionCustomEl?occasionCustomEl.value.trim():undefined,
    image: imageBlobUrl || (imageEl?imageEl.value.trim():""),
    backType: backTypeEl?backTypeEl.value:"image",
    music: musicEl?musicEl.value.trim():""
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
;[nameEl,dateEl,messageEl,imageEl].forEach(el=>{if(el)el.addEventListener("input",sendTextUpdate)})
;[backTypeEl,musicEl].forEach(el=>{if(el)el.addEventListener("input",sendTextUpdate)})
if(imageFileEl){
  imageFileEl.addEventListener("change",()=>{
    const f=imageFileEl.files&&imageFileEl.files[0]
    if(!f){return}
    if(imageBlobUrl){try{URL.revokeObjectURL(imageBlobUrl)}catch(e){} }
    imageBlobUrl=URL.createObjectURL(f)
    sendTextUpdate()
  })
}
if(embedImageBtn&&imageFileEl){
  embedImageBtn.addEventListener("click",()=>{
    const f=imageFileEl.files&&imageFileEl.files[0]
    if(!f){return}
    const temp=URL.createObjectURL(f)
    const img=new Image()
    img.onload=()=>{
      const max=720
      const w=img.width
      const h=img.height
      const scale=Math.min(1, max/Math.max(w,h))
      const cw=Math.floor(w*scale)
      const ch=Math.floor(h*scale)
      const canvas=document.createElement('canvas')
      canvas.width=cw
      canvas.height=ch
      const ctx=canvas.getContext('2d')
      ctx.drawImage(img,0,0,cw,ch)
      const data=canvas.toDataURL('image/jpeg',0.75)
      try{URL.revokeObjectURL(temp)}catch(e){}
      if(imageBlobUrl){try{URL.revokeObjectURL(imageBlobUrl)}catch(e){} }
      imageBlobUrl=""
      if(imageEl){imageEl.value=data}
      reloadPreviewStructural()
    }
    img.src=temp
  })
}
async function uploadToCloudinary(file, cloudName, preset){
  const fd=new FormData()
  fd.append('file',file,'upload.jpg')
  fd.append('upload_preset',preset)
  const r=await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,{method:'POST',body:fd})
  const j=await r.json()
  if(!r.ok) throw new Error(j.error?.message||'upload failed')
  return j.secure_url||j.url
}
async function uploadToImgur(file, clientId){
  const fd=new FormData()
  fd.append('image',file)
  const r=await fetch('https://api.imgur.com/3/image',{method:'POST',headers:{Authorization:`Client-ID ${clientId}`},body:fd})
  const j=await r.json()
  if(!r.ok) throw new Error(j.data?.error||'upload failed')
  return j.data.link
}
function setStatus(t){const el=document.getElementById('uploadStatus'); if(el){el.textContent=t}}
function resizeImage(file, max=1280, quality=.85){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file)
    const img=new Image()
    img.onload=()=>{
      const w=img.width, h=img.height
      const scale=Math.min(1, max/Math.max(w,h))
      const cw=Math.floor(w*scale), ch=Math.floor(h*scale)
      const canvas=document.createElement('canvas')
      canvas.width=cw; canvas.height=ch
      const ctx=canvas.getContext('2d')
      ctx.drawImage(img,0,0,cw,ch)
      canvas.toBlob(b=>{try{URL.revokeObjectURL(url)}catch(e){}; if(b) resolve(b); else reject(new Error('แปลงไฟล์ไม่สำเร็จ'))},'image/jpeg',quality)
    }
    img.onerror=()=>{try{URL.revokeObjectURL(url)}catch(e){}; reject(new Error('เปิดภาพไม่สำเร็จ'))}
    img.src=url
  })
}
function toggleUploadFields(){
  const v=uploadDestEl?.value||'cloudinary'
  if(cloudNameEl) cloudNameEl.style.display=v==='cloudinary'?'block':'none'
  if(uploadPresetEl) uploadPresetEl.style.display=v==='cloudinary'?'block':'none'
  if(imgurClientIdEl) imgurClientIdEl.style.display=v==='imgur'?'block':'none'
}
if(uploadDestEl){uploadDestEl.addEventListener('change',toggleUploadFields);toggleUploadFields()}
if(uploadRemoteBtn){
  uploadRemoteBtn.addEventListener('click',async()=>{
    const f=imageFileEl?.files?.[0]
    if(!f){return}
    uploadRemoteBtn.disabled=true
    const prevText=uploadRemoteBtn.textContent
    uploadRemoteBtn.textContent='กำลังอัปโหลด...'
    setStatus('กำลังเตรียมภาพ...')
    try{
      const processed=await resizeImage(f,1280,.85)
      setStatus('กำลังอัปโหลด...')
      const dest=uploadDestEl?.value||'cloudinary'
      let url=""
      if(dest==='cloudinary'){
        const cn=cloudNameEl?.value?.trim()
        const up=uploadPresetEl?.value?.trim()
        if(!cn||!up) throw new Error('ต้องใส่ Cloud name และ Upload preset')
        url=await uploadToCloudinary(processed,cn,up)
      }else{
        const cid=imgurClientIdEl?.value?.trim()
        if(!cid) throw new Error('ต้องใส่ Imgur Client-ID')
        url=await uploadToImgur(processed,cid)
      }
      if(imageEl){imageEl.value=url}
      setStatus('อัปโหลดสำเร็จ')
      reloadPreviewStructural()
    }catch(e){
      setStatus(String(e.message||e))
    }finally{
      uploadRemoteBtn.disabled=false
      uploadRemoteBtn.textContent=prevText
    }
  })
}
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
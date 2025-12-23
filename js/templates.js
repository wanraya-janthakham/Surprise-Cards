function getLang(){const p=new URLSearchParams(location.search);return p.get('lang')||'th'}
function setNavLang(val){const nav=document.getElementById('navLang');if(nav){nav.value=val;nav.onchange=()=>{const u=new URL(location.href);u.searchParams.set('lang',nav.value);location.href=u.toString()}}}
function applyTexts(lang){
  const th={brand:'การ์ดเซอร์ไพรส์',create:'สร้างการ์ด',tpl:'เทมเพลต',title:'ตัวอย่างเทมเพลต',sub:'เลือกดีไซน์ที่ชอบแล้วปรับข้อความได้ภายหลัง',
    t_ann:'วันครบรอบ',m_ann:'ชมพูพาสเทล',t_bd:'วันเกิด',m_bd:'มิ้นต์สดใส',t_val:'วาเลนไทน์',m_val:'ชมพูหวาน',t_ny:'ปีใหม่',m_ny:'ฟ้าพาสเทล',t_xmas:'คริสต์มาส',m_xmas:'เขียวอบอุ่น',t_thx:'ขอบคุณ',m_thx:'โทนซันเซ็ต'}
  const en={brand:'Surprise Cards',create:'Create',tpl:'Templates',title:'Template examples',sub:'Pick a design and customize your message later',
    t_ann:'Anniversary',m_ann:'Pastel pink',t_bd:'Happy Birthday',m_bd:'Fresh mint',t_val:'Valentine',m_val:'Sweet pink',t_ny:'New Year',m_ny:'Pastel sky',t_xmas:'Christmas',m_xmas:'Cozy green',t_thx:'Thank you',m_thx:'Sunset tone'}
  const d=lang==='en'?en:th
  const map=[['.brand','brand'],['.links a[href="index.html"]','create'],['.links a.active','tpl'],['.hero h1','title'],['.hero .subtitle','sub']]
  map.forEach(([sel,key])=>{const el=document.querySelector(sel);if(el)el.textContent=d[key]})
  const items=document.querySelectorAll('.gallery .thumb')
  const names=['ann','bd','val','ny','xmas','thx']
  items.forEach((el,i)=>{
    const t=el.querySelector('.t-title');const m=el.querySelector('.t-meta')
    if(t)t.textContent=d['t_'+names[i]]
    if(m)m.textContent=d['m_'+names[i]]
    const href=new URL(el.getAttribute('href'),location.href);href.searchParams.set('lang',lang);href.searchParams.set('decor','icon');el.setAttribute('href',href.toString())
  })
}
const lang=getLang();setNavLang(lang);applyTexts(lang)

const preview=document.getElementById('tplPreview')
document.querySelectorAll('.gallery .thumb').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault()
    const href=new URL(a.getAttribute('href'),location.href)
    href.searchParams.set('envelope','none')
    if(preview) preview.src=href.toString()
  })
})
const first=document.querySelector('.gallery .thumb')
if(first&&preview){const href=new URL(first.getAttribute('href'),location.href);href.searchParams.set('envelope','none');preview.src=href.toString()}
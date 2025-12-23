function getLang(){
  const p=new URLSearchParams(location.search);return p.get('lang')||'th'
}
function setNavLang(val){
  const nav=document.getElementById('navLang');if(nav){nav.value=val;nav.onchange=()=>{const u=new URL(location.href);u.searchParams.set('lang',nav.value);location.href=u.toString()}}
}
function applyTexts(lang){
  const dict={
    th:{brand:'การ์ดเซอร์ไพรส์',create:'สร้างการ์ด',tpl:'เทมเพลต',title:'การ์ดเซอร์ไพรส์น่ารัก',sub:'ปรับแต่งการ์ดวันสำคัญให้หวานละมุน แชร์และพิมพ์ได้ทันที',
      lblOcc:'โอกาสพิเศษ',lblName:'ชื่อคนพิเศษ',lblDate:'วันที่',lblMsg:'ข้อความหวานๆ',lblPal:'โทนสี',lblEnv:'แบบซอง',lblLang:'ภาษา',
      lblOccCustom:'ระบุโอกาส',
      btnPreview:'ดูการ์ด',btnCopy:'คัดลอกลิงก์',btnOpen:'เปิดในแท็บใหม่',
      phName:'เช่น แฟนของเรา',phMsg:'พิมพ์ข้อความจากใจ',phOccCustom:'เช่น วันไปทะเลครั้งแรก'},
    en:{brand:'Surprise Cards',create:'Create',tpl:'Templates',title:'Cute Surprise Cards',sub:'Customize sweet cards for special days. Share and print instantly.',
      lblOcc:'Occasion',lblName:'Recipient name',lblDate:'Date',lblMsg:'Sweet message',lblPal:'Color palette',lblEnv:'Envelope style',lblLang:'Language',
      lblOccCustom:'Custom title',
      btnPreview:'Preview',btnCopy:'Copy link',btnOpen:'Open in new tab',
      phName:'e.g., My love',phMsg:'Type a sweet message',phOccCustom:'e.g., Our first beach day'}
  }[lang]
  const bySel=[
    ['.brand','brand'],['.links a[href="index.html"]','create'],['.links a[href="templates.html"]','tpl'],
    ['.hero h1','title'],['.hero .subtitle','sub'],
    ['label[for="occasion"]','lblOcc'],['label[for="occasionCustom"]','lblOccCustom'],['label[for="name"]','lblName'],['label[for="date"]','lblDate'],['label[for="message"]','lblMsg'],['label[for="palette"]','lblPal'],['label[for="envelope"]','lblEnv'],['label[for="lang"]','lblLang'],
    ['#previewBtn','btnPreview'],['#copyLinkBtn','btnCopy'],['#openCard','btnOpen']
  ]
  bySel.forEach(([sel,key])=>{const el=document.querySelector(sel);if(el)el.textContent=dict[key]})
  const occSel=document.getElementById('occasion')
  if(occSel){
    const namesTh={anniversary:'วันครบรอบ',birthday:'วันเกิด',valentine:'วาเลนไทน์',newyear:'ปีใหม่',christmas:'คริสต์มาส',thankyou:'ขอบคุณ',other:'อื่นๆ (พิมพ์เอง)'}
    const namesEn={anniversary:'Anniversary',birthday:'Birthday',valentine:'Valentine',newyear:'New Year',christmas:'Christmas',thankyou:'Thank you',other:'Other (custom)'}
    const table=lang==='en'?namesEn:namesTh
    Array.from(occSel.options).forEach(op=>{if(op.value in table)op.textContent=table[op.value]})
  }
  const palSel=document.getElementById('palette')
  if(palSel){
    const namesTh={pink:'ชมพูพาสเทล',lavender:'ลาเวนเดอร์',mint:'มิ้นต์',sky:'ฟ้าพาสเทล',sunset:'ซันเซ็ต'}
    const namesEn={pink:'Pastel pink',lavender:'Lavender',mint:'Mint',sky:'Pastel sky',sunset:'Sunset'}
    const table=lang==='en'?namesEn:namesTh
    Array.from(palSel.options).forEach(op=>{if(op.value in table)op.textContent=table[op.value]})
  }
  const nameEl=document.getElementById('name');if(nameEl)nameEl.placeholder=dict.phName
  const msgEl=document.getElementById('message');if(msgEl)msgEl.placeholder=dict.phMsg
  const occCustom=document.getElementById('occasionCustom');if(occCustom)occCustom.placeholder=dict.phOccCustom
  const formLang=document.getElementById('lang');if(formLang){formLang.value=lang}
  document.title=dict.title
}
const lang=getLang();setNavLang(lang);applyTexts(lang)
  const envSel=document.getElementById('envelope')
  if(envSel){
    const namesTh={classic:'คลาสสิก',heart:'หัวใจ',ribbon:'ริบบิ้น',minimal:'มินิมอล',euro:'ฝายุโรปแนวยาว',kawaii:'คาวาอี้พาสเทล',kitty:'คิตตี้น่ารัก'}
    const namesEn={classic:'Classic',heart:'Heart',ribbon:'Ribbon',minimal:'Minimal',euro:'Euro flap (wide)',kawaii:'Kawaii pastel',kitty:'Kitty cute'}
    const table=lang==='en'?namesEn:namesTh
    Array.from(envSel.options).forEach(op=>{if(op.value in table)op.textContent=table[op.value]})
  }
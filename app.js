const products=[
 {name:'Samsung Galaxy S25 Ultra',cat:'موبایل',price:'۶۹,۹۰۰,۰۰۰',old:'۷۳,۵۰۰,۰۰۰',discount:'۵٪',seller:'تکنولند',rating:'۴.۸',type:'phone'},
 {name:'MacBook Air M3 15-inch',cat:'لپ‌تاپ',price:'۸۹,۸۰۰,۰۰۰',old:'۹۴,۰۰۰,۰۰۰',discount:'۴٪',seller:'اپل‌سنتر',rating:'۴.۹',type:'laptop'},
 {name:'Sony WH-1000XM5',cat:'هدفون',price:'۱۹,۴۰۰,۰۰۰',old:'۲۱,۰۰۰,۰۰۰',discount:'۸٪',seller:'صوت‌مارکت',rating:'۴.۷',type:'headset'},
 {name:'PlayStation 5 Slim',cat:'گیمینگ',price:'۳۸,۹۰۰,۰۰۰',old:'۴۱,۰۰۰,۰۰۰',discount:'۵٪',seller:'گیم‌سنتر',rating:'۴.۹',type:'console'},
 {name:'iPhone 15 Pro 256GB',cat:'موبایل',price:'۵۸,۷۰۰,۰۰۰',old:'۶۱,۰۰۰,۰۰۰',discount:'۴٪',seller:'دیجیتال‌پلاس',rating:'۴.۸',type:'phone'},
 {name:'ASUS Zenbook 14 OLED',cat:'لپ‌تاپ',price:'۷۲,۳۰۰,۰۰۰',old:'۷۷,۰۰۰,۰۰۰',discount:'۶٪',seller:'نوت‌بوک‌چی',rating:'۴.۶',type:'laptop'},
 {name:'JBL Live 770NC',cat:'هدفون',price:'۸,۹۰۰,۰۰۰',old:'۱۰,۲۰۰,۰۰۰',discount:'۱۳٪',seller:'های‌تک',rating:'۴.۷',type:'headset'},
 {name:'Xbox Series X',cat:'گیمینگ',price:'۴۳,۵۰۰,۰۰۰',old:'۴۶,۰۰۰,۰۰۰',discount:'۵٪',seller:'گیم‌سنتر',rating:'۴.۸',type:'console'}
];
const grid=document.getElementById('productGrid');
function render(list=products){grid.innerHTML=list.map((p,i)=>`<article class="product"><button class="heart" onclick="toggleFav(this)">♡</button><span class="discount">${p.discount} تخفیف</span><div class="product-visual"><div class="prod-${p.type}"></div></div><div class="product-info"><h3>${p.name}</h3><div class="seller"><span>فروشنده: ${p.seller}</span><span class="rating">★ ${p.rating}</span></div><div class="price-row"><div class="price"><b>${p.price}</b><small>تومان</small></div><button class="add" onclick="addCart('${p.name}')">＋</button></div></div></article>`).join('')}
render();
function scrollToId(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}
function openSidePanel(){document.getElementById('sidebar').classList.add('open');document.getElementById('overlay').classList.add('show')}
document.getElementById('openSide').onclick=openSidePanel;document.getElementById('closeSide').onclick=()=>{document.getElementById('sidebar').classList.remove('open');document.getElementById('overlay').classList.remove('show')};document.getElementById('overlay').onclick=()=>document.getElementById('closeSide').click();
function filterCat(cat){render(products.filter(p=>p.cat===cat));scrollToId('products');document.querySelectorAll('.cat').forEach(x=>x.classList.remove('active'));event?.currentTarget?.classList.add('active')}
function doSearch(){const q=document.getElementById('search').value.trim();if(!q){render();return}render(products.filter(p=>(p.name+p.cat+p.seller).includes(q)));scrollToId('products')}
document.getElementById('search').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch()});
function addCart(name){let n=+(document.getElementById('cartCount').textContent||0)+1;document.getElementById('cartCount').textContent=n;toast('«'+name+'» به سبد اضافه شد');}
function toggleFav(btn){btn.textContent=btn.textContent==='♡'?'♥':'♡';btn.style.color=btn.textContent==='♥'?'#e5092f':''}
function openSell(){document.getElementById('sellModal').classList.add('show')};function closeSell(){document.getElementById('sellModal').classList.remove('show')};
function submitSell(){const name=document.getElementById('sellName').value||'کالای جدید';closeSell();toast('آگهی «'+name+'» برای ثبت آماده شد');}
function toast(msg){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';Object.assign(t.style,{position:'fixed',bottom:'85px',left:'50%',transform:'translateX(-50%)',background:'#17171b',color:'#fff',padding:'12px 18px',borderRadius:'13px',fontSize:'11px',zIndex:80,boxShadow:'0 15px 35px rgba(0,0,0,.2)'});document.body.appendChild(t)}t.textContent=msg;t.style.opacity='1';clearTimeout(window.tt);window.tt=setTimeout(()=>t.style.opacity='0',2200)}
window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('search').focus()}});
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

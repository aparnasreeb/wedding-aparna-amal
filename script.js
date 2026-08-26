const SUPABASE_URL="https://blxqnichxixwjcqcwtxo.supabase.co";
const SUPABASE_KEY="sb_publishable_gauvwiGtqFaeLfOCwKd1pQ_BoMAB3Fj";
const db=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

const DEFAULT={
 bride:"Aparna",groom:"Amal",heroKicker:"Together with their families",
 inviteTitle:"Wedding Invitation",weddingDate:"01 November 2026",
 invitationMessage:"Together with our families, we joyfully invite you to join us as we begin this new chapter. Your presence, blessings, and love will make our celebration complete.",
 events:[
  {name:"Sangeet",date:"31 October 2026",time:"6:30 PM",venue:"Al Saj Amaranta",address:"Service Rd, Kazhakkoottam, Thiruvananthapuram, Kerala 695582",map:"https://maps.app.goo.gl/HG8cMTt6fJzMacrs9"},
  {name:"Wedding",date:"01 November 2026",time:"11:40 AM",venue:"Al Saj Arena",address:"Service Rd, Poundukadavu, Thiruvananthapuram, Kerala 695583",map:"https://maps.app.goo.gl/3NUUPpaWNFwy6N34A"},
  {name:"Reception",date:"03 November 2026",time:"5:00 PM",venue:"Contour Backwaters",address:"Alappuzha - Changanassery Hwy, Changanassery, Kerala 686101",map:"https://maps.app.goo.gl/VjAKarV89b1bNTYL8"}
 ],
 rsvpDeadline:"27 October 2026",coordinatorName:"P Venugopal Nair",
 coordinatorPhone:"9983867697",whatsappNumber:"",
 closingMain:"Thank you for being part of our story",
 closingSub:"and for blessing us as we begin forever.",theme:"rose",
 photos:{hero:"",invitation:"",closing:""}
};
let WEDDING=structuredClone(DEFAULT);

const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

async function load(){
 const {data}=await db.from("wedding_content").select("content").eq("id",1).maybeSingle();
 if(data?.content) WEDDING={...DEFAULT,...data.content};
 render();
}

function render(){
 document.getElementById("heroKicker").textContent=WEDDING.heroKicker;
 document.getElementById("coupleNames").textContent=`${WEDDING.groom} & ${WEDDING.bride}`;
 document.getElementById("familyLine").textContent=WEDDING.heroKicker;
 document.getElementById("inviteTitle").textContent=WEDDING.inviteTitle;
 document.getElementById("weddingDate").textContent=WEDDING.weddingDate;
 document.getElementById("invitationMessage").textContent=WEDDING.invitationMessage;
 document.getElementById("rsvpDeadline").textContent=WEDDING.rsvpDeadline;
 document.getElementById("coordinatorName").textContent=WEDDING.coordinatorName;
 const p=document.getElementById("coordinatorPhone");p.textContent=WEDDING.coordinatorPhone;p.href=`tel:${WEDDING.coordinatorPhone}`;
 document.getElementById("closingMain").textContent=WEDDING.closingMain;
 document.getElementById("closingSub").textContent=WEDDING.closingSub;
 document.getElementById("closingNames").textContent=`${WEDDING.groom} & ${WEDDING.bride}`;
 const grid=document.getElementById("eventGrid"),opts=document.getElementById("rsvpEventOptions");
 grid.innerHTML="";opts.innerHTML="";
 WEDDING.events.forEach((e,i)=>{
  grid.insertAdjacentHTML("beforeend",`<article class="event-card"><div class="event-num">0${i+1}</div><div class="event-name">${esc(e.name)}</div><div class="event-meta"><strong>${esc(e.date)}</strong><br>${esc(e.time)}<br><br><strong>${esc(e.venue)}</strong><br>${esc(e.address)}</div><a class="map-btn" href="${esc(e.map)}" target="_blank" rel="noopener">View Location ↗</a></article>`);
  opts.insertAdjacentHTML("beforeend",`<button class="event-option" data-event="${esc(e.name)}">${esc(e.name)}<br><small>${esc(e.date)} · ${esc(e.time)}</small></button>`);
 });
 attach();
 applyTheme();
}
function attach(){
 document.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.next).scrollIntoView({behavior:"smooth"}));
 const card=document.getElementById("revealCard"),reveal=()=>card.classList.add("revealed");
 card.onclick=reveal;card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();reveal();}};
 let guests=1;
 const show=n=>document.querySelectorAll(".step").forEach(s=>s.classList.toggle("hidden",s.dataset.step!==String(n)));
 document.querySelectorAll("[data-attending]").forEach(b=>b.onclick=()=>b.dataset.attending==="no"?show("done"):show(2));
 document.querySelectorAll(".event-option").forEach(b=>b.onclick=()=>b.classList.toggle("selected"));
 document.querySelectorAll(".continue-step").forEach(b=>b.onclick=()=>{
  if(b.dataset.to==="3"&&!document.querySelector(".event-option.selected")){alert("Please select at least one celebration.");return;}
  show(b.dataset.to);
 });
 document.getElementById("minusGuests").onclick=()=>{guests=Math.max(1,guests-1);document.getElementById("guestCount").textContent=guests};
 document.getElementById("plusGuests").onclick=()=>{guests++;document.getElementById("guestCount").textContent=guests};
 document.getElementById("submitRsvp").onclick=async()=>{
  const name=document.getElementById("guestName").value.trim(),phone=document.getElementById("guestPhone").value.trim();
  const events=[...document.querySelectorAll(".event-option.selected")].map(x=>x.dataset.event);
  if(!name||!phone){alert("Please enter your name and phone number.");return;}
  const {error}=await db.from("rsvps").insert({name,phone,guests,events});
  if(error){alert("Could not save RSVP. Please try again.");return;}
  const number=(WEDDING.whatsappNumber||"").replace(/\D/g,"");
  const msg=`💍 ${WEDDING.groom} & ${WEDDING.bride} Wedding RSVP\n\nName: ${name}\nPhone: ${phone}\nGuests: ${guests}\nCelebrations: ${events.join(", ")}`;
  if(number) window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`,"_blank");
  show("done");
 };
}
function applyTheme(){
 const t={rose:["#fbf7f2","#8e777c","#40383a"],ivory:["#fffdf7","#9b7a42","#3e3831"],botanical:["#f5f7f1","#667a5b","#344034"],dark:["#1f1b1d","#b89b68","#f8f1e7"],kerala:["#fff9ed","#9d3c32","#4b3028"]}[WEDDING.theme]||["#fbf7f2","#8e777c","#40383a"];
 document.documentElement.style.setProperty("--ivory",t[0]);document.documentElement.style.setProperty("--ink",t[2]);
 document.querySelectorAll(".primary-btn").forEach(x=>x.style.background=t[1]);
 if(WEDDING.photos?.hero) document.querySelector(".hero").style.backgroundImage=`linear-gradient(#0003,#0003),url("${WEDDING.photos.hero}")`;
 if(WEDDING.photos?.invitation) document.querySelector(".invitation").style.backgroundImage=`linear-gradient(#fff9,#fff9),url("${WEDDING.photos.invitation}")`;
 if(WEDDING.photos?.closing) document.querySelector(".closing").style.backgroundImage=`linear-gradient(#0002,#0002),url("${WEDDING.photos.closing}")`;
}
load();
window.addEventListener("scroll",()=>{const h=document.documentElement,m=h.scrollHeight-h.clientHeight;document.querySelector(".progress").style.width=`${scrollY/m*100}%`;});

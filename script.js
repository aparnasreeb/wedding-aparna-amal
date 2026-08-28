"use strict";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const urlInvitationId = new URLSearchParams(window.location.search).get("id");
const CURRENT_INVITATION_ID = Number(urlInvitationId) > 0 ? Number(urlInvitationId) : Number(DEFAULT_INVITATION_ID);

const DEFAULT = {
  bride:"Aparna", groom:"Amal", heroKicker:"Together with their families", inviteTitle:"Wedding Invitation",
  weddingDate:"01 November 2026",
  invitationMessage:"Together with our families, we joyfully invite you to join us as we begin this new chapter. Your presence, blessings, and love will make our celebration complete.",
  rsvpDeadline:"27 October 2026", coordinatorName:"P Venugopal Nair", coordinatorPhone:"9983867697", whatsappNumber:"",
  closingMain:"Thank you for being part of our story", closingSub:"and for blessing us as we begin forever.", theme:"rose",
  fonts:{heading:"Cormorant Garamond",body:"DM Sans"}, textColors:{heading:"#40383a",body:"#40383a"},
  backgroundColor:"#fbf7f2", accentColor:"#8e777c",
  photos:{hero:"",invitation:"",celebrations:"",rsvp:"",closing:"",heroAnimation:"kenburns",invitationAnimation:"fade",celebrationsAnimation:"fade",rsvpAnimation:"zoom",closingAnimation:"kenburns"},
  events:[
    {name:"Sangeet",date:"31 October 2026",time:"6:30 PM",venue:"Al Saj Amaranta",address:"Service Rd, Kazhakkoottam, Thiruvananthapuram, Kerala 695582",map:"https://maps.app.goo.gl/HG8cMTt6fJzMacrs9"},
    {name:"Wedding",date:"01 November 2026",time:"11:40 AM",venue:"Al Saj Arena",address:"Service Rd, Poundukadavu, Thiruvananthapuram, Kerala 695583",map:"https://maps.app.goo.gl/3NUUPpaWNFwy6N34A"},
    {name:"Reception",date:"03 November 2026",time:"5:00 PM",venue:"Contour Backwaters",address:"Alappuzha - Changanassery Hwy, Changanassery, Kerala 686101",map:"https://maps.app.goo.gl/VjAKarV89b1bNTYL8"}
  ]
};

let WEDDING = structuredClone(DEFAULT);

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

async function load(){
  const {data,error}=await db.from("wedding_content").select("content").eq("id",CURRENT_INVITATION_ID).maybeSingle();
  if(error){console.error(error);return;}
  if(data?.content){
    WEDDING={...DEFAULT,...data.content,
      fonts:{...DEFAULT.fonts,...(data.content.fonts||{})},
      textColors:{...DEFAULT.textColors,...(data.content.textColors||{})},
      photos:{...DEFAULT.photos,...(data.content.photos||{})}
    };
  }
  render();
}

function render(){
  document.title=`${WEDDING.groom||""} & ${WEDDING.bride||""} | Wedding Invitation`;
  const values=[
    ["heroKicker",WEDDING.heroKicker],["familyLine",WEDDING.heroKicker],
    ["coupleNames",`${WEDDING.groom||""} & ${WEDDING.bride||""}`],["inviteTitle",WEDDING.inviteTitle],
    ["heroDate",WEDDING.weddingDate],["weddingDate",WEDDING.weddingDate],
    ["invitationMessage",WEDDING.invitationMessage],["rsvpDeadline",WEDDING.rsvpDeadline],
    ["coordinatorName",WEDDING.coordinatorName],["closingMain",WEDDING.closingMain],
    ["closingSub",WEDDING.closingSub],["closingNames",`${WEDDING.groom||""} & ${WEDDING.bride||""}`]
  ];
  values.forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=v||"";});
  const phone=document.getElementById("coordinatorPhone");
  if(phone){phone.textContent=WEDDING.coordinatorPhone||"";phone.href=`tel:${WEDDING.coordinatorPhone||""}`;}

  const grid=document.getElementById("eventGrid"),opts=document.getElementById("rsvpEventOptions");
  if(grid)grid.innerHTML="";
  if(opts)opts.innerHTML="";
  (WEDDING.events||[]).forEach((e,i)=>{
    if(grid)grid.insertAdjacentHTML("beforeend",`<article class="event-card"><div class="event-num">${String(i+1).padStart(2,"0")}</div><div class="event-name">${esc(e.name)}</div><div class="event-meta"><strong>${esc(e.date)}</strong><br>${esc(e.time)}<br><br><strong>${esc(e.venue)}</strong><br>${esc(e.address)}</div><a class="map-btn" href="${esc(e.map)}" target="_blank" rel="noopener">View Location ↗</a></article>`);
    if(opts)opts.insertAdjacentHTML("beforeend",`<button class="event-option" data-event="${esc(e.name)}">${esc(e.name)}<br><small>${esc(e.date)} · ${esc(e.time)}</small></button>`);
  });
  applyTheme();attach();
}

function applyTheme(){
  const themes={rose:["#fbf7f2","#8e777c","#40383a"],ivory:["#fffdf7","#9b7a42","#3e3831"],botanical:["#f5f7f1","#667a5b","#344034"],dark:["#1f1b1d","#b89b68","#f8f1e7"],kerala:["#fff9ed","#9d3c32","#4b3028"],champagne:["#faf5eb","#b18a55","#4b3b2b"],blush:["#fff4f3","#b8787c","#50383b"],mocha:["#f4ede6","#896f5b","#3f332b"],terracotta:["#fbefe8","#a65f48","#4a3029"],pearl:["#f7f7f5","#8a8a82","#333532"],burgundy:["#f7eeee","#8a3547","#38252a"],sunset:["#fff1e6","#c77b52","#4a3026"],sage:["#eef2ea","#71836a","#394338"],mauve:["#f5eef2","#98788b","#44353e"],sand:["#f5eee3","#a98962","#4c4035"]};
  const t=themes[WEDDING.theme]||themes.rose;
  document.documentElement.style.setProperty("--surface",WEDDING.backgroundColor||t[0]);
  document.documentElement.style.setProperty("--accent",WEDDING.accentColor||t[1]);
  document.documentElement.style.setProperty("--ink",WEDDING.textColors?.body||t[2]);
  const f=WEDDING.fonts||{};
  document.documentElement.style.setProperty("--heading-font",`"${f.heading||"Cormorant Garamond"}",serif`);
  document.documentElement.style.setProperty("--body-font",`"${f.body||"DM Sans"}",sans-serif`);
  setBg("hero",WEDDING.photos?.hero);setBg("invitationPhotoLayer",WEDDING.photos?.invitation);setBg("celebrationPhotoBg",WEDDING.photos?.celebrations);setBg("rsvpPhotoLayer",WEDDING.photos?.rsvp);setBg("closingPhotoLayer",WEDDING.photos?.closing);
  document.querySelectorAll("h1,h2,h3,.event-name,.revealed-date").forEach(x=>x.style.color=WEDDING.textColors?.heading||t[2]);
}
function setBg(id,url){const e=document.getElementById(id);if(e&&url)e.style.backgroundImage=`url("${String(url).replace(/"/g,"%22")}")`;}

function attach(){
  document.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.next)?.scrollIntoView({behavior:"smooth"}));
  const card=document.getElementById("revealCard");
  if(card){const reveal=()=>card.classList.add("revealed");card.onclick=reveal;card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();reveal();}};}
  let guests=1;
  const show=n=>document.querySelectorAll(".step").forEach(s=>s.classList.toggle("hidden",s.dataset.step!==String(n)));
  document.querySelectorAll("[data-attending]").forEach(b=>b.onclick=()=>b.dataset.attending==="no"?show("done"):show(2));
  document.querySelectorAll(".event-option").forEach(b=>b.onclick=()=>b.classList.toggle("selected"));
  document.querySelectorAll(".continue-step").forEach(b=>b.onclick=()=>{if(b.dataset.to==="3"&&!document.querySelector(".event-option.selected")){alert("Please select at least one celebration.");return;}show(b.dataset.to);});
  const minus=document.getElementById("minusGuests"),plus=document.getElementById("plusGuests"),count=document.getElementById("guestCount");
  if(minus)minus.onclick=()=>{guests=Math.max(1,guests-1);count.textContent=guests;};
  if(plus)plus.onclick=()=>{guests++;count.textContent=guests;};
  const submit=document.getElementById("submitRsvp");
  if(submit)submit.onclick=async()=>{
    const name=document.getElementById("guestName").value.trim(),phone=document.getElementById("guestPhone").value.trim(),events=[...document.querySelectorAll(".event-option.selected")].map(x=>x.dataset.event);
    if(!name||!phone||!events.length){alert(!name||!phone?"Please enter your name and phone number.":"Please select at least one celebration.");return;}
    submit.disabled=true;submit.textContent="Saving RSVP...";
    const {error}=await db.from("rsvps").insert({invitation_id:CURRENT_INVITATION_ID,name,phone,guests,events});
    if(error){console.error(error);alert("Could not save RSVP.\n\n"+error.message);submit.disabled=false;submit.textContent="Submit RSVP";return;}
    const number=String(WEDDING.whatsappNumber||"").replace(/\D/g,"");
    const msg=`💍 ${WEDDING.groom} & ${WEDDING.bride} Wedding RSVP\n\nName: ${name}\nPhone: ${phone}\nGuests: ${guests}\nCelebrations: ${events.join(", ")}`;
    if(number)window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`,"_blank","noopener");else alert("Your RSVP was saved, but no WhatsApp number is configured in Admin.");
    submit.disabled=false;submit.textContent="Submit RSVP";show("done");
  };
}

load();
window.addEventListener("scroll",()=>{const h=document.documentElement,m=h.scrollHeight-h.clientHeight;if(m>0){const p=document.querySelector(".progress");if(p)p.style.width=`${scrollY/m*100}%`;}});

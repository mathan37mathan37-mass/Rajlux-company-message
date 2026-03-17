import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
getFirestore,
collection,
deleteDoc,
doc,
onSnapshot,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
apiKey: "AIzaSyD190aRyT2Q8u2q8vBOIXQDvy_ObAXTuWI",
authDomain: "company-227f9.firebaseapp.com",
projectId: "company-227f9",
storageBucket: "company-227f9.firebasestorage.app",
messagingSenderId: "486645620594",
appId: "1:486645620594:web:9a1d6028d8f142b68847eb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* 🔊 Enable sound after user interaction */
let soundEnabled = false;
document.addEventListener("click", () => {
soundEnabled = true;
});


let messagesData = [];
let previousCount = 0;


/* 🔥 Real-time listener with latest first */
function listenMessages(){

const q = query(collection(db,"messages"), orderBy("created","desc"));

onSnapshot(q,(snapshot)=>{

messagesData = [];

snapshot.forEach((docSnap)=>{
const data = docSnap.data();

messagesData.push({
id: docSnap.id,
...data
});
});

/* Counter */
document.getElementById("counter").innerText = messagesData.length;


/* 🔔 Notification */
if(messagesData.length > previousCount && previousCount !== 0){

if(soundEnabled){
document.getElementById("notifSound").play();
}

alert("🔔 New customer message received!");

}

previousCount = messagesData.length;

/* Display */
displayMessages(messagesData);

/* Analytics */
updateAnalytics(messagesData);

});

}


/* 🖥 Display Messages */
function displayMessages(data){

const container = document.getElementById("messages");
container.innerHTML = "";

data.forEach(msg=>{

const date = msg.created 
? new Date(msg.created.seconds * 1000).toLocaleString() 
: "No date";

container.innerHTML += `
<div class="msg">

<h3>${msg.name}</h3>

<p><b>Email:</b> ${msg.email}</p>

<p><b>Phone:</b> ${msg.phone || "Not provided"}</p>

<p><b>Service:</b> ${msg.service || "Not selected"}</p>

<p><b>Message:</b> ${msg.message}</p>

<small>📅 ${date}</small>

<button onclick="deleteMessage('${msg.id}')">Delete</button>

</div>
`;

});

}


/* ❌ Delete Message */
window.deleteMessage = async function(id){

if(confirm("Delete this message?")){
await deleteDoc(doc(db,"messages",id));
}

}


/* 🔍 Search (name + email + service) */
document.getElementById("search").addEventListener("input",(e)=>{

const value = e.target.value.toLowerCase();

const filtered = messagesData.filter(msg =>
msg.name.toLowerCase().includes(value) ||
msg.email.toLowerCase().includes(value) ||
(msg.service && msg.service.toLowerCase().includes(value))
);

displayMessages(filtered);

});

window.filterService = function(type){

if(type === "all"){
displayMessages(messagesData);
return;
}

const filtered = messagesData.filter(msg =>
msg.service && msg.service.toLowerCase().includes(type)
);

displayMessages(filtered);

}

/* 📊 Analytics */
function updateAnalytics(data){

const total = data.length;
let todayCount = 0;

let web = 0;
let mobile = 0;
let marketing = 0;

const today = new Date().toDateString();

data.forEach(msg=>{

/* Count today messages */
if(msg.created){
const d = new Date(msg.created.seconds * 1000);
if(d.toDateString() === today){
todayCount++;
}
}

/* Count by service */
if(msg.service){

const service = msg.service.toLowerCase();

if(service.includes("web")){
web++;
}
else if(service.includes("mobile")){
mobile++;
}
else if(service.includes("marketing")){
marketing++;
}

}

});

/* Update UI */
document.getElementById("counter").innerText = total;
document.getElementById("today").innerText = todayCount;

document.getElementById("webCount").innerText = web;
document.getElementById("mobileCount").innerText = mobile;
document.getElementById("marketingCount").innerText = marketing;

}


/* 🚀 Start listener */
listenMessages();

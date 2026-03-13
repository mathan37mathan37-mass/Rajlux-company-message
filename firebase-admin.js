import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
getFirestore,
collection,
getDocs,
deleteDoc,
doc
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

let messagesData = [];


async function loadMessages(){

const querySnapshot = await getDocs(collection(db,"messages"));

const container = document.getElementById("messages");
container.innerHTML = "";

messagesData = [];

querySnapshot.forEach((docSnap)=>{

const data = docSnap.data();

messagesData.push({
id: docSnap.id,
...data
});

});

document.getElementById("counter").innerText = messagesData.length;

displayMessages(messagesData);
updateAnalytics(messagesData);

}

function displayMessages(data){

const container = document.getElementById("messages");
container.innerHTML = "";

data.forEach(msg=>{

const date = msg.created ? new Date(msg.created.seconds * 1000).toLocaleString() : "No date";

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

window.deleteMessage = async function(id){

if(confirm("Delete this message?")){

await deleteDoc(doc(db,"messages",id));

loadMessages();

}

}

document.getElementById("search").addEventListener("input",(e)=>{

const value = e.target.value.toLowerCase();

const filtered = messagesData.filter(msg =>
msg.name.toLowerCase().includes(value) ||
msg.email.toLowerCase().includes(value)
);

displayMessages(filtered);

});



function updateAnalytics(data){

const total = data.length;

let todayCount = 0;

const today = new Date().toDateString();

data.forEach(msg=>{

if(msg.created){

const d = new Date(msg.created.seconds * 1000);

if(d.toDateString() === today){
todayCount++;
}

}

});

document.getElementById("counter").innerText = total;
document.getElementById("today").innerText = todayCount;

}

loadMessages();

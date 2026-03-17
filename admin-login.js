import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
getFirestore,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
apiKey: "AIzaSyD190aRyT2Q8u2q8vBOIXQDvy_ObAXTuWI",
authDomain: "company-227f9.firebaseapp.com",
projectId: "company-227f9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


window.login = async function(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

const querySnapshot = await getDocs(collection(db,"admins"));

let found = false;

querySnapshot.forEach((doc)=>{
const data = doc.data();

if(data.username === username && data.password === password){
found = true;
}
});

if(found){
localStorage.setItem("adminLogin","true");
window.location.href = "admin.html";
}else{
document.getElementById("error").innerText = "Invalid login!";
}

}
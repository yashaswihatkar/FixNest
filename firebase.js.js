<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyCgKI-RxIdn2_LYhhBvsIx7etRYrXG4rig",
authDomain: "ai-customer-support-assi-5af0d.firebaseapp.com",
projectId: "ai-customer-support-assi-5af0d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadAnalytics(){

let reqSnap = await getDocs(collection(db,"technicianRequests"));

let total = 0;
let completed = 0;
let pending = 0;
let assigned = 0;

let techCount = {};
let productCount = {};
let dateCount = {};

/* PROCESS DATA */
reqSnap.forEach(doc=>{
let d = doc.data();
total++;

// STATUS
if(d.status === "Completed") completed++;
else if(d.status === "Assigned") assigned++;
else pending++;

// TECH WORKLOAD
if(d.assignedTech){
techCount[d.assignedTech] = (techCount[d.assignedTech] || 0) + 1;
}

// PRODUCT
if(d.product){
productCount[d.product] = (productCount[d.product] || 0) + 1;
}

// DATE TREND
let date = d.preferredDate || "Unknown";
dateCount[date] = (dateCount[date] || 0) + 1;

});

/* SAFETY */
if(Object.keys(techCount).length===0) techCount={"No Data":1};
if(Object.keys(productCount).length===0) productCount={"No Data":1};
if(Object.keys(dateCount).length===0) dateCount={"No Data":1};

/* ✅ FIXED CARD VALUES */
document.getElementById("totalReq").innerText = total;
document.getElementById("completed").innerText = completed;
document.getElementById("pending").innerText = pending;
document.getElementById("assigned").innerText = assigned;

/* ===================== CHARTS ===================== */

/* PRODUCT CHART */
new Chart(document.getElementById("productChart"),{
type:"bar",
data:{
labels:Object.keys(productCount),
datasets:[{
label:"Requests",
data:Object.values(productCount),
backgroundColor:"#66bb6a"
}]
}
});

/* TECH CHART */
new Chart(document.getElementById("techChart"),{
type:"bar",
data:{
labels:Object.keys(techCount),
datasets:[{
label:"Workload",
data:Object.values(techCount),
backgroundColor:"#42a5f5"
}]
}
});

/* STATUS PIE */
new Chart(document.getElementById("statusChart"),{
type:"pie",
data:{
labels:["Pending","Assigned","Completed"],
datasets:[{
data:[pending,assigned,completed],
backgroundColor:["#ffb74d","#64b5f6","#81c784"]
}]
}
});

/* TREND LINE */
new Chart(document.getElementById("trendChart"),{
type:"line",
data:{
labels:Object.keys(dateCount),
datasets:[{
label:"Requests",
data:Object.values(dateCount),
borderColor:"#ab47bc",
backgroundColor:"rgba(171,71,188,0.2)",
fill:true,
tension:0.3
}]
}
});

}

/* BACK BUTTON */
window.goBack = ()=>{
window.location.href="admin.html";
};

loadAnalytics();

</script>
function search(){
  let v = document.getElementById("searchInput").value;
  alert("Searching for: " + v);
}

// LOGIN POPUP
const loginBtn = document.getElementById("loginBtn");
const loginBox = document.getElementById("loginBox");

loginBtn.onclick = ()=>{
  loginBox.style.display="block";
  generateCaptcha();
}

function closeLogin(){
  loginBox.style.display="none";
}

// CAPTCHA
function generateCaptcha(){
  let chars="ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
  let cap="";
  for(let i=0;i<5;i++){
    cap+=chars[Math.floor(Math.random()*chars.length)];
  }
  document.getElementById("captchaText").innerText=cap;
}

// LOGIN CHECK
function login(){
  let u=document.getElementById("username").value;
  let p=document.getElementById("password").value;
  let c=document.getElementById("captchaInput").value;
  let real=document.getElementById("captchaText").innerText;

  if(u==""||p==""||c==""){
    alert("All fields required");
    return;
  }
  if(c!==real){
    alert("Captcha incorrect");
    generateCaptcha();
    return;
  }
  alert("Login Successful");
  closeLogin();
}
/* ================= SHOW/HIDE FORMS ================= */
function openForm(formId){
  // Hide all forms first
  const forms = document.querySelectorAll('.role-form');
  forms.forEach(f => f.style.display = 'none');

  // Show selected form
  document.getElementById(formId).style.display = 'block';
}

/* ================= OTP & FACE ================= */
let generatedOTP = "";
let otpVerified = false;
let faceVerified = false;

/* ================= SEND OTP ================= */
function sendOTP(){
  const mobile = document.getElementById("voterMobile").value;
  if(!/^\d{10}$/.test(mobile)){
    alert("Enter valid 10-digit mobile number");
    return;
  }
  generatedOTP = Math.floor(100000 + Math.random()*900000).toString();
  alert("Demo OTP: " + generatedOTP); // Real SMS API in production
}

/* ================= VERIFY OTP ================= */
function verifyOTP(){
  const entered = document.getElementById("otpInput").value;
  if(entered === generatedOTP){
    otpVerified = true;
    document.getElementById("otpStatus").innerText = "OTP Verified ✔";
    document.getElementById("otpStatus").style.color = "green";
  }else{
    alert("Invalid OTP");
  }
}

/* ================= FACE VERIFICATION ================= */
let video = document.getElementById("voterVideo");
let canvas = document.getElementById("voterCanvas");
let ctx = canvas.getContext("2d");

function startCamera(){
  navigator.mediaDevices.getUserMedia({video:true})
    .then(stream => video.srcObject = stream)
    .catch(()=>alert("Camera access denied"));
}

function captureFace(){
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  faceVerified = true;
  document.getElementById("faceStatus").innerText = "Face Verified ✔";
  document.getElementById("faceStatus").style.color = "green";
  checkVoterEligibility();
}

/* ================= ENABLE REGISTER BUTTON ================= */
function checkVoterEligibility(){
  if(faceVerified && otpVerified && validateAadhaar()){
    document.getElementById("voterRegisterBtn").disabled = false;
  }
}

/* ================= VALIDATE AADHAAR ================= */
function validateAadhaar(){
  const aadhaar = document.getElementById("voterAadhaar").value;
  if(/^\d{12}$/.test(aadhaar)){
    return true;
  }else{
    alert("Aadhaar must be exactly 12 digits");
    return false;
  }
}
/* ================= REGISTER VOTER & GENERATE ID ================= */
function registerVoter(){
  if(!(otpVerified && faceVerified && validateAadhaar())){
    alert("Complete all verification steps first");
    return;
  }

  const randomID = "VID" + Math.floor(100000 + Math.random()*900000); // e.g., VID123456
  document.getElementById("voterIDDisplay").innerText = `Voter ID Generated: ${randomID}`;

  // Immediately alert + redirect if needed
  alert(`Voter Registered Successfully!\nVoter ID: ${randomID}`);
  window.location.href = "voter-dashboard.html"; // Redirect after registration
}
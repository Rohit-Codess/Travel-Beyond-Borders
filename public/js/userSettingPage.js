
// Dynamic Greeting
const greeting = document.getElementById("greeting");
const now = new Date();
const hour = now.getHours();
let greetText = "Hello";

if (hour >= 5 && hour < 12) {
  greetText = `Good Morning, ${username}! 🌅`;
} else if (hour >= 12 && hour < 17) {
  greetText = `Good Afternoon, ${username}! ☀️`;
} else if (hour >= 17 && hour < 21) {
  greetText = `Good Evening, ${username}! 🌇`;
} else {
  greetText = `Good Night, ${username}! 🌙`;
}
greeting.innerHTML = greetText;

// Live Preview of Profile Image
const profileInput = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");
const savePhotoBtn = document.getElementById("savePhotoBtn");

profileInput.addEventListener("change", function () {
  const file = profileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePreview.src = e.target.result;
      savePhotoBtn.classList.remove("d-none"); // Show Save Button
    };
    reader.readAsDataURL(file);
  }
});

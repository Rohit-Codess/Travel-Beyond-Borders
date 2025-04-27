// For LogIn Or SignUp and Password Change Validation

(() => {
  const signupForm = document.getElementById("signupForm");
  const changePasswordForm = document.getElementById("changePasswordForm");

  const password = document.getElementById("password");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  const passwordStrength = document.getElementById("passwordStrength");
  const confirmPasswordMessage = document.getElementById(
    "confirmPasswordMessage"
  );

  const strongPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Handle both signup and change password pages
  const activePasswordField = password || newPassword;

  if (activePasswordField && passwordStrength) {
    activePasswordField.addEventListener("input", () => {
      const value = activePasswordField.value;

      if (value.length < 8) {
        passwordStrength.textContent =
          "Weak Password ❌ (Minimum 8 characters required)";
        passwordStrength.className = "text-danger small";
      } else if (
        !/[A-Z]/.test(value) ||
        !/[a-z]/.test(value) ||
        !/\d/.test(value) ||
        !/[@$!%*?&]/.test(value)
      ) {
        passwordStrength.textContent =
          "Invalid Password Format, Correct is⚡(Add uppercase, lowercase, number, symbol)";
        passwordStrength.className = "text-dark small";
      } else {
        passwordStrength.textContent = "Strong Password ✅ (Perfect)";
        passwordStrength.className = "text-success small";
      }
    });
  }

  // Confirm Password Matching (Both pages)
  if ((signupForm || changePasswordForm) && confirmPassword) {
    confirmPassword.addEventListener("input", () => {
      const mainPasswordValue = activePasswordField
        ? activePasswordField.value
        : "";

      if (confirmPassword.value === mainPasswordValue) {
        if (confirmPasswordMessage) {
          confirmPasswordMessage.textContent = "Passwords Match ✅";
          confirmPasswordMessage.className = "text-success small";
        }
        confirmPassword.setCustomValidity("");
      } else {
        if (confirmPasswordMessage) {
          confirmPasswordMessage.textContent = "Passwords Do Not Match ❌";
          confirmPasswordMessage.className = "text-danger small";
        }
        confirmPassword.setCustomValidity("Passwords do not match!");
      }
    });
  }

  // Final Form Validation
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      let isValid = true;

      if (!strongPasswordPattern.test(password.value)) {
        password.setCustomValidity(
          "Password must have at least one lowercase, one uppercase, one number, one special character and minimum 8 characters."
        );
        isValid = false;
      } else {
        password.setCustomValidity("");
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords do not match.");
        isValid = false;
      } else {
        confirmPassword.setCustomValidity("");
      }

      if (!signupForm.checkValidity() || !isValid) {
        event.preventDefault();
        event.stopPropagation();
      }

      signupForm.classList.add("was-validated");
    });
  }

  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", function (event) {
      let isValid = true;

      if (!strongPasswordPattern.test(newPassword.value)) {
        newPassword.setCustomValidity(
          "Password must have at least one lowercase, one uppercase, one number, one special character and minimum 8 characters."
        );
        isValid = false;
      } else {
        newPassword.setCustomValidity("");
      }

      if (newPassword.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords do not match.");
        isValid = false;
      } else {
        confirmPassword.setCustomValidity("");
      }

      if (!changePasswordForm.checkValidity() || !isValid) {
        event.preventDefault();
        event.stopPropagation();
      }

      changePasswordForm.classList.add("was-validated");
    });
  }
})();

// 5️⃣ Password Show/Hide Toggle
(() => {
  const toggleIcons = document.querySelectorAll(".toggle-password");
  toggleIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetInput = document.getElementById(icon.dataset.target);
      if (targetInput.type === "password") {
        targetInput.type = "text";
        icon.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
      } else {
        targetInput.type = "password";
        icon.innerHTML = '<i class="fa-solid fa-eye"></i>';
      }
    });
  });
})();

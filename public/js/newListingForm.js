"use strict";

// 1️⃣ Combined Validation + Button Control + Real Success Popup
(() => {
  const form = document.getElementById("listingForm");
  if (!form) return;

  const submitButton = document.getElementById("submitButton");
  const submitText = document.getElementById("submitText");
  const submitSpinner = document.getElementById("submitSpinner");
  const preview = document.getElementById("preview");
  const fileInput = form.querySelector('input[type="file"]');
  const inputs = form.querySelectorAll("input, textarea, select");
  const MAX_FILE_SIZE = 500 * 1024;

  submitButton.disabled = true; // Button disabled initially

  function validateFormFields() {
    let isValid = true;

    const title = form.querySelector('input[name="listing[title]"]');
    const description = form.querySelector(
      'textarea[name="listing[description]"]'
    );
    const category = form.querySelector('select[name="listing[category]"]');
    const price = form.querySelector('input[name="listing[price]"]');
    const country = form.querySelector('input[name="listing[country]"]');
    const location = form.querySelector('input[name="listing[location]"]');

    const alphaPattern = /^[A-Za-z\s]+$/;

    if (title.value.trim().length < 10) {
      title.setCustomValidity("Title must be at least 10 characters.");
      isValid = false;
    } else {
      title.setCustomValidity("");
    }

    if (description.value.trim().length < 20) {
      description.setCustomValidity(
        "Description must be at least 20 characters."
      );
      isValid = false;
    } else {
      description.setCustomValidity("");
    }

    if (!category.value || category.value === "") {
      category.setCustomValidity("Please choose a category.");
      isValid = false;
    } else {
      category.setCustomValidity("");
    }    

    if (price.value.trim() === "" || parseFloat(price.value) < 0) {
      price.setCustomValidity("Price must be a non-negative number.");
      isValid = false;
    } else {
      price.setCustomValidity("");
    }

    if (
      country.value.trim().length < 3 ||
      !alphaPattern.test(country.value.trim())
    ) {
      country.setCustomValidity(
        "Country must be at least 3 letters and only letters allowed."
      );
      isValid = false;
    } else {
      country.setCustomValidity("");
    }

    if (
      location.value.trim().length < 3 ||
      !alphaPattern.test(location.value.trim())
    ) {
      location.setCustomValidity(
        "Location must be at least 3 letters and only letters allowed."
      );
      isValid = false;
    } else {
      location.setCustomValidity("");
    }

    if (fileInput.files.length === 0) {
      isValid = false;
    }

    submitButton.disabled = !isValid;
    return isValid;
  }

  // Validate Image file size
  function checkFileSize(fileInput) {
    const file = fileInput.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      Swal.fire({
        icon: 'error',
        title: 'File too large!',
        text: 'Please select an image smaller than 500 KB.',
        confirmButtonColor: '#d33'
      });
      fileInput.value = ""; // Clear the selected file
      return false;
    }
    return true;
  }
  // Attach Live Validation
  inputs.forEach((input) => {
    input.addEventListener("input", validateFormFields);
  });

  fileInput.addEventListener("change", () => {
    checkFileSize(fileInput);
    validateFormFields();
    previewImage();
  });

  
  // Preview Image
  function previewImage() {
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  // On Form Submit
  form.addEventListener("submit", async function (event) {
    if (!form.checkValidity() || !validateFormFields()) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    // ✅ Form is valid now - disable button and show spinner
    submitText.style.display = "none";
    submitSpinner.style.display = "block";
    submitButton.disabled = true;

    // 👇 Now allow normal submission (let browser send to server!)
    // But after server saves (when page reloads or redirect),
    // THEN show SweetAlert2 popup through Flash or Session message.

    // Here preventing manually because you want AJAX-like behavior
    event.preventDefault();

    try {
      // Send form data manually via Fetch (AJAX) to backend
      const formData = new FormData(form);

      const response = await fetch("/listings", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // 🎉 DATA SAVED SUCCESSFULLY

        submitText.style.display = "block";
        submitSpinner.style.display = "none";
        submitButton.disabled = false;

        Swal.fire({
          icon: "success",
          title: "Listing Created!",
          text: "Your beautiful place is now live 🚀",
          showConfirmButton: true,
          confirmButtonColor: "#198754",
          timer: 3000,
        }).then(() => {
          // Redirect after popup closes
          window.location.href = `/listings`;
          // Example if server sends newListingId back
        });

        form.reset();
        preview.style.display = "none";
        validateFormFields();
      } else {
        throw new Error("Server error, listing not created.");
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
        confirmButtonColor: "#dc3545",
      });

      submitText.style.display = "block";
      submitSpinner.style.display = "none";
      submitButton.disabled = false;
    }
  });
})();

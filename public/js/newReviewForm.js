(() => {
  const form = document.getElementById("reviewForm");
  if (!form) return;

  const rating = document.getElementById("rating");
  const comment = document.getElementById("comment");

  form.addEventListener("submit", (e) => {
    let isValid = true;

    if (
      rating.value === "" ||
      parseInt(rating.value) < 1 ||
      parseInt(rating.value) > 5
    ) {
      rating.setCustomValidity("Please select a rating between 1 to 5.");
      isValid = false;
    } else {
      rating.setCustomValidity("");
    }

    if (comment.value.trim().length < 10 || comment.value.trim().length > 300) {
      comment.setCustomValidity(
        "Comment must be between 10 to 300 characters."
      );
      isValid = false;
    } else {
      comment.setCustomValidity("");
    }

    if (!form.checkValidity() || !isValid) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    form.classList.add("was-validated");
  });
})();

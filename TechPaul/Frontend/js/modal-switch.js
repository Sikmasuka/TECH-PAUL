document.addEventListener("DOMContentLoaded", function () {
  // Ensure Bootstrap's modal functionality is properly handled
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");

  // Handle modal transitions
  loginModal.addEventListener("hidden.bs.modal", function () {
    if (registerModal.classList.contains("show")) {
      return; // Prevent unnecessary focus if register modal is already open
    }
    document.body.classList.remove("modal-open");
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
  });

  registerModal.addEventListener("hidden.bs.modal", function () {
    if (loginModal.classList.contains("show")) {
      return; // Prevent unnecessary focus if login modal is already open
    }
    document.body.classList.remove("modal-open");
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
  });
});

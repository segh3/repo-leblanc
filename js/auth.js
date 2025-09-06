document.addEventListener('DOMContentLoaded', () => {
  // Credenciales del administrador (directamente en JS para file://)
  const adminUser = {
    email: "cafeleblanc@gmail.com",
    password: "curry123"
  };

  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const generalError = document.getElementById('login-general-error');
      generalError.textContent = '';

      // Validar formulario con Bootstrap
      if (!loginForm.checkValidity()) {
        loginForm.classList.add('was-validated');
        return;
      }

      const emailInput = document.getElementById('login-email').value.trim();
      const passwordInput = document.getElementById('login-password').value.trim();

      if (
        emailInput === adminUser.email &&
        passwordInput === adminUser.password
      ) {
        alert('Sesión iniciada con éxito.');
        window.location.href = 'indexAdmin.html';
      } else {
        generalError.textContent = 'Credenciales incorrectas. Inténtalo de nuevo.';
      }
    });
  }
});

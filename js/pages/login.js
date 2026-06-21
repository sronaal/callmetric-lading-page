const LoginPage = {
  render() {
    return `
      <div class="login-page">
        <div class="login-card">
          <div class="login-logo">
            <i class="fas fa-phone-alt"></i>
            <h1>CallMetric Pro</h1>
            <p>Panel de Monitoreo — Demo</p>
          </div>
          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Correo electrónico</label>
              <input class="form-input" type="email" id="login-email" placeholder="admin@callmetric.io" value="admin@callmetric.io" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="login-password">Contraseña</label>
              <input class="form-input" type="password" id="login-password" value="demo123" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="login-role">Rol de acceso</label>
              <select class="form-select" id="login-role">
                <option value="super_admin">Super Admin</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin_tenant">Admin Tenant</option>
              </select>
            </div>
            <div id="login-error" style="color:var(--danger);font-size:0.8rem;margin-bottom:12px;display:none"></div>
            <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</button>
            <div style="margin-top:16px;padding:12px;background:var(--bg-tertiary);border-radius:var(--radius-sm);font-size:0.78rem;color:var(--text-muted);text-align:center">
              <i class="fas fa-info-circle"></i> Demo: cualquier email con @callmetric.io funciona.<br>
              Sugeridos: <strong>admin@callmetric.io</strong> (super_admin) · <strong>laura@nova.com</strong> (supervisor)
            </div>
          </form>
        </div>
      </div>
    `;
  },

  mount() {
    document.getElementById('login-form').onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const role = document.getElementById('login-role').value;
      const errorEl = document.getElementById('login-error');

      if (!email || !password) {
        errorEl.textContent = 'Todos los campos son obligatorios';
        errorEl.style.display = 'block';
        return;
      }

      const result = Auth.login(email, password, role);
      if (result.success) {
        Components.Toast('success', 'Inicio de sesión exitoso', `Bienvenido, ${result.user.nombre}`);
      } else {
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
      }
    };
  }
};

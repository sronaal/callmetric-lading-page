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
              <label class="form-label" for="login-email">Correo electronico</label>
              <input class="form-input" type="email" id="login-email" placeholder="admin@callmetric.io" value="admin@callmetric.io" required>
              <div class="form-error"></div>
            </div>
            <div class="form-group">
              <label class="form-label" for="login-password">Contrasena</label>
              <input class="form-input" type="password" id="login-password" value="demo123" required>
              <div class="form-error"></div>
            </div>
            <div class="form-group">
              <label class="form-label" for="login-role">Rol de acceso</label>
              <select class="form-select" id="login-role">
                <option value="1">Super Admin</option>
                <option value="3">Supervisor</option>
                <option value="2">Admin Empresa</option>
              </select>
            </div>
            <div id="login-error" style="color:var(--danger);font-size:0.8rem;margin-bottom:12px;display:none"></div>
            <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-sign-in-alt"></i> Iniciar Sesion</button>
            <div style="margin-top:16px;padding:12px;background:var(--bg-tertiary);border-radius:var(--radius-sm);font-size:0.78rem;color:var(--text-muted);text-align:center">
              <i class="fas fa-info-circle"></i> Demo: cualquier correo con @callmetric.io funciona.<br>
              Sugeridos: <strong>admin@callmetric.io</strong> (Super Admin) / <strong>laura@nova.com</strong> (Supervisor)
            </div>
          </form>
        </div>
      </div>
    `;
  },

  mount() {
    const form = document.getElementById('login-form');
    const errorEl = document.getElementById('login-error');
    
    Validation.clearOnInput(form);
    
    form.onsubmit = (e) => {
      e.preventDefault();
      Validation.clearErrors(form);
      errorEl.style.display = 'none';
      
      const result = Validation.validateForm({
        'login-email': [['required', 'Correo electronico'], ['email']],
        'login-password': [['required', 'Contrasena']]
      });
      
      if (!result.isValid) {
        Validation.showErrors(result.errors);
        return;
      }
      
      const roleId = parseInt(document.getElementById('login-role').value);
      const loginResult = Auth.login(result.values['login-email'], result.values['login-password'], roleId);
      if (loginResult.success) {
        Components.Toast('success', 'Inicio de sesion exitoso', 'Bienvenido, ' + loginResult.user.nombre);
      } else {
        errorEl.textContent = loginResult.error;
        errorEl.style.display = 'block';
      }
    };
  }
};

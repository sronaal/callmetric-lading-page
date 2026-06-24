const Auth = {
  _listeners: [],

  getState() {
    const stored = localStorage.getItem('callmetric-auth');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  },

  setState(state) {
    if (state) {
      localStorage.setItem('callmetric-auth', JSON.stringify(state));
    } else {
      localStorage.removeItem('callmetric-auth');
    }
    this._notify();
  },

  login(correo, password, rolId) {
    const user = DATA.usuarios.find(u => u.correo === correo && u.rol_id === rolId && u.activo);
    if (!user) return { success: false, error: 'Credenciales invalidas o rol incorrecto' };

    const rol = getRolName(user.rol_id);
    const hash = (rol === 'SUPERVISOR' || rol === 'OPERADOR') ? '#callcenter' : '#dashboard';
    window.location.hash = hash;

    const state = {
      token: 'mock-token-' + Date.now(),
      user: {
        id: user.id,
        correo: user.correo,
        nombres: user.nombres,
        apellidos: user.apellidos,
        nombre: user.nombres + ' ' + user.apellidos,
        rol_id: user.rol_id,
        rol: rol,
        empresa_id: user.empresa_id
      },
      isAuthenticated: true
    };
    this.setState(state);
    return { success: true, user: state.user };
  },

  logout() {
    this.setState(null);
    window.location.hash = '#login';
  },

  isAuthenticated() {
    const state = this.getState();
    return !!(state && state.isAuthenticated && state.token);
  },

  getUser() {
    const state = this.getState();
    return state ? state.user : null;
  },

  hasRole(...roles) {
    const user = this.getUser();
    return user && roles.includes(user.rol);
  },

  hasRoleId(...roleIds) {
    const user = this.getUser();
    return user && roleIds.includes(user.rol_id);
  },

  onChange(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  },

  _notify() {
    this._listeners.forEach(fn => fn(this.getState()));
  }
};

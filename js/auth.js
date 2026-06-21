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

  login(email, password, role) {
    const user = DATA.usuarios.find(u => u.email === email && u.rol === role);
    if (!user) return { success: false, error: 'Credenciales inválidas o rol incorrecto' };

    const state = {
      token: 'mock-token-' + Date.now(),
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
        empresaId: user.empresaId
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

  onChange(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  },

  _notify() {
    this._listeners.forEach(fn => fn(this.getState()));
  }
};

const App = {
  currentPage: null,
  charts: [],
  currentRole: null,

  init() {
    Auth.onChange((state) => {
      if (state && state.isAuthenticated) {
        this.currentRole = state.user.rol;
        this.fullRender();
      } else {
        this.renderLanding();
      }
    });

    window.addEventListener('hashchange', () => this.navigate());
    document.addEventListener('click', (e) => {
      const menuBtn = e.target.closest('#landing-menu-btn');
      if (menuBtn) {
        e.preventDefault();
        document.getElementById('landing-mobile-drawer')?.classList.toggle('open');
        return;
      }
      const navItem = e.target.closest('.nav-item');
      if (navItem) {
        const href = navItem.dataset.href;
        if (href) {
          e.preventDefault();
          window.location.hash = href;
          if (window.innerWidth <= 768) {
            document.querySelector('.sidebar')?.classList.remove('open');
          }
        }
      }
    });

    const state = Auth.getState();
    if (state && state.isAuthenticated) {
      this.currentRole = state.user.rol;
      this.fullRender();
    } else {
      this.renderLanding();
    }
  },

  fullRender() {
    this.renderShell();
    this.navigate();
  },

  renderLanding() {
    document.getElementById('app').innerHTML = LandingPage.render();
  },

  renderLogin() {
    document.getElementById('app').innerHTML = LoginPage.render();
    LoginPage.mount();
  },

  renderShell() {
    const user = Auth.getUser();
    const rol = user ? user.rol : 'SUPER_ADMIN';
    const isSuperAdmin = rol === 'SUPER_ADMIN';
    const isCC = /callcenter/.test(window.location.hash);
    const activeClass = isCC ? 'cc-active' : 'active';
    const hash = window.location.hash || '#dashboard';

    const navSections = this.buildNavSections(rol, hash, activeClass);

    const userName = user ? user.nombre : 'Usuario';
    const userInitials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const html = `
      <aside class="sidebar">
        <div class="sidebar-brand">
          <i class="fas fa-phone-alt"></i>
          <span>CallMetric Pro</span>
        </div>
        <nav class="sidebar-nav">${navSections}</nav>
      </aside>
      <div class="main-content">
        <header class="header">
          <div class="header-left">
            <button class="menu-toggle" id="menu-toggle"><i class="fas fa-bars"></i></button>
            <span class="header-title" id="page-title">Dashboard</span>
          </div>
          <div class="header-right">
            <div class="header-badge connected"><i class="fas fa-circle"></i><span>Conectado</span></div>
            <select class="role-selector" id="role-quick-switch">
              <option value="1" ${rol === 'SUPER_ADMIN' ? 'selected' : ''}>Super Admin</option>
              <option value="3" ${rol === 'SUPERVISOR' ? 'selected' : ''}>Supervisor</option>
              <option value="2" ${rol === 'ADMIN_EMPRESA' ? 'selected' : ''}>Admin</option>
            </select>
            <div class="user-avatar" title="${userName}">${userInitials}</div>
            <button class="btn-logout" id="logout-btn" title="Cerrar sesion"><i class="fas fa-sign-out-alt"></i></button>
          </div>
        </header>
        <main class="page-content" id="page-content"></main>
      </div>
    `;

    document.getElementById('app').innerHTML = html;

    document.getElementById('menu-toggle').onclick = () => {
      document.querySelector('.sidebar').classList.toggle('open');
    };

    document.getElementById('logout-btn').onclick = () => Auth.logout();

    const roleSwitch = document.getElementById('role-quick-switch');
    if (roleSwitch) {
      roleSwitch.onchange = () => {
        const newRoleId = parseInt(roleSwitch.value);
        const rolNames = { 1: 'SUPER_ADMIN', 2: 'ADMIN_EMPRESA', 3: 'SUPERVISOR', 4: 'OPERADOR' };
        const newRol = rolNames[newRoleId] || 'SUPER_ADMIN';
        const currentUser = Auth.getUser();
        if (currentUser) {
          const matchedUser = DATA.usuarios.find(u => u.rol_id === newRoleId);
          const state = Auth.getState();
          state.user.rol_id = newRoleId;
          state.user.rol = newRol;
          state.user.empresa_id = matchedUser ? matchedUser.empresa_id : null;
          state.user.nombres = matchedUser ? matchedUser.nombres : currentUser.nombres;
          state.user.apellidos = matchedUser ? matchedUser.apellidos : currentUser.apellidos;
          state.user.nombre = matchedUser ? matchedUser.nombres + ' ' + matchedUser.apellidos : currentUser.nombre;
          state.user.correo = matchedUser ? matchedUser.correo : currentUser.correo;
          Auth.setState(state);
          this.currentRole = newRol;
          Components.Toast('info', 'Rol cambiado', 'Ahora eres: ' + newRol);
          this.fullRender();
        }
      };
    }

    this.rebuildTitle();
  },

  buildNavSections(rol, currentHash, activeClass) {
    const isActive = (href) => {
      if (href === '#dashboard') return currentHash === '' || currentHash === '#' || currentHash === '#dashboard';
      return currentHash.startsWith(href);
    };

    const superAdminSections = [
      { title: 'General', items: [
        { label: 'Dashboard', icon: 'chart-pie', href: '#dashboard' }
      ]},
      { title: 'Infraestructura', items: [
        { label: 'Servidores PBX', icon: 'server', href: '#pbx' },
        { label: 'Agentes', icon: 'robot', href: '#agents' }
      ]},
      { title: 'Administracion', items: [
        { label: 'Usuarios', icon: 'users', href: '#users' },
        { label: 'Empresas', icon: 'building', href: '#empresas' }
      ]}
    ];

    const supervisorSections = [
      { title: 'Call Center', items: [
        { label: 'Dashboard CC', icon: 'headset', href: '#callcenter/dashboard' },
        { label: 'Colas', icon: 'layer-group', href: '#callcenter/queues' },
        { label: 'Agentes CC', icon: 'user-tie', href: '#callcenter/agents' },
        { label: 'CDR', icon: 'phone-alt', href: '#callcenter/cdr' }
      ]}
    ];

    const sections = (rol === 'SUPER_ADMIN' || rol === 'ADMIN_EMPRESA') ? superAdminSections : supervisorSections;

    return sections.map(sec => `
      <div class="nav-section">
        <div class="nav-section-title">${sec.title}</div>
        ${sec.items.map(item => {
          const active = isActive(item.href);
          const cc = item.href.startsWith('#callcenter') ? 'cc-active' : '';
          return `<div class="nav-item ${active ? activeClass + ' ' + cc : ''}" data-href="${item.href}"><i class="fas fa-${item.icon}"></i> ${item.label}</div>`;
        }).join('')}
      </div>
    `).join('');
  },

  navigate() {
    const hash = window.location.hash || '#';
    const main = document.getElementById('page-content');

    if (!Auth.isAuthenticated()) {
      const page = hash.split('?')[0];
      if (page === '#login') { this.renderLogin(); return; }
      if (page === '' || page === '#') { this.renderLanding(); return; }
      this.renderLanding();
      return;
    }

    if (!main) { this.fullRender(); return; }

    const page = hash.split('?')[0];

    this.destroyCharts();

    switch (page) {
      case '#dashboard':
        DashboardPage.render(main);
        break;
      case '#pbx':
        PbxPage.render(main);
        break;
      case '#agents':
        AgentsPage.render(main);
        break;
      case '#users':
        UsersPage.render(main);
        break;
      case '#empresas':
        EmpresasPage.render(main);
        break;
      case '#callcenter/dashboard':
        CCDashboardPage.render(main);
        break;
      case '#callcenter/queues':
        CCQueuesPage.render(main);
        break;
      case '#callcenter/agents':
        CCAgentsPage.render(main);
        break;
      case '#callcenter/cdr':
        CCCdrPage.render(main);
        break;
      default:
        if (page.startsWith('#pbx/')) {
          const pbxId = parseInt(page.replace('#pbx/', ''));
          PbxPage.renderDetail(main, pbxId);
        } else if (page.startsWith('#agents/')) {
          const agentId = parseInt(page.replace('#agents/', ''));
          AgentsPage.renderDetail(main, agentId);
        } else {
          main.innerHTML = App.render404();
        }
    }

    this.rebuildTitle();
    this.updateActiveNav();
  },

  rebuildTitle() {
    const map = {
      '#dashboard': 'Dashboard',
      '#pbx': 'Servidores PBX',
      '#agents': 'Agentes de Monitoreo',
      '#users': 'Gestion de Usuarios',
      '#empresas': 'Empresas',
      '#callcenter/dashboard': 'Dashboard Call Center',
      '#callcenter/queues': 'Colas de Call Center',
      '#callcenter/agents': 'Agentes de Call Center',
      '#callcenter/cdr': 'CDR - Registro de Llamadas'
    };
    const hash = window.location.hash || '#dashboard';
    const el = document.getElementById('page-title');
    if (el) el.textContent = map[hash] || 'CallMetric Pro';
  },

  updateActiveNav() {
    const hash = window.location.hash || '#dashboard';
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.dataset.href;
      item.classList.remove('active', 'cc-active');
      if (href === '#dashboard') {
        if (hash === '' || hash === '#' || hash === '#dashboard') item.classList.add('active');
      } else if (href && hash.startsWith(href)) {
        item.classList.add('active');
      }
    });
  },

  render404() {
    const isAuth = Auth.isAuthenticated();
    return `
      <div class="error-404-page">
        <div class="error-404-code">404</div>
        <div class="error-404-icon"><i class="fas fa-map-signs"></i></div>
        <h2 class="error-404-title">Pagina no encontrada</h2>
        <p class="error-404-text">La pagina solicitada no existe o ha sido movida.</p>
        <a class="btn btn-primary" href="${isAuth ? '#dashboard' : '#'}"><i class="fas fa-home"></i> Volver al inicio</a>
      </div>
    `;
  },

  destroyCharts() {
    this.charts.forEach(c => { try { c.destroy(); } catch {} });
    this.charts = [];
  },

  addChart(chart) {
    if (chart) this.charts.push(chart);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());

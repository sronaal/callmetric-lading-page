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
    const rol = user ? user.rol : 'super_admin';
    const isSuperAdmin = rol === 'super_admin';
    const isSupervisor = rol === 'supervisor';
    const isAdmin = isSuperAdmin || rol === 'admin_tenant';
    const isCC = /callcenter/.test(window.location.hash);

    const accent = isCC ? 'violet' : 'cyan';
    const activeClass = isCC ? 'cc-active' : 'active';
    const hash = window.location.hash || '#dashboard';

    const navSections = this.buildNavSections(rol, hash, activeClass);

    const userName = user ? user.nombre : 'Usuario';
    const userInitials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const empresa = user ? getEmpresaName(user.empresaId) : '';

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
              <option value="super_admin" ${rol === 'super_admin' ? 'selected' : ''}>Super Admin</option>
              <option value="supervisor" ${rol === 'supervisor' ? 'selected' : ''}>Supervisor</option>
              <option value="admin_tenant" ${rol === 'admin_tenant' ? 'selected' : ''}>Admin</option>
            </select>
            <div class="user-avatar" title="${userName}">${userInitials}</div>
            <button class="btn-logout" id="logout-btn" title="Cerrar sesión"><i class="fas fa-sign-out-alt"></i></button>
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
        const newRole = roleSwitch.value;
        const currentUser = Auth.getUser();
        if (currentUser) {
          const state = Auth.getState();
          state.user.rol = newRole;
          Auth.setState(state);
          this.currentRole = newRole;
          Components.Toast('info', 'Rol cambiado', `Ahora eres: ${Utils.statusLabel(newRole)}`);
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
      { title: 'Administración', items: [
        { label: 'Usuarios', icon: 'users', href: '#users' },
        { label: 'Empresas', icon: 'building', href: '#empresas' }
      ]},
      { title: 'Call Center', items: [
        { label: 'Dashboard', icon: 'headset', href: '#callcenter' },
        { label: 'Colas', icon: 'layer-group', href: '#callcenter/queues' },
        { label: 'Agentes CC', icon: 'user-tie', href: '#callcenter/agents' },
        { label: 'Reportes CDR', icon: 'file-alt', href: '#callcenter/cdr' }
      ]}
    ];

    const supervisorSections = [
      { title: 'Call Center', items: [
        { label: 'Dashboard', icon: 'headset', href: '#callcenter' },
        { label: 'Colas', icon: 'layer-group', href: '#callcenter/queues' },
        { label: 'Agentes CC', icon: 'user-tie', href: '#callcenter/agents' },
        { label: 'Reportes CDR', icon: 'file-alt', href: '#callcenter/cdr' }
      ]}
    ];

    const sections = (rol === 'super_admin' || rol === 'admin_tenant') ? superAdminSections : supervisorSections;

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
      case '#callcenter':
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
          const pbxId = page.replace('#pbx/', '');
          PbxPage.renderDetail(main, pbxId);
        } else if (page.startsWith('#agents/')) {
          const agentId = page.replace('#agents/', '');
          AgentsPage.renderDetail(main, agentId);
        } else {
          main.innerHTML = '<div class="empty-state"><i class="fas fa-map-signs"></i><h3>Página no encontrada</h3><p>La página solicitada no existe.</p></div>';
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
      '#users': 'Gestión de Usuarios',
      '#empresas': 'Empresas',
      '#callcenter': 'Call Center — Dashboard',
      '#callcenter/queues': 'Call Center — Colas',
      '#callcenter/agents': 'Call Center — Agentes',
      '#callcenter/cdr': 'Call Center — Reportes CDR'
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
      if (hash.startsWith('#callcenter')) {
        if (href && hash.startsWith(href)) {
          item.classList.add('cc-active');
        }
      } else if (href === '#dashboard') {
        if (hash === '' || hash === '#' || hash === '#dashboard') item.classList.add('active');
      } else if (href && hash.startsWith(href)) {
        item.classList.add('active');
      }
    });

    const sidebar = document.querySelector('.sidebar');
    if (hash.startsWith('#callcenter')) {
      sidebar?.classList.add('cc-mode');
    } else {
      sidebar?.classList.remove('cc-mode');
    }
  },

  redirectToDefault() {
    const user = Auth.getUser();
    if (user && (user.rol === 'supervisor' || user.rol === 'operador')) {
      window.location.hash = '#callcenter';
    } else {
      window.location.hash = '#dashboard';
    }
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

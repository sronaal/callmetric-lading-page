const UsersPage = {
  currentPage: 1,
  searchQuery: '',

  render(container) {
    if (!Auth.hasRole('super_admin', 'admin_tenant')) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-lock"></i><h3>Acceso restringido</h3><p>Solo administradores pueden gestionar usuarios.</p></div>';
      return;
    }

    const filtered = Utils.filterData(DATA.usuarios, { nombre: this.searchQuery });
    const sorted = Utils.sortData(filtered, 'nombre', 'asc');
    const paged = Components.paginate(sorted, this.currentPage);

    const rows = paged.items.map(u => ({
      _id: u.id,
      nombre: u.nombre,
      email: u.email,
      rol: `<span class="status-badge ${u.rol}">${Utils.statusLabel(u.rol)}</span>`,
      empresa: getEmpresaName(u.empresaId),
      activo: u.activo ? '<span style="color:var(--success)"><i class="fas fa-check-circle"></i> Activo</span>' : '<span style="color:var(--text-muted)"><i class="fas fa-minus-circle"></i> Inactivo</span>',
      acceso: u.ultimoAcceso ? Utils.formatDate(u.ultimoAcceso, { relative: true }) : '—',
      acciones: `
        <button class="btn btn-ghost btn-sm edit-user" data-id="${u.id}"><i class="fas fa-edit"></i></button>
        <button class="btn btn-ghost btn-sm delete-user" data-id="${u.id}" style="color:var(--danger)"><i class="fas fa-user-slash"></i></button>
      `
    }));

    const html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
        <div class="table-search">
          <i class="fas fa-search"></i>
          <input type="text" id="user-search" placeholder="Buscar usuario..." value="${this.searchQuery}">
        </div>
        <button class="btn btn-primary" id="add-user-btn"><i class="fas fa-plus"></i> Nuevo Usuario</button>
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          ${Components.DataTable({
            headers: [
              { key: 'nombre', label: 'Nombre' },
              { key: 'email', label: 'Email' },
              { key: 'rol', label: 'Rol' },
              { key: 'empresa', label: 'Empresa' },
              { key: 'activo', label: 'Estado' },
              { key: 'acceso', label: 'Último Acceso' },
              { key: 'acciones', label: 'Acciones' }
            ],
            rows,
            emptyMessage: 'No hay usuarios registrados'
          })}
        </div>
      </div>
      <div id="user-pagination" style="display:flex;justify-content:flex-end;margin-top:12px">
        ${Components.renderPagination(filtered.length, this.currentPage, paged.pages)}
      </div>
    `;

    container.innerHTML = html;
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('user-search')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.currentPage = 1;
      this.render(document.getElementById('page-content'));
    });

    document.getElementById('add-user-btn')?.addEventListener('click', () => this.showAddModal());

    document.querySelectorAll('.edit-user').forEach(btn => {
      btn.onclick = () => this.showEditModal(btn.dataset.id);
    });

    document.querySelectorAll('.delete-user').forEach(btn => {
      btn.onclick = () => this.showDeleteConfirm(btn.dataset.id);
    });

    document.querySelector('.page-prev')?.addEventListener('click', () => {
      if (this.currentPage > 1) { this.currentPage--; this.render(document.getElementById('page-content')); }
    });

    document.querySelector('.page-next')?.addEventListener('click', () => {
      const filtered = Utils.filterData(DATA.usuarios, { nombre: this.searchQuery });
      const p = Components.paginate(filtered, this.currentPage);
      if (this.currentPage < p.pages) { this.currentPage++; this.render(document.getElementById('page-content')); }
    });
  },

  showAddModal() {
    const isSuper = Auth.hasRole('super_admin');
    const empresas = DATA.empresas.filter(e => e.activo);

    const body = `
      <form id="user-form">
        <div class="form-group"><label class="form-label">Nombre <span style="color:var(--danger)">*</span></label><input class="form-input" id="f-nombre" placeholder="Nombre completo"></div>
        <div class="form-group"><label class="form-label">Email <span style="color:var(--danger)">*</span></label><input class="form-input" type="email" id="f-email" placeholder="email@ejemplo.com"></div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group"><label class="form-label">Contraseña <span style="color:var(--danger)">*</span></label><input class="form-input" type="password" id="f-password" value="changeme123"></div>
          <div class="form-group"><label class="form-label">Rol <span style="color:var(--danger)">*</span></label>
            <select class="form-select" id="f-rol">
              <option value="admin_tenant">Admin Tenant</option>
              <option value="supervisor">Supervisor</option>
              <option value="operador">Operador</option>
            </select>
          </div>
        </div>
        ${isSuper ? `<div class="form-group"><label class="form-label">Empresa <span style="color:var(--danger)">*</span></label><select class="form-select" id="f-empresa">${empresas.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}</select></div>` : ''}
      </form>
    `;

    Components.Modal('Nuevo Usuario', body, {
      confirmText: 'Crear Usuario',
      onConfirm: () => {
        const nombre = document.getElementById('f-nombre').value.trim();
        const email = document.getElementById('f-email').value.trim();
        if (!nombre || !email) { Components.Toast('warning', 'Validación', 'Nombre y email son obligatorios'); return; }

        const newUser = {
          id: 'usr-' + String(DATA.usuarios.length + 1).padStart(3, '0'),
          empresaId: isSuper ? document.getElementById('f-empresa').value : Auth.getUser().empresaId,
          nombre,
          email,
          rol: document.getElementById('f-rol').value,
          activo: true,
          ultimoAcceso: null
        };
        DATA.usuarios.push(newUser);
        Components.Toast('success', 'Usuario Creado', `"${nombre}" ha sido creado`);
        this.render(document.getElementById('page-content'));
      }
    });
  },

  showEditModal(id) {
    const user = getById('usuarios', id);
    if (!user) return;
    const isSuper = Auth.hasRole('super_admin');

    const body = `
      <form id="user-edit-form">
        <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" id="f-nombre" value="${user.nombre}"></div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="f-email" value="${user.email}"></div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group"><label class="form-label">Rol</label><select class="form-select" id="f-rol">
            <option value="admin_tenant" ${user.rol === 'admin_tenant' ? 'selected' : ''}>Admin Tenant</option>
            <option value="supervisor" ${user.rol === 'supervisor' ? 'selected' : ''}>Supervisor</option>
            <option value="operador" ${user.rol === 'operador' ? 'selected' : ''}>Operador</option>
            ${isSuper ? `<option value="super_admin" ${user.rol === 'super_admin' ? 'selected' : ''}>Super Admin</option>` : ''}
          </select></div>
          <div class="form-group"><label class="form-label">Estado</label><select class="form-select" id="f-activo">
            <option value="true" ${user.activo ? 'selected' : ''}>Activo</option>
            <option value="false" ${!user.activo ? 'selected' : ''}>Inactivo</option>
          </select></div>
        </div>
      </form>
    `;

    Components.Modal('Editar Usuario', body, {
      confirmText: 'Guardar Cambios',
      onConfirm: () => {
        user.nombre = document.getElementById('f-nombre').value;
        user.email = document.getElementById('f-email').value;
        user.rol = document.getElementById('f-rol').value;
        user.activo = document.getElementById('f-activo').value === 'true';
        Components.Toast('success', 'Usuario Actualizado', `"${user.nombre}" ha sido actualizado`);
        this.render(document.getElementById('page-content'));
      }
    });
  },

  showDeleteConfirm(id) {
    const user = getById('usuarios', id);
    if (!user) return;

    Components.Modal('Desactivar Usuario',
      `<p style="margin-bottom:8px">¿Estás seguro de desactivar a <strong>${user.nombre}</strong>?</p><p style="font-size:0.8rem;color:var(--text-muted)">El usuario no podrá iniciar sesión hasta que sea reactivado.</p>`,
      {
        confirmText: 'Desactivar',
        onConfirm: () => {
          user.activo = false;
          Components.Toast('success', 'Usuario Desactivado', `"${user.nombre}" ha sido desactivado`);
          this.render(document.getElementById('page-content'));
        }
      }
    );
  }
};

const UsersPage = {
  currentPage: 1,
  searchQuery: '',

  render(container) {
    if (!Auth.hasRole('SUPER_ADMIN', 'ADMIN_EMPRESA')) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-lock"></i><h3>Acceso restringido</h3><p>Solo administradores pueden gestionar usuarios.</p></div>';
      return;
    }

    const filtered = Utils.filterData(DATA.usuarios, { nombres: this.searchQuery, correo: this.searchQuery });
    const sorted = Utils.sortData(filtered, 'nombres', 'asc');
    const paged = Components.paginate(sorted, this.currentPage);

    const rows = paged.items.map(u => {
      const rol = getRolName(u.rol_id);
      return {
        _id: u.id,
        nombres: u.nombres + ' ' + (u.apellidos || ''),
        correo: u.correo,
        rol: `<span class="status-badge">${rol}</span>`,
        empresa: u.empresa_id ? getEmpresaName(u.empresa_id) : '—',
        activo: u.activo ? '<span style="color:var(--success)"><i class="fas fa-check-circle"></i> Activo</span>' : '<span style="color:var(--text-muted)"><i class="fas fa-minus-circle"></i> Inactivo</span>',
        acceso: u.ultimo_login ? Utils.formatDate(u.ultimo_login, { relative: true }) : '—',
        acciones: `
          <button class="btn btn-ghost btn-sm edit-user" data-id="${u.id}"><i class="fas fa-edit"></i></button>
          <button class="btn btn-ghost btn-sm delete-user" data-id="${u.id}" style="color:var(--danger)"><i class="fas fa-user-slash"></i></button>
        `
      };
    });

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
              { key: 'nombres', label: 'Nombre' },
              { key: 'correo', label: 'Correo' },
              { key: 'rol', label: 'Rol' },
              { key: 'empresa', label: 'Empresa' },
              { key: 'activo', label: 'Estado' },
              { key: 'acceso', label: 'Ultimo Acceso' },
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
      const filtered = Utils.filterData(DATA.usuarios, { nombres: this.searchQuery, correo: this.searchQuery });
      const p = Components.paginate(filtered, this.currentPage);
      if (this.currentPage < p.pages) { this.currentPage++; this.render(document.getElementById('page-content')); }
    });
  },

  showAddModal() {
    const isSuper = Auth.hasRole('SUPER_ADMIN');
    const empresas = DATA.empresas.filter(e => e.estado === 'Activa');

    const body = `
      <form id="user-form">
        <div class="form-group">
          <label class="form-label">Nombres <span style="color:var(--danger)">*</span></label>
          <input class="form-input" id="f-nombres" placeholder="Nombres completos">
          <div class="form-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Apellidos <span style="color:var(--danger)">*</span></label>
          <input class="form-input" id="f-apellidos" placeholder="Apellidos completos">
          <div class="form-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Correo <span style="color:var(--danger)">*</span></label>
          <input class="form-input" type="email" id="f-correo" placeholder="correo@ejemplo.com">
          <div class="form-error"></div>
        </div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Contrasena <span style="color:var(--danger)">*</span></label>
            <input class="form-input" type="password" id="f-password" value="changeme123">
            <div class="form-error"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Rol <span style="color:var(--danger)">*</span></label>
            <select class="form-select" id="f-rol">
              <option value="2">Admin Empresa</option>
              <option value="3">Supervisor</option>
              <option value="4">Operador</option>
            </select>
          </div>
        </div>
        ${isSuper ? `<div class="form-group"><label class="form-label">Empresa <span style="color:var(--danger)">*</span></label><select class="form-select" id="f-empresa">${empresas.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}</select></div>` : ''}
      </form>
    `;

    Components.Modal('Nuevo Usuario', body, {
      confirmText: 'Crear Usuario',
      onConfirm: () => {
        const form = document.getElementById('user-form');
        Validation.clearErrors(form);
        const rules = {
          'f-nombres': [['required', 'Nombres'], ['minLength', 2, 'Nombres'], ['maxLength', 100, 'Nombres']],
          'f-apellidos': [['required', 'Apellidos'], ['minLength', 2, 'Apellidos'], ['maxLength', 100, 'Apellidos']],
          'f-correo': [['required', 'Correo'], ['email'], ['unique', 'usuarios', 'correo', 'Correo']],
          'f-password': [['required', 'Contrasena'], ['minLength', 6, 'Contrasena']]
        };
        const result = Validation.validateForm(rules);
        if (!result.isValid) {
          Validation.showErrors(result.errors);
          return;
        }
        const newUser = {
          id: generateId('usuarios'),
          empresa_id: isSuper ? parseInt(document.getElementById('f-empresa').value) : Auth.getUser().empresa_id,
          rol_id: parseInt(document.getElementById('f-rol').value),
          nombres: result.values['f-nombres'],
          apellidos: result.values['f-apellidos'],
          correo: result.values['f-correo'],
          password_hash: '***',
          activo: true,
          ultimo_login: null,
          created_at: new Date().toISOString()
        };
        DATA.usuarios.push(newUser);
        Components.Toast('success', 'Usuario Creado', newUser.nombres + ' ha sido creado');
        this.render(document.getElementById('page-content'));
      }
    });
    Validation.clearOnInput(document.getElementById('user-form'));
  },

  showEditModal(id) {
    const user = getById('usuarios', id);
    if (!user) return;

    const body = `
      <form id="user-edit-form">
        <div class="form-group">
          <label class="form-label">Nombres <span style="color:var(--danger)">*</span></label>
          <input class="form-input" id="f-nombres" value="${user.nombres}">
          <div class="form-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Apellidos <span style="color:var(--danger)">*</span></label>
          <input class="form-input" id="f-apellidos" value="${user.apellidos || ''}">
          <div class="form-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Correo <span style="color:var(--danger)">*</span></label>
          <input class="form-input" type="email" id="f-correo" value="${user.correo}">
          <div class="form-error"></div>
        </div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Rol</label>
            <select class="form-select" id="f-rol">
              <option value="1" ${user.rol_id === 1 ? 'selected' : ''}>Super Admin</option>
              <option value="2" ${user.rol_id === 2 ? 'selected' : ''}>Admin Empresa</option>
              <option value="3" ${user.rol_id === 3 ? 'selected' : ''}>Supervisor</option>
              <option value="4" ${user.rol_id === 4 ? 'selected' : ''}>Operador</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Estado</label>
            <select class="form-select" id="f-activo">
              <option value="true" ${user.activo ? 'selected' : ''}>Activo</option>
              <option value="false" ${!user.activo ? 'selected' : ''}>Inactivo</option>
            </select>
          </div>
        </div>
      </form>
    `;

    Components.Modal('Editar Usuario', body, {
      confirmText: 'Guardar Cambios',
      onConfirm: () => {
        const form = document.getElementById('user-edit-form');
        Validation.clearErrors(form);
        const result = Validation.validateForm({
          'f-nombres': [['required', 'Nombres'], ['minLength', 2, 'Nombres'], ['maxLength', 100, 'Nombres']],
          'f-apellidos': [['required', 'Apellidos'], ['minLength', 2, 'Apellidos'], ['maxLength', 100, 'Apellidos']],
          'f-correo': [['required', 'Correo'], ['email']]
        });
        if (!result.isValid) {
          Validation.showErrors(result.errors);
          return;
        }
        user.nombres = result.values['f-nombres'];
        user.apellidos = result.values['f-apellidos'];
        user.correo = result.values['f-correo'];
        user.rol_id = parseInt(document.getElementById('f-rol').value);
        user.activo = document.getElementById('f-activo').value === 'true';
        Components.Toast('success', 'Usuario Actualizado', user.nombres + ' ha sido actualizado');
        this.render(document.getElementById('page-content'));
      }
    });
    Validation.clearOnInput(document.getElementById('user-edit-form'));
  },

  showDeleteConfirm(id) {
    const user = getById('usuarios', id);
    if (!user) return;

    Components.Modal('Desactivar Usuario',
      `<p style="margin-bottom:8px">Estas seguro de desactivar a <strong>${user.nombres} ${user.apellidos || ''}</strong>?</p>
      <p style="font-size:0.8rem;color:var(--text-muted)">El usuario no podra iniciar sesion hasta que sea reactivado.</p>`,
      {
        confirmText: 'Desactivar',
        onConfirm: () => {
          user.activo = false;
          Components.Toast('success', 'Usuario Desactivado', user.nombres + ' ha sido desactivado');
          this.render(document.getElementById('page-content'));
        }
      }
    );
  }
};

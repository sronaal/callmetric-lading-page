const EmpresasPage = {
  currentPage: 1,
  searchQuery: '',

  render(container) {
    if (!Auth.hasRole('SUPER_ADMIN')) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-lock"></i><h3>Acceso restringido</h3><p>Solo Super Admin puede gestionar empresas.</p></div>';
      return;
    }

    var filtered = Utils.filterData(DATA.empresas, { nombre: this.searchQuery });
    var sorted = Utils.sortData(filtered, 'nombre', 'asc');
    var paged = Components.paginate(sorted, this.currentPage);

    var rows = paged.items.map(function(e) {
      var usuarioCount = DATA.usuarios.filter(function(u) { return u.empresa_id === e.id; }).length;
      var pbxCount = DATA.pbxServers.filter(function(p) { return p.empresa_id === e.id; }).length;
      return {
        _id: e.id,
        nit: e.nit,
        nombre: e.nombre,
        correo: e.correo,
        telefono: e.telefono || '—',
        plan: '<span class="status-badge" style="background:rgba(6,182,212,0.15);color:var(--accent-cyan)">' + e.plan + '</span>',
        estado: e.estado === 'Activa' ? '<span style="color:var(--success)"><i class="fas fa-check-circle"></i> Activa</span>' : '<span style="color:var(--text-muted)"><i class="fas fa-minus-circle"></i> Inactiva</span>',
        usuarios: usuarioCount,
        pbxs: pbxCount,
        acciones: '<button class="btn btn-ghost btn-sm edit-empresa" data-id="' + e.id + '"><i class="fas fa-edit"></i></button> <button class="btn btn-ghost btn-sm delete-empresa" data-id="' + e.id + '" style="color:var(--danger)"><i class="fas fa-trash"></i></button>'
      };
    });

    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">' +
      '<div class="table-search"><i class="fas fa-search"></i><input type="text" id="empresa-search" placeholder="Buscar empresa..." value="' + this.searchQuery + '"></div>' +
      '<button class="btn btn-primary" id="add-empresa-btn"><i class="fas fa-plus"></i> Nueva Empresa</button></div>' +
      '<div class="card"><div class="card-body" style="padding:0">' +
      Components.DataTable({
        headers: [
          { key: 'nit', label: 'NIT' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'correo', label: 'Correo' },
          { key: 'telefono', label: 'Telefono' },
          { key: 'plan', label: 'Plan' },
          { key: 'estado', label: 'Estado' },
          { key: 'usuarios', label: 'Usuarios' },
          { key: 'pbxs', label: 'PBXs' },
          { key: 'acciones', label: 'Acciones' }
        ],
        rows: rows,
        emptyMessage: 'No hay empresas registradas'
      }) +
      '</div></div>' +
      '<div id="empresa-pagination" style="display:flex;justify-content:flex-end;margin-top:12px">' +
      Components.renderPagination(filtered.length, this.currentPage, paged.pages) + '</div>';

    container.innerHTML = html;
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('empresa-search')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.currentPage = 1;
      this.render(document.getElementById('page-content'));
    });

    document.getElementById('add-empresa-btn')?.addEventListener('click', () => this.showAddModal());

    document.querySelectorAll('.edit-empresa').forEach(btn => {
      btn.onclick = () => this.showEditModal(btn.dataset.id);
    });

    document.querySelectorAll('.delete-empresa').forEach(btn => {
      btn.onclick = () => this.showDeleteConfirm(btn.dataset.id);
    });

    document.querySelector('.page-prev')?.addEventListener('click', () => {
      if (this.currentPage > 1) { this.currentPage--; this.render(document.getElementById('page-content')); }
    });

    document.querySelector('.page-next')?.addEventListener('click', () => {
      const filtered = Utils.filterData(DATA.empresas, { nombre: this.searchQuery });
      const p = Components.paginate(filtered, this.currentPage);
      if (this.currentPage < p.pages) { this.currentPage++; this.render(document.getElementById('page-content')); }
    });
  },

  showAddModal() {
    const body = `
      <form id="empresa-form">
        <div class="form-group">
          <label class="form-label">NIT <span style="color:var(--danger)">*</span></label>
          <input class="form-input" id="f-nit" placeholder="900123456-7">
          <div class="form-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Nombre <span style="color:var(--danger)">*</span></label>
          <input class="form-input" id="f-nombre" placeholder="Nombre de la empresa">
          <div class="form-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Correo <span style="color:var(--danger)">*</span></label>
          <input class="form-input" type="email" id="f-correo" placeholder="empresa@ejemplo.com">
          <div class="form-error"></div>
        </div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input class="form-input" id="f-telefono" placeholder="3001234567">
            <div class="form-error"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Plan</label>
            <select class="form-select" id="f-plan">
              <option value="Basic">Basic</option>
              <option value="Professional" selected>Professional</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      </form>
    `;

    Components.Modal('Nueva Empresa', body, {
      confirmText: 'Crear Empresa',
      onConfirm: () => {
        const form = document.getElementById('empresa-form');
        Validation.clearErrors(form);
        const result = Validation.validateForm({
          'f-nit': [['required', 'NIT'], ['unique', 'empresas', 'nit', 'NIT']],
          'f-nombre': [['required', 'Nombre'], ['minLength', 2, 'Nombre'], ['maxLength', 100, 'Nombre']],
          'f-correo': [['required', 'Correo'], ['email'], ['unique', 'empresas', 'correo', 'Correo']],
          'f-telefono': [['phone']]
        });
        if (!result.isValid) {
          Validation.showErrors(result.errors);
          return;
        }
        const newEmpresa = {
          id: String(DATA.empresas.length + 1),
          nit: result.values['f-nit'],
          nombre: result.values['f-nombre'],
          correo: result.values['f-correo'],
          telefono: result.values['f-telefono'],
          plan: document.getElementById('f-plan').value,
          estado: 'Activa',
          created_at: new Date().toISOString()
        };
        DATA.empresas.push(newEmpresa);
        Components.Toast('success', 'Empresa Creada', newEmpresa.nombre + ' ha sido creada');
        Components.closeModal();
        this.render(document.getElementById('page-content'));
      }
    });
    Validation.clearOnInput(document.getElementById('empresa-form'));
  },

  showEditModal(id) {
    const empresa = getById('empresas', id);
    if (!empresa) return;

    const body = `
      <form id="empresa-edit-form">
        <div class="form-group">
          <label class="form-label">NIT</label>
          <input class="form-input" id="f-nit" value="${empresa.nit}" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Nombre <span style="color:var(--danger)">*</span></label>
          <input class="form-input" id="f-nombre" value="${empresa.nombre}">
          <div class="form-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Correo <span style="color:var(--danger)">*</span></label>
          <input class="form-input" type="email" id="f-correo" value="${empresa.correo}">
          <div class="form-error"></div>
        </div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input class="form-input" id="f-telefono" value="${empresa.telefono || ''}">
            <div class="form-error"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Plan</label>
            <select class="form-select" id="f-plan">
              <option value="Basic" ${empresa.plan === 'Basic' ? 'selected' : ''}>Basic</option>
              <option value="Professional" ${empresa.plan === 'Professional' ? 'selected' : ''}>Professional</option>
              <option value="Enterprise" ${empresa.plan === 'Enterprise' ? 'selected' : ''}>Enterprise</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Estado</label>
          <select class="form-select" id="f-estado">
            <option value="Activa" ${empresa.estado === 'Activa' ? 'selected' : ''}>Activa</option>
            <option value="Inactiva" ${empresa.estado === 'Inactiva' ? 'selected' : ''}>Inactiva</option>
          </select>
        </div>
      </form>
    `;

    Components.Modal('Editar Empresa', body, {
      confirmText: 'Guardar Cambios',
      onConfirm: () => {
        const form = document.getElementById('empresa-edit-form');
        Validation.clearErrors(form);
        const result = Validation.validateForm({
          'f-nombre': [['required', 'Nombre'], ['minLength', 2, 'Nombre'], ['maxLength', 100, 'Nombre']],
          'f-correo': [['required', 'Correo'], ['email']]
        });
        if (!result.isValid) {
          Validation.showErrors(result.errors);
          return;
        }
        empresa.nombre = result.values['f-nombre'];
        empresa.correo = result.values['f-correo'];
        empresa.telefono = result.values['f-telefono'];
        empresa.plan = document.getElementById('f-plan').value;
        empresa.estado = document.getElementById('f-estado').value;
        Components.Toast('success', 'Empresa Actualizada', empresa.nombre + ' ha sido actualizada');
        Components.closeModal();
        this.render(document.getElementById('page-content'));
      }
    });
    Validation.clearOnInput(document.getElementById('empresa-edit-form'));
  },

  showDeleteConfirm(id) {
    var empresa = getById('empresas', id);
    if (!empresa) return;

    Components.Modal('Eliminar Empresa',
      '<p style="margin-bottom:8px">Estas seguro de eliminar <strong>' + empresa.nombre + '</strong>?</p>' +
      '<p style="font-size:0.8rem;color:var(--text-muted)">Se eliminaran tambien los usuarios, PBXs y agentes asociados. Esta accion no se puede deshacer.</p>',
      {
        confirmText: 'Eliminar',
        onConfirm: function() {
          DATA.usuarios = DATA.usuarios.filter(function(u) { return u.empresa_id !== id; });
          DATA.pbxServers = DATA.pbxServers.filter(function(p) { return p.empresa_id !== id; });
          DATA.agentesMonitoreo = DATA.agentesMonitoreo.filter(function(a) {
            var pbx = DATA.pbxServers.find(function(p) { return p.id === a.pbx_id; });
            return pbx && pbx.empresa_id !== id;
          });
          DATA.llamadas = DATA.llamadas.filter(function(l) { return l.empresa_id !== id; });
          DATA.alertas = DATA.alertas.filter(function(a) { return a.empresa_id !== id; });
          DATA.empresas = DATA.empresas.filter(function(e) { return e.id !== id; });
          Components.Toast('success', 'Empresa Eliminada', empresa.nombre + ' y todos sus datos han sido eliminados');
          Components.closeModal();
          this.render(document.getElementById('page-content'));
        }.bind(this)
      }
    );
  }
};

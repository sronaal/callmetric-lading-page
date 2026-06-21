const EmpresasPage = {
  currentPage: 1,
  searchQuery: '',

  render(container) {
    if (!Auth.hasRole('super_admin')) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-lock"></i><h3>Acceso restringido</h3><p>Solo Super Admin puede gestionar empresas.</p></div>';
      return;
    }

    const filtered = Utils.filterData(DATA.empresas, { nombre: this.searchQuery });
    const sorted = Utils.sortData(filtered, 'nombre', 'asc');
    const paged = Components.paginate(sorted, this.currentPage);

    const rows = paged.items.map(e => ({
      _id: e.id,
      nombre: e.nombre,
      subdominio: e.subdominio,
      plan: `<span class="status-badge" style="background:rgba(6,182,212,0.15);color:var(--accent-cyan)">${Utils.statusLabel(e.plan)}</span>`,
      activo: e.activo ? '<span style="color:var(--success)"><i class="fas fa-check-circle"></i> Activa</span>' : '<span style="color:var(--text-muted)"><i class="fas fa-minus-circle"></i> Inactiva</span>',
      usuarios: DATA.usuarios.filter(u => u.empresaId === e.id).length,
      pbxs: DATA.pbxServers.filter(p => p.empresaId === e.id).length,
      acciones: `
        <button class="btn btn-ghost btn-sm edit-empresa" data-id="${e.id}"><i class="fas fa-edit"></i></button>
        <button class="btn btn-ghost btn-sm delete-empresa" data-id="${e.id}" style="color:var(--danger)"><i class="fas fa-trash"></i></button>
      `
    }));

    const html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
        <div class="table-search">
          <i class="fas fa-search"></i>
          <input type="text" id="empresa-search" placeholder="Buscar empresa..." value="${this.searchQuery}">
        </div>
        <button class="btn btn-primary" id="add-empresa-btn"><i class="fas fa-plus"></i> Nueva Empresa</button>
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          ${Components.DataTable({
            headers: [
              { key: 'nombre', label: 'Nombre' },
              { key: 'subdominio', label: 'Subdominio' },
              { key: 'plan', label: 'Plan' },
              { key: 'activo', label: 'Estado' },
              { key: 'usuarios', label: 'Usuarios' },
              { key: 'pbxs', label: 'PBXs' },
              { key: 'acciones', label: 'Acciones' }
            ],
            rows,
            emptyMessage: 'No hay empresas registradas'
          })}
        </div>
      </div>
      <div id="empresa-pagination" style="display:flex;justify-content:flex-end;margin-top:12px">
        ${Components.renderPagination(filtered.length, this.currentPage, paged.pages)}
      </div>
    `;

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
        <div class="form-group"><label class="form-label">Nombre <span style="color:var(--danger)">*</span></label><input class="form-input" id="f-nombre" placeholder="Nombre de la empresa"></div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group"><label class="form-label">Subdominio <span style="color:var(--danger)">*</span></label><input class="form-input" id="f-subdominio" placeholder="miempresa"></div>
          <div class="form-group"><label class="form-label">Plan</label>
            <select class="form-select" id="f-plan">
              <option value="starter">Starter</option>
              <option value="professional" selected>Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      </form>
    `;

    Components.Modal('Nueva Empresa', body, {
      confirmText: 'Crear Empresa',
      onConfirm: () => {
        const nombre = document.getElementById('f-nombre').value.trim();
        const subdominio = document.getElementById('f-subdominio').value.trim();
        if (!nombre || !subdominio) { Components.Toast('warning', 'Validación', 'Nombre y subdominio son obligatorios'); return; }

        const newEmpresa = {
          id: 'emp-' + String(DATA.empresas.length + 1).padStart(3, '0'),
          nombre,
          subdominio,
          plan: document.getElementById('f-plan').value,
          activo: true
        };
        DATA.empresas.push(newEmpresa);
        Components.Toast('success', 'Empresa Creada', `"${nombre}" ha sido creada`);
        this.render(document.getElementById('page-content'));
      }
    });
  },

  showEditModal(id) {
    const empresa = getById('empresas', id);
    if (!empresa) return;

    const body = `
      <form id="empresa-edit-form">
        <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" id="f-nombre" value="${empresa.nombre}"></div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group"><label class="form-label">Subdominio</label><input class="form-input" id="f-subdominio" value="${empresa.subdominio}"></div>
          <div class="form-group"><label class="form-label">Plan</label>
            <select class="form-select" id="f-plan">
              <option value="starter" ${empresa.plan === 'starter' ? 'selected' : ''}>Starter</option>
              <option value="professional" ${empresa.plan === 'professional' ? 'selected' : ''}>Professional</option>
              <option value="enterprise" ${empresa.plan === 'enterprise' ? 'selected' : ''}>Enterprise</option>
            </select>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Estado</label>
          <select class="form-select" id="f-activo">
            <option value="true" ${empresa.activo ? 'selected' : ''}>Activa</option>
            <option value="false" ${!empresa.activo ? 'selected' : ''}>Inactiva</option>
          </select>
        </div>
      </form>
    `;

    Components.Modal('Editar Empresa', body, {
      confirmText: 'Guardar Cambios',
      onConfirm: () => {
        empresa.nombre = document.getElementById('f-nombre').value;
        empresa.subdominio = document.getElementById('f-subdominio').value;
        empresa.plan = document.getElementById('f-plan').value;
        empresa.activo = document.getElementById('f-activo').value === 'true';
        Components.Toast('success', 'Empresa Actualizada', `"${empresa.nombre}" ha sido actualizada`);
        this.render(document.getElementById('page-content'));
      }
    });
  },

  showDeleteConfirm(id) {
    const empresa = getById('empresas', id);
    if (!empresa) return;

    Components.Modal('Eliminar Empresa',
      `<p style="margin-bottom:8px">¿Estás seguro de eliminar <strong>${empresa.nombre}</strong>?</p>
      <p style="font-size:0.8rem;color:var(--text-muted)">Se eliminarán también los usuarios, PBXs y agentes asociados. Esta acción no se puede deshacer.</p>`,
      {
        confirmText: 'Eliminar',
        onConfirm: () => {
          DATA.usuarios = DATA.usuarios.filter(u => u.empresaId !== id);
          DATA.pbxServers = DATA.pbxServers.filter(p => p.empresaId !== id);
          DATA.agentesMonitoreo = DATA.agentesMonitoreo.filter(a => a.empresaId !== id);
          DATA.empresas = DATA.empresas.filter(e => e.id !== id);
          Components.Toast('success', 'Empresa Eliminada', `"${empresa.nombre}" y todos sus datos han sido eliminados`);
          this.render(document.getElementById('page-content'));
        }
      }
    );
  }
};

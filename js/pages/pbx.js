const PbxPage = {
  currentPage: 1,
  searchQuery: '',

  render(container) {
    const filtered = Utils.filterData(DATA.pbxServers, { nombre: this.searchQuery });
    const sorted = Utils.sortData(filtered, 'nombre', 'asc');
    const paged = Components.paginate(sorted, this.currentPage);

    const rows = paged.items.map(pbx => ({
      _id: pbx.id,
      nombre: pbx.nombre,
      ip: pbx.ip,
      version: pbx.version_asterisk || '—',
      empresa: getEmpresaName(pbx.empresa_id),
      status: Components.StatusBadge(pbx.estado),
      puerto: pbx.puerto_ami,
      acciones: `
        <button class="btn btn-ghost btn-sm view-pbx" data-id="${pbx.id}"><i class="fas fa-eye"></i></button>
        <button class="btn btn-ghost btn-sm edit-pbx" data-id="${pbx.id}"><i class="fas fa-edit"></i></button>
        <button class="btn btn-ghost btn-sm delete-pbx" data-id="${pbx.id}" style="color:var(--danger)"><i class="fas fa-trash"></i></button>
      `
    }));

    const html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
        <div class="table-search">
          <i class="fas fa-search"></i>
          <input type="text" id="pbx-search" placeholder="Buscar servidor..." value="${this.searchQuery}">
        </div>
        <button class="btn btn-primary" id="add-pbx-btn"><i class="fas fa-plus"></i> Registrar PBX</button>
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          ${Components.DataTable({
            headers: [
              { key: 'nombre', label: 'Nombre' },
              { key: 'ip', label: 'IP' },
              { key: 'puerto', label: 'Puerto AMI' },
              { key: 'version', label: 'Asterisk' },
              { key: 'empresa', label: 'Empresa' },
              { key: 'status', label: 'Estado' },
              { key: 'acciones', label: 'Acciones' }
            ],
            rows,
            onRowClick: null,
            emptyMessage: 'No hay servidores PBX registrados'
          })}
        </div>
      </div>
      <div id="pbx-pagination" style="display:flex;justify-content:flex-end;margin-top:12px">
        ${Components.renderPagination(filtered.length, this.currentPage, paged.pages)}
      </div>
    `;

    container.innerHTML = html;
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('pbx-search')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.currentPage = 1;
      this.render(document.getElementById('page-content'));
    });

    document.getElementById('add-pbx-btn')?.addEventListener('click', () => this.showAddModal());

    document.querySelectorAll('.view-pbx').forEach(btn => {
      btn.onclick = () => { window.location.hash = `#pbx/${btn.dataset.id}`; };
    });

    document.querySelectorAll('.edit-pbx').forEach(btn => {
      btn.onclick = () => this.showEditModal(btn.dataset.id);
    });

    document.querySelectorAll('.delete-pbx').forEach(btn => {
      btn.onclick = () => this.showDeleteConfirm(btn.dataset.id);
    });

    document.querySelector('.page-prev')?.addEventListener('click', () => {
      if (this.currentPage > 1) { this.currentPage--; this.render(document.getElementById('page-content')); }
    });

    document.querySelector('.page-next')?.addEventListener('click', () => {
      const filtered = Utils.filterData(DATA.pbxServers, { nombre: this.searchQuery });
      const paged = Components.paginate(filtered, this.currentPage);
      if (this.currentPage < paged.pages) { this.currentPage++; this.render(document.getElementById('page-content')); }
    });
  },

  showAddModal() {
    const body = `
      <form id="pbx-form">
        <div class="form-group">
          <label class="form-label">Nombre <span style="color:var(--danger)">*</span></label>
          <input class="form-input" id="f-nombre" placeholder="PBX Principal">
          <div class="form-error"></div>
        </div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">IP <span style="color:var(--danger)">*</span></label>
            <input class="form-input" id="f-ip" placeholder="192.168.1.10">
            <div class="form-error"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Puerto AMI</label>
            <input class="form-input" type="number" id="f-puerto" value="5038">
            <div class="form-error"></div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Version Asterisk</label>
          <input class="form-input" id="f-version" placeholder="20.5.1">
          <div class="form-error"></div>
        </div>
      </form>
    `;

    Components.Modal('Registrar Servidor PBX', body, {
      confirmText: 'Registrar',
      onConfirm: () => {
        const form = document.getElementById('pbx-form');
        Validation.clearErrors(form);
        const result = Validation.validateForm({
          'f-nombre': [['required', 'Nombre'], ['minLength', 2, 'Nombre'], ['maxLength', 100, 'Nombre']],
          'f-ip': [['required', 'IP'], ['ip']],
          'f-puerto': [['positiveNumber', 'Puerto AMI']]
        });
        if (!result.isValid) {
          Validation.showErrors(result.errors);
          return;
        }
        const newPbx = {
          id: generateId('pbxServers'),
          empresa_id: Auth.getUser().empresa_id,
          nombre: result.values['f-nombre'],
          ip: result.values['f-ip'],
          puerto_ami: parseInt(result.values['f-puerto']) || 5038,
          version_asterisk: result.values['f-version'],
          estado: 'Activo',
          created_at: new Date().toISOString()
        };
        DATA.pbxServers.push(newPbx);
        Components.Toast('success', 'PBX Registrado', newPbx.nombre + ' ha sido registrado');
        this.render(document.getElementById('page-content'));
      }
    });
    Validation.clearOnInput(document.getElementById('pbx-form'));
  },

  showEditModal(id) {
    const pbx = getById('pbxServers', id);
    if (!pbx) return;

    const body = `
      <form id="pbx-edit-form">
        <div class="form-group">
          <label class="form-label">Nombre <span style="color:var(--danger)">*</span></label>
          <input class="form-input" id="f-nombre" value="${pbx.nombre}">
          <div class="form-error"></div>
        </div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">IP <span style="color:var(--danger)">*</span></label>
            <input class="form-input" id="f-ip" value="${pbx.ip}">
            <div class="form-error"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Puerto AMI</label>
            <input class="form-input" type="number" id="f-puerto" value="${pbx.puerto_ami || 5038}">
            <div class="form-error"></div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Version Asterisk</label>
          <input class="form-input" id="f-version" value="${pbx.version_asterisk || ''}">
          <div class="form-error"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Estado</label>
          <select class="form-select" id="f-estado">
            <option value="Activo" ${pbx.estado === 'Activo' ? 'selected' : ''}>Activo</option>
            <option value="Inactivo" ${pbx.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
          </select>
        </div>
      </form>
    `;

    Components.Modal('Editar Servidor PBX', body, {
      confirmText: 'Guardar Cambios',
      onConfirm: () => {
        const form = document.getElementById('pbx-edit-form');
        Validation.clearErrors(form);
        const result = Validation.validateForm({
          'f-nombre': [['required', 'Nombre'], ['minLength', 2, 'Nombre'], ['maxLength', 100, 'Nombre']],
          'f-ip': [['required', 'IP'], ['ip']],
          'f-puerto': [['positiveNumber', 'Puerto AMI']]
        });
        if (!result.isValid) {
          Validation.showErrors(result.errors);
          return;
        }
        pbx.nombre = result.values['f-nombre'];
        pbx.ip = result.values['f-ip'];
        pbx.puerto_ami = parseInt(result.values['f-puerto']) || 5038;
        pbx.version_asterisk = result.values['f-version'];
        pbx.estado = document.getElementById('f-estado').value;
        Components.Toast('success', 'PBX Actualizado', pbx.nombre + ' ha sido actualizado');
        this.render(document.getElementById('page-content'));
      }
    });
    Validation.clearOnInput(document.getElementById('pbx-edit-form'));
  },

  showDeleteConfirm(id) {
    const pbx = getById('pbxServers', id);
    if (!pbx) return;

    Components.Modal('Eliminar Servidor PBX',
      `<p style="margin-bottom:8px">Estas seguro de eliminar <strong>${pbx.nombre}</strong>?</p>
      <p style="font-size:0.8rem;color:var(--text-muted)">Esta accion no se puede deshacer. Los agentes asociados quedaran huerfanos.</p>`,
      {
        confirmText: 'Eliminar',
        onConfirm: () => {
          DATA.pbxServers = DATA.pbxServers.filter(s => s.id !== id);
          Components.Toast('success', 'PBX Eliminado', pbx.nombre + ' ha sido eliminado');
          this.render(document.getElementById('page-content'));
        }
      }
    );
  },

  renderDetail(container, pbxId) {
    const pbx = getById('pbxServers', pbxId);
    if (!pbx) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-server"></i><h3>PBX no encontrada</h3></div>';
      return;
    }

    const agents = getByPbx('agentesMonitoreo', pbxId);
    const agent = agents[0];

    const html = `
      <div class="detail-header">
        <div style="display:flex;align-items:center;gap:12px">
          <h2>${pbx.nombre}</h2>
          ${Components.StatusBadge(pbx.estado)}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#pbx'"><i class="fas fa-arrow-left"></i> Volver</button>
          <button class="btn btn-primary btn-sm" id="edit-detail-pbx" data-id="${pbx.id}"><i class="fas fa-edit"></i> Editar</button>
          <button class="btn btn-danger btn-sm" id="delete-detail-pbx" data-id="${pbx.id}"><i class="fas fa-trash"></i> Eliminar</button>
        </div>
      </div>

      ${Components.DetailGrid([
        { label: 'IP', value: pbx.ip },
        { label: 'Puerto AMI', value: pbx.puerto_ami },
        { label: 'Version Asterisk', value: pbx.version_asterisk || '—' },
        { label: 'Estado', value: pbx.estado === 'Activo' ? '<span style="color:var(--success)">Activo</span>' : '<span style="color:var(--text-muted)">Inactivo</span>' },
        { label: 'Empresa', value: getEmpresaName(pbx.empresa_id) },
        { label: 'Creado', value: Utils.formatDate(pbx.created_at) }
      ])}

      <div class="grid-2" style="margin-bottom:20px">
        <div class="card">
          <div class="card-header"><span class="card-title">Agente de Monitoreo</span></div>
          <div class="card-body">
            ${agent ? `
              <table class="data-table">
                <tr><td style="color:var(--text-muted);padding:6px 0">Hostname</td><td style="padding:6px 0;font-family:var(--font-mono)">${agent.hostname || '—'}</td></tr>
                <tr><td style="color:var(--text-muted);padding:6px 0">Version</td><td style="padding:6px 0">${agent.version_agente || '—'}</td></tr>
                <tr><td style="color:var(--text-muted);padding:6px 0">Estado</td><td style="padding:6px 0">${Components.StatusBadge(agent.estado)}</td></tr>
                <tr><td style="color:var(--text-muted);padding:6px 0">Ultimo Heartbeat</td><td style="padding:6px 0">${agent.ultimo_heartbeat ? Utils.formatDate(agent.ultimo_heartbeat, { relative: true }) : '—'}</td></tr>
              </table>
            ` : '<span style="color:var(--text-muted)">Sin agente asignado</span>'}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Informacion del Servidor</span></div>
          <div class="card-body">
            <table class="data-table">
              <tr><td style="color:var(--text-muted);padding:6px 0">ID</td><td style="padding:6px 0">${pbx.id}</td></tr>
              <tr><td style="color:var(--text-muted);padding:6px 0">IP</td><td style="padding:6px 0;font-family:var(--font-mono)">${pbx.ip}</td></tr>
              <tr><td style="color:var(--text-muted);padding:6px 0">Puerto AMI</td><td style="padding:6px 0;font-family:var(--font-mono)">${pbx.puerto_ami}</td></tr>
              <tr><td style="color:var(--text-muted);padding:6px 0">Empresa</td><td style="padding:6px 0">${getEmpresaName(pbx.empresa_id)}</td></tr>
              <tr><td style="color:var(--text-muted);padding:6px 0">Creado</td><td style="padding:6px 0">${Utils.formatDate(pbx.created_at)}</td></tr>
            </table>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    document.getElementById('edit-detail-pbx')?.addEventListener('click', () => this.showEditModal(pbxId));
    document.getElementById('delete-detail-pbx')?.addEventListener('click', () => {
      App.renderShell();
      this.showDeleteConfirm(pbxId);
    });
  }
};

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
      tipo: pbx.tipo,
      version: pbx.version,
      empresa: getEmpresaName(pbx.empresaId),
      status: Components.StatusBadge(pbx.status),
      calls: pbx.activeCalls,
      cpu: `${pbx.cpuUsage}%`,
      ram: `${pbx.memoryUsage}%`,
      heartbeat: Utils.formatDate(pbx.ultimoHeartbeat, { relative: true }),
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
              { key: 'tipo', label: 'Tipo' },
              { key: 'version', label: 'Versión' },
              { key: 'empresa', label: 'Empresa' },
              { key: 'status', label: 'Estado' },
              { key: 'calls', label: 'Llamadas' },
              { key: 'cpu', label: 'CPU' },
              { key: 'ram', label: 'RAM' },
              { key: 'heartbeat', label: 'Heartbeat' },
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
        <div class="grid-2" style="gap:12px">
          <div class="form-group"><label class="form-label">Nombre <span style="color:var(--danger)">*</span></label><input class="form-input" id="f-nombre" placeholder="PBX Principal" value=""></div>
          <div class="form-group"><label class="form-label">Hostname</label><input class="form-input" id="f-hostname" placeholder="pbx01.local"></div>
        </div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group"><label class="form-label">IP</label><input class="form-input" id="f-ip" placeholder="192.168.1.10"></div>
          <div class="form-group"><label class="form-label">Tipo <span style="color:var(--danger)">*</span></label>
            <select class="form-select" id="f-tipo"><option value="Asterisk">Asterisk</option><option value="FreePBX">FreePBX</option><option value="Issabel">Issabel</option></select>
          </div>
        </div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group"><label class="form-label">Versión</label><input class="form-input" id="f-version" placeholder="20.5.1"></div>
          <div class="form-group"><label class="form-label">Ubicación</label><input class="form-input" id="f-ubicacion" placeholder="Datacenter Principal"></div>
        </div>
        <div class="grid-3" style="gap:12px">
          <div class="form-group"><label class="form-label">SIP Trunks</label><input class="form-input" type="number" id="f-trunks" value="4"></div>
          <div class="form-group"><label class="form-label">Extensiones</label><input class="form-input" type="number" id="f-ext" value="50"></div>
          <div class="form-group"><label class="form-label">Max Llamadas</label><input class="form-input" type="number" id="f-maxcalls" value="100"></div>
        </div>
      </form>
    `;

    Components.Modal('Registrar Servidor PBX', body, {
      confirmText: 'Registrar',
      onConfirm: () => {
        const nombre = document.getElementById('f-nombre').value.trim();
        if (!nombre) { Components.Toast('warning', 'Validación', 'El nombre es obligatorio'); return; }

        const newPbx = {
          id: 'pbx-' + String(DATA.pbxServers.length + 1).padStart(3, '0'),
          empresaId: Auth.getUser().empresaId,
          nombre,
          hostname: document.getElementById('f-hostname').value || '',
          ip: document.getElementById('f-ip').value || '',
          tipo: document.getElementById('f-tipo').value,
          version: document.getElementById('f-version').value || '',
          status: 'pending',
          activeCalls: 0,
          cpuUsage: 0,
          memoryUsage: 0,
          memoryTotal: '4 GB',
          diskUsage: 0,
          diskTotal: '50 GB',
          diskUsed: '0 GB',
          uptime: '0d 0h 0m',
          ultimoHeartbeat: null,
          ubicacion: document.getElementById('f-ubicacion').value || '',
          configuracion: {
            sipTrunks: parseInt(document.getElementById('f-trunks').value) || 0,
            extensiones: parseInt(document.getElementById('f-ext').value) || 0,
            maxCalls: parseInt(document.getElementById('f-maxcalls').value) || 0
          }
        };

        DATA.pbxServers.push(newPbx);

        const token = 'cm-' + Array.from({length: 32}, () => Math.random().toString(36)[2]).join('').toUpperCase();
        Components.closeModal();

        setTimeout(() => {
          const tokenBody = `
            <p style="margin-bottom:12px;color:var(--text-secondary);font-size:0.85rem">PBX registrado exitosamente. Guarda este token de registro para configurar el agente:</p>
            <div class="token-display">
              <code>${token}</code>
              <button class="copy-btn" onclick="navigator.clipboard.writeText('${token}').then(()=>Components.Toast('success','Copiado','Token copiado al portapapeles'))"><i class="fas fa-copy"></i> Copiar</button>
            </div>
            <p style="font-size:0.8rem;color:var(--text-muted)">Configura el agente con este token usando <code>AGENT_TOKEN=${token}</code> en tu archivo .env</p>
          `;
          Components.Modal('Token de Registro', tokenBody, { showConfirm: false });
        }, 300);

        Components.Toast('success', 'PBX Registrado', `"${nombre}" ha sido registrado`);
        this.searchQuery = '';
        this.currentPage = 1;
        this.render(document.getElementById('page-content'));
      }
    });
  },

  showEditModal(id) {
    const pbx = getById('pbxServers', id);
    if (!pbx) return;

    const body = `
      <form id="pbx-edit-form">
        <div class="grid-2" style="gap:12px">
          <div class="form-group"><label class="form-label">Nombre <span style="color:var(--danger)">*</span></label><input class="form-input" id="f-nombre" value="${pbx.nombre}"></div>
          <div class="form-group"><label class="form-label">Hostname</label><input class="form-input" id="f-hostname" value="${pbx.hostname || ''}"></div>
        </div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group"><label class="form-label">IP</label><input class="form-input" id="f-ip" value="${pbx.ip || ''}"></div>
          <div class="form-group"><label class="form-label">Ubicación</label><input class="form-input" id="f-ubicacion" value="${pbx.ubicacion || ''}"></div>
        </div>
        <div class="grid-3" style="gap:12px">
          <div class="form-group"><label class="form-label">SIP Trunks</label><input class="form-input" type="number" id="f-trunks" value="${pbx.configuracion?.sipTrunks || 0}"></div>
          <div class="form-group"><label class="form-label">Extensiones</label><input class="form-input" type="number" id="f-ext" value="${pbx.configuracion?.extensiones || 0}"></div>
          <div class="form-group"><label class="form-label">Max Llamadas</label><input class="form-input" type="number" id="f-maxcalls" value="${pbx.configuracion?.maxCalls || 0}"></div>
        </div>
      </form>
    `;

    Components.Modal('Editar Servidor PBX', body, {
      confirmText: 'Guardar Cambios',
      onConfirm: () => {
        const nombre = document.getElementById('f-nombre').value.trim();
        if (!nombre) { Components.Toast('warning', 'Validación', 'El nombre es obligatorio'); return; }

        pbx.nombre = nombre;
        pbx.hostname = document.getElementById('f-hostname').value;
        pbx.ip = document.getElementById('f-ip').value;
        pbx.ubicacion = document.getElementById('f-ubicacion').value;
        pbx.configuracion.sipTrunks = parseInt(document.getElementById('f-trunks').value) || 0;
        pbx.configuracion.extensiones = parseInt(document.getElementById('f-ext').value) || 0;
        pbx.configuracion.maxCalls = parseInt(document.getElementById('f-maxcalls').value) || 0;

        Components.Toast('success', 'PBX Actualizado', `"${nombre}" ha sido actualizado`);
        this.render(document.getElementById('page-content'));
      }
    });
  },

  showDeleteConfirm(id) {
    const pbx = getById('pbxServers', id);
    if (!pbx) return;

    Components.Modal('Eliminar Servidor PBX',
      `<p style="margin-bottom:8px">¿Estás seguro de eliminar <strong>${pbx.nombre}</strong>?</p><p style="font-size:0.8rem;color:var(--text-muted)">Esta acción no se puede deshacer. Los agentes asociados quedarán huérfanos.</p>`,
      {
        confirmText: 'Eliminar',
        onConfirm: () => {
          DATA.pbxServers = DATA.pbxServers.filter(s => s.id !== id);
          Components.Toast('success', 'PBX Eliminado', `"${pbx.nombre}" ha sido eliminado`);
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
          ${Components.StatusBadge(pbx.status)}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#pbx'"><i class="fas fa-arrow-left"></i> Volver</button>
          <button class="btn btn-primary btn-sm" id="edit-detail-pbx" data-id="${pbx.id}"><i class="fas fa-edit"></i> Editar</button>
          <button class="btn btn-danger btn-sm" id="delete-detail-pbx" data-id="${pbx.id}"><i class="fas fa-trash"></i> Eliminar</button>
        </div>
      </div>

      <div style="margin-bottom:8px;color:var(--text-muted);font-size:0.85rem">
        ${pbx.ubicacion ? `<span><i class="fas fa-map-marker-alt"></i> ${pbx.ubicacion}</span>` : ''}
        <span style="margin-left:16px"><i class="fas fa-cube"></i> ${pbx.tipo} ${pbx.version}</span>
      </div>

      ${Components.DetailGrid([
        { label: 'Llamadas Activas', value: pbx.activeCalls },
        { label: 'CPU', value: `${pbx.cpuUsage}%` },
        { label: 'RAM', value: `${pbx.memoryUsage}% de ${pbx.memoryTotal}` },
        { label: 'Uptime', value: pbx.uptime },
        { label: 'Disco', value: `${pbx.diskUsage}% (${pbx.diskUsed} / ${pbx.diskTotal})` },
        { label: 'Heartbeat', value: Utils.formatDate(pbx.ultimoHeartbeat, { relative: true }) }
      ])}

      <div class="grid-2" style="margin-bottom:20px">
        <div class="card">
          <div class="card-header"><span class="card-title">Configuración</span></div>
          <div class="card-body">
            <div class="grid-3" style="gap:12px;text-align:center">
              <div><div style="color:var(--text-muted);font-size:0.75rem">SIP Trunks</div><div style="font-size:1.2rem;font-weight:600">${pbx.configuracion?.sipTrunks || 0}</div></div>
              <div><div style="color:var(--text-muted);font-size:0.75rem">Extensiones</div><div style="font-size:1.2rem;font-weight:600">${pbx.configuracion?.extensiones || 0}</div></div>
              <div><div style="color:var(--text-muted);font-size:0.75rem">Max Llamadas</div><div style="font-size:1.2rem;font-weight:600">${pbx.configuracion?.maxCalls || 0}</div></div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Información del Servidor</span></div>
          <div class="card-body">
            <table class="data-table">
              <tr><td style="color:var(--text-muted);padding:6px 0">ID</td><td style="padding:6px 0">${pbx.id}</td></tr>
              <tr><td style="color:var(--text-muted);padding:6px 0">Hostname</td><td style="padding:6px 0;font-family:var(--font-mono)">${pbx.hostname || '—'}</td></tr>
              <tr><td style="color:var(--text-muted);padding:6px 0">IP</td><td style="padding:6px 0;font-family:var(--font-mono)">${pbx.ip || '—'}</td></tr>
              <tr><td style="color:var(--text-muted);padding:6px 0">Empresa</td><td style="padding:6px 0">${getEmpresaName(pbx.empresaId)}</td></tr>
              ${agent ? `<tr><td style="color:var(--text-muted);padding:6px 0">Agente Asignado</td><td style="padding:6px 0"><a href="#" onclick="window.location.hash='#agents/${agent.id}';return false">${agent.nombre}</a></td></tr>` : ''}
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

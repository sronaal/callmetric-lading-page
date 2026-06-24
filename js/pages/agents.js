const AgentsPage = {
  currentPage: 1,
  searchQuery: '',

  render(container) {
    const filtered = Utils.filterData(DATA.agentesMonitoreo, { hostname: this.searchQuery });
    const sorted = Utils.sortData(filtered, 'hostname', 'asc');
    const paged = Components.paginate(sorted, this.currentPage);

    const rows = paged.items.map(a => {
      const pbx = getById('pbxServers', a.pbx_id);
      const empresaName = pbx ? getEmpresaName(pbx.empresa_id) : '—';
      return {
        _id: a.id,
        hostname: a.hostname || '—',
        pbx: pbx ? pbx.nombre : '—',
        empresa: empresaName,
        version: a.version_agente || '—',
        status: Components.StatusBadge(a.estado),
        heartbeat: a.ultimo_heartbeat ? Utils.formatDate(a.ultimo_heartbeat, { relative: true }) : '—'
      };
    });

    const html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
        <div class="table-search">
          <i class="fas fa-search"></i>
          <input type="text" id="agent-search" placeholder="Buscar agente..." value="${this.searchQuery}">
        </div>
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          ${Components.DataTable({
            headers: [
              { key: 'hostname', label: 'Hostname' },
              { key: 'pbx', label: 'PBX' },
              { key: 'empresa', label: 'Empresa' },
              { key: 'version', label: 'Version' },
              { key: 'status', label: 'Estado' },
              { key: 'heartbeat', label: 'Ultimo Heartbeat' }
            ],
            rows,
            onRowClick: (idx) => {
              const item = paged.items[idx];
              if (item) window.location.hash = `#agents/${item.id}`;
            },
            emptyMessage: 'No hay agentes de monitoreo registrados'
          })}
        </div>
      </div>
      <div id="agent-pagination" style="display:flex;justify-content:flex-end;margin-top:12px">
        ${Components.renderPagination(filtered.length, this.currentPage, paged.pages)}
      </div>
    `;

    container.innerHTML = html;
    this.bindEvents(paged);
  },

  bindEvents(paged) {
    document.getElementById('agent-search')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.currentPage = 1;
      this.render(document.getElementById('page-content'));
    });

    document.querySelector('.page-prev')?.addEventListener('click', () => {
      if (this.currentPage > 1) { this.currentPage--; this.render(document.getElementById('page-content')); }
    });

    document.querySelector('.page-next')?.addEventListener('click', () => {
      const filtered = Utils.filterData(DATA.agentesMonitoreo, { hostname: this.searchQuery });
      const p = Components.paginate(filtered, this.currentPage);
      if (this.currentPage < p.pages) { this.currentPage++; this.render(document.getElementById('page-content')); }
    });
  },

  renderDetail(container, agentId) {
    const agent = getById('agentesMonitoreo', agentId);
    if (!agent) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-robot"></i><h3>Agente no encontrado</h3></div>';
      return;
    }

    const agentHeartbeats = DATA.heartbeats.filter(h => h.agente_id === agentId).slice(0, 20);
    const pbx = getById('pbxServers', agent.pbx_id);

    const hbRows = agentHeartbeats.map(hb => ({
      timestamp: Utils.formatDate(hb.fecha),
      status: Components.StatusBadge(hb.estado),
      cpu: `${hb.cpu}%`,
      ram: `${hb.memoria}%`,
      disco: `${hb.disco}%`,
      canales_sip: hb.canales_sip
    }));

    const html = `
      <div class="detail-header">
        <div style="display:flex;align-items:center;gap:12px">
          <h2>${agent.hostname || 'Agente ' + agent.id}</h2>
          ${Components.StatusBadge(agent.estado)}
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#agents'"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
      </div>
      <div style="margin-bottom:16px;color:var(--text-muted);font-size:0.85rem">
        <span><i class="fas fa-cube"></i> Agente v${agent.version_agente || '—'}</span>
        ${pbx ? `<span style="margin-left:16px"><i class="fas fa-server"></i> ${pbx.nombre}</span>` : ''}
      </div>

      ${Components.DetailGrid([
        { label: 'Hostname', value: agent.hostname || '—' },
        { label: 'Ultimo Heartbeat', value: agent.ultimo_heartbeat ? Utils.formatDate(agent.ultimo_heartbeat, { relative: true }) : '—' },
        { label: 'Estado', value: agent.estado === 'Activo' ? '<span style="color:var(--success)">Activo</span>' : '<span style="color:var(--text-muted)">Inactivo</span>' },
        { label: 'Creado', value: Utils.formatDate(agent.created_at) }
      ])}

      <div class="card">
        <div class="card-header"><span class="card-title">Ultimos Heartbeats (${agentHeartbeats.length})</span></div>
        <div class="card-body" style="padding:0">
          ${Components.DataTable({
            headers: [
              { key: 'timestamp', label: 'Timestamp' },
              { key: 'status', label: 'Estado' },
              { key: 'cpu', label: 'CPU' },
              { key: 'ram', label: 'RAM' },
              { key: 'disco', label: 'Disco' },
              { key: 'canales_sip', label: 'Canales SIP' }
            ],
            rows: hbRows,
            emptyMessage: 'Sin heartbeats registrados'
          })}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
};

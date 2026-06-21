const AgentsPage = {
  currentPage: 1,
  searchQuery: '',

  render(container) {
    const filtered = Utils.filterData(DATA.agentesMonitoreo, { nombre: this.searchQuery });
    const sorted = Utils.sortData(filtered, 'nombre', 'asc');
    const paged = Components.paginate(sorted, this.currentPage);

    const rows = paged.items.map(a => ({
      _id: a.id,
      nombre: a.nombre,
      tipo: a.tipo,
      version: a.version,
      empresa: getEmpresaName(a.empresaId),
      status: Components.StatusBadge(a.status),
      heartbeat: a.ultimoHeartbeat ? Utils.formatDate(a.ultimoHeartbeat, { relative: true }) : '—',
      intervalo: a.intervaloHeartbeat ? `${a.intervaloHeartbeat}s` : '—',
    }));

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
              { key: 'nombre', label: 'Nombre' },
              { key: 'tipo', label: 'Tipo' },
              { key: 'version', label: 'Versión' },
              { key: 'empresa', label: 'Empresa' },
              { key: 'status', label: 'Estado' },
              { key: 'heartbeat', label: 'Último Heartbeat' },
              { key: 'intervalo', label: 'Intervalo' }
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

    document.querySelectorAll('.data-table tbody tr').forEach((tr, idx) => {
      tr.onclick = () => {
        const filtered = Utils.filterData(DATA.agentesMonitoreo, { nombre: this.searchQuery });
        const sorted = Utils.sortData(filtered, 'nombre', 'asc');
        const items = Components.paginate(sorted, this.currentPage).items;
        const item = items[idx];
        if (item) window.location.hash = `#agents/${item.id}`;
      };
    });

    document.querySelector('.page-prev')?.addEventListener('click', () => {
      if (this.currentPage > 1) { this.currentPage--; this.render(document.getElementById('page-content')); }
    });

    document.querySelector('.page-next')?.addEventListener('click', () => {
      const filtered = Utils.filterData(DATA.agentesMonitoreo, { nombre: this.searchQuery });
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

    const agentHeartbeats = DATA.heartbeats.filter(h => h.agentId === agentId).slice(0, 20);
    const pbx = getById('pbxServers', agent.pbxId);
    const metricsTags = agent.metricsCollected ? agent.metricsCollected.split(',').map(m => m.trim()).filter(Boolean) : [];

    const hbRows = agentHeartbeats.map(hb => ({
      timestamp: Utils.formatDate(hb.timestamp),
      status: Components.StatusBadge(hb.status),
      cpu: `${hb.cpuUsage}%`,
      ram: `${hb.memoryUsage}%`,
      ami: hb.conexionAmi ? '<span style="color:var(--success)"><i class="fas fa-circle"></i></span>' : '<span style="color:var(--danger)"><i class="fas fa-times"></i></span>',
      latencia: `${hb.latenciaMs}ms`
    }));

    const html = `
      <div class="detail-header">
        <div style="display:flex;align-items:center;gap:12px">
          <h2>${agent.nombre}</h2>
          ${Components.StatusBadge(agent.status)}
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#agents'"><i class="fas fa-arrow-left"></i> Volver</button>
        </div>
      </div>
      <div style="margin-bottom:16px;color:var(--text-muted);font-size:0.85rem">
        <span><i class="fas fa-cube"></i> ${agent.tipo} ${agent.version}</span>
        ${pbx ? `<span style="margin-left:16px"><i class="fas fa-server"></i> ${pbx.nombre}</span>` : ''}
      </div>

      ${Components.DetailGrid([
        { label: 'Intervalo Heartbeat', value: `${agent.intervaloHeartbeat}s` },
        { label: 'Último Heartbeat', value: agent.ultimoHeartbeat ? Utils.formatDate(agent.ultimoHeartbeat, { relative: true }) : '—' },
        { label: 'Métricas', value: `${metricsTags.length} tipos` },
        { label: 'Estado', value: agent.activo ? '<span style="color:var(--success)">Activo</span>' : '<span style="color:var(--text-muted)">Inactivo</span>' }
      ])}

      <div class="grid-2" style="margin-bottom:20px">
        <div class="card">
          <div class="card-header"><span class="card-title">Información del Agente</span></div>
          <div class="card-body">
            <table class="data-table">
              <tr><td style="color:var(--text-muted);padding:6px 0">ID</td><td style="padding:6px 0;font-family:var(--font-mono)">${agent.id}</td></tr>
              <tr><td style="color:var(--text-muted);padding:6px 0">PBX</td><td style="padding:6px 0">${pbx ? pbx.nombre : '—'}</td></tr>
              <tr><td style="color:var(--text-muted);padding:6px 0">Creado</td><td style="padding:6px 0">${Utils.formatDate('2026-06-01T00:00:00Z')}</td></tr>
              <tr><td style="color:var(--text-muted);padding:6px 0">Actualizado</td><td style="padding:6px 0">${Utils.formatDate(agent.ultimoHeartbeat || '2026-06-01T00:00:00Z')}</td></tr>
            </table>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Métricas Recolectadas</span></div>
          <div class="card-body">
            ${metricsTags.length > 0 ? metricsTags.map(t => `<span class="tag">${t}</span>`).join('') : '<span style="color:var(--text-muted)">Sin métricas configuradas</span>'}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Últimos Heartbeats (${agentHeartbeats.length})</span></div>
        <div class="card-body" style="padding:0">
          ${Components.DataTable({
            headers: [
              { key: 'timestamp', label: 'Timestamp' },
              { key: 'status', label: 'Estado' },
              { key: 'cpu', label: 'CPU' },
              { key: 'ram', label: 'RAM' },
              { key: 'ami', label: 'AMI' },
              { key: 'latencia', label: 'Latencia' }
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

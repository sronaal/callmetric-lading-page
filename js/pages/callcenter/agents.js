const CCAgentsPage = {
  currentPage: 1,
  searchQuery: '',

  render(container) {
    const user = Auth.getUser();
    const agents = user.rol === 'SUPER_ADMIN'
      ? DATA.agentesCC
      : DATA.agentesCC.filter(a => a.empresa_id === user.empresa_id);

    const filtered = Utils.filterData(agents, { nombre: this.searchQuery });
    const sorted = Utils.sortData(filtered, 'nombre', 'asc');
    const paged = Components.paginate(sorted, this.currentPage);

    const rows = paged.items.map(a => ({
      _id: a.id,
      agente: `${a.nombre} <span style="color:var(--text-muted);font-size:0.8rem">${a.extension}</span>`,
      cola: a.cola_nombre,
      estado: Components.AgentStatusDot(a.estado),
      duracion: a.estado === 'on-call' || a.estado === 'ringing'
        ? `<span style="color:var(--accent-cyan);font-family:var(--font-mono)">${Utils.formatDuration(Math.floor(Math.random() * 300 + 30))}</span>`
        : '—',
      atendidas: a.llamadas_atendidas_hoy,
      aht: Utils.formatDuration(a.tiempo_promedio_manejo_seg),
      logueado: Utils.formatDuration(a.tiempo_logueado_seg)
    }));

    const html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
        <div class="table-search">
          <i class="fas fa-search"></i>
          <input type="text" id="ccagent-search" placeholder="Buscar agente..." value="${this.searchQuery}">
        </div>
        <span style="color:var(--text-muted);font-size:0.85rem">
          <i class="fas fa-users"></i> ${agents.length} agentes · ${agents.filter(a => a.estado === 'available').length} disponibles
        </span>
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          ${Components.DataTable({
            headers: [
              { key: 'agente', label: 'Agente' },
              { key: 'cola', label: 'Cola' },
              { key: 'estado', label: 'Estado' },
              { key: 'duracion', label: 'Llamada' },
              { key: 'atendidas', label: 'Atendidas' },
              { key: 'aht', label: 'AHT' },
              { key: 'logueado', label: 'Logueado' }
            ],
            rows,
            emptyMessage: 'No hay agentes de Call Center'
          })}
        </div>
      </div>
      <div id="ccagent-pagination" style="display:flex;justify-content:flex-end;margin-top:12px">
        ${Components.renderPagination(filtered.length, this.currentPage, paged.pages)}
      </div>
    `;

    container.innerHTML = html;
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('ccagent-search')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.currentPage = 1;
      this.render(document.getElementById('page-content'));
    });

    document.querySelector('.page-prev')?.addEventListener('click', () => {
      if (this.currentPage > 1) { this.currentPage--; this.render(document.getElementById('page-content')); }
    });

    document.querySelector('.page-next')?.addEventListener('click', () => {
      const user = Auth.getUser();
      const agents = user.rol === 'SUPER_ADMIN' ? DATA.agentesCC : DATA.agentesCC.filter(a => a.empresa_id === user.empresa_id);
      const filtered = Utils.filterData(agents, { nombre: this.searchQuery });
      const p = Components.paginate(filtered, this.currentPage);
      if (this.currentPage < p.pages) { this.currentPage++; this.render(document.getElementById('page-content')); }
    });
  }
};

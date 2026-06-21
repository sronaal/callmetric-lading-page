const CCDashboardPage = {
  pbxFilter: '',
  chartInstance: null,

  render(container) {
    const queues = this.pbxFilter
      ? DATA.colasCallCenter.filter(q => q.pbxId === this.pbxFilter)
      : DATA.colasCallCenter;
    const activeQueues = queues.filter(q => q.status === 'active' || q.status === 'overflow');
    const ccAgents = this.pbxFilter
      ? DATA.agentesCC.filter(a => a.pbxId === this.pbxFilter)
      : DATA.agentesCC;

    const enCola = DATA.llamadasEnCola.filter(qc => queues.some(q => q.id === qc.colaId));
    const activeCalls = DATA.llamadasActivasCC.filter(ac => queues.some(q => q.id === ac.colaId));
    const disponibles = ccAgents.filter(a => a.status === 'available').length;
    const avgSla = queues.length > 0 ? Math.round(queues.reduce((s, q) => s + q.nivelServicioPct, 0) / queues.length) : 0;

    const html = `
      <div class="grid-4" style="margin-bottom:24px">
        ${Components.MetricCard({ label: 'En Cola', value: enCola.length, icon: 'clock', iconColor: 'orange' })}
        ${Components.MetricCard({ label: 'Llamadas Activas', value: activeCalls.length, icon: 'phone', iconColor: 'blue' })}
        ${Components.MetricCard({ label: 'Agentes Disponibles', value: disponibles, icon: 'user-check', iconColor: 'green', trend: disponibles > 0 ? 'up' : 'down', trendValue: disponibles > 0 ? 'listos' : 'ninguno' })}
        ${Components.MetricCard({ label: 'Nivel Servicio', value: avgSla, unit: '%', icon: 'chart-line', iconColor: 'violet' })}
      </div>

      <div style="margin-bottom:16px">
        <select class="form-select" id="cc-pbx-filter" style="min-width:200px">
          <option value="">Todas las PBX</option>
          ${DATA.pbxServers.filter(p => p.status !== 'offline').map(p =>
            `<option value="${p.id}" ${this.pbxFilter === p.id ? 'selected' : ''}>${p.nombre}</option>`
          ).join('')}
        </select>
      </div>

      <div class="grid-3" style="margin-bottom:24px">
        ${activeQueues.slice(0, 6).map(q => Components.QueueCard(q)).join('')}
      </div>

      <div class="grid-2" style="margin-bottom:24px">
        <div class="card">
          <div class="card-header"><span class="card-title">Llamadas Activas</span> <span class="status-badge active">${activeCalls.length} activas</span></div>
          <div class="card-body" style="padding:0">
            ${this.renderActiveCallsTable(activeCalls)}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Llamadas en Cola</span> <span class="status-badge warning">${enCola.length} esperando</span></div>
          <div class="card-body" style="padding:0">
            ${this.renderQueuedCallsTable(enCola)}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    document.getElementById('cc-pbx-filter')?.addEventListener('change', (e) => {
      this.pbxFilter = e.target.value;
      this.render(container);
    });
  },

  renderActiveCallsTable(calls) {
    if (calls.length === 0) return '<div class="empty-state" style="padding:20px"><i class="fas fa-phone-slash"></i><h3>Sin llamadas activas</h3></div>';

    const headers = [
      { key: 'dir', label: 'Dir' },
      { key: 'caller', label: 'Origen' },
      { key: 'agent', label: 'Agente' },
      { key: 'cola', label: 'Cola' },
      { key: 'duracion', label: 'Duración' }
    ];

    const rows = calls.map(c => ({
      dir: c.direccion === 'inbound' ? '<i class="fas fa-arrow-down" style="color:var(--success)"></i>' : '<i class="fas fa-arrow-up" style="color:var(--info)"></i>',
      caller: c.callerNumber,
      agent: `${c.agentName} <span style="color:var(--text-muted)">${c.agentExtension}</span>`,
      cola: c.colaNombre,
      duracion: `<span style="color:${c.duracionSeg > 300 ? 'var(--danger)' : c.duracionSeg > 180 ? 'var(--warning)' : 'var(--text-primary)'}">${Utils.formatDuration(c.duracionSeg)}</span>`
    }));

    return Components.DataTable({ headers, rows });
  },

  renderQueuedCallsTable(calls) {
    if (calls.length === 0) return '<div class="empty-state" style="padding:20px"><i class="fas fa-check-circle" style="color:var(--success)"></i><h3>Sin llamadas en espera</h3></div>';

    const sorted = [...calls].sort((a, b) => {
      const pri = { vip: 0, high: 1, normal: 2 };
      const pa = pri[a.prioridad] || 3;
      const pb = pri[b.prioridad] || 3;
      if (pa !== pb) return pa - pb;
      return b.tiempoEsperaSeg - a.tiempoEsperaSeg;
    });

    const headers = [
      { key: 'prioridad', label: 'Prioridad' },
      { key: 'caller', label: 'Número' },
      { key: 'cola', label: 'Cola' },
      { key: 'espera', label: 'Espera' },
      { key: 'pos', label: 'Pos' }
    ];

    const rows = sorted.map(c => ({
      prioridad: Components.PriorityBadge(c.prioridad),
      caller: c.callerNumber,
      cola: c.colaNombre,
      espera: `<span style="color:${c.tiempoEsperaSeg > 120 ? 'var(--danger)' : c.tiempoEsperaSeg > 60 ? 'var(--warning)' : 'var(--text-primary)'}">${Utils.formatDuration(c.tiempoEsperaSeg)}</span>`,
      pos: `#${c.posicion}`
    }));

    return Components.DataTable({ headers, rows });
  }
};

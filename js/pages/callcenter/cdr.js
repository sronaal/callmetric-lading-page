const CCCdrPage = {
  activeTab: 'llamadas',

  render(container) {
    const totalCalls = DATA.cdrLlamadas.length;
    const totalQueues = DATA.colasCallCenter.length;
    const totalAgents = DATA.agentesCC.length;
    const answered = DATA.cdrLlamadas.filter(c => c.disposicion === 'answered').length;
    const efectividad = totalCalls > 0 ? Math.round((answered / totalCalls) * 100) : 0;

    const html = `
      <div class="grid-4" style="margin-bottom:24px">
        ${Components.MetricCardSmall({ label: 'Llamadas', value: totalCalls, icon: 'phone', color: 'cyan' })}
        ${Components.MetricCardSmall({ label: 'Colas', value: totalQueues, icon: 'layer-group', color: 'violet' })}
        ${Components.MetricCardSmall({ label: 'Agentes', value: totalAgents, icon: 'user-tie', color: 'blue' })}
        ${Components.MetricCardSmall({ label: 'Efectividad', value: `${efectividad}%`, sub: `${answered} contestadas`, color: 'green' })}
      </div>

      <div class="card">
        <div class="tabs" style="padding:0 20px">
          <button class="tab cc-tab ${this.activeTab === 'llamadas' ? 'active' : ''}" data-tab="llamadas">Llamadas</button>
          <button class="tab cc-tab ${this.activeTab === 'colas' ? 'active' : ''}" data-tab="colas">Colas</button>
          <button class="tab cc-tab ${this.activeTab === 'agentes' ? 'active' : ''}" data-tab="agentes">Agentes</button>
          <button class="tab cc-tab ${this.activeTab === 'global' ? 'active' : ''}" data-tab="global">Global</button>
        </div>
        <div class="card-body" id="cdr-tab-content">
          ${this.renderTabContent()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.bindEvents();
  },

  renderTabContent() {
    switch (this.activeTab) {
      case 'llamadas': return this.renderLlamadasTab();
      case 'colas': return this.renderColasTab();
      case 'agentes': return this.renderAgentesTab();
      case 'global': return this.renderGlobalTab();
      default: return '';
    }
  },

  renderLlamadasTab() {
    const rows = DATA.cdrLlamadas.slice(0, 15).map(c => ({
      caller: c.caller_number,
      agente: c.agent_name || '—',
      cola: c.cola_nombre,
      inicio: Utils.formatDate(c.inicio),
      duracion: Utils.formatDuration(c.duracion_seg),
      disposicion: `<span class="status-badge ${c.disposicion}">${Utils.statusLabel(c.disposicion)}</span>`
    }));

    return Components.DataTable({
      headers: [
        { key: 'caller', label: 'Número' },
        { key: 'agente', label: 'Agente' },
        { key: 'cola', label: 'Cola' },
        { key: 'inicio', label: 'Inicio' },
        { key: 'duracion', label: 'Duración' },
        { key: 'disposicion', label: 'Disposición' }
      ],
      rows,
      emptyMessage: 'No hay registros CDR'
    });
  },

  renderColasTab() {
    const rows = DATA.colasCallCenter.filter(q => q.llamadas_atendidas_hoy > 0).map(q => ({
      nombre: q.nombre,
      extension: q.extension,
      atendidas: q.llamadas_atendidas_hoy,
      abandonadas: q.llamadas_abandonadas_hoy,
      total: q.llamadas_atendidas_hoy + q.llamadas_abandonadas_hoy,
      sla: `<div style="display:flex;align-items:center;gap:8px"><div class="queue-sla-bar" style="flex:1;margin:0"><div class="queue-sla-fill" style="width:${q.nivel_servicio_pct}%;background:${Utils.slaColor(q.nivel_servicio_pct)}"></div></div><span style="font-size:0.8rem">${q.nivel_servicio_pct}%</span></div>`,
      espera: Utils.formatDuration(q.tiempo_promedio_espera_seg)
    }));

    return Components.DataTable({
      headers: [
        { key: 'nombre', label: 'Cola' },
        { key: 'extension', label: 'Ext' },
        { key: 'atendidas', label: 'Atendidas' },
        { key: 'abandonadas', label: 'Abandonadas' },
        { key: 'total', label: 'Total' },
        { key: 'sla', label: 'SLA' },
        { key: 'espera', label: 'T. Espera' }
      ],
      rows,
      emptyMessage: 'Sin datos de colas'
    });
  },

  renderAgentesTab() {
    const rows = DATA.agentesCC.filter(a => a.llamadas_atendidas_hoy > 0).sort((a, b) => b.llamadas_atendidas_hoy - a.llamadas_atendidas_hoy).map(a => ({
      nombre: a.nombre,
      cola: a.cola_nombre,
      atendidas: a.llamadas_atendidas_hoy,
      aht: Utils.formatDuration(a.tiempo_promedio_manejo_seg),
      logueado: Utils.formatDuration(a.tiempo_logueado_seg),
      efectividad: `${a.tiempo_promedio_manejo_seg > 0 ? Math.round(3600 / a.tiempo_promedio_manejo_seg * a.llamadas_atendidas_hoy) : 0} llam/h`
    }));

    return Components.DataTable({
      headers: [
        { key: 'nombre', label: 'Agente' },
        { key: 'cola', label: 'Cola' },
        { key: 'atendidas', label: 'Atendidas' },
        { key: 'aht', label: 'AHT' },
        { key: 'logueado', label: 'T. Logueado' },
        { key: 'efectividad', label: 'Efectividad' }
      ],
      rows,
      emptyMessage: 'Sin datos de agentes'
    });
  },

  renderGlobalTab() {
    const rows = DATA.reportesDiarios.slice(-14).map(r => ({
      fecha: Utils.formatDate(r.fecha),
      recibidas: r.llamadas_recibidas,
      atendidas: r.llamadas_atendidas,
      abandonadas: r.llamadas_abandonadas,
      sla: `<span style="color:${Utils.slaColor(r.nivel_servicio_pct)};font-weight:600">${r.nivel_servicio_pct}%</span>`,
      espera: Utils.formatDuration(r.tiempo_promedio_espera_seg),
      manejo: Utils.formatDuration(r.tiempo_promedio_manejo_seg),
      agentes: r.agentes_activos
    }));

    return `
      <div style="margin-bottom:16px;font-size:0.85rem;color:var(--text-muted)">Últimos 14 días</div>
      ${Components.DataTable({
        headers: [
          { key: 'fecha', label: 'Fecha' },
          { key: 'recibidas', label: 'Recibidas' },
          { key: 'atendidas', label: 'Atendidas' },
          { key: 'abandonadas', label: 'Abandonadas' },
          { key: 'sla', label: 'SLA' },
          { key: 'espera', label: 'T. Espera' },
          { key: 'manejo', label: 'T. Manejo' },
          { key: 'agentes', label: 'Agentes' }
        ],
        rows,
        emptyMessage: 'Sin reportes diarios'
      })}
    `;
  },

  bindEvents() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.onclick = () => {
        this.activeTab = tab.dataset.tab;
        this.render(document.getElementById('page-content'));
      };
    });
  }
};

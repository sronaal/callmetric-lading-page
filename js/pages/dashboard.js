const DashboardPage = {
  render(container) {
    const pbxActive = DATA.pbxServers.filter(p => p.estado === 'Activo').length;
    const alertsActive = DATA.alertas.filter(a => a.estado === 'Activa').length;
    const agentsActive = DATA.agentesMonitoreo.filter(a => a.estado === 'Activo').length;

    const html = `
      <div class="grid-4" style="margin-bottom:24px">
        ${Components.MetricCard({ label: 'Servidores PBX', value: DATA.pbxServers.length, icon: 'server', trend: 'up', trendValue: pbxActive + ' activos', iconColor: 'cyan' })}
        ${Components.MetricCard({ label: 'Llamadas Hoy', value: DATA.llamadas.length, icon: 'phone', trend: 'up', trendValue: 'hoy', iconColor: 'green' })}
        ${Components.MetricCard({ label: 'Alertas Activas', value: alertsActive, icon: 'bell', trend: alertsActive > 2 ? 'up' : 'down', trendValue: alertsActive > 2 ? 'requiere atencion' : 'sin novedad', iconColor: alertsActive > 2 ? 'orange' : 'green' })}
        ${Components.MetricCard({ label: 'Agentes', value: DATA.agentesMonitoreo.length, icon: 'robot', trend: 'up', trendValue: agentsActive + ' activos', iconColor: 'blue' })}
      </div>

      <div class="grid-2" style="margin-bottom:24px">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Rendimiento del Sistema</span>
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm btn-secondary metric-tab active" data-metric="cpu">CPU</button>
              <button class="btn btn-sm btn-secondary metric-tab" data-metric="ram">RAM</button>
              <button class="btn btn-sm btn-secondary metric-tab" data-metric="latency">Latencia</button>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container"><canvas id="main-chart"></canvas></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Conexiones AMI</span></div>
          <div class="card-body">
            <div class="chart-container"><canvas id="ami-chart"></canvas></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Resumen del Sistema</span></div>
        <div class="card-body">
          <div class="grid-4" style="gap:16px">
            <div><div style="color:var(--text-muted);font-size:0.75rem">Total Empresas</div><div style="font-size:1.2rem;font-weight:600;margin-top:2px">${DATA.empresas.length}</div></div>
            <div><div style="color:var(--text-muted);font-size:0.75rem">Usuarios Registrados</div><div style="font-size:1.2rem;font-weight:600;margin-top:2px">${DATA.usuarios.length}</div></div>
            <div><div style="color:var(--text-muted);font-size:0.75rem">Servidores PBX</div><div style="font-size:1.2rem;font-weight:600;margin-top:2px">${DATA.pbxServers.length}</div></div>
            <div><div style="color:var(--text-muted);font-size:0.75rem">Agentes Monitoreo</div><div style="font-size:1.2rem;font-weight:600;margin-top:2px">${DATA.agentesMonitoreo.length}</div></div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.initCharts();
    this.bindEvents();
  },

  initCharts() {
    const labels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

    const cpuData = [25, 22, 20, 18, 30, 65, 72, 68, 55, 45, 35, 28];
    const ramData = [40, 38, 36, 35, 42, 55, 62, 60, 52, 48, 44, 41];
    const latData = [8, 7, 6, 5, 10, 25, 30, 28, 18, 12, 9, 8];

    const mainCtx = document.getElementById('main-chart');
    if (mainCtx) {
      const chart = new Chart(mainCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'CPU %',
            data: cpuData,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(51,65,85,0.3)' }, ticks: { color: '#94a3b8', maxTicksLimit: 6 } },
            y: { grid: { color: 'rgba(51,65,85,0.3)' }, ticks: { color: '#94a3b8' }, beginAtZero: true, max: 100 }
          }
        }
      });
      App.addChart(chart);
      window._mainChart = chart;
      window._mainData = { cpu: cpuData, ram: ramData, latency: latData };
    }

    const amiCtx = document.getElementById('ami-chart');
    if (amiCtx) {
      const chart = new Chart(amiCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Conectadas', data: [4, 4, 4, 3, 4, 5, 5, 5, 4, 4, 4, 4], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2 },
            { label: 'Desconectadas', data: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 1 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 12, padding: 12 } } },
          scales: {
            x: { grid: { color: 'rgba(51,65,85,0.3)' }, ticks: { color: '#94a3b8', maxTicksLimit: 6 } },
            y: { grid: { color: 'rgba(51,65,85,0.3)' }, ticks: { color: '#94a3b8' }, beginAtZero: true, max: 6 }
          }
        }
      });
      App.addChart(chart);
    }
  },

  bindEvents() {
    document.querySelectorAll('.metric-tab').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.metric-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const metric = btn.dataset.metric;
        const chart = window._mainChart;
        const data = window._mainData;
        if (chart && data) {
          const labels = { cpu: 'CPU %', ram: 'RAM %', latency: 'Latencia (ms)' };
          const colors = { cpu: '#06b6d4', ram: '#8b5cf6', latency: '#eab308' };
          chart.data.datasets[0].label = labels[metric];
          chart.data.datasets[0].data = data[metric] || data.cpu;
          chart.data.datasets[0].borderColor = colors[metric];
          chart.data.datasets[0].backgroundColor = colors[metric].replace(')', ',0.1)').replace('rgb', 'rgba');
          chart.update();
        }
      };
    });
  }
};

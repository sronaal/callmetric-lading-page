const CCQueuesPage = {
  render(container) {
    const user = Auth.getUser();
    const empresas = user.rol === 'super_admin'
      ? DATA.empresas
      : DATA.empresas.filter(e => e.id === user.empresaId);

    const queueGroups = {};
    DATA.colasCallCenter.forEach(q => {
      const empresa = DATA.empresas.find(e => e.id === q.empresaId);
      const key = empresa ? empresa.nombre : 'Sin empresa';
      if (!queueGroups[key]) queueGroups[key] = [];
      queueGroups[key].push(q);
    });

    let html = '';

    Object.entries(queueGroups).forEach(([empresa, queues]) => {
      if (!empresas.some(e => e.nombre === empresa)) return;

      html += `
        <h3 style="margin-bottom:16px;color:var(--text-secondary)"><i class="fas fa-building"></i> ${empresa}</h3>
        <div class="grid-3" style="margin-bottom:24px">
          ${queues.map(q => `<div>${Components.QueueCard(q)}</div>`).join('')}
        </div>
      `;
    });

    if (!html) {
      html = '<div class="empty-state"><i class="fas fa-layer-group"></i><h3>No hay colas configuradas</h3></div>';
    }

    container.innerHTML = html;
  }
};

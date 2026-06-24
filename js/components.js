const Components = {
  MetricCard({ label, value, icon, trend, trendValue, iconColor = 'cyan', unit = '' }) {
    const trendClass = trend || 'neutral';
    const trendIcon = trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'minus';
    return `
      <div class="metric-card">
        <div class="metric-card-info">
          <div class="metric-card-label">${label}</div>
          <div class="metric-card-value">${Utils.formatNumber(value)}${unit ? `<span style="font-size:0.8rem;color:var(--text-muted);font-weight:400;margin-left:4px">${unit}</span>` : ''}</div>
          ${trend ? `<div class="metric-card-trend ${trendClass}"><i class="fas fa-${trendIcon}"></i> ${trendValue || ''}</div>` : ''}
        </div>
        <div class="metric-card-icon ${iconColor}"><i class="fas fa-${icon}"></i></div>
      </div>
    `;
  },

  StatusBadge(status) {
    const cls = status || 'unknown';
    const label = Utils.statusLabel(status);
    return `<span class="status-badge ${cls}"><i class="fas fa-circle"></i> ${label}</span>`;
  },

  AgentStatusDot(status) {
    const cls = status || 'offline';
    const label = Utils.statusLabel(status);
    return `<span class="agent-status-dot"><span class="dot ${cls}"></span> ${label}</span>`;
  },

  PriorityBadge(priority) {
    const cls = priority || 'normal';
    const label = Utils.statusLabel(priority);
    return `<span class="priority-badge ${cls}">${label}</span>`;
  },

  DataTable({ headers, rows, onRowClick, emptyMessage = 'No hay datos disponibles' }) {
    let html = '<div class="table-container"><table class="data-table"><thead><tr>';
    headers.forEach(h => {
      html += `<th data-key="${h.key}" class="sortable">${h.label} <i class="fas fa-sort"></i></th>`;
    });
    html += '</tr></thead><tbody>';
    if (rows.length === 0) {
      html += `<tr><td colspan="${headers.length}" style="text-align:center;padding:40px;color:var(--text-muted)">${emptyMessage}</td></tr>`;
    } else {
      rows.forEach((row, idx) => {
        const clickable = onRowClick ? 'clickable' : '';
        html += `<tr class="${clickable}" data-index="${idx}">`;
        headers.forEach(h => {
          let val = row[h.key] ?? '—';
          if (h.render) val = h.render(val, row);
          html += `<td>${val}</td>`;
        });
        html += '</tr>';
      });
    }
    html += '</tbody></table></div>';
    return html;
  },

  QueueCard(queue) {
    const slaPct = queue.nivel_servicio_pct || 0;
    const slaColor = Utils.slaColor(slaPct);
    const statusLabel = Utils.statusLabel(queue.estado);
    const statusClass = queue.estado === 'overflow' ? 'critical' : queue.estado === 'Inactivo' ? 'inactive' : 'active';
    return `
      <div class="queue-card">
        <div class="queue-card-header">
          <div>
            <div class="queue-card-name">${queue.nombre}</div>
            <div class="queue-card-ext">${queue.extension}</div>
          </div>
          <span class="status-badge ${statusClass}"><i class="fas fa-circle"></i> ${statusLabel}</span>
        </div>
        <div class="queue-card-stats">
          <div class="queue-stat"><div class="queue-stat-value" style="color:${slaColor}">${slaPct}%</div><div class="queue-stat-label">SLA</div></div>
        </div>
        <div class="queue-sla-bar"><div class="queue-sla-fill" style="width:${slaPct}%;background:${slaColor}"></div></div>
        <div class="queue-sla-text">
          <span>Atendidas: ${queue.llamadas_atendidas_hoy}</span>
          <span>Abandonadas: ${queue.llamadas_abandonadas_hoy}</span>
          <span>${Utils.formatDuration(queue.tiempo_promedio_espera_seg)} espera</span>
        </div>
      </div>
    `;
  },

  AlertCard(alert) {
    const icon = Utils.iconForSeverity(alert.severidad);
    const iconClass = alert.severidad === 'Alta' ? 'critical' : alert.severidad === 'Media' ? 'warning' : 'info';
    return `
      <div class="alert-card" data-id="${alert.id}">
        <div class="alert-icon ${iconClass}"><i class="fas fa-${icon}"></i></div>
        <div class="alert-body">
          <div class="alert-title">${alert.tipo}: ${alert.mensaje}</div>
          <div class="alert-meta">${Utils.formatDate(alert.fecha, { relative: true })}</div>
        </div>
        <div class="alert-actions">
          ${Components.StatusBadge(alert.severidad)}
          ${alert.estado === 'Nueva' ? '<button class="btn btn-ghost btn-sm acknowledge-btn" data-id="' + alert.id + '"><i class="fas fa-check"></i> Reconocer</button>' : ''}
        </div>
      </div>
    `;
  },

  Modal(title, bodyHtml, { onConfirm, confirmText = 'Guardar', cancelText = 'Cancelar', showConfirm = true, size = 'md' } = {}) {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" id="modal-close-btn"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      ${showConfirm ? `<div class="modal-footer">
        <button class="btn btn-secondary" id="modal-cancel-btn">${cancelText}</button>
        <button class="btn btn-primary" id="modal-confirm-btn">${confirmText}</button>
      </div>` : ''}
    `;
    overlay.classList.remove('hidden');

    document.getElementById('modal-close-btn').onclick = () => Components.closeModal();
    if (showConfirm) {
      document.getElementById('modal-cancel-btn').onclick = () => Components.closeModal();
      document.getElementById('modal-confirm-btn').onclick = () => {
        if (onConfirm) onConfirm();
        Components.closeModal();
      };
    }
    overlay.onclick = (e) => { if (e.target === overlay) Components.closeModal(); };
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') { Components.closeModal(); document.removeEventListener('keydown', escHandler); }
    });
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('hidden');
  },

  Toast(type, title, message, duration = 5000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: 'check-circle', warning: 'exclamation-circle', critical: 'times-circle', info: 'info-circle' };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fas fa-${icons[type] || icons.info} toast-icon ${type}"></i>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    toast.querySelector('.toast-close').onclick = () => toast.remove();
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, duration);
  },

  showLoading(container) {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  },

  Input({ label, id, type = 'text', value = '', placeholder = '', required = false, error = '' }) {
    return `
      <div class="form-group">
        <label class="form-label" for="${id}">${label}${required ? ' <span style="color:var(--danger)">*</span>' : ''}</label>
        <input class="form-input" type="${type}" id="${id}" name="${id}" value="${value}" placeholder="${placeholder}" ${required ? 'required' : ''}>
        ${error ? `<div class="form-error">${error}</div>` : ''}
      </div>
    `;
  },

  Select({ label, id, options, value = '', required = false }) {
    let opts = options.map(o =>
      `<option value="${o.value}" ${o.value === value ? 'selected' : ''}>${o.label}</option>`
    ).join('');
    return `
      <div class="form-group">
        <label class="form-label" for="${id}">${label}${required ? ' <span style="color:var(--danger)">*</span>' : ''}</label>
        <select class="form-select" id="${id}" name="${id}" ${required ? 'required' : ''}>${opts}</select>
      </div>
    `;
  },

  MetricCardSmall({ label, value, sub, color = 'cyan' }) {
    return `<div class="metric-card" style="padding:14px;text-align:center"><div class="metric-card-label">${label}</div><div class="metric-card-value" style="font-size:1.4rem;color:var(--${color})">${value}</div>${sub ? `<div style="font-size:0.75rem;color:var(--text-muted)">${sub}</div>` : ''}</div>`;
  },

  paginate(array, page, pageSize = 10) {
    const start = (page - 1) * pageSize;
    return { items: array.slice(start, start + pageSize), total: array.length, pages: Math.ceil(array.length / pageSize) };
  },

  renderPagination(total, page, pages, onChange) {
    return `
      <div class="table-pagination">
        <span>${(page - 1) * 10 + 1}-${Math.min(page * 10, total)} de ${total}</span>
        <button class="page-prev" ${page <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>
        <span>${page} / ${pages}</span>
        <button class="page-next" ${page >= pages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>
      </div>
    `;
  },

  DetailGrid(items) {
    return `<div class="detail-grid">${items.map(item => `
      <div class="metric-card" style="flex-direction:column;gap:4px;padding:14px">
        <div style="font-size:0.75rem;color:var(--text-muted)">${item.label}</div>
        <div style="font-size:1.1rem;font-weight:600">${item.value}</div>
      </div>
    `).join('')}</div>`;
  }
};

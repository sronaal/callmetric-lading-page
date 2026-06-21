const Utils = {
  formatDate(dateStr, options = {}) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (options.relative) {
      const diff = Date.now() - d.getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'ahora';
      if (mins < 60) return `hace ${mins} min`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `hace ${hours}h`;
      const days = Math.floor(hours / 24);
      return `hace ${days}d`;
    }
    return d.toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  },

  formatDuration(seconds) {
    if (!seconds || seconds === 0) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  },

  statusColor(status) {
    const map = {
      healthy: '#22c55e', active: '#22c55e', ok: '#22c55e', available: '#22c55e',
      warning: '#eab308', degraded: '#eab308', break: '#eab308', pending: '#eab308', 'wrap-up': '#eab308',
      critical: '#ef4444', failed: '#ef4444', missed: '#ef4444', offline: '#ef4444', 'logged_out': '#6b7280',
      'on-call': '#3b82f6', ringing: '#8b5cf6', inactive: '#6b7280', overflow: '#ef4444',
      completed: '#22c55e', acknowledged: '#eab308', resolved: '#6b7280',
      info: '#3b82f6'
    };
    return map[status] || '#6b7280';
  },

  statusLabel(status) {
    const map = {
      healthy: 'Saludable', active: 'Activo', ok: 'OK', available: 'Disponible',
      warning: 'Advertencia', degraded: 'Degradado', break: 'Pausa', pending: 'Pendiente', 'wrap-up': 'Wrap-up',
      critical: 'Crítico', failed: 'Fallida', missed: 'Perdida', offline: 'Offline', 'logged_out': 'Desconectado',
      'on-call': 'En llamada', ringing: 'Timbre', inactive: 'Inactivo', overflow: 'Overflow',
      completed: 'Completada', acknowledged: 'Reconocida', resolved: 'Resuelta',
      info: 'Info', 'super_admin': 'Super Admin', 'admin_tenant': 'Admin Tenant',
      supervisor: 'Supervisor', operador: 'Operador',
      answered: 'Contestada', abandoned: 'Abandonada', transferred: 'Transferida', voicemail: 'Buzón', failed: 'Fallida',
      starter: 'Starter', professional: 'Professional', enterprise: 'Enterprise',
      'ringall': 'Ring All', 'roundrobin': 'Round Robin', 'leastrecent': 'Least Recent',
      'fewestcalls': 'Fewest Calls', 'random': 'Random', 'rrmemory': 'RR Memory',
      normal: 'Normal', high: 'Alta', vip: 'VIP',
      inbound: 'Entrante', outbound: 'Saliente',
    };
    return map[status] || status;
  },

  iconForSeverity(severity) {
    const map = { info: 'info-circle', warning: 'exclamation-triangle', critical: 'bolt' };
    return map[severity] || 'info-circle';
  },

  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  formatPercent(value) {
    return `${Math.round(value)}%`;
  },

  formatNumber(n) {
    return n?.toLocaleString('es-ES') || '0';
  },

  slaColor(pct) {
    if (pct >= 90) return '#22c55e';
    if (pct >= 75) return '#eab308';
    return '#ef4444';
  },

  filterData(array, filters) {
    return array.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === '') return true;
        const itemValue = String(item[key] || '').toLowerCase();
        return itemValue.includes(String(value).toLowerCase());
      });
    });
  },

  sortData(array, key, dir = 'asc') {
    return [...array].sort((a, b) => {
      const va = a[key] ?? '';
      const vb = b[key] ?? '';
      if (typeof va === 'number' && typeof vb === 'number') {
        return dir === 'asc' ? va - vb : vb - va;
      }
      return dir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }
};

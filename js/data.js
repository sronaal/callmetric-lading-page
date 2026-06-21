const DATA = {
  empresas: [
    { id: 'emp-001', nombre: 'Corporación Nova', subdominio: 'nova', plan: 'enterprise', activo: true },
    { id: 'emp-002', nombre: 'Tecnología Andina', subdominio: 'andina', plan: 'professional', activo: true },
    { id: 'emp-003', nombre: 'Servicios Globales', subdominio: 'global', plan: 'starter', activo: false },
  ],

  usuarios: [
    { id: 'usr-001', empresaId: 'emp-001', nombre: 'Admin Global', email: 'admin@callmetric.io', rol: 'super_admin', activo: true, ultimoAcceso: '2026-06-21T08:30:00Z' },
    { id: 'usr-002', empresaId: 'emp-001', nombre: 'Carlos Méndez', email: 'carlos@nova.com', rol: 'admin_tenant', activo: true, ultimoAcceso: '2026-06-21T09:00:00Z' },
    { id: 'usr-003', empresaId: 'emp-001', nombre: 'Laura Vargas', email: 'laura@nova.com', rol: 'supervisor', activo: true, ultimoAcceso: '2026-06-21T10:15:00Z' },
    { id: 'usr-004', empresaId: 'emp-001', nombre: 'Pedro Rojas', email: 'pedro@nova.com', rol: 'operador', activo: true, ultimoAcceso: '2026-06-20T14:00:00Z' },
    { id: 'usr-005', empresaId: 'emp-002', nombre: 'Ana Torres', email: 'ana@andina.com', rol: 'admin_tenant', activo: true, ultimoAcceso: '2026-06-21T07:45:00Z' },
    { id: 'usr-006', empresaId: 'emp-002', nombre: 'Luis Campos', email: 'luis@andina.com', rol: 'supervisor', activo: false, ultimoAcceso: '2026-06-15T00:00:00Z' },
  ],

  pbxServers: [
    { id: 'pbx-001', empresaId: 'emp-001', nombre: 'PBX Principal', hostname: 'pbx01.nova.local', ip: '192.168.1.10', tipo: 'Asterisk', version: '20.5.1', status: 'healthy', activeCalls: 23, cpuUsage: 45, memoryUsage: 62, memoryTotal: '8 GB', diskUsage: 55, diskTotal: '120 GB', diskUsed: '66 GB', uptime: '45d 12h 30m', ultimoHeartbeat: '2026-06-21T11:00:00Z', ubicacion: 'Datacenter Principal', configuracion: { sipTrunks: 8, extensiones: 120, maxCalls: 200 } },
    { id: 'pbx-002', empresaId: 'emp-001', nombre: 'PBX Sucursal Norte', hostname: 'pbx02.nova.local', ip: '192.168.2.10', tipo: 'FreePBX', version: '16.0.30', status: 'warning', activeCalls: 8, cpuUsage: 72, memoryUsage: 80, memoryTotal: '4 GB', diskUsage: 78, diskTotal: '60 GB', diskUsed: '46.8 GB', uptime: '12d 5h 45m', ultimoHeartbeat: '2026-06-21T10:58:00Z', ubicacion: 'Sucursal Norte', configuracion: { sipTrunks: 4, extensiones: 50, maxCalls: 80 } },
    { id: 'pbx-003', empresaId: 'emp-002', nombre: 'PBX Andina HQ', hostname: 'pbx01.andina.local', ip: '10.0.0.20', tipo: 'Asterisk', version: '19.8.0', status: 'healthy', activeCalls: 15, cpuUsage: 32, memoryUsage: 45, memoryTotal: '16 GB', diskUsage: 40, diskTotal: '250 GB', diskUsed: '100 GB', uptime: '90d 2h 10m', ultimoHeartbeat: '2026-06-21T11:00:00Z', ubicacion: 'Datacenter Andina', configuracion: { sipTrunks: 12, extensiones: 200, maxCalls: 300 } },
    { id: 'pbx-004', empresaId: 'emp-002', nombre: 'PBX Backup', hostname: 'pbx02.andina.local', ip: '10.0.0.21', tipo: 'Issabel', version: '5.0.0', status: 'offline', activeCalls: 0, cpuUsage: 0, memoryUsage: 0, memoryTotal: '4 GB', diskUsage: 85, diskTotal: '80 GB', diskUsed: '68 GB', uptime: '0d 0h 0m', ultimoHeartbeat: '2026-06-20T08:00:00Z', ubicacion: 'Sitio Backup', configuracion: { sipTrunks: 2, extensiones: 30, maxCalls: 50 } },
  ],

  agentesMonitoreo: [
    { id: 'agt-001', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Agente Nova 1', tipo: 'Asterisk AMI', version: '3.2.0', status: 'active', ultimoHeartbeat: '2026-06-21T11:00:00Z', intervaloHeartbeat: 30, metricsCollected: 'calls, sip, system, queue, cdr', activo: true },
    { id: 'agt-002', empresaId: 'emp-001', pbxId: 'pbx-002', nombre: 'Agente Nova 2', tipo: 'Asterisk AMI', version: '3.1.5', status: 'active', ultimoHeartbeat: '2026-06-21T10:59:30Z', intervaloHeartbeat: 30, metricsCollected: 'calls, sip, system', activo: true },
    { id: 'agt-003', empresaId: 'emp-002', pbxId: 'pbx-003', nombre: 'Agente Andina 1', tipo: 'Asterisk AMI', version: '3.2.0', status: 'active', ultimoHeartbeat: '2026-06-21T11:00:00Z', intervaloHeartbeat: 30, metricsCollected: 'calls, sip, system, queue, cdr', activo: true },
    { id: 'agt-004', empresaId: 'emp-002', pbxId: 'pbx-004', nombre: 'Agente Andina 2', tipo: 'Asterisk AMI', version: '3.0.0', status: 'inactive', ultimoHeartbeat: '2026-06-19T10:00:00Z', intervaloHeartbeat: 60, metricsCollected: 'calls', activo: false },
    { id: 'agt-005', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Agente Nova 3', tipo: 'Asterisk AMI', version: '3.2.0', status: 'pending', ultimoHeartbeat: null, intervaloHeartbeat: 30, metricsCollected: '', activo: false },
  ],

  heartbeats: [
    { id: 'hb-001', agentId: 'agt-001', timestamp: '2026-06-21T11:00:00Z', status: 'ok', latenciaMs: 5, cpuUsage: 22, memoryUsage: 35, eventosProcesados: 1580, conexionAmi: true },
    { id: 'hb-002', agentId: 'agt-001', timestamp: '2026-06-21T10:59:30Z', status: 'ok', latenciaMs: 4, cpuUsage: 20, memoryUsage: 34, eventosProcesados: 1575, conexionAmi: true },
    { id: 'hb-003', agentId: 'agt-001', timestamp: '2026-06-21T10:59:00Z', status: 'ok', latenciaMs: 6, cpuUsage: 21, memoryUsage: 35, eventosProcesados: 1570, conexionAmi: true },
    { id: 'hb-004', agentId: 'agt-001', timestamp: '2026-06-21T10:58:30Z', status: 'degraded', latenciaMs: 45, cpuUsage: 65, memoryUsage: 70, eventosProcesados: 1565, conexionAmi: true },
    { id: 'hb-005', agentId: 'agt-001', timestamp: '2026-06-21T10:58:00Z', status: 'ok', latenciaMs: 3, cpuUsage: 19, memoryUsage: 33, eventosProcesados: 1560, conexionAmi: true },
    { id: 'hb-006', agentId: 'agt-003', timestamp: '2026-06-21T11:00:00Z', status: 'ok', latenciaMs: 7, cpuUsage: 25, memoryUsage: 40, eventosProcesados: 2100, conexionAmi: true },
    { id: 'hb-007', agentId: 'agt-002', timestamp: '2026-06-21T10:59:30Z', status: 'ok', latenciaMs: 8, cpuUsage: 30, memoryUsage: 45, eventosProcesados: 890, conexionAmi: true },
  ],

  llamadas: [
    { id: 'll-001', pbxId: 'pbx-001', callId: 'CALL-001', origen: '555-0101', destino: '555-1001', status: 'active', duracionSeg: 245, mosScore: 4.2, jitterMs: 3, latenciaMs: 15, packetLossPct: 0.1, codec: 'G.711', sipTrunk: 'Troncal-01' },
    { id: 'll-002', pbxId: 'pbx-001', callId: 'CALL-002', origen: '555-0102', destino: '555-1002', status: 'active', duracionSeg: 120, mosScore: 3.8, jitterMs: 8, latenciaMs: 25, packetLossPct: 0.5, codec: 'G.729', sipTrunk: 'Troncal-01' },
    { id: 'll-003', pbxId: 'pbx-001', callId: 'CALL-003', origen: '555-0103', destino: '800-555-0199', status: 'completed', duracionSeg: 562, mosScore: 4.5, jitterMs: 2, latenciaMs: 10, packetLossPct: 0.0, codec: 'G.711', sipTrunk: 'Troncal-02' },
    { id: 'll-004', pbxId: 'pbx-001', callId: 'CALL-004', origen: '555-0104', destino: '555-1004', status: 'failed', duracionSeg: 12, mosScore: 1.2, jitterMs: 45, latenciaMs: 120, packetLossPct: 5.0, codec: 'G.729', sipTrunk: 'Troncal-01' },
    { id: 'll-005', pbxId: 'pbx-002', callId: 'CALL-005', origen: '555-0201', destino: '555-2001', status: 'active', duracionSeg: 89, mosScore: 3.5, jitterMs: 12, latenciaMs: 30, packetLossPct: 1.2, codec: 'G.722', sipTrunk: 'Troncal-Norte' },
    { id: 'll-006', pbxId: 'pbx-003', callId: 'CALL-006', origen: '555-0301', destino: '555-3001', status: 'completed', duracionSeg: 180, mosScore: 4.0, jitterMs: 5, latenciaMs: 18, packetLossPct: 0.2, codec: 'G.711', sipTrunk: 'Troncal-Andina' },
    { id: 'll-007', pbxId: 'pbx-001', callId: 'CALL-007', origen: '555-0105', destino: '555-1005', status: 'missed', duracionSeg: 0, mosScore: 0, jitterMs: 0, latenciaMs: 0, packetLossPct: 0, codec: '-', sipTrunk: 'Troncal-01' },
    { id: 'll-008', pbxId: 'pbx-001', callId: 'CALL-008', origen: '555-0106', destino: '555-1006', status: 'active', duracionSeg: 450, mosScore: 4.1, jitterMs: 4, latenciaMs: 12, packetLossPct: 0.1, codec: 'G.711', sipTrunk: 'Troncal-02' },
    { id: 'll-009', pbxId: 'pbx-003', callId: 'CALL-009', origen: '555-0302', destino: '555-3002', status: 'completed', duracionSeg: 320, mosScore: 4.3, jitterMs: 3, latenciaMs: 14, packetLossPct: 0.0, codec: 'G.711', sipTrunk: 'Troncal-Andina' },
    { id: 'll-010', pbxId: 'pbx-002', callId: 'CALL-010', origen: '555-0202', destino: '555-2002', status: 'completed', duracionSeg: 90, mosScore: 3.9, jitterMs: 6, latenciaMs: 20, packetLossPct: 0.3, codec: 'G.729', sipTrunk: 'Troncal-Norte' },
  ],

  alertas: [
    { id: 'al-001', pbxId: 'pbx-002', tipo: 'cpu', severidad: 'warning', titulo: 'CPU elevada en PBX Sucursal Norte', mensaje: 'El uso de CPU ha alcanzado el 72% (umbral: 70%)', status: 'active', creado: '2026-06-21T10:45:00Z' },
    { id: 'al-002', pbxId: 'pbx-002', tipo: 'memory', severidad: 'warning', titulo: 'Memoria alta en PBX Sucursal Norte', mensaje: 'Uso de memoria al 80% (umbral: 75%)', status: 'active', creado: '2026-06-21T10:40:00Z' },
    { id: 'al-003', pbxId: 'pbx-004', tipo: 'connectivity', severidad: 'critical', titulo: 'PBX Backup sin conexión', mensaje: 'No se recibe heartbeat desde hace más de 24 horas', status: 'active', creado: '2026-06-20T08:00:00Z' },
    { id: 'al-004', pbxId: 'pbx-001', tipo: 'calls', severidad: 'info', titulo: 'Pico de llamadas', mensaje: 'Se detectaron 45 llamadas concurrentes en la última hora', status: 'acknowledged', creado: '2026-06-21T09:00:00Z' },
    { id: 'al-005', pbxId: 'pbx-003', tipo: 'cpu', severidad: 'critical', titulo: 'CPU crítica en PBX Andina HQ', mensaje: 'Uso de CPU al 95% durante más de 5 minutos', status: 'resolved', creado: '2026-06-20T14:00:00Z' },
  ],

  eventosSIP: [
    { id: 'sip-001', pbxId: 'pbx-001', timestamp: '2026-06-21T11:00:00Z', metodo: 'INVITE', codigoStatus: 100, origen: '555-0101', destino: '555-1001', direccion: 'inbound', severidad: 'info' },
    { id: 'sip-002', pbxId: 'pbx-001', timestamp: '2026-06-21T10:59:55Z', metodo: 'BYE', codigoStatus: 200, origen: '555-1001', destino: '555-0101', direccion: 'outbound', severidad: 'info' },
    { id: 'sip-003', pbxId: 'pbx-002', timestamp: '2026-06-21T10:59:30Z', metodo: 'REGISTER', codigoStatus: 401, origen: '555-0201', destino: 'pbx02.nova.local', direccion: 'inbound', severidad: 'warning' },
    { id: 'sip-004', pbxId: 'pbx-003', timestamp: '2026-06-21T10:59:00Z', metodo: 'INVITE', codigoStatus: 180, origen: '555-0301', destino: '555-3001', direccion: 'inbound', severidad: 'info' },
    { id: 'sip-005', pbxId: 'pbx-001', timestamp: '2026-06-21T10:58:30Z', metodo: 'INVITE', codigoStatus: 503, origen: '555-0107', destino: '555-1007', direccion: 'inbound', severidad: 'critical' },
  ],

  colasCallCenter: [
    { id: 'cola-001', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Soporte Técnico', extension: '5000', estrategia: 'ringall', maxEsperaSeg: 120, status: 'active', llamadasEsperando: 3, agentesDisponibles: 2, agentesOcupados: 4, agentesLogueados: 8, llamadaMasAntiguaSeg: 85, tiempoPromedioEsperaSeg: 45, llamadasAtendidasHoy: 127, llamadasAbandonadasHoy: 15, nivelServicioPct: 88 },
    { id: 'cola-002', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Ventas', extension: '5001', estrategia: 'roundrobin', maxEsperaSeg: 180, status: 'active', llamadasEsperando: 1, agentesDisponibles: 3, agentesOcupados: 5, agentesLogueados: 10, llamadaMasAntiguaSeg: 45, tiempoPromedioEsperaSeg: 30, llamadasAtendidasHoy: 89, llamadasAbandonadasHoy: 8, nivelServicioPct: 92 },
    { id: 'cola-003', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Facturación', extension: '5002', estrategia: 'fewestcalls', maxEsperaSeg: 150, status: 'active', llamadasEsperando: 0, agentesDisponibles: 2, agentesOcupados: 2, agentesLogueados: 4, llamadaMasAntiguaSeg: 0, tiempoPromedioEsperaSeg: 20, llamadasAtendidasHoy: 45, llamadasAbandonadasHoy: 3, nivelServicioPct: 95 },
    { id: 'cola-004', empresaId: 'emp-001', pbxId: 'pbx-002', nombre: 'Soporte Norte', extension: '5010', estrategia: 'ringall', maxEsperaSeg: 120, status: 'active', llamadasEsperando: 2, agentesDisponibles: 0, agentesOcupados: 3, agentesLogueados: 4, llamadaMasAntiguaSeg: 110, tiempoPromedioEsperaSeg: 60, llamadasAtendidasHoy: 52, llamadasAbandonadasHoy: 10, nivelServicioPct: 72 },
    { id: 'cola-005', empresaId: 'emp-002', pbxId: 'pbx-003', nombre: 'Mesa de Ayuda', extension: '6000', estrategia: 'ringall', maxEsperaSeg: 90, status: 'active', llamadasEsperando: 4, agentesDisponibles: 1, agentesOcupados: 6, agentesLogueados: 10, llamadaMasAntiguaSeg: 75, tiempoPromedioEsperaSeg: 50, llamadasAtendidasHoy: 156, llamadasAbandonadasHoy: 22, nivelServicioPct: 82 },
    { id: 'cola-006', empresaId: 'emp-002', pbxId: 'pbx-003', nombre: 'Cobranzas', extension: '6001', estrategia: 'roundrobin', maxEsperaSeg: 200, status: 'inactive', llamadasEsperando: 0, agentesDisponibles: 0, agentesOcupados: 0, agentesLogueados: 0, llamadaMasAntiguaSeg: 0, tiempoPromedioEsperaSeg: 0, llamadasAtendidasHoy: 0, llamadasAbandonadasHoy: 0, nivelServicioPct: 100 },
    { id: 'cola-007', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Reclamos', extension: '5003', estrategia: 'rrmemory', maxEsperaSeg: 180, status: 'overflow', llamadasEsperando: 8, agentesDisponibles: 0, agentesOcupados: 3, agentesLogueados: 4, llamadaMasAntiguaSeg: 165, tiempoPromedioEsperaSeg: 90, llamadasAtendidasHoy: 34, llamadasAbandonadasHoy: 18, nivelServicioPct: 55 },
    { id: 'cola-008', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'VIP Client', extension: '5009', estrategia: 'ringall', maxEsperaSeg: 30, status: 'active', llamadasEsperando: 0, agentesDisponibles: 1, agentesOcupados: 1, agentesLogueados: 2, llamadaMasAntiguaSeg: 0, tiempoPromedioEsperaSeg: 5, llamadasAtendidasHoy: 12, llamadasAbandonadasHoy: 0, nivelServicioPct: 100 },
  ],

  agentesCC: [
    { id: 'ccagt-001', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'María García', extension: '101', colaId: 'cola-001', colaNombre: 'Soporte Técnico', status: 'on-call', llamadasAtendidasHoy: 18, tiempoPromedioManejoSeg: 240, tiempoLogueadoSeg: 25200, ultimoCambioStatus: '2026-06-21T10:55:00Z' },
    { id: 'ccagt-002', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Juan López', extension: '102', colaId: 'cola-001', colaNombre: 'Soporte Técnico', status: 'available', llamadasAtendidasHoy: 15, tiempoPromedioManejoSeg: 210, tiempoLogueadoSeg: 25200, ultimoCambioStatus: '2026-06-21T11:00:00Z' },
    { id: 'ccagt-003', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Ana Martínez', extension: '103', colaId: 'cola-001', colaNombre: 'Soporte Técnico', status: 'break', llamadasAtendidasHoy: 12, tiempoPromedioManejoSeg: 195, tiempoLogueadoSeg: 18000, ultimoCambioStatus: '2026-06-21T10:30:00Z' },
    { id: 'ccagt-004', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Roberto Sánchez', extension: '104', colaId: 'cola-002', colaNombre: 'Ventas', status: 'on-call', llamadasAtendidasHoy: 20, tiempoPromedioManejoSeg: 300, tiempoLogueadoSeg: 25200, ultimoCambioStatus: '2026-06-21T10:50:00Z' },
    { id: 'ccagt-005', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Sofía Torres', extension: '105', colaId: 'cola-002', colaNombre: 'Ventas', status: 'available', llamadasAtendidasHoy: 14, tiempoPromedioManejoSeg: 260, tiempoLogueadoSeg: 21600, ultimoCambioStatus: '2026-06-21T10:45:00Z' },
    { id: 'ccagt-006', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Diego Ramírez', extension: '106', colaId: 'cola-002', colaNombre: 'Ventas', status: 'wrap-up', llamadasAtendidasHoy: 16, tiempoPromedioManejoSeg: 280, tiempoLogueadoSeg: 25200, ultimoCambioStatus: '2026-06-21T10:58:00Z' },
    { id: 'ccagt-007', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Carmen Flores', extension: '107', colaId: 'cola-003', colaNombre: 'Facturación', status: 'ringing', llamadasAtendidasHoy: 8, tiempoPromedioManejoSeg: 180, tiempoLogueadoSeg: 18000, ultimoCambioStatus: '2026-06-21T11:00:30Z' },
    { id: 'ccagt-008', empresaId: 'emp-001', pbxId: 'pbx-002', nombre: 'Pablo Herrera', extension: '201', colaId: 'cola-004', colaNombre: 'Soporte Norte', status: 'on-call', llamadasAtendidasHoy: 10, tiempoPromedioManejoSeg: 220, tiempoLogueadoSeg: 21600, ultimoCambioStatus: '2026-06-21T10:55:00Z' },
    { id: 'ccagt-009', empresaId: 'emp-002', pbxId: 'pbx-003', nombre: 'Valentina Ortiz', extension: '301', colaId: 'cola-005', colaNombre: 'Mesa de Ayuda', status: 'on-call', llamadasAtendidasHoy: 25, tiempoPromedioManejoSeg: 260, tiempoLogueadoSeg: 25200, ultimoCambioStatus: '2026-06-21T10:52:00Z' },
    { id: 'ccagt-010', empresaId: 'emp-002', pbxId: 'pbx-003', nombre: 'Andrés Muñoz', extension: '302', colaId: 'cola-005', colaNombre: 'Mesa de Ayuda', status: 'available', llamadasAtendidasHoy: 22, tiempoPromedioManejoSeg: 240, tiempoLogueadoSeg: 25200, ultimoCambioStatus: '2026-06-21T11:00:00Z' },
    { id: 'ccagt-011', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Gabriela Ríos', extension: '108', colaId: 'cola-007', colaNombre: 'Reclamos', status: 'on-call', llamadasAtendidasHoy: 6, tiempoPromedioManejoSeg: 350, tiempoLogueadoSeg: 18000, ultimoCambioStatus: '2026-06-21T10:50:00Z' },
    { id: 'ccagt-012', empresaId: 'emp-001', pbxId: 'pbx-001', nombre: 'Fernando Vega', extension: '109', colaId: 'cola-008', colaNombre: 'VIP Client', status: 'available', llamadasAtendidasHoy: 4, tiempoPromedioManejoSeg: 150, tiempoLogueadoSeg: 14400, ultimoCambioStatus: '2026-06-21T10:30:00Z' },
  ],

  llamadasActivasCC: [
    { id: 'cccall-001', colaId: 'cola-001', colaNombre: 'Soporte Técnico', callerNumber: '555-1001', agentId: 'ccagt-001', agentName: 'María García', agentExtension: '101', duracionSeg: 185, inicio: '2026-06-21T10:57:00Z', direccion: 'inbound' },
    { id: 'cccall-002', colaId: 'cola-002', colaNombre: 'Ventas', callerNumber: '555-1002', agentId: 'ccagt-004', agentName: 'Roberto Sánchez', agentExtension: '104', duracionSeg: 320, inicio: '2026-06-21T10:55:00Z', direccion: 'inbound' },
    { id: 'cccall-003', colaId: 'cola-001', colaNombre: 'Soporte Técnico', callerNumber: '555-1003', agentId: 'ccagt-001', agentName: 'María García', agentExtension: '101', duracionSeg: 45, inicio: '2026-06-21T10:59:00Z', direccion: 'outbound' },
    { id: 'cccall-004', colaId: 'cola-004', colaNombre: 'Soporte Norte', callerNumber: '555-2001', agentId: 'ccagt-008', agentName: 'Pablo Herrera', agentExtension: '201', duracionSeg: 120, inicio: '2026-06-21T10:58:00Z', direccion: 'inbound' },
    { id: 'cccall-005', colaId: 'cola-005', colaNombre: 'Mesa de Ayuda', callerNumber: '555-3001', agentId: 'ccagt-009', agentName: 'Valentina Ortiz', agentExtension: '301', duracionSeg: 280, inicio: '2026-06-21T10:55:30Z', direccion: 'inbound' },
    { id: 'cccall-006', colaId: 'cola-007', colaNombre: 'Reclamos', callerNumber: '555-1007', agentId: 'ccagt-011', agentName: 'Gabriela Ríos', agentExtension: '108', duracionSeg: 95, inicio: '2026-06-21T10:58:30Z', direccion: 'inbound' },
  ],

  llamadasEnCola: [
    { id: 'qcall-001', colaId: 'cola-001', colaNombre: 'Soporte Técnico', callerId: '555-1010', callerNumber: '555-1010', tiempoEsperaSeg: 85, posicion: 1, prioridad: 'high', inicioEspera: '2026-06-21T10:58:35Z' },
    { id: 'qcall-002', colaId: 'cola-001', colaNombre: 'Soporte Técnico', callerId: '555-1011', callerNumber: '555-1011', tiempoEsperaSeg: 55, posicion: 2, prioridad: 'normal', inicioEspera: '2026-06-21T10:59:05Z' },
    { id: 'qcall-003', colaId: 'cola-001', colaNombre: 'Soporte Técnico', callerId: '555-1012', callerNumber: '555-1012', tiempoEsperaSeg: 20, posicion: 3, prioridad: 'normal', inicioEspera: '2026-06-21T10:59:40Z' },
    { id: 'qcall-004', colaId: 'cola-004', colaNombre: 'Soporte Norte', callerId: '555-2010', callerNumber: '555-2010', tiempoEsperaSeg: 110, posicion: 1, prioridad: 'vip', inicioEspera: '2026-06-21T10:58:10Z' },
    { id: 'qcall-005', colaId: 'cola-004', colaNombre: 'Soporte Norte', callerId: '555-2011', callerNumber: '555-2011', tiempoEsperaSeg: 40, posicion: 2, prioridad: 'normal', inicioEspera: '2026-06-21T10:59:20Z' },
    { id: 'qcall-006', colaId: 'cola-005', colaNombre: 'Mesa de Ayuda', callerId: '555-3010', callerNumber: '555-3010', tiempoEsperaSeg: 75, posicion: 1, prioridad: 'high', inicioEspera: '2026-06-21T10:58:45Z' },
    { id: 'qcall-007', colaId: 'cola-005', colaNombre: 'Mesa de Ayuda', callerId: '555-3011', callerNumber: '555-3011', tiempoEsperaSeg: 60, posicion: 2, prioridad: 'normal', inicioEspera: '2026-06-21T10:59:00Z' },
    { id: 'qcall-008', colaId: 'cola-005', colaNombre: 'Mesa de Ayuda', callerId: '555-3012', callerNumber: '555-3012', tiempoEsperaSeg: 30, posicion: 3, prioridad: 'normal', inicioEspera: '2026-06-21T10:59:30Z' },
    { id: 'qcall-009', colaId: 'cola-005', colaNombre: 'Mesa de Ayuda', callerId: '555-3013', callerNumber: '555-3013', tiempoEsperaSeg: 15, posicion: 4, prioridad: 'normal', inicioEspera: '2026-06-21T10:59:45Z' },
    { id: 'qcall-010', colaId: 'cola-007', colaNombre: 'Reclamos', callerId: '555-1017', callerNumber: '555-1017', tiempoEsperaSeg: 165, posicion: 1, prioridad: 'high', inicioEspera: '2026-06-21T10:57:15Z' },
  ],

  cdrLlamadas: [
    { id: 'cdr-001', colaNombre: 'Soporte Técnico', agentName: 'María García', callerNumber: '555-1001', inicio: '2026-06-21T09:00:00Z', fin: '2026-06-21T09:05:30Z', duracionSeg: 330, disposicion: 'answered' },
    { id: 'cdr-002', colaNombre: 'Ventas', agentName: 'Roberto Sánchez', callerNumber: '555-1002', inicio: '2026-06-21T09:15:00Z', fin: '2026-06-21T09:20:00Z', duracionSeg: 300, disposicion: 'answered' },
    { id: 'cdr-003', colaNombre: 'Soporte Técnico', agentName: 'Juan López', callerNumber: '555-1003', inicio: '2026-06-21T08:30:00Z', fin: '2026-06-21T08:32:00Z', duracionSeg: 120, disposicion: 'abandoned' },
    { id: 'cdr-004', colaNombre: 'Facturación', agentName: 'Carmen Flores', callerNumber: '555-1004', inicio: '2026-06-21T10:00:00Z', fin: '2026-06-21T10:03:30Z', duracionSeg: 210, disposicion: 'answered' },
    { id: 'cdr-005', colaNombre: 'Soporte Norte', agentName: 'Pablo Herrera', callerNumber: '555-2001', inicio: '2026-06-21T09:30:00Z', fin: '2026-06-21T09:35:00Z', duracionSeg: 300, disposicion: 'transferred' },
    { id: 'cdr-006', colaNombre: 'Mesa de Ayuda', agentName: 'Valentina Ortiz', callerNumber: '555-3001', inicio: '2026-06-21T08:00:00Z', fin: '2026-06-21T08:06:00Z', duracionSeg: 360, disposicion: 'answered' },
    { id: 'cdr-007', colaNombre: 'Ventas', agentName: 'Sofía Torres', callerNumber: '555-1005', inicio: '2026-06-21T10:30:00Z', fin: '2026-06-21T10:33:00Z', duracionSeg: 180, disposicion: 'answered' },
    { id: 'cdr-008', colaNombre: 'Reclamos', agentName: 'Gabriela Ríos', callerNumber: '555-1007', inicio: '2026-06-21T09:45:00Z', fin: '2026-06-21T09:52:00Z', duracionSeg: 420, disposicion: 'answered' },
    { id: 'cdr-009', colaNombre: 'Soporte Técnico', agentName: 'María García', callerNumber: '555-1006', inicio: '2026-06-21T10:15:00Z', fin: '2026-06-21T10:16:30Z', duracionSeg: 90, disposicion: 'abandoned' },
    { id: 'cdr-010', colaNombre: 'Mesa de Ayuda', agentName: 'Andrés Muñoz', callerNumber: '555-3002', inicio: '2026-06-21T10:00:00Z', fin: '2026-06-21T10:04:00Z', duracionSeg: 240, disposicion: 'answered' },
  ],

  reportesDiarios: [
    { fecha: '2026-06-07', llamadasRecibidas: 410, llamadasAtendidas: 380, llamadasAbandonadas: 30, nivelServicioPct: 88, tiempoPromedioEsperaSeg: 35, tiempoPromedioManejoSeg: 245, agentesActivos: 18 },
    { fecha: '2026-06-08', llamadasRecibidas: 390, llamadasAtendidas: 365, llamadasAbandonadas: 25, nivelServicioPct: 90, tiempoPromedioEsperaSeg: 32, tiempoPromedioManejoSeg: 240, agentesActivos: 17 },
    { fecha: '2026-06-09', llamadasRecibidas: 450, llamadasAtendidas: 400, llamadasAbandonadas: 50, nivelServicioPct: 85, tiempoPromedioEsperaSeg: 42, tiempoPromedioManejoSeg: 255, agentesActivos: 19 },
    { fecha: '2026-06-10', llamadasRecibidas: 380, llamadasAtendidas: 360, llamadasAbandonadas: 20, nivelServicioPct: 92, tiempoPromedioEsperaSeg: 28, tiempoPromedioManejoSeg: 235, agentesActivos: 16 },
    { fecha: '2026-06-11', llamadasRecibidas: 500, llamadasAtendidas: 430, llamadasAbandonadas: 70, nivelServicioPct: 80, tiempoPromedioEsperaSeg: 55, tiempoPromedioManejoSeg: 265, agentesActivos: 20 },
    { fecha: '2026-06-12', llamadasRecibidas: 420, llamadasAtendidas: 395, llamadasAbandonadas: 25, nivelServicioPct: 91, tiempoPromedioEsperaSeg: 30, tiempoPromedioManejoSeg: 250, agentesActivos: 18 },
    { fecha: '2026-06-13', llamadasRecibidas: 350, llamadasAtendidas: 330, llamadasAbandonadas: 20, nivelServicioPct: 93, tiempoPromedioEsperaSeg: 25, tiempoPromedioManejoSeg: 230, agentesActivos: 15 },
    { fecha: '2026-06-14', llamadasRecibidas: 300, llamadasAtendidas: 285, llamadasAbandonadas: 15, nivelServicioPct: 94, tiempoPromedioEsperaSeg: 22, tiempoPromedioManejoSeg: 225, agentesActivos: 14 },
    { fecha: '2026-06-15', llamadasRecibidas: 480, llamadasAtendidas: 420, llamadasAbandonadas: 60, nivelServicioPct: 83, tiempoPromedioEsperaSeg: 48, tiempoPromedioManejoSeg: 260, agentesActivos: 19 },
    { fecha: '2026-06-16', llamadasRecibidas: 440, llamadasAtendidas: 410, llamadasAbandonadas: 30, nivelServicioPct: 89, tiempoPromedioEsperaSeg: 33, tiempoPromedioManejoSeg: 248, agentesActivos: 18 },
    { fecha: '2026-06-17', llamadasRecibidas: 510, llamadasAtendidas: 440, llamadasAbandonadas: 70, nivelServicioPct: 81, tiempoPromedioEsperaSeg: 50, tiempoPromedioManejoSeg: 270, agentesActivos: 20 },
    { fecha: '2026-06-18', llamadasRecibidas: 390, llamadasAtendidas: 370, llamadasAbandonadas: 20, nivelServicioPct: 93, tiempoPromedioEsperaSeg: 27, tiempoPromedioManejoSeg: 238, agentesActivos: 17 },
    { fecha: '2026-06-19', llamadasRecibidas: 430, llamadasAtendidas: 400, llamadasAbandonadas: 30, nivelServicioPct: 90, tiempoPromedioEsperaSeg: 31, tiempoPromedioManejoSeg: 242, agentesActivos: 18 },
    { fecha: '2026-06-20', llamadasRecibidas: 460, llamadasAtendidas: 425, llamadasAbandonadas: 35, nivelServicioPct: 87, tiempoPromedioEsperaSeg: 38, tiempoPromedioManejoSeg: 252, agentesActivos: 19 },
  ],
};

function getById(collection, id) {
  return DATA[collection].find(item => item.id === id);
}

function getByEmpresa(collection, empresaId) {
  return DATA[collection].filter(item => item.empresaId === empresaId);
}

function getByPbx(collection, pbxId) {
  return DATA[collection].filter(item => item.pbxId === pbxId);
}

function generateId(prefix) {
  const num = String(DATA[Object.keys(DATA).find(k => k.startsWith(prefix.slice(0, 3)))]?.length + 1 || Date.now()).slice(-4);
  return `${prefix}-${num.padStart(4, '0')}`;
}

function getEmpresaName(id) {
  const e = getById('empresas', id);
  return e ? e.nombre : '—';
}

function getPbxName(id) {
  const p = getById('pbxServers', id);
  return p ? p.nombre : '—';
}

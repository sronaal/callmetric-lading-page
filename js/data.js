const DATA = {
  roles: [
    { id: 1, nombre: 'SUPER_ADMIN', descripcion: 'Administrador global de la plataforma', es_sistema: true },
    { id: 2, nombre: 'ADMIN_EMPRESA', descripcion: 'Administrador de empresa tenant', es_sistema: true },
    { id: 3, nombre: 'SUPERVISOR', descripcion: 'Supervisor de call center', es_sistema: true },
    { id: 4, nombre: 'OPERADOR', descripcion: 'Operador de call center', es_sistema: true },
  ],

  empresas: [
    { id: 1, nit: '900123456-7', nombre: 'Corporacion Nova', correo: 'contacto@nova.com', telefono: '3001234567', plan: 'Enterprise', estado: 'Activa', created_at: '2026-01-15T08:00:00Z' },
    { id: 2, nit: '900987654-3', nombre: 'Tecnologia Andina', correo: 'info@andina.com', telefono: '3009876543', plan: 'Professional', estado: 'Activa', created_at: '2026-02-20T10:00:00Z' },
    { id: 3, nit: '900555111-2', nombre: 'Servicios Globales', correo: 'admin@global.com', telefono: '3005551111', plan: 'Basic', estado: 'Inactiva', created_at: '2026-03-10T14:00:00Z' },
  ],

  usuarios: [
    { id: 1, empresa_id: null, rol_id: 1, nombres: 'Admin', apellidos: 'Global', correo: 'admin@callmetric.io', password_hash: '***', activo: true, ultimo_login: '2026-06-21T08:30:00Z', created_at: '2026-01-15T08:00:00Z' },
    { id: 2, empresa_id: 1, rol_id: 2, nombres: 'Carlos', apellidos: 'Mendez', correo: 'carlos@nova.com', password_hash: '***', activo: true, ultimo_login: '2026-06-21T09:00:00Z', created_at: '2026-01-20T09:00:00Z' },
    { id: 3, empresa_id: 1, rol_id: 3, nombres: 'Laura', apellidos: 'Vargas', correo: 'laura@nova.com', password_hash: '***', activo: true, ultimo_login: '2026-06-21T10:15:00Z', created_at: '2026-02-01T10:00:00Z' },
    { id: 4, empresa_id: 1, rol_id: 4, nombres: 'Pedro', apellidos: 'Rojas', correo: 'pedro@nova.com', password_hash: '***', activo: true, ultimo_login: '2026-06-20T14:00:00Z', created_at: '2026-02-15T11:00:00Z' },
    { id: 5, empresa_id: 2, rol_id: 2, nombres: 'Ana', apellidos: 'Torres', correo: 'ana@andina.com', password_hash: '***', activo: true, ultimo_login: '2026-06-21T07:45:00Z', created_at: '2026-02-25T08:00:00Z' },
    { id: 6, empresa_id: 2, rol_id: 3, nombres: 'Luis', apellidos: 'Campos', correo: 'luis@andina.com', password_hash: '***', activo: false, ultimo_login: '2026-06-15T00:00:00Z', created_at: '2026-03-01T09:00:00Z' },
  ],

  pbxServers: [
    { id: 1, empresa_id: 1, nombre: 'PBX Principal', ip: '192.168.1.10', puerto_ami: 5038, version_asterisk: '20.5.1', estado: 'Activo', created_at: '2026-01-20T08:00:00Z' },
    { id: 2, empresa_id: 1, nombre: 'PBX Sucursal Norte', ip: '192.168.2.10', puerto_ami: 5038, version_asterisk: '16.0.30', estado: 'Activo', created_at: '2026-02-10T10:00:00Z' },
    { id: 3, empresa_id: 2, nombre: 'PBX Andina HQ', ip: '10.0.0.20', puerto_ami: 5038, version_asterisk: '19.8.0', estado: 'Activo', created_at: '2026-02-28T09:00:00Z' },
    { id: 4, empresa_id: 2, nombre: 'PBX Backup', ip: '10.0.0.21', puerto_ami: 5038, version_asterisk: '5.0.0', estado: 'Inactivo', created_at: '2026-03-15T14:00:00Z' },
  ],

  agentesMonitoreo: [
    { id: 1, pbx_id: 1, hostname: 'agente-nova-1.local', version_agente: '3.2.0', estado: 'Activo', ultimo_heartbeat: '2026-06-21T11:00:00Z', created_at: '2026-01-25T08:00:00Z' },
    { id: 2, pbx_id: 2, hostname: 'agente-nova-2.local', version_agente: '3.1.5', estado: 'Activo', ultimo_heartbeat: '2026-06-21T10:59:30Z', created_at: '2026-02-15T10:00:00Z' },
    { id: 3, pbx_id: 3, hostname: 'agente-andina-1.local', version_agente: '3.2.0', estado: 'Activo', ultimo_heartbeat: '2026-06-21T11:00:00Z', created_at: '2026-03-01T09:00:00Z' },
    { id: 4, pbx_id: 4, hostname: 'agente-andina-2.local', version_agente: '3.0.0', estado: 'Inactivo', ultimo_heartbeat: '2026-06-19T10:00:00Z', created_at: '2026-03-20T14:00:00Z' },
    { id: 5, pbx_id: 1, hostname: 'agente-nova-3.local', version_agente: '3.2.0', estado: 'Inactivo', ultimo_heartbeat: null, created_at: '2026-04-01T08:00:00Z' },
  ],

  heartbeats: [
    { id: 1, agente_id: 1, cpu: 22.5, memoria: 35.2, disco: 55.0, canales_sip: 23, estado: 'OK', fecha: '2026-06-21T11:00:00Z' },
    { id: 2, agente_id: 1, cpu: 20.1, memoria: 34.8, disco: 55.0, canales_sip: 21, estado: 'OK', fecha: '2026-06-21T10:59:30Z' },
    { id: 3, agente_id: 1, cpu: 21.3, memoria: 35.0, disco: 55.0, canales_sip: 22, estado: 'OK', fecha: '2026-06-21T10:59:00Z' },
    { id: 4, agente_id: 1, cpu: 65.0, memoria: 70.5, disco: 55.0, canales_sip: 20, estado: 'Degradado', fecha: '2026-06-21T10:58:30Z' },
    { id: 5, agente_id: 1, cpu: 19.8, memoria: 33.5, disco: 55.0, canales_sip: 22, estado: 'OK', fecha: '2026-06-21T10:58:00Z' },
    { id: 6, agente_id: 3, cpu: 25.0, memoria: 40.2, disco: 40.0, canales_sip: 15, estado: 'OK', fecha: '2026-06-21T11:00:00Z' },
    { id: 7, agente_id: 2, cpu: 30.2, memoria: 45.1, disco: 78.0, canales_sip: 8, estado: 'OK', fecha: '2026-06-21T10:59:30Z' },
  ],

  llamadas: [
    { id: 1, empresa_id: 1, pbx_id: 1, uniqueid: 'CALL-001', callerid: '555-0101', origen: '555-0101', destino: '555-1001', extension_origen: '101', extension_destino: '1001', inicio: '2026-06-21T09:00:00Z', fin: '2026-06-21T09:04:05Z', duracion: 245, estado: 'Activas', created_at: '2026-06-21T09:00:00Z' },
    { id: 2, empresa_id: 1, pbx_id: 1, uniqueid: 'CALL-002', callerid: '555-0102', origen: '555-0102', destino: '555-1002', extension_origen: '102', extension_destino: '1002', inicio: '2026-06-21T09:15:00Z', fin: '2026-06-21T09:17:00Z', duracion: 120, estado: 'Activas', created_at: '2026-06-21T09:15:00Z' },
    { id: 3, empresa_id: 1, pbx_id: 1, uniqueid: 'CALL-003', callerid: '555-0103', origen: '555-0103', destino: '800-555-0199', extension_origen: '103', extension_destino: null, inicio: '2026-06-21T09:30:00Z', fin: '2026-06-21T09:39:22Z', duracion: 562, estado: 'Completada', created_at: '2026-06-21T09:30:00Z' },
    { id: 4, empresa_id: 1, pbx_id: 1, uniqueid: 'CALL-004', callerid: '555-0104', origen: '555-0104', destino: '555-1004', extension_origen: '104', extension_destino: '1004', inicio: '2026-06-21T09:45:00Z', fin: '2026-06-21T09:45:12Z', duracion: 12, estado: 'Fallida', created_at: '2026-06-21T09:45:00Z' },
    { id: 5, empresa_id: 1, pbx_id: 2, uniqueid: 'CALL-005', callerid: '555-0201', origen: '555-0201', destino: '555-2001', extension_origen: '201', extension_destino: '2001', inicio: '2026-06-21T10:00:00Z', fin: '2026-06-21T10:01:29Z', duracion: 89, estado: 'Activas', created_at: '2026-06-21T10:00:00Z' },
    { id: 6, empresa_id: 2, pbx_id: 3, uniqueid: 'CALL-006', callerid: '555-0301', origen: '555-0301', destino: '555-3001', extension_origen: '301', extension_destino: '3001', inicio: '2026-06-21T10:15:00Z', fin: '2026-06-21T10:18:00Z', duracion: 180, estado: 'Completada', created_at: '2026-06-21T10:15:00Z' },
    { id: 7, empresa_id: 1, pbx_id: 1, uniqueid: 'CALL-007', callerid: '555-0105', origen: '555-0105', destino: '555-1005', extension_origen: '105', extension_destino: '1005', inicio: '2026-06-21T10:30:00Z', fin: null, duracion: 0, estado: 'Perdida', created_at: '2026-06-21T10:30:00Z' },
    { id: 8, empresa_id: 1, pbx_id: 1, uniqueid: 'CALL-008', callerid: '555-0106', origen: '555-0106', destino: '555-1006', extension_origen: '106', extension_destino: '1006', inicio: '2026-06-21T10:45:00Z', fin: '2026-06-21T10:52:30Z', duracion: 450, estado: 'Activas', created_at: '2026-06-21T10:45:00Z' },
    { id: 9, empresa_id: 2, pbx_id: 3, uniqueid: 'CALL-009', callerid: '555-0302', origen: '555-0302', destino: '555-3002', extension_origen: '302', extension_destino: '3002', inicio: '2026-06-21T11:00:00Z', fin: '2026-06-21T11:05:20Z', duracion: 320, estado: 'Completada', created_at: '2026-06-21T11:00:00Z' },
    { id: 10, empresa_id: 2, pbx_id: 2, uniqueid: 'CALL-010', callerid: '555-0202', origen: '555-0202', destino: '555-2002', extension_origen: '202', extension_destino: '2002', inicio: '2026-06-21T11:15:00Z', fin: '2026-06-21T11:16:30Z', duracion: 90, estado: 'Completada', created_at: '2026-06-21T11:15:00Z' },
  ],

  alertas: [
    { id: 1, empresa_id: 1, severidad: 'Media', tipo: 'CPU', mensaje: 'CPU elevada en PBX Sucursal Norte al 72%', estado: 'Nueva', fecha: '2026-06-21T10:45:00Z' },
    { id: 2, empresa_id: 1, severidad: 'Media', tipo: 'Memoria', mensaje: 'Memoria alta en PBX Sucursal Norte al 80%', estado: 'Nueva', fecha: '2026-06-21T10:40:00Z' },
    { id: 3, empresa_id: 2, severidad: 'Alta', tipo: 'Conectividad', mensaje: 'PBX Backup sin conexion desde hace mas de 24 horas', estado: 'Nueva', fecha: '2026-06-20T08:00:00Z' },
    { id: 4, empresa_id: 1, severidad: 'Baja', tipo: 'Llamadas', mensaje: 'Pico de llamadas: 45 concurrentes en la ultima hora', estado: 'Reconocida', fecha: '2026-06-21T09:00:00Z' },
    { id: 5, empresa_id: 2, severidad: 'Alta', tipo: 'CPU', mensaje: 'CPU critica en PBX Andina HQ al 95%', estado: 'Resuelta', fecha: '2026-06-20T14:00:00Z' },
  ],

  colasCallCenter: [
    { id: 1, nombre: 'Ventas', extension: '5001', empresa_id: 1, pbx_id: 1, estado: 'Activa', nivel_servicio_pct: 92, llamadas_atendidas_hoy: 45, llamadas_abandonadas_hoy: 3, tiempo_promedio_espera_seg: 15, creado: '2026-01-20T10:00:00Z' },
    { id: 2, nombre: 'Soporte', extension: '5002', empresa_id: 1, pbx_id: 1, estado: 'Activa', nivel_servicio_pct: 87, llamadas_atendidas_hoy: 32, llamadas_abandonadas_hoy: 5, tiempo_promedio_espera_seg: 25, creado: '2026-01-20T10:00:00Z' },
    { id: 3, nombre: 'Cobros', extension: '5003', empresa_id: 2, pbx_id: 2, estado: 'Activa', nivel_servicio_pct: 95, llamadas_atendidas_hoy: 18, llamadas_abandonadas_hoy: 1, tiempo_promedio_espera_seg: 8, creado: '2026-02-25T10:00:00Z' },
  ],

  agentesCC: [
    { id: 1, nombre: 'Pedro Rojas', extension: '101', empresa_id: 1, pbx_id: 1, cola_nombre: 'Ventas', estado: 'available', llamadas_atendidas_hoy: 12, tiempo_promedio_manejo_seg: 180, tiempo_logueado_seg: 14400 },
    { id: 2, nombre: 'Maria Lopez', extension: '102', empresa_id: 1, pbx_id: 1, cola_nombre: 'Soporte', estado: 'on-call', llamadas_atendidas_hoy: 8, tiempo_promedio_manejo_seg: 240, tiempo_logueado_seg: 14400 },
    { id: 3, nombre: 'Juan Perez', extension: '201', empresa_id: 2, pbx_id: 2, cola_nombre: 'Cobros', estado: 'available', llamadas_atendidas_hoy: 15, tiempo_promedio_manejo_seg: 150, tiempo_logueado_seg: 14400 },
    { id: 4, nombre: 'Laura Vargas', extension: '103', empresa_id: 1, pbx_id: 1, cola_nombre: 'Ventas', estado: 'break', llamadas_atendidas_hoy: 6, tiempo_promedio_manejo_seg: 200, tiempo_logueado_seg: 10800 },
  ],

  llamadasActivasCC: [
    { id: 1, caller_number: '3001234567', agent_name: 'Maria Lopez', agent_extension: '102', cola_id: 2, cola_nombre: 'Soporte', direccion: 'inbound', duracion_seg: 145 },
    { id: 2, caller_number: '3009876543', agent_name: 'Juan Perez', agent_extension: '201', cola_id: 3, cola_nombre: 'Cobros', direccion: 'inbound', duracion_seg: 62 },
  ],

  llamadasEnCola: [
    { id: 1, caller_number: '3005551111', cola_id: 1, cola_nombre: 'Ventas', prioridad: 'vip', tiempo_espera_seg: 45, posicion: 1 },
    { id: 2, caller_number: '3008889999', cola_id: 2, cola_nombre: 'Soporte', prioridad: 'normal', tiempo_espera_seg: 120, posicion: 2 },
    { id: 3, caller_number: '3002223333', cola_id: 1, cola_nombre: 'Ventas', prioridad: 'high', tiempo_espera_seg: 30, posicion: 2 },
  ],

  cdrLlamadas: [
    { id: 1, caller_number: '3001234567', agent_name: 'Pedro Rojas', cola_nombre: 'Ventas', inicio: '2026-06-21T08:00:00Z', duracion_seg: 180, disposicion: 'answered' },
    { id: 2, caller_number: '3009876543', agent_name: 'Maria Lopez', cola_nombre: 'Soporte', inicio: '2026-06-21T08:15:00Z', duracion_seg: 320, disposicion: 'answered' },
    { id: 3, caller_number: '3005551111', agent_name: null, cola_nombre: 'Ventas', inicio: '2026-06-21T09:00:00Z', duracion_seg: 45, disposicion: 'abandoned' },
    { id: 4, caller_number: '3008889999', agent_name: 'Juan Perez', cola_nombre: 'Cobros', inicio: '2026-06-21T09:30:00Z', duracion_seg: 95, disposicion: 'answered' },
    { id: 5, caller_number: '3002223333', agent_name: 'Pedro Rojas', cola_nombre: 'Ventas', inicio: '2026-06-21T10:00:00Z', duracion_seg: 60, disposicion: 'answered' },
  ],

  reportesDiarios: [
    { fecha: '2026-06-08', llamadas_recibidas: 120, llamadas_atendidas: 105, llamadas_abandonadas: 15, nivel_servicio_pct: 88, tiempo_promedio_espera_seg: 22, tiempo_promedio_manejo_seg: 210, agentes_activos: 5 },
    { fecha: '2026-06-09', llamadas_recibidas: 135, llamadas_atendidas: 125, llamadas_abandonadas: 10, nivel_servicio_pct: 93, tiempo_promedio_espera_seg: 15, tiempo_promedio_manejo_seg: 195, agentes_activos: 6 },
    { fecha: '2026-06-10', llamadas_recibidas: 98, llamadas_atendidas: 88, llamadas_abandonadas: 10, nivel_servicio_pct: 90, tiempo_promedio_espera_seg: 18, tiempo_promedio_manejo_seg: 220, agentes_activos: 4 },
    { fecha: '2026-06-11', llamadas_recibidas: 142, llamadas_atendidas: 130, llamadas_abandonadas: 12, nivel_servicio_pct: 91, tiempo_promedio_espera_seg: 20, tiempo_promedio_manejo_seg: 205, agentes_activos: 6 },
    { fecha: '2026-06-12', llamadas_recibidas: 110, llamadas_atendidas: 100, llamadas_abandonadas: 10, nivel_servicio_pct: 91, tiempo_promedio_espera_seg: 16, tiempo_promedio_manejo_seg: 190, agentes_activos: 5 },
    { fecha: '2026-06-13', llamadas_recibidas: 155, llamadas_atendidas: 145, llamadas_abandonadas: 10, nivel_servicio_pct: 94, tiempo_promedio_espera_seg: 12, tiempo_promedio_manejo_seg: 185, agentes_activos: 7 },
    { fecha: '2026-06-14', llamadas_recibidas: 88, llamadas_atendidas: 78, llamadas_abandonadas: 10, nivel_servicio_pct: 89, tiempo_promedio_espera_seg: 25, tiempo_promedio_manejo_seg: 230, agentes_activos: 4 },
    { fecha: '2026-06-15', llamadas_recibidas: 130, llamadas_atendidas: 120, llamadas_abandonadas: 10, nivel_servicio_pct: 92, tiempo_promedio_espera_seg: 14, tiempo_promedio_manejo_seg: 195, agentes_activos: 5 },
    { fecha: '2026-06-16', llamadas_recibidas: 148, llamadas_atendidas: 138, llamadas_abandonadas: 10, nivel_servicio_pct: 93, tiempo_promedio_espera_seg: 13, tiempo_promedio_manejo_seg: 188, agentes_activos: 6 },
    { fecha: '2026-06-17', llamadas_recibidas: 125, llamadas_atendidas: 115, llamadas_abandonadas: 10, nivel_servicio_pct: 92, tiempo_promedio_espera_seg: 17, tiempo_promedio_manejo_seg: 200, agentes_activos: 5 },
    { fecha: '2026-06-18', llamadas_recibidas: 160, llamadas_atendidas: 150, llamadas_abandonadas: 10, nivel_servicio_pct: 94, tiempo_promedio_espera_seg: 11, tiempo_promedio_manejo_seg: 182, agentes_activos: 7 },
    { fecha: '2026-06-19', llamadas_recibidas: 115, llamadas_atendidas: 105, llamadas_abandonadas: 10, nivel_servicio_pct: 91, tiempo_promedio_espera_seg: 19, tiempo_promedio_manejo_seg: 208, agentes_activos: 5 },
    { fecha: '2026-06-20', llamadas_recibidas: 140, llamadas_atendidas: 130, llamadas_abandonadas: 10, nivel_servicio_pct: 93, tiempo_promedio_espera_seg: 14, tiempo_promedio_manejo_seg: 192, agentes_activos: 6 },
    { fecha: '2026-06-21', llamadas_recibidas: 95, llamadas_atendidas: 85, llamadas_abandonadas: 10, nivel_servicio_pct: 89, tiempo_promedio_espera_seg: 22, tiempo_promedio_manejo_seg: 215, agentes_activos: 4 },
  ],
};

function getById(collection, id) {
  return DATA[collection].find(item => item.id === id);
}

function getByEmpresa(collection, empresaId) {
  return DATA[collection].filter(item => item.empresa_id === empresaId);
}

function getByPbx(collection, pbxId) {
  return DATA[collection].filter(item => item.pbx_id === pbxId);
}

function generateId(collection) {
  const items = DATA[collection];
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
}

function getEmpresaName(id) {
  const e = getById('empresas', id);
  return e ? e.nombre : '—';
}

function getPbxName(id) {
  const p = getById('pbxServers', id);
  return p ? p.nombre : '—';
}

function getRolName(rolId) {
  const r = getById('roles', rolId);
  return r ? r.nombre : '—';
}

const LandingPage = {
  render() {
    return `
      <nav class="landing-nav">
        <div class="landing-nav-inner">
          <a href="#" class="landing-brand" onclick="event.preventDefault();window.location.hash='#'">
            <i class="fas fa-chart-line"></i>
            <span>CallMetric Pro</span>
          </a>
          <div class="landing-nav-links desktop">
            <a href="#login">Iniciar sesión</a>
            <a class="landing-btn landing-btn-primary" href="#login" style="padding:6px 14px;font-size:0.8rem"><i class="fas fa-rocket"></i> Comenzar</a>
          </div>
          <button class="landing-mobile-toggle" id="landing-menu-btn"><i class="fas fa-bars"></i></button>
        </div>
        <div class="landing-mobile-drawer" id="landing-mobile-drawer">
          <a href="#login" onclick="document.getElementById('landing-mobile-drawer').classList.remove('open')">Iniciar sesión</a>
          <a class="landing-btn landing-btn-primary" href="#login" style="width:100%;justify-content:center;padding:8px" onclick="document.getElementById('landing-mobile-drawer').classList.remove('open')"><i class="fas fa-rocket"></i> Comenzar</a>
        </div>
      </nav>

      <section class="landing-hero">
        <div class="landing-hero-glow"></div>
        <div class="landing-hero-content">
          <div class="landing-badge">
            <i class="fas fa-chart-line" style="font-size:0.65rem"></i>
            Monitoreo de PBX en tiempo real
          </div>
          <h1>
            Monitorea tu infraestructura
            <span class="landing-gradient-text">VoIP</span>
            en tiempo real
          </h1>
          <p>Plataforma de monitoreo y analytics para servidores PBX con Asterisk. Alertas inteligentes, métricas QoS, y panel de control centralizado.</p>
          <div class="landing-hero-actions">
            <a class="landing-btn landing-btn-primary" href="#login"><i class="fas fa-rocket"></i> Comenzar ahora</a>
            <a class="landing-btn landing-btn-secondary" href="#login"><i class="fas fa-play-circle"></i> Ver demo</a>
          </div>
        </div>
        <div class="landing-mini-features">
          <div class="landing-mini-card">
            <div class="landing-mini-icon"><i class="fas fa-chart-line"></i></div>
            <h3>Tiempo real</h3>
            <p>Monitoreo en vivo de llamadas, PBX y agentes</p>
          </div>
          <div class="landing-mini-card">
            <div class="landing-mini-icon"><i class="fas fa-shield-alt"></i></div>
            <h3>Multi-tenant</h3>
            <p>Arquitectura multi-tenant con roles y permisos</p>
          </div>
          <div class="landing-mini-card">
            <div class="landing-mini-icon"><i class="fas fa-chart-bar"></i></div>
            <h3>Analíticas</h3>
            <p>Reportes de QoS, tendencias y SLA</p>
          </div>
        </div>
      </section>

      <section class="landing-section" id="features">
        <div class="landing-section-title">
          <h2>Todo lo que necesitas para monitorear tu PBX</h2>
          <p>Desde la infraestructura hasta el detalle de cada llamada, CallMetric Pro te da visibilidad completa.</p>
        </div>
        <div class="landing-features">
          <div class="landing-feature-card">
            <div class="landing-feature-icon"><i class="fas fa-server"></i></div>
            <h3>Monitoreo PBX</h3>
            <p>Estado en vivo de servidores Asterisk: CPU, memoria, uptime y llamadas activas.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon"><i class="fas fa-chart-line"></i></div>
            <h3>Métricas QoS</h3>
            <p>MOS Score, jitter, latencia y packet loss por llamada con alertas inteligentes.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon"><i class="fas fa-bell"></i></div>
            <h3>Alertas Inteligentes</h3>
            <p>Reglas configurables con umbrales por severidad, notificaciones multicanal.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon"><i class="fas fa-broadcast-tower"></i></div>
            <h3>Eventos SIP</h3>
            <p>Captura y análisis de eventos SIP en tiempo real con filtros avanzados.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon"><i class="fas fa-headset"></i></div>
            <h3>Call Center</h3>
            <p>Colas, agentes, llamadas en espera y activas con dashboard de supervisión.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon"><i class="fas fa-chart-bar"></i></div>
            <h3>Reportes y Analytics</h3>
            <p>Reportes diarios, tendencias históricas, SLA y productividad de agentes.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon"><i class="fas fa-users"></i></div>
            <h3>Multi-tenant</h3>
            <p>Arquitectura multi-tenant completa con roles: Super Admin, Admin, Supervisor, Operador.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon"><i class="fas fa-shield-alt"></i></div>
            <h3>Seguridad</h3>
            <p>JWT, RBAC por endpoint, auditoría de eventos, y aislamiento entre tenants.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon"><i class="fas fa-globe"></i></div>
            <h3>Heartbeats</h3>
            <p>Monitoreo de agentes con heartbeats, latencia, y estado de conexión AMI.</p>
          </div>
        </div>
      </section>

      <footer class="landing-footer">
        <div class="landing-footer-inner">
          <div class="landing-brand"><i class="fas fa-chart-line" style="font-size:1rem"></i> CallMetric Pro</div>
          <p class="landing-footer-copy">&copy; 2026 CallMetric Pro. Todos los derechos reservados.</p>
        </div>
      </footer>
    `;
  }
};

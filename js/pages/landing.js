const LandingPage = {
  render() {
    return `
      <nav class="landing-nav">
        <div class="landing-nav-inner">
          <div class="landing-brand">
            <i class="fas fa-phone-alt"></i>
            <span>CallMetric Pro</span>
          </div>
          <div class="landing-nav-links">
            <a href="#features">Características</a>
            <a href="#pricing">Precios</a>
            <a href="#contact">Contacto</a>
            <a class="landing-btn landing-btn-outline" href="#login"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</a>
          </div>
          <button class="landing-mobile-toggle" onclick="document.querySelector('.landing-nav-links').classList.toggle('open')"><i class="fas fa-bars"></i></button>
        </div>
      </nav>

      <section class="landing-hero">
        <div class="landing-hero-bg"></div>
        <div class="landing-hero-content">
          <span class="landing-badge">Monitoreo Inteligente para tu PBX</span>
          <h1>Monitorea, analiza y optimiza<br>tu infraestructura de comunicaciones</h1>
          <p>CallMetric Pro te brinda visibilidad en tiempo real de tus servidores PBX, llamadas, agentes y métricas de call center. Detecta problemas antes de que afecten tu operación.</p>
          <div class="landing-hero-actions">
            <a class="landing-btn landing-btn-primary" href="#login"><i class="fas fa-rocket"></i> Comenzar Demo</a>
            <a class="landing-btn landing-btn-outline" href="#features"><i class="fas fa-play-circle"></i> Ver Demo</a>
          </div>
        </div>
        <div class="landing-hero-visual">
          <div class="landing-hero-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
              <span style="font-weight:600;font-size:0.9rem">Dashboard</span>
              <span class="status-badge healthy"><i class="fas fa-circle"></i> 4 servidores</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
              <div style="padding:12px;background:var(--bg-tertiary);border-radius:8px;text-align:center"><div style="font-size:1.3rem;font-weight:700;color:var(--accent-cyan)">23</div><div style="font-size:0.7rem;color:var(--text-muted)">Llamadas</div></div>
              <div style="padding:12px;background:var(--bg-tertiary);border-radius:8px;text-align:center"><div style="font-size:1.3rem;font-weight:700;color:var(--success)">98%</div><div style="font-size:0.7rem;color:var(--text-muted)">Uptime</div></div>
            </div>
            <div style="height:6px;background:var(--bg-tertiary);border-radius:3px;overflow:hidden;margin-bottom:6px"><div style="width:72%;height:100%;background:var(--accent-cyan);border-radius:3px"></div></div>
            <div style="display:flex;justify-content:space-between;font-size:0.7rem;color:var(--text-muted)"><span>CPU: 45%</span><span>RAM: 62%</span></div>
          </div>
        </div>
      </section>

      <section class="landing-section" id="features">
        <div class="landing-section-title">
          <h2>Todo lo que necesitas para monitorear tu PBX</h2>
          <p>Una plataforma completa con métricas en tiempo real, alertas inteligentes y reportes detallados.</p>
        </div>
        <div class="landing-features">
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:rgba(6,182,212,0.15);color:var(--accent-cyan)"><i class="fas fa-server"></i></div>
            <h3>Monitoreo de Servidores PBX</h3>
            <p>Supervisa CPU, RAM, disco, uptime y estado de conexión de todos tus servidores Asterisk, FreePBX e Issabel en tiempo real.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:rgba(34,197,94,0.15);color:var(--success)"><i class="fas fa-phone"></i></div>
            <h3>Gestión de Llamadas</h3>
            <p>Visualiza llamadas activas, historial completo, métricas MOS, jitter, latencia y calidad de audio por código y trunk SIP.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:rgba(139,92,246,0.15);color:var(--accent-violet)"><i class="fas fa-headset"></i></div>
            <h3>Call Center en Tiempo Real</h3>
            <p>Monitorea colas, agentes, nivel de servicio, llamadas en espera y productividad con métricas actualizadas al segundo.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:rgba(234,179,8,0.15);color:var(--warning)"><i class="fas fa-bell"></i></div>
            <h3>Alertas Inteligentes</h3>
            <p>Recibe notificaciones proactivas cuando los umbrales de CPU, memoria, llamadas o conectividad superan los límites configurados.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:rgba(59,130,246,0.15);color:var(--info)"><i class="fas fa-chart-bar"></i></div>
            <h3>Reportes y Analytics</h3>
            <p>Genera reportes CDR detallados, analiza tendencias de llamadas, productividad de agentes y niveles de servicio históricos.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:rgba(239,68,68,0.15);color:var(--danger)"><i class="fas fa-shield-alt"></i></div>
            <h3>Seguridad y Auditoría</h3>
            <p>Control de acceso basado en roles, registro de auditoría de todas las acciones y tokens de autenticación para agentes.</p>
          </div>
        </div>
      </section>

      <section class="landing-section" style="background:var(--bg-secondary);border-top:1px solid var(--border);border-bottom:1px solid var(--border)" id="pricing">
        <div class="landing-section-title">
          <h2>Planes Flexibles</h2>
          <p>Desde startups hasta grandes empresas, tenemos el plan ideal para tu operación.</p>
        </div>
        <div class="landing-pricing">
          <div class="landing-pricing-card">
            <div class="landing-pricing-name">Starter</div>
            <div class="landing-pricing-price">Gratis</div>
            <div class="landing-pricing-period">para siempre</div>
            <ul class="landing-pricing-features">
              <li><i class="fas fa-check"></i> Hasta 1 PBX</li>
              <li><i class="fas fa-check"></i> 5 agentes de monitoreo</li>
              <li><i class="fas fa-check"></i> Dashboard básico</li>
              <li><i class="fas fa-check"></i> Alertas por email</li>
              <li><i class="fas fa-times" style="opacity:0.3"></i> Call Center</li>
              <li><i class="fas fa-times" style="opacity:0.3"></i> Reportes CDR</li>
            </ul>
            <a class="landing-btn landing-btn-outline" href="#login" style="width:100%;justify-content:center">Comenzar</a>
          </div>
          <div class="landing-pricing-card landing-pricing-featured">
            <div class="landing-pricing-name">Professional</div>
            <div class="landing-pricing-price">$29</div>
            <div class="landing-pricing-period">/mes</div>
            <ul class="landing-pricing-features">
              <li><i class="fas fa-check"></i> Hasta 5 PBX</li>
              <li><i class="fas fa-check"></i> 20 agentes de monitoreo</li>
              <li><i class="fas fa-check"></i> Dashboard avanzado</li>
              <li><i class="fas fa-check"></i> Alertas multi-canal</li>
              <li><i class="fas fa-check"></i> Call Center completo</li>
              <li><i class="fas fa-check"></i> Reportes CDR</li>
            </ul>
            <a class="landing-btn landing-btn-primary" href="#login" style="width:100%;justify-content:center"><i class="fas fa-rocket"></i> Probar Gratis</a>
          </div>
          <div class="landing-pricing-card">
            <div class="landing-pricing-name">Enterprise</div>
            <div class="landing-pricing-price">$99</div>
            <div class="landing-pricing-period">/mes</div>
            <ul class="landing-pricing-features">
              <li><i class="fas fa-check"></i> PBX ilimitadas</li>
              <li><i class="fas fa-check"></i> Agentes ilimitados</li>
              <li><i class="fas fa-check"></i> Multi-tenant</li>
              <li><i class="fas fa-check"></i> SLA personalizados</li>
              <li><i class="fas fa-check"></i> API dedicada</li>
              <li><i class="fas fa-check"></i> Soporte prioritario 24/7</li>
            </ul>
            <a class="landing-btn landing-btn-outline" href="#login" style="width:100%;justify-content:center">Contactar</a>
          </div>
        </div>
      </section>

      <section class="landing-section" id="contact">
        <div class="landing-section-title">
          <h2>¿Listo para transformar tu monitoreo?</h2>
          <p>Contáctanos para una demostración personalizada o comienza gratis hoy.</p>
        </div>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
          <a class="landing-btn landing-btn-primary" href="#login"><i class="fas fa-rocket"></i> Comenzar Demo Gratis</a>
          <a class="landing-btn landing-btn-outline" href="mailto:info@callmetric.io"><i class="fas fa-envelope"></i> info@callmetric.io</a>
        </div>
      </section>

      <footer class="landing-footer">
        <div class="landing-footer-inner">
          <div class="landing-brand"><i class="fas fa-phone-alt"></i> CallMetric Pro</div>
          <p style="color:var(--text-muted);font-size:0.8rem">© 2026 CallMetric Pro. Todos los derechos reservados. Versión Demo 3.0</p>
          <div style="display:flex;gap:16px;font-size:0.8rem">
            <a href="#" style="color:var(--text-muted)">Términos</a>
            <a href="#" style="color:var(--text-muted)">Privacidad</a>
            <a href="#" style="color:var(--text-muted)">Documentación</a>
          </div>
        </div>
      </footer>
    `;
  }
};

const Validation = {
  required: function(value, label) {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return label + ' es obligatorio';
    }
    return null;
  },
  email: function(value) {
    if (!value) return null;
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value.trim())) {
      return 'El formato del email no es válido';
    }
    return null;
  },
  ip: function(value) {
    if (!value) return null;
    var re = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    var match = value.trim().match(re);
    if (!match) return 'La IP no tiene un formato válido';
    var parts = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseInt(match[4])];
    if (parts.some(function(p) { return p < 0 || p > 255; })) {
      return 'La IP no tiene un formato válido';
    }
    return null;
  },
  minLength: function(value, min, label) {
    if (!value) return null;
    if (value.trim().length < min) {
      return label + ' debe tener al menos ' + min + ' caracteres';
    }
    return null;
  },
  maxLength: function(value, max, label) {
    if (!value) return null;
    if (value.trim().length > max) {
      return label + ' debe tener máximo ' + max + ' caracteres';
    }
    return null;
  },
  numeric: function(value, label) {
    if (!value) return null;
    if (!/^\d+$/.test(value.trim())) {
      return label + ' debe ser un número válido';
    }
    return null;
  },
  positiveNumber: function(value, label) {
    if (!value) return null;
    var num = parseInt(value);
    if (isNaN(num) || num < 0) {
      return label + ' debe ser un número positivo';
    }
    return null;
  },
  alphanumeric: function(value, label) {
    if (!value) return null;
    if (!/^[a-zA-Z0-9]+$/.test(value.trim())) {
      return label + ' solo permite letras y números, sin espacios';
    }
    return null;
  },
  matches: function(value, otherValue, label) {
    if (value !== otherValue) {
      return label + ' no coincide';
    }
    return null;
  },
  phone: function(value) {
    if (!value) return null;
    var re = /^[\d\s\-\+\(\)]{7,20}$/;
    if (!re.test(value.trim())) {
      return 'El formato del teléfono no es válido';
    }
    return null;
  },
  hostname: function(value) {
    if (!value) return null;
    var re = /^[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?)*$/;
    if (!re.test(value.trim())) {
      return 'El hostname no tiene un formato válido';
    }
    return null;
  },
  password: function(value) {
    if (!value) return null;
    if (value.trim().length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  },
  unique: function(value, collection, key, label) {
    if (!value || !DATA[collection]) return null;
    var exists = DATA[collection].some(function(item) {
      return item[key] && item[key].toLowerCase() === value.trim().toLowerCase();
    });
    if (exists) {
      return 'Ya existe un registro con ese ' + label.toLowerCase();
    }
    return null;
  },
  validateForm: function(rules) {
    var errors = {};
    var values = {};
    var isValid = true;

    for (var fieldId in rules) {
      if (!rules.hasOwnProperty(fieldId)) continue;
      var validations = rules[fieldId];
      var el = document.getElementById(fieldId);
      if (!el) continue;
      var value = el.value;
      values[fieldId] = value;

      for (var i = 0; i < validations.length; i++) {
        var validation = validations[i];
        var rule = Array.isArray(validation) ? validation[0] : validation;
        var args = Array.isArray(validation) ? validation.slice(1) : [];
        var validator = this[rule];
        if (!validator) continue;
        var error = validator.apply(this, [value].concat(args));
        if (error) {
          errors[fieldId] = error;
          isValid = false;
          break;
        }
      }
    }
    return { isValid: isValid, errors: errors, values: values };
  },
  showErrors: function(errors) {
    for (var fieldId in errors) {
      if (!errors.hasOwnProperty(fieldId)) continue;
      var el = document.getElementById(fieldId);
      if (!el) continue;
      el.classList.add('is-invalid');
      var errorEl = el.parentElement.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = errors[fieldId];
        errorEl.classList.add('visible');
      }
    }
  },
  clearErrors: function(container) {
    var inputs = container.querySelectorAll('.is-invalid');
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      el.classList.remove('is-invalid');
      var errorEl = el.parentElement.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    }
  },
  clearOnInput: function(container) {
    var inputs = container.querySelectorAll('.form-input, .form-select');
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      el.addEventListener('input', function() {
        el.classList.remove('is-invalid');
        var errorEl = el.parentElement.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('visible');
        }
      });
      el.addEventListener('change', function() {
        el.classList.remove('is-invalid');
        var errorEl = el.parentElement.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('visible');
        }
      });
    }
  }
};
// src/lib/fontawesome.ts
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Evita que Font Awesome inyecte CSS dinámicamente en el <head>
config.autoAddCss = false;
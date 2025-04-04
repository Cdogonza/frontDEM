
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/frontDEM/login",
    "route": "/frontDEM"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/equipos"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/novedades"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/novedadForm"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/for-taller"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/taller"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/login"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/reset-password"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/change-password"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/formulario"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/reporte"
  },
  {
    "renderMode": 2,
    "route": "/frontDEM/facturacion"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5109, hash: '227e56ff752e6886fdbc886c846ade01f14dd1cbe8dddcdc3e4067070b01458a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1225, hash: 'c269f34fb95e21f2412564c2f7ce4ad9f01ea1674a209a8077b1af379a469751', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'frontDEM/novedades/index.html': {size: 5282, hash: '4d661e4098000879781821a7fcae867ca89214c3768b2fd6d589be8714c07761', text: () => import('./assets-chunks/frontDEM_novedades_index_html.mjs').then(m => m.default)},
    'frontDEM/equipos/index.html': {size: 5282, hash: '4d661e4098000879781821a7fcae867ca89214c3768b2fd6d589be8714c07761', text: () => import('./assets-chunks/frontDEM_equipos_index_html.mjs').then(m => m.default)},
    'frontDEM/novedadForm/index.html': {size: 16382, hash: 'af8d56ee87ff9f1b42494521f90615b83508b30642a0060e8e2870d82fd50e33', text: () => import('./assets-chunks/frontDEM_novedadForm_index_html.mjs').then(m => m.default)},
    'frontDEM/taller/index.html': {size: 5282, hash: '4d661e4098000879781821a7fcae867ca89214c3768b2fd6d589be8714c07761', text: () => import('./assets-chunks/frontDEM_taller_index_html.mjs').then(m => m.default)},
    'frontDEM/reset-password/index.html': {size: 7007, hash: '6afb63acedfe5fb8f481491f6053f35f6a62aff61f33e3ab6f0c39dc515cd9ce', text: () => import('./assets-chunks/frontDEM_reset-password_index_html.mjs').then(m => m.default)},
    'frontDEM/for-taller/index.html': {size: 5282, hash: '4d661e4098000879781821a7fcae867ca89214c3768b2fd6d589be8714c07761', text: () => import('./assets-chunks/frontDEM_for-taller_index_html.mjs').then(m => m.default)},
    'frontDEM/login/index.html': {size: 14899, hash: '8d3ee9e74c7c98346b52a713d878fe82b3958d4211d0f7da48db3975d93dc61a', text: () => import('./assets-chunks/frontDEM_login_index_html.mjs').then(m => m.default)},
    'frontDEM/reporte/index.html': {size: 5282, hash: '4d661e4098000879781821a7fcae867ca89214c3768b2fd6d589be8714c07761', text: () => import('./assets-chunks/frontDEM_reporte_index_html.mjs').then(m => m.default)},
    'frontDEM/change-password/index.html': {size: 5282, hash: '4d661e4098000879781821a7fcae867ca89214c3768b2fd6d589be8714c07761', text: () => import('./assets-chunks/frontDEM_change-password_index_html.mjs').then(m => m.default)},
    'frontDEM/facturacion/index.html': {size: 5282, hash: '4d661e4098000879781821a7fcae867ca89214c3768b2fd6d589be8714c07761', text: () => import('./assets-chunks/frontDEM_facturacion_index_html.mjs').then(m => m.default)},
    'frontDEM/formulario/index.html': {size: 5282, hash: '4d661e4098000879781821a7fcae867ca89214c3768b2fd6d589be8714c07761', text: () => import('./assets-chunks/frontDEM_formulario_index_html.mjs').then(m => m.default)},
    'styles-DZ6UBGXD.css': {size: 231612, hash: 'B2Fy9V+bfZo', text: () => import('./assets-chunks/styles-DZ6UBGXD_css.mjs').then(m => m.default)}
  },
};

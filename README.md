# CicloServicio — Demo comercial premium

**Estado:** prototipo comercial, no SaaS de producción.

## Páginas

- `/` (`index.html`): landing de producto, propuesta de valor y acceso al recorrido.
- `/demo.html`: aplicación interactiva con panel, cartera ficticia y fichas.
- `styles.css`, `site.js`, `demo.css`, `app.js`: interfaz, interacciones y estilos.

## Probar localmente

Abrir `index.html` o, para enlaces y navegación idénticos a producción:

```bash
python3 -m http.server 8000
```

Luego visitar `http://localhost:8000`.

No requiere instalación ni servicios externos. La tipografía tiene fallback cuando Google Fonts no está disponible.

## Publicar en Vercel

Importar el repositorio GitHub `8asty/cicloservicio-piloto` en Vercel, elegir **Framework Preset: Other** si la detección lo pide, seleccionar el directorio raíz y publicar. No necesita comando de build ni variables de entorno.

## Funciones de la demo

- Búsqueda, filtro y orden por fecha clave.
- Indicadores calculados a partir de la cartera ficticia.
- Vista de próximos eventos y contratos.
- Ficha detallada de cada cliente, acción sugerida, borrador editable y copia al portapapeles.
- Estados de seguimiento (`pendiente`, `contactado`, `agendado`) guardados localmente en el navegador.
- Compartir enlace y reiniciar simulación.
- Diseño adaptable a móvil y escritorio.

## Límites (importantes)

- Todos los nombres, importes, fechas, acciones y casos son ficticios.
- No existe backend, permisos de equipo, base de datos compartida, CRM, correos automáticos, facturación o integración con terceros.
- La etiqueta "demo interactiva" no representa funcionalidades reales conectadas.
- No usar datos de clientes reales en este prototipo.
- Los importes ilustrativos no son ingresos reales ni ahorros observados.

## Producto comercial posterior

Solo una vez validado con prospectos: separación por empresa, autenticación, roles, importación autorizada, agenda y alertas, registro auditable de estados, opciones de comunicación autorizadas, soporte y privacidad.

Nombre CicloServicio provisional: revisar uso y disponibilidad marcaria antes de comercializarlo.
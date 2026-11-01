# CicloServicio — instrucciones para Codex

## Alcance
Trabaja exclusivamente en el repositorio `8asty/cicloservicio-piloto`.
La web publicada corresponde al proyecto de Vercel `cicloservicio-piloto` (ID: `prj_MDRnzmVvw9syjION6LDSrs3gWxSo`).
**Nunca** modificar `pb-project-app`, `5k-reporte-diario`, `detailflow-optimux`, `solarflow-semeber`, `vivetubarrio` ni otros proyectos. No tocar configuración de equipos, dominios ni variables secretas.

## Producto y audiencia
Demo comercial B2B para empresas chilenas que realizan mantenciones recurrentes de climatización u otros equipos.
Problema: saber qué visitas faltan coordinar, qué contratos vencen y a qué clientes contactar.
La meta inmediata es una demo convincente para iniciar conversaciones, no un SaaS ya integrado.

## Estado actual
- `index.html`: landing comercial.
- `demo.html`: dashboard interactivo con casos ficticios y almacenamiento local en navegador.
- Tecnologías actuales: HTML, CSS y JavaScript sin framework ni backend.
- Despliegue Vercel actual es **directo/manual**; no asumir que un push a GitHub publica automáticamente.
- Los datos y resultados de la demo son simulados. No se envían correos ni se actualizan sistemas de clientes.

## Redacción
Español natural de Chile, sobrio y específico del rubro. Decir «mantención», «cliente», «fecha», «visita», «contrato», «coordinar», «renovación».
Evitar titulares motivacionales, exageraciones, frases de póster, «inteligencia comercial», «potenciar», «revolucionar», «solución integral».
No inventar métricas de ventas, ahorros, integraciones ni testimonios. Señalar con claridad los ejemplos ficticios.
Los textos actuales de la landing ya fueron revisados editorialmente: no reescribirlos de forma global sin una razón concreta.

## Modo de trabajo para ahorrar recursos
1. Leer solo archivos relevantes a la tarea.
2. Cambiar lo mínimo necesario: sin migraciones a frameworks, dependencias o refactors masivos salvo aprobación explícita.
3. Mantener y probar interacciones existentes; no añadir botones que no hagan nada.
4. Antes de editar, resumir brevemente el cambio necesario; después, enumerar archivos editados, pruebas ejecutadas y riesgos.
5. Si hay cambios de código, ejecutar comprobaciones pertinentes. Si no es posible comprobar algo, declararlo sin inventar resultados.
6. Trabajar en una rama distinta de `main` y proponer PR para revisión, salvo instrucción explícita en contrario.
7. No desplegar ni enviar correos por iniciativa propia. El usuario revisará antes de publicación y envío.
8. No pedir datos reales de clientes ni conectar canales externos sin autorización y diseño de privacidad.

## Criterio de salida a prospección
La demo debe: abrir correctamente en móvil y escritorio; enlazar landing → demo; permitir filtrar y abrir fichas; preparar/copy borradores; registrar estados localmente; mostrar que los datos son ficticios; ofrecer un contacto directo funcional; y no prometer capacidades todavía inexistentes.
No requiere, para el primer correo: login, multiempresa, CRM real, facturación ni automatizaciones en producción.

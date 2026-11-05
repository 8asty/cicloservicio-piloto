# Seguimiento comercial después de la mantención

El recorrido abre la ficha ficticia de Oficinas Parque Norte. La última gestión fue coordinar el acceso al edificio. La mantención ya terminó y falta preguntar cómo quedaron los equipos y conversar sobre la continuidad del convenio bimestral. La ficha distingue la fecha del servicio de la fecha del contacto y muestra que el seguimiento está sin asignar.

| En el PR #4 | En esta versión |
| --- | --- |
| Cartera ordenada por fecha técnica | Clientes pendientes primero, con motivo, gestión anterior y próxima acción |
| Borrador para coordinar una próxima visita | Mensaje editable que parte del servicio ya realizado |
| Marcar contactado | Simular una gestión y guardar su fecha en el navegador |
| Confirmación de término | Volver a la fila actualizada y ver que falta revisar si hubo respuesta |

Preparar y copiar el borrador deja la cartera intacta. Solo el botón de registro cambia el estado. Las fechas iniciales son relativas al día de exploración. Las gestiones registradas conservan la fecha de registro y los estados de versiones anteriores se muestran sin inventar una fecha. El restablecimiento recupera los datos ficticios.

La guía reutiliza los diálogos y los tres pasos del PR #4. La exploración libre conserva la búsqueda, los filtros de visitas y renovaciones y el agendamiento simulado. La landing mantiene la redacción aprobada. Los ejemplos bimestrales y semestrales son ficticios y no describen los procesos de una empresa real.

Para probar las transiciones, la compatibilidad de los estados y los errores de portapapeles o almacenamiento, ejecutar `node tests/guided-flow.test.cjs`. Para comprobar la comprensión con un visitante, abrir `demo.html?guia=1` y pedirle que explique qué gestión faltaba al terminar la mantención y qué queda pendiente después de copiar el texto.

# Plan

El agente trabaja una fase cada vez y marca las casillas al cerrarla.

## Fase 0 · Esqueleto

**Objetivo:** una versión mínima que se abre y funciona.

**Tareas:**
- [x] Crear la estructura mínima con la tecnología de `docs/project-info.md`.
- [x] Mostrar una primera pantalla con el nombre de la app.

**Pruebas:**
- Una prueba automática comprueba que la app se abre y muestra su nombre.

**Hecho cuando:** la app se abre sin errores, se ve su nombre y la prueba pasa.

## Fase 1 · Apuntar una sesión

**Objetivo:** apuntar una sesión de estudio y verla en una lista. Los datos solo están en memoria, sin base de datos.

**Tareas:**
- [x] Instalar Vitest para las pruebas unitarias.
- [x] Mostrar en `/` un formulario con asignatura en texto libre, fecha y duración, y debajo la lista de sesiones.
- [x] Validar en funciones separadas de la interfaz, que reciben "hoy" como parámetro.

**Pruebas:**
- Unitarias de la validación: datos obligatorios, duración de 1 minuto a 24 h, minutos de 0 a 59 y fecha no futura.
- Unitaria de la conversión de horas y minutos a minutos.
- Playwright: apuntar una sesión y verla en la lista.
- Playwright: una duración de 0 h 0 min muestra un aviso y no añade nada.

**Cómo lo compruebas al abrir la app:** apuntas Matemáticas con 1 h 30 min y aparece en la lista. Con 0 h 0 min sale un aviso y no se añade. Al recargar, la lista se vacía, que es lo esperado en esta fase.

**Hecho cuando:** se pueden apuntar sesiones válidas, las no válidas se rechazan con un aviso y todas las pruebas pasan.

## Fase 2 · Guardar las sesiones

**Objetivo:** que las sesiones sigan ahí al recargar, guardadas en SQLite.

**Tareas:**
- [ ] Sustituir en `.env.example` la línea `GEMINI_API_KEY` por `DATABASE_PATH`, y dar un error claro si falta.
- [ ] Abrir SQLite con una única conexión, solo cuando se use y nunca al importar el módulo.
- [ ] Crear las tablas con migraciones numeradas, controladas con `PRAGMA user_version`.
- [ ] Crear la tabla de sesiones, con la asignatura como texto y la fecha como `YYYY-MM-DD`.
- [ ] Sustituir la lista en memoria por el guardado en SQLite, reutilizando el formulario y la validación.
- [ ] Hacer que Playwright arranque su propio servidor en otro puerto, sin reutilizar uno abierto y con una base de datos de pruebas nueva en cada ejecución.

**Pruebas:**
- Unitaria del guardado y la lectura contra una base de datos temporal.
- Playwright: apuntar una sesión, recargar y seguir viéndola.

**Cómo lo compruebas al abrir la app:** apuntas una sesión, recargas y sigue ahí. Paras y vuelves a arrancar `npm run dev`, y sigue ahí.

**Hecho cuando:** la sesión sobrevive a una recarga y a reiniciar el servidor, y las pruebas no tocan la base de datos de desarrollo.

## Fase 3 · Corregir y borrar sesiones

**Objetivo:** arreglar lo que se ha apuntado mal.

**Tareas:**
- [ ] Ordenar la lista de sesiones de más reciente a más antigua.
- [ ] Corregir una sesión con la misma validación que al crearla.
- [ ] Borrar una sesión, con confirmación previa.

**Pruebas:**
- Unitarias de la corrección y el borrado contra una base de datos temporal.
- Playwright: corregir una sesión y verla cambiada tras recargar.
- Playwright: cancelar el borrado no borra nada, y confirmarlo sí.

**Cómo lo compruebas al abrir la app:** cambias 1 h 30 min por 2 h, recargas y ves 2 h. Borras la sesión, confirmas y desaparece.

**Hecho cuando:** corregir y borrar persisten tras recargar y todas las pruebas pasan.

## Fase 4 · Asignaturas

**Objetivo:** gestionar una lista de asignaturas y elegir de ella al apuntar una sesión.

**Tareas:**
- [ ] Crear la tabla de asignaturas con una migración que convierta en asignaturas los textos de las sesiones ya guardadas.
- [ ] Crear la pantalla `/asignaturas` para crear, renombrar y borrar, y un menú para moverse entre pantallas.
- [ ] Impedir nombres vacíos o repetidos, sin distinguir mayúsculas ni minúsculas.
- [ ] Impedir borrar una asignatura con sesiones, con un aviso.
- [ ] Cambiar el campo de asignatura del formulario por un selector.

**Pruebas:**
- Unitarias de la validación del nombre.
- Unitaria de la migración: "Mates" y "mates" terminan en una sola asignatura y las sesiones la conservan.
- Playwright: crear una asignatura y usarla en una sesión.
- Playwright: borrar una asignatura con sesiones muestra el aviso y no la borra.

**Cómo lo compruebas al abrir la app:** creas Matemáticas e Historia, recargas y siguen ahí. Crear "matemáticas" da aviso. Las sesiones anteriores conservan su asignatura.

**Hecho cuando:** las sesiones se apuntan eligiendo asignatura, las ya guardadas no se pierden y todas las pruebas pasan.

## Fase 5 · Resumen de una semana

**Objetivo:** ver cuánto se ha estudiado en una semana, en total y por asignatura.

**Tareas:**
- [ ] Crear funciones separadas de la interfaz para calcular la semana de lunes a domingo y sus totales, trabajando con fechas `YYYY-MM-DD`.
- [ ] Crear la pantalla `/resumen`, que recibe la semana en la URL (`?semana=2026-11-02`) y sin ella muestra la actual.
- [ ] Mostrar el total y el desglose por asignatura.
- [ ] Mostrar un estado vacío claro cuando la semana no tenga sesiones.

**Pruebas:**
- Unitarias del caso de referencia de `docs/project-info.md`: Matemáticas = 2 h 15 min, Historia = 2 h, total = 4 h 15 min.
- Unitarias de los límites: la sesión del domingo 8/11/2026 cuenta en la semana del 2 al 8, y la del lunes 9/11/2026 no.
- Unitaria del cambio de año: el 1/1/2027 pertenece a la semana del 28/12/2026 al 3/1/2027.
- Unitaria del cambio de hora: la semana del 26/10/2026 sigue teniendo 7 días correctos.
- Playwright: registrar el caso de referencia y ver sus totales en `/resumen?semana=2026-11-02`.

**Cómo lo compruebas al abrir la app:** registras las cuatro sesiones del caso de referencia y abres `/resumen?semana=2026-11-02`. Ves Matemáticas 2 h 15 min, Historia 2 h y total 4 h 15 min.

**Hecho cuando:** el resumen muestra los totales esperados y la sesión del lunes 9 queda fuera.

## Fase 6 · Navegación entre semanas

**Objetivo:** moverse por el historial de semanas.

**Tareas:**
- [ ] Añadir botones de semana anterior, semana siguiente y volver a la actual.
- [ ] Impedir avanzar más allá de la semana actual.
- [ ] Mostrar la semana actual si la URL trae una fecha no válida o futura.

**Pruebas:**
- Unitarias del cálculo de semana anterior y siguiente, y de la interpretación del parámetro de la URL.
- Playwright: navegar atrás y adelante, y volver a la semana actual.

**Cómo lo compruebas al abrir la app:** desde la semana del 2 al 8 de noviembre de 2026 avanzas una semana y ves la sesión del lunes 9. En la semana actual no puedes avanzar más.

**Hecho cuando:** la navegación funciona, el enlace de una semana se puede abrir directamente y todas las pruebas pasan.

## Fase 7 · Objetivo semanal

**Objetivo:** fijar cuántas horas se quieren estudiar y ver el progreso de la semana actual.

**Tareas:**
- [ ] Crear con una migración la tabla del objetivo.
- [ ] Permitir fijar y cambiar el objetivo, con validación de que sea mayor que cero.
- [ ] Calcular el progreso en una función separada de la interfaz.
- [ ] Mostrar el progreso solo en la semana actual.

**Pruebas:**
- Unitarias del progreso: 4 h 15 min con objetivo de 5 h = 85 %, sin objetivo no hay porcentaje y superar el objetivo muestra más del 100 %.
- Playwright: fijar un objetivo de 5 h, apuntar 4 h 15 min en la semana actual y ver 85 %.
- Playwright: una semana anterior no muestra porcentaje.

**Cómo lo compruebas al abrir la app:** fijas 5 h, apuntas 4 h 15 min esta semana y ves 85 %. Un objetivo de 0 da aviso, y en semanas anteriores no aparece el porcentaje.

**Hecho cuando:** el progreso es correcto en la semana actual, no aparece en las anteriores y todas las pruebas pasan.

## Fase 8 · Gráfico

**Objetivo:** ver de un vistazo las horas de cada día de la semana.

**Tareas:**
- [ ] Calcular las horas por día en una función separada de la interfaz.
- [ ] Mostrar un gráfico de barras de lunes a domingo, sin añadir una librería si no hace falta.
- [ ] Mostrar también el valor de cada día como texto, para que se entienda sin depender de la altura de la barra.

**Pruebas:**
- Unitaria de las horas por día, incluidos los días sin sesiones.
- Playwright: el caso de referencia muestra los valores correctos en cada día.

**Cómo lo compruebas al abrir la app:** en la semana del 2 al 8 de noviembre de 2026 ves barras el lunes (1 h 30 min), el miércoles (2 h) y el domingo (45 min), y los demás días están vacíos.

**Hecho cuando:** el caso de referencia completo da el resultado esperado de extremo a extremo y todas las pruebas y el linter pasan sin errores ni avisos.

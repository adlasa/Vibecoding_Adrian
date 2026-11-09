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

## Fase 1 · Cuentas

**Objetivo:** cada alumno puede crear su cuenta, entrar y salir, y sin sesión no se accede a la app.

**Tareas:**
- [ ] Conectar la app con el proyecto de Supabase de desarrollo y añadir los nombres de las claves a `.env.example`.
- [ ] Desactivar la confirmación de email en el proyecto de desarrollo, para que las pruebas puedan crear cuentas.
- [ ] Crear las pantallas de registro y de entrada con email y contraseña.
- [ ] Añadir la opción de salir.
- [ ] Redirigir a la pantalla de entrada a quien intente abrir la app sin sesión.
- [ ] Mostrar un aviso cuando los datos no sean válidos o las credenciales sean incorrectas.

**Pruebas:**
- Unitarias de la validación de email y contraseña.
- Playwright: crear una cuenta, salir y volver a entrar.
- Playwright: una contraseña incorrecta muestra un aviso y no da acceso.
- Playwright: abrir la app sin sesión lleva a la pantalla de entrada.

**Hecho cuando:** un alumno inventado completa el ciclo de registro, entrada y salida, y nadie sin sesión llega a la app.

## Fase 2 · Asignaturas y sesiones

**Objetivo:** cada alumno gestiona sus asignaturas y registra sus sesiones de estudio, y solo ve lo suyo.

**Tareas:**
- [ ] Crear en una migración SQL del repositorio las tablas de asignaturas y sesiones, con sus reglas de acceso por fila (RLS).
- [ ] Crear, renombrar y borrar asignaturas. Una asignatura con sesiones no se puede borrar: se avisa al alumno.
- [ ] Registrar una sesión con fecha, asignatura y duración en horas y minutos.
- [ ] Listar, corregir y borrar sesiones.
- [ ] Validar en funciones separadas de la interfaz: datos obligatorios, duración mayor que cero y nombre de asignatura no vacío ni repetido.

**Pruebas:**
- Unitarias de cada regla de validación y de la conversión de horas y minutos a minutos.
- Playwright: crear una asignatura, registrar una sesión, corregirla y borrarla.
- Playwright: borrar una asignatura con sesiones muestra el aviso y no la borra.
- Prueba de aislamiento: un segundo alumno no ve ni puede modificar las asignaturas y sesiones del primero, tampoco consultando Supabase directamente con su sesión.

**Hecho cuando:** un alumno gestiona sus asignaturas y sesiones de principio a fin, y la prueba de aislamiento pasa.

## Fase 3 · Resumen semanal

**Objetivo:** el alumno ve cuánto ha estudiado en una semana, en total y por asignatura, y puede moverse entre semanas.

**Tareas:**
- [ ] Crear funciones separadas de la interfaz para calcular la semana de lunes a domingo de una fecha y los totales de esa semana.
- [ ] Mostrar el total de horas y el desglose por asignatura de la semana actual.
- [ ] Añadir la navegación a semanas anteriores y la vuelta a la semana actual.
- [ ] Mostrar un estado vacío claro cuando la semana no tenga sesiones.

**Pruebas:**
- Unitarias del caso de referencia de `docs/project-info.md`: Matemáticas = 2 h 15 min, Historia = 2 h, total = 4 h 15 min.
- Unitarias de los límites: la sesión del domingo 8/11/2026 cuenta en la semana del 2 al 8, y la del lunes 9/11/2026 no.
- Unitaria del cambio de año: el 1/1/2027 pertenece a la semana del 28/12/2026 al 3/1/2027.
- Playwright: registrar sesiones, ver sus totales en el resumen y navegar a otra semana.

**Hecho cuando:** el resumen muestra los totales esperados del caso de referencia y la navegación entre semanas funciona.

## Fase 4 · Objetivo y gráfico

**Objetivo:** el alumno fija su objetivo semanal, ve su progreso y ve sus horas de cada día en un gráfico.

**Tareas:**
- [ ] Crear en una migración SQL la tabla del objetivo, con sus reglas de acceso por fila (RLS).
- [ ] Permitir fijar y cambiar el objetivo de horas semanales, con validación de que sea mayor que cero.
- [ ] Calcular el progreso en una función separada de la interfaz y mostrarlo en el resumen.
- [ ] Mostrar un gráfico de barras con las horas de cada día de la semana, sin añadir una librería si no hace falta.
- [ ] Revisar con el caso de referencia completo que todo el resumen encaja.

**Pruebas:**
- Unitarias del progreso: 4 h 15 min con objetivo de 5 h = 85 %, sin objetivo no se muestra porcentaje y superar el objetivo muestra más del 100 %.
- Unitaria de las horas por día de una semana, incluidos los días sin sesiones.
- Playwright: fijar el objetivo de 5 h, registrar el caso de referencia y ver 85 % y las barras correctas.
- Prueba de aislamiento: un segundo alumno no ve ni modifica el objetivo del primero, y su resumen de esa semana muestra 0 h.

**Hecho cuando:** el caso de referencia completo de `docs/project-info.md` da el resultado esperado de extremo a extremo y todas las pruebas y el linter pasan sin errores ni avisos.

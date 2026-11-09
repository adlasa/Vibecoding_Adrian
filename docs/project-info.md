# Información del proyecto

## Qué es
Una web donde un alumno registra sus horas de estudio por asignatura y consulta un resumen semanal de cuánto ha estudiado frente a su objetivo.

## Para quién
Un alumno que quiere saber cuánto tiempo dedica realmente a cada asignatura y si cumple las horas que se ha propuesto. La app funciona en su propio ordenador, para una sola persona.

## Funciones
- Crear, renombrar y borrar asignaturas. Una asignatura con sesiones no se puede borrar.
- Registrar a mano una sesión de estudio: fecha, asignatura y duración en horas y minutos.
- Ver, corregir y borrar sesiones.
- Fijar un objetivo de horas semanales, único para todas las asignaturas.
- Ver el resumen de una semana, de lunes a domingo:
  - horas totales y desglose por asignatura;
  - gráfico de barras con las horas de cada día;
  - progreso respecto al objetivo, solo en la semana actual.
- Navegar a semanas anteriores y volver a la actual, sin pasar de la semana actual.
- Avisar si falta un dato o no es válido.

## Reglas de validación
- La duración de una sesión va de 1 minuto a 24 horas.
- La fecha de una sesión no puede ser futura.
- Varias sesiones pueden compartir día y asignatura.
- El nombre de una asignatura no puede estar vacío ni repetido, sin distinguir mayúsculas ni minúsculas.
- El objetivo semanal debe ser mayor que cero.

## Pantallas
Las pantallas comparten un menú para moverse entre ellas y deben ser legibles en móvil.

- `/`: formulario para apuntar una sesión y lista de sesiones.
- `/asignaturas`: gestión de asignaturas.
- `/resumen`: resumen semanal. La semana va en la URL (`/resumen?semana=2026-11-02`), y sin ella se muestra la actual.

## Fuera de alcance
- Cuentas, login y varios usuarios.
- Vista o rol de profesor.
- Cronómetro para medir sesiones en directo.
- Objetivos distintos por asignatura.
- Recordatorios, notificaciones y exportación de datos.
- Publicar la app en internet.
- Aplicación móvil nativa.

## Tecnología
- Next.js, para la interfaz y el servidor de la web.
- SQLite, con el módulo `node:sqlite` integrado en Node.js, como base de datos en un único archivo local.
- La lógica de negocio (validación, cálculo de semanas, totales y progreso) va en funciones separadas de la interfaz.
- Se ejecuta en local. El archivo de la base de datos debe estar fuera de OneDrive, porque la sincronización puede bloquearlo o corromperlo.
- Las fechas de las sesiones se guardan y se calculan como `YYYY-MM-DD`.

## Cómo se arranca
1. Ejecutar `npm install`.
2. Copiar `.env.example` a `.env` y escribir en `DATABASE_PATH` una ruta absoluta fuera de OneDrive, por ejemplo `C:\Users\<usuario>\AppData\Local\horas-de-estudio\horas.db`.
3. Ejecutar `npm run dev` y abrir `http://localhost:3000`.

## Datos y claves
**Datos que se guardan:**
- Asignatura: nombre.
- Sesión de estudio: asignatura, fecha y duración en minutos.
- Objetivo: minutos semanales. Hay un único valor vigente, que solo se usa en la semana actual.

No hay datos de otras personas ni copia de seguridad: si se pierde el archivo, se pierden los datos.

**Configuración (valores solo en `.env`):**
- `DATABASE_PATH`

No necesita claves de servicios externos.

## Cómo se prueba
**Pruebas automáticas:** pruebas unitarias con Vitest junto al código, pruebas de extremo a extremo con Playwright en `e2e/` y ESLint sin errores ni avisos. Las pruebas usan siempre una base de datos propia, nunca la de desarrollo.

**Caso de referencia:** se registran estas sesiones.

| Fecha | Asignatura | Duración |
|---|---|---|
| Lunes 2/11/2026 | Matemáticas | 1 h 30 min |
| Miércoles 4/11/2026 | Historia | 2 h |
| Domingo 8/11/2026 | Matemáticas | 45 min |
| Lunes 9/11/2026 | Historia | 1 h |

Resultado esperado en la semana del 2 al 8 de noviembre de 2026: Matemáticas = 2 h 15 min, Historia = 2 h y total = 4 h 15 min. La sesión del lunes 9 no cuenta, porque pertenece a la semana siguiente.

**Caso de progreso:** con un objetivo de 5 h y 4 h 15 min registradas en la semana actual, el progreso es 85 %.

---

<details>
<summary>Ejemplo de referencia: calculadora de hipoteca (no es tu proyecto)</summary>

**Qué es:** una página que calcula la cuota mensual de una hipoteca.

**Para quién:** personas que están comparando hipotecas antes de ir al banco.

**Funciones:**
- Pedir importe, interés anual y años.
- Mostrar la cuota mensual.
- Avisar si falta un dato o no es válido.

**Fuera de alcance:** cuentas de usuario, guardar simulaciones y ofertas de bancos reales.

**Tecnología:** una página HTML con JavaScript que se abre en el navegador.

**Datos y claves:** solo los datos que escribe el usuario, que no se guardan. No necesita claves.

**Cómo se prueba:** 200.000 € al 3 % a 30 años = 843 €/mes.

</details>

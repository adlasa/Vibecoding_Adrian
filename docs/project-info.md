# Información del proyecto

## Qué es
Una web donde cada alumno registra sus horas de estudio por asignatura y consulta un resumen semanal de cuánto ha estudiado frente a su objetivo.

## Para quién
Alumnos que quieren saber cuánto tiempo dedican realmente a cada asignatura y si cumplen las horas que se han propuesto. Cada alumno usa su propia cuenta y solo ve sus datos.

## Funciones
- Crear una cuenta con email y contraseña, entrar y salir.
- Crear, renombrar y borrar sus propias asignaturas.
- Registrar a mano una sesión de estudio: fecha, asignatura y duración en horas y minutos.
- Ver, corregir y borrar sus sesiones.
- Fijar un objetivo de horas semanales, único para todas las asignaturas.
- Ver el resumen de una semana, de lunes a domingo:
  - horas totales y desglose por asignatura;
  - gráfico de barras con las horas de cada día;
  - progreso respecto al objetivo semanal.
- Navegar a semanas anteriores y volver a la actual.
- Avisar si falta un dato o no es válido (por ejemplo, una duración de cero).

## Fuera de alcance
- Vista o rol de profesor, y cualquier forma de ver datos de otros alumnos.
- Cronómetro para medir sesiones en directo.
- Objetivos distintos por asignatura.
- Recuperación de contraseña y acceso con Google u otros proveedores.
- Recordatorios, notificaciones y exportación de datos.
- Aplicación móvil nativa.

## Tecnología
- Next.js, para la interfaz y el servidor de la web.
- Supabase, para la base de datos (Postgres) y el login.
- La lógica de negocio (cálculo de semanas, totales y progreso) va en funciones separadas de la interfaz.
- En desarrollo se ejecuta en local, conectada a un proyecto de Supabase solo de desarrollo.
- La publicación está sin decidir y necesita permiso explícito.

## Cómo se arranca
1. Copiar `.env.example` a `.env` y rellenar las claves del proyecto de Supabase de desarrollo.
2. Ejecutar `npm install`.
3. Ejecutar `npm run dev` y abrir `http://localhost:3000`.

## Datos y claves
**Datos que se guardan:**
- Usuario: email y contraseña, gestionados por Supabase.
- Asignatura: alumno y nombre.
- Sesión de estudio: alumno, asignatura, fecha y duración en minutos.
- Objetivo: alumno y minutos semanales. Hay un único valor vigente, que se aplica también al consultar semanas anteriores.

El email es un dato personal. Cada tabla se protege con reglas de acceso por fila (RLS) para que un alumno solo pueda leer y modificar lo suyo. En desarrollo solo se usan datos inventados.

**Claves (valores solo en `.env`):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Cómo se prueba
**Pruebas automáticas:** pruebas unitarias con Vitest junto al código, pruebas de extremo a extremo con Playwright en `e2e/` y ESLint sin errores ni avisos.

**Caso de referencia:** un alumno con objetivo de 5 h registra estas sesiones.

| Fecha | Asignatura | Duración |
|---|---|---|
| Lunes 2/11/2026 | Matemáticas | 1 h 30 min |
| Miércoles 4/11/2026 | Historia | 2 h |
| Domingo 8/11/2026 | Matemáticas | 45 min |
| Lunes 9/11/2026 | Historia | 1 h |

Resultado esperado en la semana del 2 al 8 de noviembre de 2026: Matemáticas = 2 h 15 min, Historia = 2 h, total = 4 h 15 min y progreso = 85 % del objetivo. La sesión del lunes 9 no cuenta, porque pertenece a la semana siguiente.

**Caso de aislamiento:** un segundo alumno entra con su cuenta y no ve ninguna de esas asignaturas ni sesiones, y su resumen de esa semana muestra 0 h.

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

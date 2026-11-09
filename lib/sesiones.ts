export type EntradaSesion = {
  asignatura: string;
  fecha: string;
  horas: string;
  minutos: string;
};

export type Sesion = {
  asignatura: string;
  fecha: string;
  minutos: number;
};

export type ResultadoValidacion =
  | { ok: true; sesion: Sesion }
  | { ok: false; errores: string[] };

const MINUTOS_MAXIMOS = 24 * 60;

export function aMinutos(horas: number, minutos: number): number {
  return horas * 60 + minutos;
}

function leerEntero(texto: string): number | null {
  const limpio = texto.trim();
  if (limpio === "") return 0;
  return /^\d+$/.test(limpio) ? Number(limpio) : null;
}

function esFechaReal(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const calculada = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    calculada.getUTCFullYear() === anio &&
    calculada.getUTCMonth() === mes - 1 &&
    calculada.getUTCDate() === dia
  );
}

function erroresDeFecha(fecha: string, hoy: string): string[] {
  if (fecha === "") return ["Indica la fecha."];
  if (!esFechaReal(fecha)) return ["La fecha no es válida."];
  // Las fechas YYYY-MM-DD se ordenan igual como texto que como fecha.
  if (fecha > hoy) return ["La fecha no puede ser futura."];
  return [];
}

function erroresDeDuracion(
  horas: number | null,
  minutos: number | null,
): string[] {
  if (horas === null || minutos === null) {
    return ["Las horas y los minutos deben ser números enteros."];
  }
  if (minutos > 59) return ["Los minutos deben estar entre 0 y 59."];
  const total = aMinutos(horas, minutos);
  if (total < 1) return ["La duración debe ser de al menos 1 minuto."];
  if (total > MINUTOS_MAXIMOS) {
    return ["La duración no puede superar las 24 horas."];
  }
  return [];
}

export function validarSesion(
  entrada: EntradaSesion,
  hoy: string,
): ResultadoValidacion {
  const asignatura = entrada.asignatura.trim();
  const fecha = entrada.fecha.trim();
  const horas = leerEntero(entrada.horas);
  const minutos = leerEntero(entrada.minutos);

  const errores = [
    ...(asignatura === "" ? ["Escribe la asignatura."] : []),
    ...erroresDeFecha(fecha, hoy),
    ...erroresDeDuracion(horas, minutos),
  ];
  if (errores.length > 0) return { ok: false, errores };

  return {
    ok: true,
    sesion: { asignatura, fecha, minutos: aMinutos(horas!, minutos!) },
  };
}

export function formatearDuracion(totalMinutos: number): string {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  if (horas === 0) return `${minutos} min`;
  if (minutos === 0) return `${horas} h`;
  return `${horas} h ${minutos} min`;
}

export function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

export function fechaDeHoy(ahora: Date): string {
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

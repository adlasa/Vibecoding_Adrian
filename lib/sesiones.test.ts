import { describe, expect, it } from "vitest";
import {
  aMinutos,
  fechaDeHoy,
  formatearDuracion,
  formatearFecha,
  validarSesion,
  type EntradaSesion,
} from "./sesiones";

const HOY = "2026-11-09";
const valida: EntradaSesion = {
  asignatura: "Matemáticas",
  fecha: "2026-11-02",
  horas: "1",
  minutos: "30",
};

function errores(cambios: Partial<EntradaSesion>): string[] {
  const resultado = validarSesion({ ...valida, ...cambios }, HOY);
  return resultado.ok ? [] : resultado.errores;
}

describe("aMinutos", () => {
  it("convierte horas y minutos a minutos", () => {
    expect(aMinutos(1, 30)).toBe(90);
    expect(aMinutos(0, 45)).toBe(45);
    expect(aMinutos(2, 0)).toBe(120);
  });
});

describe("validarSesion", () => {
  it("acepta una sesión válida y devuelve la duración en minutos", () => {
    expect(validarSesion(valida, HOY)).toEqual({
      ok: true,
      sesion: { asignatura: "Matemáticas", fecha: "2026-11-02", minutos: 90 },
    });
  });

  it("quita los espacios sobrantes de la asignatura", () => {
    const resultado = validarSesion(
      { ...valida, asignatura: "  Historia " },
      HOY,
    );
    expect(resultado.ok && resultado.sesion.asignatura).toBe("Historia");
  });

  it("exige asignatura y fecha", () => {
    expect(errores({ asignatura: "   " })).toEqual(["Escribe la asignatura."]);
    expect(errores({ fecha: "" })).toEqual(["Indica la fecha."]);
  });

  it("devuelve todos los errores a la vez", () => {
    expect(
      errores({ asignatura: "", fecha: "", horas: "0", minutos: "0" }),
    ).toHaveLength(3);
  });

  it("rechaza fechas que no existen", () => {
    expect(errores({ fecha: "2026-02-31" })).toEqual([
      "La fecha no es válida.",
    ]);
    expect(errores({ fecha: "02/11/2026" })).toEqual([
      "La fecha no es válida.",
    ]);
  });

  it("acepta la fecha de hoy y rechaza la de mañana", () => {
    expect(errores({ fecha: HOY })).toEqual([]);
    expect(errores({ fecha: "2026-11-10" })).toEqual([
      "La fecha no puede ser futura.",
    ]);
  });

  it("rechaza una duración de cero, también con los campos vacíos", () => {
    const mensaje = ["La duración debe ser de al menos 1 minuto."];
    expect(errores({ horas: "0", minutos: "0" })).toEqual(mensaje);
    expect(errores({ horas: "", minutos: "" })).toEqual(mensaje);
  });

  it("admite los límites de 1 minuto y 24 horas", () => {
    expect(errores({ horas: "", minutos: "1" })).toEqual([]);
    expect(errores({ horas: "24", minutos: "0" })).toEqual([]);
  });

  it("rechaza más de 24 horas", () => {
    expect(errores({ horas: "24", minutos: "1" })).toEqual([
      "La duración no puede superar las 24 horas.",
    ]);
  });

  it("limita los minutos de 0 a 59", () => {
    expect(errores({ minutos: "59" })).toEqual([]);
    expect(errores({ minutos: "60" })).toEqual([
      "Los minutos deben estar entre 0 y 59.",
    ]);
  });

  it("rechaza valores que no son enteros positivos", () => {
    const mensaje = ["Las horas y los minutos deben ser números enteros."];
    expect(errores({ horas: "1.5" })).toEqual(mensaje);
    expect(errores({ minutos: "-5" })).toEqual(mensaje);
    expect(errores({ horas: "dos" })).toEqual(mensaje);
  });
});

describe("formatearDuracion", () => {
  it("muestra solo las unidades necesarias", () => {
    expect(formatearDuracion(90)).toBe("1 h 30 min");
    expect(formatearDuracion(120)).toBe("2 h");
    expect(formatearDuracion(45)).toBe("45 min");
  });
});

describe("formatearFecha", () => {
  it("muestra la fecha como día, mes y año", () => {
    expect(formatearFecha("2026-11-02")).toBe("02/11/2026");
  });
});

describe("fechaDeHoy", () => {
  it("usa la fecha local, también a última hora del día", () => {
    expect(fechaDeHoy(new Date(2026, 10, 9, 23, 59))).toBe("2026-11-09");
    expect(fechaDeHoy(new Date(2026, 0, 5, 0, 1))).toBe("2026-01-05");
  });
});

"use client";

import { useState, type FormEvent } from "react";
import {
  fechaDeHoy,
  formatearDuracion,
  formatearFecha,
  validarSesion,
  type Sesion,
} from "../lib/sesiones";

export default function RegistroSesiones() {
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [errores, setErrores] = useState<string[]>([]);

  function apuntarSesion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const resultado = validarSesion(
      {
        asignatura: String(datos.get("asignatura")),
        fecha: String(datos.get("fecha")),
        horas: String(datos.get("horas")),
        minutos: String(datos.get("minutos")),
      },
      fechaDeHoy(new Date()),
    );

    if (!resultado.ok) {
      setErrores(resultado.errores);
      return;
    }
    setErrores([]);
    setSesiones((actuales) => [...actuales, resultado.sesion]);
    formulario.reset();
  }

  return (
    <>
      <form onSubmit={apuntarSesion} noValidate>
        <p>
          <label>
            Asignatura <input name="asignatura" type="text" />
          </label>
        </p>
        <p>
          <label>
            Fecha <input name="fecha" type="date" />
          </label>
        </p>
        <p>
          <label>
            Horas <input name="horas" type="number" min="0" max="24" />
          </label>{" "}
          <label>
            Minutos <input name="minutos" type="number" min="0" max="59" />
          </label>
        </p>
        <button type="submit">Apuntar sesión</button>
      </form>

      {errores.length > 0 && (
        <ul role="alert" aria-label="Errores del formulario">
          {errores.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <h2>Sesiones</h2>
      {sesiones.length === 0 ? (
        <p>Todavía no has apuntado ninguna sesión.</p>
      ) : (
        <ul aria-label="Sesiones apuntadas">
          {sesiones.map((sesion, indice) => (
            <li key={indice}>
              {formatearFecha(sesion.fecha)} · {sesion.asignatura} ·{" "}
              {formatearDuracion(sesion.minutos)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

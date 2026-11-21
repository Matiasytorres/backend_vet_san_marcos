import { useEffect, useState } from "react";
import PlantillaAdmin from "../components/templates/PlantillaAdmin";
import FormularioServicio from "../components/organisms/FormularioServicio";
import Boton from "../components/atoms/Boton";
import Cargando from "../components/atoms/Cargando";
import Alerta from "../components/atoms/Alerta";
import { listarServicios, crearServicio, actualizarServicio, eliminarServicio } from "../services/servicioService";
import { obtenerMensajeError } from "../services/errores";
import { formatearPrecio } from "../utils/formato";

export default function AdminServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [exito, setExito] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      const datos = await listarServicios();
      setServicios(datos);
    } catch (e) {
      setError(obtenerMensajeError(e));
    } finally {
      setCargando(false);
    }
  }

  async function guardar(datos) {
    setExito(""); setError("");
    try {
      if (editando) {
        const actualizado = await actualizarServicio(editando.id, datos);
        setServicios((prev) => prev.map((s) => s.id === actualizado.id ? actualizado : s));
        setExito("Servicio actualizado correctamente.");
        setEditando(null);
      } else {
        const nuevo = await crearServicio(datos);
        setServicios((prev) => [...prev, nuevo]);
        setExito("Servicio creado correctamente.");
      }
    } catch (e) {
      setError(obtenerMensajeError(e));
    }
  }

  async function eliminar(id) {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    setExito(""); setError("");
    try {
      await eliminarServicio(id);
      setServicios((prev) => prev.filter((s) => s.id !== id));
      setExito("Servicio eliminado.");
      if (editando?.id === id) setEditando(null);
    } catch (e) {
      setError(obtenerMensajeError(e));
    }
  }

  return (
    <PlantillaAdmin titulo="Administrar servicios">
      {exito && <Alerta variante="success" texto={exito} />}
      {error && <Alerta texto={error} />}

      <FormularioServicio
        key={editando?.id ?? "nuevo"}
        servicio={editando}
        onGuardar={guardar}
        onCancelar={() => setEditando(null)}
      />

      {cargando ? (
        <Cargando texto="Cargando servicios..." />
      ) : servicios.length === 0 ? (
        <p className="text-secondary text-center">No hay servicios. Agrega el primero.</p>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Especie</th>
                  <th>Precio</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((s) => (
                  <tr key={s.id}>
                    <td className="font-monospace">{s.codigo}</td>
                    <td className="fw-semibold">{s.nombre}</td>
                    <td>{s.categoria}</td>
                    <td>{s.especie}</td>
                    <td>${formatearPrecio(s.precio)}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <Boton texto="Editar" variante="outline-primary" className="btn-sm" onClick={() => setEditando(s)} />
                        <Boton texto="Eliminar" variante="outline-danger" className="btn-sm" onClick={() => eliminar(s.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PlantillaAdmin>
  );
}
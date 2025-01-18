import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig'; // Asegúrate de tener tu configuración de Firebase
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import NavbarAdmin from '../../../components/Admin/NavbarAdmin/NavbarAdmin';
import Footer from '../../../components/Footer';
import './GestionFormulario.style.css';

const GestionFormulario = () => {
  const [donaciones, setDonaciones] = useState([]);
  const [donacionSeleccionada, setDonacionSeleccionada] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener donaciones desde Firebase
        const querySnapshot = await getDocs(collection(db, 'donaciones'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDonaciones(data);
      } catch (error) {
        console.error("Error al obtener las donaciones:", error);
      }
    };
    fetchData();
  }, []);

  // Función para seleccionar la donación y mostrar la vista previa
  const handleSeleccionarDonacion = (donacion) => {
    setDonacionSeleccionada(donacion);
    setShowPreview(true);
  };

  // Función para eliminar una donación
  const handleEliminarDonacion = async (id) => {
    try {
      await deleteDoc(doc(db, 'donaciones', id));
      setDonaciones(donaciones.filter(donacion => donacion.id !== id));
    } catch (error) {
      console.error("Error al eliminar la donación:", error);
    }
  };

  // Función para generar el PDF
  const generarPDF = () => {
    const doc = new jsPDF();

    // Agregar título y logo (si lo necesitas)
    doc.text(`Formulario de Donación: ${donacionSeleccionada.nombre}`, 20, 20);
    //doc.text(`Email: ${formularioSeleccionado.email}`, 20, 30);

    // Crear la tabla con los datos
    const tablaData = [
      ['Campo', 'Valor'],
      ['Edad', donacionSeleccionada.edad],
      ['Tipo de Sangre', donacionSeleccionada.tipoSangre],
      ['Embarazo', donacionSeleccionada.embarazo],
      ['Enfermedad Grave', donacionSeleccionada.enfermedadGrave],
      ['Enfermedades en la Sangre', donacionSeleccionada.enfermedadesSangre],
      ['Infección en la Boca', donacionSeleccionada.infeccionBoca],
      ['Infección en los Oídos', donacionSeleccionada.infeccionOidos],
      ['Infección en los Ojos', donacionSeleccionada.infeccionOjos],
      ['Infección en la Piel', donacionSeleccionada.infeccionPiel],
      ['Infección en los Pulmones', donacionSeleccionada.infeccionPulmones],
      ['Medicamentos', donacionSeleccionada.medicamentos],
      ['Nueva Pareja', donacionSeleccionada.nuevaPareja],
      ['Problemas de Salud', donacionSeleccionada.problemasSalud],
      ['Tatuajes', donacionSeleccionada.tatuajes],
      ['Transfusión', donacionSeleccionada.transfusion],
      ['Viajes', donacionSeleccionada.viajes],
      ['Consumo de Drogas', donacionSeleccionada.drogas],
    ];

    doc.autoTable({
      startY: 40,
      head: tablaData.slice(0, 1),
      body: tablaData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [180, 11, 11] },  // Color rojo
      columnStyles: { 0: { halign: 'left' }, 1: { halign: 'left' } },
    });

    doc.save(`${donacionSeleccionada.nombre}_formulario.pdf`);
  };

  return (
    <div>
      <NavbarAdmin />
      <main className="main">
        <div className="gestion-formulario-container">
          <h1>Gestión de Donaciones</h1>

          {/* Vista Previa */}
          {showPreview && donacionSeleccionada && (
            <div className="vista-previa">
              <h3>Vista Formulario de Donante {donacionSeleccionada.nombre}</h3>

              {/* Mostrar los datos del formulario completo en una tabla */}
              <table className="vista-previa-table">
                <thead>
                  <tr>
                    <th>Preguntas</th>
                    <th>respuestas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Edad</td><td>{donacionSeleccionada.edad}</td></tr>
                  <tr><td>Tipo de Sangre</td><td>{donacionSeleccionada.tipoSangre}</td></tr>
                  <tr><td>Embarazo</td><td>{donacionSeleccionada.embarazo}</td></tr>
                  <tr><td>Enfermedad Grave</td><td>{donacionSeleccionada.enfermedadGrave}</td></tr>
                  <tr><td>Enfermedades en la Sangre</td><td>{donacionSeleccionada.enfermedadesSangre}</td></tr>
                  <tr><td>Infección en la Boca</td><td>{donacionSeleccionada.infeccionBoca}</td></tr>
                  <tr><td>Infección en los Oídos</td><td>{donacionSeleccionada.infeccionOidos}</td></tr>
                  <tr><td>Infección en los Ojos</td><td>{donacionSeleccionada.infeccionOjos}</td></tr>
                  <tr><td>Infección en la Piel</td><td>{donacionSeleccionada.infeccionPiel}</td></tr>
                  <tr><td>Infección en los Pulmones</td><td>{donacionSeleccionada.infeccionPulmones}</td></tr>
                  <tr><td>Medicamentos</td><td>{donacionSeleccionada.medicamentos}</td></tr>
                  <tr><td>Nueva Pareja</td><td>{donacionSeleccionada.nuevaPareja}</td></tr>
                  <tr><td>Problemas de Salud</td><td>{donacionSeleccionada.problemasSalud}</td></tr>
                  <tr><td>Tatuajes</td><td>{donacionSeleccionada.tatuajes}</td></tr>
                  <tr><td>Transfusión</td><td>{donacionSeleccionada.transfusion}</td></tr>
                  <tr><td>Viajes</td><td>{donacionSeleccionada.viajes}</td></tr>
                  <tr><td>Consumo de Drogas</td><td>{donacionSeleccionada.drogas}</td></tr>
                </tbody>
              </table>

              <button onClick={() => setShowPreview(false)}>Cerrar Vista Previa</button>
            </div>
          )}

          {/* Lista de Donaciones */}
          <table className="donaciones-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Edad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {donaciones.map((donacion) => (
                <tr key={donacion.id}>
                  <td>{donacion.nombre}</td>
                  <td>{donacion.email}</td>
                  <td>{donacion.edad}</td>
                  <td>
                    <button onClick={() => handleSeleccionarDonacion(donacion)}>Vista Previa</button>
                    <button onClick={() => generarPDF(donacion)}>Generar PDF</button> {/* Botón PDF en Acciones */}
                    <button onClick={() => handleEliminarDonacion(donacion.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GestionFormulario;

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

    // Agregar el logo (reemplaza 'logoBase64' con tu imagen en formato base64 o ruta local)
    const logoBase64 = 'data:image/jpeg;base64,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'; // Reemplaza con tu imagen codificada en base64
    doc.addImage(logoBase64, 'PNG', 10, 10, 30, 30); // (imagen, formato, x, y, ancho, alto)

    // Agregar título
    doc.text(`                     Formulario de Donación: ${donacionSeleccionada.nombre}`, 20, 30);

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
      startY: 50, // Ajustar para que no se superponga con el logo
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

              <button className='vista-prev' onClick={generarPDF}>Generar PDF</button>
              <button className='vista-prev' onClick={() => setShowPreview(false)}>Cerrar Vista Previa</button>
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

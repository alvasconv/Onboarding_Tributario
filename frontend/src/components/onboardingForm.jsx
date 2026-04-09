import { useState } from 'react';
import { onboardingService } from '../services/api';
import './onboardingForm.css';


function OnboardingForm() {
  // Estados para capturar la información del formulario
  const [ruc, setRuc] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: 'Procesando...', tipo: 'info' });

    // Estructura del FormData
    const formData = new FormData();
    formData.append('ruc', ruc);
    formData.append('razon_social', razonSocial);
    formData.append('documento_pdf', archivo);

    try {
      const data = await onboardingService.enviarCliente(formData);
      setMensaje({ texto: `Éxito: ${data.mensaje}`, tipo: 'exito' });

      // Limpieza del formulario
      setRuc('');
      setRazonSocial('');
      setArchivo(null);
      e.target.reset();

    } catch (error) {
      setMensaje({ texto: `Error: ${error.message}`, tipo: 'error' });
    }
  };

  return (
    <div className="onboarding-card">
      <h2 className="onboarding-title">Onboarding Tributario</h2>
      <p className="onboarding-subtitle">Ingrese los datos del nuevo cliente tributario.</p>

      <form onSubmit={handleSubmit} className="onboarding-form">

        <div className="form-group">
          <label>RUC del Cliente</label>
          <input
            type="text"
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
            placeholder="Ej: 0922217161001"
            required
          />
        </div>

        <div className="form-group">
          <label>Razón Social</label>
          <input
            type="text"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            placeholder="Nombre de la empresa"
            required
          />
        </div>

        <div className="form-group">
          <label>Balance Tributario (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setArchivo(e.target.files[0])}
            required
            className="file-input"
          />
        </div>

        <button type="submit" className="btn-submit">
          Validar e Ingresar Cliente
        </button>
      </form>

      {mensaje.texto && (
        <div className={`mensaje-alerta ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}


export default OnboardingForm;
import axios from 'axios';

// Instancia preconfigurada de Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const onboardingService = {
  // Función para enviar el formulario
  enviarCliente: async (formData) => {
    try {
      const respuesta = await apiClient.post('/onboarding', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return respuesta.data;
    } catch (error) {
      const mensajeError = error.response?.data?.error;
      throw new Error(mensajeError);
    }
  }
};
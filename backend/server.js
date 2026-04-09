const express = require('express');
const cors = require('cors');
const { validarDatos, validarArchivoPDF } = require('./middleware');
const multer = require('multer'); // librería para manejar el PDF
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs'); // Librería nativa de Node para leer archivos del disco

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE MULTER (Manejo de Archivos)
const upload = multer({ dest: 'uploads/' });

app.post('/api/onboarding', upload.single('documento_pdf'), validarDatos, validarArchivoPDF, async (req, res) => {
    
    const datosCliente = req.body;
    const archivo = req.file; // Multer nos deja toda la info del archivo aquí

    console.log("=======================================");
    console.log(`✅ NUEVO CLIENTE VALIDADO Y ACEPTADO`);
    console.log(`🏢 Empresa: ${datosCliente.razon_social} (RUC: ${datosCliente.ruc})`);
    console.log("=======================================");

    try {
        console.log("Enviando datos a n8n...");
        const form = new FormData();
        
        // 1. Enviamos los datos de texto (que n8n leerá en $json.body)
        form.append('ruc', datosCliente.ruc);
        form.append('razon_social', datosCliente.razon_social);
        
        // 2. Enviamos el PDF. ¡OJO! El nombre 'data' coincide exactamente con tu Nodo 2
        form.append('data', fs.createReadStream(archivo.path));

        // 3. Disparamos el Webhook
        const URL_WEBHOOK_N8N = process.env.URL_N8N_WEBHOOK;
        
        await axios.post(URL_WEBHOOK_N8N, form, {
            headers: form.getHeaders() // Headers obligatorios para enviar archivos
        });

        console.log("🚀 ¡Webhook disparado con éxito!");

        // 4. Borramos el archivo temporal de nuestro servidor para ahorrar espacio
        fs.unlinkSync(archivo.path);

    } catch (error) {
        console.error("❌ Error al contactar con n8n:", error.message);
        return res.status(500).json({ error: "Fallo la automatización interna" });
    }


    res.status(200).json({
        mensaje: "Cliente procesado con éxito",
        datos: datosCliente,
        archivo_recibido: true
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corporativo escuchando en http://localhost:${PORT}`);
});
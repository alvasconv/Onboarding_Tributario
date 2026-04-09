const express = require('express');
const cors = require('cors');
const { validarDatos, validarArchivoPDF } = require('./middleware');
const multer = require('multer'); // La nueva librería para manejar el PDF

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURACIÓN DE MULTER (Manejo de Archivos)
// Le decimos que guarde los PDFs entrantes en una carpeta llamada 'uploads'
// ==========================================
const upload = multer({ dest: 'uploads/' });


// ==========================================
// 4. LA RUTA PRINCIPAL (La cadena de montaje)
// OJO AL ORDEN: 
// 1ro Multer agarra el archivo ('documento_pdf') -> 2do Zod valida todo -> 3ro Ejecutamos
// ==========================================
app.post('/api/onboarding', upload.single('documento_pdf'), validarDatos, validarArchivoPDF, (req, res) => {
    
    const datosCliente = req.body;
    const archivo = req.file; // Multer nos deja toda la info del archivo aquí

    console.log("=======================================");
    console.log(`✅ NUEVO CLIENTE VALIDADO Y ACEPTADO`);
    console.log(`🏢 Empresa: ${datosCliente.razon_social} (RUC: ${datosCliente.ruc})`);
    console.log(`📄 PDF guardado temporalmente en: ${archivo.path}`);
    console.log("=======================================");

    // Aquí (en el futuro) conectaremos el código que le envía esto a n8n

    res.status(200).json({
        mensaje: "Cliente procesado con éxito",
        datos: datosCliente,
        archivo_recibido: true
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corporativo escuchando en http://localhost:${PORT}`);
});
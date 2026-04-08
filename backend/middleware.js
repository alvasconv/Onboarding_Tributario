const { z } = require('zod');

// Esquema de seguridad (ZOD)
const clienteSchema = z.object({
    ruc: z.string().length(13, "El RUC debe tener exactamente 13 dígitos numéricos"),
    razon_social: z.string().min(3, "La Razón Social no puede estar vacía")
});


// Validación del RUC y nombre de la Razón Social
const validarDatos = (req, res, next) => {
    const validacion = clienteSchema.safeParse(req.body);

    if (!validacion.success) {
        console.log("Datos de texto(RUC - Razón Social) inválidos.");
        return res.status(400).json({
            error: "Datos incorrectos",
            detalles: validacion.error.errors
        });
    }
    req.body = validacion.data;
    next();
};


// Validar que se haya subido un archivo y que sea de tipo PDF
const validarArchivoPDF = (req, res, next) => {
    if (!req.file) {
        console.log("Faltó subir el archivo.");
        return res.status(400).json({ error: "Debes adjuntar un documento PDF" });
    }
    if (req.file.mimetype !== 'application/pdf') {
        console.log("En archivo no es de tipo PDF");
        return res.status(400).json({ error: "El documento debe ser estrictamente un PDF" });
    }
    next();
};


module.exports = {
    validarDatos,
    validarArchivoPDF
}
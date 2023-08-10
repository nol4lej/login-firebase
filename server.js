const express = require('express')
const path = require('path')

const app = express()
const srcPath = path.join(__dirname, '/dist')

// Configuración estática para servir archivos generados por Webpack
app.use(express.static(srcPath, { type: 'application/javascript' }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})
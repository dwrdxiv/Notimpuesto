require('dotenv').config();
const express = require('express');
const bot = require('./bot.js');
const app = express();
const PORT = process.env.PORT
const db = require('./db.js')


//Servir carpetas public
app.use(express.static('public'));

async function startApp() {
    console.log('Iniciando aplicación...');
    try {
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });

        await bot.launch();
        console.log('Bot iniciado');
    }
        catch (error) {
            console.error('Error al iniciar el bot:', error);
        }
};

startApp(); 
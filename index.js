const express = require('express');
const app = express();
const cors = require('cors');

// En este precioso puerto levantamos el servidor

const PORT = 5000;

// Router bonito precioso

const router = require('./router');

// ESTO ES EL CORS Y SU CONFIGURACIÓN

let corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

//Middleware

app.use(express.json()); //PUEDO OBTENER JSON DEL BODY
app.use(cors(corsOptions));  //USO CORS

app.use(router);
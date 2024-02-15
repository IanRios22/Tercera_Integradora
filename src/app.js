import express from "express"
import { __src } from "./utils/utils.js";
import handlebars from "express-handlebars";
import appRouter from "./routes/app.router.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import setupSocket from "./chat/socket.js";
import cors from 'cors'
import compression from "express-compression";


//EXPRESS - Definimos el servidor y su config
const PORT = 8080
const app = express()
app.use(cors())
const httpserver = app.listen(PORT, () => console.log("Server up."))

//JSON REQUEST - Agregamos el middleware de parseo de las request
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Conectar a la base de datos
const connectionString = "mongodb://127.0.0.1:27017/dbprueba";

mongoose.connect(connectionString)
    .then(() => {
        console.log("Conectado a la base de datos");
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos: " + error);
        process.exit(1);
    });

const mongoStoreOptions = {
    store: MongoStore.create({
        mongoUrl: connectionString,
        ttl: 120,
        crypto: {
            secret: '1234'
        }
    }),
    secret: '1234',
    resave: false,
    saveUninitialized: false
};

//ROUTER con Brotli- Manejador de rutas de toda el servidor
app.use(compression({ brotli: { enabled: true, zlib: {} } })); //Config de uso global para brotli
app.use("/", appRouter)

//HANDLEBARS - Indicamos el uso de handlebars
app.engine('handlebars', handlebars.engine()) //habilitamos el uso del motor de plantillas en el servidor.
app.set('views', __src + '/views') //declaramos la carpeta con las vistas para las plantillas.
app.set('view engine', 'handlebars') //le decimos a express que use el motor de vistas de handlebars.
app.use(express.static(__src + '/public')) //estaba en socket
initPassport()
app.use(passport.initialize())
app.use(passport.session())
setupSocket(httpserver)

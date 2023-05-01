const express = require('express');
const mysql =  require('mysql');
const app = express();
const port = 3000;

// servidor del website
app.use(express.static('public'));


// Conexion a base de datos 'automarket'
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'automarket'
});
// Error handling
connection.connect((error) => {
    if (error) {
        console.error('Error al conectar con la base de datos: ', + error.stack);
        return;
    }
    console.log('Conexión exitosa con la base de datos');
});


// Read json:
app.use(express.json());


// INICIO APIS:
// ============ REGISTER ============
//
// CLIENTE:
app.post('/register.cliente', (req, res) => {
    console.log("hola");

    const { Username, Email, Password, DNI, Nombre, Apellido } = req.body;
    const usuario_insert_query = 'INSERT INTO Usuario(Username, Email, Password) VALUES (?, ?, ?)';
    const cliente_insert_query = 'INSERT INTO Cliente(Username, DNI, Nombre, Apellido) VALUES (?, ?, ?, ?)';

    console.log(Username, Email, Password, DNI, Nombre, Apellido);

    // ejecutar query
    connection.query(usuario_insert_query, [Username, Email, Password], (error, results) => {
        if (error) {
            console.error('Error al insertar usuario: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
        }
        res.status(200).send('Usuario registrado correctamente');

        connection.query(cliente_insert_query, [Username, DNI, Nombre, Apellido], (error, results) => {
            if (error) {
                console.error('Error al insertar cliente: ', error);
                res.status(500).send('Error al obtener los datos de la base de datos');
            }
            res.status(200).send('Cliente registrado correctamente');
        });
    });
});

// 
// PROVEEDOR:
app.post('/register.proveedor', (req, res) => {
    const { Username, Email, Password, Empresa, RUC } = req.body;
    const usuario_insert_query = 'INSERT INTO Usuario(Username, Email, Password) VALUES (?, ?, ?)';
    const proveedor_insert_query = 'INSERT INTO Proveedor(Username, Empresa, RUC) VALUES (?, ?, ?)';

    console.log(Username, Email, Password, Empresa, RUC)

    // ejecutar query
    connection.query(usuario_insert_query, [Username, Email, Password], (error, results) => {
        if (error) {
            console.error('Error al insertar usuario: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
        }
        res.status(200).send('Usuario registrado correctamente');

        connection.query(proveedor_insert_query, [Username, Empresa, RUC], (error, results) => {
            if (error) {
                console.error('Error al insertar proveedor: ', error);
                res.status(500).send('Error al obtener los datos de la base de datos');
            }
            res.status(200).send('Proveedor registrado correctamente');
        });
    });
});



// ============ LOGIN ============

// Ruta para comparar usario con login
app.get('/login', (req, res) => {

    const query = 'SELECT * FROM Usuario';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;

        }

        res.json(results);
        console.log('Consulta realizada con exito');
    });
});


app.listen(port, () => {
    console.log('Servidor iniciado en el puerto ', + port);
});

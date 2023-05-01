const express = require('express');
const mysql =  require('mysql');
const app = express();
const port = 3000;

// directorio del website
app.use(express.static('public'));

// extension para leer json
app.use(express.json());


// Conexion a base de datos 'automarket'
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'automarket'
});
// Error de conexion con la base de datos
connection.connect((error) => {
    if (error) {
        console.error('Error al conectar con la base de datos: ', + error.stack);
        return;
    }
    console.log('Conexión exitosa con la base de datos');
});


// INICIO APIS:
// ============ REGISTER ============
//
// CLIENTE:
app.post('/register.cliente', (req, res) => {
    console.log("\n>> Intentando registrar cliente");

    // datos
    const { Username, Email, Password, DNI, Nombre, Apellido } = req.body;
    console.log(">> Datos: ",  Username, Email, Password, DNI, Nombre, Apellido);

    // check si el usuario ya existe
    const check_query = 'SELECT * FROM Usuario WHERE Username = ?';
    connection.query(check_query, [Username], (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        if (results.length > 0) {
            console.log(">> Usuario ya existe!: '", Username, "'\n");
            res.status(200).send('Usuario ya existe');
            return;
        }
    });

    // query
    const usuario_insert_query = 'INSERT INTO Usuario(Username, Email, Password) VALUES (?, ?, ?)';
    const cliente_insert_query = 'INSERT INTO Cliente(Username, DNI, Nombre, Apellido) VALUES (?, ?, ?, ?)';

    // ejecutar query
    connection.query(usuario_insert_query, [Username, Email, Password], (error, results) => {
        if (error) {
            console.error('Error al insertar usuario: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        connection.query(cliente_insert_query, [Username, DNI, Nombre, Apellido], (error, results) => {
            if (error) {
                console.error('Error al insertar cliente: ', error);
                res.status(500).send('Error al obtener los datos de la base de datos');
                return;
            }
            console.log(">> Cliente registrado correctamente\n");
            res.status(200).send('Cliente registrado correctamente');
            return;
        });
    });
});
//
//
// PROVEEDOR:
app.post('/register.proveedor', (req, res) => {
    console.log("\n>> Intentando registrar proveedor");

    // datos
    const { Username, Email, Password, Empresa, RUC } = req.body;
    console.log(">> Datos: ", Username, Email, Password, Empresa, RUC)

    // check si el usuario ya existe
    const check_query = 'SELECT * FROM Usuario WHERE Username = ?';
    connection.query(check_query, [Username], (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        if (results.length > 0) {
            console.log(">> Usuario ya existe!: '", Username, "'\n");
            res.status(200).send('Usuario ya existe');
            return;
        }
    });

    // query
    const usuario_insert_query = 'INSERT INTO Usuario(Username, Email, Password) VALUES (?, ?, ?)';
    const proveedor_insert_query = 'INSERT INTO Proveedor(Username, Empresa, RUC) VALUES (?, ?, ?)';

    // ejecutar query
    connection.query(usuario_insert_query, [Username, Email, Password], (error, results) => {
        if (error) {
            console.error('Error al insertar usuario: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        connection.query(proveedor_insert_query, [Username, Empresa, RUC], (error, results) => {
            if (error) {
                console.error('Error al insertar proveedor: ', error);
                res.status(500).send('Error al obtener los datos de la base de datos');
                return;
            }
            console.log(">> Proveedor registrado correctamente\n");
            res.status(200).send('Proveedor registrado correctamente');
            return;
        });
    });
});



// ============ LOGIN ============
//
// Ruta para comparar usario con login
app.post('/login', (req, res) => {
    console.log("\n>> Intentando logear usuario");

    const { Username, Password } = req.body;
    console.log(">> Usuario: ", Username);

    const query = 'SELECT * FROM Usuario WHERE Username = ? AND Password = ?';
    connection.query(query, [Username, Password], (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        console.log('Consulta realizada con exito');
        console.log(results);

        if (results.length == 0) {
            console.log(">> Usuario no encontrado\n");
            res.status(200).send('Usuario no encontrado');
            return;
        }
        console.log(">>", results.length, "coincidencia(s)");

        // check si es cliente o proveedor
        const cliente_query = 'SELECT * FROM Cliente WHERE Username = ?';
        connection.query(cliente_query, [Username], (error, results) => {
            if (error) {
                console.error('Error al realizar la consulta: ', error);
                res.status(500).send('Error al obtener los datos de la base de datos');
                return;
            }
            if (results.length > 0) {
                console.log(">> Usuario es cliente\n");
                res.status(200).send('Cliente');
                return;
            }
        });

        const proveedor_query = 'SELECT * FROM Proveedor WHERE Username = ?';
        connection.query(proveedor_query, [Username], (error, results) => {
            if (error) {
                console.error('Error al realizar la consulta: ', error);
                res.status(500).send('Error al obtener los datos de la base de datos');
                return;
            }
            if (results.length > 0) {
                console.log(">> Usuario es proveedor\n");
                res.status(200).send('Proveedor');
                return;
            }
        });
        console.log(">> Usuario no es cliente ni proveedor\n");
        res.status(200).send('Error');
        return;
    });
});


// servidor escuchando en el puerto 3000 por defecto
app.listen(port, () => {
    console.log('Servidor iniciado en el puerto ', + port);
});

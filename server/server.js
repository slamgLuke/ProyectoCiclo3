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
        console.error('Error al conectar con la base de datos:', error.stack);
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
        else {
            // Camino correcto para registrar cliente
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
                    else {
                        console.log(">> Cliente registrado correctamente\n");
                        res.status(200).send('Cliente registrado correctamente');
                        return;
                    }
                });
            });
        }
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
        else {
            // Camino correcto para registrar proveedor
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
                    else {
                        console.log(">> Proveedor registrado correctamente\n");
                        res.status(200).send('Proveedor registrado correctamente');
                        return;
                    }
                });
            });
        }
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
        else {
            // Camino correcto para logear usuario
            console.log(">>", results.length, "coincidencia(s)");
    
            // check si es cliente
            const cliente_query = 'SELECT * FROM Cliente WHERE Username = ?';
            connection.query(cliente_query, [Username], (error, results) => {
                if (error) {
                    console.error('Error al realizar la consulta: ', error);
                    res.status(500).send('Error al obtener los datos de la base de datos');
                    return;
                }
                // si es cliente
                if (results.length > 0) {
                    console.log(">> Usuario es cliente\n");
                    res.status(200).send('Cliente');
                    return;
                }
                // si no es cliente
                else {
                    // check si es proveedor
                    const proveedor_query = 'SELECT * FROM Proveedor WHERE Username = ?';
                    connection.query(proveedor_query, [Username], (error, results) => {
                        if (error) {
                            console.error('Error al realizar la consulta: ', error);
                            res.status(500).send('Error al obtener los datos de la base de datos');
                            return;
                        }
                        // si es proveedor
                        if (results.length > 0) {
                            console.log(">> Usuario es proveedor\n");
                            res.status(200).send('Proveedor');
                            return;
                        }
                    });

                }
            });        
        }
    });

});




// ============ VEHICULO ============
//
// Ruta para obtener autos
app.get('/get.auto', (req, res) => {
    console.log("\n>> Intentando obtener autos");

    const query = 'SELECT * FROM Vehiculo WHERE Tipo = "Auto"';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        console.log('Consulta realizada con exito');
        console.log(results);
        
        // HTML para mostrar autos
        let html = `
            <html>
                <head>
                    <title>Lista de Autos 🚗</title>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                </head>
                <body>
                    <div class="container">
                        <h1>Car List</h1>
                        <ul class="list-group">
        `;
        
        for (let car of results) {
            html += `
                <li class="list-group-item">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${car.Foto}" class="img-fluid rounded">
                        </div>
                        <div class="col-md-8">
                            <h4>${car.Marca} ${car.Modelo} (${car.Año})</h4>
                            <p><strong>VIN:</strong> ${car.VIN}</p>
                            <p><strong>Motor:</strong> ${car.MotorMarca} ${car.MotorModelo}</p>
                            <p><strong>Transmisión:</strong> ${car.Transmision}</p>
                            <p><strong>Kilometraje:</strong> ${car.Kilometraje}</p>
                            <p><strong>Color:</strong> ${car.Color}</p>
                            <p><strong>Precio:</strong> $${car.Precio}</p>
                            <p><strong>Proveedor:</strong> ${car.ProveedorUsername}</p>
                        </div>
                    </div>
                </li>
            `;
        }
        
        html += `
                        </ul>
                    </div>
                </body>
            </html>
        `;
        
        // Response
        res.send(html);
    });

});
//
//
// Ruta para obtener motos
app.get('/get.moto', (req, res) => {
    console.log("\n>> Intentando obtener motos");

    const query = 'SELECT * FROM Vehiculo WHERE Tipo = "Moto"';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }

        console.log('Consulta realizada con exito');
        console.log(results);

        // HTML para motos
        let html = `
            <html>
                <head>
                    <title>Lista de motos 🏍️</title>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                </head>
                <body>
                    <div class="container">
                        <h1>Motorcycle List</h1>
        `;
        
        for (let moto of results) {
            html += `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${moto.Foto}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-8">
                        <h4>${moto.Marca} ${moto.Modelo} (${moto.Año})</h4>
                        <p><strong>VIN:</strong> ${moto.VIN}</p>
                        <p><strong>Motor:</strong> ${moto.MotorMarca} ${moto.MotorModelo}</p>
                        <p><strong>Transmisión:</strong> ${moto.Transmision}</p>
                        <p><strong>Kilometraje:</strong> ${moto.Kilometraje}</p>
                        <p><strong>Color:</strong> ${moto.Color}</p>
                        <p><strong>Precio:</strong> $${moto.Precio}</p>
                        <p><strong>Proveedor:</strong> ${moto.ProveedorUsername}</p>
                    </div>
                </div>
            `;
        }

        html += `
                    </div>
                </body>
            </html>
        `;
    });

});

//
//
// Ruta para obtener camiones
app.get('/get.camion', (req, res) => {
    console.log("\n>> Intentando obtener camiones");

    const query = 'SELECT * FROM Vehiculo WHERE Tipo = "Camion"';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        else { 
        
            console.log('Consulta realizada con exito');
            console.log(results);
    
            // HTML para camiones
            let html = `
                <html>
                    <head>
                        <title>Lista de camiones 🚚</title>
                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                    </head>
                    <body>
                        <div class="container">
                            <h1>Truck List</h1>
            `;

            for (let camion of results) {
                html += `
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${camion.Foto}" class="img-fluid rounded">
                        </div>
                        <div class="col-md-8">
                            <h4>${camion.Marca} ${camion.Modelo} (${camion.Año})</h4>
                            <p><strong>VIN:</strong> ${camion.VIN}</p>
                            <p><strong>Motor:</strong> ${camion.MotorMarca} ${camion.MotorModelo}</p>
                            <p><strong>Transmisión:</strong> ${camion.Transmision}</p>
                            <p><strong>Kilometraje:</strong> ${camion.Kilometraje}</p>
                            <p><strong>Color:</strong> ${camion.Color}</p>
                            <p><strong>Precio:</strong> $${camion.Precio}</p>
                            <p><strong>Proveedor:</strong> ${camion.ProveedorUsername}</p>
                        </div>
                    </div>
                `;
            }
 
            html += `
                        </div>
                    </body>
                </html>
            `;
        }
    });

});


// REGISTER VEHICULO
//
// Ruta para revisar un potencial nuevo vehiculo
app.post('/check.vehiculo', (req, res) => {
    console.log("\n>> Intentando registrar un nuevo vehiculo");

    const { VIN, MotorMarca, MotorModelo } = req.body;
    const check_query = 'SELECT * FROM Vehiculo WHERE VIN = ?';
    connection.query(check_query, [VIN], (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        else if (results.length > 0) {
            console.log('El vehiculo ya existe');
            res.status(200).send('El vehiculo ya existe');
            return;
        }
        else {
            // check si el motor ya existe
            const motor_check_query = 'SELECT * FROM Motor WHERE Marca = ? AND Modelo = ?';
            connection.query(motor_check_query, [MotorMarca, MotorModelo], (error, results) => {
                if (error) {
                    console.error('Error al realizar la consulta: ', error);
                    res.status(500).send('Error al obtener los datos de la base de datos');
                    return;
                }
                else if (results.length > 0) {
                    console.log('El motor ya existe');
                    res.status(200).send('Motor si existe');
                    return;
                }
                else {
                    console.log('Motor no existe, registrando nuevo motor');
                    res.status(200).send('Motor no existe');
                    return;
                }
            });

        }
    });

});
//
//
// Ruta para registrar un nuevo vehiculo sin motor
app.post('/registrar.vehiculo', (req, res) => {
    console.log("\n>> Intentando registrar un nuevo vehiculo (sin motor)");

    const { VIN, Marca, Modelo, Año, Tipo, MotorMarca, MotorModelo, Transmision, Kilometraje, Color, Precio, ProveedorUsername, Foto } = req.body;

    // registrar el vehiculo
    const vehiculo_query = 'INSERT INTO Vehiculo(VIN, Marca, Modelo, Año, Tipo, MotorMarca, MotorModelo, Transmision, Kilometraje, Color, Precio, ProveedorUsername, Foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(vehiculo_query, [VIN, Marca, Modelo, Año, Tipo, MotorMarca, MotorModelo, Transmision, Kilometraje, Color, Precio, ProveedorUsername, Foto], (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al registrar el vehiculo');
            return;
        }
        else {
            console.log('Vehiculo registrado con exito');
            res.status(200).send('Vehiculo registrado con exito');
            return;
        }
    });

});
//
//
// Ruta para registrar un nuevo vehiculo con motor
app.post('/registrar.vehiculo.motor', (req, res) => {
    console.log("\n>> Intentando registrar un nuevo vehiculo (con motor)");

    const { VIN, Marca, Modelo, Año, Tipo, MotorMarca, MotorModelo, Transmision, Kilometraje, Color, Precio, ProveedorUsername, Foto, Combustible, Cilindros, Cilindrada, Potencia } = req.body;

    // registrar el vehiculo
    const vehiculo_query = 'INSERT INTO Vehiculo(VIN, Marca, Modelo, Año, Tipo, MotorMarca, MotorModelo, Transmision, Kilometraje, Color, Precio, ProveedorUsername, Foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(vehiculo_query, [VIN, Marca, Modelo, Año, Tipo, MotorMarca, MotorModelo, Transmision, Kilometraje, Color, Precio, ProveedorUsername, Foto], (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al registrar el vehiculo');
            return;
        }
        else {
            console.log('Vehiculo registrado con exito');

            // registrar el motor
            const motor_query = 'INSERT INTO Motor(Marca, Modelo, Combustible, Cilindros, Cilindrada, Potencia) VALUES (?, ?, ?, ?, ?, ?)';
            connection.query(motor_query, [MotorMarca, MotorModelo, Combustible, Cilindros, Cilindrada, Potencia], (error, results) => {
                if (error) {
                    console.error('Error al realizar la consulta: ', error);
                    res.status(500).send('Error al registrar el motor');
                    return;
                }
                else {
                    console.log('Motor registrado con exito');
                    res.status(200).send('Vehiculo y motor registrados con exito');
                    return;
                }
            });
        }
    });

});


// ============ COMPRAS ============
//
// Ruta para obtener el historial de compras
app.get('/get.historial', (req, res) => {
    console.log("\n>> Intentando obtener historial de compras");

    const username = req.query.username;
    const query = 'SELECT * FROM Compra WHERE ClienteUsername = ?';
    connection.query(query, [username], (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        else {

            console.log('Consulta realizada con exito');
            console.log(results);
    
            // HTML para historial de compras
            let html = `
                <html>
                    <head>
                        <title>Historial de compras</title>
                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                    </head>
                    <body>
                        <div class="container">
                            <h1>Historial de compras</h1>
            `;
    
            for (let compra of results) {
                html += `
                    <div class="row">
                        <div class="col-md-8">
                            <h4>Codigo: ${compra.Codigo}</h4>
                            <p><strong>Fecha:</strong> ${compra.Fecha}</p>
                            <p><strong>VIN:</strong> ${compra.VehiculoVIN}</p>
                            <p><strong>Monto:</strong> $${compra.Monto}</p>
                        </div>
                    </div>
                `;
            }
    
            html += `
                        </div>
                    </body>
                </html>
            `;
    
            res.send(html);    
        }
    });

});
//
//
// Ruta para realizar una compra
app.post('/realizar.compra', (req, res) => {
    console.log("\n>> Intentando realizar una compra");

    const { VIN, ClienteUsername } = req.body;

    // generar un codigo de compra que sea 1 mayor al codigo de compra mas grande 
    let nuevo_codigo = 0;

    const codigo_query = 'SELECT MAX(Codigo) AS Codigo FROM Compra';
    connection.query(codigo_query, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        else if (results.length == 0) {
            nuevo_codigo = 1;
        }
        else {
            nuevo_codigo = results[0].Codigo + 1;
        }
    });

    // obtener fecha actual formato YYYY-MM-DD
    let fecha = new Date().toISOString().slice(0, 10);

    // obtener el precio del vehiculo
    let precio = 0;

    const precio_compra_query = 'SELECT Precio FROM Vehiculo WHERE VIN = ?';
    connection.query(precio_compra_query, [VIN], (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta: ', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
            return;
        }
        else if (results.length == 0) {
            console.log('No existe un vehiculo con ese VIN');
            res.status(200).send('VIN invalido');
            return;
        }
        else {
            precio = results[0].Precio;

            // registrar la compra
            const compra_query = 'INSERT INTO Compra(Codigo, ClienteUsername, VehiculoVIN, Fecha, Monto) VALUES (?, ?, ?, ?, ?)';
            connection.query(compra_query, [nuevo_codigo, ClienteUsername, VIN, fecha, precio], (error, results) => {
                if (error) {
                    console.error('Error al realizar la consulta: ', error);
                    res.status(500).send('Error al registrar la compra');
                    return;
                }
                else {
                    // checkear el username del cliente
                    const cliente_query = 'SELECT * FROM Cliente WHERE Username = ?';
                    connection.query(cliente_query, [ClienteUsername], (error, results) => {
                        if (error) {
                            console.error('Error al realizar la consulta: ', error);
                            res.status(500).send('Error al obtener los datos de la base de datos');
                            return;
                        }
                        else if (results.length == 0) {
                            console.log('Usuario invalido');
                            res.status(200).send('Usuario invalido');
                            return;
                        }
                        else {
                            // borrar vehiculo de la tabla Vehiculo
                            const delete_query = 'DELETE FROM Vehiculo WHERE VIN = ?';
                            connection.query(delete_query, [VIN], (error, results) => {
                                if (error) {
                                    console.error('Error al realizar la consulta: ', error);
                                    res.status(500).send('Error al borrar el vehiculo');
                                    return;
                                }
                                else {
                                    console.log('Compra realizada con exito');
                                    res.status(200).send('Compra realizada con exito');
                                    return;
                                }
                            });
                        }
                    });

                }
            });
        }
    });

});



// servidor escuchando en el puerto 3000 por defecto
app.listen(port, () => {
    console.log('Servidor iniciado en el puerto', + port);
});

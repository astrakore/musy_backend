const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');

const UsuarioController = {};

// Aquí tenemos las funciones del controlador

UsuarioController.traeUsuarios = (req, res) => {
    
    Usuario.findAll()
    .then(data => {
        res.send(data)
    });

};

UsuarioController.registraUsuario = async (req, res) => {

    if (/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/.test(req.body.password) !== true) {
        return res.send("La contraseña debe tener al menos 8 caracteres y no más de 15 caracteres.")
    }
    
    //Registrando un usuario
    
        let nombre = req.body.nombre;
        let edad = req.body.edad;
        let correo = req.body.correo;
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));
        let origen = req.body.origen;
        let destino = req.body.destino;
        let nick = req.body.nick;
        let telefono = req.body.telefono;
        let usuarioTelegram = req.body.usuarioTelegram;

        //Comprobación de errores.....
        
        //Guardamos en sequelize el usuario

        Usuario.findAll({
            where : {

                [Op.or] : [
                    {
                        correo : {
                            [Op.like] : correo
                        }
                    },
                    {
                        nick : {
                            [Op.like] : nick
                        }
                    }
                ]

            }

        }).then(datosRepetidos => {

            if(datosRepetidos == 0){

                    Usuario.create({
                    nombre : nombre,
                    edad : edad,
                    correo : correo,
                    password : password,
                    origen : origen,
                    destino : destino,
                    nick : nick,
                    telefono : telefono,
                    usuarioTelegram : usuarioTelegram
                }).then(usuario => {
                    res.send(`${usuario.nick}, bienvenide a tu app de confianza para buscar panas`);
                })
                .catch((error) => {
                    res.send(error);
                });

            }else {
                res.send("El usuario con ese correo o nick ya existe en nuestra base de datos");
            }
        }).catch(error => {
            res.send(error)
        });
};

UsuarioController.deleteAll = async (req, res) => {

    try {

        Usuario.destroy({
            where : {},
            truncate : false
        })
        .then(usuariosEliminados => {
            res.send(`Se han eliminado ${usuariosEliminados} usuarios`);
        })

    } catch (error) {
        res.send(error);
    }

};

UsuarioController.logUsuario = (req, res) => {

    let correo = req.body.correo;
    let password = req.body.password;

    Usuario.findOne({
        where : {"correo" : correo}
    }).then(Usuario => {

        if(!Usuario){
            res.send("Usuario o contraseña inválido");
        }else {
            //el usuario existe, por lo tanto, vamos a comprobar si el password es correcto

            if (bcrypt.compareSync(password, Usuario.password)) { //COMPARA CONTRASEÑA INTRODUCIDA CON CONTRASEÑA GUARDADA, TRAS DESENCRIPTAR

                console.log(Usuario.password);

                let token = jwt.sign({ usuario: Usuario }, authConfig.secret, {
                    expiresIn: authConfig.expires
                });

                res.json({
                    usuario: Usuario,
                    token: token
                })
            } else {
                res.status(401).json({ msg: "Usuario o contraseña inválido"});
            }
        };

    }).catch(error => {
        if (error === {}) {
            res.send("No se ha encontrado el usuario");
        }else{
            res.send(error);
        }
    })
};
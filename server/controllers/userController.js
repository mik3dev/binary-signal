const User = require('./../models/User');
const _ = require('lodash');

userController = {
    register(req, res) {
        const token = req.get('X-Auth');
        User.findByToken(token)
            .then(user => {
                if(!user){
                    return Promise.reject();
                }
                if(user.isMaster === true){
                    const newUser = new User(_.pick(req.body, ['username', 'email', 'password']));
                    newUser.save()
                        .then(() => {
                            return newUser.generateToken();
                        }).then(token => {
                            res.header('X-Auth', token).json(newUser);
                        }).catch(e => {
                            res.status(400).send('Ups, no fue posible crear un nuevo usuario');
                        });
                } else {
                    res.status(401).send(`Usted no tiene la autorización para registrar un nuevo usuario`);
                }
            }).catch(err => {
                res.status(401).send(`Debe ingresar al sistema`);
            });
    },
    login(req, res) {
        const body = _.pick(req.body, ['email', 'password']);
        User.findByCredentials(body.email, body.password)
            .then(user => {
                return user.generateToken().then(token => {
                    res.header('X-Auth', token).send(user);
                })
            }).catch(e => {
                res.status(400).send(`El email o la clave de acceso no coinciden!`);
            })
    },
    findByToken(req, res) {
        const token = req.get('X-Auth');
        User.findByToken(token)
        .then(user => {
            if(!user){
                return Promise.reject();
            }

            const userFound = {
                user,
                token
            } 
            res.send(userFound);
        }).catch(err => {
            res.status(401).send(`Usuario no registrado.`);
        })
    }
}

module.exports = userController;
const express = require('express');
const crypto = require('crypto');
const connection = require('./../database/connection');

const FuncionarioController = require('./controllers/FuncionarioController');
const ObraController = require('./controllers/ObraController');
const ClienteController = require('./controllers/ClienteController');
const DiarioController = require('./controllers/DiarioController');
const MapaController = require('./controllers/MapaObrasController');
const AusenciaController = require('./controllers/AusenciaController');
const SessionController = require('./controllers/SessionController');
const KnexController = require('./controllers/KnexController');
const upload = require('./utils/multer')

const routes = express.Router();

routes.get('/', SessionController.wellcome)

routes.post('/login', SessionController.index)
routes.get('/logout', SessionController.logout)
routes.post('/checkToken', SessionController.checkToken)

routes.post('/funcionarios', upload.single('imagem'), FuncionarioController.create)
routes.get('/funcionarios', FuncionarioController.index)
routes.put('/funcionarios', upload.single('imagem'), FuncionarioController.alter)

routes.get('/obras/:id?', ObraController.index)
routes.post('/obras', ObraController.create)
routes.put('/obras', ObraController.alter)
routes.delete('/obras', ObraController.delete)

routes.get('/clientes', ClienteController.index)
routes.get('/nextContact', ClienteController.nextContact)
routes.post('/clientes', ClienteController.create)
routes.put('/clientes', ClienteController.alter)
routes.delete('/clientes', ClienteController.delete)

routes.get('/mapa', MapaController.index)
routes.get('/mapaToday', MapaController.today)
routes.post('/mapa', MapaController.create)
routes.put('/mapa', MapaController.alter)
routes.delete('/mapa/:id', MapaController.delete)

routes.get('/diario', DiarioController.index)
routes.post('/diario', DiarioController.create)
routes.put('/diario', DiarioController.alter)
routes.delete('/diario/:id', DiarioController.delete)

routes.get('/ausencias', AusenciaController.index)
routes.post('/ausencias', AusenciaController.create)
routes.put('/ausencias', AusenciaController.alter)
routes.delete('/ausencias', AusenciaController.delete)

routes.get('/knex', KnexController.knex)

module.exports = routes;
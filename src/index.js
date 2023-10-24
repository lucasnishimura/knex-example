const express = require('express');
const cors = require('cors');
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const routes = require('./routes');
const port = process.env.PORT || 3333;

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static('./uploads'));
app.listen(port);
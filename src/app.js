const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const deskRoutes = require('./routes/deskRoutes');
const deskService = require('./service/deskService');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

deskService.seedDesks(10);

app.use('/api', userRoutes);
app.use('/api', deskRoutes);

const swaggerFile = path.join(__dirname, '../resources/swagger.yaml');
const swaggerDocument = fs.existsSync(swaggerFile) ? require('yamljs').load(swaggerFile) : {};
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => res.send('Desk Booking API'));

module.exports = app;

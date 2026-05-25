const express = require('express');
const cors = require('cors');

const employeeRoutes = require('./routes/employeeRoutes');
const insightsRoutes = require('./routes/insightsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/employees', employeeRoutes);
app.use('/insights', insightsRoutes);

module.exports = app;
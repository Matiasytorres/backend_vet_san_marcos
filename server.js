require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('BD conectada');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend listo en puerto ${PORT}`);
    });
  })
  .catch(err => console.error('Error BD:', err));
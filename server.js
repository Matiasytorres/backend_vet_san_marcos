require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('BD conectada y sincronizada');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend listo en puerto ${PORT}`);
    });
  })
  .catch(err => console.error('Error BD:', err));
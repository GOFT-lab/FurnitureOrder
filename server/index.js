const debug = require('debug')('furnitureorder:server');
const app = require('./app');
const { PORT } = require('./config');

const StartServer = async () => {
  app
    .listen(PORT, () => {
      debug(`Server listening on port ${PORT}`);
    })
    .on('error', (err) => {
      debug(err);
      process.exit(1);
    });
};

StartServer();

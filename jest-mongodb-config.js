module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: process.env.MONGO_DB_NAME,
    },
    binary: {
      version: '4.0.2',
      skipMD5: true,
    },
    autoStart: false,
  },
};

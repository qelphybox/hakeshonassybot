module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: process.env.MONGO_DB_NAME,
    },
    binary: {
      version: '4.2.6',
      skipMD5: true,
    },
    autoStart: false,
  },
};

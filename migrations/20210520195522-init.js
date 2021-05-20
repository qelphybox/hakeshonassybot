const fs = require('fs');

let dbm;
let type;
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = (options, seedLink) => {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = (db, callback) => {
  const sql = fs.readFileSync(`${__dirname}/20210520195522-init.up.sql`, 'utf8');
  db.runSql(sql, null, callback);
};

exports.down = (db, callback) => {
  const sql = fs.readFileSync(`${__dirname}/20210520195522-init.undo.sql`, 'utf8');
  db.runSql(sql, null, callback);
};

exports._meta = {
  version: 1,
};

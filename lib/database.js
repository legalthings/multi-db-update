const monk = require('monk');

class Database {

  constructor(db) {
    this.db = monk(db);
  }

  listDatabases(dbName) {
    return this.db.executeWhenOpened().then(() => {
      const admin = this.db._db.admin();

      return new Promise((resolve, reject) => {
        // List all the available databases
        admin.listDatabases(function(err, dbs) {
          if (err) return reject(err);

          const result = [];
          for(const database of dbs.databases) {

            if(!dbName || database.name.indexOf(dbName) != -1) {
              result.push(database);
            }
          }

          return resolve(result);
        });
      });
    });
  }

  async executeWhenOpened() {
    return this.deferred.promse;
  }

  async updateDBS(db, collection, documents) {
    const dbs = await this.listDatabases(db);
    const results = [];
    for(const database of dbs) {
      this.db._db = this.db._db.db(database.name);
      const coll = await this.db.get(collection);

      const result = {
        db: database.name,
        coll: collection,
        inserted: 0,
        updated: 0,
        failed: 0
      };

      for (const document of documents) {
        try {
          const docResult = await coll.update({_id: document._id}, document, {upsert: true });
          if (docResult.upserted) {
            result.inserted += docResult.upserted.length;
          }
          result.updated += docResult.nModified;
        } catch (err) {
          console.log(err);
          result.failed++;
        }
      }

      results.push(result);
    }

    return results;
  }

  close() {
    this.db.close();
  }
}

module.exports = Database;
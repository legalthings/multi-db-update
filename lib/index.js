"use strict";
const argv = require('optimist')
  .alias('i', 'input')
  .alias('h', 'host')
  .alias('d', 'database')
  .alias('c', 'collection')
  .demand(['h', 'd', 'c', 'i'])
  .argv;

const DB = require('./database');
const fs = require('fs-extra');

const main = async () => {

  const db = new DB(argv.host);
  let documents = await fs.readJson(argv.input);

  if (!(documents instanceof Array)) {
    documents = [documents];
  }
  try {
    checkDocuments(documents);
    const result = await db.updateDBS(argv.database, argv.collection, documents);
    console.log(result);
    db.close();
  } catch (err) {
    console.log(err);
    db.close();
  }
};

function checkDocuments(documents) {
  for(const document of documents) {
    if (document.id) {
      document._id = document.id;
      delete document.id;
    }

    if (!document._id) {
      throw new Error("Documents need to contain and id");
    }
  }
}

main();
const db = require('./db').getDb();
const path = require('path');

const migrateProperImages = () => {
  const project24Images = db.prepare(`
  select * from Images where projectsId=24 and labeled=1 and labelData like '{"labels":{"afdmj2rxn":["PROPER"],"__temp":[]}%''
  `);
  console.log(project24Images);
  const project22Images = db.prepare(`
  select * from Images where projectsId=22 and labeled=1'
  `);
  console.log(project22Images);
  for (let i = 0; i < 10; i++) {
    console.log(project22Images[i]);
  }
};

migrateProperImages();

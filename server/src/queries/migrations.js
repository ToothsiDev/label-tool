const db = require('./db').getDb();
const path = require('path');

const migrateProperImages = () => {
  const project24Images = db
    .prepare(
      `
  select * from Images where projectsId=24 and labeled=1 and labelData like '{"labels":{"afdmj2rxn":["PROPER"],"__temp":[]}%''
  `
    )
    .all();
  console.log(project24Images[0]);
  const project22Images = db
    .prepare(
      `
  select * from Images where projectsId=22 and labeled=1'
  `
    )
    .all();
  console.log(project22Images[0]);
  for (let i = 0; i < 10; i++) {
    console.log(project22Images[i]);
  }
};

migrateProperImages();

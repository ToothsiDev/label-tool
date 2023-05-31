const db = require('./db').getDb();
const path = require('path');
const fs = require('fs/promises');

const migrateProperImages = () => {
  const project24Images = db
    .prepare(
      `
  select * from Images where projectsId=24 and labeled=1 and labelData like '{"labels":{"afdmj2rxn":["PROPER"],"__temp":[]}%'
  `
    )
    .all();
  console.log(project24Images[0]);
  const project22Images = db
    .prepare(
      `
  select * from Images where projectsId=22 and labeled=1
  `
    )
    .all();
  console.log(project24Images[0]);
  const properImageIds = [];
  const properImageObjs = {};
  for (let i = 0; i < project24Images.length; i++) {
    const cur = project24Images[i];
    const curOImageName = cur.originalName.replace('@&@mouth_256x256', '');
    const refImageObj = project22Images.find(
      cur => cur.originalName.indexOf(curOImageName) != -1
    );
    if (refImageObj) {
      const refImageLabel = JSON.parse(refImageObj.labelData);
      console.log(refImageLabel, refImageObj);
      if (refImageLabel['labels']['afdmj2rxn'][0] == 'PROPER') {
        properImageIds.push(refImageObj.id);
        properImageObjs[refImageObj.id] = {
          '22': {
            id: refImageObj.id,
            oName: refImageObj.originalName,
            labelData: JSON.parse(refImageObj.labelData),
          },
          '24': {
            id: cur.id,
            oName: cur.originalName,
          },
        };
      }
    }
  }
  console.log('properImageIds', properImageIds, properImageIds.length);
  fs.writeFile(
    './output_migrations_final.json',
    JSON.stringify(properImageObjs)
  );
};

migrateProperImages();

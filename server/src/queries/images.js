const db = require('./db').getDb();
const path = require('path');

const Images = {
  getForProject: projectId => {
    const images = db
      .prepare(
        `
select images.id, originalName, externalLink, link, labeled, labelData, projectsId, callbackUrl
from images
where images.projectsId = ?;
`
      )
      .all(projectId);
    return images.map(image => ({
      ...image,
      labelData: JSON.parse(image.labelData),
    }));
  },

  get: id => {
    const image = db
      .prepare(
        `
select *
from images
where images.id = ?;
`
      )
      .get(id);

    return { ...image, labelData: JSON.parse(image.labelData) };
  },

  addImageUrls: (projectId, urls) => {
    const getName = url =>
      path.basename(new URL(url, 'https://base.com').pathname);

    const stmt = db.prepare(`
insert into images(originalName, link, externalLink, labeled, labelData, projectsId)
values (?, 'stub', ?, 0, '{ }', ?);
`);

    for (const url of urls) {
      const name = getName(url);
      const { lastInsertRowid } = stmt.run(name, url, projectId);
      Images.updateLink(lastInsertRowid, { projectId, filename: name });
    }
  },

  addImageUrlFromS3: (projectId, urlsObj) => {
    const getName = url => new URL(url, 'https://base.com').pathname;
    // https://s3.ap-south-1.amazonaws.com/ml-smile-correction-data/before/3yyp1XGkk8pdaZ3uz8M4Ux.png
    // /ml-smile-correction-data/before/3yyp1XGkk8pdaZ3uz8M4Ux.png

    const stmt = db.prepare(`
      insert into images(originalName, link, externalLink, labeled, labelData, projectsId, callbackUrl, addInfo)
      values (?, 'stub', ?, 0, '{ }', ?, ?, ?);
      `);

    for (const curObj of urlsObj) {
      const { url, callbackUrl = null, addInfo = {} } = curObj;
      const name = getName(url);
      const { lastInsertRowid } = stmt.run(
        name,
        url,
        projectId,
        callbackUrl,
        JSON.stringify(addInfo)
      );
      Images.updateLink(lastInsertRowid, { projectId, filename: name });
    }
  },

  addImageStub: (projectId, filename, localPath) => {
    const stmt = db.prepare(`
insert into images(originalName, localPath, link, labeled, labelData, projectsId)
values (?, ?, 'stub', 0, '{ }', ?);
`);

    const { lastInsertRowid } = stmt.run(filename, localPath, projectId);
    return lastInsertRowid;
  },

  updateLink: (imageId, { projectId, filename }) => {
    const ext = path.extname(filename);
    const link = `/uploads/${projectId}/${imageId}${ext}`;
    db.prepare(
      `
update images
   set link = ?
 where id = ?;
`
    ).run(link, imageId);
    return `${imageId}${ext}`;
  },

  allocateUnlabeledImage: (projectId, imageId) => {
    // after this period of time we consider the image to be up for labeling again
    const lastEditedTimeout = 15 * 60 * 1000;

    let result = null;
    db.transaction(() => {
      if (!imageId) {
        const unmarkedImage = db
          .prepare(
            `
select id
from images
where projectsId = ? and labeled = 0 and lastEdited < ?;
`
          )
          .get(projectId, new Date() - lastEditedTimeout);

        imageId = unmarkedImage && unmarkedImage.id;
      }

      if (!imageId) {
        result = null;
      } else {
        db.prepare(`update images set lastEdited = ? where id = ?;`).run(
          +new Date(),
          imageId
        );
        result = { imageId };
      }
    })();

    return result;
  },

  updateLabel: (imageId, labelData) => {
    db.prepare(
      `
update images
set labelData = ?, lastEdited = ?
where id = ?;
`
    ).run(JSON.stringify(labelData), +new Date(), imageId);
  },

  updateLabeled: (imageId, labeled) => {
    db.prepare(
      `
update images
set labeled = ?
where id = ?;
`
    ).run(labeled ? 1 : 0, imageId);
  },

  delete: imageId => {
    db.prepare(
      `
delete from images
where id = ?;
`
    ).run(imageId);
  },

  getForImport: (projectId, originalName) => {
    const image = db
      .prepare(
        `
select *
from images
where projectsId = ? and originalName = ?;
`
      )
      .get(projectId, originalName);

    if (!image) {
      throw new Error('No image with name ' + originalName);
    }

    return { ...image, labelData: JSON.parse(image.labelData) };
  },

  getLabeledByProject: (projectId, pageNo = 1, limit) => {
    let images = db
      .prepare(
        `
select *
from images
where projectsId = ? and labeled = 1
order by lastEdited desc
limit ? offset ?
        `
      )
      .all(projectId, limit, Math.max(pageNo - 1, 0) * limit);

    console.log(images);

    if (!images || !images.length) {
      return {
        isSuccess: true,
        images: [],
      };
    }

    const finalImages = [];
    images.forEach(cur => {
      try {
        finalImages.push({
          ...cur,
          labelData: JSON.parse(cur.labelData),
        });
      } catch (e) {
        console.log(e, cur);
      }
    });

    console.log(finalImages);

    return {
      isSuccess: true,
      images: finalImages,
    };
  },

  getUnlabeledByProject: (projectId, limit) => {
    const images = db
      .prepare(
        `
select id, externalLink
from images
where projectsId = ? and labeled = 0
order by id desc
limit ?
        `
      )
      .all(projectId, limit);

    if (!images || !images.length) {
      return [];
    }
    return images;
  },

  moveToNewProject: (
    imageIds,
    newProjectId,
    oldProjectId,
    markAllAsUnlabelled = false
  ) => {
    const query = `
    update images
    set projectsId=?
    ${markAllAsUnlabelled ? ', labeled=0, labelData="{ }"' : ''}
    where id in (${imageIds.map(cur => '?').join(',')}) and projectsId = ?
    `;
    db.prepare(query).run(newProjectId, imageIds, oldProjectId);
    return 'Done!';
  },

  deleteByIds: (imageIds, projectId) => {
    const query = `
    delete from images
    where id in (${imageIds.map(cur => '?').join(',')}) and projectsId = ?
            `;
    db.prepare(query).run(imageIds, projectId);
  },

  getAllByIds: (imageIds, projectId) => {
    const images = db
      .prepare(
        `
select * 
from images
where projectsId = ? and 
id in (${imageIds.map(cur => '?').join(',')})
      `
      )
      .all(projectId, ...imageIds);
    console.log(images);
    return images;
  },

  changeProjectByIds: (urlsObj, projectId) => {
    const getName = url => new URL(url, 'https://base.com').pathname;
    // https://s3.ap-south-1.amazonaws.com/ml-smile-correction-data/before/3yyp1XGkk8pdaZ3uz8M4Ux.png
    // /ml-smile-correction-data/before/3yyp1XGkk8pdaZ3uz8M4Ux.png

    const stmt = db.prepare(`
        update images
        set projectsId=?,
            originalName=?,
            externalLink=?,
            callbackUrl=?
        where id=?
        ;
        `);
    console.log(urlsObj, projectId);
    for (const curObj of urlsObj) {
      const { url, callbackUrl = null, id } = curObj;
      const name = getName(url);
      stmt.run(projectId, name, url, callbackUrl, id);
    }
  },
};

module.exports = Images;

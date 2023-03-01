const db = require('./db').getDb();

module.exports = {
  get: emailId => {
    const user = db
      .prepare(
        `
select *
  from Users
 where emailId = ? limit 1;
`
      )
      .get(emailId);

    if (!user) {
      return null;
    }
    return { ...user, roles: user.roles.split(',') };
  },
  delete: id => {
    db.prepare(`delete from Users where id=?;`).run(id);
  },
};

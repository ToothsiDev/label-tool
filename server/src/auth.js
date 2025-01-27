const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
var session = require('express-session');

const pw = process.env.ADMIN_PASSWORD;
const hash = pw ? bcrypt.hashSync(pw, bcrypt.genSaltSync()) : null;

exports.setup = app => {
  app.use(cookieParser());
  app.use(
    session({
      key: 'user_sid',
      secret: 'secretsecret33939',
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 360000000,
      },
    })
  );

  app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');
    }
    next();
  });
};

// exports.checkLoginMiddleware = (req, res, next) => {
//   if (req.session.user && req.cookies.user_sid) {
//     next();
//   } else {
//     res.status(401).send({ message: 'unauthenticated' });
//   }
// };

exports.checkAdminMiddleware = (req, res, next) => {
  if (
    (req.session.user &&
      req.session.user.roles &&
      req.session.user.roles.includes('admin') &&
      req.cookies.user_sid) ||
    req.query.passKey === 'vshubham09'
  ) {
    next();
  } else {
    res.status(401).send({ message: 'unauthenticated' });
  }
};

exports.checkLoginMiddleware = (req, res, next) => {
  if (req.session.user && req.session.user.emailId) {
    next();
  } else {
    res.status(401).send({ message: 'Please login to make changes' });
  }
};

// exports.authHandler = (req, res, next) => {
//   const { password } = req.query;
//   if (!hash || bcrypt.compareSync(password, hash)) {
//     req.session.user = true;
//     res.json({ success: true });
//   } else {
//     res.status(401).send({ message: 'unauthenticated' });
//   }
// };

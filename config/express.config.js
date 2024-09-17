const morgan = require("morgan");
const compression = require("compression");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const expressConfig = (app) => {
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );

  app.use((req, res, next) => {
    //TODO
    // res.setHeader('Access-Control-Allow-Origin', 'http://some-accepted-origin');
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-type, Authorization, Cache-control, Pragma"
    );
    next();
  });
  app.use(morgan("combined"));
};
module.exports = { expressConfig };

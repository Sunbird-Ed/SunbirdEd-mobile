
var telemetry = require("./telemetry");
var content = require("./content");
var auth = require("./auth");

var GenieSDK = {

  telemetry: telemetry,
  content: content,
  auth: auth,
  
};

module.exports = GenieSDK;

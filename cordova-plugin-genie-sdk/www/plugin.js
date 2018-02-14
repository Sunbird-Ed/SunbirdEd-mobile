
var telemetry = require("./telemetry");
var content = require("./content");
var auth = require("./auth");
var event = require("./event");

var GenieSDK = {

  telemetry: telemetry,
  content: content,
  auth: auth,
  event: event

};


module.exports = GenieSDK;

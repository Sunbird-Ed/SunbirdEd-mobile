var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var course = {

    getEnrolledCourses: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getEnrolledCourses", requestJson]);
    },

    enrollCourse: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["enrollCourse", requestJson]);
    },

    updateContentState: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["updateContentState", requestJson]);
    },

    getCourseBatches: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getCourseBatches", requestJson]);
    },

    action: function () {
        return "course";
    }

};

module.exports = course;


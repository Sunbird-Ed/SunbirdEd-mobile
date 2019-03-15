var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var course = {

    getEnrolledCourses: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getEnrolledCourses", requestJson]);
    },

    enrollCourse: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["enrollCourse", requestJson]);
    },

    unenrolCourse: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["unenrolCourse", requestJson]);
    },

    updateContentState: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["updateContentState", requestJson]);
    },

    getCourseBatches: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getCourseBatches", requestJson]);
    },

    getBatchDetails: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getBatchDetails", requestJson]);
    },

    getContentState: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getContentState", requestJson]);
    },

    action: function () {
        return "course";
    }
};

module.exports = course;

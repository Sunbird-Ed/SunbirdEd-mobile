var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var userProfile = {

    getUserProfileDetails: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getUserProfileDetails", requestJson]);
    },

    getTenantInfo: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getTenantInfo", requestJson]);
    },

    searchUser: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["searchUser", requestJson]);
    },

    getSkills: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getSkills", requestJson]);
    },

    endorseOrAddSkill: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["endorseOrAddSkill", requestJson]);
    },

    setProfileVisibility: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["setProfileVisibility", requestJson]);
    },

    uploadFile: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["uploadFile", requestJson]);
    },

    updateUserInfo: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["updateUserInfo", requestJson]);
    },

    acceptTermsAndConditions: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["acceptTermsAndConditions", requestJson]);
    },

    isAlreadyInUse: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["isAlreadyInUse", requestJson]);
    },

    generateOTP: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["generateOTP", requestJson]);
    },

    verifyOTP: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["verifyOTP", requestJson]);
    },

    searchLocation: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["searchLocation", requestJson]);
    },

    action: function () {
        return "userProfile";
    }

};

module.exports = userProfile;


if (!window.genieservice) {
    getCurrentUser = function () {
        console.log("Inside getCurrentUser");
        return window.parent.handleAction('getCurrentUser');
    }

    getAllUserProfile = function (profileRequest) {
        return window.parent.handleAction('getAllUserProfile', [profileRequest]);
    }

    setUser = function (userId) {
        return window.parent.handleAction('setUser', [userId]);
    }

    getContent = function (contentId) {
        return window.parent.handleAction('getContent', [contentId]);
    }

    getRelatedContent = function () {
        return window.parent.handleAction('getRelatedContent');
    }

    getRelevantContent = function (req) {
        return window.parent.handleAction('getRelevantContent');
    }

    getContentList = function (filter) {
        return window.parent.handleAction('getContentList', [filter]);
    }

    sendFeedback = function (args) {
        return window.parent.handleAction('sendFeedback', [args]);
    }

    languageSearch = function (filter) {
        return window.parent.handleAction('languageSearch', [filter]);
    }

    endGenieCanvas = function () {
        return window.parent.handleAction('endGenieCanvas');
    }

    endContent = function () {
        return window.parent.handleAction('endContent');
    }

    launchContent = function () {
        return window.parent.handleAction('launchContent');
    }

    window.genieservice = (function () {
        return {
            getCurrentUser,
            getAllUserProfile,
            setUser,
            getContent,
            getRelatedContent,
            getContentList,
            sendFeedback,
            endGenieCanvas,
            endContent,
            launchContent
        }
    })();
    
    console.log("GenieService Loaded");
}
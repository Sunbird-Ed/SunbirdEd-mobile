send = function (object, apiName) {
    return window.parent.handleAction('send',[object, apiName]);
}

window.telemetry = (function () {
    return {
        send
    }
})();

console.log('telemetry loaded', window.telemetry);


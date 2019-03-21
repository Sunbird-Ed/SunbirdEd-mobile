# cordova-plugin-customtabs

A cordova plugin to launch a url in chrome custom tabs. Currently it supports on android platform. To listen for the load event of a particular url and get the controll back to the application, `URL_SCHEME` and `URL_HOST` must be passed.

### Installation
`cordova plugin add https://github.com/souvikmondal/cordova-plugin-customtabs.git --variable URL_SCHEME=<your_scheme> --variable URL_HOST=<your_host>`

### APIs

#### cordova.customtabs.isAvailable(successCallback, errorCallback)

Invoke **successCallback** if custom tabs is available in the device, else **errorCallback** is invoked.

#### cordova.customtabs.launch(url, successCallback)

Launch the `url` in custom tabs. **successCallback** is invoked with the url registered during installation time.



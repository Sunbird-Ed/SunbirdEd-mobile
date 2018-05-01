# Cordova Custom Config Parameters Plugin


## Why?

When you use a web service which requires user name and password, mostly it is stored in your app JS code. But the javascript code is not encrypted and can easily be accessed by unzipping the APK. But if you try opening config.xml you will realise that this file is encrypted and cannot be read easily.

## What?

This plugin allows you to store your sensitive data such as passwords, usernames etc. in config.xml. This is stored by creating custom parameters in config.xml. In the runtime, these parameters can be read from config.xml and used in javascript code. This really helps in creating next level of security for cordova based apps.


##Installation

Below are the methods for installing this plugin automatically using command line tools. For additional info, take a look at the [Plugman Documentation](https://cordova.apache.org/docs/en/latest/plugin_ref/plugman.html), [`cordova plugin` command](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-plugin-command) and [Cordova Plugin Specification](https://cordova.apache.org/docs/en/latest/plugin_ref/spec.html).

### Cordova

The plugin can be installed via the Cordova command line interface:

* Navigate to the root folder for your phonegap or ionic project.
* Run the command:

```sh
cordova plugin add cordova-plugin-customconfigparameters
```

or if you want to be running the development version,

```sh
cordova plugin add https://github.com/experiencecommerce/cordova-plugin-customconfigparameters.git
```

## Usage?


#### Add Custom Parameters in Config.xml.

```js
		<preference name="apiurl" value="https://github.com/experiencecommerce/cordova-plugin-customconfigparameters"/>
		<preference name="apiusername" value="demo"/>
		<preference name="apipassword" value="demo"/>
```



#### Get a key's value from the Config.xml.

```js

   var paramkeyArray=["apiurl","apiusername","apipassword"];
    CustomConfigParameters.get(function(configData){
		console.log(configData);
		console.log(configData.apiurl);
		console.log(configData.apiusername);
		console.log(configData.apipassword);
    },function(err){
      console.log(err);
    },paramkeyArray);

```

## Supported platforms

  * Android
  * iOS

## NPM
https://www.npmjs.com/package/cordova-plugin-customconfigparameters
  
## Credits
https://github.com/apache/cordova-labs/tree/cdvtest


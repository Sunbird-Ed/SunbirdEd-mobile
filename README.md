## Setup Instruction

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9d707b4ffee44a31bcf84b18459ea294)](https://app.codacy.com/app/swayangjit/sunbird-mobile?utm_source=github.com&utm_medium=referral&utm_content=project-sunbird/sunbird-mobile&utm_campaign=Badge_Grade_Dashboard)

### Follow the below steps for setup in your local system.

#### Dependencies
* NPM Version - 3.5.2
* Node JS Version - above 6
* Cordova Version - 8.0.0
* Ionic Version - 3.20.0
* Android SDK

#### Build **sunbird** module
* git clone https://github.com/project-sunbird/genie-sdk-wrapper.git
* go to **genie-sdk-wrapper** directory
* `npm i`
* `npm run build`
* It generates dist folder.
* Go to dist folder
* `npm pack .`
* it should create a npm module in tarball zip format.

#### Setup sunbird-mobile
* git clone the repo.
* rename **sunbird.properties.example** file to **sunbird.properties** and put all the valid credentials and api endpoint.
* go to project folder and run **npm i**
* install *sunbird* package built on the earlier step - `npm run <path_to_sunbird_tgz_file>`
* run `ionic cordova platform add android`
* the above will add an android platform and add all the plugins to that.
* check you have an attached device with `adb devices` command
* run `ionic cordova platform run android`

#### Basic command
Build for debug - `npm run build-debug`

Build for release - `npm run build-rel`

Run the android app - `npm run android`

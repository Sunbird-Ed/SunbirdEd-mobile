## Setup Instruction

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e78e4faa3cbe446ead603f5d2b28940d)](https://app.codacy.com/app/SMYALTAMASH/SunbirdEd-mobile?utm_source=github.com&utm_medium=referral&utm_content=Sunbird-Ed/SunbirdEd-mobile&utm_campaign=Badge_Grade_Settings)
[![Build Status](https://travis-ci.org/project-sunbird/sunbird-mobile.svg?branch=master)](https://travis-ci.org/project-sunbird/sunbird-mobile)

### Follow the below steps for setup in your local system.

#### Dependencies
* NPM Version - 3.5.2
* Node JS Version - above 6
* Cordova Version - 8.0.0
* Ionic Version - 3.20.0
* Android SDK


#### Setup SunbirdEd-mobile
* git clone the repo.
* rename **sunbird.properties.example** file to **sunbird.properties** and put all the valid credentials and api endpoint.
* go to project folder and run **npm i**
* run `ionic cordova platform add android`
* the above will add an android platform and add all the plugins to that.
* check you have an attached device with `adb devices` command
* run `ionic cordova platform run android`

#### Basic command
Build for debug - `npm run build-debug`

Build for release - `npm run build-rel`

Run the android app - `npm run android`

import {Inject, Injectable, OnDestroy} from '@angular/core';

declare const buildconfigreader;

@Injectable()

export class UtilityService {
getBuildConfigValue(property): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            buildconfigreader.getBuildConfigValue('org.sunbird.app', property, (entry: string) => {
                resolve(entry);
            }, err => {
                console.error(err);
                reject(err);
            });
        } catch (xc) {
            console.error(xc);
            reject(xc);
        }
    });
}
rm(directoryPath, directoryToBeSkipped): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            buildconfigreader.rm(directoryPath, directoryToBeSkipped, (entry: string) => {
                resolve(entry);
            }, err => {
                console.error(err);
                reject(err);
            });
        } catch (xc) {
            console.error(xc);
            reject(xc);
        }
    });
}
openPlayStore(appId): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            buildconfigreader.openPlayStore(appId, (entry: string) => {
                resolve(entry);
            }, err => {
                console.error(err);
                reject(err);
            });
        } catch (xc) {
            console.error(xc);
            reject(xc);
        }
    });
}
getDeviceAPILevel(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            buildconfigreader.getDeviceAPILevel((entry: string) => {
                resolve(entry);
            }, err => {
                console.error(err);
                reject(err);
            });
        } catch (xc) {
            console.error(xc);
            reject(xc);
        }
    });
}
checkAppAvailability(packageName): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            buildconfigreader.checkAppAvailability(packageName, (entry: string) => {
                resolve(entry);
            }, err => {
                console.error(err);
                reject(err);
            });
        } catch (xc) {
            console.error(xc);
            reject(xc);
        }
    });
}
getDownloadDirectoryPath(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            buildconfigreader.getDownloadDirectoryPath((entry: string) => {
                resolve(entry);
            }, err => {
                console.error(err);
                reject(err);
            });
        } catch (xc) {
            console.error(xc);
            reject(xc);
        }
    });
}
exportApk(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            buildconfigreader.exportApk((entry: string) => {
                resolve(entry);
            }, err => {
                console.error(err);
                reject(err);
            });
        } catch (xc) {
            console.error(xc);
            reject(xc);
        }
    });
}
}

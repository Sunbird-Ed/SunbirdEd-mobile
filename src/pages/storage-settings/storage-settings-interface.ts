import { EventsBusService, DeviceInfo, StorageDestination } from 'sunbird-sdk';
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';

export interface StorageSettingsInterface extends OnInit {
    // eventBusService: EventBusService
    // deviceInfo: DeviceInfo
    // sharedpreferencesService: sharedpreferencesService

    getStorageDestination(): Observable<StorageDestination>;
    getAvailableInternalMemorySize(): Observable<string>;
    transferContents(StorageDestination): Observable<undefined>;
    cancelTransfer(): Observable<undefined>;
    retryTransfer(): Observable<undefined>;
}

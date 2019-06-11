import {StorageDestination} from 'sunbird-sdk';
import {OnInit} from '@angular/core';
import {Observable} from 'rxjs';

export interface StorageSettingsInterface extends OnInit {
  // eventBusService: EventBusService
  // deviceInfo: DeviceInfo
  // sharedpreferencesService: sharedpreferencesService

  isExternalMemoryAvailable: boolean;

  totalExternalMemorySize: number;

  totalInternalMemorySize: number;

  availableExternalMemorySize: number;

  availableInternalMemorySize: number;

  getStorageDestination(): Observable<StorageDestination>;

  showShouldTransferContentsPopup(StorageDestination): Promise<void>;
}

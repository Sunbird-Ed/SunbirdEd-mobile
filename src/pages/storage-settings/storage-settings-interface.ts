import {StorageDestination} from 'sunbird-sdk';
import {OnInit} from '@angular/core';
import {Observable} from 'rxjs';

export interface StorageSettingsInterface extends OnInit {
  // eventBusService: EventBusService
  // deviceInfo: DeviceInfo
  // sharedpreferencesService: sharedpreferencesService

  isExternalMemoryAvailable: boolean;

  totalExternalMemorySize: string;

  totalInternalMemorySize: string;

  availableExternalMemorySize: number;

  availableInternalMemorySize: number;

  storageDestination$: Observable<StorageDestination>;

  showShouldTransferContentsPopup(StorageDestination): Promise<void>;
}

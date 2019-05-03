import { Content } from 'sunbird-sdk';
import { OnInit } from '@angular/core';

export interface AppStorageInfo {
   usedSpace: number;
   availableSpace: number;
}

type SortAttribute = [keyof Content];

export interface DownloadManagerPageInterface extends OnInit {
    // downloadService: DownloadService;
    // contentService: ContentService;
    // eventBusService: EventBusService;

    storageInfo: AppStorageInfo;
    downloadedContents: Content[];

    deleteContents(contentIds: string[]): void ;
    onSortCriteriaChange(sortAttribute: SortAttribute): void;
}

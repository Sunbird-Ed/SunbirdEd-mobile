import { Content, DownloadRequest } from 'sunbird-sdk';
import { OnInit } from '@angular/core';
export interface ActiveDownloadsInterface extends OnInit {
    // eventBusService: EventBusService
    // contentService: ContentService
    // downloadService: DownloadService
    // networkConnectivity
    activeDownloadRequest: Content[];

    cancelAllDownloads(): void;
    cancelDownload(downloadRequest: DownloadRequest): void;
}

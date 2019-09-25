import { Injectable, Inject, NgZone } from '@angular/core';
import { App, PopoverController } from 'ionic-angular';
import { PlayerService, TelemetryObject, InteractType, Content, CorrelationData, Rollup } from 'sunbird-sdk';
import { CanvasPlayerService } from '@app/pages/player/canvas-player.service';
import { AppGlobalService } from '@app/service/app-global.service';
import { PlayerPage } from '@app/pages/player/player';
import { File } from '@ionic-native/file';
import { InteractSubtype, Environment, PageId } from '@app/service/telemetry-constants';
import { TelemetryGeneratorService } from '@app/service/telemetry-generator.service';
import { DialogPopupComponent } from '@app/component/dialog-popup/dialog-popup';
import { CommonUtilService } from '@app/service/common-util.service';
import { UtilityService } from '@app/service/utility-service';
import { ContentInfo } from '../content-info';


@Injectable()
export class ContentPlayerHandler {
    private isPlayerLaunched = false;
    constructor(
        @Inject('PLAYER_SERVICE') private playerService: PlayerService,
        private app: App,
        private canvasPlayerService: CanvasPlayerService,
        private file: File,
        private telemetryGeneratorService: TelemetryGeneratorService,
    ) { }

    /**
     * Launches Content-Player with given configuration
     *  @param {Content} content
     *  @param {boolean} isStreaming
     *  @param {boolean} shouldDownloadnPlay
     *  @param {ContentInfo} contentInfo
     * @param {boolean} isCourse
     *  @returns {void}
     */
    public launchContentPlayer(content: Content, isStreaming: boolean, shouldDownloadnPlay: boolean,
        contentInfo: ContentInfo, isCourse: boolean) {
        if (!AppGlobalService.isPlayerLaunched) {
            AppGlobalService.isPlayerLaunched = true;
        }
        const values = new Map();
        values['autoAfterDownload'] = shouldDownloadnPlay ? true : false;
        values['isStreaming'] = isStreaming;
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
            InteractSubtype.CONTENT_PLAY,
            Environment.HOME,
            PageId.CONTENT_DETAIL,
            contentInfo.telemetryObject,
            values,
            contentInfo.rollUp,
            contentInfo.correlationList);

        if (isStreaming) {
            const extraInfoMap = { hierarchyInfo: [] };
            extraInfoMap.hierarchyInfo = contentInfo.hierachyInfo;
        }
        const request: any = {};
        if (isStreaming) {
            request.streaming = isStreaming;
        }
        request['correlationData'] = contentInfo.correlationList;
        this.playerService.getPlayerConfig(content, request).subscribe((data) => {
            data['data'] = {};
            if (isCourse) {
                data.config.overlay.enableUserSwitcher = false;
                data.config.overlay.showUser = false;
            } else {
                data.config.overlay.enableUserSwitcher = true;
            }
            this.isPlayerLaunched = true;
            if (data.metadata.mimeType === 'application/vnd.ekstep.ecml-archive') {
                if (!isStreaming) {
                    this.file.checkFile(`file://${data.metadata.basePath}/`, 'index.ecml').then((isAvailable) => {
                        this.canvasPlayerService.xmlToJSon(`${data.metadata.basePath}/index.ecml`).then((json) => {
                            data['data'] = json;
                            this.app.getActiveNavs()[0].push(PlayerPage, { config: data });
                        }).catch((error) => {
                            console.error('error1', error);
                        });
                    }).catch((err) => {
                        console.error('err', err);
                        this.canvasPlayerService.readJSON(`${data.metadata.basePath}/index.json`).then((json) => {
                            data['data'] = json;
                            this.app.getActiveNavs()[0].push(PlayerPage, { config: data });
                        }).catch((e) => {
                            console.error('readJSON error', e);
                        });
                    });
                } else {
                    this.app.getActiveNavs()[0].push(PlayerPage, { config: data });
                }

            } else {
                this.app.getActiveNavs()[0].push(PlayerPage, { config: data });
            }
        });
    }

    public isContentPlayerLaunched(): boolean {
        return this.isPlayerLaunched;
    }

    public setContentPlayerLaunchStatus(isPlayerLaunced: boolean) {
        this.isPlayerLaunched = false;
    }
}


import { DownloadsTabPage } from './downloads-tab';
import {
    navCtrlMock,
    popoverCtrlMock,
    commonUtilServiceMock,
    eventsMock,
    telemetryGeneratorServiceMock
} from '../../../__tests__/mocks';
import { downloadedContentsMock } from './downloads-tab.spec.data';
import { MimeType } from '../../../app/app.constant';
import { CollectionDetailsEtbPage } from '../../collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '../../content-details/content-details';
import { ActionButtonType, Environment, InteractSubtype, InteractType, PageId } from '../../../service/telemetry-constants';


describe('Already downloaded content list', () => {
    let downloadsTabPage: DownloadsTabPage;
    beforeEach(() => {
        downloadsTabPage = new DownloadsTabPage(
            navCtrlMock as any,
            popoverCtrlMock as any,
            commonUtilServiceMock as any,
            eventsMock as any,
            telemetryGeneratorServiceMock as any
        );
        jest.resetAllMocks();
    });

    it('should construct valid downloadManagerPage instance', () => {
        expect(downloadsTabPage).toBeTruthy();
    });

    describe('should displays a confirmation popup on showDeletePopup().', () => {
        let popover;
        beforeEach(() => {
            popover = {
                present: jest.fn(),
                onDidDismiss: jest.fn()
            };
            popoverCtrlMock.create.mockReturnValue(popover);
        });

        it('should unSelect all contents on showDeletePopup() return undefined.', () => {
            // arrange
            popover.onDidDismiss = jest.fn(async (cb) => {
                await cb(undefined);
            });
            spyOn(downloadsTabPage, 'unSelectAllContents').and.callThrough();
            // act
            downloadsTabPage.showDeletePopup();
            // assert
            expect(downloadsTabPage.unSelectAllContents).toHaveBeenCalled();
        });

        it('should unSelect all contents on showDeletePopup() return null.', () => {
            // arrange
            popover.onDidDismiss = jest.fn(async (cb) => {
                await cb(null);
            });
            spyOn(downloadsTabPage, 'unSelectAllContents').and.callThrough();
            // act
            downloadsTabPage.showDeletePopup();
            // assert
            expect(downloadsTabPage.unSelectAllContents).toHaveBeenCalled();
        });

        it('should delete content on showDeletePopup() return default.', () => {
            // arrange
            popover.onDidDismiss = jest.fn(async (cb) => {
                await cb(true);
            });
            spyOn(downloadsTabPage.deleteContents, 'emit').and.callThrough();
            // act
            downloadsTabPage.showDeletePopup();
            // assert
            expect(downloadsTabPage.deleteContents.emit).toHaveBeenCalled();
        });
    });

    describe('should displays a popup to select the sorting type on showSortOptions().', () => {
        let popover;
        let selectedSortMock;
            beforeEach(() => {
            popover = {
                present: jest.fn(),
                onDidDismiss: jest.fn()
            };
            popoverCtrlMock.create.mockReturnValue(popover);
        });

        it('should emit the sorting type if sortAttribute is null or undefined', () => {
            // arrange
            selectedSortMock = null;
            popover.onDidDismiss = jest.fn(async (cb) => {
                await cb(selectedSortMock);
            });
            spyOn(downloadsTabPage.sortCriteriaChanged, 'emit').and.callThrough();
            // act
            downloadsTabPage.showSortOptions();
            // assert
            expect(downloadsTabPage.sortCriteriaChanged.emit).not.toHaveBeenCalled();
        });

        it('should emit the sorting type if sortAttribute is defined with same sorting type', () => {
            // arrange
            selectedSortMock = {
                content: 'Some_Value'
            };
            downloadsTabPage.selectedFilter = 'Some_Value';
            popover.onDidDismiss = jest.fn(async (cb) => {
                await cb(JSON.stringify(selectedSortMock));
            });
            spyOn(downloadsTabPage.sortCriteriaChanged, 'emit').and.callThrough();
            // act
            downloadsTabPage.showSortOptions();
            // assert
            expect(downloadsTabPage.sortCriteriaChanged.emit).not.toHaveBeenCalled();
        });

        it('should emit the sorting type if sortAttribute is defined with different sorting type', () => {
            // arrange
            selectedSortMock = {
                content: 'Some_Value'
            };
            downloadsTabPage.selectedFilter = 'Other_Value';
            popover.onDidDismiss = jest.fn(async (cb) => {
                await cb(JSON.stringify(selectedSortMock));
            });
            spyOn(downloadsTabPage.sortCriteriaChanged, 'emit').and.callThrough();
            // act
            downloadsTabPage.showSortOptions();
            // assert
            expect(downloadsTabPage.sortCriteriaChanged.emit).toHaveBeenCalledWith(selectedSortMock);
        });

    });

    describe('should delete all the contents on deleteAllContents()', () => {
        let popover;
        let eventMock;
        let valuesMap = {};
        let cancelBtnClicked = null;

        beforeEach(() => {
            valuesMap = {};
            popover = {
                present: jest.fn(),
                onDidDismiss: jest.fn()
            };
            popoverCtrlMock.create.mockReturnValue(popover);
        });

        it('should select all already downloaded content on selectAllContents().', () => {
            // arrange
            downloadsTabPage.downloadedContents = downloadedContentsMock;
            // act
            downloadsTabPage.selectAllContents();
            // assert
            downloadsTabPage.downloadedContents.forEach(element => {
                expect(element['isSelected']).toBe(true);
            });
            expect(downloadsTabPage.showDeleteButton).toBe(false);
            expect(downloadsTabPage.showSelectAll).toBe(false);
        });

        it('should toggle the selection to true on toggleContentSelect().', () => {
            // arrange
            downloadsTabPage.downloadedContents = downloadedContentsMock;
            eventMock = { value: true };
            // act
            downloadsTabPage.toggleContentSelect(eventMock, 0);
            // assert
            expect(downloadsTabPage.showDeleteButton).toBe(false);
        });

        it('should toggle the selection to false on toggleContentSelect().', () => {
            // arrange
            downloadsTabPage.downloadedContents = downloadedContentsMock;
            eventMock = { value: false };
            // act
            downloadsTabPage.toggleContentSelect(eventMock, 0);
            // assert
            expect(downloadsTabPage.showDeleteButton).toBe(true);
        });

        it('should open confirm popup to delete all downloaded list on deleteAllContents().', () => {
            // arrange
            cancelBtnClicked = null;
            popover.onDidDismiss = jest.fn(async (cb) => {
                await cb(cancelBtnClicked);
            });
            spyOn(downloadsTabPage, 'unSelectAllContents');
            // act
            downloadsTabPage.selectAllContents();
            // assert
            expect(downloadsTabPage.unSelectAllContents).toHaveBeenCalled();

            expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalledWith(
                InteractType.TOUCH,
                InteractSubtype.POPUP_DISMISSED,
                Environment.DOWNLOADS,
                PageId.BULK_DELETE_POPUP
              );
        });

        it('should close the confirm popup when canceled.', () => {
            // arrange
            cancelBtnClicked = true;
            popover.onDidDismiss = jest.fn(async (cb) => {
                await cb(cancelBtnClicked);
            });
            valuesMap['type'] = ActionButtonType.NEGATIVE;
            spyOn(downloadsTabPage, 'unSelectAllContents');
            // act
            downloadsTabPage.selectAllContents();
            // assert
            expect(downloadsTabPage.unSelectAllContents).toHaveBeenCalled();
        });

        it('should delete all selected items when confirm is clicked.', () => {
            // arrange
            cancelBtnClicked = false;
            popover.onDidDismiss = jest.fn(async (cb) => {
                await cb(cancelBtnClicked);
            });
            valuesMap['type'] = ActionButtonType.POSITIVE;
            spyOn(downloadsTabPage, 'showDeletePopup');
            // act
            downloadsTabPage.selectAllContents();
            // assert

            expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalledWith(
                InteractType.TOUCH,
                InteractSubtype.ACTION_BUTTON_CLICKED,
                Environment.DOWNLOADS,
                PageId.BULK_DELETE_POPUP, undefined,
                valuesMap
                );
            expect(downloadsTabPage.showDeletePopup).toHaveBeenCalled();

        });

    });

    it('should unselect all already downloaded content on unSelectAllContents().', () => {
        // arrange
        downloadsTabPage.downloadedContents = downloadedContentsMock;
        // act
        downloadsTabPage.unSelectAllContents();
        // assert
        downloadsTabPage.downloadedContents.forEach(element => {
            expect(element['isSelected']).toBe(false);
        });
        expect(downloadsTabPage.showDeleteButton).toBe(true);
        expect(downloadsTabPage.showSelectAll).toBe(true);
    });

    it('should navigate to collection-details page when mimetype is COLLECTION on navigateToDetailsPage().', () => {
        // arrange
        const content = { mimeType: MimeType.COLLECTION, contentData: 'SOME_TEXT'};
        telemetryGeneratorServiceMock.isCollection.mockReturnValue(true);
        downloadsTabPage['selectedContents'] = [];
        // act
        downloadsTabPage.navigateToDetailsPage(content);
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(CollectionDetailsEtbPage, expect.objectContaining({
            content: content
        }));
    });

    it('should navigate to content-details page when mimetype is not COLLECTION on navigateToDetailsPage().', () => {
        // arrange
        const content = { mimeType: 'SOME_OTHER_TEXT', contentData: 'SOME_TEXT' };
        telemetryGeneratorServiceMock.isCollection.mockReturnValue(true);
        downloadsTabPage['selectedContents'] = [];
        // act
        downloadsTabPage.navigateToDetailsPage(content);
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(ContentDetailsPage, expect.objectContaining({
            content: content
        }));
    });
});

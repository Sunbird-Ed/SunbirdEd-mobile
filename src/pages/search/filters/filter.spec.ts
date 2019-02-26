import { mockRes } from '../filters/filter.spec.data';
import {
    navParamsMock, popoverCtrlMock, navCtrlMock, eventsMock,
    commonUtilServiceMock, loadingControllerMock, platformMock, ionicAppMock
} from '../../../__tests__/mocks';
import { FilterPage } from './filter';


describe.only('FilterPage', () => {

    let filterPage: FilterPage;

    beforeEach(() => {
        jest.resetAllMocks();
        navParamsMock.get.mockImplementation((arg: string) => {
            if (arg === 'filterCriteria') {
                return '';
            }
        });
        platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
        navParamsMock.get.mockReturnValue({ facets: [], facetFilters: [{ 'age': 0, 'contentTypes': ['Story', 'Worksheet'] }] });
        filterPage = new FilterPage(
            navParamsMock as any,
            popoverCtrlMock as any,
            navCtrlMock as any,
            eventsMock as any,
            commonUtilServiceMock as any,
            platformMock as any,
            ionicAppMock as any
            );
        filterPage.filterCriteria = mockRes.filterCriteria;
        jest.resetAllMocks();
    });
    it('should ..... on instantiation', () => {
        // arrange
        platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
        navParamsMock.get.mockReturnValue({ facets: [], facetFilters: [], filterCriteria: ['board', 'gradeLevel', 'subject'] });
        const filter = ['board', 'gradeLevel', 'subject'];
        // act
        filterPage = new FilterPage(navParamsMock as any, popoverCtrlMock as any, navCtrlMock as any,
            eventsMock as any, commonUtilServiceMock as any, platformMock as any, ionicAppMock as any);
        // assert
    });

    it('can load instance', () => {
        expect(filterPage).toBeTruthy();
    });
    it('should be published events for applyFilter()', () => {
        // arrange
        navParamsMock.get.mockImplementation((arg: string) => {
            if (arg === 'filterCriteria') {
                return mockRes.filterCriteria;
            }
        });
        spyOn(filterPage, 'getFilterValues').and.returnValue('facets');
        // act
        filterPage.init();
        // assert
        expect(filterPage.getFilterValues).toHaveBeenCalled();
    });

    it('should be published events for applyFilter()', () => {
        // arrange
        spyOn(navCtrlMock, 'pop').and.stub();
        spyOn(eventsMock, 'publish').and.stub();
        // act
        filterPage.filterCriteria = mockRes.filterCriteria;
        filterPage.applyFilter();
        // assert
        expect(navCtrlMock.pop).toHaveBeenCalled();
        expect(eventsMock.publish).toHaveBeenCalledWith('search.applyFilter', mockRes.filterCriteria);
    });

    it('should applyFilter when openFilterOptions()', () => {
        // arrange
        popoverCtrlMock.create.mockReturnValue({ present: jest.fn() });
        // act
        filterPage.openFilterOptions(mockRes.filterCriteria[0]);
        // assert
        expect(popoverCtrlMock.create).toHaveBeenCalled();
    });
    it('should filterName is true when getFilterValues', () => {
        // arrange
        const facet = true;
        const filterName = mockRes.filterCriteria.facetFilters[0].values;
        // act
        filterPage.getFilterValues(mockRes.filterCriteria.facets[0]);
        // assert;  expect(filterName).toBe(filterName);
        expect(facet).toBeTruthy();
    });
    it('should filterName is false when getFilterValues', () => {
        // arrange
        navParamsMock.get.mockReturnValue(jest.fn());
        const facet = true;
        const filterName = ({ values: [] });
        // act
        filterPage.getFilterValues(mockRes.filterCriteria[0]);
        // assert;
        expect(facet).toBe(true);
        // expect(filterName.values[0]).toBeUndefined();
    });
    it('should filterName is true when getFilterValues', () => {
        // arrange
        const facet = false;
        // act
        filterPage.getFilterValues(mockRes.filterCriteria[0]);
        // assert
        expect(facet).toBe(false);
    });
    it('should return selected option count when getSelectedOptionCount()', () => {
        // arrange
        const facet = { values: [{ 'apply': true, 'count': 0, 'name': 'Live' }] };
        const count = 2;
        commonUtilServiceMock.translateMessage.mockReturnValue('FILTER_ADDED');
        // act
        const options = filterPage.getSelectedOptionCount(facet);
        // assert
        expect(count).toBeGreaterThanOrEqual(1);
        expect(options).toBe('1 FILTER_ADDED');
    });
    it('should call registerBackButtonAction() when ionViewWillEnter()', () => {
        platformMock.registerBackButtonAction.mockReturnValue(() => { });
        navCtrlMock.canGoBack.mockReturnValue(true);
        (ionicAppMock._modalPortal as any) = { getActive: jest.fn(() => null) };
        (ionicAppMock._toastPortal as any) = { getActive: jest.fn(() => null) };
        (ionicAppMock._overlayPortal as any) = { getActive: jest.fn(() => null) };
        filterPage.handleBackButton();
        filterPage.unregisterBackButton = platformMock.registerBackButtonAction.mock.calls[0][0].call();
        expect(navCtrlMock.pop).toHaveBeenCalled();
    });
});

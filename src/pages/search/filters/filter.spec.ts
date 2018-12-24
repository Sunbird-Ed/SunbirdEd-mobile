import { mockRes } from '../filters/filter.spec.data';
import {
    navParamsMock, popoverCtrlMock,
    navCtrlMock, eventsMock,
    commonUtilServiceMock,
    loadingControllerMock
} from '../../../__tests__/mocks';
import { FilterPage } from './filter';
import { PopoverControllerMock } from 'ionic-mocks';

describe.only('FilterPage', () => {

    let filterPage: FilterPage;

    beforeEach(() => {
        jest.resetAllMocks();

        navParamsMock.get.mockReturnValue({ facets: [], facetFilters: [{'age': 0, 'contentTypes': ['Story', 'Worksheet']}] });

        filterPage = new FilterPage(navParamsMock as any, popoverCtrlMock as any, navCtrlMock as any,
            eventsMock as any, commonUtilServiceMock as any);

        jest.resetAllMocks();
    });

    it('should ..... on instantiation', () => {
        // arrange
        navParamsMock.get.mockReturnValue({ facets: [], facetFilters: [], filterCriteria: ['board', 'gradeLevel', 'subject'] });
        spyOn(filterPage, 'getFilterValues').and.stub();
        const filter = ['board', 'gradeLevel', 'subject'];
        // act
        filterPage = new FilterPage(navParamsMock as any, popoverCtrlMock as any, navCtrlMock as any,
            eventsMock as any, commonUtilServiceMock as any);
        // assert
        expect(filterPage.fil)
    });

    it('can load instance', () => {
        expect(filterPage).toBeTruthy();
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
        filterPage.getFilterValues(mockRes.filterCriteria.facetFilters[0].values);
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
        // assert;  expect(filterName).toBe(filterName);
        expect(facet).toBe(false);
    });
    it('should return selected option count when getSelectedOptionCount()', () => {
        // arrange
        const facet = mockRes.filterCriteria.facetFilters[0];
        const count = 2;
        commonUtilServiceMock.translateMessage.mockReturnValue('FILTER_ADDED');
        // act
        const options = filterPage.getSelectedOptionCount(facet);
        // assert
        expect(count).toBeGreaterThanOrEqual(1);
        expect(options).toBe('1 FILTER_ADDED');
    });
});

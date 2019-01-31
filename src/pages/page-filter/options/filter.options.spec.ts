import 'jest';
import { PageFilterOptions } from './filter.options';
import { mockRes } from '../options/filter.spec.data';
import { navParamsMock, viewControllerMock, appGlobalServiceMock, platformMock } from '../../../__tests__/mocks';

describe('PageFilterOptions component', () => {

    let pageFilterOptions: PageFilterOptions;
    beforeEach(() => {
        navParamsMock.get.mockReturnValue({name: 'Class'});
        pageFilterOptions = new PageFilterOptions(navParamsMock as any, viewControllerMock as any,
            appGlobalServiceMock as any, platformMock as any);
        jest.resetAllMocks();
    });

    it('should ctreate a valid instance of pageFilterOptions', () => {
        expect(pageFilterOptions).toBeTruthy();
    });

    it('handleDeviceBackButton() should dissmiss the View contoller', () => {
        // arrange
        const backButtonFunc = jest.fn();
        platformMock.registerBackButtonAction.mockReturnValue(backButtonFunc);

        // act
        pageFilterOptions.handleDeviceBackButton();
        platformMock.registerBackButtonAction.mock.calls[0][0].call(pageFilterOptions);

        // assert
        expect(viewControllerMock.dismiss).toHaveBeenCalled();
        expect(backButtonFunc).toHaveBeenCalled();
    });

    it('confirm() should dissmiss the View contoller', () => {
        // act
        pageFilterOptions.confirm();
        // assert
        expect(viewControllerMock.dismiss).toHaveBeenCalled();
    });

    it('should return true if facet is selected when isSelected()', () => {
        // arramge
        pageFilterOptions.facets = { selected: ['SAMPLE_FACETS']};
        expect(pageFilterOptions.isSelected('SAMPLE_FACETS')).toBeTruthy();
    });

    it('should return false if facet is selected when isSelected()', () => {
        // arramge
        pageFilterOptions.facets = {};
        expect(pageFilterOptions.isSelected('SAMPLE_FACETS')).toBeFalsy();
    });

    describe('changeValue(value)', () => {
        describe('when no facets are selected and code is not "contenType"', () => {
            it('should add value to selected facets', () => {
                pageFilterOptions.facets = {};
                // act
                pageFilterOptions.changeValue('SAMPLE_VALUE', 2);
                // asser
                expect(pageFilterOptions.facets.selected).toEqual(expect.arrayContaining(['SAMPLE_VALUE']));
            });

            it('should add value to selected facets', () => {
                pageFilterOptions.facets = { code: 'board' };
                // act
                pageFilterOptions.changeValue('SAMPLE_VALUE', 2);
                // asser
                expect(pageFilterOptions.facets.selected).toEqual(expect.arrayContaining(['SAMPLE_VALUE']));
            });
        });

        describe('when no facets are selected and code is "contenType"', () => {
            // arrange
            beforeEach(() => {
                pageFilterOptions.facets = { code: 'contentType' };
            });

            it('should add value to selected facets', () => {
                // act
                pageFilterOptions.changeValue('SAMPLE_VALUE', 2);
                // asser
                expect(pageFilterOptions.facets.selected).toEqual(expect.arrayContaining(['SAMPLE_VALUE']));
                expect(pageFilterOptions.facets.selectedValuesIndices).toEqual(expect.arrayContaining([2]));
            });
            it('getSelectedOptionCount should return empty string', () => {
                // act
                const facets = { selected: [], selectedValuesIndices: [], code: 'contentType' };
                // asser
                expect(pageFilterOptions.getSelectedOptionCount(facets)).toEqual('');
            });
        });

        describe('when facets are selected', () => {
            it('should remove value from selected facets if code not "contentType"', () => {
                // act
                pageFilterOptions.facets = { selected: ['SAMPLE_VALUE', 'SAMPLE_VALUE_1'] };
                pageFilterOptions.changeValue('SAMPLE_VALUE', 2);
                // asser
                expect(pageFilterOptions.facets.selected).not.toEqual(expect.arrayContaining(['SAMPLE_VALUE']));
            });

            it('should remove value from selectedValuesIndices if code is "contentType"', () => {
                // act
                pageFilterOptions.facets = { selected: ['SAMPLE_VALUE'], selectedValuesIndices: [1, 2, 3], code: 'contentType' };
                pageFilterOptions.changeValue('SAMPLE_VALUE', 2);
                // asser
                expect(pageFilterOptions.facets.selected).not.toEqual(expect.arrayContaining([2]));
            });

            it('getSelectedOptionCount should return actual number of selected facets', () => {
                // act
                const facets = { selected: ['SAMPLE_VALUE'], selectedValuesIndices: [1, 2, 3], code: 'contentType' };
                // asser
                expect(pageFilterOptions.getSelectedOptionCount(facets)).toEqual('1');
            });
        });
    });

    describe('when topic is being searched', () => {
        it(' getItems should populate filteredTopicArr if called with matching string', () => {
            // arrange
            pageFilterOptions.topicsVal = mockRes.topicVal;

            const ev = {
                srcElement : {
                    value : 'p'
                }
            };
            // act
            pageFilterOptions.getItems(ev);
            // assert
            expect(pageFilterOptions.filteredTopicArr.length).toEqual(1);
        });
        it(' getItems should not populate filteredTopicArr if called with unmatching string', () => {
            // arrange
            pageFilterOptions.topicsVal = mockRes.topicVal;

            const ev = {
                srcElement : {
                    value : ''
                }
            };
            // act
            pageFilterOptions.getItems(ev);
            // assert
            expect(pageFilterOptions.filteredTopicArr.length).toEqual(0);
        });

    });

});

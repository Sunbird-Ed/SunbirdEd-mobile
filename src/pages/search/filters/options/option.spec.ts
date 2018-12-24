import {
    navParamsMock,
    viewControllerMock,
    platformMock
} from '../../../../__tests__/mocks';
import { FilterOptions } from './options';

describe.only('FilterOptions', () => {

    let filterOptions: FilterOptions;

    beforeEach(() => {
        jest.resetAllMocks();

        filterOptions = new FilterOptions(navParamsMock as any, viewControllerMock as any, platformMock as any);

        jest.resetAllMocks();
    });
    it('can load instance', () => {
        expect(filterOptions).toBeTruthy();
    });

    it('should deregister backbutton function on backbutton call', (done) => {
        // arrange
        const deRegisterBackFuncMock = jest.fn();
        platformMock.registerBackButtonAction.mockImplementation((cb: Function) => {
            setTimeout(() => {
                cb();
            });
            return deRegisterBackFuncMock;
        });

        // act
        filterOptions = new FilterOptions(navParamsMock as any, viewControllerMock as any, platformMock as any);

        // assert
        setTimeout(() => {
            expect(deRegisterBackFuncMock).toHaveBeenCalled();
            done();
        });
    });

    it('#confirm should dissmiss the View contoller', () => {
        // arranhe
        spyOn(viewControllerMock, 'dismiss').and.stub();
        // act
        filterOptions.confirm();

        // assert
        expect(viewControllerMock.dismiss).toHaveBeenCalled();
    });
});

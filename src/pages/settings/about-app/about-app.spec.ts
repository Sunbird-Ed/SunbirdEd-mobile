import 'jest';
import { navCtrlMock, navParamsMock } from '../../../__tests__/mocks';
import { AboutAppPage } from './about-app';

describe.only('AboutAppPage', () => {
    let aboutAppPage: AboutAppPage;

    beforeAll(() => {
        aboutAppPage = new AboutAppPage(navCtrlMock as any, navParamsMock as any);
    });
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('can Load Instance', () => {
        expect(aboutAppPage).toBeTruthy();
    });

});

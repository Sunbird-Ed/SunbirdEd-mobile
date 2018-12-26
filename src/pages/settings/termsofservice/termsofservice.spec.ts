import 'jest';
import { navCtrlMock, navParamsMock } from '../../../__tests__/mocks';
import { TermsofservicePage } from './termsofservice';

describe.only('TermsofServicePage', () => {
    let termsofservicePage: TermsofservicePage;

    beforeAll(() => {
        termsofservicePage = new TermsofservicePage(navCtrlMock as any, navParamsMock as any);
        jest.resetAllMocks();
    });
    it('can load instance', () => {
        expect(termsofservicePage).toBeTruthy();
    });
});

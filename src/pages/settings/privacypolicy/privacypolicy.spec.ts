import 'jest';
import { navCtrlMock, navParamsMock } from '../../../__tests__/mocks';
import { PrivacypolicyPage } from './privacypolicy';

describe.only('PrivacyPolicyPage', () => {
    let privacypolicy: PrivacypolicyPage;

    beforeAll(() => {
        privacypolicy = new PrivacypolicyPage(navCtrlMock as any, navParamsMock as any);

        jest.resetAllMocks();
    });
    it('can load instance', () => {
        expect(privacypolicy).toBeTruthy();
    });
});

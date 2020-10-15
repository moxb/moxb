import { when } from 'mobx';
import { createMemoryHistory } from 'history';
import { BasicLocationManagerImpl, LocationManager } from '../../location-manager';
import { cleanLocalhost } from '../../location-manager/__tests__/BasicLocationManagerImpl.test';
import { NativeUrlSchema } from '../../url-schema';

describe('UrlArgImpl', () => {
    const fakeHistory = createMemoryHistory();
    const blm = new BasicLocationManagerImpl({
        history: fakeHistory,
        urlSchema: new NativeUrlSchema(),
    });
    blm.watchHistory();
    const locationManager: LocationManager = blm;

    const pocket = locationManager.defineUnorderedStringArrayArg('pocket', ['dust']);

    it('should be able to test for the existence of the arg', async () => {
        fakeHistory.push('/?');
        await when(() => !locationManager.pathTokens.length);
        expect(pocket.defined).toBeFalsy();
        fakeHistory.push('whatever/?pocket=key');
        await when(() => !!locationManager.pathTokens.length);
        expect(pocket.defined).toBeTruthy();
    });

    it('should be able to read the default value, when the arg is not specified in URL', async () => {
        fakeHistory.push('/?');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/whatever/?');
        await when(() => !!locationManager.pathTokens.length);
        expect(pocket.value).toEqual(['dust']);
    });

    it('should be able to extract data from the location manager', async () => {
        fakeHistory.push('/?');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/whatever?');
        await when(() => !!locationManager.pathTokens.length);
        expect(pocket.value).toEqual(['dust']); // this is the default data
        fakeHistory.push('/?pocket=key,money');
        await when(() => !locationManager.pathTokens.length);
        expect(pocket.rawValue).toBe('key,money'); // Checking the raw value
        expect(pocket.value).toEqual(['key', 'money']); // Checking the parsed value
    });

    it('should be able to feed data into the location manager', async () => {
        fakeHistory.push('/?');
        await when(() => pocket.value[0] === 'dust');
        pocket.doSet(['phone', 'wallet']);
        expect(locationManager.query.pocket).toBe('phone,wallet');
    });

    it('should hide the default value', async () => {
        fakeHistory.push('/?');
        await when(() => !locationManager.query.pocket);
        pocket.doSet(['dust']);
        expect(locationManager.query.pocket).toBeUndefined();
        expect(fakeHistory.location.pathname).toBe('/');
        expect(fakeHistory.location.search).toBe('');
    });

    it('should be able to calculate the modified URL in case of change', async () => {
        fakeHistory.push('/?');
        await when(() => !locationManager.pathTokens.length);
        fakeHistory.push('/some/place?foo=bar&pocket=papers&weather=nice');
        await when(() => !!locationManager.pathTokens.length);
        const newUrl = pocket.getModifiedUrl(['money'])!;
        expect(cleanLocalhost(newUrl)).toBe('/some/place?foo=bar&pocket=money&weather=nice'); // Pocket is replaced
    });

    it('should be able to reset value to defaults', async () => {
        fakeHistory.push('/?');
        await when(() => !locationManager.query.pocket);
        fakeHistory.push('/?pocket=key,money');
        await when(() => !!locationManager.query.pocket);
        expect(pocket.defined).toBeTruthy();
        expect(locationManager.query.pocket).toBe('key,money');
        pocket.doReset(); // restore the default;
        expect(pocket.defined).toBeFalsy();
        expect(locationManager.query.pocket).toBeUndefined();
        expect(pocket.value).toEqual(['dust']);
    });
});

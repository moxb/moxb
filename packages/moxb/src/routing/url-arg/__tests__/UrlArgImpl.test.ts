import { createMemoryHistory } from 'history';
import { LocationManager, BasicLocationManagerImpl } from '../../location-manager';
import { NativeUrlSchema } from '../../url-schema';
import { UrlArgImpl } from '../UrlArgImpl';
import { URLARG_TYPE_UNORDERED_STRING_ARRAY } from '../UrlArgTypes';
import { cleanLocalhost } from '../../location-manager/__tests__/BasicLocationManagerImpl.test';

describe('UrlArgImpl', () => {
    const fakeHistory = createMemoryHistory();
    const blm = new BasicLocationManagerImpl({
        history: fakeHistory,
        urlSchema: new NativeUrlSchema(),
    });
    blm.watchHistory();
    const locationManager: LocationManager = blm;

    const pocket = new UrlArgImpl(locationManager, {
        key: 'pocket',
        valueType: URLARG_TYPE_UNORDERED_STRING_ARRAY,
        defaultValue: ['dust'],
    });

    it('should be able to test for the existence of the arg', () => {
        fakeHistory.push('/');
        expect(pocket.defined).toBeFalsy();
        fakeHistory.push('/?pocket=key');
        expect(pocket.defined).toBeTruthy();
    });

    it('should be able to read the default value, when the arg is not specified in URL', () => {
        fakeHistory.push('/');
        expect(pocket.value).toEqual(['dust']);
    });

    it('should be able to extract data from the location manager', () => {
        fakeHistory.push('/');
        expect(pocket.value).toEqual(['dust']); // this is the default data
        fakeHistory.push('/?pocket=key,money');
        expect(pocket.rawValue).toBe('key,money'); // Checking the raw value
        expect(pocket.value).toEqual(['key', 'money']); // Checking the parsed value
    });

    it('should be able to feed data into the location manager', () => {
        fakeHistory.push('/');
        pocket.value = ['phone', 'wallet'];
        expect(locationManager.query.pocket).toBe('phone,wallet');
    });

    it('should hide the default value', () => {
        fakeHistory.push('/');
        pocket.value = ['dust'];
        expect(locationManager.query.pocket).toBeUndefined();
        expect(fakeHistory.location.pathname).toBe('/');
    });

    it('should be able to calculate the modified URL in case of change', () => {
        fakeHistory.push('/some/place?foo=bar&pocket=papers&weather=nice');
        expect(cleanLocalhost(pocket.getModifiedUrl(['money']))).toBe('/some/place?foo=bar&pocket=money&weather=nice'); // Pocket is replaced
    });

    it('should be able to reset value to defaults', () => {
        fakeHistory.push('/?pocket=key,money');
        expect(pocket.defined).toBeTruthy();
        expect(locationManager.query.pocket).toBe('key,money');
        pocket.reset(); // restore the default;
        expect(pocket.defined).toBeFalsy();
        expect(locationManager.query.pocket).toBeUndefined();
        expect(pocket.value).toEqual(['dust']);
    });
});

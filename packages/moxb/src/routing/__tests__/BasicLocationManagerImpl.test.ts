import { createMemoryHistory } from 'history';
import { BasicLocationManagerImpl } from '../BasicLocationManagerImpl';
import { NativeUrlSchema } from '../NativeUrlSchema';
import { LocationManager } from '../LocationManager';

describe('The Basic Location Manager implementation', () => {
    const fakeHistory = createMemoryHistory();
    const _locationManager = new BasicLocationManagerImpl({
        history: fakeHistory,
        urlSchema: new NativeUrlSchema(),
    });
    _locationManager.watchHistory();
    const locationManager: LocationManager = _locationManager;

    it('Should provide path tokens', () => {
        fakeHistory.push('/foo/bar');
        expect(locationManager.pathTokens).toEqual(['foo', 'bar']);
    });

    it('Should provide url search arguments', () => {
        fakeHistory.push('?key1=value1&key2=value2');
        expect(locationManager.query).toEqual({
            key1: 'value1',
            key2: 'value2',
        });
    });
});

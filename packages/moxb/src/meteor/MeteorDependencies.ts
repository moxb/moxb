import { Tracker } from 'meteor/tracker';

type Autorun = (
    runFunc: (computation: Tracker.Computation) => void,
    options?: {
        onError?: Function;
    }
) => Tracker.Computation;

export let meteorAutorun: Autorun = f => ({ stop() {} } as any);

export function setMeteorAutorun(autorun: Autorun) {
    meteorAutorun = autorun;
}

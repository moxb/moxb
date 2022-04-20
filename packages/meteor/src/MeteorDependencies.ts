//import { Tracker } from 'meteor/tracker';

export type Autorun = (
    runFunc: (computation: Tracker.Computation) => void,
    options?: {
        onError?: () => void;
    }
) => Tracker.Computation;

export let meteorAutorun: Autorun = () =>
    ({
        stop() {
            // This is intentional
        },
    } as any);

export function setMeteorAutorun(autorun: Autorun) {
    meteorAutorun = autorun;
}

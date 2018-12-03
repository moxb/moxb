import { Bind } from '../bind/Bind';

export interface Action extends Bind {
    fire(): void;
    readonly pending: boolean;
}

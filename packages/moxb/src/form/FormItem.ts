import { Bind } from '../bind/Bind';

export interface FormItem extends Bind {
    readonly required?: boolean;
}

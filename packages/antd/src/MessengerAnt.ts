import { message } from 'antd';
import { Messenger } from '@moxb/moxb';

/**
 * This is an implementation of the Messenger service using Ant Design
 */
export class MessengerAnt implements Messenger {
    info = (text: string) => message.info(text);
    error = (text: string) => message.error(text);
    warning = (text: string) => message.warning(text);
    success = (text: string) => message.success(text);
    waiting = (text: string) => message.loading(text);
}

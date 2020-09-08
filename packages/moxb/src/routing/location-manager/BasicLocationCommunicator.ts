/**
 * This is a naive implementation of the LocationCommunicator interface,
 * based on window.confirm.
 *
 * Since window.confirm doesn't support canceling messages,
 * all we can do is
 */
import { LocationCommunicator } from './LocationCommunicator';

export class BasicLocationCommunicator implements LocationCommunicator {
    protected currentQuestion: string | undefined;
    protected currentResolve: undefined | ((value: boolean) => void);

    confirmLeave(questions: string[]): Promise<boolean> {
        if (this.currentQuestion) {
            this.revokeCurrentQuestion();
        }
        this.currentQuestion = questions.join(', ');
        // console.log('Asking a question', this.currentQuestion);
        return new Promise<boolean>((resolve) => {
            this.currentResolve = resolve;
            const decision = window.confirm(this.currentQuestion);
            if (decision) {
                // console.log('Delivering positive answer');
                this.currentQuestion = undefined;
                resolve(true);
            } else {
                // console.log('Delivering negative answer');
                this.currentQuestion = undefined;
                resolve(false);
            }
        });
    }

    revokeCurrentQuestion() {
        if (!this.currentQuestion) {
            // console.log('No question to revoke.');
            return;
        }
        // Unfortunately, it's impossible to revoke a window.confirm question
        console.log('Should revoke question');
        this.currentQuestion = undefined;
        this.currentResolve!(false);
    }

    isActive() {
        return !!this.currentQuestion;
    }
}

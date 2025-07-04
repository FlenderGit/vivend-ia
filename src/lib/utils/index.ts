export {
    timestampToHour
} from './date';

export {
    authenticateUser
} from './auth';

export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
import { fetch, addTask } from 'domain-task';
import { actionCreators as ac } from './actions';
import { reducer as r } from './reducers';

export interface BoardState {
    notes: Array<StickyNote>
}

export interface StickyNote {
    id: number,
    title: string,
    dueDate: Date,
    priorityLevel: string,
    tasks: Array<any>
}

export const actionCreators: any = ac;
export const reducer: any = r;
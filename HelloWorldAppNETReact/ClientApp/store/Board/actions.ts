import { AppThunkAction } from '../';
import { fetch, addTask } from 'domain-task';
import axios from 'axios';

interface GetAllNotesAction {
    type: 'GET_ALL_NOTES';
    payload: any;
}

interface GetTasksAction {
    type: 'GET_TASKS';
    payload: any;
}

interface CreateNewNoteAction {
    type: 'CREATE_NEW_NOTE';
    payload: any;
}

interface SetErrorAction {
    type: 'SET_ERROR';
    payload: any;
}

export type KnownAction = GetAllNotesAction | GetTasksAction | SetErrorAction | CreateNewNoteAction;

// ACTION CREATORS
export const actionCreators = {
    getAllNotes: (date: any): AppThunkAction<KnownAction> => (dispatch, getState) => {

        axios.get('/api/HelloWorld/GetNotes')
            .then(res => {
                if (res && res.status === 200) {
                    dispatch({ type: 'GET_ALL_NOTES', payload: res.data });
                } else {
                    console.log('ERROR:: ', res.statusText);
                }
                
            });

        //
    },
    getTasks: (stickyNoteId: any): AppThunkAction<KnownAction> => (dispatch, getState) => {

        axios.get(`/api/HelloWorld/GetTasks?stickyNoteId=${stickyNoteId}`)
            .then(res => {
                if (res && res.status === 200) {
                    //console.log(res)
                    dispatch({ type: 'GET_TASKS', payload: res.data });
                } else {
                    console.log('ERROR:: ', res.statusText);
                }
            });
        
    },
    createNewNote: (date: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        var newNote = {
            title: 'Untitled',
            priorityLevel: 'low',
            tasks: [
                { description: 'Add task' }
            ]
        };
        dispatch({ type: 'CREATE_NEW_NOTE', payload: newNote });
        //save in DB
    },
};
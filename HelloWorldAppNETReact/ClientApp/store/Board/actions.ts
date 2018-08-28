import { AppThunkAction } from '../';
import { fetch, addTask } from 'domain-task';
import axios from 'axios';
import { StickyNote } from '.';

interface GetAllNotesAction {
    type: 'GET_ALL_NOTES';
    payload: any;
}

interface GetTasksAction {
    type: 'GET_TASKS';
    payload: any;
}

interface SaveNewNoteAction {
    type: 'SAVE_NEW_NOTE';
    payload: any;
}

interface UpdateTaskAction {
    type: 'UPDATE_TASK';
    payload: any;
}

interface SetIsEditableNoteOpenAction {
    type: 'TOGGLE_EDITABLE_NOTE';
    payload: any;
}

interface DeleteNoteAction {
    type: 'DELETE_NOTE';
    payload: any;
}

interface SetViewAction {
    type: 'SET_VIEW';
    payload: any;
}

interface SetAsArchived {
    type: 'SET_ARCHIVED';
    payload: any;
}

interface SetErrorAction {
    type: 'SET_ERROR';
    payload: any;
}

export type KnownAction = GetAllNotesAction | GetTasksAction | SetErrorAction | SaveNewNoteAction | SetIsEditableNoteOpenAction
    | UpdateTaskAction | DeleteNoteAction | SetViewAction | SetAsArchived;

// ACTION CREATORS
export const actionCreators = {
    getAllNotes: (view: any): AppThunkAction<KnownAction> => (dispatch, getState) => {

        axios.get('/api/HelloWorld/GetNotes?view=' + view)
            .then(res => {
                if (res && res.status === 200) {
                    console.log(res.data);
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
                    
                    const tasks = res.data;

                    const payloadNoteId = tasks[0] && tasks[0].stickyNoteId;
                    let newNotes;
                    if (payloadNoteId) {
                        newNotes = getState().board.notes.map(note => {
                            var noteObj = { ...note };

                            if (noteObj.id == payloadNoteId) {
                                noteObj.tasks = tasks;
                            }
                            return noteObj;
                        })
                    } else {
                        newNotes = getState().board.notes;
                    }
                    dispatch({ type: 'GET_TASKS', payload: newNotes });
                } else {
                    console.log('ERROR:: ', res.statusText);
                }
            });
        
    },
    saveNewNote: (newNote: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!newNote) {
            return;
        }

        const newTasks = newNote.tasks.map((task: any) => {
            return { description: task }
        })
        newNote.task = newTasks;
        newNote.dueDate = getState().board.date;
        newNote.type = 'todo';

        console.log(newNote)
        axios.post('/api/HelloWorld/SaveNewNote', newNote)
            .then(res => {
                console.log(res)
                if (res && res.status !== 200) {
                    throw Error;
                }
                newNote.id = res.data;
                newNote.origin = 'Web app';
                const newNoteDisplay = { ...newNote, tasks: newNote.task }
                dispatch({ type: 'SAVE_NEW_NOTE', payload: newNoteDisplay });
                //close the editable note and toggle button
                dispatch({ type: 'TOGGLE_EDITABLE_NOTE', payload: false });
            })
            .catch(error => {
                console.log(error)
            });
        //save in DB
    },
    updateTask: (task: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        console.log(task);
        axios.post('/api/HelloWorld/UpdateTask', task)
            .then(res => {
                console.log(res);
                if (res && res.status !== 200) {
                    throw Error;
                }   
                const updatedTask = res.data;
                const payloadNoteId = updatedTask && updatedTask.stickyNoteId;
                let newNotes;
                if (payloadNoteId) {
                    newNotes = getState().board.notes.map(note => {
                        var noteObj = { ...note };

                        if (noteObj.id == payloadNoteId) {
                            let newTasks = noteObj.tasks.map(task => {
                                var taskObj = { ...task };
                                if (updatedTask.id == taskObj.id) {
                                    return updatedTask;
                                }
                                return taskObj;
                            })
                            noteObj.tasks = newTasks;
                        }
                        return noteObj;
                    })
                }
                console.log(newNotes)
                dispatch({ type: 'UPDATE_TASK', payload: newNotes });
            })
            .catch(error => {
                console.log(error)
            });
    },
    toggleEditableNote: (newState: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'TOGGLE_EDITABLE_NOTE', payload: newState });
    },
    deleteNote: (note: any): AppThunkAction<KnownAction> => (dispatch, getState) => {
        axios.post('/api/HelloWorld/DeleteNote', note)
            .then(res => {
                if (res && res.status !== 200) {
                    throw Error;
                }
                // Update Notes State
                let newNotes = getState().board.notes.filter(n => {
                    if (note.id != n.id) {
                        return n;
                    }
                });

                dispatch({ type: 'DELETE_NOTE', payload: newNotes });
            })
            .catch(error => {
                console.log(error)
            });
    },
    setView: (view: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SET_VIEW', payload: view });
    },
    setAsArchived: (note: any): AppThunkAction<KnownAction> => (dispatch, getState) => {

        axios.post('/api/HelloWorld/SetAsArchived', note)
            .then(res => {
                if (res && res.status !== 200) {
                    throw Error;
                }
                let newNotes = getState().board.notes.filter(n => {
                    if (note.id != n.id) {
                        return n;
                    }
                });

                dispatch({ type: 'SET_ARCHIVED', payload: newNotes });
            })
            .catch(error => {
                console.log(error)
            });
    },
};
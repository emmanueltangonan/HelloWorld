import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from '../';
import { BoardState } from './';
import { KnownAction } from './actions';

const unloadedState: BoardState = {
    notes: [],
    date: new Date(),
    isEditableNoteOpen: false,
};

export const reducer: Reducer<BoardState> = (state: BoardState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'GET_ALL_NOTES':
            return {
                ...state,
                notes: action.payload,
            };
        case 'GET_TASKS':
            const payloadNoteId = action.payload[0] && action.payload[0].stickyNoteId;
            let newNotes;
            if (payloadNoteId) {
                newNotes = state.notes.map(note => {
                    var noteObj = { ...note };

                    if (noteObj.id == payloadNoteId) {
                        noteObj.tasks = action.payload;
                    }
                    return noteObj;
                })
            } else {
                newNotes = state.notes;
            }
            
            return {
                ...state,
                notes: newNotes,
            };
        case 'SAVE_NEW_NOTE':
            return {
                ...state,
                notes: [...state.notes, action.payload]
            };
        case 'TOGGLE_EDITABLE_NOTE':
            return {
                ...state,
                isEditableNoteOpen: action.payload,
            };
        case 'UPDATE_TASK':
            return {
                ...state,
                notes: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
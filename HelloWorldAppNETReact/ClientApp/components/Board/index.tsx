import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';
import StickyNote from '../StickyNote';

type BoardProps =
    BoardState.BoardState       
    & typeof BoardState.actionCreators      
    & RouteComponentProps<{}>; 

class Board extends React.Component<BoardProps, {}> {

    constructor(props: any) {
        super(props)
        this.createNewNote = this.createNewNote.bind(this)
    }

    componentDidMount() {
        this.props.getAllNotes();
    }

    createNewNote() {
        this.props.createNewNote();
    }

    public render() {
        const { notes } = this.props;
        console.log(notes)
        return (
            <div className="board">
                <div className="add-btn" onClick={this.createNewNote} >New Note</div>
                <div className="notes-container">
                    {notes && 
                        notes.map((note: any) => (
                            <StickyNote key={note.id} note={note}/>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators                 
)(Board) as typeof Board;
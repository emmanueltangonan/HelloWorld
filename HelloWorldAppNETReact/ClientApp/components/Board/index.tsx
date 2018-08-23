import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';
import StickyNote from '../StickyNote';
import Draggable from 'react-draggable';
import EditableNote from '../EditableNote';

type BoardProps =
    BoardState.BoardState       
    & typeof BoardState.actionCreators      
    & RouteComponentProps<{}>; 

class Board extends React.Component<BoardProps, any> {

    constructor(props: any) {
        super(props)
        this.handleButton = this.handleButton.bind(this)
        this.getDisplay = this.getDisplay.bind(this)

        this.state = {
            newNoteOpen: false,
        }
    }

    componentDidMount() {
        this.props.getAllNotes();
    }

    handleButton() {
        //this.props.createNewNote();
        const { newNoteOpen } = this.state;
        this.setState({
            newNoteOpen: !newNoteOpen
        })
    }

    getDisplay() {
        const { newNoteOpen } = this.state;
        return newNoteOpen ? {} : { display: 'none'};
    }

    public render() {
        const { notes } = this.props;
        const { newNoteOpen } = this.state;
        console.log(notes)
        return (
            <div className="board">
                <div className="add-btn" onClick={this.handleButton} >{newNoteOpen ? 'Cancel' : 'New'}</div>
                <EditableNote display={ this.getDisplay() } />
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
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';
import StickyNote from '../StickyNote';
import Draggable from 'react-draggable';
import EditableNote from '../EditableNote';
import Header from '../Header';

type BoardProps =
    BoardState.BoardState       
    & typeof BoardState.actionCreators      
    & RouteComponentProps<{}>; 

class Board extends React.Component<BoardProps, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            windowHeight: null
        }
        this.handleButton = this.handleButton.bind(this)
        this.getDisplay = this.getDisplay.bind(this)
    }

    componentDidMount() {
        this.setState({
            windowHeight: window.innerHeight
        });
        this.props.getAllNotes();
    }

    handleButton() {
        //this.props.createNewNote();
        const { isEditableNoteOpen } = this.props;
        this.props.toggleEditableNote(!isEditableNoteOpen);
    }

    getDisplay() {
        const { isEditableNoteOpen } = this.props;
        return isEditableNoteOpen ? {} : { display: 'none'};
    }

    public render() {
        const { notes, isEditableNoteOpen } = this.props;
        const { windowHeight } = this.state;
        
        return (
            <div className="board" style={{ height: windowHeight }}>
                <Header />
                <div className="add-btn" onClick={this.handleButton} >{isEditableNoteOpen ? 'Cancel' : 'New'}</div>
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
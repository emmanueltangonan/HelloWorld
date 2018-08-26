import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Draggable from 'react-draggable';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';
import axios from 'axios';
import BulletTask from '../BulletTask';
import { PriorityColor, PriorityLevel } from '../../constants/constants';

type BoardProps =
    BoardState.BoardState
    & typeof BoardState.actionCreators
    & RouteComponentProps<{}>;

const style = {
    priorityLow: {
        backgroundColor: PriorityColor.PRIORITY_LOW
    },
    priorityMed: {
        backgroundColor: PriorityColor.PRIORITY_MED
    },
    priorityHigh: {
        backgroundColor: PriorityColor.PRIORITY_HIGH
    },
    complete: {
        backgroundColor: 'lightgreen'
    }
}

class StickyNote extends React.Component<BoardProps, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            isNoteHovered: false,
            confirmDeleteVisible: false,
        }

        this.getNoteBackGroundColor = this.getNoteBackGroundColor.bind(this);
        this.getPriorityColor = this.getPriorityColor.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.setIsNoteHoveredTrue = this.setIsNoteHoveredTrue.bind(this);
        this.setIsNoteHoveredFalse = this.setIsNoteHoveredFalse.bind(this);
        this.showNoteContent = this.showNoteContent.bind(this);
        this.handleDeleteConfirmed = this.handleDeleteConfirmed.bind(this);
        this.handleDeleteCancelled = this.handleDeleteCancelled.bind(this);
    }

    componentDidMount() {
        const { note } = this.props;
        if (note && note.id) {
            this.props.getTasks(note.id);
        }
    }

    getNoteBackGroundColor() {
        const { note } = this.props;
        if (note && note.tasks) {
            const unfinishedTasks = note.tasks.filter((task: any) => {
                return !task.isDone;
            });
            
            let isComplete = unfinishedTasks && unfinishedTasks.length == 0;
            
            if (isComplete) {
                return style.complete;
            } else {
                return this.getPriorityColor(note);
            }
        }
    }

    getPriorityColor(note: any) {
        let color;
        if (note.priorityLevel == PriorityLevel.PRIORITY_LOW) {
            color = style.priorityLow;
        } else if (note.priorityLevel == PriorityLevel.PRIORITY_MED) {
            color = style.priorityMed;
        } else if (note.priorityLevel == PriorityLevel.PRIORITY_HIGH) {
            color = style.priorityHigh;
        }
        return color;
    }

    handleDeleteButton() {
        this.setState({
            confirmDeleteVisible: true
        })
    }

    setIsNoteHoveredTrue() {
        this.setState({
            isNoteHovered: true
        });
    }

    setIsNoteHoveredFalse() {
        this.setState({
            isNoteHovered: false
        });
    }

    handleDeleteConfirmed() {
        const { note } = this.props;
        this.props.deleteNote(note);
    }

    handleDeleteCancelled() {
        this.setState({
            confirmDeleteVisible: false
        })
    }

    showNoteContent() {
        const { note } = this.props;
        const noteBG = this.getNoteBackGroundColor();
        const { isNoteHovered, confirmDeleteVisible } = this.state;
        if (confirmDeleteVisible) {
            // show delete confirmation
            return (
                <div
                    className="sticky-note"
                    style={noteBG}
                >
                    <div className="confirm-delete">
                        <div className="col-sm-12 confirm-delete-msg"><span>Delete note?</span></div>
                        <div className="col-sm-12 confirm-delete-btn-holder">
                            <button className="btn" onClick={this.handleDeleteConfirmed}>
                                Delete
                            </button>
                            <button className="btn" onClick={this.handleDeleteCancelled}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
        } else {
            // show real note content
            return (
                    <div
                        className="sticky-note"
                        style={noteBG}
                        onMouseEnter={this.setIsNoteHoveredTrue}
                        onMouseOver={this.setIsNoteHoveredTrue} 
                        onMouseLeave= {this.setIsNoteHoveredFalse}
                    >
                        <div
                            className="delete-btn"
                            onClick={this.handleDeleteButton}
                            style={{ opacity: isNoteHovered ? 1 : 0 }}
                            title="Delete note"
                        >
                            <i className="fa fa-times"></i>
                        </div>
                        <div className="col-sm-12">
                            <div className="pull-right">
                                Priority: {note.priorityLevel}
                                &nbsp;
                            <span className="dot" style={this.getPriorityColor(note)}></span>
                            </div>
                        </div>
                        <div className="col-sm-12 sticky-note-title"> <strong>{note.title}</strong></div>
                        <div className="">
                            {note.tasks &&
                                note.tasks.map((task: any) => (
                                    <BulletTask key={task.id} task={task} />
                                ))
                            }
                        </div>
                    </div>
            )
        } 
    }
 
    public render() {
        const { note } = this.props;
        const noteBG = this.getNoteBackGroundColor();
        return (
            (!note || !noteBG) ? null :
            <Draggable>
                {this.showNoteContent()}
            </Draggable>
            
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators
)(StickyNote) as typeof StickyNote;
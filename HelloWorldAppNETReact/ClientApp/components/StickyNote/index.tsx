import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Draggable from 'react-draggable';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';
import Moment from 'react-moment';
import BulletTask from '../BulletTask';
import { PriorityColor, PriorityLevel } from '../../constants/constants';
import Options from '../MiniComponents/Options';
import ConfirmAction from '../MiniComponents/ConfirmAction';

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
    completed: {
        backgroundColor: 'lightgreen'
    }
}

class StickyNote extends React.Component<BoardProps, any> {
    optionsDivRef: any;
    constructor(props: any) {
        super(props)
        this.state = {
            isNoteHovered: false,
            confirmDeleteVisible: false,
            optionsVisible: false,
            viewDetailsVisible: false,
            confirmArchiveVisible: false,
            isNoteCompleted: false,
        }

        this.getNoteBackGroundColor = this.getNoteBackGroundColor.bind(this);
        this.getPriorityColor = this.getPriorityColor.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.handleOptionsButton = this.handleOptionsButton.bind(this);
        this.setIsNoteHoveredTrue = this.setIsNoteHoveredTrue.bind(this);
        this.setIsNoteHoveredFalse = this.setIsNoteHoveredFalse.bind(this);
        this.showNoteContent = this.showNoteContent.bind(this);
        this.handleDeleteConfirmed = this.handleDeleteConfirmed.bind(this);
        this.handleDeleteCancelled = this.handleDeleteCancelled.bind(this);
        this.setOptionsDivRef = this.setOptionsDivRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setViewDetailsVisible = this.setViewDetailsVisible.bind(this);
        this.handleCloseButton = this.handleCloseButton.bind(this);
        this.setArchiveConfirmVisible = this.setArchiveConfirmVisible.bind(this);
        this.handleArchiveCancelled = this.handleArchiveCancelled.bind(this);
        this.handleArchiveConfirmed = this.handleArchiveConfirmed.bind(this);
        this.getIsNoteCompleted = this.getIsNoteCompleted.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        const { note } = this.props;
        if (note && note.id) {
            this.props.getTasks(note.id);
        }
    }

    componentDidUpdate() {
        this.getIsNoteCompleted();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setOptionsDivRef(node: any) {
        this.optionsDivRef = node;
    }

    handleClickOutside(event: any) {
        if (this.optionsDivRef && !this.optionsDivRef.contains(event.target)) {
            this.setState({ optionsVisible: false });
        }
    }

    getNoteBackGroundColor() {
        const { note } = this.props;
        const { isNoteCompleted } = this.state;
        if (note && note.tasks) {
            //const unfinishedTasks = note.tasks.filter((task: any) => {
            //    return !task.isDone;
            //});

            //let isCompleted = unfinishedTasks && unfinishedTasks.length == 0;

            if (isNoteCompleted) {
                return style.completed;
            } else {
                return this.getPriorityColor(note);
            }
        }
    }

    getIsNoteCompleted() {
        const { note } = this.props;
        const { isNoteCompleted } = this.state;
        if (note && note.tasks) {
            let isCompleted;
            if (note.tasks.length == 0) {
                isCompleted = true;
            } else {
                const unfinishedTasks = note.tasks.filter((task: any) => {
                    return !task.isDone;
                });

                isCompleted = unfinishedTasks && unfinishedTasks.length == 0;
            }
            
            if (isNoteCompleted != isCompleted) {
                this.setState({ isNoteCompleted: isCompleted });
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
        this.setState({ confirmDeleteVisible: true });
    }

    setIsNoteHoveredTrue() {
        this.setState({ isNoteHovered: true });
    }

    setIsNoteHoveredFalse() {
        this.setState({ isNoteHovered: false });
    }

    handleDeleteConfirmed() {
        const { note } = this.props;
        this.props.deleteNote(note);
    }

    handleDeleteCancelled() {
        this.setState({ confirmDeleteVisible: false });
    }

    handleOptionsButton() {
        this.setState({ optionsVisible: true });
    }

    setViewDetailsVisible() {
        this.setState({ viewDetailsVisible: true });
    }

    handleCloseButton() {
        this.setState({
            viewDetailsVisible: false,
            optionsVisible: false
        });
    }
    handleArchiveConfirmed() {
        const { note } = this.props;
        this.props.setAsArchived(note);
    }

    setArchiveConfirmVisible() {
        this.setState({ confirmArchiveVisible: true });
    }

    handleArchiveCancelled() {
        this.setState({ confirmArchiveVisible: false, optionsVisible: false });
    }

    showNoteContent() {
        const { note } = this.props;
        const noteBG = this.getNoteBackGroundColor();
        const {
            isNoteHovered,
            confirmDeleteVisible,
            optionsVisible,
            viewDetailsVisible,
            confirmArchiveVisible,
            isNoteCompleted
        } = this.state;
        
        if (confirmDeleteVisible) {
            // show delete confirmation
            return (
                <div
                    className="sticky-note"
                    style={noteBG}
                >
                    <ConfirmAction
                        leftButtonText="Delete"
                        rightButtonText="Cancel"
                        leftButtonFunction={this.handleDeleteConfirmed}
                        rightButtonFunction={this.handleDeleteCancelled}
                        warningMsg="Delete note?"
                    />
                </div>
            )
        } else if (confirmArchiveVisible) {
            // show archive confirmation
            return (
                <div
                    className="sticky-note"
                    style={noteBG}
                >
                    <ConfirmAction
                        leftButtonText="Archive"
                        rightButtonText="Cancel"
                        leftButtonFunction={this.handleArchiveConfirmed}
                        rightButtonFunction={this.handleArchiveCancelled}
                        warningMsg= "Add note to archive?"
                    />
                </div>
            )
        } else if (viewDetailsVisible) {
            return (
                <div
                    className="sticky-note"
                    style={noteBG}
                >   
                    <div
                        className="close-btn pull-right"
                        onClick={this.handleCloseButton}
                    >
                        <i className="fa fa-times"></i>
                    </div>
                    <div className="note-details">
                        <div className="col-sm-12">
                            <strong><span>Date created:</span></strong>
                            &nbsp;
                            <p>
                                <Moment
                                    date={note.creationDate}
                                    format="DD MMM YYYY HH:mm:SS"
                                />
                            </p>
                        </div>
                        <div className="col-sm-12">
                            <strong><span>Created from:</span></strong>
                            &nbsp;<p>{note.origin}</p></div>
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
                            className="options-btn"
                            onClick={this.handleOptionsButton}
                            style={{ opacity: isNoteHovered ? 1 : 0 }}
                            title="Options"
                        >
                            <i className="fa fa-bars"></i>
                        </div>
                        <Options
                            setOptionsDivRef={this.setOptionsDivRef}
                            optionsVisible={optionsVisible}
                            setViewDetailsVisible={this.setViewDetailsVisible}
                            setArchiveConfirmVisible={this.setArchiveConfirmVisible}
                            isNoteCompleted={isNoteCompleted}
                        />
                       
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
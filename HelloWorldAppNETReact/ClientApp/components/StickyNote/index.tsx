import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Draggable from 'react-draggable';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';
import axios from 'axios';
import BulletTask from '../BulletTask';

type BoardProps =
    BoardState.BoardState
    & typeof BoardState.actionCreators
    & RouteComponentProps<{}>;

class StickyNote extends React.Component<BoardProps, {}> {

    constructor(props: any) {
        super(props)
        this.renderFontAwesomeIcon = this.renderFontAwesomeIcon.bind(this);
    }

    componentDidMount() {
        const { note } = this.props;
        if (note && note.id) {
            this.props.getTasks(note.id);
        }
    }

    renderFontAwesomeIcon(task: any) {
        if (task.isDone) {
            return <i className="fa fa-check" style={{ fontSize: '16px' }}>&nbsp;</i>
        }
        //else if (task.isCancelled) {
        //    return <i className="fa fa-times" style={{ fontSize: '15px' }}>&nbsp;</i>
        //}
        else {
            return <i className="fa fa-circle">&ensp;</i>
        }
    }



    //editTaskDesc(task: any) {
    //    const { note } = this.props;
    //    let newTasks = note.tasks.map((task: any) => {
    //        var taskObj = { ...task };

    //        if (noteObj.id == payloadNoteId) {
    //            noteObj.tasks = action.payload;
    //        }
    //    });
    //    let newNote = {
    //        ...note, tasks: 
    //    }
    //}

    public render() {
        const { note } = this.props;
        return (
            !note ? null :
            <Draggable>
                <div className="sticky-note">
                    <div className="col-sm-12">
                        <div className="pull-right"> Priority: {note.priorityLevel} </div>
                    </div>
                    <div className="col-sm-12 sticky-note-title"> <strong>{note.title}</strong> </div>
                    <div className="col-sm-12">
                        {note.tasks &&
                            note.tasks.map((task: any) => (
                                <div key={task.id} className="saved-task sticky-note-task">
                                    {this.renderFontAwesomeIcon(task)}
                                    <BulletTask task={task} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Draggable>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators
)(StickyNote) as typeof StickyNote;
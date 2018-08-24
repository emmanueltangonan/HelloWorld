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
    }

    componentDidMount() {
        const { note } = this.props;
        if (note && note.id) {
            this.props.getTasks(note.id);
        }
    }

 
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
                    <div className="">
                        {note.tasks &&
                            note.tasks.map((task: any) => (
                                <BulletTask task={task}/>
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
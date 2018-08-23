import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Draggable from 'react-draggable';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';
import axios from 'axios';

type BoardProps =
    BoardState.BoardState
    & typeof BoardState.actionCreators
    & RouteComponentProps<{}>;

class EditableNote extends React.Component<BoardProps, any> {
    newTaskInput: any;
    constructor(props: any) {
        super(props)
        this.state = {
            title: 'Untitled',
            priorityLevel: 'low',
            tasks: ['Add task'],
        }
        this.handleMinus = this.handleMinus.bind(this);
        this.focusNewTaskInput = this.focusNewTaskInput.bind(this);
    }

    componentDidMount() {

    }

    handleMinus(desc: string) {
        const { tasks } = this.state;
        let newTasks = tasks.filter((task: any) => {
            task != desc;
        })
        this.setState({
            tasks: newTasks
        });
    }

    focusNewTaskInput() {
        this.newTaskInput.focus();
    }
    
    public render() {
        const { display } = this.props;
        const { title, priorityLevel, tasks } = this.state;
        return (
            <div className="new-note" style={display}>
                <div className="col-sm-12">
                    <div className="pull-right"> Priority: {priorityLevel} </div>
                </div>

                <div className="col-sm-12">
                    <strong><input className="title" type="text" value={ title }/></strong>
                </div>
                <div className="col-sm-12">
                    {   tasks.map((desc: any) => (
                        <div className="edit-task sticky-note-task">
                            <i className="fa fa-minus" onClick={() => this.handleMinus(desc)} >&ensp;</i>
                                    <span className="task-desc">
                                        {desc}
                                    </span>
                            </div>
                        ))
                    }
                    <div className="edit-task sticky-note-task">
                        <i className="fa fa-plus" onClick={this.focusNewTaskInput} >&ensp;</i>
                        <span>
                            <input className="task"
                                type="text"
                                ref={(input) => this.newTaskInput = input}
                            />
                        </span>
                    </div>
                </div>
                
                    
                <div className="note-footer">
                    <button className="note-save-btn pull-right"> Save </button>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators
)(EditableNote) as typeof EditableNote;
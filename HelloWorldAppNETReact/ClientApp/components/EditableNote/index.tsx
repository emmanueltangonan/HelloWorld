import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Draggable from 'react-draggable';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';
import axios from 'axios';
import Radium from 'radium';
import { goBack } from 'react-router-redux';
import { PriorityLevel, PriorityColor } from '../../constants/constants';

type BoardProps =
    BoardState.BoardState
    & typeof BoardState.actionCreators
    & RouteComponentProps<{}>;

const initialState = {
    title: '',
    priorityLevel: PriorityLevel.PRIORITY_LOW,
    tasks: [],
}

class EditableNote extends React.Component<BoardProps, any> {
    newTaskInput: any;
    constructor(props: any) {
        super(props)
        this.state = initialState;
        this.handleMinus = this.handleMinus.bind(this);
        this.handlePlus = this.handlePlus.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onPrioritySelectChange = this.onPrioritySelectChange.bind(this);
        this.getProperStyle = this.getProperStyle.bind(this);
    }

    componentDidMount() {

    }

    handleMinus(index: number) {
        const { tasks } = this.state;
        let newTasks = tasks.slice(0, index).concat(tasks.slice(index + 1, tasks.length))
        console.log(newTasks)
        this.setState({
            tasks: newTasks
        });
    }

    handlePlus() {
        const { tasks } = this.state;
        const input = this.newTaskInput;
        //console.log(input.value)
        if (input && input.value.trim()) {
            this.setState({
                tasks: [...tasks, input.value]
            });
            input.value = '';
        }
        this.newTaskInput.focus();
    }

    handleEnter(e: any) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.handlePlus();
        }
    }

    handleSave() {
        const {
            title,
            priorityLevel,
            tasks
        } = this.state;
        const newNote = {
            title,
            priorityLevel,
            tasks
        }
        this.props.saveNewNote(newNote);
        this.setState(initialState);
    }

    onTitleChange(e: any) {
        const title = e.target.value;

        this.setState({
            title: title
        });
    }

    onPrioritySelectChange(e: any) {
        const priorityLevel = e.target.value;
        this.setState({ priorityLevel });
    }

    getProperStyle() {
        const { display } = this.props;
        const { priorityLevel } = this.state;
        const backgroundColor = priorityLevel == PriorityLevel.PRIORITY_LOW
            ? PriorityColor.PRIORITY_LOW : priorityLevel == PriorityLevel.PRIORITY_MED
                ? PriorityColor.PRIORITY_MED : PriorityColor.PRIORITY_HIGH;
        return {
            ...display,
            backgroundColor
        }
    }

    public render() {
        const { title, priorityLevel, tasks } = this.state;
        return (
            <div className="new-note" style={this.getProperStyle()}>
                <div className="col-sm-12">
                    <div className="pull-right"> Priority:
                        <select
                            value={priorityLevel}
                            className="editable-priority-select"
                            onChange={this.onPrioritySelectChange}
                        >
                            <option value={PriorityLevel.PRIORITY_LOW}>{PriorityLevel.PRIORITY_LOW}</option>
                            <option value={PriorityLevel.PRIORITY_MED}>{PriorityLevel.PRIORITY_MED}</option>
                            <option value={PriorityLevel.PRIORITY_HIGH}>{PriorityLevel.PRIORITY_HIGH}</option>
                        </select>
                    </div>
                </div>

                <div className="col-sm-12">
                    <strong>
                        <input
                            className="title"
                            type="text"
                            value={title}
                            placeholder="Untitled"
                            onChange={this.onTitleChange}
                        />
                    </strong>
                </div>
                <div className="col-sm-12 editable-note-task-container">
                    {tasks.map((desc: any, i: number) => (
                        <div key={i} className="edit-task sticky-note-task col-sm-12">
                                <div className="col-sm-2">
                                    <i className="fa fa-minus" onClick={() => this.handleMinus(i)} title="Remove task">&ensp;</i>
                                </div>
                                <div className="col-sm-10 no-padding">
                                    <span className="task-desc">
                                        {desc}
                                    </span>
                                </div>
                            </div>
                        ))
                    }
                    <div className="edit-task sticky-note-task">
                        <div className="col-sm-2">
                            <i className="fa fa-plus" onClick={this.handlePlus} title="Add task">&ensp;</i>
                        </div>
                        <div className="col-sm-10 no-padding">
                            <span>
                                <input className="task"
                                    placeholder="Add task"
                                    type="text"
                                    ref={(input) => this.newTaskInput = input}
                                    onKeyPress={this.handleEnter}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                
                    
                <div className="note-footer">
                    <button
                        className="btn note-save-btn pull-right"
                        onClick={this.handleSave}
                        disabled={tasks.length == 0 ? true : false}
                    >
                        Save
                    </button>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators
)(Radium(EditableNote)) as typeof EditableNote;
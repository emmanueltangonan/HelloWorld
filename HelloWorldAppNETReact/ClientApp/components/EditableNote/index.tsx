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
            tasks: [],
        }
        this.handleMinus = this.handleMinus.bind(this);
        this.handlePlus = this.handlePlus.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
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
        this.setState({
            title: 'Untitled',
            priorityLevel: 'low',
            tasks: [],
        });
    }

    onTitleChange(e:any) {
        const title = e.target.value;
        
        this.setState({
            title: title
        });
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
                    <strong>
                        <input
                            className="title"
                            type="text"
                            value={title}
                            onChange={this.onTitleChange}
                        />
                    </strong>
                </div>
                <div className="col-sm-12 editable-note-task-container">
                    {tasks.map((desc: any, i: number) => (
                        <div key={i} className="edit-task sticky-note-task col-sm-12">
                                <div className="col-sm-2">
                                    <i className="fa fa-minus" onClick={() => this.handleMinus(i)} >&ensp;</i>
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
                            <i className="fa fa-plus" onClick={this.handlePlus} >&ensp;</i>
                        </div>
                        <div className="col-sm-10 no-padding">
                            <span>
                                <input className="task"
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
                        className="note-save-btn pull-right"
                        onClick={this.handleSave}
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
)(EditableNote) as typeof EditableNote;
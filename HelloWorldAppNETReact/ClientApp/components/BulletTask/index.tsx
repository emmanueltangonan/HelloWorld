﻿import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';
import Radium from 'radium';

type BoardProps =
    BoardState.BoardState
    & typeof BoardState.actionCreators
    & RouteComponentProps<{}>;

class BulletTask extends React.Component<BoardProps, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            isHovered: false,
        }
        this.renderUnHoveredFa = this.renderUnHoveredFa.bind(this);
        //this.renderHoveredFa = this.renderHoveredFa.bind(this);
        this.renderStyle = this.renderStyle.bind(this);
        //this.handleHover = this.handleHover.bind(this);
        this.handleTaskClick = this.handleTaskClick.bind(this);
    }

    componentDidMount() {

    }

    renderStyle(task: any) {
        if (task.isDone) {
            return { textDecoration: 'line-through' };
        } else {
            return {};
        }
    }

    //handleHover() {
    //    this.setState({
    //        isHovered: !this.state.isHovered,
    //    });

    //}

    handleTaskClick() {
        const { task, view } = this.props;
        if (view.toLowerCase() !== 'archive') {
            this.props.updateTask(task);
        }
    }

    renderUnHoveredFa(task: any) {
        if (task.isDone) {
            return <i className="fa fa-check" style={{ fontSize: '16px' }}>&nbsp;</i>
        } else {
            return <i className="fa fa-circle">&ensp;</i>
        }
    }

    //renderHoveredFa(task: any) {
    //    if (task.isDone) {
    //        return <i className="fa fa-circle">&ensp;</i>
    //    } else {
    //        return <i className="fa fa-check" style={{ fontSize: '16px' }}>&nbsp;</i>
    //    }
    //}

    public render() {
        const { isHovered } = this.state;
        const { task, view } = this.props;
        const styles = {
            noteTaskActive: {
                ':hover': {
                    //textDecoration: 'line-through',
                },
            },
            noteTaskDone: {
                textDecoration: 'line-through',
                ':hover': {
                    //textDecoration: 'none',
                },
            },
            noteArchived: {
                textDecoration: 'line-through',
                cursor: 'grab'
            }
        }
        
        return (
            !task ? null : 
            <div
                key={task.id} 
                className="saved-task sticky-note-task col-sm-12"
                title={task.isDone ? 'Mark as Not Done' : 'Mark as Done'}
            >
                <div 
                    className="col-sm-2 sticky-note-task-fa" 
                    onClick={this.handleTaskClick}
                    style={{cursor: view.toLowerCase() == 'archive' ? 'grab' : 'pointer'}}
                >
                        {this.renderUnHoveredFa(task)}
                </div>
                <div 
                    className="col-sm-10 no-padding task-desc-div"
                >
                    <span
                        className="task-desc"
                        onClick={this.handleTaskClick}
                            style={view.toLowerCase() == 'archive' ? styles.noteArchived : task.isDone ? styles.noteTaskDone : styles.noteTaskActive}
                    >
                        {task.description}
                    </span>
                    
                </div >
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators
) (Radium(BulletTask)) as typeof BulletTask;
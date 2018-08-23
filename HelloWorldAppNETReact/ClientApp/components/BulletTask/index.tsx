import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';

type BoardProps =
    BoardState.BoardState
    & typeof BoardState.actionCreators
    & RouteComponentProps<{}>;

class BulletTask extends React.Component<BoardProps, any> {

    constructor(props: any) {
        super(props)

        this.state = {
            editMode: false,
        }

        this.renderStyle = this.renderStyle.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.renderDescription = this.renderDescription.bind(this);
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

    handleOnClick() {
        this.setState({
            editMode: true,
        })
    }

    renderDescription(task: any, editMode: any) {
        if (editMode) {
            return (
                <span>
                    <input type="text" />
                </span>
            )
        } else {
            return (
                <span
                    className="task-desc"
                    style={this.renderStyle(task)}
                    onClick={this.handleOnClick}
                >
                    {task.description}
                </span>
            )
        }
        
    }

    public render() {
        const { task } = this.props;
        const { editMode } = this.state;
        return (
            this.renderDescription(task, editMode)
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators
)(BulletTask) as typeof BulletTask;
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
        this.renderStyle = this.renderStyle.bind(this);
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

    public render() {
        const { task } = this.props;
        console.log(task)
        return (
            <div >
                <span
                    className="task-desc"
                    style={this.renderStyle(task)}
                >
                    {task.description}
                </span>
                    
            </div >
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators
)(BulletTask) as typeof BulletTask;
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';

type BoardProps =
    BoardState.BoardState
    & typeof BoardState.actionCreators
    & RouteComponentProps<{}>;

class ConfirmAction extends React.Component<BoardProps, any> {

    constructor(props: any) {
        super(props)
    }

    public render() {
        const {
            leftButtonText,
            leftButtonFunction,
            rightButtonText,
            rightButtonFunction,
            warningMsg
        } = this.props;
        return (
            <div className="confirm-action">
                <div className="col-sm-12 confirm-action-msg"><span>{warningMsg}</span></div>
                <div className="col-sm-12 confirm-action-btn-holder">
                    <button className="btn" onClick={leftButtonFunction}>
                        {leftButtonText}
                    </button>
                    <button className="btn" onClick={rightButtonFunction}>
                        {rightButtonText}
                    </button>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators
)(ConfirmAction) as typeof ConfirmAction;
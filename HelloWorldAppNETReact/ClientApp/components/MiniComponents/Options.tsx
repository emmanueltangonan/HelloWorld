import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardState from '../../store/Board';

type BoardProps =
    BoardState.BoardState
    & typeof BoardState.actionCreators
    & RouteComponentProps<{}>;

class Options extends React.Component<BoardProps, any> {

    constructor(props: any) {
        super(props)
    }

    componentDidMount() {

    }
    
    public render() {
        const {
            optionsVisible,
            setOptionsDivRef,
            setViewDetailsVisible,
            setArchiveConfirmVisible,
            isNoteCompleted,
            view
        } = this.props;
        console.log(view)
        return (
            <div className="options-div"
                style={{ display: optionsVisible ? 'block' : 'none' }}
                ref={setOptionsDivRef}
            >
                <div className="col-sm-12" onClick={setViewDetailsVisible}>View Details</div>
                {
                    !isNoteCompleted || view.toLowerCase() == 'archive' ? null
                    : <div className="col-sm-12" onClick={setArchiveConfirmVisible}>Add to Archive</div>
                }
                
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators
)(Options) as typeof Options;
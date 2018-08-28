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

class Header extends React.Component<BoardProps, any> {

    constructor(props: any) {
        super(props)
    }
    
    public render() {
        const { handleSelectChange } = this.props;
        return (
            <div className="board-header">
                <div className="header-view-select">
                    <div className="form-group">
                        <select className="form-control" onChange={handleSelectChange}>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="ARCHIVE">ARCHIVED</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.board,
    BoardState.actionCreators
)(Header) as typeof Header;
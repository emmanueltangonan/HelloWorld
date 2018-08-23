import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Board from './Board';

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return (
            <div>
                <Board/>
            </div>
        )
    }
}

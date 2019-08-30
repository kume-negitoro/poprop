import React from 'react'
import { Bubble } from './Bubble'

export class SvgCanvas extends React.Component {
    public render(): JSX.Element {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="1000"
                height="1000"
            >
                <Bubble x={500} y={400} word={'アイデア'} />
            </svg>
        )
    }
}

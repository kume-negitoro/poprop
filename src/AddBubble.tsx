import React from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'

import { easeOutElastic } from './keyframes/easeInElastic'

export interface Props {
    x: number
    y: number
    parent: string
    onConfirm: (ev: ConfirmEvent, data: Props) => void
}

interface State {
    x: number
    y: number
    in: boolean
}

export interface ConfirmEvent {
    value: string
}

const G = styled.g`
    .bubble-enter {
        opacity: 0;
        transform: scale(0);
    }
    .bubble-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: opacity 800ms;
        animation: ${easeOutElastic} 800ms reverse;
    }
`

export class AddBubble extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = { ...props, in: false }
    }
    public componentDidMount(): void {
        this.setState({
            in: true,
        })
    }
    /* eslint @typescript-eslint/no-unused-vars: 0 */
    private handleClick(ev: React.MouseEvent): void {
        const text = prompt()
        if (text && this.props.onConfirm)
            this.props.onConfirm({ value: text }, this.props)
    }
    public render(): JSX.Element {
        return (
            <G transform={`translate(${this.props.x},${this.props.y})`}>
                <CSSTransition
                    classNames="bubble"
                    in={this.state.in}
                    timeout={1000}
                >
                    <circle
                        onClick={ev => this.handleClick(ev)}
                        r="50"
                        fill="pink"
                    />
                </CSSTransition>
                <CSSTransition
                    classNames="bubble"
                    in={this.state.in}
                    timeout={1000}
                >
                    <text
                        fill="black"
                        textAnchor="middle"
                        dominantBaseline="central"
                    >
                        +
                    </text>
                </CSSTransition>
            </G>
        )
    }
}

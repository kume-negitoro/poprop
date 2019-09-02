import React from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import { DraggableEventHandler, DraggableCore } from 'react-draggable'

import { easeOutElastic } from './keyframes/easeInElastic'

export interface Props {
    x: number
    y: number
    word: string
    key: number | string
    onDrag?: DraggableEventHandler
    onClick?: (ev: React.MouseEvent, data: Props) => void
    selected: boolean
}

interface State {
    in: boolean
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

export class Bubble extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = { in: false }
    }
    public componentDidMount(): void {
        this.setState({
            in: true,
        })
    }
    private handleClick(ev: React.MouseEvent): void {
        if (this.props.onClick) this.props.onClick(ev, this.props)
    }
    public render(): JSX.Element {
        return (
            <DraggableCore onDrag={this.props.onDrag}>
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
                            stroke="black"
                            strokeWidth={this.props.selected ? 2 : 0}
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
                            {this.props.word}
                        </text>
                    </CSSTransition>
                </G>
            </DraggableCore>
        )
    }
}

import React from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable'

import { easeOutElastic } from './keyframes/easeInElastic'

interface BubbleProps {
    x: number
    y: number
    word: string
}

interface BubbleState {
    x: number
    y: number
    word: string
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

export class Bubble extends React.Component<BubbleProps, BubbleState> {
    public constructor(props: BubbleProps) {
        super(props)
        this.state = { ...props, in: false }
    }
    public componentDidMount(): void {
        this.setState({
            in: true,
        })
    }
    private handleStart(ev: DraggableEvent, data: DraggableData): void {}
    public render(): JSX.Element {
        return (
            <Draggable
                defaultPosition={{ x: this.state.x, y: this.state.y }}
                onStart={(ev, data) => this.handleStart(ev, data)}
            >
                <G>
                    <CSSTransition
                        classNames="bubble"
                        in={this.state.in}
                        timeout={10000}
                    >
                        <circle r="50" fill="pink" />
                    </CSSTransition>
                    <CSSTransition
                        classNames="bubble"
                        in={this.state.in}
                        timeout={10000}
                    >
                        <text
                            fill="black"
                            textAnchor="middle"
                            dominantBaseline="central"
                        >
                            {this.state.word}
                        </text>
                    </CSSTransition>
                </G>
            </Draggable>
        )
    }
}

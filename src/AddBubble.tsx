import React from 'react'
import styled from 'styled-components'

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

const G = styled.g``

export class AddBubble extends React.Component<BubbleProps, BubbleState> {
    public constructor(props: BubbleProps) {
        super(props)
        this.state = { ...props, in: false }
    }
    private handleClick(ev: React.MouseEvent) {}
    public render(): JSX.Element {
        return (
            <G>
                <circle
                    onClick={ev => this.handleClick(ev)}
                    r="50"
                    fill="pink"
                />
                <text
                    fill="black"
                    textAnchor="middle"
                    dominantBaseline="central"
                >
                    {this.state.word}
                </text>
            </G>
        )
    }
}

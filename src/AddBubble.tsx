import React from 'react'
import styled from 'styled-components'

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

const G = styled.g``

export class AddBubble extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = { ...props, in: false }
    }
    /* eslint @typescript-eslint/no-unused-vars: 0 */
    private handleClick(ev: React.MouseEvent): void {
        const text = prompt()
        if (text && this.props.onConfirm)
            this.props.onConfirm({ value: text }, this.props)
    }
    public render(): JSX.Element {
        return (
            <G>
                <circle
                    onClick={ev => this.handleClick(ev)}
                    cx={this.props.x}
                    cy={this.props.y}
                    r="50"
                    fill="pink"
                />
                <text
                    x={this.props.x}
                    y={this.props.y}
                    fill="black"
                    textAnchor="middle"
                    dominantBaseline="central"
                >
                    +
                </text>
            </G>
        )
    }
}

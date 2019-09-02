import React from 'react'
import { DraggableEvent, DraggableData } from 'react-draggable'
import { Bubble, Props as BubbleProps } from './Bubble'
import { AddBubble, ConfirmEvent } from './AddBubble'

/* eslint @typescript-eslint/no-empty-interface: 0 */
export interface Props {}

export interface State {
    bubblesProps: Omit<BubbleProps, 'key' | 'onDrag'>[]
}

export class SvgCanvas extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = { bubblesProps: [] }
    }
    private handleScreenClick(ev: React.MouseEvent): void {
        this.setState(prev => ({
            bubblesProps: prev.bubblesProps.map(props => ({
                ...props,
                selected: false,
            })),
        }))
    }
    private handleComfirm(ev: ConfirmEvent): void {
        this.setState(prev => ({
            bubblesProps: [
                ...prev.bubblesProps,
                {
                    x: 200,
                    y: 200,
                    word: ev.value,
                    selected: false,
                },
            ],
        }))
    }
    private handleChildBubbleClick(
        ev: React.MouseEvent,
        data: BubbleProps,
        index: number
    ): void {
        ev.stopPropagation()
        this.setState(prev => ({
            bubblesProps: prev.bubblesProps.map((props, i) =>
                index === i
                    ? {
                          ...props,
                          selected: true,
                      }
                    : {
                          ...props,
                          selected: false,
                      }
            ),
        }))
    }
    private handleChildBubbleDrag(
        ev: DraggableEvent,
        data: DraggableData,
        index: number
    ): void {
        // propsはそのままセーブデータにできるようにする
        this.setState(prev => ({
            bubblesProps: prev.bubblesProps.map((props, i) =>
                index === i
                    ? {
                          ...props,
                          x: props.x + data.deltaX,
                          y: props.y + data.deltaY,
                      }
                    : props
            ),
        }))
    }
    public render(): JSX.Element {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="1000"
                height="1000"
                onClick={ev => this.handleScreenClick(ev)}
            >
                {this.state.bubblesProps.map((props, i) => (
                    <Bubble
                        key={i}
                        onClick={(ev, data) =>
                            this.handleChildBubbleClick(ev, data, i)
                        }
                        onDrag={(ev, data) =>
                            this.handleChildBubbleDrag(ev, data, i)
                        }
                        {...props}
                    />
                ))}
                <AddBubble
                    onConfirm={ev => this.handleComfirm(ev)}
                    x={100}
                    y={100}
                />
            </svg>
        )
    }
}

import React from 'react'
import { DraggableEvent, DraggableData } from 'react-draggable'
import { Bubble, Props as BubbleProps } from './Bubble'
import { AddBubble, ConfirmEvent, Props as AddBubbleProps } from './AddBubble'
import { parseAsModel, Model } from 'w2v-api'

/* eslint @typescript-eslint/no-empty-interface: 0 */
export interface Props {}

export interface State {
    childBubblesProps: Omit<BubbleProps, 'key' | 'onDrag'>[]
    suggestBubblesProps: Omit<BubbleProps, 'key' | 'onDrag'>[]
    suggestAddBubbleProp?: Omit<AddBubbleProps, 'onConfirm'>
}

export class SvgCanvas extends React.Component<Props, State> {
    private model: Promise<Model>
    public constructor(props: Props) {
        super(props)
        this.state = {
            childBubblesProps: [],
            suggestBubblesProps: [],
            suggestAddBubbleProp: {
                x: 200,
                y: 200,
                parent: '',
            },
        }
        this.model = fetch('ja.tsv')
            .then(res => res.text())
            .then(text => parseAsModel(text.trim()))
            /* eslint no-console: 0 */
            .then(model => (console.log('done'), model))
    }
    /* eslint @typescript-eslint/no-unused-vars: 0 */
    private handleScreenClick(ev: React.MouseEvent): void {
        this.setState(prev => ({
            suggestAddBubbleProp:
                this.state.childBubblesProps.length > 0
                    ? undefined
                    : prev.suggestAddBubbleProp,
            childBubblesProps: prev.childBubblesProps.map(props => ({
                ...props,
                active: true,
                selected: false,
            })),
            suggestBubblesProps: [],
        }))
    }
    private handleComfirm(ev: ConfirmEvent, data: AddBubbleProps): void {
        if (
            this.state.childBubblesProps
                .map(props => props.word)
                .includes(ev.value)
        ) {
            alert('既に同じ単語が存在するため追加できませんでした')
            return
        }
        this.setState(prev => ({
            suggestAddBubbleProp: undefined,
            childBubblesProps: [
                ...prev.childBubblesProps.map(props => ({
                    ...props,
                    children:
                        props.word === data.parent
                            ? [...props.children, ev.value]
                            : props.children,
                })),
                {
                    x: data.x,
                    y: data.y,
                    word: ev.value,
                    active: true,
                    selected: false,
                    parent: data.parent,
                    children: [],
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
        console.log(data)
        this.setState(prev => ({
            childBubblesProps: prev.childBubblesProps.map((props, i) =>
                index === i
                    ? {
                          ...props,
                          active: true,
                          selected: true,
                      }
                    : {
                          ...props,
                          active: false,
                          selected: false,
                      }
            ),
        }))

        // suggest
        this.model.then(model => {
            const target = this.state.childBubblesProps[index]
            console.time()
            const similars =
                model.mostSimilar(
                    [target.word],
                    5,
                    this.state.childBubblesProps.map(props => props.word)
                )[0] || []
            console.timeEnd()
            this.setState({
                suggestAddBubbleProp: {
                    x: target.x + 200,
                    y: target.y + 0,
                    parent: target.word,
                },
                suggestBubblesProps: similars.map((wv, i) => {
                    const d = (360 / 6) * (i + 1)
                    const x = target.x + 200 * Math.cos(d * (Math.PI / 180))
                    const y = target.y + 200 * Math.sin(d * (Math.PI / 180))
                    return {
                        x,
                        y,
                        word: wv.word,
                        fill: 'skyblue',
                        active: true,
                        selected: false,
                        parent: target.word,
                        children: [],
                    }
                }),
            })
        })
    }
    private handleChildBubbleDrag(
        ev: DraggableEvent,
        data: DraggableData,
        index: number
    ): void {
        // propsはそのままセーブデータにできるようにする
        this.setState(prev => ({
            childBubblesProps: prev.childBubblesProps.map((props, i) =>
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
    private handleSuggestBubbleClick(
        ev: React.MouseEvent,
        data: BubbleProps,
        index: number
    ): void {
        ev.stopPropagation()
        this.setState(prev => ({
            suggestAddBubbleProp: undefined,
            suggestBubblesProps: [],
            childBubblesProps: [
                ...prev.childBubblesProps.map(props => ({
                    ...props,
                    active: true,
                    selected: false,
                    children:
                        props.word === data.parent
                            ? [...props.children, data.word]
                            : props.children,
                })),
                {
                    x: data.x,
                    y: data.y,
                    word: data.word,
                    active: true,
                    selected: false,
                    parent: data.parent,
                    children: [],
                },
            ],
        }))
    }
    private getChildBubblePropsFromWord(
        word: string
    ): Omit<BubbleProps, 'key' | 'onDrag'> | undefined {
        return this.state.childBubblesProps.find(props => props.word === word)
    }
    private getAllLinesProps(
        root: Omit<BubbleProps, 'key' | 'onDrag'>,
        returns: { x1: number; y1: number; x2: number; y2: number }[] = []
    ): { x1: number; y1: number; x2: number; y2: number }[] {
        if (root.children.length === 0) return returns
        return root.children.flatMap(word => {
            const props = this.getChildBubblePropsFromWord(word) as BubbleProps
            const lprops = { x1: root.x, y1: root.y, x2: props.x, y2: props.y }
            return this.getAllLinesProps(props, [lprops, ...returns])
        })
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
                {this.state.childBubblesProps.length > 0 &&
                    this.getAllLinesProps(this.state.childBubblesProps[0]).map(
                        (props, i) => (
                            <line
                                key={i}
                                stroke="black"
                                x1={props.x1}
                                y1={props.y1}
                                x2={props.x2}
                                y2={props.y2}
                            />
                        )
                    )}
                {this.state.childBubblesProps.map((props, i) => (
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
                {this.state.suggestAddBubbleProp ? (
                    <AddBubble
                        onConfirm={(ev, data) => this.handleComfirm(ev, data)}
                        {...this.state.suggestAddBubbleProp}
                    />
                ) : null}
                {this.state.suggestBubblesProps.map((props, i) => (
                    <Bubble
                        key={i}
                        onClick={(ev, data) =>
                            this.handleSuggestBubbleClick(ev, data, i)
                        }
                        {...props}
                    />
                ))}
                {/* <AddBubble
                    onConfirm={ev => this.handleComfirm(ev)}
                    x={100}
                    y={100}
                /> */}
            </svg>
        )
    }
}

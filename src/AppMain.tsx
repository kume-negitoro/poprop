import React from 'react'
import styled from 'styled-components'
import { DraggableEvent, DraggableData } from 'react-draggable'
import { Bubble, Props as BubbleProps } from './Bubble'
import { AddBubble, ConfirmEvent, Props as AddBubbleProps } from './AddBubble'
import { parseAsModel, Model, WordVector, WordDist } from 'w2v-api'
import { AppMainHeader } from './AppMainHeader'
import { jsonp } from './utils/jsonp'

const canvasWidth = 3000
const canvasHeight = 3000

export interface ProjectData {
    projectName: string
    bubbles: {
        x: number
        y: number
        word: string
        parent: string
        children: string[]
    }[]
}

export interface Props {
    projectName: string
    wordsLength: number
    onExit: () => void
}

export interface State {
    projectName: string
    childBubblesProps: Omit<BubbleProps, 'key' | 'onDrag'>[]
    suggestBubblesProps: Omit<BubbleProps, 'key' | 'onDrag'>[]
    suggestAddBubbleProp?: Omit<AddBubbleProps, 'onConfirm'>
}

const Wrapper = styled.div`
    all: initial;
    margin-top: 64px;
    width: 100%;
    height: calc(100% - 64px);
    overflow: scroll;
    position: absolute;
    top: 0;
    left: 0;
`

const SVGWrapper = styled.div``

export class AppMain extends React.Component<Props, State> {
    private wrapperRef: React.RefObject<HTMLDivElement>
    private svgWrapperRef: React.RefObject<HTMLDivElement>
    private model: Promise<Model>

    public constructor(props: Props) {
        super(props)
        this.state = {
            projectName: props.projectName,
            childBubblesProps: [],
            suggestBubblesProps: [],
            suggestAddBubbleProp: {
                x: canvasWidth / 2,
                y: canvasHeight / 2,
                parent: '',
            },
        }
        console.log(this.state.projectName)
        ;(window as any).download = () => this.downloadSVG()
        ;(window as any).save = () => this.save()
        ;(window as any).restore = (projectName: string) =>
            this.restore(projectName)

        if (this.props.projectName === '') this.handleExit()
        this.wrapperRef = React.createRef()
        this.svgWrapperRef = React.createRef()
        this.model = fetch('ja.tsv')
            .then(res => res.text())
            .then(text => parseAsModel(text.trim()))
            /* eslint no-console: 0 */
            .then(model => (console.log('done'), model))
    }

    private reset(): void {
        this.setState({
            projectName: this.props.projectName,
            childBubblesProps: [],
            suggestBubblesProps: [],
            suggestAddBubbleProp: {
                x: canvasWidth / 2,
                y: canvasHeight / 2,
                parent: '',
            },
        })
    }

    public componentDidMount(): void {
        this.restore(this.props.projectName)
        const wrapper = this.wrapperRef.current
        if (wrapper) {
            console.log(canvasWidth, window.screen.width)
            wrapper.scrollTo(
                (canvasWidth - window.screen.width) / 2,
                (canvasHeight - (window.screen.height - 256)) / 2
            )
        }
    }

    public componentDidUpdate(prev: Props): void {
        // プロジェクトが切り替わったらリセットする
        if (this.props.projectName !== prev.projectName) {
            this.reset()
        }
    }

    public save(): void {
        const data: ProjectData = {
            projectName: this.props.projectName,
            bubbles: this.state.childBubblesProps.map(props => ({
                x: props.x,
                y: props.y,
                word: props.word,
                parent: props.parent,
                children: props.children,
            })),
        }

        const projects = (JSON.parse(
            localStorage.getItem('projects') || '{}'
        ) as unknown) as Record<string, ProjectData>

        projects[data.projectName] = data

        localStorage.setItem('projects', JSON.stringify(projects))
    }

    public restore(projectName: string): void {
        const projects = (JSON.parse(
            localStorage.getItem('projects') || '{}'
        ) as unknown) as Record<string, ProjectData>
        const project = projects[projectName]
        if (!project) return

        this.setState({
            suggestAddBubbleProp: undefined,
            childBubblesProps: project.bubbles.map(data => ({
                x: data.x,
                y: data.y,
                word: data.word,
                parent: data.parent,
                children: data.children,
                active: true,
                selected: false,
            })),
        })
    }

    // svgをダウンロードさせる
    public downloadSVG(): void {
        if (!this.svgWrapperRef.current) {
            return alert('正しくエクスポートが完了しませんでした')
        }
        const svg = this.svgWrapperRef.current.innerHTML
        const blob = new Blob([svg], { type: 'image/svg+xml' })
        const a = document.createElement('a')
        a.download = this.props.projectName + '.svg'
        a.href = URL.createObjectURL(blob)
        a.click()
    }

    private handleExport(): void {
        this.downloadSVG()
    }

    private handleSave(): void {
        this.save()
    }

    private handleExit(): void {
        this.props.onExit()
    }

    /* eslint @typescript-eslint/no-unused-vars: 0 */
    private handleScreenClick(ev: React.MouseEvent): void {
        // 何もないところをクリックで選択を解除し提案用の泡も消す
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
            return alert('既に同じ単語が存在するため追加できませんでした')
        }

        // 入力された文字列から泡を作り親子関係にする
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
        ev.stopPropagation() // handleScreenClickまで伝搬するのを防止する
        console.log(data)

        // クリックされた泡を選択状態にし、それ以外を選択解除する
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

        const target = this.state.childBubblesProps[index]
        // suggest
        this.model
            .then(model => {
                console.time()
                const similars = model.mostSimilar(
                    [target.word],
                    5,
                    this.state.childBubblesProps.map(props => props.word)
                )[0]
                console.timeEnd()
                if (similars) return similars

                return jsonp(
                    `https://script.google.com/macros/s/AKfycbxmmq1mcX_s84FUe21MsHK8-QYt199ZGB7Vh_8iuQ/exec?sentence=${target.word}`
                ).then((res: any) => {
                    if (res.Error) return []
                    const word = Object.entries<any>(res).sort(
                        (v1, v2) => v2[1] - v1[1]
                    )[0][0]
                    console.log(word)
                    return (
                        model.mostSimilar(
                            [word],
                            5,
                            this.state.childBubblesProps.map(
                                props => props.word
                            )
                        )[0] || []
                    )
                })
            })
            .then((similars: WordDist[]) => {
                // 提案用の泡を表示させる
                this.setState({
                    suggestAddBubbleProp: {
                        x: target.x + 200,
                        y: target.y + 0,
                        parent: target.word,
                    },
                    suggestBubblesProps: similars.map((wv, i) => {
                        const d = (360 / this.props.wordsLength) * (i + 1)
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
                          x: Math.min(
                              Math.max(0, props.x + data.deltaX),
                              canvasWidth
                          ),
                          y: Math.min(
                              Math.max(0, props.y + data.deltaY),
                              canvasWidth
                          ),
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

        // 提案用の泡を実体化させて親子関係にする
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
            <Wrapper ref={this.wrapperRef}>
                <AppMainHeader
                    onExit={() => this.handleExit()}
                    onSave={() => this.handleSave()}
                    onExport={() => this.handleExport()}
                />
                <SVGWrapper ref={this.svgWrapperRef}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width={canvasWidth}
                        height={canvasHeight}
                        onClick={ev => this.handleScreenClick(ev)}
                    >
                        {/* 線の表示 */}
                        {this.state.childBubblesProps.length > 0 &&
                            this.getAllLinesProps(
                                this.state.childBubblesProps[0]
                            ).map((props, i) => (
                                <line
                                    key={i}
                                    stroke="black"
                                    x1={props.x1}
                                    y1={props.y1}
                                    x2={props.x2}
                                    y2={props.y2}
                                />
                            ))}

                        {/* 泡の表示 */}
                        {this.state.childBubblesProps.map((props, i) => (
                            <Bubble
                                key={i}
                                fill={i === 0 ? 'hotpink' : undefined}
                                onClick={(ev, data) =>
                                    this.handleChildBubbleClick(ev, data, i)
                                }
                                onDrag={(ev, data) =>
                                    this.handleChildBubbleDrag(ev, data, i)
                                }
                                {...props}
                            />
                        ))}

                        {/* 追加用の泡の表示 */}
                        {this.state.suggestAddBubbleProp ? (
                            <AddBubble
                                onConfirm={(ev, data) =>
                                    this.handleComfirm(ev, data)
                                }
                                {...this.state.suggestAddBubbleProp}
                            />
                        ) : null}

                        {/* 提案用の泡の表示 */}
                        {this.state.suggestBubblesProps.map((props, i) => (
                            <Bubble
                                key={i}
                                onClick={(ev, data) =>
                                    this.handleSuggestBubbleClick(ev, data, i)
                                }
                                {...props}
                            />
                        ))}
                    </svg>
                </SVGWrapper>
            </Wrapper>
        )
    }
}

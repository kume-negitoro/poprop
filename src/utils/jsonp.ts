export const jsonp = <T>(src: string): Promise<T> =>
    new Promise(resolve => {
        const id = `callback_${Date.now()}`
        ;(window as any)[id] = resolve
        const script = document.createElement('script')
        script.src = `${src}&callback=${id}`
        document.body.appendChild(script)
        document.body.removeChild(script)
    })

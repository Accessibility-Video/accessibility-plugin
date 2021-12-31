/**
 *
 */
export namespace Document {
    /**
     *
     */
    export const ready = new Promise<void>(resolve => {
        const readyStateInterval = setInterval(function() {
            try {
                if (document.readyState === 'complete') {
                    clearInterval(readyStateInterval);
                    resolve();
                }
            } catch {
                resolve();
            }
        }, 25);
    });


    /**
     *
     */
    export function append(node: Node | string, element: 'head' | 'body' = 'head'): void {
        const head = document[element] || document.getElementsByTagName(element)[0];
        head.append(node);
    }
}

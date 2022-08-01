window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: string, text: string) => {
        if (!text) return
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, <string>process.versions[dependency])
    }
})
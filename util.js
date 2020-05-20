export const preventDefault = e => {
    e.preventDefault()
}

export const getName = e => e.name

export function showElement(element, display = 'block') {
    element.style.display = display
}

export function hideElement(element) {
    element.style.display = 'none'
}

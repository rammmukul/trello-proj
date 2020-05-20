let lists = null

let lastSelected = null
export function select(e) {
    if (lastSelected) {
        lastSelected.classList.remove('selected')
    }
    e.target.classList.add('selected')
    lastSelected = e.target
}

function deleteCard(cardElement = lastSelected) {
    if (!cardElement) return alert('Select card to delete!')
    const card = cardElement.innerText
    const listName = cardElement.parentElement.id
    const list = lists.find(e => e.name === listName)
    list.cards = list.cards.filter(e => e.name !== card)
    cardElement.remove()
    lastSelected = null
}

export default store => {
    lists = store
    document.querySelector('#delete')
        .addEventListener('click', () => deleteCard())    
}
let highlighted = []
let hidden = []
let lists = null
function search(e) {
    let term = e.target.value
    highlighted
        .forEach(e => {
            e.classList.remove('highlighted')
        })
    hidden.forEach(e => {
        e.style.display = 'block'
    })
    highlighted = []
    hidden = []

    if (!term) return

    lists.forEach(list => {
        list.cards.forEach(card => {
            if (card.name.includes(term)) {
                card.domNode.classList.add('highlighted')
                highlighted.push(card.domNode)
            } else {
                card.domNode.style.display = 'none'
                hidden.push(card.domNode)
            }
        })
    })
}

export default function(store) {
    lists = store
    document.querySelector('#searchBox')
        .addEventListener('input', search)    
}
const main = document.querySelector('main')
const newListBtn = document.querySelector('.add-list')
const newListForm = document.querySelector('.new-list')
const newListFormAdd = document.querySelector('.new-list > .add')
const newListFormCancel = document.querySelector('.new-list > .cancel')
const newListFormInput = document.querySelector('.new-list > input')

let lists = []

document.querySelector('#save').addEventListener('click', onSave)
function onSave() {
    localStorage.setItem('/lists', JSON.stringify(lists.map(e => e.name)))
    lists.forEach(list => {
        localStorage.setItem(`${list.name.replace('/', '//')}`, JSON.stringify(list.cards))
    })
}

window.onload = onLoad
function onLoad() {
    const savedLists = JSON.parse(localStorage.getItem('/lists') || '[]')
    savedLists.forEach(list => {
        const cards = JSON.parse(localStorage.getItem(list.replace('/', '//')))
        addNewList(list)
        cards.forEach(card => {
            addNewCard({
                listName: list,
                cardName: card
            })
        })
        lists.push({ name: list, cards })
    })
}

let newListFormVisible = false;
newListBtn.addEventListener('click', () => {
    newListFormVisible ? closeNewListForm() : openNewListForm()
})

newListFormCancel.addEventListener('click', closeNewListForm)

newListFormAdd.addEventListener('click', () => {
    const listName = newListFormInput.value.trim()
    if(!listName) return alert('you have to provide a value')
    if(lists.some(e => e.name === listName)) return alert('list already exists')
    closeNewListForm()
    addNewList(listName)
})

function showElement(element, display = 'block') {
    element.style.display = display
}

function hideElement(element) {
    element.style.display = 'none'
}

function openNewListForm() {
    hideElement(newListBtn)
    showElement(newListForm, 'grid')
    newListFormInput.focus()
}

function closeNewListForm() {
    showElement(newListBtn, 'inline')
    hideElement(newListForm)
    newListFormInput.value = ''
}

function addNewList(name) {
    lists.push({name, cards: []})
    const textArea = document.createElement('textarea')
    const add = document.createElement('button')
    add.classList.add('add')
    add.innerText = 'Add card'
    add.addEventListener(
        'click',
        () => addNewCard({
            listName: name,
            cardName: textArea.value,
            success: () => textArea.value = '',
            error: () => textArea.focus()
        })
    )
    const cancel = document.createElement('button')
    cancel.classList.add('cancel')
    cancel.innerText = 'Cancel'
    cancel.addEventListener('click', () => textArea.value = '')
    const newCardForm = document.createElement('div')
    newCardForm.classList.add('new-card')
    newCardForm.appendChild(textArea)
    newCardForm.appendChild(add)
    newCardForm.appendChild(cancel)
    const label = document.createElement('label')
    label.append(name)
    const list = document.createElement('ul')
    list.id = name
    list.classList.add('list')
    list.appendChild(label)
    list.appendChild(newCardForm)
    main.insertBefore(list, newListBtn)
    newListFormInput.focus()
}

function addNewCard({listName = '', cardName = '', success = () => {}, error = () => {}}) {
    cardName = cardName.trim()
    const list = lists.find(e => e.name === listName)
    if(!list) {
        error()
        throw new Error('no such list')
    }
    if(!cardName) {
        error()
        return alert('card name can not be empty')
    }
    if(list.cards.some(e => e === cardName)) {
        error()
        return alert('card already exists')
    }
    list.cards = [...list.cards, cardName]
    const li = document.createElement('li')
    li.classList.add('task')
    li.innerText = cardName
    li.addEventListener('click', select)
    main.querySelector(`#${listName}`)
        .insertBefore(
            li,
            main.querySelector(`#${listName} > .new-card`),
        )
    success()
}

let lastSelected = null
function select(e) {
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
    list.cards = list.cards.filter(e => e !== card)
    cardElement.remove()
    lastSelected = null
}

document.querySelector('#delete')
    .addEventListener('click', () => deleteCard())
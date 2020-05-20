import {
    preventDefault,
    getName,
    showElement,
    hideElement,
} from './util.js'

import Search from './search.js'
import Delete, { select } from './delete.js'

let lists = []
Search(lists)
Delete(lists)

const main = document.querySelector('main')
const newListBtn = document.querySelector('.add-list')
const newListForm = document.querySelector('.new-list')
const newListFormAdd = document.querySelector('.new-list > .add')
const newListFormCancel = document.querySelector('.new-list > .cancel')
const newListFormInput = document.querySelector('.new-list > input')

document.querySelector('#save').addEventListener('click', onSave)
function onSave() {
    localStorage.setItem('/lists', JSON.stringify(lists.map(getName)))
    lists.forEach(list => {
        localStorage.setItem(
            `${list.name.replace('/', '//')}`,
            JSON.stringify(list.cards.map(getName))
        )
    })
}

window.onload = onLoad
function onLoad() {
    const savedLists = JSON.parse(localStorage.getItem('/lists') || '[]')
    savedLists.forEach(list => {
        const cards = JSON.parse(localStorage.getItem(list.replace('/', '//')))
        addNewList({listName: list})
        cards.forEach(card => {
            addNewCard({
                listName: list,
                cardName: card
            })
        })
    })
}

let newListFormVisible = false;
newListBtn.addEventListener('click', () => {
    newListFormVisible ? closeNewListForm() : openNewListForm()
})

newListFormCancel.addEventListener('click', closeNewListForm)

newListFormAdd.addEventListener('click', () => {
    const listName = newListFormInput.value.trim()
    if (!listName) return alert('you have to provide a value')
    if (lists.some(e => e.name === listName)) return alert('list already exists')
    closeNewListForm()
    addNewList({listName})
})

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

function addNewList({
    listName = '',
}) {
    const textArea = document.createElement('textarea')
    const add = document.createElement('button')
    add.classList.add('add')
    add.innerText = 'Add card'
    const cancel = document.createElement('button')
    cancel.classList.add('cancel')
    cancel.innerText = 'Cancel'
    const newCardForm = document.createElement('div')
    newCardForm.classList.add('new-card')
    newCardForm.appendChild(textArea)
    newCardForm.appendChild(add)
    newCardForm.appendChild(cancel)

    add.addEventListener(
        'click',
        () => addNewCard({
            listName,
            cardName: textArea.value,
            success: () => textArea.value = '',
            error: () => textArea.focus()
        })
    )
    cancel.addEventListener('click', () => textArea.value = '')

    const label = document.createElement('label')
    label.innerText = listName
    const list = document.createElement('ul')
    list.id = listName
    list.classList.add('list')
    list.appendChild(label)
    list.appendChild(newCardForm)
    main.insertBefore(list, newListBtn)
    newListFormInput.focus()
    list.ondrop = e => {
        e.preventDefault()
        const fromListName = e.dataTransfer.getData('list')
        const fromCardName = e.dataTransfer.getData('card')
        const fromList = lists.find(e => e.name === fromListName)
        const fromCard = fromList.cards.find(e => e.name === fromCardName)
        fromList.cards = fromList.cards.filter(e => e.name !== fromCardName)
        fromCard.domNode.remove()
        addNewCard({
            listName,
            cardName: fromCardName,
            insertBefore: e.target.classList.contains('task')
                ? e.target
                : undefined
        })
    }

    list.ondragenter = preventDefault
    list.ondragover = preventDefault

    lists.push({ name: listName, domNode: list, cards: [] })
    return list
}

function addNewCard({
    listName = '',
    cardName = '',
    insertBefore,
    success = () => { },
    error = () => { }
}) {
    cardName = cardName.trim()
    const list = lists.find(e => e.name === listName)
    if (!list) {
        error()
        throw new Error('no such list')
    }
    if (!cardName) {
        error()
        return alert('card name can not be empty')
    }
    if (list.cards.some(e => e.name === cardName)) {
        error()
        return alert('card already exists')
    }
    const li = document.createElement('li')
    li.classList.add('task')
    li.innerText = cardName
    li.addEventListener('click', select)
    insertBefore = insertBefore || list.domNode.querySelector('.new-card')
    list.domNode
        .insertBefore(
            li,
            insertBefore,
        )
    list.cards = [...list.cards, { name: cardName, domNode: li }]
    success()

    li.draggable = true
    li.ondragstart = e => {
        e.dataTransfer.setData('list', listName)
        e.dataTransfer.setData('card', cardName)
    }
    return li
}

const main = document.querySelector('main')
const newListBtn = document.querySelector('.add-list')
const newListForm = document.querySelector('.new-list')
const newListFormAdd = document.querySelector('.new-list > .add')
const newListFormCancel = document.querySelector('.new-list > .cancel')
const newListFormInput = document.querySelector('.new-list > input')
let newListFormVisible = false;

const lists = []

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
    add.addEventListener('click', () => addNewCard({listName: name, cardName: textArea.value}))
    const cancel = document.createElement('button')
    cancel.classList.add('cancel')
    cancel.innerText = 'Cancel'
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

function addNewCard({listName = '', cardName = ''}) {
    cardName = cardName.trim()
    const list = lists.find(e => e.name === listName)
    if(!list) throw new Error('no such list')
    if(!cardName) return alert('card name can not be empty')
    if(list.cards.some(e => e === cardName)) return alert('card already exists')
    list.cards = [...list.cards, cardName]
    const li = document.createElement('li')
    li.classList.add('task')
    li.innerText = cardName
    main.querySelector(`#${listName}`)
        .insertBefore(
            li,
            main.querySelector(`${listName} > button.add-list`),
        )
}

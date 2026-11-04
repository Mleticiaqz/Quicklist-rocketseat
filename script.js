const form = document.getElementById("item-form")
const input = document.getElementById("item-input")
const list = document.getElementById("list")
const empty = document.getElementById("empty")
const counter = document.getElementById("counter")
const toast = document.getElementById("toast")

let items = load()
let toastTimer

function load() {
  try {
    return JSON.parse(localStorage.getItem("quicklist")) || []
  } catch {
    return []
  }
}

function save() {
  localStorage.setItem("quicklist", JSON.stringify(items))
}

function render() {
  list.innerHTML = ""
  items.forEach((item) => list.appendChild(createItem(item)))
  empty.hidden = items.length > 0
  const pending = items.filter((i) => !i.done).length
  counter.textContent = items.length
    ? `${pending} ${pending === 1 ? "pendente" : "pendentes"} de ${items.length}`
    : "0 itens"
}

function createItem(item) {
  const li = document.createElement("li")
  li.className = "item" + (item.done ? " is-done" : "")
  li.dataset.id = item.id

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.id = `item-${item.id}`
  checkbox.checked = item.done
  checkbox.addEventListener("change", () => toggle(item.id))

  const label = document.createElement("label")
  label.htmlFor = checkbox.id
  label.textContent = item.name

  const remove = document.createElement("button")
  remove.type = "button"
  remove.className = "item__remove"
  remove.setAttribute("aria-label", `Remover ${item.name}`)
  remove.textContent = "×"
  remove.addEventListener("click", () => removeItem(item.id, li))

  li.append(checkbox, label, remove)
  return li
}

function addItem(name) {
  items.push({ id: Date.now(), name, done: false })
  save()
  render()
  showToast("Item adicionado")
}

function toggle(id) {
  const item = items.find((i) => i.id === id)
  item.done = !item.done
  save()
  render()
}

function removeItem(id, li) {
  li.classList.add("is-removing")
  showToast("Item removido", true)
  setTimeout(() => {
    items = items.filter((i) => i.id !== id)
    save()
    render()
  }, 400)
}

function showToast(message, danger = false) {
  clearTimeout(toastTimer)
  toast.textContent = message
  toast.classList.toggle("is-danger", danger)
  toast.classList.add("is-visible")
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2000)
}

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const name = input.value.trim()
  if (!name) return
  addItem(name)
  input.value = ""
  input.focus()
})

render()
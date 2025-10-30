// =============================================================
//  EsToDoList (versão adaptada por João Victor)
//  Baseado no modelo de Prof. Rafael Ribas
//  Objetivo: Gerenciar tarefas (CRUD) com localStorage
// =============================================================

// -------------------------------
// 1. Selecionar elementos da página
// -------------------------------
const campoNovaTarefa = document.getElementById('newTask')
const botaoAdicionar = document.getElementById('newTask-btn')
const seletorFiltro = document.getElementById('Filtro-select')

// Seleciona a <ul> onde as tarefas serão renderizadas
const listaTarefas = document.querySelector('ul')

// O campo de pesquisa (selecionado pelo placeholder existente)
const campoPesquisa = document.querySelector('input[placeholder="🔎Pesquise uma tarefa"]')

// Array principal que armazenará todas as tarefas
let tarefas = []

// -------------------------------
// 2. Carregar tarefas salvas no navegador (localStorage)
// -------------------------------
function carregarTarefasSalvas() {
  const tarefasSalvas = localStorage.getItem('tarefas')
  if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas) // converte o texto salvo em array
    exibirTarefas(tarefas)
  } else {
    // Remove possíveis itens de exemplo estáticos no HTML
    listaTarefas.innerHTML = ''
  }
}

// -------------------------------
// 3. Salvar as tarefas no navegador
// -------------------------------
function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

// -------------------------------
// 4. Função para adicionar uma nova tarefa
// -------------------------------
function adicionarTarefa() {
  const texto = campoNovaTarefa.value.trim() // remove espaços extras

  if (texto === '') {
    alert('Digite uma tarefa antes de adicionar!')
    return
  }

  // Criamos um objeto representando a tarefa
  const novaTarefa = {
    id: Date.now(), // cria um número único com base no tempo atual
    texto: texto,
    concluida: false
  }

  // Adicionamos ao array e salvamos
  tarefas.push(novaTarefa)
  salvarTarefas()

  // Atualizamos a lista exibida
  exibirTarefas(tarefas)

  // Limpamos o campo de texto
  campoNovaTarefa.value = ''
}

// -------------------------------
// 5. Função para exibir as tarefas na tela
// -------------------------------
function exibirTarefas(listaParaMostrar) {
  // Limpamos a lista antes de mostrar novamente
  listaTarefas.innerHTML = ''

  // Percorremos todas as tarefas do array
  for (let tarefa of listaParaMostrar) {
    // Criar um elemento <li> para cada tarefa
    const item = document.createElement('li')
    item.className = 'flex w-9/12 justify-between items-center shadow 2xl h-10 text-left border rounded-md p-5 hover:bg-gray-300 hover:scale-105 transition duration-300'
    item.dataset.id = tarefa.id // armazenamos o id no dataset para referência
    item.onclick = function (){
        alternarConclusao(tarefa.id)
    }

    // Criar um <p> para o texto da tarefa (mantendo estilo do HTML original)
    const textoTarefa = document.createElement('span')
    textoTarefa.textContent = tarefa.texto
    
    // Aplicar estilo de concluída se necessário (linha riscada + cor acinzentada)
    if (tarefa.concluida) {
      textoTarefa.className = 'line-through text-gray-400 cursor-pointer'
      item.classList.add('opacity-70')
    } else {
      textoTarefa.className = 'cursor-pointer'
      item.classList.remove('opacity-70')
    }

    // Tornar o texto focável para permitir alternar com Enter (acessibilidade)
    textoTarefa.setAttribute('tabindex', '0')
    textoTarefa.setAttribute('role', 'button')
    textoTarefa.setAttribute('aria-pressed', String(tarefa.concluida))


    // Permitir alternar também com Enter quando o <p> estiver focado
    textoTarefa.addEventListener('keydown', function (evento) {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault()
        alternarConclusao(tarefa.id)
      }
    })

    // Criar os botões (excluir e editar) com os mesmos estilos do HTML
    const botoes = document.createElement('div')
    botoes.className = 'flex justify-center items-center gap-2'

    const botaoExcluir = document.createElement('button')
    botaoExcluir.textContent = '🗑'
    botaoExcluir.className = 'bg-red-400 w-8 h-8 rounded-lg text-xl shadow-4xl text-center hover:bg-red-600 hover:scale-110 transition duration-75'
    botaoExcluir.addEventListener('click', function () {
      excluirTarefa(tarefa.id)
    })

    const botaoEditar = document.createElement('button')
    botaoEditar.textContent = '📝'
    botaoEditar.className = 'bg-blue-400 w-8 h-8 rounded-lg text-xl shadow-4xl text-center hover:bg-blue-600 hover:scale-110 transition duration-75'
    botaoEditar.addEventListener('click', function () {
      editarTarefa(tarefa.id)
    })

    // Montamos o elemento completo
    botoes.appendChild(botaoExcluir)
    botoes.appendChild(botaoEditar)
    item.appendChild(textoTarefa)
    item.appendChild(botoes)
    listaTarefas.appendChild(item)
  }
}

// -------------------------------
// 6. Função para alternar entre concluída e ativa
// -------------------------------
function alternarConclusao(id) {
  // percorre o array e inverte o boolean concluida para o id correspondente
  for (let tarefa of tarefas) {
    if (tarefa.id === id) {
      tarefa.concluida = !tarefa.concluida
      break // já encontramos, podemos sair do loop
    }
  }
  salvarTarefas()
  exibirTarefas(tarefas)
}

// -------------------------------
// 7. Função para editar o texto de uma tarefa
// -------------------------------
function editarTarefa(id) {
  const novaDescricao = prompt('Edite a tarefa:')

  if (novaDescricao === null || novaDescricao.trim() === '') {
    return // se cancelar ou deixar em branco, não faz nada
  }

  for (let tarefa of tarefas) {
    if (tarefa.id === id) {
      tarefa.texto = novaDescricao.trim()
      break
    }
  }
  salvarTarefas()
  exibirTarefas(tarefas)
}

// -------------------------------
// 8. Função para excluir uma tarefa
// -------------------------------
function excluirTarefa(id) {
  const confirmar = window.confirm('Tem certeza que deseja excluir esta tarefa?')

  if (confirmar) {
    tarefas = tarefas.filter(function (tarefa) {
      return tarefa.id !== id
    })
    salvarTarefas()
    exibirTarefas(tarefas)
  }
}

// -------------------------------
// 9. Função de pesquisa
// -------------------------------
function pesquisarTarefas() {
  const termo = campoPesquisa.value.toLowerCase()
  const filtradas = tarefas.filter(function (tarefa) {
    return tarefa.texto.toLowerCase().includes(termo)
  })
  exibirTarefas(filtradas)
}

// -------------------------------
// 10. Filtro: Todos / Ativos / Concluídos / Expirados
// -------------------------------
function filtrarTarefas() {
  const tipo = seletorFiltro.value
  let filtradas = []

  if (tipo === 'Todos') {
    filtradas = tarefas
  } else if (tipo === 'Ativos') {
    filtradas = tarefas.filter(tarefa => !tarefa.concluida)
  } else if (tipo === 'Concluídos') {
    filtradas = tarefas.filter(tarefa => tarefa.concluida)
  } else if (tipo === 'Expirados') {
    // Placeholder: caso queira implementar prazo no futuro
    filtradas = []
  }

  exibirTarefas(filtradas)
}

// -------------------------------
// 11. Eventos (interações do usuário)
// -------------------------------
botaoAdicionar.addEventListener('click', adicionarTarefa)
campoPesquisa.addEventListener('input', pesquisarTarefas)
seletorFiltro.addEventListener('change', filtrarTarefas)          

// Permitir adicionar tarefa ao pressionar Enter
campoNovaTarefa.addEventListener('keydown', function (evento) {
  if (evento.key === 'Enter') {
    adicionarTarefa()
  }
})

// -------------------------------
// 12. Quando a página carregar, buscamos as tarefas salvas
// -------------------------------
window.addEventListener('load', carregarTarefasSalvas)

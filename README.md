API em Node.js para realizar o gerenciamento completo de tarefas (CRUD)

```bash
yarn       # Instala as dependências
yarn dev   # Inicia o servidor
yarn csv   # Importa tarefas via CSV e faz requisições `POST` no database
```
---

### GET /tasks
 Lista todas as tarefas e permite filtrar por title ou description

Query Params:
 
```json
  title=_task_title_,
  description=_task_description_
```

---

### POST /task
 Cria uma nova tarefa.

 Body:

```json
{
  "title": "_task_title_",
  "description": "_task_description_"
}
```

---

### PUT /task/:taskId
 Atualizar o título e/ou descrição de uma tarefa.

 Body:

```json
{
  "title": "_task_title_",
  "description": "_task_description_"
}
```

---


### PATCH /task/:taskId/complete
 Marca se a tarefa foi concluída

 Body:

```json
{
  "complete": true/false
}
```

---

### DELETE /task/:taskId
 Remove uma tarefa específica pelo id

 

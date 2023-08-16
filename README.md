# 🏁 Projeto Movies

<h2 font-family="pattaya">Tecnologias utilizadas</h2>
<div style="display: inline_block"><br>
 <img align="center" alt="Alexandra-Node" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg">
 <img align="center" alt="Alexandra-Ts" height="30" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-plain.svg">
 <img align="center" alt="Alexandra-SQL" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg"> 
</div><br>

<h2 font-family="pattaya">Descrição</h2><br>
<p font-family="robotto" font-size="16px" line-height="34px" align="justify">
A API, se refere à uma aplicação de fimes, simulando a rotina de uma locadora.
</p><br>

<h2 font-family="pattaya">Requisitos técnicos:</h2><br>

# Endpoints do serviço

| Método | Endpoint | Responsabilidade |
|--------|----------|------------------|
| POST | /movies | Criar um novo filme |
| GET | /movies | Listar todos os filmes |
| PATCH | /movies/&lt;id&gt; | Atualiza os dados de um filme de forma dinâmica |
| DELETE | /movies/&lt;id&gt; | Deleta um filme |

## **Tabela**

A tabela deve seguir as seguintes especificações:

* **Nome da tabela**: movies.
* **Colunas da tabela**:
  * **id**: inteiro, auto incrementável e chave primária.
  * **name**: string, tamanho máximo 50, única e chave obrigatória.
  * **description**: texto.
  * **duration**: inteiro e chave obrigatória.
  * **price**: inteiro e chave obrigatória.

## Requisitos do Serviço

Esse serviço precisa possuir uma API REST para que os demais serviços consigam criar, listar, atualizar e deletar filmes de um banco de dados.

* O banco de dados deve ser **PostgreSQL**.
* O diagrama sobre a tabla de ver feito.

### **POST: /movies**

* Deve ser possível criar um filme contendo os seguintes dados:
  * **name**: string.
  * **description**: string.
  * **duration**: inteiro.
  * **price**: inteiro.

***Regras de negócio***

* Caso de sucesso:
  * **Envio**: Um objeto contendo os dados do filme a ser criado.
  * **Retorno**: Um objeto contendo os dados do filme criado.
  * **Status**: 201 CREATED.

**Exemplo de envio**:

```json
{
  "name": "exemplo",
  "duration": 100,
  "price": 74
}
```

**Exemplo de retorno**:

```json
{
  "id": 1,
  "name": "exemplo",
  "duration": 100,
  "description": null,
  "price": 74,
}
```

* Não deve ser possível criar um filme com um nome já existente:
  * **Envio**: Um objeto contendo um nome já existente.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 409 UNIQUE.

**Exemplo de envio**:

```json
{
  "name": "exemplo",
  "duration": 100,
  "price": 74
}
```

**Exemplo de retorno**:

```json
{
  "message": "Movie already exists."
}
```

### **GET: /movies**

* Deve ser possível listar todos os filmes armazenados no banco de dados.

***Regras de negócio***

* Deve conter paginação utilizando os query params **page** e **perPage**.
* Deve conter ordenação utilizando os query params **sort** e **order**.

* Query Params:
  * **page** e **perPage**:
    * Por padrão, **page** deve ser **1** e **perPage** deve ser **5**.
    * Se **page** ou **perPage** forem valores negativos ou não forem números, deve utilizar os valores padrões.
    * Se **perPage** for maior que **5**, deve utilizar o valor padrão.
  * **sort** e **order**:
    * Valores possíveis para **sort**: "**price**" e "**duration**".
    * Valores possíveis para **order**: "**asc**" e "**desc**". Padrão é **asc**,
    * Se apenas **order** for enviado, a ordenação não deve ser feita.
    * Se apenas **sort** for enviado, a ordenação deve ser feita seguindo o padrão de **order**.
    * Se o valor enviado de **sort** e **order** não forem os valores possíveis, a ordenação não deve ser feita.
    * Caso os valores enviados forem os valores possíveis, deve ordenar seguindo a coluna e a clausula.
* Objeto de paginação:
  * previousPage: Uma string representando qual a URL da página anterior.
    * Caso não exista, deve retornar **null**.
  * nextPage: Uma string representando qual a URL da próxima página.
    * Caso não exista, deve retornar **null**.
  * count: Quantidade de valores retornados.
  * data: Um array contendo os filmes armazenados no banco de dados.

* Caso de sucesso:
  * **Retorno**: Objeto de paginação.
  * **Status**: 200 OK.
  * Exemplo de retorno:

```json
{
 "previousPage": null,
 "nextPage": "http://localhost:3000/movies?page=2&perPage5",
 "count": 5,
 "data": [
    {
      "id": 1,
      "name": "exemplo",
      "duration": 120,
      "description": null,
      "price": 50,
      "discount": 0,
      "stock": 0
    },
    {
      "id": 2,
      "name": "exemplo 2",
      "duration": 180,
      "description": "exemplo",
      "price": 200,
      "discount": 5,
      "stock": 5
    },
    //...
  ]
}
```

### **PATCH: /movies/&lt;id&gt;**

* Deve ser possível atualizar um filme pelo id recebido nos parâmetros da rota.

***Regras de negócio***

* Deve ser possível atualizar um filme contendo os seguintes dados:
  * **name**: string.
  * **description**: string.
  * **duration**: inteiro.
  * **price**: inteiro.

* Todos os dados são opcionais.
  * O filme deve ser atualizado dinamicamente seguindo os dados enviados.

* Caso de sucesso:
  * **Envio**: Um objeto contendo os dados do filme a ser atualizado.
  * **Retorno**: Um objeto contendo os dados do filme atualizado.
  * **Status**: 200 OK.

**Exemplo de envio**:

```json
{
  "duration": 180,
  "name": "exemplo 1: PATCH",
  "description": "Atualizado!"
}
```

**Exemplo de retorno**:

```json
{
  "id": 1,
  "name": "exemplo 1: PATCH",
  "description": "Atualizado!",
  "duration": 180,
  "price": 50
}

```

* Não deve ser possível atualizar um filme caso ele não exista:
  * **Envio**: Um objeto contendo os dados do filme.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 404 NOT FOUND.

**Exemplo de envio**:

```json
{
  "description": "nova descrição",
}
```

**Exemplo de retorno**:

```json
{
  "message": "Movie not found."
}
```

* Não deve ser possível atualizar um filme com um nome já existente:
  * **Envio**: Um objeto contendo um nome já existente.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 409 UNIQUE.

**Exemplo de envio**:

```json
{
  "name": "exemplo 1: PATCH"
}
```

**Exemplo de retorno**:

```json
{
  "message": "Movie already exists."
}
```

### **DELETE: /movies/&lt;id&gt;**

***Regras de negócio***

* Deve ser possível deletar um filme pelo id recebido nos parâmetros da rota.

* Caso de sucesso:
  * **Envio**: Sem envio.
  * **Retorno**: Sem retorno.
  * **Status**: 204 NO CONTENT.

* Não deve ser possível deletar um filme caso ele não exista:
  * **Envio**: Sem envio.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 404 NOT FOUND.

**Exemplo de retorno**:

```json
{
  "message": "Movie not found."
}
```

# Boas vindas ao projeto Trybe Futebol Clube (TFC)

---
⚽🏆🏅⚽

Repositório acadêmico
Web-Fullstack-Development -> [Trybe](https://www.betrybe.com/)

--- ⚽🏆🏅⚽ ---

```typescript

const keyWords: [Production[], Development[]] =
  [
    [NODE, DOCKER, JEST, JWT, SEQUELIZE],
    [TYPESCRIPT, OOP, SOLID, ESLINT, TDD, CRUD]
  ];

```

<details>

<summary>

## TRYBE FUTEBOL CLUBE

</summary>

- ⚽🏆 Em Trybe futebol clube, projeto desenvolvido no módulo ***backend***, construímos um portal para partidas fictícias de futebol, onde é possível ver as partidas (finalizadas e em andamento), atualizar partidas para marcar gols ou finalizá-las e buscar pelo desempenho dos times como mandante, visitante ou globalmente! Nesse projeto desenvolvemos o backend e seus testes de cobertura. Vale dizer que o frontend chegou pronto como especificação do projeto. Mesmo assim, incluí umas operações do crud que podemos desempenhar por requisições diretas na API, sem integração com interface gráfica ainda. Vamos lá conquistar essa medalha?🏅

- 💻⌨️:
Para isso, aplicamos os conceitos de ***OOP*** e ***SOLID*** para manipularmos com o banco de dados, implementado a partir de especificações do projeto.
Por decisão pessoal, desenvolvi o projeto me baseando na metodologia **TDD**, onde escrevi os testes de cobertura antes de concluir as especificações do projeto.
Consolidando uma etapa do aprendizado fullstack, essa é uma aplicação completa, desenvolvida com sistema de controle de acesso por **JWT**, comunicação com o banco de dados pela ferramenta **ORM** Sequelize.
Além de configurar os scripts do projeto para que o mesmo pudesse ser entregado por docker! 🧑‍💻👊

## PARA RODAR O PROJETO

1. Clone o repositório:

    > ```bash
    > git clone git@github.com:FaelCaporali/acdProj-trybe-futebol-clube.git
    > ```

2. Inicie a network com os containers da base de dados, API e interface gráfica:

    > Com o docker e docker compose instalado (em versões mais atualizadas do docker o composer vem por default), entre no diretório raiz do projeto e execute o script:
    >
    > ```bash
    > npm run compose-up-dev
    > ```
    >
    > e ✨✨✨ pronto!
    >
    > ❗**OBSERVAÇÃO** O comando acima cria os containers e instala as dependências necessárias, somente após a rede docker ter sido criada, os scripts de teste funcionarão.

3. Serviços do projeto:

    - Base de dados MariaDB: hospedada na porta 3002.
    - API desenvolvida: hospedada na porta 3001.
    - Interface gráfica: hospedada na porta 3000. -> basta ir ao navegador e acessar http://localhost:3000 !!!

## SCRIPTS

- compose-up-dev -> Cria a docker network para o projeto.
- compose-down-dev -> Remove a docker network e limpa os processos.
- logs -> Imprime os logs dos containers da docker network.
- test -> Roda testes de cobertura para a API, presente em app/backend.
- test-coverage -> Roda os testes escritos e devolve o relatório de cobertura dos testes.

</details>

<details>

<summary>

## ARQUITETURA

</summary>

```tree

├── app
│   ├── backend
│   │   ├── src
│   │   │   ├── app.ts
│   │   │   ├── controllers
│   │   │   ├── database
│   │   │   │   ├── config
│   │   │   │   ├── migrations
│   │   │   │   ├── models
│   │   │   │   └── seeders
│   │   │   ├── routes                                    -> Rotas da API
│   │   │   ├── server.ts
│   │   │   ├── services
│   │   │   │   ├── helpers                               -> Funções auxiliares da regras de negócio
│   │   │   │   └── interfaces                            -> Interfaces de serviços relativos às entidades
│   │   │   ├── shared
│   │   │   │   ├── auth                                  -> Serviço auxiliar de gestão de autenticação
│   │   │   │   ├── error                                 -> Serviço auxiliar de tratamento de erros
│   │   │   │   └── myNygma                               -> Serviço auxiliar de criptografia
│   │   │   └── tests                                     -> Testes de cobertura da API
│   └── frontend                                          -> Frontend entregue como especificação do projeto
└── *                                                     -> demais arquivos de configuração

```

</details>

<details>

<summary>

## OUTROS PROJETOS ACADÊMICOS

</summary>

> <details>
>   <summary>FUNDAMENTOS</summary>
>
> - [ ] 1.01 - Lessons learned
> - [ ] 1.02 - Pixels art
> - [ ] 1.03 - Meme generator
> - [ ] 1.04 - Color guess
> - [ ] 1.05 - Mystery letter
> - [ ] 1.05 - TrybeWarts
> - [ ] 1.06 - Testes unitários
> - [ ] 1.07 - Zoo Functions
> - [ ] 1.08 - Shopping cart
>
> </details>

> <details>
>   <summary>FRONTEND</summary>
>
> - [ ] 2.01 - Solar system
> - [ ] 2.02 - Tryunfo
> - [ ] 2.03 - Trybe tunes
> - [ ] 2.04 - FrontEnd online store
> - [ ] 2.05 - React testing library
> - [ ] 2.06 - Trybe wallet
> - [ ] 2.07 - Trivia game
> - [ ] 2.08 - StarWars planets
> - [ ] 2.09 - Recipes App
>
> </details>

> <details open>
>   <summary>BACKEND</summary>
>
> - [ ] 3.01 - Docker to-do list
> - [ ] 3.02 - MySQL - all for one
> - [ ] 3.03 - MySQL - one for all
> - [ ] 3.04 - Talker manager
> - [ ] 3.05 - Store manager
> - [ ] 3.06 - Stranger Things
> - [ ] 3.07 - Trybesmith
> - [ ] 3.08 - Trybers and Dragons
> - [x] 3.09 - Trybe futebol clube ⚽🏆**você está aqui!**🏆⚽
> - [ ] 3.10 - E-commerce
> - [ ] 3.11 - Car shop
> - [ ] 3.12 - Delivery app
>
> </details>

> <details>
>   <summary>CIÊNCIAS DA COMPUTAÇÃO</summary>
>
> - [ ] 4.01 - Job insights
> - [ ] 4.02 - Relatório de estoque
> - [ ] 4.03 - Tech news
> - [ ] 4.04 - Algoritmos
> - [ ] 4.05 - TING - Trybe is not google
> - [ ] 4.06 - Restaurant orders
>
> </details>

</details>

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rafelhon@gmail.com) &nbsp;
[![Linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/faelcaporali/) &nbsp;
[![CodeWars](https://img.shields.io/badge/Codewars-B1361E?style=for-the-badge&logo=Codewars&logoColor=white)](https://www.codewars.com/users/MudSailor) &nbsp;

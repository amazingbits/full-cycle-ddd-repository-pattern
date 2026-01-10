# DDD - Repository Pattern

Projeto desenvolvido para aplicar conceitos de **Domain-Driven Design (DDD)** e o padrão **Repository**, implementando uma aplicação com separação clara entre camadas de domínio e infraestrutura.

## Sobre o Projeto

Este projeto demonstra a implementação dos princípios de DDD através de:

- **Camada de Domínio**: Entidades, Value Objects e interfaces de repositório isoladas de frameworks e bibliotecas externas
- **Camada de Infraestrutura**: Implementação concreta dos repositórios usando Sequelize/SQLite
- **Repository Pattern**: Abstração do acesso a dados, permitindo trocar a implementação de persistência sem afetar o domínio

## Estrutura do Projeto

```
src/
├── domain/               # Camada de domínio (regras de negócio)
│   ├── @shared/
│   │   └── repository/  # Interface genérica de repositório
│   ├── customer/        # Agregado Customer
│   │   ├── entity/
│   │   ├── value-object/
│   │   └── repository/
│   ├── order/          # Agregado Order
│   │   ├── entity/
│   │   └── repository/
│   └── product/        # Agregado Product
│       ├── entity/
│       └── repository/
└── infra/              # Camada de infraestrutura
    ├── customer/
    │   └── repository/sequelize/
    ├── order/
    │   └── repository/sequelize/
    └── product/
        └── repository/sequelize/
```

## Tecnologias

- **TypeScript**: Linguagem principal
- **Sequelize**: ORM para persistência de dados
- **SQLite**: Banco de dados (usado nos testes)
- **Jest**: Framework de testes
- **ESLint + Prettier**: Padronização de código
- **Husky + Commitlint**: Git hooks e commits convencionais

## Principais Conceitos Implementados

### Entidades do Domínio

- **Customer**: Cliente com nome, endereço, status ativo/inativo e pontos de recompensa
- **Order**: Pedido com itens, relacionamento com cliente e cálculo de total
- **Product**: Produto com nome e preço

### Repository Pattern

Cada agregado possui:

- Interface do repositório na camada de domínio
- Implementação concreta usando Sequelize na camada de infraestrutura
- Operações CRUD: `create`, `update`, `find`, `findAll`

### Value Objects

- **Address**: Representa o endereço do cliente (rua, número, CEP, cidade)

## Requisitos

- Node.js (versão especificada em [.nvmrc](.nvmrc))
- npm ou yarn

## Como Executar

### Instalação

```bash
npm install
```

### Scripts Disponíveis

```bash
# Executar em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Build do projeto
npm run build

# Executar versão compilada
npm start

# Linting
npm run lint
npm run lint:fix

# Formatação
npm run format
npm run format:write
```

## Testes

O projeto possui cobertura completa de testes unitários e de integração:

- Testes de entidades do domínio
- Testes dos repositórios com banco de dados em memória
- Validações de regras de negócio

Execute `npm test` para rodar todos os testes.

## Padrões de Código

O projeto utiliza:

- **ESLint**: Para análise estática e qualidade de código
- **Prettier**: Para formatação consistente
- **Commitlint**: Para padronização de mensagens de commit (Conventional Commits)
- **Husky + lint-staged**: Para executar verificações automaticamente antes dos commits

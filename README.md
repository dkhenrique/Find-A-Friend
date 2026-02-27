# Find-a-Friend Backend

Uma API robusta construída com **NestJS** para ajudar no gerenciamento e adoção de animais de estimação.

## 🚀 Tecnologias Utilizadas

- **Framework**: [NestJS v11](https://nestjs.com/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Validação**: [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)
- **Identificadores**: [UUID v4](https://github.com/uuidjs/uuid)
- **Padronização**: ESLint & Prettier

## 🏗️ Arquitetura e Boas Práticas

O projeto foi desenvolvido seguindo princípios de engenharia de software modernos e padrões recomendados pela comunidade NestJS:

- **SOLID**:
  - **Single Responsibility Principle**: Separação clara entre Controllers (rotas/entrada), DTOs (validação/formato) e Repositories (persistência).
  - **Dependency Inversion**: Uso extensivo de Injeção de Dependência do NestJS para desacoplar componentes.
- **Repository Pattern**: Abstração da camada de dados permitindo que a lógica de negócio não dependa de uma implementação específica de banco de dados.
- **DTOs (Data Transfer Objects)**: Garantia de integridade dos dados trafegados entre as camadas com validações granulares.
- **Custom Validators**: Implementação de validadores customizados (ex: Unicidade de E-mail) integrados ao sistema de injeção de dependência.
- **Tratamento de Exceções**: Uso de `Built-in HTTP Exceptions` do NestJS (como `NotFoundException`) para respostas padronizadas e semânticas.

## 📁 Estrutura do Projeto

```text
src/
├── enums/          # Enumerações globais (ex: PetEnum)
├── pet/            # Módulo de Animais (Controllers, Repositories, DTOs, Entities)
└── user/           # Módulo de Usuários (Controllers, Repositories, DTOs, Entities, Validators)
```

## 🛠️ Como Iniciar

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn

### Instalação

```bash
npm install
```

### Executando o projeto

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
```

### Scripts Disponíveis

- `npm run lint`: Executa a análise estática do código.
- `npm run format`: Formata os arquivos utilizando o Prettier.
- `npm run test`: Executa os testes unitários.

## 📄 Licença

Este projeto foi criado durante o curso de NestJS da Alura.

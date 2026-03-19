# 🐾 Find-a-Friend — Backend

API RESTful para adoção de pets, construída com **NestJS** e **TypeORM**.

## 🚀 Tecnologias

- **NestJS** v11 — framework Node.js
- **TypeScript** — strict mode
- **TypeORM** — ORM com PostgreSQL
- **bcrypt** — hash de senhas
- **class-validator** / **class-transformer** — validação de DTOs
- **ESLint** / **Prettier** — qualidade de código

## 📁 Estrutura

```text
src/
├── adoption/       # Módulo de Adoções (entity, service, controller, DTOs)
├── config/         # Configuração do TypeORM/PostgreSQL
├── enums/          # Enumerações (PetEnum)
├── pet/            # Módulo de Pets (entity, service, controller, DTOs, fotos, requisitos)
└── user/           # Módulo de Usuários (entity, service, controller, DTOs, validators)
```

## 🗄️ Modelo de Dados

```text
UserEntity (users)
├── OneToMany  → PetEntity         (pets cadastrados pelo usuário)
└── OneToMany  → AdoptionEntity    (adoções realizadas)

PetEntity (pets)
├── ManyToOne  → UserEntity        (quem cadastrou)
├── OneToMany  → PetPhotoEntity    (fotos do pet)
├── ManyToMany → PetRequirementEntity (requisitos para adoção)
└── OneToOne   → AdoptionEntity    (registro de adoção)

AdoptionEntity (adoptions)
├── ManyToOne  → UserEntity        (adotante)
└── ManyToOne  → PetEntity         (pet adotado)
```

## 📡 Endpoints

### Users

| Método   | Endpoint       | Descrição         |
|----------|----------------|--------------------|
| `POST`   | `/users`       | Criar usuário      |
| `GET`    | `/users`       | Listar usuários    |
| `PUT`    | `/users/:id`   | Atualizar usuário  |
| `DELETE` | `/users/:id`   | Deletar usuário    |

### Pets

| Método   | Endpoint                              | Descrição                          |
|----------|---------------------------------------|------------------------------------|
| `POST`   | `/pets`                               | Criar pet                          |
| `GET`    | `/pets`                               | Listar pets                        |
| `GET`    | `/pets/:id`                           | Buscar pet (com fotos e requisitos)|
| `PUT`    | `/pets/:id`                           | Atualizar pet                      |
| `DELETE` | `/pets/:id`                           | Deletar pet                        |
| `POST`   | `/pets/:petId/photos`                 | Adicionar foto                     |
| `DELETE` | `/pets/:petId/photos/:photoId`        | Remover foto                       |
| `POST`   | `/pets/:petId/requirements`           | Vincular requisito                 |
| `DELETE` | `/pets/:petId/requirements/:reqId`    | Desvincular requisito              |

### Adoptions

| Método   | Endpoint          | Descrição          |
|----------|-------------------|--------------------|
| `POST`   | `/adoptions`      | Realizar adoção    |
| `GET`    | `/adoptions`      | Listar adoções     |
| `GET`    | `/adoptions/:id`  | Buscar adoção      |
| `DELETE` | `/adoptions/:id`  | Cancelar adoção    |

## 🛠️ Como Iniciar

### Pré-requisitos

- Node.js (v18+)
- PostgreSQL rodando localmente
- Arquivo `.env` configurado:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_NAME=find_a_friend
NODE_ENV=development
```

### Instalação

```bash
npm install
```

### Executando

```bash
# Desenvolvimento (com hot-reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

### Scripts

| Script              | Descrição                     |
|---------------------|-------------------------------|
| `npm run start:dev` | Servidor com hot-reload       |
| `npm run build`     | Compila para produção         |
| `npm run lint`      | Análise estática (ESLint)     |
| `npm run format`    | Formata código (Prettier)     |
| `npm run test`      | Executa testes unitários      |

## 🔐 Segurança

- Senhas são criptografadas com **bcrypt** (salt rounds: 10)
- Validação por email único via custom validator
- `synchronize: true` apenas em ambiente de desenvolvimento
- Validação de entrada em todos os endpoints via DTOs

## 📄 Licença

Projeto criado durante o curso de NestJS da Alura.

# 🐾 Find a Friend — Backend API

API RESTful para cadastro de ORGs, pets e gerenciamento de adoções, construída com **NestJS 11** e **TypeORM**.

## 🚀 Tecnologias

- **NestJS** v11 — framework Node.js
- **TypeScript** — strict mode
- **TypeORM** — ORM com PostgreSQL
- **Passport** + **JWT** — autenticação
- **bcrypt** — hash de senhas
- **class-validator** / **class-transformer** — validação de DTOs
- **Swagger** (`@nestjs/swagger`) — documentação interativa
- **ESLint** / **Prettier** — qualidade de código

## 📁 Estrutura

```text
src/
├── adoption/       # Módulo de Adoções (entity, service, controller, DTOs)
├── auth/           # Módulo de Autenticação (JWT, Passport, guards, strategies)
├── config/         # Configuração do TypeORM/PostgreSQL
├── db/             # Data source CLI e migrations
├── enums/          # Enumerações (PetEnum, PetAge, PetSize, EnergyLevel, etc.)
├── pet/            # Módulo de Pets (entity, service, controller, DTOs, fotos, requisitos)
└── user/           # Módulo de ORGs (entity, service, controller, DTOs, validators)
```

## 🗄️ Modelo de Dados

```text
UserEntity (users) — representa uma ORG
├── id, name, email, password
├── address, city, state, zipCode, whatsapp   ← campos de ORG
├── OneToMany  → PetEntity         (pets cadastrados pela ORG)
└── OneToMany  → AdoptionEntity    (adoções realizadas)

PetEntity (pets)
├── id, name, especie, adotado
├── age, size, energyLevel, independenceLevel, environment, description  ← características
├── ManyToOne  → UserEntity        (ORG responsável)
├── OneToMany  → PetPhotoEntity    (fotos do pet)
├── ManyToMany → PetRequirementEntity (requisitos para adoção)
└── OneToOne   → AdoptionEntity    (registro de adoção)

AdoptionEntity (adoptions)
├── ManyToOne  → UserEntity        (adotante)
└── ManyToOne  → PetEntity         (pet adotado)
```

## 📡 Endpoints

### Autenticação

| Método | Endpoint       | Auth | Descrição              |
|--------|----------------|------|------------------------|
| `POST` | `/auth/login`  | ❌   | Login (retorna JWT)    |

**Body:** `{ "email": "org@email.com", "password": "123456" }`
**Resposta:** `{ "access_token": "eyJ..." }`

---

### ORGs (Users)

| Método   | Endpoint       | Auth | Descrição          |
|----------|----------------|------|--------------------|
| `POST`   | `/users`       | ❌   | Cadastrar ORG      |
| `GET`    | `/users`       | ❌   | Listar ORGs        |
| `PUT`    | `/users/:id`   | ❌   | Atualizar ORG      |
| `DELETE` | `/users/:id`   | ❌   | Deletar ORG        |

---

### Pets

| Método   | Endpoint                              | Auth | Descrição                           |
|----------|---------------------------------------|------|-------------------------------------|
| `POST`   | `/pets`                               | 🔒   | Criar pet (vinculado à ORG logada)  |
| `GET`    | `/pets?city=X`                        | ❌   | Listar pets por cidade + filtros    |
| `GET`    | `/pets/:id`                           | ❌   | Detalhes do pet                     |
| `GET`    | `/pets/:id/contact`                   | ❌   | Contato WhatsApp da ORG             |
| `PUT`    | `/pets/:id`                           | 🔒   | Atualizar pet                       |
| `DELETE` | `/pets/:id`                           | 🔒   | Deletar pet                         |
| `POST`   | `/pets/:petId/photos`                 | 🔒   | Adicionar foto                      |
| `DELETE` | `/pets/:petId/photos/:photoId`        | 🔒   | Remover foto                        |
| `POST`   | `/pets/:petId/requirements`           | 🔒   | Vincular requisito                  |
| `DELETE` | `/pets/:petId/requirements/:reqId`    | 🔒   | Desvincular requisito               |

**Filtros opcionais em `GET /pets`:** `age`, `size`, `energyLevel`, `independenceLevel`, `environment`, `especie`

---

### Adoções

| Método   | Endpoint          | Auth | Descrição          |
|----------|-------------------|------|--------------------|
| `POST`   | `/adoptions`      | ❌   | Realizar adoção    |
| `GET`    | `/adoptions`      | ❌   | Listar adoções     |
| `GET`    | `/adoptions/:id`  | ❌   | Buscar adoção      |
| `DELETE` | `/adoptions/:id`  | ❌   | Cancelar adoção    |

## 📖 Documentação Swagger

Com o servidor rodando, acesse:

```
http://localhost:3000/api/docs
```

A documentação é gerada automaticamente via plugin `@nestjs/swagger` no `nest-cli.json`.

## 🔑 Regras de Negócio

- A **cidade é obrigatória** para listar pets
- Uma ORG **deve ter endereço e WhatsApp**
- Todo pet **deve estar vinculado a uma ORG**
- O contato para adoção é feito via **WhatsApp** (endpoint `/pets/:id/contact`)
- Filtros de características (exceto cidade) são **opcionais**
- Operações de escrita em pets exigem **login** (JWT)

## 🛠️ Como Iniciar

### Pré-requisitos

- Node.js (v18+)
- PostgreSQL rodando localmente

### Variáveis de ambiente (`.env`)

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=db_find-a-friend
DB_ADMIN_EMAIL=admin@root.com
JWT_SECRET=find-a-friend-jwt-secret-2026
```

### Instalação

```bash
npm install
```

### Migrations

```bash
# Gerar migration (requer DB ativo)
npm run migration:generate -- src/db/migrations/NomeDaMigration

# Executar migrations pendentes
npm run migration:run
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

| Script                    | Descrição                     |
|---------------------------|-------------------------------|
| `npm run start:dev`       | Servidor com hot-reload       |
| `npm run build`           | Compila para produção         |
| `npm run lint`            | Análise estática (ESLint)     |
| `npm run format`          | Formata código (Prettier)     |
| `npm run test`            | Executa testes unitários      |
| `npm run migration:run`   | Executa migrations            |
| `npm run migration:generate` | Gera migration automática  |

## 🔐 Segurança

- Senhas criptografadas com **bcrypt** (salt rounds: 10)
- Autenticação via **JWT** (Bearer token)
- Guards protegem rotas de escrita (`JwtAuthGuard`)
- Validação por email único via custom validator
- Dados sensíveis da ORG (password) removidos das respostas
- Validação de entrada em todos os endpoints via DTOs

## 📄 Licença

Projeto criado durante o curso de NestJS da Alura.

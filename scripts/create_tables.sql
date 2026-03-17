-- =============================================================
-- Find-a-Friend — Script de criação de tabelas para pgAdmin
-- Database: db_find-a-friend
-- Gerado a partir das entities TypeORM do projeto NestJS
-- =============================================================

-- 1. Criar o banco de dados (execute separadamente caso ainda não exista)
-- CREATE DATABASE "db_find-a-friend"
--   WITH OWNER = root
--        ENCODING = 'UTF8'
--        LC_COLLATE = 'en_US.utf8'
--        LC_CTYPE   = 'en_US.utf8';

-- 2. Habilitar extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- Tipo ENUM para espécies de pets
-- =============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pet_especie_enum') THEN
    CREATE TYPE pet_especie_enum AS ENUM (
      'dog',
      'cat',
      'bird',
      'fish',
      'reptile',
      'other'
    );
  END IF;
END
$$;

-- =============================================================
-- Tabela: users
-- Entity: UserEntity  (src/user/user.entity.ts)
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID         NOT NULL DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(70)  NOT NULL,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMP             DEFAULT NULL,

  CONSTRAINT pk_users PRIMARY KEY (id)
);

-- Índice único no e-mail para evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email
  ON users (email)
  WHERE deleted_at IS NULL;

COMMENT ON TABLE  users            IS 'Usuários do sistema Find-a-Friend';
COMMENT ON COLUMN users.id         IS 'Identificador único (UUID v4)';
COMMENT ON COLUMN users.name       IS 'Nome completo do usuário';
COMMENT ON COLUMN users.email      IS 'E-mail do usuário (único enquanto ativo)';
COMMENT ON COLUMN users.password   IS 'Senha criptografada';
COMMENT ON COLUMN users.created_at IS 'Data/hora de criação do registro';
COMMENT ON COLUMN users.updated_at IS 'Data/hora da última atualização';
COMMENT ON COLUMN users.deleted_at IS 'Data/hora do soft-delete (NULL = ativo)';

-- =============================================================
-- Tabela: pets
-- Entity: PetEntity  (src/pet/pet.entity.ts)
-- =============================================================
CREATE TABLE IF NOT EXISTS pets (
  id          UUID              NOT NULL DEFAULT uuid_generate_v4(),
  name        VARCHAR(100)      NOT NULL,
  especie     pet_especie_enum  NOT NULL,
  adotado     BOOLEAN           NOT NULL DEFAULT false,
  created_at  TIMESTAMP         NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP         NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMP                  DEFAULT NULL,

  CONSTRAINT pk_pets PRIMARY KEY (id)
);

-- Índice para filtrar pets disponíveis para adoção
CREATE INDEX IF NOT EXISTS idx_pets_adotado
  ON pets (adotado)
  WHERE deleted_at IS NULL;

-- Índice para filtrar pets por espécie
CREATE INDEX IF NOT EXISTS idx_pets_especie
  ON pets (especie)
  WHERE deleted_at IS NULL;

COMMENT ON TABLE  pets            IS 'Animais de estimação cadastrados para adoção';
COMMENT ON COLUMN pets.id         IS 'Identificador único (UUID v4)';
COMMENT ON COLUMN pets.name       IS 'Nome do pet';
COMMENT ON COLUMN pets.especie    IS 'Espécie do animal (dog, cat, bird, fish, reptile, other)';
COMMENT ON COLUMN pets.adotado    IS 'Se o pet já foi adotado (true/false)';
COMMENT ON COLUMN pets.created_at IS 'Data/hora de criação do registro';
COMMENT ON COLUMN pets.updated_at IS 'Data/hora da última atualização';
COMMENT ON COLUMN pets.deleted_at IS 'Data/hora do soft-delete (NULL = ativo)';

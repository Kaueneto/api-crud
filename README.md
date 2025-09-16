# Guia de Instalação e Configuração

## Criar o arquivo package

```bash
npm init
```

## Instalar o Express para gerenciar as requisições, rotas e URLs, entre outros

```bash
npm i express
```

## Instalar os pacotes para suporte ao TypeScript

```bash
npm i --save-dev @types/express
npm i --save-dev @types/node
```

## Instalar o compilador de projeto com o TypeScript e reiniciar o projeto quando o arquivo for modificado

```bash
npm i --save-dev ts-node
```

## Compilar o arquivo TypeScript

```bash
npx tsc
```

## Executar o arquivo gerado com Node.js

```bash
node dist/index.js
```

## Instalar a dependência para rodar processos simultâneos

```bash
npm i --save-dev concurrently
```

## Compilar o arquivo TypeScript e executar o arquivo gerado

```bash
npm run start:watch
```

## Executar as migrations para criar as tabelas no banco de dados.

```bash
npx typeorm migration:run -d dist/data-source.js

```

## Criar base de dados no MySQL

```sql
CREATE DATABASE nodeapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Instalar a dependência para conectar o Node.js (TS) com o banco de dados

```bash
npm i typeorm --save
npm i reflect-metadata --save
npm i mysql2 --save
```

## Manipular variáveis de ambiente

```bash
npm i dotenv --save
```

## Instalar os tipos de variáveis para o TypeScript

```bash
npm i --save-dev @types/dotenv
```

# <<<<<<< HEAD

## Criar a migração que sera usada para criar a tabela no banco de dados

```
npx typeorm migration:create src/migration/CreateSituationsTable

npx typeorm migration:create src/migration/CreateUsersTable
```

> > > > > > > 2c534bd (aula 03 migrations)

## executar as seeds para cadastrar registro de teste nas tabelaas no banco de dados.

```
node dist/run-seeds.js

```

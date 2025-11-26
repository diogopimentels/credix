# 🚀 INSTRUÇÕES - CONFIGURE O BACKEND AGORA

## 📋 PASSO 1: Subir o PostgreSQL no Docker

Abra um terminal **NA PASTA BACKEND** e execute:

```bash
cd backend
docker-compose up -d
```

Aguarde o Docker baixar a imagem e iniciar o container (30 segundos ~ 1 minuto).

---

## 📋 PASSO 2: Criar o arquivo .env

**CRIE MANUALMENTE** o arquivo `.env` na pasta `backend` com este conteúdo:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/credimestre?schema=public"
JWT_SECRET="credimestre-secret-2024-super-secure"
JWT_EXPIRES_IN="1d"
PORT=3333
```

---

## 📋 PASSO 3: Rodar as Migrations

No mesmo terminal, execute:

```bash
npx prisma migrate dev --name init
```

Isso vai criar todas as tabelas no banco.

---

## 📋 PASSO 4: Iniciar o Backend

```bash
npm run dev
```

---

## ✅ VERIFICAR SE FUNCIONOU

O backend deve estar rodando em: **http://localhost:3333**

Teste abrindo no navegador ou Postman:
- GET http://localhost:3333/

Deve retornar algo como:
```json
{
  "message": "CrediMestre Backend is running!"
}
```

---

## 🔥 COMANDOS RESUMIDOS (copie e cole tudo de uma vez):

```bash
cd backend
docker-compose up -d
npx prisma migrate dev --name init
npm run dev
```

**IMPORTANTE:** Você precisa criar o arquivo `.env` MANUALMENTE antes de rodar os comandos acima!

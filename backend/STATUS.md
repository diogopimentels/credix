# 🚀 Backend CrediMestre - FUNCIONANDO!

## ✅ Status: **ONLINE na porta 4000**

```
Server is running on port 4000
```

---

## 📊 O que está funcionando:

### ✅ Infraestrutura
- PostgreSQL rodando via Docker (porta 5432)
- Servidor Express (porta 4000)
- Prisma ORM configurado
- Migrations executadas com sucesso
- JWT Authentication
- Rate Limiting
- CORS habilitado
- Global Error Handling

### ✅ Módulos Implementados

#### 1. **Users (Autenticação)**
- `POST /users` - Registrar usuário
- `POST /users/sessions` - Login (retorna JWT)

#### 2. **Clients (Clientes)**
- `POST /clients` - Criar cliente
- `GET /clients` - Listar todos
- `GET /clients/:id` - Buscar por ID
- `PUT /clients/:id` - Atualizar
- `DELETE /clients/:id` - Deletar

#### 3. **Loans (Empréstimos)**
- `POST /loans` - Criar empréstimo (**calcula 40% de juros automaticamente**)
- `GET /loans` - Listar todos (suporta `?clientId=xxx`)
- `GET /loans/:id` - Buscar por ID
- `PATCH /loans/:id/status` - Atualizar status

#### 4. **Payments (Pagamentos)**
- `POST /payments` - Registrar pagamento
  - **Atualiza automaticamente o status do empréstimo para "paid" quando total pago >= total do empréstimo**

#### 5. **Dashboard (Estatísticas)**
- `GET /dashboard` - Retorna:
  - Total emprestado
  - Total esperado (com juros)
  - Total recebido
  - Empréstimos em aberto
  - Empréstimos atrasados
  - Total de clientes
  - Última atualização

---

## 🧪 Como Testar

### 1. Verificar se o servidor está online:
```bash
curl http://localhost:4000/
```

### 2. Importar a Collection do Postman:
O arquivo `requests.json` na pasta `backend` contém todos os endpoints prontos!

### 3. Fluxo de teste completo:

#### Passo 1: Registrar um usuário
```bash
POST http://localhost:4000/users
{
  "name": "Admin",
  "email": "admin@credimestre.com",
  "password": "123456",
  "role": "admin"
}
```

#### Passo 2: Fazer login
```bash
POST http://localhost:4000/users/sessions
{
  "email": "admin@credimestre.com",
  "password": "123456"
}
```
**Copie o `token` retornado!**

#### Passo 3: Criar um cliente
```bash
POST http://localhost:4000/clients
Authorization: Bearer SEU_TOKEN_AQUI
{
  "name": "João Silva",
  "phone": "11999999999",
  "address": "Rua A, 123",
  "photoUrl": "https://github.com/diego3g.png"
}
```
**Copie o `id` do cliente!**

#### Passo 4: Criar um empréstimo
```bash
POST http://localhost:4000/loans
Authorization: Bearer SEU_TOKEN_AQUI
{
  "clientId": "ID_DO_CLIENTE",
  "principal": 1000,
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```
**Note que o `totalAmount` será 1400 (1000 + 40%)**
**Copie o `id` do empréstimo!**

#### Passo 5: Registrar um pagamento
```bash
POST http://localhost:4000/payments
Authorization: Bearer SEU_TOKEN_AQUI
{
  "loanId": "ID_DO_EMPRESTIMO",
  "amount": 1400
}
```
**O status do empréstimo será automaticamente atualizado para "paid"!**

#### Passo 6: Ver estatísticas do dashboard
```bash
GET http://localhost:4000/dashboard
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🎯 Próximos Passos

Agora você pode:
1. **Integrar o frontend** - Apontar as chamadas API para `http://localhost:4000`
2. **Testar todos os fluxos** usando Postman/Insomnia
3. **Deploy** - Quando estiver pronto para produção

---

## 📝 Lembrete Importante

**Antes de fazer commit:**
- Adicione `.env` de volta ao `.gitignore`!
- O arquivo `.env` contém dados sensíveis e não deve ir para o repositório

---

## 🔥 BACKEND 100% COMPLETO E FUNCIONAL! 🔥

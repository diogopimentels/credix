# 🔌 API Documentation - Credimestre

Documentação completa da API Mock (MSW) do Credimestre.

## 📑 Índice

- [Visão Geral](#visão-geral)
- [Base URL](#base-url)
- [Tipos e Interfaces](#tipos-e-interfaces)
- [Endpoints](#endpoints)
- [Regras de Negócio](#regras-de-negócio)
- [Códigos de Status](#códigos-de-status)

## Visão Geral

A API do Credimestre é simulada usando **Mock Service Worker (MSW)**, que intercepta requisições HTTP e retorna dados fake armazenados em memória.

### Características

✅ **RESTful** - Segue padrões REST  
✅ **TypeScript** - Totalmente tipada  
✅ **In-Memory Database** - Arrays JavaScript  
✅ **Seed Data** - Dados iniciais para demonstração  
✅ **CRUD Completo** - Create, Read, Update, Delete  

## Base URL

```
Development: http://localhost:5173
```

Todas as rotas da API começam com `/api`

## Tipos e Interfaces

### Client

```typescript
interface Client {
  id: string              // Formato: "c-{timestamp}"
  name: string            // Nome completo
  phone: string           // Telefone formatado
  address: string         // Endereço completo
  photo: string           // URL ou base64
  notes: string           // Observações
  createdAt: string       // ISO 8601
}
```

### Loan

```typescript
interface Loan {
  id: string              // Formato: "l-{timestamp}"  
  clientId: string        // ID do cliente
  amount: number          // Valor inicial do empréstimo
  startDate: string       // Data de início (ISO 8601)
  termDays: number        // Prazo em dias (padrão: 20)
  paidDate: string | null // Data de pagamento (null se não pago)
  createdAt: string       // ISO 8601
}
```

### EnhancedLoan (Retornado pela API)

```typescript
interface EnhancedLoan extends Loan {
  clientName: string      // Nome do cliente (join)
  status: LoanStatus      // Status calculado
  totalAmount: number     // Valor total com juros/multas
  dueDate: string         // Data de vencimento
  interestAmount: number  // Valor dos juros
  fineAmount: number      // Valor da multa
  daysLate: number        // Dias de atraso
}
```

### LoanStatus

```typescript
type LoanStatus = 
  | "ONGOING"     // Em andamento, longe do vencimento
  | "NEAR_DUE"    // Faltam ≤3 dias para vencer
  | "DUE"         // Vence hoje
  | "LATE"        // Já passou do vencimento
  | "PAID"        // Empréstimo quitado
```

### DashboardData

```typescript
interface DashboardData {
  totalLent: number           // Total emprestado
  totalReceived: number       // Total recebido (pagos)
  totalOpen: number           // Total em aberto
  totalLate: number           // Total atrasado
  totalInterest: number       // Total de juros
  totalFines: number          // Total de multas
  recentLoans: RecentLoan[]   // Últimos 5 empréstimos
  revenueChartData: ChartData[] // Dados do gráfico
}
```

---

## Endpoints

### 👥 Clientes

#### `GET /api/clients`

Lista todos os clientes.

**Response 200:**

```json
[
  {
    "id": "c-1",
    "name": "João Silva",
    "phone": "(11) 99999-0001",
    "address": "Rua Exemplo, 100",
    "photo": "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    "notes": "Cliente confiável",
    "createdAt": "2024-11-23T10:00:00.000Z"
  }
]
```

---

#### `POST /api/clients`

Cria um novo cliente.

**Request Body:**

```json
{
  "name": "Maria Santos",
  "phone": "(11) 98888-7777",
  "address": "Av. Paulista, 1000",
  "photo": "data:image/png;base64,...",
  "notes": "Nova cliente"
}
```

**Response 201:**

```json
{
  "id": "c-1732387200000",
  "name": "Maria Santos",
  "phone": "(11) 98888-7777",
  "address": "Av. Paulista, 1000",
  "photo": "data:image/png;base64,...",
  "notes": "Nova cliente",
  "createdAt": "2024-11-23T18:00:00.000Z"
}
```

---

#### `GET /api/clients/:id`

Busca um cliente específico por ID.

**Params:**
- `id` - ID do cliente

**Response 200:**

```json
{
  "id": "c-1",
  "name": "João Silva",
  "phone": "(11) 99999-0001",
  "address": "Rua Exemplo, 100",
  "photo": "https://...",
  "notes": "Cliente confiável",
  "createdAt": "2024-11-23T10:00:00.000Z"
}
```

**Response 404:**

```json
null
```

---

### 💰 Empréstimos

#### `GET /api/loans`

Lista todos os empréstimos com cálculos aplicados.

**Response 200:**

```json
[
  {
    "id": "l-1",
    "clientId": "c-1",
    "clientName": "João Silva",
    "amount": 1000,
    "startDate": "2024-11-03T00:00:00.000Z",
    "termDays": 20,
    "paidDate": "2024-11-21T00:00:00.000Z",
    "createdAt": "2024-11-03T00:00:00.000Z",
    "status": "PAID",
    "totalAmount": 1000,
    "interestAmount": 0,
    "fineAmount": 0,
    "daysLate": 0,
    "dueDate": "2024-11-23T00:00:00.000Z"
  },
  {
    "id": "l-5",
    "clientId": "c-5",
    "clientName": "Cliente 5",
    "amount": 3000,
    "startDate": "2024-11-18T00:00:00.000Z",
    "termDays": 20,
    "paidDate": null,
    "createdAt": "2024-11-18T00:00:00.000Z",
    "status": "ONGOING",
    "totalAmount": 4200,
    "interestAmount": 1200,
    "fineAmount": 0,
    "daysLate": 0,
    "dueDate": "2024-12-08T00:00:00.000Z"
  }
]
```

---

#### `POST /api/loans`

Cria um novo empréstimo.

**Request Body:**

```json
{
  "clientId": "c-1",
  "amount": 5000,
  "startDate": "2024-11-23T00:00:00.000Z",
  "termDays": 20
}
```

**Response 201:**

```json
{
  "id": "l-1732387200000",
  "clientId": "c-1",
  "amount": 5000,
  "startDate": "2024-11-23T00:00:00.000Z",
  "termDays": 20,
  "paidDate": null,
  "createdAt": "2024-11-23T18:00:00.000Z"
}
```

---

#### `GET /api/loans/:id`

Busca um empréstimo específico com detalhes do cliente.

**Params:**
- `id` - ID do empréstimo

**Response 200:**

```json
{
  "id": "l-1",
  "clientId": "c-1",
  "amount": 1000,
  "startDate": "2024-11-03T00:00:00.000Z",
  "termDays": 20,
  "paidDate": null,
  "createdAt": "2024-11-03T00:00:00.000Z",
  "client": {
    "id": "c-1",
    "name": "João Silva",
    "phone": "(11) 99999-0001",
    "address": "Rua Exemplo, 100",
    "photo": "https://...",
    "notes": "Cliente confiável",
    "createdAt": "2024-11-23T10:00:00.000Z"
  },
  "status": "LATE",
  "totalAmount": 1650,
  "interestAmount": 400,
  "fineAmount": 250,
  "daysLate": 5,
  "dueDate": "2024-11-23T00:00:00.000Z"
}
```

**Response 404:**

```json
null
```

---

#### `PATCH /api/loans/:id/pay`

Registra pagamento de um empréstimo.

**Params:**
- `id` - ID do empréstimo

**Request Body:**

```json
{
  "paidDate": "2024-11-23T18:00:00.000Z"
}
```

**Response 200:**

```json
{
  "id": "l-1",
  "clientId": "c-1",
  "amount": 1000,
  "startDate": "2024-11-03T00:00:00.000Z",
  "termDays": 20,
  "paidDate": "2024-11-23T18:00:00.000Z",
  "createdAt": "2024-11-03T00:00:00.000Z"
}
```

**Response 404:**

```json
null
```

---

### 📊 Dashboard

#### `GET /api/dashboard`

Retorna dados agregados para o dashboard.

**Response 200:**

```json
{
  "totalLent": 25000,
  "totalReceived": 8400,
  "totalOpen": 16600,
  "totalLate": 3300,
  "totalInterest": 4200,
  "totalFines": 500,
  "recentLoans": [
    {
      "id": "l-12",
      "clientName": "Cliente 12",
      "status": "LATE",
      "dueDate": "2024-11-01T00:00:00.000Z",
      "details": {
        "totalAmount": 2600
      }
    }
  ],
  "revenueChartData": [
    { "name": "Jan", "total": 8543 },
    { "name": "Fev", "total": 12398 },
    { "name": "Mar", "total": 9871 }
  ]
}
```

---

### ⚠️ Alertas

#### `GET /api/alerts`

Retorna empréstimos próximos do vencimento ou atrasados.

**Response 200:**

```json
[
  {
    "id": "l-8",
    "clientId": "c-8",
    "amount": 5000,
    "startDate": "2024-11-05T00:00:00.000Z",
    "termDays": 20,
    "paidDate": null,
    "createdAt": "2024-11-05T00:00:00.000Z",
    "status": "NEAR_DUE",
    "totalAmount": 7000,
    "interestAmount": 2000,
    "fineAmount": 0,
    "daysLate": 0,
    "dueDate": "2024-11-25T00:00:00.000Z"
  }
]
```

---

## Regras de Negócio

### Cálculo deEmpréstimos

**Função:** `calculateLoanDetails()` em `src/utils/calculations.ts`

#### Juros

```
Juros = Valor Inicial × 40%
```

> **Aplicado apenas se pago APÓS o vencimento**

**Exemplo:**
```
Empréstimo: R$ 1.000,00
Juros: R$ 1.000,00 × 0,40 = R$ 400,00
```

#### Multa

```
Multa = Dias de Atraso × R$ 50,00
```

> **Aplicado apenas se pago APÓS o vencimento**

**Exemplo:**
```
Dias de atraso: 5
Multa: 5 × R$ 50,00 = R$ 250,00
```

#### Total

```
Se pago NO PRAZO:
  Total = Valor Inicial

Se pago APÓS vencimento:
  Total = Valor Inicial + Juros + Multa
```

**Exemplo - Pago no prazo:**
```
Empréstimo: R$ 1.000,00
Total: R$ 1.000,00
```

**Exemplo - 5 dias de atraso:**
```
Empréstimo: R$ 1.000,00
Juros: R$ 400,00
Multa: R$ 250,00
Total: R$ 1.650,00
```

### Determinação de Status

```typescript
if (paidDate exists) {
  status = "PAID"
} else if (today > dueDate) {
  status = "LATE"
} else if (daysUntilDue === 0) {
  status = "DUE"
} else if (daysUntilDue <= 3) {
  status = "NEAR_DUE"
} else {
  status = "ONGOING"
}
```

### Prazo Padrão

```
Prazo: 20 dias corridos
Data de Vencimento = Data de Início + 20 dias
```

---

## Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## Exemplos de Uso

### Fetch Simples

```typescript
// GET - Listar clientes
const response = await fetch('/api/clients')
const clients = await response.json()

// POST - Criar empréstimo
const response = await fetch('/api/loans', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clientId: 'c-1',
    amount: 5000,
    startDate: new Date().toISOString(),
    termDays: 20
  })
})
const newLoan = await response.json()
```

### Com useEffect

```typescript
useEffect(() => {
  fetch('/api/dashboard')
    .then(res => res.json())
    .then(data => {
      setTotalLent(data.totalLent)
      setRecentLoans(data.recentLoans)
    })
}, [])
```

---

## Banco de Dados In-Memory

### Seed Data

**30 Clientes** gerados automaticamente  
**12 Empréstimos** com diferentes status:
- 4 Pagos
- 3 Em Andamento
- 2 A Vencer
- 3 Atrasados

### Persistência

⚠️ **Dados são voláteis** - Resetam ao recarregar a página  
⚠️ **Sem localStorage** - Não há persistência entre sessões  

Para persistir dados, implemente:
- LocalStorage
- IndexedDB
- Backend real

---

**Última Atualização:** Novembro 2024

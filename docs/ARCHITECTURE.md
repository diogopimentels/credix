# 🏗 Arquitetura do Credimestre

Este documento detalha a arquitetura técnica completa da aplicação Credimestre.

## 📑 Índice

- [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
- [Camadas da Aplicação](#camadas-da-aplicação)
- [Fluxo de Dados](#fluxo-de-dados)
- [Roteamento](#roteamento)
- [Autenticação](#autenticação)
- [Mock API (MSW)](#mock-api-msw)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Otimizações](#otimizações)

## Visão Geral da Arquitetura

O Credimestre segue uma **arquitetura em camadas** moderna para aplicações React:

```
┌─────────────────────────────────────────┐
│         Camada de Apresentação          │
│    (Pages, Components, UI Library)      │
├─────────────────────────────────────────┤
│       Camada de Lógica de Negócio       │
│    (Hooks, Utils, Calculations)         │
├─────────────────────────────────────────┤
│      Camada de Gerenciamento Estado     │
│         (Zustand, React State)          │
├─────────────────────────────────────────┤
│          Camada de Dados/API            │
│     (MSW Handlers, Fetch, Types)        │
└─────────────────────────────────────────┘
```

### Princípios Arquiteturais

✅ **Separação de Responsabilidades** - Cada componente tem uma única responsabilidade  
✅ **Composição** - Componentes pequenos e reutilizáveis  
✅ **Type Safety** - TypeScript em todo o código  
✅ **Declarativo** - Uso de JSX e Hooks  
✅ **Performance** - Code splitting e lazy loading  

## Camadas da Aplicação

### 1️⃣ Camada de Apresentação

```
src/
├── pages/              # Páginas completas (rotas)
├── components/
│   ├── ui/            # Componentes base reutilizáveis
│   ├── layout/        # Componentes de estrutura
│   ├── dashboard/     # Componentes específicos do dashboard
│   ├── clients/       # Componentes de clientes
│   └── loans/         # Componentes de empréstimos
```

**Responsabilidades:**
- Renderização visual
- Interação com usuário
- Composição de componentes
- Animações e transições

**Tecnologias:**
- React 18.2 (Componentes funcionais + Hooks)
- shadcn/ui + Radix UI (Componentes base)
- Framer Motion (Animações)
- Tailwind CSS (Estilização)

### 2️⃣ Camada de Lógica de Negócio

```
src/
├── utils/
│   └── calculations.ts    # Cálculos de empréstimos
└── hooks/                 # (Futuro) Custom hooks
```

**Responsabilidades:**
- Regras de negócio
- Cálculos complexos
- Validações
- Formatações

**Exemplo - Cálculo de Empréstimo:**

```typescript
// src/utils/calculations.ts
export function calculateLoanDetails(
    amount: number,
    startDate: Date | string,
    paidDate?: Date | string | null,
    customTermDays: number = 20
): LoanCalculationResult {
    // Regra: Juros de 40% + R$50/dia de atraso
    const interestAmount = amount * 0.40
    const fineAmount = daysLate * 50
    const totalAmount = amount + interestAmount + fineAmount
    
    // Status calculado automaticamente
    const status = determineStatus(dueDate, today, paidDate)
    
    return { initialAmount, interestAmount, fineAmount, totalAmount, status, ... }
}
```

### 3️⃣ Camada de Estado

```
src/
└── store/
    └── authStore.ts       # Zustand store para autenticação
```

**Gerenciamento de Estado:**

- **Estado Global:** Zustand (autenticação, user)
- **Estado Local:** useState (listas, filtros, loading)
- **Estado de Formulário:** React Hook Form
- **Estado de Server:** Fetch (sem cache layer ainda)

**Exemplo - Auth Store:**

```typescript
// src/store/authStore.ts
import { create } from 'zustand'

interface AuthStore {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (username, password) => {
    // Simula login
    if (username === 'admin' && password === 'admin') {
      set({ isAuthenticated: true, user: { username } })
    }
  },
  logout: () => set({ isAuthenticated: false, user: null })
}))
```

### 4️⃣ Camada de Dados/API

```
src/
└── mocks/
    ├── browser.ts         # Setup MSW
    └── handlers.ts        # API handlers
```

**Mock Service Worker (MSW):**

Intercepta requisições HTTP e retorna dados simulados:

```typescript
// src/mocks/handlers.ts
export const handlers = [
  http.get('/api/clients', () => {
    return HttpResponse.json(dbClients)
  }),
  
  http.post('/api/loans', async ({ request }) => {
    const newLoan = await request.json()
    dbLoans.push({ ...newLoan, id: generateId() })
    return HttpResponse.json(newLoan, { status: 201 })
  })
]
```

## Fluxo de Dados

### Fluxo de Leitura (GET)

```
┌──────────┐     ┌────────┐     ┌─────────┐     ┌──────────┐
│  Page    │────▶│  Fetch │────▶│   MSW   │────▶│ Handler  │
│Component │     │  API   │     │Intercept│     │ Response │
└──────────┘     └────────┘     └─────────┘     └──────────┘
     ▲                                                 │
     │                                                 │
     └─────────────── setState(data) ◀────────────────┘
```

**Exemplo:**

```typescript
// src/pages/LoansPage.tsx
export function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/loans')                    // 1. Requisição
      .then(res => res.json())             // 2. MSW intercepta
      .then(data => {                      // 3. Handler responde
        setLoans(data)                     // 4. Atualiza estado
        setLoading(false)
      })
  }, [])
  
  return <div>{/* Renderiza loans */}</div>
}
```

### Fluxo de Escrita (POST/PATCH)

```
┌──────────┐     ┌────────┐     ┌─────────┐     ┌──────────┐
│ Dialog   │────▶│  POST  │────▶│   MSW   │────▶│ Handler  │
│(Form)    │     │  API   │     │Intercept│     │ Mutate DB│
└──────────┘     └────────┘     └─────────┘     └──────────┘
                                                       │
┌──────────┐                                           │
│Refetch   │◀──────────── Success Callback ◀───────────┘
│List      │
└──────────┘
```

**Exemplo:**

```typescript
// src/components/loans/LoanDialog.tsx
const handleSubmit = async (data: LoanFormData) => {
  await fetch('/api/loans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  onLoanAdded()  // Callback para refetch da lista
  setOpen(false)
}
```

## Roteamento

### Estrutura de Rotas

```
/                           → Redirect to /dashboard (se autenticado)
/login                      → LoginPage (público)

/dashboard                  → DashboardPage (privado)
/clients                    → ClientsPage (privado)
/clients/:id                → ClientDetailsPage (privado)
/loans                      → LoansPage (privado)
/loans/:id                  → LoanDetailsPage (privado)
/close-month                → CloseMonthPage (privado)
```

### Implementação (React Router v6)

```typescript
// src/App.tsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDetailsPage />} />
          <Route path="loans" element={<LoansPage />} />
          <Route path="loans/:id" element={<LoanDetailsPage />} />
          <Route path="close-month" element={<CloseMonthPage />} />
        </Route>
      </Routes>
    </Router>
  )
}
```

### PrivateRoute Guard

```typescript
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}
```

## Autenticação

### Fluxo de Autenticação

```
┌─────────┐   1. Login    ┌──────────┐   2. Validate   ┌──────────┐
│  User   │──────────────▶│LoginPage │────────────────▶│AuthStore │
└─────────┘               └──────────┘                 └──────────┘
                                                             │
                                                       3. Set Auth
                                                             │
┌─────────┐   4. Redirect  ┌──────────┐                     │
│Dashboard│◀───────────────│  Router  │◀────────────────────┘
└─────────┘                └──────────┘
```

### Credenciais Demo

```
Username: admin
Password: admin
```

### Proteção de Rotas

Todas as rotas dentro de `Layout` são protegidas:

```typescript
// Verifica autenticação antes de renderizar
const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

if (!isAuthenticated) {
  return <Navigate to="/login" />
}
```

## Mock API (MSW)

### Setup

```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// src/main.tsx
if (import.meta.env.DEV) {
  await worker.start()
}
```

### Banco de Dados In-Memory

```typescript
// src/mocks/handlers.ts
let dbClients = [...initialClients]  // Seed data
let dbLoans = [...initialLoans]

// CRUD simples
export const handlers = [
  http.get('/api/clients', () => HttpResponse.json(dbClients)),
  http.post('/api/clients', ({ request }) => {
    const client = await request.json()
    dbClients.push({ ...client, id: generateId() })
    return HttpResponse.json(client, { status: 201 })
  })
]
```

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/clients` | Lista todos os clientes |
| POST | `/api/clients` | Cria novo cliente |
| GET | `/api/clients/:id` | Busca cliente por ID |
| GET | `/api/loans` | Lista empréstimos (com cálculos) |
| POST | `/api/loans` | Cria novo empréstimo |
| GET | `/api/loans/:id` | Busca empréstimo por ID |
| PATCH | `/api/loans/:id/pay` | Registra pagamento |
| GET | `/api/dashboard` | Dados agregados dashboard |
| GET | `/api/alerts` | Empréstimos a vencer/atrasados |

## Gerenciamento de Estado

### Estado Global (Zustand)

```typescript
// Apenas para dados que precisam ser compartilhados
✅ Autenticação (isAuthenticated, user)
❌ Listas de dados (mantemos local com useState)
```

### Estado Local (useState)

```typescript
// Cada página gerencia seu próprio estado
const [clients, setClients] = useState<Client[]>([])
const [loading, setLoading] = useState(true)
const [search, setSearch] = useState("")
```

### Estado de Formulários (React Hook Form + Zod)

```typescript
const form = useForm<ClientFormData>({
  resolver: zodResolver(clientSchema),
  defaultValues: { name: "", phone: "", address: "" }
})
```

## Otimizações

### Performance

✅ **React.memo** - Componentes puros não re-renderizam  
✅ **useMemo** - Cálculos caros são memoizados  
✅ **useCallback** - Callbacks estáveis  
✅ **Code Splitting** - Routes separadas (Vite automático)  
✅ **Tree Shaking** - Imports específicos  

### Carregamento

✅ **Skeleton Loaders** - Feedback visual durante loading  
✅ **Stagger Animations** - Entrada progressiva de elementos  
✅ **Lazy Loading** - Imagens e componentes pesados  

### Acessibilidade

✅ **Radix UI Primitives** - WAI-ARIA completo  
✅ **Keyboard Navigation** - Todas as interações via teclado  
✅ **Focus Management** - Dialogs e dropdowns  
✅ **Screen Reader** - Labels e descrições  

---

## Próximos Passos

### Backend Real
- Integrar com API Node.js/Express
- Autenticação JWT
- PostgreSQL ou MongoDB
- Upload real de arquivos

### State Management
- React Query para cache de servidor
- Optimistic updates
- Infinite scroll

### Features
- PWA (Service Worker real)
- Notificações push
- Export PDF real
- Gráficos mais complexos

---

**Última Atualização:** Novembro 2024

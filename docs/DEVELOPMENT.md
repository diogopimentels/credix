# 👨‍💻 Guia de Desenvolvimento - Credimestre

Guia completo para desenvolver e extender o Credimestre.

## 📑 Índice

- [Setup do Ambiente](#setup-do-ambiente)
- [Convenções de Código](#convenções-de-código)
- [Como Adicionar Features](#como-adicionar-features)
- [Como Criar Componentes](#como-criar-componentes)
- [Como Adicionar Rotas](#como-adicionar-rotas)
- [Como Trabalhar com Forms](#como-trabalhar-com-forms)
- [Como Adicionar Endpoints MSW](#como-adicionar-endpoints-msw)
- [Debugging](#debugging)
- [Performance](#performance)
- [Testes](#testes)

## Setup do Ambiente

### Requisitos

```bash
Node.js: >= 18.0.0
npm: >= 9.0.0
```

### Instalação

```bash
# Clone o projeto
git clone <repo-url>
cd credimestre-prototype

# Instale dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### VSCode Extensions Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### VSCode Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Convenções de Código

### Nomenclatura

```typescript
// Componentes: PascalCase
export function ClientDialog() {}

// Funções/Variáveis: camelCase
const fetchClients = async () => {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = '/api'

// Tipos/Interfaces: PascalCase
interface ClientFormData {}
type LoanStatus = "PAID" | "LATE"

// Arquivos de Componentes: PascalCase
ClientDialog.tsx
DashboardPage.tsx

// Arquivos Utilitários: camelCase
calculations.ts
authStore.ts
```

### Estrutura de Arquivo

```typescript
// 1. Imports externos
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

// 2. Imports internos - UI
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 3. Imports internos - Outros
import { useAuthStore } from "@/store/authStore"
import { formatCurrency } from "@/utils/calculations"

// 4. Imports de tipos
import type { Client, Loan } from "@/mocks/handlers"

// 5. Types/Interfaces locais
interface MyComponentProps {
  title: string
  onClose: () => void
}

// 6. Constantes
const DEFAULT_PAGE_SIZE = 10

// 7. Componente principal
export function MyComponent({ title, onClose }: MyComponentProps) {
  // Estados
  const [data, setData] = useState([])
  
  // Hooks
  const navigate = useNavigate()
  
  // Effects
  useEffect(() => {
    // ...
  }, [])
  
  // Handlers
  const handleSubmit = () => {
    // ...
  }
  
  // Render
  return <div>{/* JSX */}</div>
}

// 8. Componentes auxiliares (se pequenos)
function SubComponent() {
  return <div>...</div>
}
```

### TypeScript

✅ **Sempre use tipos explícitos**

```typescript
// ❌ Evite
const clients = []
const [data, setData] = useState([])

// ✅ Prefira
const clients: Client[] = []
const [data, setData] = useState<Client[]>([])
```

✅ **Use interfaces para objetos**

```typescript
interface ClientDialogProps {
  client?: Client
  onSave: (client: Client) => void
}
```

✅ **Use types para unions**

```typescript
type LoanStatus = "PAID" | "LATE" | "ONGOING"
type Variant = "default" | "outline" | "ghost"
```

### Componentes React

✅ **Use componentes funcionais**

```typescript
// ✅ Prefira
export function MyComponent() {
  return <div>...</div>
}

// ❌ Evite
export const MyComponent = () => {
  return <div>...</div>
}
```

✅ **Destructure props**

```typescript
// ✅ Prefira
function Button({ variant, children }: ButtonProps) {
  return <button>{children}</button>
}

// ❌ Evite
function Button(props: ButtonProps) {
  return <button>{props.children}</button>
}
```

✅ **Default values em destructuring**

```typescript
function Button({ 
  variant = "default",
  size = "md",
  children 
}: ButtonProps) {
  // ...
}
```

## Como Adicionar Features

### 1. Planejar

- Defina os requisitos
- Identifique componentes necessários
- Planeje a estrutura de dados
- Considere UX mobile

### 2. Criar Tipos

```typescript
// src/mocks/handlers.ts
export interface Payment {
  id: string
  loanId: string
  amount: number
  paidDate: string
  createdAt: string
}
```

### 3. Adicionar Endpoint MSW

```typescript
// src/mocks/handlers.ts
http.get('/api/payments', () => {
  return HttpResponse.json(dbPayments)
}),

http.post('/api/payments', async ({ request }) => {
  const payment = await request.json()
  dbPayments.push({ ...payment, id: generateId() })
  return HttpResponse.json(payment, { status: 201 })
})
```

### 4. Criar Componente/Página

```typescript
// src/pages/PaymentsPage.tsx
export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  
  useEffect(() => {
    fetch('/api/payments')
      .then(res => res.json())
      .then(setPayments)
  }, [])
  
  return (
    <div>
      <PageHeader title="Pagamentos" />
      <Table>...</Table>
    </div>
  )
}
```

### 5. Adicionar Rota

```typescript
// src/App.tsx
<Route path="payments" element={<PaymentsPage />} />
```

### 6. Adicionar ao Menu

```typescript
// src/components/layout/Sidebar.tsx
<Link to="/payments">
  <CreditCard className="h-5 w-5" />
  Pagamentos
</Link>
```

## Como Criar Componentes

### Componente UI Base

```typescript
// src/components/ui/badge.tsx
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning"
}

export function Badge({ 
  variant = "default",
  className,
  ...props 
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          "bg-primary text-primary-foreground": variant === "default",
          "bg-success/10 text-success": variant === "success",
          "bg-warning/10 text-warning": variant === "warning"
        },
        className
      )}
      {...props}
    />
  )
}
```

### Componente de Negócio

```typescript
// src/components/clients/ClientCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"
import type { Client } from "@/mocks/handlers"

interface ClientCardProps {
  client: Client
  onClick?: () => void
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:bg-muted/40 transition-colors"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-base">{client.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{client.phone}</p>
      </CardContent>
    </Card>
  )
}
```

## Como Adicionar Rotas

### 1. Criar Página

```typescript
// src/pages/NewPage.tsx
export function NewPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Nova Página" />
      {/* Conteúdo */}
    </div>
  )
}
```

### 2. Adicionar em App.tsx

```typescript
// src/App.tsx
import { NewPage } from "@/pages/NewPage"

<Route path="new-page" element={<NewPage />} />
```

### 3. Adicionar Link no Menu

```typescript
// src/components/layout/Sidebar.tsx
<Link 
  to="/new-page"
  className={cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg",
    location.pathname === "/new-page" ? "bg-primary text-white" : ""
  )}
>
  <Icon className="h-5 w-5" />
  Nova Página
</Link>
```

## Como Trabalhar com Forms

### Setup com React Hook Form + Zod

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// 1. Schema Zod
const formSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  amount: z.number().min(1, "Valor deve ser maior que 0")
})

type FormData = z.infer<typeof formSchema>

// 2. Setup do form
export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: 0
    }
  })
  
  // 3. Submit handler
  const onSubmit = async (data: FormData) => {
    await fetch('/api/resource', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }
  
  // 4. Render
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("name")} />
      {form.formState.errors.name && (
        <p className="text-sm text-destructive">
          {form.formState.errors.name.message}
        </p>
      )}
      
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  )
}
```

## Como Adicionar Endpoints MSW

### GET

```typescript
// src/mocks/handlers.ts
http.get('/api/resource', () => {
  return HttpResponse.json(dbResource)
})
```

### POST

```typescript
http.post('/api/resource', async ({ request }) => {
  const newItem = await request.json()
  const item = { 
    ...newItem, 
    id: `resource-${Date.now()}`,
    createdAt: new Date().toISOString()
  }
  dbResource.push(item)
  return HttpResponse.json(item, { status: 201 })
})
```

### GET by ID

```typescript
http.get('/api/resource/:id', ({ params }) => {
  const item = dbResource.find(r => r.id === params.id)
  if (!item) return new HttpResponse(null, { status: 404 })
  return HttpResponse.json(item)
})
```

### PATCH

```typescript
http.patch('/api/resource/:id', async ({ params, request }) => {
  const updates = await request.json()
  const index = dbResource.findIndex(r => r.id === params.id)
  
  if (index === -1) return new HttpResponse(null, { status: 404 })
  
  dbResource[index] = { ...dbResource[index], ...updates }
  return HttpResponse.json(dbResource[index])
})
```

### DELETE

```typescript
http.delete('/api/resource/:id', ({ params }) => {
  const index = dbResource.findIndex(r => r.id === params.id)
  
  if (index === -1) return new HttpResponse(null, { status: 404 })
  
  dbResource.splice(index, 1)
  return new HttpResponse(null, { status: 204 })
})
```

## Debugging

### React DevTools

```bash
# Chrome Extension
https://chrome.google.com/webstore/detail/react-developer-tools
```

### Network Tab

- Abra DevTools (F12)
- Vá para Network
- Filtre por "Fetch/XHR"
- Observe requisições `/api/*`

### Console Logging

```typescript
// Durante fetch
fetch('/api/loans')
  .then(res => {
    console.log('Response:', res)
    return res.json()
  })
  .then(data => {
    console.log('Data:', data)
    setLoans(data)
  })
```

### Zustand DevTools

```typescript
// src/store/authStore.ts
import { devtools } from 'zustand/middleware'

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      // ...
    }),
    { name: 'AuthStore' }
  )
)
```

## Performance

### React.memo

```typescript
export const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // Só re-renderiza se 'data' mudar
  return <div>{/* ... */}</div>
})
```

### useMemo

```typescript
const filteredLoans = useMemo(() => {
  return loans.filter(loan => loan.status === filter)
}, [loans, filter])
```

### useCallback

```typescript
const handleSubmit = useCallback((data: FormData) => {
  // Função estável entre renders
  saveData(data)
}, [])  // Dependencies
```

## Testes

### Vitest Setup

```typescript
// tests/example.test.ts
import { describe, it, expect } from 'vitest'
import { calculateLoanDetails } from '@/utils/calculations'

describe('calculateLoanDetails', () => {
  it('should calculate correct interest', () => {
    const result = calculateLoanDetails(1000, new Date(), null, 20)
    expect(result.interestAmount).toBe(400)  // 40%
  })
  
  it('should calculate fine for late loans', () => {
    const startDate = new Date('2024-11-01')
    const paidDate = new Date('2024-11-25')  // 4 days late
    
    const result = calculateLoanDetails(1000, startDate, paidDate, 20)
    expect(result.daysLate).toBe(4)
    expect(result.fineAmount).toBe(200)  // 4 × 50
  })
})
```

### Run Tests

```bash
npm run test
```

---

## Próximos Passos

### Backend Real

1. Criar API com Node.js/Express
2. Configurar PostgreSQL
3. Implementar autenticação JWT
4. Migrar de MSW para fetch real

### Features Avançadas

- Upload real de arquivos
- Notificações em tempo real (WebSocket)
- Export PDF com jsPDF
- Gráficos mais complexos (Dashboard)
- PWA (Service Worker, offline-first)

---

**Última Atualização:** Novembro 2024

# 🧩 Componentes do Credimestre

Documentação completa de todos os componentes da aplicação.

## 📑 Índice

- [Componentes UI Base](#componentes-ui-base)
- [Componentes de Layout](#componentes-de-layout)
- [Componentes de Dashboard](#componentes-de-dashboard)
- [Componentes de Clientes](#componentes-de-clientes)
- [Componentes de Empréstimos](#componentes-de-empréstimos)
- [Páginas](#páginas)

---

## Componentes UI Base

Componentes reutilizáveis baseados em **shadcn/ui** + **Radix UI**.

### Button

**Localização:** `src/components/ui/button.tsx`

**Descrição:** Botão customizável com várias variantes e tamanhos.

**Variantes:**
- `default` - Azul primary
- `destructive` - Vermelho para ações perigosas
- `outline` - Apenas borda
- `ghost` - Transparente
- `link` - Estilo de link

**Tamanhos:**
- `default` - Tamanho padrão
- `sm` - Pequeno
- `lg` - Grande
- `icon` - Quadrado para ícones

**Exemplo:**

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">
  Criar Empréstimo
</Button>

<Button variant="outline" size="sm" asChild>
  <Link to="/clients">Ver Detalhes</Link>
</Button>
```

---

### Card

**Localização:** `src/components/ui/card.tsx`

**Descrição:** Container com borda, sombra e padding.

**Subcomponentes:**
- `Card` - Container principal
- `CardHeader` - Cabeçalho
- `CardTitle` - Título
- `CardDescription` - Descrição
- `CardContent` - Conteúdo
- `CardFooter` - Rodapé

**Exemplo:**

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card className="bg-card/40 backdrop-blur-xl">
  <CardHeader>
    <CardTitle>Clientes</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
</Card>
```

---

### Dialog

**Localização:** `src/components/ui/dialog.tsx`

**Descrição:** Modal acessível com overlay.

**Subcomponentes:**
- `Dialog` - Container raiz
- `DialogTrigger` - Botão para abrir
- `DialogContent` - Conteúdo do modal
- `DialogHeader` - Cabeçalho
- `DialogTitle` - Título
- `DialogDescription` - Descrição
- `DialogFooter` - Rodapé com ações

**Exemplo:**

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Novo Cliente</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Cadastrar Cliente</DialogTitle>
    </DialogHeader>
    {/* Form */}
  </DialogContent>
</Dialog>
```

---

### Input

**Localização:** `src/components/ui/input.tsx`

**Descrição:** Campo de texto estilizado.

**Propriedades:**
- `type` - text, password, email, etc
- `placeholder` - Texto de placeholder
- `disabled` - Desabilita o input
- Todas as props nativas de `<input>`

**Exemplo:**

```tsx
import { Input } from "@/components/ui/input"

<Input
  type="text"
  placeholder="Nome completo"
  {...register("name")}
/>
```

---

### Table

**Localização:** `src/components/ui/table.tsx`

**Descrição:** Tabela responsiva e estilizada.

**Subcomponentes:**
- `Table` - Container principal
- `TableHeader` - Cabeçalho
- `TableBody` - Corpo
- `TableRow` - Linha
- `TableHead` - Célula de cabeçalho
- `TableCell` - Célula de dados

**Exemplo:**

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Telefone</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {clients.map(client => (
      <TableRow key={client.id}>
        <TableCell>{client.name}</TableCell>
        <TableCell>{client.phone}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### StatusBadge

**Localização:** `src/components/ui/StatusBadge.tsx`

**Descrição:** Badge colorido para indicar status.

**Props:**

```typescript
interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info" | "neutral"
  children: React.ReactNode
  className?: string
}
```

**Estilos por Status:**
- `success` - Verde com glow (Pago)
- `warning` - Amarelo/Laranja (A Vencer)
- `error` - Vermelho (Atrasado)
- `neutral` - Cinza (Em Andamento)
- `info` - Azul

**Exemplo:**

```tsx
import { StatusBadge } from "@/components/ui/StatusBadge"

<StatusBadge status="success">Pago</StatusBadge>
<StatusBadge status="error">Atrasado</StatusBadge>
```

---

### PageHeader

**Localização:** `src/components/ui/PageHeader.tsx`

**Descrição:** Cabeçalho padrão de página com breadcrumbs e ações.

**Props:**

```typescript
interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
}
```

**Exemplo:**

```tsx
import { PageHeader } from "@/components/ui/PageHeader"

<PageHeader
  title="Empréstimos"
  description="Gerencie empréstimos, registre pagamentos"
  breadcrumbs={[
    { label: "Dashboard", href: "/" },
    { label: "Empréstimos" }
  ]}
  actions={<LoanDialog />}
/>
```

---

## Componentes de Layout

### Layout

**Localização:** `src/components/layout/Layout.tsx`

**Descrição:** Layout principal da aplicação autenticada.

**Estrutura:**

```tsx
<div className="flex h-screen">
  <Sidebar />  {/* Desktop */}
  <main className="flex-1">
    <Outlet />  {/* React Router */}
  </main>
  <MobileNav />  {/* Mobile */}
</div>
```

---

### Sidebar

**Localização:** `src/components/layout/Sidebar.tsx`

**Descrição:** Menu lateral para desktop.

**Features:**
- Logo Credimestre
- Links de navegação com ícones
- Indicador de rota ativa
- Botão de logout
- Theme toggle (Light/Dark)

**Links:**
- 📊 Dashboard
- 👥 Clientes
- 💰 Empréstimos
- 📅 Fechamento

**Responsive:**
- Visible: `md:flex` (768px+)
- Hidden: Mobile

---

### MobileNav

**Localização:** `src/components/layout/MobileNav.tsx`

**Descrição:** Barra de navegação inferior para mobile.

**Features:**
- Fixed bottom
- 4 links principais
- Ícones + labels
- Indicador de ativo

**Responsive:**
- Visible: `md:hidden` (<768px)

---

## Componentes de Dashboard

### StatCard

**Localização:** `src/components/dashboard/StatCard.tsx`

**Descrição:** Card de métrica com ícone, título, valor e tendência.

**Props:**

```typescript
interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    direction: "up" | "down"
  }
  format?: "currency" | "number"
}
```

**Exemplo:**

```tsx
import { StatCard } from "@/components/dashboard/StatCard"
import { DollarSign } from "lucide-react"

<StatCard
  title="Total Emprestado"
  value={totalLent}
  icon={<DollarSign />}
  format="currency"
  trend={{ value: 12, direction: "up" }}
/>
```

---

### RevenueChart

**Localização:** `src/components/dashboard/RevenueChart.tsx`

**Descrição:** Gráfico de receita mensal usando Recharts.

**Props:**

```typescript
interface RevenueChartProps {
  data: Array<{ name: string; total: number }>
}
```

**Exemplo:**

```tsx
import { RevenueChart } from "@/components/dashboard/RevenueChart"

<RevenueChart data={[
  { name: "Jan", total: 5000 },
  { name: "Fev", total: 7500 }
]} />
```

---

## Componentes de Clientes

### ClientDialog

**Localização:** `src/components/clients/ClientDialog.tsx`

**Descrição:** Modal para criar/editar cliente.

**Props:**

```typescript
interface ClientDialogProps {
  client?: Client  // Se edição
  onClientAdded: () => void  // Callback após salvar
}
```

**Campos do Formulário:**
- Nome completo
- Telefone
- Endereço
- Notas
- Foto (upload simulado)

**Validação:** Zod Schema

```typescript
const clientSchema = z.object({
  name: z.string().min(3),
  phone: z.string().min(10),
  address: z.string().min(5),
  notes: z.string().optional()
})
```

**Exemplo:**

```tsx
import { ClientDialog } from "@/components/clients/ClientDialog"

<ClientDialog onClientAdded={fetchClients} />
```

---

## Componentes de Empréstimos

### LoanDialog

**Localização:** `src/components/loans/LoanDialog.tsx`

**Descrição:** Modal para criar empréstimo.

**Props:**

```typescript
interface LoanDialogProps {
  onLoanAdded: () => void
}
```

**Campos:**
- Cliente (Select)
- Valor do empréstimo
- Data de início
- Prazo em dias (padrão: 20)

**Cálculo Automático:**
- Juros: 40%
- Total: Valor + Juros

**Exemplo:**

```tsx
import { LoanDialog } from "@/components/loans/LoanDialog"

<LoanDialog onLoanAdded={fetchLoans} />
```

---

### PaymentDialog

**Localização:** `src/components/loans/PaymentDialog.tsx`

**Descrição:** Modal para registrar pagamento de empréstimo.

**Props:**

```typescript
interface PaymentDialogProps {
  loan: Loan
  onPaymentRegistered: () => void
}
```

**Campos:**
- Data do pagamento
- Valor total calculado (readonly)
- Confirmação

**Cálculo:**
- Se atrasado: Valor + Juros + Multa
- Se em dia: Valor apenas

---

## Páginas

### LoginPage

**Localização:** `src/pages/LoginPage.tsx`

**Features:**
- Card centralizado com glassmorphism
- Input username/password
- Validação inline
- Animação de entrada

**Credenciais Demo:**
```
Username: admin
Password: admin
```

---

### DashboardPage

**Localização:** `src/pages/DashboardPage.tsx`

**Seções:**
1. **StatCards** - 4 métricas principais
2. **RevenueChart** - Gráfico últimos 6 meses
3. **Recent Loans** - Últimos 5 empréstimos

**Fetch:**
```typescript
GET /api/dashboard
```

---

### ClientsPage

**Localização:** `src/pages/ClientsPage.tsx`

**Features:**
- PageHeader com botão "Novo Cliente"
- Input de busca (nome ou telefone)
- Tabela desktop com foto, nome, telefone, endereço
- Cards mobile responsivos
- Skeleton loaders
- Dropdown de ações (Ver, Editar, Excluir)

**Fetch:**
```typescript
GET /api/clients
```

---

### ClientDetailsPage

**Localização:** `src/pages/ClientDetailsPage.tsx`

**Params:**
```typescript
const { id } = useParams()
```

**Seções:**
1. **Info do Cliente** - Dados pessoais
2. **Empréstimos Relacionados** - Tabela de empréstimos

**Fetch:**
```typescript
GET /api/clients/:id
GET /api/loans?clientId=:id
```

---

### LoansPage

**Localização:** `src/pages/LoansPage.tsx`

**Features:**
- PageHeader com botão "Novo Empréstimo"
- Select de filtro por status
- Tabela com colunas:
  - Cliente
  - Valor Inicial
  - Total Atual
  - Vencimento
  - Status (Badge)
  - Ações
- Skeleton loaders

**Filtros:**
- Todos
- Em Andamento
- A Vencer
- Vence Hoje
- Atrasado
- Pago

**Fetch:**
```typescript
GET /api/loans
```

---

### LoanDetailsPage

**Localização:** `src/pages/LoanDetailsPage.tsx`

**Params:**
```typescript
const { id } = useParams()
```

**Seções:**
1. **Resumo** - Valor, juros, total, status
2. **Timeline** - Histórico de pagamentos
3. **Ações** - Botão "Registrar Pagamento"

**Fetch:**
```typescript
GET /api/loans/:id
```

---

### CloseMonthPage

**Localização:** `src/pages/CloseMonthPage.tsx`

**Features:**
- Seletor de mês
- Cards de totais
- Lista de empréstimos do período
- Botão "Gerar Relatório PDF" (mock)

---

## Convenções de Componentes

### Nomenclatura

```
PascalCase para componentes:
- Button.tsx
- ClientDialog.tsx
- DashboardPage.tsx

camelCase para utilitários:
- calculations.ts
- authStore.ts
```

### Estrutura de Arquivo

```typescript
// Imports
import { useState } from "react"
import { Button } from "@/components/ui/button"

// Types/Interfaces
interface MyComponentProps {
  title: string
}

// Component
export function MyComponent({ title }: MyComponentProps) {
  const [state, setState] = useState()
  
  return <div>{title}</div>
}
```

### Props

✅ **Use interfaces para props**
✅ **Destructure props**
✅ **Default values quando apropriado**

```typescript
interface ButtonProps {
  variant?: "default" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function Button({ 
  variant = "default",
  size = "md",
  children 
}: ButtonProps) {
  // ...
}
```

---

**Última Atualização:** Novembro 2024

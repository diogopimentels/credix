# 🎨 Design System - Credimestre

Sistema de design completo do Credimestre com paleta de cores, tipografia, componentes e padrões visuais.

## 📑 Índice

- [Filosofia de Design](#filosofia-de-design)
- [Paleta de Cores](#paleta-de-cores)
- [Tipografia](#tipografia)
- [Espaçamento](#espaçamento)
- [Bordas e Sombras](#bordas-e-sombras)
- [Animações](#animações)
- [Ícones](#ícones)
- [Componentes Visuais](#componentes-visuais)
- [Padrões de Interface](#padrões-de-interface)

## Filosofia de Design

### Princípios

🎯 **Minimalismo Funcional** - Apenas o necessário, nada supérfluo  
✨ **Premium & Moderno** - Glassmorphism, gradientes e micro-animações  
📱 **Mobile First** - Design responsivo desde o início  
♿ **Acessível** - WCAG 2.1 AA compliance  
⚡ **Performático** - Animações leves e otimizadas  

### Inspirações

- **Linear** - Minimalismo e tipografia forte
- **Vercel** - Contrastes e gradientes sutis
- **Stripe** - Elegância e profissionalismo
- **Notion** - Clareza e organização

## Paleta de Cores

### Cores Primárias - Credix Identity

```css
/* Primary - Credix Blue-Purple */
--primary: #4C5FD7
--primary-rgb: 76, 95, 215

/* Variações */
--primary-50:  #EEF2FF
--primary-100: #E0E7FF
--primary-200: #C7D2FE
--primary-300: #A5B4FC
--primary-400: #818CF8
--primary-500: #6366F1
--primary-600: #4F46E5  /* Base */
--primary-700: #4338CA
--primary-800: #3730A3
--primary-900: #312E81
```

### Cores Semânticas

```css
/* Success - Verde */
--success: #22C55E
--success-rgb: 34, 197, 94

/* Warning - Amarelo/Laranja */
--warning: #F59E0B
--warning-rgb: 245, 158, 11

/* Destructive - Vermelho */
--destructive: #EF4444
--destructive-rgb: 239, 68, 68

/* Muted - Cinza Neutro */
--muted: #A0A8C0
--muted-rgb: 160, 168, 192
```

### Cores de Fundo

#### Light Mode

```css
--background: #F8F9FC        /* Fundo principal */
--foreground: #0F1117        /* Texto principal */

--card: #FFFFFF              /* Cards */
--card-foreground: #0F1117

--muted: #F1F5F9             /* Elementos sutis */
--muted-foreground: #64748B

--border: #E2E8F0            /* Bordas */
--input: #E2E8F0             /* Campos de input */
```

#### Dark Mode

```css
--background: #0F1117        /* Fundo principal */
--foreground: #F8FAFC        /* Texto principal */

--card: #1E1E2E              /* Cards */
--card-foreground: #F8FAFC

--muted: #292F3F             /* Elementos sutis */
--muted-foreground: #94A3B8

--border: #292F3F            /* Bordas */
--input: #292F3F             /* Campos de input */
```

### Uso das Cores

#### StatusBadge

```
🟢 Success (Verde)   → PAID (Pago)
🟡 Warning (Amarelo) → NEAR_DUE, DUE (A Vencer, Vence Hoje)
🔴 Error (Vermelho)  → LATE (Atrasado)
⚪ Neutral (Cinza)   → ONGOING (Em Andamento)
```

#### Botões

```tsx
<Button variant="default">     {/* Primary Blue */}
<Button variant="destructive"> {/* Red */}
<Button variant="outline">     {/* Border only */}
<Button variant="ghost">       {/* Transparent */}
<Button variant="link">        {/* Link style */}
```

## Tipografia

### Fonte

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

font-family: 'Inter', sans-serif;
```

### Escalas

#### Tamanhos

```css
text-xs:    0.75rem   (12px)  → Labels pequenos, metadados
text-sm:    0.875rem  (14px)  → Body secundário, descrições
text-base:  1rem      (16px)  → Body principal
text-lg:    1.125rem  (18px)  → Subtítulos
text-xl:    1.25rem   (20px)  → Títulos de seção
text-2xl:   1.5rem    (24px)  → Títulos de página
text-3xl:   1.875rem  (30px)  → Títulos principais
text-4xl:   2.25rem   (36px)  → Hero text
```

#### Pesos

```css
font-light:     300  → Textos leves (raramente usado)
font-normal:    400  → Body padrão
font-medium:    500  → Labels, botões
font-semibold:  600  → Subtítulos
font-bold:      700  → Títulos
font-extrabold: 800  → Hero text (raramente usado)
```

#### Line Height

```css
leading-none:    1
leading-tight:   1.25   → Headings
leading-snug:    1.375
leading-normal:  1.5    → Body text
leading-relaxed: 1.625
leading-loose:   2
```

### Hierarquia de Texto

```tsx
// H1 - Títulos de Página
<h1 className="text-3xl font-bold tracking-tight">
  Dashboard
</h1>

// H2 - Seções
<h2 className="text-2xl font-semibold tracking-tight">
  Empréstimos Recentes
</h2>

// H3 - Subsections
<h3 className="text-xl font-medium">
  Detalhes do Cliente
</h3>

// Body
<p className="text-base text-muted-foreground">
  Descrição ou parágrafo de texto.
</p>

// Small / Caption
<span className="text-sm text-muted-foreground">
  Metadado ou informação secundária
</span>
```

## Espaçamento

### Sistema de 4px

```css
Space Scale (Tailwind):
0:    0px
1:    4px    → Espaços muito pequenos
2:    8px    → Padding interno de tags
3:    12px   → Entre elementos relacionados
4:    16px   → Padding padrão de cards
6:    24px   → Entre seções
8:    32px   → Espaçamento grande
12:   48px   → Entre blocos principais
16:   64px   → Margem de página
```

### Grid & Layout

```css
Container:
- Desktop: max-w-7xl (1280px)
- Padding: px-4 sm:px-6 lg:px-8

Gaps:
- gap-2:  8px  → Entre itens pequenos
- gap-4:  16px → Entre cards
- gap-6:  24px → Entre seções
- gap-8:  32px → Entre blocos
```

## Bordas e Sombras

### Border Radius

```css
--radius: 0.5rem  (8px)  → Base

rounded-sm:   4px   → Tags pequenas
rounded-md:   6px   → Inputs, botões pequenos
rounded-lg:   8px   → Cards, botões padrão
rounded-xl:   12px  → Cards maiores
rounded-2xl:  16px  → Modals
rounded-3xl:  24px  → Elementos especiais
rounded-full: 9999px → Avatares, badges
```

### Shadows

```css
/* Soft - Elementos sutis */
shadow-soft: 0 2px 10px rgba(0, 0, 0, 0.03)

/* Medium - Cards */
shadow-medium: 0 4px 20px rgba(0, 0, 0, 0.06)

/* Hard - Menus, Dropdowns */
shadow-hard: 0 8px 30px rgba(0, 0, 0, 0.08)

/* Glow - Primary Accent */
shadow-glow: 0 0 20px rgba(76, 95, 215, 0.5)
shadow-glow-sm: 0 0 10px rgba(76, 95, 215, 0.3)
```

### Exemplo - Card Premium

```tsx
<Card className="
  bg-card/40
  backdrop-blur-xl
  border-white/10
  shadow-2xl
  shadow-black/5
  ring-1
  ring-white/5
  rounded-xl
">
  {/* Glassmorphism effect */}
</Card>
```

## Animações

### Framer Motion

#### Container Variants

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1  // 100ms entre cada filho
    }
  }
}
```

#### Item Variants

```typescript
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
}
```

#### Uso

```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Tailwind Animations

```css
/* Fade In */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.4s ease-out; }

/* Slide Up */
@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }

/* Scale In */
@keyframes scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
```

### Transitions

```css
/* Hover - Botões e Cards */
transition-all duration-300

/* Hover - Botão de Ação */
hover:scale-105 hover:shadow-lg

/* Hover - Card */
hover:bg-muted/40

/* Focus - Inputs */
focus:ring-2 focus:ring-primary/20 focus:border-primary/50
```

## Ícones

### Lucide React

```tsx
import { 
  Home, 
  Users, 
  DollarSign, 
  Calendar,
  Search,
  Plus,
  X,
  Check,
  AlertCircle
} from "lucide-react"

// Tamanhos
<Home className="h-4 w-4" />  // 16px - Small
<Home className="h-5 w-5" />  // 20px - Default
<Home className="h-6 w-6" />  // 24px - Large
```

### Ícones por Contexto

```
📊 Dashboard     → BarChart3
👥 Clientes      → Users
💰 Empréstimos   → DollarSign
📅 Fechamento    → Calendar
⚙️  Configurações → Settings
🔍 Buscar        → Search
➕ Adicionar     → Plus
✓  Confirmar     → Check
✗  Cancelar      → X
⚠️  Alerta       → AlertCircle
```

## Componentes Visuais

### StatusBadge

```tsx
<StatusBadge status="success">
  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
  Pago
</StatusBadge>
```

**Estrutura:**
- Dot animado (pulse)
- Label com font-medium
- Padding: px-3 py-1
- Border radius: rounded-full
- Tamanho: text-xs
- Border sutil com cor do status

### StatCard

```tsx
<Card className="relative overflow-hidden">
  {/* Icon Background Glow */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
  
  {/* Icon */}
  <div className="p-3 bg-primary/10 rounded-lg w-fit">
    <DollarSign className="h-5 w-5 text-primary" />
  </div>
  
  {/* Content */}
  <p className="text-sm text-muted-foreground">Total Emprestado</p>
  <h3 className="text-2xl font-bold">R$ 25.000,00</h3>
  
  {/* Trend */}
  <span className="text-xs text-success flex items-center gap-1">
    <TrendingUp className="h-3 w-3" />
    +12%
  </span>
</Card>
```

### PageHeader

```tsx
<div className="space-y-2">
  {/* Breadcrumbs */}
  <nav className="flex items-center gap-2 text-sm text-muted-foreground">
    <Link to="/" className="hover:text-foreground">Dashboard</Link>
    <ChevronRight className="h-4 w-4" />
    <span className="text-foreground">Empréstimos</span>
  </nav>
  
  {/* Title & Actions */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Empréstimos</h1>
      <p className="text-muted-foreground">Gerencie empréstimos...</p>
    </div>
    <Button>+ Novo Empréstimo</Button>
  </div>
</div>
```

## Padrões de Interface

### Loading States - Skeleton

```tsx
{loading ? (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    ))}
  </div>
) : (
  <ActualContent />
)}
```

### Empty States

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
    <Search className="h-8 w-8 opacity-50" />
  </div>
  <h3 className="text-lg font-medium">Nenhum cliente encontrado</h3>
  <p className="text-sm text-muted-foreground mt-1">
    Tente buscar por outro termo ou adicione um novo cliente.
  </p>
</div>
```

### FormFields

```tsx
<div className="space-y-2">
  <Label htmlFor="name">Nome Completo</Label>
  <Input 
    id="name" 
    placeholder="João Silva"
    className="bg-background/50 border-white/10"
    {...register("name")}
  />
  {errors.name && (
    <p className="text-xs text-destructive">{errors.name.message}</p>
  )}
</div>
```

### Responsive Tables

```tsx
{/* Desktop */}
<div className="hidden md:block">
  <Table>...</Table>
</div>

{/* Mobile - Cards */}
<div className="md:hidden space-y-4">
  {items.map(item => (
    <Card key={item.id}>
      <CardContent className="p-4">
        {/* Mobile layout */}
      </CardContent>
    </Card>
  ))}
</div>
```

---

## Breakpoints Responsivos

```css
sm:  640px   → Phones landscape
md:  768px   → Tablets
lg:  1024px  → Desktop
xl:  1280px  → Large desktop
2xl: 1536px  → Extra large
```

---

**Última Atualização:** Novembro 2024

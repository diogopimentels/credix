# 💰 Credix - Sistema de Gestão de Empréstimos

> Sistema completo e moderno para gerenciamento de empréstimos pessoais, clientes e pagamentos.

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=for-the-badge&logo=vite)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução](#-instalação-e-execução)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Design System](#-design-system)
- [Documentação Adicional](#-documentação-adicional)

## 🎯 Visão Geral

O **Credimestre** é uma aplicação web moderna e responsiva desenvolvida para facilitar a gestão de empréstimos pessoais. O sistema oferece controle completo sobre:

- 👥 **Cadastro e gestão de clientes**
- 💵 **Criação e acompanhamento de empréstimos**
- 💳 **Registro de pagamentos**
- 📊 **Dashboard com métricas em tempo real**
- 📅 **Fechamento mensal de operações**
- ⚠️ **Alertas de vencimentos e atrasos**

### Características Principais

✨ **Interface Premium** - Design moderno com glassmorphism, gradientes e micro-animações  
🎨 **Tema Dark/Light** - Suporte completo a modos claro e escuro  
📱 **Totalmente Responsivo** - Otimizado para desktop, tablet e mobile  
⚡ **Performance** - Carregamento rápido e animações fluidas  
🔐 **Autenticação** - Sistema de login seguro com Zustand  
🎭 **Mock API** - API fake completa com Mock Service Worker (MSW)  

## 🛠 Stack Tecnológica

### Core
- **React 18.2** - Biblioteca UI com Hooks
- **TypeScript 5.2** - Type safety e melhor DX
- **Vite 5.1** - Build tool ultrarrápido
- **React Router DOM 6.22** - Roteamento SPA

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - Componentes acessíveis e customizáveis
- **Radix UI** - Primitivos headless de alta qualidade
- **Framer Motion 11.0** - Animações declarativas
- **Lucide React** - Ícones modernos

### State & Data
- **Zustand 4.5** - Gerenciamento de estado global
- **React Hook Form 7.50** - Formulários performáticos
- **Zod 3.22** - Validação de schemas
- **date-fns 3.3** - Manipulação de datas

### Development
- **MSW 2.1** - Mock Service Worker para API fake
- **Vitest 1.2** - Test runner rápido
- **ESLint** - Linting e qualidade de código

## 📁 Estrutura do Projeto

```
credimestre-prototype/
├── public/                      # Arquivos estáticos
│   └── mockServiceWorker.js    # Service Worker do MSW
├── src/
│   ├── components/             # Componentes React
│   │   ├── ui/                # Componentes base (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── PageHeader.tsx
│   │   ├── layout/            # Componentes de layout
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── dashboard/         # Componentes do dashboard
│   │   │   ├── StatCard.tsx
│   │   │   └── RevenueChart.tsx
│   │   ├── clients/           # Componentes de clientes
│   │   │   └── ClientDialog.tsx
│   │   └── loans/             # Componentes de empréstimos
│   │       ├── LoanDialog.tsx
│   │       └── PaymentDialog.tsx
│   ├── pages/                 # Páginas da aplicação
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ClientsPage.tsx
│   │   ├── ClientDetailsPage.tsx
│   │   ├── LoansPage.tsx
│   │   ├── LoanDetailsPage.tsx
│   │   └── CloseMonthPage.tsx
│   ├── mocks/                 # Mock API (MSW)
│   │   ├── browser.ts         # Setup MSW para browser
│   │   └── handlers.ts        # API handlers e dados fake
│   ├── store/                 # Zustand stores
│   │   └── authStore.ts       # Store de autenticação
│   ├── utils/                 # Utilitários
│   │   ├── calculations.ts    # Cálculos de empréstimos
│   │   └── cn.ts             # Merge classes Tailwind
│   ├── lib/                   # Bibliotecas e configs
│   │   └── utils.ts
│   ├── App.tsx                # Componente raiz
│   ├── main.tsx               # Entry point
│   ├── index.css              # Estilos globais + Tailwind
│   └── vite-env.d.ts          # Types do Vite
├── .eslintrc.cjs              # Config ESLint
├── tailwind.config.js         # Config Tailwind CSS
├── tsconfig.json              # Config TypeScript
├── vite.config.ts             # Config Vite
├── package.json               # Dependencies
└── README.md                  # Este arquivo
```

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório (ou use o código existente)
cd credimestre-prototype

# Instale as dependências
npm install
```

### Execução em Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

### Build para Produção

```bash
# Crie o build otimizado
npm run build

# Preview do build
npm run preview
```

### Testes

```bash
# Execute os testes
npm run test
```

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com credenciais (demo: admin/admin)
- Proteção de rotas privadas
- Estado de autenticação persistente

### 📊 Dashboard
- Cards com métricas principais
  - Total Emprestado
  - Total Recebido
  - Empréstimos Abertos
  - Total em Atraso
- Gráfico de receita (últimos 6 meses)
- Lista dos últimos empréstimos
- Todos os dados são dinâmicos (mock via MSW)

### 👥 Gestão de Clientes
- **Listar clientes** - Tabela responsiva com busca
- **Criar cliente** - Dialog com formulário validado
- **Ver detalhes** - Página com informações e empréstimos do cliente
- **Editar cliente** - Atualização de dados
- **Upload de foto** - Preview e simulação de upload

### 💰 Gestão de Empréstimos
- **Criar empréstimo** - Formulário com:
  - Seleção de cliente
  - Valor do empréstimo
  - Data de início
  - Prazo (padrão: 20 dias)
  - **Cálculo automático de juros (40%)**
- **Listar empréstimos** - Com filtros por status:
  - Todos
  - Em Andamento
  - A Vencer (≤3 dias)
  - Vence Hoje
  - Atrasado
  - Pago
- **Ver detalhes** - Timeline de pagamentos
- **Registrar pagamento** - Dialog com cálculo automático
- **Status visual** - Badges coloridos indicando situação

### 📅 Fechamento Mensal
- Resumo do período
- Totais de empréstimos, pagamentos, juros
- Relatórios exportáveis (mock)

### 🎨 Recursos Visuais
- Tema claro/escuro
- Glassmorphism effects
- Animações Framer Motion
- Skeleton loaders
- Micro-interações
- Gradientes e sombras premium

## 🏗 Arquitetura

### Fluxo de Autenticação

```
LoginPage → useAuthStore → setAuth(true) → Redirect → Dashboard
                ↓
          PrivateRoute verifica isAuthenticated
                ↓
         Protege todas as rotas /app/*
```

### Gerenciamento de Estado

```typescript
// Zustand store global
interface AuthStore {
  isAuthenticated: boolean
  user: User | null
  login: (credentials) => Promise<void>
  logout: () => void
}

// Local state com useState
- Listas de dados (clients, loans)
- Estados de loading
- Filtros e buscas
```

### Mock API (MSW)

O projeto usa **Mock Service Worker** para simular uma API REST completa:

```typescript
// Endpoints disponíveis:
GET    /api/clients          // Lista clientes
POST   /api/clients          // Cria cliente
GET    /api/clients/:id      // Detalhes do cliente

GET    /api/loans            // Lista empréstimos (com cálculos)
POST   /api/loans            // Cria empréstimo
GET    /api/loans/:id        // Detalhes do empréstimo
PATCH  /api/loans/:id/pay    // Registra pagamento

GET    /api/dashboard        // Dados do dashboard
GET    /api/alerts           // Alertas de vencimento
```

### Cálculo de Empréstimos

```typescript
// Regras de Negócio:
- Juros: 40% sobre o valor inicial
- Multa: R$ 50,00 por dia de atraso
- Prazo padrão: 20 dias

// Status calculados automaticamente:
- ONGOING: Empréstimo ativo, longe do vencimento
- NEAR_DUE: Faltam ≤3 dias para vencer
- DUE: Vence hoje
- LATE: Já passou do vencimento
- PAID: Empréstimo quitado
```

## 🎨 Design System

### Paleta de Cores Credix

```css
/* Primary (Credix Blue-Purple) */
--primary: #4C5FD7
--primary-foreground: #FFFFFF

/* Accent */
--accent: #1E1E2E
--accent-foreground: #FFFFFF

/* Secondary */
--secondary: #292F3F
--secondary-foreground: #E4E6EB

/* Semantic Colors */
--success: #22C55E   /* Verde */
--warning: #F59E0B   /* Amarelo/Laranja */
--destructive: #EF4444  /* Vermelho */
--muted: #A0A8C0

/* Backgrounds */
Light: #F8F9FC
Dark: #0F1117
```

### Tipografia

```css
Font Family: Inter (Google Fonts)
Headings: font-heading tracking-tight
Body: font-sans antialiased

Scales:
- text-xs: 0.75rem
- text-sm: 0.875rem
- text-base: 1rem
- text-lg: 1.125rem
- text-xl: 1.25rem
- text-2xl: 1.5rem
```

### Componentes Visuais

**StatusBadge** - Tags coloridas com status:
- `success` - Verde (Pago)
- `warning` - Amarelo (A Vencer)
- `error` - Vermelho (Atrasado)
- `neutral` - Cinza (Em Andamento)

**Cards** - Com backdrop-blur e bordas sutis:
```tsx
className="bg-card/40 backdrop-blur-xl border-white/10 shadow-2xl"
```

**Animations** - Framer Motion:
```typescript
containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}
```

## 📚 Documentação Adicional

Para informações mais detalhadas, consulte:

- [**ARCHITECTURE.md**](./docs/ARCHITECTURE.md) - Arquitetura detalhada
- [**COMPONENTS.md**](./docs/COMPONENTS.md) - Documentação de todos os componentes
- [**API.md**](./docs/API.md) - Especificação completa da API (MSW)
- [**DEVELOPMENT.md**](./docs/DEVELOPMENT.md) - Guia de desenvolvimento
- [**DESIGN_SYSTEM.md**](./docs/DESIGN_SYSTEM.md) - Design system completo

## 🤝 Contribuindo

1. Siga as convenções de código TypeScript + React
2. Use componentes do shadcn/ui quando possível
3. Mantenha a paleta de cores Credix
4. Adicione animações Framer Motion com moderação
5. Garanta responsividade mobile-first

## 📝 Licença

Este é um projeto de demonstração/protótipo para fins educacionais.

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ usando React, TypeScript e as melhores práticas modernas de desenvolvimento web.

---

**Status do Projeto**: 🟢 Protótipo Funcional  
**Última Atualização**: Novembro 2024

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Layout } from "@/components/layout/Layout"
import { LoginPage } from "@/pages/LoginPage"
import { useAuthStore } from "@/store/authStore"

import { DashboardPage } from "@/pages/DashboardPage"
import { ClientsPage } from "@/pages/ClientsPage"
import { ClientDetailsPage } from "@/pages/ClientDetailsPage"
import { LoansPage } from "@/pages/LoansPage"
import { LoanDetailsPage } from "@/pages/LoanDetailsPage"
import { CloseMonthPage } from "@/pages/CloseMonthPage"

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="credimestre-theme">
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="clients" element={<ClientsPage />} />
                        <Route path="clients/:id" element={<ClientDetailsPage />} />
                        <Route path="loans" element={<LoansPage />} />
                        <Route path="loans/:id" element={<LoanDetailsPage />} />
                        <Route path="close-month" element={<CloseMonthPage />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    )
}

export default App

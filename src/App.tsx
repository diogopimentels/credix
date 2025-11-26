import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AppLayout } from "@/components/layout/AppLayout"
import { MobileLayout } from "@/layouts/MobileLayout"
import { LoginPage } from "@/pages/LoginPage"
import { useAuthStore } from "@/store/authStore"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useEffect, useState } from "react"

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

/**
 * Layout selector - chooses between Desktop (AppLayout) and Mobile (MobileLayout)
 * Based on:
 * 1. ?mobileView=true query param (feature flag for QA)
 * 2. useIsMobile() hook (window width + UA detection)
 * 
 * Returns placeholder skeleton while detection is in progress to avoid SSR mismatch.
 */
function LayoutSelector({ children }: { children: React.ReactNode }) {
    const isMobileDevice = useIsMobile();
    const [forceMobile, setForceMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setForceMobile(params.get('mobileView') === 'true');
        }
    }, []);

    // Wait for mobile detection to complete (avoid hydration mismatch)
    if (isMobileDevice === null) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted-foreground)' }}>Loading...</p>
            </div>
        );
    }

    const useMobile = forceMobile || isMobileDevice;

    // Desktop layout (original, untouched)
    if (!useMobile) {
        return <AppLayout>{children}</AppLayout>;
    }

    // Mobile layout (new, stable, overflow-safe)
    return <MobileLayout>{children}</MobileLayout>;
}

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="credimestre-theme">
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/" element={<PrivateRoute><LayoutSelector><></></LayoutSelector></PrivateRoute>}>
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

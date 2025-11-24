import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Search, MoreHorizontal, User, Phone, MapPin } from "lucide-react"
import { Client } from "@/mocks/handlers"
import { PageHeader } from "@/components/ui/PageHeader"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { ClientDialog } from "@/components/clients/ClientDialog"

export function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchClients = () => {
        setLoading(true)
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => {
                setClients(data)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchClients()
    }, [])

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.phone.includes(search)
    )

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Clientes"
                description="Gerencie sua base de clientes e visualize históricos."
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Clientes" }
                ]}
                actions={<ClientDialog onClientAdded={fetchClients} />}
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Card className="border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden ring-1 ring-white/5">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
                        <CardTitle className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Lista de Clientes
                        </CardTitle>
                        <div className="relative w-full max-w-sm group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                            </div>
                            <Input
                                placeholder="Buscar por nome ou telefone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-b border-white/5 bg-muted/30">
                                        <TableHead className="w-[80px] pl-6">Foto</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Telefone</TableHead>
                                        <TableHead>Endereço</TableHead>
                                        <TableHead className="text-right pr-6">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i} className="border-b border-white/5">
                                                <TableCell className="pl-6"><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                                <TableCell className="pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredClients.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4 ring-1 ring-white/10">
                                                        <Search className="h-8 w-8 opacity-50" />
                                                    </div>
                                                    <p className="font-medium text-lg text-foreground">Nenhum cliente encontrado</p>
                                                    <p className="text-sm opacity-70 mt-1">Tente buscar por outro termo ou adicione um novo cliente.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredClients.map((client) => (
                                            <motion.tr
                                                key={client.id}
                                                variants={itemVariants}
                                                className="group cursor-pointer border-b border-white/5 last:border-0 hover:bg-muted/40 transition-colors duration-200"
                                            >
                                                <TableCell className="pl-6 py-4">
                                                    <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-primary/50 transition-all duration-300 shadow-lg shadow-black/10">
                                                        {client.photo ? (
                                                            <img src={client.photo} alt={client.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                                                <User className="h-5 w-5 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                                                    {client.name}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                                                <TableCell className="text-muted-foreground max-w-[200px] truncate" title={client.address}>
                                                    {client.address}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                                                                <span className="sr-only">Abrir menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-white/10 shadow-xl">
                                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                                                                <Link to={`/clients/${client.id}`}>Ver Detalhes</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 focus:text-primary">Editar Cliente</DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">Excluir</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card List */}
                        <div className="md:hidden space-y-4 p-4">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4 p-4 rounded-xl border border-white/5 bg-muted/10">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-4 w-[150px]" />
                                        </div>
                                    </div>
                                ))
                            ) : filteredClients.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>Nenhum cliente encontrado</p>
                                </div>
                            ) : (
                                filteredClients.map((client) => (
                                    <motion.div
                                        key={client.id}
                                        variants={itemVariants}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-muted/10 hover:bg-muted/20 transition-colors"
                                    >
                                        <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-white/10 shrink-0">
                                            {client.photo ? (
                                                <img src={client.photo} alt={client.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                                    <User className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground truncate">{client.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <Phone className="h-3 w-3" />
                                                <span>{client.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 truncate">
                                                <MapPin className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{client.address}</span>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-white/10">
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/clients/${client.id}`}>Ver Detalhes</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

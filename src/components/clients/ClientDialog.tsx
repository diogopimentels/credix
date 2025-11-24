import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Upload, X } from "lucide-react"
import { useState } from "react"

export function ClientDialog({ onClientAdded }: { onClientAdded?: () => void }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        photo: ""
    })

    const handlePhotoClick = () => {
        // Simulate photo upload with a random avatar
        const randomId = Math.floor(Math.random() * 1000)
        setFormData(prev => ({ ...prev, photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomId}` }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            setOpen(false)
            setFormData({ name: "", phone: "", email: "", address: "", photo: "" })
            if (onClientAdded) onClientAdded()
        } catch (error) {
            console.error("Failed to save client", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle>Novo Cliente</DialogTitle>
                    <DialogDescription>
                        Adicione as informações do novo cliente aqui. Clique em salvar quando terminar.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center mb-4">
                        <div
                            onClick={handlePhotoClick}
                            className="relative h-24 w-24 rounded-full bg-muted/50 border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors group overflow-hidden"
                        >
                            {formData.photo ? (
                                <>
                                    <img src={formData.photo} alt="Avatar" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="h-6 w-6 text-white" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary mb-1" />
                                    <span className="text-[10px] text-muted-foreground">Foto</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="João Silva"
                            className="col-span-3 bg-background/50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Telefone
                        </Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="(11) 99999-9999"
                            className="col-span-3 bg-background/50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="joao@email.com"
                            className="col-span-3 bg-background/50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                            Endereço
                        </Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Rua Exemplo, 123"
                            className="col-span-3 bg-background/50"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Cliente"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

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
import { Textarea } from "@/components/ui/textarea"
import { Client } from "@/mocks/handlers"
import { Plus, Upload, ArrowRight, User } from "lucide-react"
import { useState, useEffect } from "react"
import { UploadDocument } from "./UploadDocument"
import { UploadVideo } from "./UploadVideo"

export function ClientDialog({ client, onSave, children }: { client?: Client, onSave: () => void, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        notes: "",
        photo: "",
        residenceProof: null as File | null,
        clientVideo: null as File | null,
    })
    const [photoPreview, setPhotoPreview] = useState<string | null>("")

    useEffect(() => {
        if (open) {
            if (client) {
                setFormData({
                    name: client.name,
                    phone: client.phone,
                    address: client.address,
                    notes: client.notes || "",
                    photo: client.photo || "",
                    residenceProof: null,
                    clientVideo: null,
                })
                setPhotoPreview(client.photo || "")
            } else {
                setFormData({
                    name: "",
                    phone: "",
                    address: "",
                    notes: "",
                    photo: "",
                    residenceProof: null,
                    clientVideo: null,
                })
                setPhotoPreview("")
            }
        }
    }, [client, open])

    const handlePhotoClick = () => {
        const randomId = Math.floor(Math.random() * 1000)
        const randomAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomId}`
        setFormData(prev => ({ ...prev, photo: randomAvatarUrl }))
        setPhotoPreview(randomAvatarUrl)
    }

    const handleSave = async () => {
        setLoading(true)
        // In a real app, you'd use FormData for file uploads
        const dataToSend = { ...formData }
        // For this mock, we'll just send the metadata
        delete dataToSend.residenceProof
        delete dataToSend.clientVideo
        
        const url = client ? `/api/clients/${client.id}` : '/api/clients'
        const method = client ? 'PATCH' : 'POST'

        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            })
            setOpen(false)
            onSave()
        } catch (error) {
            console.error("Failed to save client", error)
        } finally {
            setLoading(false)
        }
    }

    const isFormValid = formData.name && formData.phone && formData.address

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl p-0">
                 <DialogHeader className="p-6 pb-4">
                    <DialogTitle>{client ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
                    <DialogDescription>
                        {client ? "Atualize as informações do cliente." : "Adicione um novo cliente à sua base de dados."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6 px-6 pb-6 overflow-y-auto max-h-[70vh]">
                    <div className="flex flex-col items-center gap-2">
                        <div
                            onClick={handlePhotoClick}
                            className="relative h-24 w-24 rounded-full bg-muted/50 border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary transition-colors group"
                        >
                            {photoPreview ? (
                                <img src={photoPreview} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                            ) : (
                                <User className="h-10 w-10 text-muted-foreground" />
                            )}
                             <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="h-6 w-6 text-white" />
                            </div>
                        </div>
                         <Button variant="link" size="sm" onClick={handlePhotoClick}>Gerar foto</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: João da Silva" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Ex: (11) 98765-4321" />
                        </div>
                         <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="address">Endereço Completo</Label>
                            <Input id="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Ex: Rua das Flores, 123, São Paulo, SP" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="notes">Notas</Label>
                            <Textarea id="notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Informações adicionais sobre o cliente..." />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <UploadDocument
                            label="Comprovante de Residência"
                            onFileUpload={(file) => setFormData(prev => ({ ...prev, residenceProof: file }))}
                        />
                        <UploadVideo
                            label="Vídeo do Cliente"
                            onFileUpload={(file) => setFormData(prev => ({ ...prev, clientVideo: file }))}
                        />
                    </div>
                </div>
                <DialogFooter className="bg-muted/30 p-6 flex flex-row sm:justify-end">
                    <Button
                        type="submit"
                        onClick={handleSave}
                        disabled={loading || !isFormValid}
                        size="lg"
                        className="w-full sm:w-auto shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02]"
                    >
                        {loading ? "Salvando..." : (client ? "Salvar Alterações" : "Salvar Cliente")}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

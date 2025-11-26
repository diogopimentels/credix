import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Client } from "@/mocks/handlers"
import { Camera, ArrowRight, User } from "lucide-react"
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
        const dataToSend = { ...formData }
        const { residenceProof, clientVideo, ...dataToSendWithoutFiles } = dataToSend

        const url = client ? `/api/clients/${client.id}` : '/api/clients'
        const method = client ? 'PATCH' : 'POST'

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSendWithoutFiles)
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(`Request failed with status ${res.status}: ${errorText}`)
            }

            const result = await res.json()
            console.log('Client saved successfully:', result)
            setOpen(false)
            onSave()
        } catch (error) {
            console.error("Failed to save client", error)
            alert(`Erro ao salvar cliente: ${error instanceof Error ? error.message : String(error)}`)
        } finally {
            setLoading(false)
        }
    }

    const isFormValid = formData.name && formData.phone && formData.address

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            trigger={children}
            title={client ? "Editar Cliente" : "Novo Cliente"}
            description={client ? "Atualize as informações do cliente." : "Adicione um novo cliente à sua base de dados."}
        >
            <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh] p-1">
                {/* Profile Header Section - Horizontal Layout */}
                <div className="flex items-start gap-6">
                    {/* Avatar with Upload Button */}
                    <div className="relative flex-shrink-0">
                        <div className="h-20 w-20 rounded-full border-2 border-muted overflow-hidden bg-primary/10 flex items-center justify-center">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Client Avatar" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-10 w-10 text-primary" />
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePhotoClick}
                            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow-md bg-background hover:bg-muted"
                            type="button"
                        >
                            <Camera className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    {/* Name and Phone - Side by Side */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">Nome Completo</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: João da Silva"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="(11) 98765-4321"
                                className="h-11"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Body Section */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium">Endereço Completo</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Rua das Flores, 123, São Paulo, SP"
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-medium">Notas</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Informações adicionais sobre o cliente..."
                            className="min-h-[80px] resize-none"
                        />
                    </div>
                </div>

                {/* Optimized Upload Section - Side by Side with Compact Height */}
                <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                        <UploadDocument
                            label="Comprovante"
                            onFileUpload={(file) => setFormData(prev => ({ ...prev, residenceProof: file }))}
                        />
                        <UploadVideo
                            label="Vídeo"
                            onFileUpload={(file) => setFormData(prev => ({ ...prev, clientVideo: file }))}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Use os campos acima para anexar documentos de verificação (opcional)
                    </p>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        onClick={handleSave}
                        disabled={loading || !isFormValid}
                        size="lg"
                        className="w-full shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] touch-manipulation"
                    >
                        {loading ? "Salvando..." : (client ? "Salvar Alterações" : "Salvar Cliente")}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </ResponsiveDialog>
    )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, Pencil, Trash2, Eye } from "lucide-react"

interface Station {
    id: string
    name: string | null
    chargePointId: string
    status: string
    brand: string | null
    model: string | null
    firmwareVersion: string | null
}

export default function StationsPage() {
    const [stations, setStations] = useState<Station[]>([])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [selectedStation, setSelectedStation] = useState<Station | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        chargePointId: "",
        brand: "",
        model: "",
        firmwareVersion: "",
    })

    const fetchStations = async () => {
        try {
            setIsFetching(true)
            const response = await fetch("http://localhost:3001/stations")
            const data = await response.json()
            setStations(data)
        } catch (error) {
            console.error("Failed to fetch stations:", error)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchStations()
    }, [])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("http://localhost:3001/stations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    chargePointId: formData.chargePointId,
                    brand: formData.brand || null,
                    model: formData.model || null,
                    firmwareVersion: formData.firmwareVersion || null,
                    status: "OFFLINE",
                }),
            })

            if (response.ok) {
                setIsAddDialogOpen(false)
                setFormData({
                    name: "",
                    chargePointId: "",
                    brand: "",
                    model: "",
                    firmwareVersion: "",
                })
                fetchStations()
            }
        } catch (error) {
            console.error("Failed to create station:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedStation) return

        setIsLoading(true)

        try {
            const response = await fetch(`http://localhost:3001/stations/${selectedStation.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    brand: formData.brand || null,
                    model: formData.model || null,
                    firmwareVersion: formData.firmwareVersion || null,
                }),
            })

            if (response.ok) {
                setIsEditDialogOpen(false)
                setSelectedStation(null)
                setFormData({
                    name: "",
                    chargePointId: "",
                    brand: "",
                    model: "",
                    firmwareVersion: "",
                })
                fetchStations()
            }
        } catch (error) {
            console.error("Failed to update station:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this station?")) return

        try {
            const response = await fetch(`http://localhost:3001/stations/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                fetchStations()
            }
        } catch (error) {
            console.error("Failed to delete station:", error)
        }
    }

    const openEditDialog = (station: Station) => {
        setSelectedStation(station)
        setFormData({
            name: station.name || "",
            chargePointId: station.chargePointId,
            brand: station.brand || "",
            model: station.model || "",
            firmwareVersion: station.firmwareVersion || "",
        })
        setIsEditDialogOpen(true)
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "ONLINE":
                return "default"
            case "CHARGING":
                return "secondary"
            case "OFFLINE":
                return "destructive"
            default:
                return "outline"
        }
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Stations</h2>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Station
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Stations</CardTitle>
                </CardHeader>
                <CardContent>
                    {isFetching ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Charge Point ID</TableHead>
                                    <TableHead>Brand</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No stations found. Click "Add Station" to create one.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    stations.map((station) => (
                                        <TableRow key={station.id}>
                                            <TableCell className="font-medium">{station.name || "Unnamed"}</TableCell>
                                            <TableCell>{station.chargePointId}</TableCell>
                                            <TableCell>{station.brand || "-"}</TableCell>
                                            <TableCell>{station.model || "-"}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(station.status)}>
                                                    {station.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => window.location.href = `/dashboard/stations/${station.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(station)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(station.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add Station Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAdd}>
                        <DialogHeader>
                            <DialogTitle>Add New Station</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new charging station.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="add-name">Station Name *</Label>
                                <Input
                                    id="add-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Station A"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="add-chargePointId">Charge Point ID *</Label>
                                <Input
                                    id="add-chargePointId"
                                    value={formData.chargePointId}
                                    onChange={(e) => setFormData({ ...formData, chargePointId: e.target.value })}
                                    placeholder="e.g., CP001"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="add-brand">Brand</Label>
                                <Input
                                    id="add-brand"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    placeholder="e.g., V2C, ABL, Circontrol"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="add-model">Model</Label>
                                <Input
                                    id="add-model"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    placeholder="e.g., Trydan"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="add-firmwareVersion">Firmware Version</Label>
                                <Input
                                    id="add-firmwareVersion"
                                    value={formData.firmwareVersion}
                                    onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
                                    placeholder="e.g., 1.0.0"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Station
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Station Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Station</DialogTitle>
                            <DialogDescription>
                                Update the station information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Station Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Station A"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-chargePointId">Charge Point ID</Label>
                                <Input
                                    id="edit-chargePointId"
                                    value={formData.chargePointId}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">Charge Point ID cannot be changed</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-brand">Brand</Label>
                                <Input
                                    id="edit-brand"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    placeholder="e.g., V2C, ABL, Circontrol"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-model">Model</Label>
                                <Input
                                    id="edit-model"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    placeholder="e.g., Trydan"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-firmwareVersion">Firmware Version</Label>
                                <Input
                                    id="edit-firmwareVersion"
                                    value={formData.firmwareVersion}
                                    onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
                                    placeholder="e.g., 1.0.0"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

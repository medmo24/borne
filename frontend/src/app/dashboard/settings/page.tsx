"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
    const [isLoadingSystem, setIsLoadingSystem] = useState(false)
    const [isLoadingOcpp, setIsLoadingOcpp] = useState(false)
    const [systemSaved, setSystemSaved] = useState(false)
    const [ocppSaved, setOcppSaved] = useState(false)

    const [systemConfig, setSystemConfig] = useState({
        companyName: "EV Charging Co.",
        contactEmail: "contact@evcharging.com",
    })

    const [ocppConfig, setOcppConfig] = useState({
        ocppUrl: "ws://172.19.48.1:3001/ocpp/",
        heartbeatInterval: "300",
    })

    const handleSaveSystem = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoadingSystem(true)
        setSystemSaved(false)

        // Simulate API call - in production, this would save to backend
        await new Promise(resolve => setTimeout(resolve, 1000))

        setIsLoadingSystem(false)
        setSystemSaved(true)

        // Hide success message after 3 seconds
        setTimeout(() => setSystemSaved(false), 3000)
    }

    const handleSaveOcpp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoadingOcpp(true)
        setOcppSaved(false)

        // Simulate API call - in production, this would save to backend
        await new Promise(resolve => setTimeout(resolve, 1000))

        setIsLoadingOcpp(false)
        setOcppSaved(true)

        // Hide success message after 3 seconds
        setTimeout(() => setOcppSaved(false), 3000)
    }

    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>System Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveSystem} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name</Label>
                                <Input
                                    id="company"
                                    value={systemConfig.companyName}
                                    onChange={(e) => setSystemConfig({ ...systemConfig, companyName: e.target.value })}
                                    placeholder="Your Company"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Contact Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={systemConfig.contactEmail}
                                    onChange={(e) => setSystemConfig({ ...systemConfig, contactEmail: e.target.value })}
                                    placeholder="contact@company.com"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={isLoadingSystem}>
                                    {isLoadingSystem && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                                {systemSaved && (
                                    <div className="flex items-center text-green-600 text-sm">
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Settings saved successfully!
                                    </div>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>OCPP Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveOcpp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ocpp-url">OCPP WebSocket URL</Label>
                                <Input
                                    id="ocpp-url"
                                    value={ocppConfig.ocppUrl}
                                    onChange={(e) => setOcppConfig({ ...ocppConfig, ocppUrl: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="heartbeat">Heartbeat Interval (seconds)</Label>
                                <Input
                                    id="heartbeat"
                                    type="number"
                                    value={ocppConfig.heartbeatInterval}
                                    onChange={(e) => setOcppConfig({ ...ocppConfig, heartbeatInterval: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={isLoadingOcpp}>
                                    {isLoadingOcpp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Configuration
                                </Button>
                                {ocppSaved && (
                                    <div className="flex items-center text-green-600 text-sm">
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Configuration updated successfully!
                                    </div>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Zap,
    Power,
    RefreshCw,
    Unlock,
    Activity,
    Battery,
    Clock,
    AlertTriangle,
    CheckCircle2,
    XCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Station {
    id: string
    chargePointId: string
    name: string
    status: 'ONLINE' | 'OFFLINE' | 'CHARGING' | 'FAULTED'
    brand: string
    model: string
    firmwareVersion: string
    lastHeartbeat: string
}

interface Transaction {
    id: string
    ocppTransactionId: number
    startTime: string
    endTime: string | null
    meterStart: number
    meterStop: number | null
    totalEnergy: number | null
    status: string
}

export default function StationDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [station, setStation] = useState<Station | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)

    const stationId = params.id as string

    useEffect(() => {
        fetchStationData()
        const interval = setInterval(fetchStationData, 5000) // Poll every 5 seconds
        return () => clearInterval(interval)
    }, [stationId])

    const fetchStationData = async () => {
        try {
            // Fetch station details
            const stationRes = await fetch(`http://localhost:3001/stations/${stationId}`)
            if (!stationRes.ok) throw new Error('Failed to fetch station')
            const stationData = await stationRes.json()
            setStation(stationData)

            // Fetch transactions
            const transactionsRes = await fetch(`http://localhost:3001/transactions/station/${stationId}`)
            if (transactionsRes.ok) {
                const transactionsData = await transactionsRes.json()
                setTransactions(transactionsData)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCommand = async (command: string, payload: any = {}) => {
        if (!station) return
        setIsActionLoading(true)

        try {
            let endpoint = ''
            let body = {}

            switch (command) {
                case 'start':
                    endpoint = `/ocpp/remote-start/${station.chargePointId}`
                    body = { idTag: 'REMOTE_USER', connectorId: 1 }
                    break
                case 'stop':
                    // Need active transaction ID, for now using dummy or fetching active
                    endpoint = `/ocpp/remote-stop/${station.chargePointId}`
                    body = { transactionId: 12345 } // TODO: Get actual active transaction ID
                    break
                case 'reset':
                    endpoint = `/ocpp/reset/${station.chargePointId}`
                    body = { type: 'Soft' }
                    break
                case 'unlock':
                    endpoint = `/ocpp/unlock/${station.chargePointId}`
                    body = { connectorId: 1 }
                    break
            }

            const res = await fetch(`http://localhost:3001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (data.success) {
                toast({
                    title: "Command Sent",
                    description: `Successfully sent ${command} command to station.`,
                })
            } else {
                throw new Error(data.message || 'Command failed')
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Command Failed",
                description: error instanceof Error ? error.message : "Failed to send command",
            })
        } finally {
            setIsActionLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ONLINE': return 'bg-green-500'
            case 'CHARGING': return 'bg-yellow-500'
            case 'OFFLINE': return 'bg-red-500'
            case 'FAULTED': return 'bg-red-700'
            default: return 'bg-gray-500'
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-96">Loading station details...</div>
    }

    if (!station) {
        return <div className="p-8">Station not found. ID: {stationId}</div>
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        {station.name}
                        <Badge className={`${getStatusColor(station.status)} hover:${getStatusColor(station.status)}`}>
                            {station.status}
                        </Badge>
                    </h2>
                    <p className="text-muted-foreground">ID: {station.chargePointId}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Energy</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {transactions.reduce((acc, t) => acc + (t.totalEnergy || 0), 0).toFixed(1)} kWh
                        </div>
                        <p className="text-xs text-muted-foreground">Lifetime consumption</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transactions.length}</div>
                        <p className="text-xs text-muted-foreground">Charging sessions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Heartbeat</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-sm">
                            {station.lastHeartbeat ? new Date(station.lastHeartbeat).toLocaleString() : 'Never'}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Firmware</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-sm">{station.firmwareVersion || 'Unknown'}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Remote Control</CardTitle>
                            <CardDescription>Send commands directly to the charging station</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            <Button
                                onClick={() => handleCommand('start')}
                                disabled={isActionLoading || station.status === 'CHARGING' || station.status === 'OFFLINE'}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Zap className="mr-2 h-4 w-4" /> Start Charging
                            </Button>
                            <Button
                                onClick={() => handleCommand('stop')}
                                disabled={isActionLoading || station.status !== 'CHARGING'}
                                variant="destructive"
                            >
                                <Power className="mr-2 h-4 w-4" /> Stop Charging
                            </Button>
                            <Button
                                onClick={() => handleCommand('reset')}
                                disabled={isActionLoading || station.status === 'OFFLINE'}
                                variant="outline"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" /> Reset Station
                            </Button>
                            <Button
                                onClick={() => handleCommand('unlock')}
                                disabled={isActionLoading || station.status === 'OFFLINE'}
                                variant="outline"
                            >
                                <Unlock className="mr-2 h-4 w-4" /> Unlock Connector
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Charging History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="p-4 font-medium">Start Time</th>
                                            <th className="p-4 font-medium">End Time</th>
                                            <th className="p-4 font-medium">Duration</th>
                                            <th className="p-4 font-medium">Energy</th>
                                            <th className="p-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                    No charging history found
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx) => (
                                                <tr key={tx.id} className="border-t">
                                                    <td className="p-4">{new Date(tx.startTime).toLocaleString()}</td>
                                                    <td className="p-4">
                                                        {tx.endTime ? new Date(tx.endTime).toLocaleString() : '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        {tx.endTime
                                                            ? Math.round((new Date(tx.endTime).getTime() - new Date(tx.startTime).getTime()) / 60000) + ' min'
                                                            : 'Ongoing'}
                                                    </td>
                                                    <td className="p-4">
                                                        {tx.totalEnergy ? `${tx.totalEnergy.toFixed(2)} kWh` : '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant={tx.status === 'Started' ? 'default' : 'secondary'}>
                                                            {tx.status}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Station Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Brand</span>
                                <p>{station.brand || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Model</span>
                                <p>{station.model || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Serial Number</span>
                                <p>SN-{station.chargePointId}-001</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">IP Address</span>
                                <p>192.168.1.100</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

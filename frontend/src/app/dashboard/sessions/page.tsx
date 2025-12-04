"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const sessions = [
    { id: "1", user: "John Doe", station: "Station A", energy: "12.5 kWh", duration: "2h 15m", cost: "$4.50", date: "2023-10-25" },
    { id: "2", user: "Jane Smith", station: "Station B", energy: "45.0 kWh", duration: "4h 00m", cost: "$15.00", date: "2023-10-24" },
]

export default function SessionsPage() {
    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Charging Sessions</h2>
            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Station</TableHead>
                                <TableHead>Energy</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead className="text-right">Cost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell>{session.date}</TableCell>
                                    <TableCell>{session.user}</TableCell>
                                    <TableCell>{session.station}</TableCell>
                                    <TableCell>{session.energy}</TableCell>
                                    <TableCell>{session.duration}</TableCell>
                                    <TableCell className="text-right">{session.cost}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Header() {
    return (
        <div className="flex items-center p-4 border-b">
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
            </Button>
            <div className="flex w-full justify-end">
                {/* UserButton or Avatar goes here */}
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                    U
                </div>
            </div>
        </div>
    )
}

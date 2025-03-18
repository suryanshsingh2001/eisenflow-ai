
"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export function QuadrantSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-lg space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex items-center gap-2 mt-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </div>
                    ))}
                    <div className="mt-4">
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function QuadrantGridSkeleton() {
    return (
        <>
            <QuadrantSkeleton />
            <QuadrantSkeleton />
            <QuadrantSkeleton />
            <QuadrantSkeleton />
        </>
    );
}
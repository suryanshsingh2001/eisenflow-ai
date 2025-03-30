import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FrogLoader() {
  return (
    <div className="min-h-screen bg-primary/10 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto container space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <div className="flex items-center gap-4 py-2">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        {/* Top Frog Section */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </CardContent>
        </Card>

        {/* Active Tasks Section */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="w-full sm:flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full max-w-[500px] mb-2" />
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <Skeleton key={j} className="h-5 w-5" />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completed Tasks Section */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="w-full sm:flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full max-w-[500px] mb-2" />
                    <div className="flex gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <Skeleton key={j} className="h-5 w-5" />
                        ))}
                      </div>
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

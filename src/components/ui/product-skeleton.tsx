import { Skeleton } from "./skeleton"
import { Card, CardContent, CardHeader } from "./card"

export function ProductCardSkeleton() {
  return (
    <Card className="group overflow-hidden">
      <CardHeader className="p-0">
        {/* Image skeleton */}
        <Skeleton className="aspect-square w-full" />
      </CardHeader>
      <CardContent className="p-4">
        {/* Product name skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2" />

        {/* Description skeleton */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />

        {/* Price and button skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

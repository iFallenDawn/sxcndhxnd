import { useMemo, useState } from 'react'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductFormDialog } from '@/components/dashboard/ProductFormDialog'
import { DeleteProductDialog } from '@/components/dashboard/DeleteProductDialog'
import { useProducts } from '@/hooks/use-products'
import { ApiError } from '@/lib/api-error'
import { formatPrice, getProductBucket, BUCKET_LABEL, BUCKET_BADGE_ON_SURFACE, type ProductBucket } from '@/lib/products'
import { ImagePlaceholder } from '@/components/home/ImagePlaceholder'
import type { ProductsBaseSchema } from '@/types/api'


function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: ProductsBaseSchema
  onEdit: () => void
  onDelete: () => void
}) {
  const bucket = getProductBucket(product.status)
  const [firstImage] = product.image_urls

  return (
    <li className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {firstImage ? (
          <img src={firstImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlaceholder label="No photo" className="h-full w-full border-none" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium text-foreground">{product.title}</span>
          <Badge className={BUCKET_BADGE_ON_SURFACE[bucket]}>{BUCKET_LABEL[bucket]}</Badge>
        </div>
        <span className="font-mono text-sm text-muted-foreground">{formatPrice(product.price)}</span>
      </div>

      <div className="flex shrink-0 gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button type="button" size="sm" variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </li>
  )
}

/** Product list with search + status filter, and create/edit/delete entry points. */
export function ProductsPanel() {
  const { data: products, isLoading, isError, error } = useProducts()
  const [search, setSearch] = useState('')
  const [bucketFilter, setBucketFilter] = useState<ProductBucket | 'all'>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductsBaseSchema | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<ProductsBaseSchema | null>(null)

  const filtered = useMemo(() => {
    if (!products) return []
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      if (bucketFilter !== 'all' && getProductBucket(product.status) !== bucketFilter) return false
      if (query && !product.title.toLowerCase().includes(query)) return false
      return true
    })
  }, [products, search, bucketFilter])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products…"
              className="h-9 pl-8"
              aria-label="Search products by title"
            />
          </div>
          <Select value={bucketFilter} onValueChange={(value) => setBucketFilter(value as ProductBucket | 'all')}>
            <SelectTrigger className="h-9 w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="archive">Archive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="button" onClick={() => setCreateOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          Add product
        </Button>
      </div>

      {isLoading ? (
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <li key={index} className="flex items-center gap-3">
              <Skeleton className="size-16 rounded-md" />
              <Skeleton className="h-4 flex-1" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-8 text-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : 'Could not load products.'}
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          {products && products.length > 0 ? 'No products match your search.' : 'No products yet — add your first one.'}
        </p>
      ) : (
        <ul>
          {filtered.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => setDeletingProduct(product)}
            />
          ))}
        </ul>
      )}

      <ProductFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      {editingProduct ? (
        <ProductFormDialog
          open={editingProduct !== null}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          product={editingProduct}
        />
      ) : null}
      <DeleteProductDialog product={deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)} />
    </div>
  )
}

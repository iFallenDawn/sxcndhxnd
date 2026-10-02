import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FilterPill } from '@/components/store/FilterPill'
import { BUCKET_LABEL, BUCKET_ORDER, type ProductBucket } from '@/lib/products'
import { SORT_LABEL, type SortOption } from '@/lib/store-grouping'

const SORT_OPTIONS: SortOption[] = ['featured', 'price-asc', 'price-desc']

// Radix `SelectItem` can't take an empty-string value, so "no size filter"
// needs a sentinel rather than mapping directly to `size === null`.
const ALL_SIZES = 'all'

interface StoreFiltersProps {
  categories: string[]
  category: string | null
  onCategoryChange: (category: string | null) => void
  bucket: ProductBucket | null
  onBucketChange: (bucket: ProductBucket | null) => void
  sizes: string[]
  size: string | null
  onSizeChange: (size: string | null) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
}

/**
 * Client-side filter + sort controls shared by both storefront sections.
 * Category/status use the `rounded-full` pill register; sort is a dropdown
 * since it's a single mutually-exclusive choice, not a toggle set.
 */
export function StoreFilters({
  categories,
  category,
  onCategoryChange,
  bucket,
  onBucketChange,
  sizes,
  size,
  onSizeChange,
  sort,
  onSortChange,
}: StoreFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill active={bucket === null} onClick={() => onBucketChange(null)}>
          All
        </FilterPill>
        {BUCKET_ORDER.map((option) => (
          <FilterPill
            key={option}
            active={bucket === option}
            onClick={() => onBucketChange(bucket === option ? null : option)}
          >
            {BUCKET_LABEL[option]}
          </FilterPill>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill active={category === null} onClick={() => onCategoryChange(null)}>
            All categories
          </FilterPill>
          {categories.map((option) => (
            <FilterPill
              key={option}
              active={category === option}
              onClick={() => onCategoryChange(category === option ? null : option)}
            >
              {option}
            </FilterPill>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {sizes.length > 0 ? (
            <Select
              value={size ?? ALL_SIZES}
              onValueChange={(value) => onSizeChange(value === ALL_SIZES ? null : value)}
            >
              <SelectTrigger size="sm" className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_SIZES}>All sizes</SelectItem>
                {sizes.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          <Select value={sort} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger size="sm" className="w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {SORT_LABEL[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

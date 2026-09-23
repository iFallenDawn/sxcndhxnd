import { useId, type ComponentProps, type ReactNode } from 'react'
import { ImagePlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ALLOWED_IMAGE_TYPES } from '@/lib/constants'

const ACCEPT = [...ALLOWED_IMAGE_TYPES].join(',')

interface ImageFilePickerProps extends Pick<ComponentProps<typeof Button>, 'variant' | 'size'> {
  onFiles: (files: File[]) => void
  children: ReactNode
}

/** Multi-select image picker: a visually hidden file input behind a button-styled label. */
export function ImageFilePicker({ onFiles, children, variant, size }: ImageFilePickerProps) {
  const inputId = useId()

  return (
    <>
      <input
        id={inputId}
        type="file"
        accept={ACCEPT}
        multiple
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? [])
          // Reset so picking the same file again still fires `change`.
          event.currentTarget.value = ''
          if (files.length > 0) onFiles(files)
        }}
      />
      <Button type="button" variant={variant} size={size} asChild>
        <label htmlFor={inputId} className="cursor-pointer">
          <ImagePlusIcon data-icon="inline-start" />
          {children}
        </label>
      </Button>
    </>
  )
}

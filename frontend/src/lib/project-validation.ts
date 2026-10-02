import { z } from 'zod'

export const projectFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  // Optional: the inline "New project" flow in the product form (#32) creates
  // projects with an empty description by design, and this dialog has to be
  // able to save those back out without forcing one in first.
  description: z.string().trim(),
  date: z.string().trim().min(1, 'Date is required'),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FrogSelector } from "./FrogSelector"

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title is too long"),
  description: z.string().max(200, "Description is too long"),
  priorityScore: z.number().min(1).max(5),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

interface FrogTaskFormProps {
  defaultValues?: Partial<TaskFormValues>
  onSubmit: (data: TaskFormValues) => void
  submitLabel: string
}

export function FrogTaskForm({ defaultValues, onSubmit, submitLabel }: FrogTaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      priorityScore: defaultValues?.priorityScore || 1,
    },
  })

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your task" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priorityScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <FormControl>
                <FrogSelector 
                  value={field.value} 
                  onChange={field.onChange}
                  size="lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full ">
          {submitLabel}
        </Button>
      </form>
    </Form>
  )
}
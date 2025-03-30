"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Task } from "@/lib/types";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";


interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  initialQuadrant?: Task["quadrant"];
}

import * as z from "zod"

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  quadrant: z.enum(["important-urgent" , "important-not-urgent" , "not-important-urgent" , "not-important-not-urgent" , "done"])
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

export function TaskForm({ onSubmit, initialQuadrant }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      quadrant: initialQuadrant || "important-urgent",
    },
  });

  const handleSubmit = (values: TaskFormValues) => {
    onSubmit(values);
    form.reset();
    setOpen(false);
  };

  const Content = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Task title" {...field} className="mb-2" />
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
                  <FormControl>
                    <Textarea
                      placeholder="Task description"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </Form>
    );
  };

  console.log(isMobile);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add New Task</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">{Content()}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        {Content()}
      </DialogContent>
    </Dialog>
  );
}
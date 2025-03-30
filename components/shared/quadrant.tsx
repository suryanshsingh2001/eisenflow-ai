"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Quadrant as QuadrantType, Task } from "@/lib/types";
import { TaskForm } from "./task-form";
import { TaskCard } from "./task-card";
import { AnimatedContainer } from "./animated-container";
import React from "react";

interface QuadrantProps {
  quadrant: QuadrantType;
  icon: React.ReactNode;
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
}

export function Quadrant({
  quadrant,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
  icon,
}: QuadrantProps) {
  const { setNodeRef } = useDroppable({
    id: quadrant.id,
  });
  const taskCount = quadrant.tasks.length;

  return (
    <AnimatedContainer animation="slide" className="h-full">
      <Card className="h-full">
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg md:text-xl font-bold">
              {quadrant.title}
            </CardTitle>
            {icon}
          </div>
            <div className="absolute right-4 md:right-6 top-4 md:top-6">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              {taskCount} task{taskCount !== 1 ? "s" : ""}
            </span>
            </div>
          <CardDescription className="text-sm md:text-base">
            {quadrant.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <div className="mb-3 md:mb-4">
            <TaskForm onSubmit={onAddTask} initialQuadrant={quadrant.id} />
          </div>

          <div ref={setNodeRef} className="space-y-3 md:space-y-5">
            <SortableContext
              items={quadrant.tasks}
              strategy={verticalListSortingStrategy}
            >
              {quadrant.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onComplete={onCompleteTask}
                />
              ))}
            </SortableContext>
          </div>
        </CardContent>
      </Card>
    </AnimatedContainer>
  );
}

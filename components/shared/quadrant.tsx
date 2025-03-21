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

interface QuadrantProps {
  quadrant: QuadrantType;
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
}: QuadrantProps) {
  const { setNodeRef } = useDroppable({
    id: quadrant.id,
  });
  const taskCount = quadrant.tasks.length;

  return (
    <AnimatedContainer animation="slide" className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{quadrant.title}</CardTitle>
          <CardDescription>{quadrant.description}</CardDescription>
            {taskCount} task{taskCount !== 1 ? "s" : ""}
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <TaskForm onSubmit={onAddTask} initialQuadrant={quadrant.id} />
          </div>

          <div ref={setNodeRef} className="space-y-5">
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

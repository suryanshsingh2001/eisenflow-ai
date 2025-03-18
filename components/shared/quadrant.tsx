"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quadrant as QuadrantType, Task } from "@/lib/types";
import { TaskForm } from "./task-form";
import { TaskCard } from "./task-card";

interface QuadrantProps {
  quadrant: QuadrantType;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function Quadrant({ quadrant, onAddTask, onEditTask, onDeleteTask }: QuadrantProps) {
  const { setNodeRef } = useDroppable({
    id: quadrant.id,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{quadrant.title}</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">{quadrant.description}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <TaskForm onSubmit={onAddTask} initialQuadrant={quadrant.id} />
        </div>
        <div ref={setNodeRef} className="space-y-4">
          <SortableContext items={quadrant.tasks} strategy={verticalListSortingStrategy}>
            {quadrant.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
}
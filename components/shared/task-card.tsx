"use client";

import { Task } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    position: "relative" as const,
    zIndex: isDragging ? 50 : 1,
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div className="relative group">
      <Card
        ref={setNodeRef}
        style={style}
        className={`bg-white dark:bg-gray-800 ${
          isDragging ? "shadow-2xl scale-105" : ""
        }`}
        {...attributes}
        {...listeners}
      >
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardDescription>{task.description}</CardDescription>
        </CardContent>
        <CardFooter
          onMouseEnter={() => setIsDisabled(true)}
          onMouseLeave={() => setIsDisabled(false)}
        >
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Overlay buttons */}
      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleEdit}
          className="h-8 w-8 bg-white/90 hover:bg-white dark:bg-gray-700/90 dark:hover:bg-gray-700"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleDelete}
          className="h-8 w-8 bg-white/90 hover:bg-white dark:bg-gray-700/90 dark:hover:bg-gray-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

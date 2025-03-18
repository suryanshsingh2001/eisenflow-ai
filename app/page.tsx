"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Task, Quadrant as QuadrantType } from "@/lib/types";
import { categorizeTasks } from "@/lib/ai";
import { Wand2 } from "lucide-react";
import { Quadrant } from "@/components/shared/quadrant";


const initialQuadrants: QuadrantType[] = [
  {
    id: "important-urgent",
    title: "Important & Urgent",
    description: "Do these tasks immediately",
    tasks: [],
  },
  {
    id: "important-not-urgent",
    title: "Important & Not Urgent",
    description: "Schedule these tasks",
    tasks: [],
  },
  {
    id: "not-important-urgent",
    title: "Not Important & Urgent",
    description: "Delegate these tasks",
    tasks: [],
  },
  {
    id: "not-important-not-urgent",
    title: "Not Important & Not Urgent",
    description: "Eliminate these tasks",
    tasks: [],
  },
];

export default function Home() {
  const [quadrants, setQuadrants] = useState<QuadrantType[]>(initialQuadrants);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("eisenhowerTasks");
    if (savedTasks) {
      const tasks: Task[] = JSON.parse(savedTasks);
      const updatedQuadrants = initialQuadrants.map(q => ({
        ...q,
        tasks: tasks.filter(t => t.quadrant === q.id)
      }));
      setQuadrants(updatedQuadrants);
    }
  }, []);

  const saveTasks = (updatedQuadrants: QuadrantType[]) => {
    const allTasks = updatedQuadrants.flatMap(q => q.tasks);
    localStorage.setItem("eisenhowerTasks", JSON.stringify(allTasks));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeQuadrant = quadrants.find(q => q.tasks.some(t => t.id === active.id));
    if (activeQuadrant) {
      const task = activeQuadrant.tasks.find(t => t.id === active.id);
      if (task) setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    
    if (!over) return;

    const activeQuadrant = quadrants.find(q => q.tasks.some(t => t.id === active.id));
    const overQuadrant = quadrants.find(q => q.id === over.id);

    if (!activeQuadrant || !overQuadrant) return;

    const activeTask = activeQuadrant.tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const updatedQuadrants = quadrants.map(q => {
      if (q.id === activeQuadrant.id) {
        return { ...q, tasks: q.tasks.filter(t => t.id !== active.id) };
      }
      if (q.id === overQuadrant.id) {
        return {
          ...q,
          tasks: [...q.tasks, { ...activeTask, quadrant: overQuadrant.id }],
        };
      }
      return q;
    });

    setQuadrants(updatedQuadrants);
    saveTasks(updatedQuadrants);
  };

  const handleAddTask = (quadrantId: QuadrantType['id'], taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      quadrant: quadrantId,
      createdAt: new Date().toISOString(),
    };

    const updatedQuadrants = quadrants.map(q =>
      q.id === quadrantId
        ? { ...q, tasks: [...q.tasks, newTask] }
        : q
    );

    setQuadrants(updatedQuadrants);
    saveTasks(updatedQuadrants);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedQuadrants = quadrants.map(q => ({
      ...q,
      tasks: q.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }));

    setQuadrants(updatedQuadrants);
    saveTasks(updatedQuadrants);
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedQuadrants = quadrants.map(q => ({
      ...q,
      tasks: q.tasks.filter(t => t.id !== taskId)
    }));

    setQuadrants(updatedQuadrants);
    saveTasks(updatedQuadrants);
  };

  const handleAISort = async () => {
    const allTasks = quadrants.flatMap(q => q.tasks);
    const taskData = allTasks.map(({ title, description }) => ({ title, description }));
    
    try {
      const categorizedTasks = await categorizeTasks(taskData);
      
      const updatedQuadrants = quadrants.map(q => ({
        ...q,
        tasks: []
      }));

      allTasks.forEach((task, index) => {
        const suggestion = categorizedTasks[index];
        const targetQuadrant = updatedQuadrants.find(q => q.id === suggestion.quadrant);
        if (targetQuadrant) {
          targetQuadrant.tasks.push({
            ...task,
            quadrant: suggestion.quadrant as Task['quadrant']
          });
        }
      });

      setQuadrants(updatedQuadrants);
      saveTasks(updatedQuadrants);
    } catch (error) {
      console.error('Error sorting tasks with AI:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Eisenhower Matrix
          </h1>
          <Button onClick={handleAISort} className="flex items-center">
            <Wand2 className="mr-2 h-4 w-4" />
            AI Sort
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DndContext 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {quadrants.map((quadrant) => (
              <Quadrant
                key={quadrant.id}
                quadrant={quadrant}
                onAddTask={(task) => handleAddTask(quadrant.id, task)}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
            <DragOverlay>
              {activeTask ? (
                <div className="w-full max-w-md">
                  <Card className="bg-white dark:bg-gray-800 shadow-2xl">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg font-semibold">{activeTask.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription>{activeTask.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateTask({
                    ...editingTask,
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                  });
                }}
                className="space-y-4"
              >
                <Input
                  name="title"
                  defaultValue={editingTask.title}
                  placeholder="Task title"
                />
                <Textarea
                  name="description"
                  defaultValue={editingTask.description}
                  placeholder="Task description"
                  rows={3}
                />
                <Button type="submit" className="w-full">
                  Update Task
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
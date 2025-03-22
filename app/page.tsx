"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task, Quadrant as QuadrantType } from "@/lib/types";
import { categorizeTasks } from "@/lib/ai";
import {
  AlertCircle,
  CalendarRange,
  Check,
  CheckCircle2,
  Trash2,
  Users2,
  Wand2,
} from "lucide-react";
import { Quadrant } from "@/components/shared/quadrant";
import { QuadrantGridSkeleton } from "@/components/shared/loader";
import RecommendationDialog from "@/components/shared/recommendation-dialog";
import { toast } from "sonner";

const initialQuadrants: QuadrantType[] = [
  {
    id: "important-urgent",
    icon: <AlertCircle className="w-6 h-6 text-primary" />,
    title: "Important & Urgent",
    description: "Do these tasks immediately",
    tasks: [],
  },
  {
    id: "important-not-urgent",
    icon: <CalendarRange className="w-6 h-6 text-purple-600" />,
    title: "Important & Not Urgent",
    description: "Schedule these tasks",
    tasks: [],
  },
  {
    id: "not-important-urgent",
    icon: <Users2 className="w-6 h-6 text-foreground" />,
    title: "Not Important & Urgent",
    description: "Delegate these tasks",
    tasks: [],
  },
  {
    id: "not-important-not-urgent",
    title: "Not Important & Not Urgent",
    icon: <Trash2 className="w-6 h-6 text-destructive" />,
    description: "Eliminate these tasks",
    tasks: [],
  },
  {
    id: "done",
    icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
    title: "Done",
    description: "Completed tasks",
    tasks: [],
  },
];

export default function Home() {
  const [quadrants, setQuadrants] = useState<QuadrantType[]>(initialQuadrants);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [reasonings, setReasonings] = useState([]);

  const handleClearAll = () => {
    localStorage.removeItem("eisenhowerTasks");
    setQuadrants(initialQuadrants);
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem("eisenhowerTasks");
    if (savedTasks) {
      const tasks: Task[] = JSON.parse(savedTasks);
      const updatedQuadrants = initialQuadrants.map((q) => ({
        ...q,
        tasks: tasks.filter((t) => t.quadrant === q.id),
      }));
      setQuadrants(updatedQuadrants);
    }
  }, []);

  const saveTasks = (updatedQuadrants: QuadrantType[]) => {
    const allTasks = updatedQuadrants.flatMap((q) => q.tasks);
    localStorage.setItem("eisenhowerTasks", JSON.stringify(allTasks));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeQuadrant = quadrants.find((q) =>
      q.tasks.some((t) => t.id === active.id)
    );
    if (activeQuadrant) {
      const task = activeQuadrant.tasks.find((t) => t.id === active.id);
      if (task) setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
  
    if (!over) return;
  
    const activeQuadrant = quadrants.find((q) =>
      q.tasks.some((t) => t.id === active.id)
    );
  
    if (!activeQuadrant) return;
  
    const activeTask = activeQuadrant.tasks.find((t) => t.id === active.id);
    if (!activeTask) return;
  
    // First check if the over.id matches any quadrant ID directly
    const targetQuadrant = quadrants.find(q => q.id === over.id);
    const overQuadrantId = targetQuadrant 
      ? over.id 
      : quadrants.find(q => q.tasks.some(t => t.id === over.id))?.id;
  
    if (!overQuadrantId) return;

    // Only proceed if we're actually moving to a different quadrant
    if (activeQuadrant.id === overQuadrantId) return;

    const updatedQuadrants = quadrants.map((q) => {
      if (q.id === activeQuadrant.id) {
        return { ...q, tasks: q.tasks.filter((t) => t.id !== active.id) };
      }
      if (q.id === overQuadrantId) {
        return {
          ...q,
          tasks: [...q.tasks, { ...activeTask, quadrant: overQuadrantId }],
        };
      }
      return q;
    });

    setQuadrants(updatedQuadrants);
    saveTasks(updatedQuadrants);
  };

  const handleAddTask = (
    quadrantId: QuadrantType["id"],
    taskData: Omit<Task, "id" | "createdAt">
  ) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      quadrant: quadrantId,
      createdAt: new Date().toISOString(),
    };

    const updatedQuadrants = quadrants.map((q) =>
      q.id === quadrantId ? { ...q, tasks: [...q.tasks, newTask] } : q
    );

    setQuadrants(updatedQuadrants);
    saveTasks(updatedQuadrants);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedQuadrants = quadrants.map((q) => ({
      ...q,
      tasks: q.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    }));

    setQuadrants(updatedQuadrants);
    saveTasks(updatedQuadrants);
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedQuadrants = quadrants.map((q) => ({
      ...q,
      tasks: q.tasks.filter((t) => t.id !== taskId),
    }));

    setQuadrants(updatedQuadrants);
    saveTasks(updatedQuadrants);
  };

  const handleAISort = async () => {
    const allTasks = quadrants.flatMap((q) => q.tasks);
    const taskData = allTasks.map(({ title, description }) => ({
      title,
      description,
    }));

    //look for empty tasks
    if (taskData.length === 0) {
      alert("Please add some tasks to categorize with AI");
      return;
    }

    try {
      //use api
      setLoading(true);
      const response = await axios.post("/api/ai", { tasks: taskData });

      const { results } = response.data;
      if (!results) {
        console.error("No results from AI categorization");
        return;
      }
      const categorizedTasks = results.map(
        (result: { quadrant: string; reasoning: string }) => result
      );

      const responseReasonings = categorizedTasks.map(
        (result: { quadrant: string; reasoning: string }) => result.reasoning
      );
      setReasonings(responseReasonings);

      console.log(categorizedTasks);

      const updatedQuadrants = quadrants.map((q) => ({
        ...q,
        tasks: [],
      }));

      allTasks.forEach((task, index) => {
        const suggestion = categorizedTasks[index];
        const targetQuadrant = updatedQuadrants.find(
          (q) => q.id === suggestion.quadrant
        );
        if (targetQuadrant) {
          targetQuadrant.tasks.push({
            ...task,
            quadrant: suggestion.quadrant as Task["quadrant"],
          });
        }
      });

      setQuadrants(updatedQuadrants);
      saveTasks(updatedQuadrants);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        toast.error(
          error.response.data.text || "You have exceeded the rate limit."
        );
        return;
      } else {
        alert("An error occurred while sorting tasks. Please try again.");
      }
      console.error("Error sorting tasks with AI:", error);
    } finally {
      setLoading(false);
    }
  };

  const onCompleteTask = (taskId: string) => {
    // Find the task and its quadrant
    const sourceQuadrant = quadrants.find((q) =>
      q.tasks.some((t) => t.id === taskId)
    );
    const task = sourceQuadrant?.tasks.find((t) => t.id === taskId);

    if (!task) return;

    // Create updated quadrants with the task moved to "done"
    const updatedQuadrants = quadrants.map((q) => {
      if (q.id === sourceQuadrant?.id) {
        return { ...q, tasks: q.tasks.filter((t) => t.id !== taskId) };
      }
      if (q.id === "done") {
        return { ...q, tasks: [...q.tasks, { ...task, quadrant: "done" }] };
      }
      return q;
    });

    setQuadrants(updatedQuadrants as QuadrantType[]);
    saveTasks(updatedQuadrants as QuadrantType[]);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Eisenhower Matrix
            </h2>
            <div className="flex gap-2">
              <Button onClick={handleAISort} className="flex items-center">
                <Wand2 className="h-4 w-4 " />
                Ask AI
              </Button>
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 2" />
                Clear All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <QuadrantGridSkeleton />
            ) : (
              <>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {quadrants.slice(0, 4).map((quadrant) => (
                    <Quadrant
                      key={quadrant.id}
                      icon={quadrant.icon}
                      quadrant={quadrant}
                      onAddTask={(task) => handleAddTask(quadrant.id, task)}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                      onCompleteTask={onCompleteTask}
                    />
                  ))}

                  <div className="col-span-2 mx-auto w-full max-w-2xl">
                    <Quadrant
                      icon={quadrants[4].icon}
                      quadrant={quadrants[4]}
                      onAddTask={(task) => handleAddTask(quadrants[4].id, task)}
                      onEditTask={handleEditTask}
                      onCompleteTask={onCompleteTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  </div>

                  <DragOverlay>
                    {activeTask ? (
                      <div className="w-full max-w-md">
                        <Card className="bg-white dark:bg-gray-800 shadow-2xl">
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg font-semibold">
                              {activeTask.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <CardDescription>
                              {activeTask.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </>
            )}
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
                      title: formData.get("title") as string,
                      description: formData.get("description") as string,
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

      <RecommendationDialog
        reasonings={reasonings}
        open={reasonings.length > 0}
        onOpenChange={(open) => {
          if (!open) setReasonings([]);
        }}
      />
    </>
  );
}

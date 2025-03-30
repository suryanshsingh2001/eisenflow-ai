"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Frown as Frog,
  Pencil,
  CheckCircle2,
  AlertTriangle,
  Wand2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddTaskDialog } from "@/components/shared/frog/AddFrogTaskDialog";
import { EditTaskDialog } from "@/components/shared/frog/EditFrogTaskDialog";

export interface FrogTask {
  id: string;
  title: string;
  description: string;
  priorityScore: number;
  completed: boolean;
  completedAt?: string;
  reasoning?: string;
}

interface AIAnalysis {
  title: string;
  reasoning: string;
  priorityScore: string;
}

export default function EatTheFrogPage() {
  const [tasks, setTasks] = useState<FrogTask[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("frogTasks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [taskForm, setTaskForm] = useState({
    id: "",
    title: "",
    description: "",
    priorityScore: 1,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AIAnalysis[]>([]);

  useEffect(() => {
    localStorage.setItem("frogTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskSubmit = () => {
    if (!taskForm.title) return;

    if (isEditing) {
      setTasks(
        tasks.map((task) =>
          task.id === taskForm.id
            ? {
                ...task,
                title: taskForm.title,
                description: taskForm.description,
                priorityScore: taskForm.priorityScore,
              }
            : task
        )
      );
    } else {
      const task: FrogTask = {
        id: crypto.randomUUID(),
        title: taskForm.title,
        description: taskForm.description,
        priorityScore: taskForm.priorityScore,
        completed: false,
      };
      setTasks([...tasks, task]);
    }

    setTaskForm({ id: "", title: "", description: "", priorityScore: 1 });
    setIsEditing(false);
    setShowTaskDialog(false);
  };

  const editTask = (task: FrogTask) => {
    setTaskForm({
      id: task.id,
      title: task.title,
      description: task.description,
      priorityScore: task.priorityScore,
    });
    setIsEditing(true);
    setShowTaskDialog(true);
  };

  const completeTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: true, completedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const getTopFrogs = () => {
    return tasks
      .filter((task) => !task.completed)
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 1);
  };

  const analyzeWithAI = async () => {
    if (tasks.length === 0) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ai/frog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: tasks
            .filter((task) => !task.completed)
            .map(({ title, description, priorityScore }) => ({
              title,
              description,
              priorityScore,
            })),
        }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      console.log("AI Analysis Results:", data);
      setAnalysisResults(data.results);
      setShowAnalysisDialog(true);
    } catch (error) {
      console.error("Error during analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAISuggestions = () => {
    const updatedTasks = tasks.map((task) => {
      const analysis = analysisResults.find((a) => a.title === task.title);
      if (analysis) {
        return {
          ...task,
          priorityScore: Number(analysis.priorityScore),
          reasoning: analysis.reasoning,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setShowAnalysisDialog(false);
  };

  const renderFrogIcons = (difficulty: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Frog
        key={index}
        className={`h-5 w-5 ${
          index < difficulty
            ? "text-green-600 dark:text-green-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const topFrogs = getTopFrogs();

  return (
    <>
    <div className="max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Frog className="h-8 w-8" />
            Eat That Frog
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Start your day by tackling your biggest, most challenging task
            first.
          </p>
        </div>
        <Button
          onClick={analyzeWithAI}
          disabled={isAnalyzing || tasks.length === 0}
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          {isAnalyzing ? "Analyzing..." : "Analyze Tasks"}
        </Button>
      </div>

      {topFrogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topFrogs.map((task, index) => (
            <Card
              key={task.id}
              className={`${
                index === 0
                  ? "border-2 border-green-500 dark:border-green-700"
                  : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {index === 0 && (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  {task.title}
                </CardTitle>
                <div className="flex gap-1 mt-2">
                  {renderFrogIcons(task.priorityScore)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {task.description}
                </p>
                {task.reasoning && (
                  <Alert className="mb-4">
                    <AlertDescription>{task.reasoning}</AlertDescription>
                  </Alert>
                )}
                <div className="flex gap-2">
                  <Button onClick={() => completeTask(task.id)}>
                    Complete
                  </Button>
                  <Button variant="outline" onClick={() => editTask(task)}>
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Button
        variant="outline"
        className="w-full mt-4 md:mt-0"
        onClick={() => setShowTaskDialog(true)}
      >
        Add Task
      </Button>

     

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
            <CardDescription>Tasks waiting to be tackled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks
                .filter((task) => !task.completed)
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {task.description}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <div className="flex gap-1">
                            {renderFrogIcons(task.priorityScore)}
                          </div>
                        </div>
                        {task.reasoning && (
                          <Alert className="mt-2">
                            <AlertDescription>
                              {task.reasoning}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editTask(task)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Completed Tasks
            </CardTitle>
            <CardDescription>Frogs you&apos;ve already eaten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks
                .filter((task) => task.completed)
                .sort(
                  (a, b) =>
                    new Date(b.completedAt!).getTime() -
                    new Date(a.completedAt!).getTime()
                )
                .map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {task.description}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <div className="flex gap-1">
                            {renderFrogIcons(task.priorityScore)}
                          </div>
                          <Badge variant="outline">
                            Completed:{" "}
                            {new Date(task.completedAt!).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>AI Task Analysis</DialogTitle>
            <DialogDescription>
              Review the AI suggestions for your tasks
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-6 -mr-6">
            <div className="space-y-4">
              {analysisResults.map((analysis, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{analysis.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Strategy:</span>{" "}
                        {analysis.reasoning}
                      </p>
                      <p>
                        <span className="font-medium">Priority:</span>{" "}
                        {analysis.priorityScore}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowAnalysisDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={applyAISuggestions}>Apply Suggestions</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    {isEditing ? (
        <EditTaskDialog
          open={showTaskDialog}
          onOpenChange={setShowTaskDialog}
          task={taskForm}
          onSubmit={(data) => {
            setTasks(tasks.map((task) =>
              task.id === taskForm.id
                ? {
                    ...task,
                    ...data,
                  }
                : task
            ));
            setShowTaskDialog(false);
            setIsEditing(false);
          }}
        />
      ) : (
        <AddTaskDialog
          open={showTaskDialog}
          onOpenChange={setShowTaskDialog}
          onSubmit={(data) => {
            const newTask = {
              id: crypto.randomUUID(),
              ...data,
              completed: false,
            };
            setTasks([...tasks, newTask]);
            setShowTaskDialog(false);
          }}
        />
      )}

    </>
  );
}

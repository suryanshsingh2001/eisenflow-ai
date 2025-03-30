"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Wand2, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

export interface ParetoTask {
  id: string;
  title: string;
  impact: number;
  effort: number;
  score: number;
  recommendation?: string;
}

interface AIAnalysis {
  title: string;
  suggestedImpact: number;
  suggestedEffort: number;
  recommendation: string;
}

export default function ParetoPage() {
  const [tasks, setTasks] = useState<ParetoTask[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("paretoTasks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newTask, setNewTask] = useState({ title: "", impact: 50, effort: 50 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AIAnalysis[]>([]);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);

  return redirect("/");

  useEffect(() => {
    localStorage.setItem("paretoTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title) return;
    
    const task: ParetoTask = {
      id: crypto.randomUUID(),
      title: newTask.title,
      impact: newTask.impact,
      effort: newTask.effort,
      score: (newTask.impact / newTask.effort) * 100,
    };

    setTasks([...tasks, task]);
    setNewTask({ title: "", impact: 50, effort: 50 });
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const analyzeWithAI = async () => {
    if (tasks.length === 0) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ai/pareto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: tasks.map(({ title, impact, effort }) => ({
            title,
            impact,
            effort,
          })),
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setAnalysisResults(data.analysis);
      setShowAnalysisDialog(true);
    } catch (error) {
      console.error('Error during analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAISuggestions = () => {
    const updatedTasks = tasks.map(task => {
      const analysis = analysisResults.find(a => a.title === task.title);
      if (analysis) {
        return {
          ...task,
          impact: analysis.suggestedImpact,
          effort: analysis.suggestedEffort,
          score: (analysis.suggestedImpact / analysis.suggestedEffort) * 100,
          recommendation: analysis.recommendation,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setShowAnalysisDialog(false);
  };

  const sortedTasks = [...tasks].sort((a, b) => b.score - a.score);
  const totalScore = tasks.reduce((sum, task) => sum + task.score, 0);
  const paretoThreshold = totalScore * 0.8;

  let runningTotal = 0;
  const paretoTasks = sortedTasks.filter(task => {
    runningTotal += task.score;
    return runningTotal <= paretoThreshold;
  });

  const chartData = sortedTasks.map(task => ({
    name: task.title,
    score: task.score,
    isPareto: paretoTasks.includes(task),
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pareto Analysis (80/20 Rule)
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Identify the vital few tasks that contribute to the majority of your results.
            </p>
          </div>
          <Button
            onClick={analyzeWithAI}
            disabled={isAnalyzing || tasks.length === 0}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>
              Rate the potential impact and required effort of your task
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Impact (1-100): {newTask.impact}
              </Label>
              <Slider
                value={[newTask.impact]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => setNewTask({ ...newTask, impact: value[0] })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Effort (1-100): {newTask.effort}
              </label>
              <Slider
                value={[newTask.effort]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => setNewTask({ ...newTask, effort: value[0] })}
              />
            </div>
            <Button onClick={addTask} className="w-full">
              Add Task
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Pareto Chart</CardTitle>
              <CardDescription>
                Tasks above the line represent 80% of potential impact
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {/* <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="score"
                    fill={(entry) => entry.isPareto ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                  />
                </BarChart>
              </ResponsiveContainer> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Analysis</CardTitle>
              <CardDescription>
                Focus on high-impact, low-effort tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border ${
                      paretoTasks.includes(task)
                        ? "border-green-500 dark:border-green-700"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-500">
                            Impact: {task.impact} | Effort: {task.effort} | Score: {task.score.toFixed(1)}
                          </p>
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
                      {task.recommendation && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{task.recommendation}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>AI Analysis Results</DialogTitle>
              <DialogDescription>
                Review the AI suggestions for your tasks
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {analysisResults.map((analysis, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{analysis.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Suggested Impact:</span>{" "}
                        {analysis.suggestedImpact}
                      </p>
                      <p>
                        <span className="font-medium">Suggested Effort:</span>{" "}
                        {analysis.suggestedEffort}
                      </p>
                      <p>
                        <span className="font-medium">Recommendation:</span>{" "}
                        {analysis.recommendation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAnalysisDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={applyAISuggestions}>
                  Apply Suggestions
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
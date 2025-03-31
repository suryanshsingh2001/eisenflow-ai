"use client";

import { useState, useEffect, useRef } from "react";

// @ts-ignore */
import { useToImage } from "@hcorta/react-to-image"; // Import the useToImage hook

import generatePDF from "react-to-pdf";
import axios from "axios";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
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
import {
  AlertCircle,
  BadgeInfo,
  Book,
  CalendarRange,
  Check,
  CheckCircle2,
  Download,
  ExternalLink,
  Trash2,
  Users2,
  Wand2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Quadrant } from "@/components/shared/quadrant";
import { QuadrantGridSkeleton } from "@/components/shared/loader";
import RecommendationDialog from "@/components/shared/recommendation-dialog";
import { toast } from "sonner";
import Image from "next/image";
import { EditTaskDialog } from "@/components/shared/edit-task-form";
import InfoDialog from "@/components/shared/info-dialog";
import { useRouter } from "next/navigation";

const initialQuadrants: QuadrantType[] = [
  {
    id: "important-urgent",
    icon: <AlertCircle className="w-6 h-6 text-primary" />,
    title: "Important & Urgent",
    description: "Do these tasks immediately",
    tasks: [
      {
        id: "mix-3",
        title: "Production Server Down",
        description:
          "Main application server is experiencing intermittent outages affecting user experience.",
        quadrant: "important-urgent",
        createdAt: new Date().toISOString(),
      },
      {
        id: "mix-8",
        title: "Critical Security Patch",
        description:
          "Apply urgent security patch to fix vulnerability in authentication system.",
        quadrant: "important-urgent",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "important-not-urgent",
    icon: <CalendarRange className="w-6 h-6 text-purple-600" />,
    title: "Important & Not Urgent",
    description: "Schedule these tasks",
    tasks: [
      {
        id: "mix-2",
        title: "Learning New Framework",
        description:
          "Team needs to learn Next.js for upcoming project, but no immediate deadline.",
        quadrant: "important-not-urgent",
        createdAt: new Date().toISOString(),
      },
      {
        id: "mix-6",
        title: "Strategic Planning Session",
        description:
          "Define next quarter technical roadmap and resource allocation.",
        quadrant: "important-not-urgent",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "not-important-urgent",
    icon: <Users2 className="w-6 h-6 text-foreground" />,
    title: "Not Important & Urgent",
    description: "Delegate these tasks",
    tasks: [
      {
        id: "mix-1",
        title: "Prepare Weekly Project Report",
        description:
          "Could be delegated but team considers it critical. Compile statistics and achievements from last sprint.",
        quadrant: "not-important-urgent",
        createdAt: new Date().toISOString(),
      },
      {
        id: "mix-5",
        title: "Code Review Backlog",
        description:
          "Several pull requests pending review, blocking team progress.",
        quadrant: "not-important-urgent",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "not-important-not-urgent",
    title: "Not Important & Not Urgent",
    icon: <Trash2 className="w-6 h-6 text-destructive" />,
    description: "Eliminate these tasks",
    tasks: [
      {
        id: "mix-4",
        title: "Office Plant Watering",
        description: "Need to water office plants before they die.",
        quadrant: "not-important-not-urgent",
        createdAt: new Date().toISOString(),
      },
      {
        id: "mix-7",
        title: "Update Social Media",
        description: "Post team updates on company social media channels.",
        quadrant: "not-important-not-urgent",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "done",
    icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
    title: "Done",
    description: "Completed tasks",
    tasks: [],
  },
];
const emptyQuadrants: QuadrantType[] = [
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
  const [isRecommendationDialogOpen, setIsRecommendationDialogOpen] =
    useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [reasonings, setReasonings] = useState([]);
  const { ref, getPng } = useToImage();

  const router = useRouter();

  const handleClearAll = () => {
    localStorage.removeItem("eisenhowerTasks");
    setQuadrants(emptyQuadrants);

    // Clear reasonings
    localStorage.removeItem("reasonings");
    setReasonings([]);
  };

  // Inside your Home component, add these before the return statement
  const mouseSensor = useSensor(MouseSensor, {
    // Decrease activation distance to make it more responsive
    activationConstraint: {
      distance: 3, // Reduced from 10 to 3 pixels
      delay: 0, // Add this to remove any delay
      tolerance: 0, // Add this to remove tolerance
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // Increase delay to prevent scroll conflicts
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    const savedTasks = localStorage.getItem("eisenhowerTasks");
    const savedReasonings = localStorage.getItem("reasonings");
    if (savedReasonings) {
      const reasonings = JSON.parse(savedReasonings);
      setReasonings(reasonings);
    }
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
    const targetQuadrant = quadrants.find((q) => q.id === over.id);
    const overQuadrantId = targetQuadrant
      ? over.id
      : quadrants.find((q) => q.tasks.some((t) => t.id === over.id))?.id;

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
    if (taskData.length < 2) {
      toast.error("It seems you don't have enough tasks to categorize.");
      return;
    }

    try {
      //use api
      setLoading(true);
      const response = await axios.post("/api/ai/eisenhower", {
        tasks: taskData,
      });

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
      localStorage.setItem("reasonings", JSON.stringify(responseReasonings));
      setIsRecommendationDialogOpen(true);

      console.log(categorizedTasks);

      const updatedQuadrants = quadrants.map((q) => ({
        ...q,
        tasks: [] as Task[],
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
            reasoning: suggestion.reasoning,
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

  const exportTasks = () => {
    getPng();
    toast.success("Export successful!", {
      description: "Your tasks have been exported as an image.",
    });
  };

  const moveToEatTheFrog = async () => {
    //get the task with the most urgent deadline

    try {
      // Get tasks from important-urgent quadrant
      const urgentQuadrant = quadrants.find((q) => q.id === "important-urgent");
      const urgentTasks = urgentQuadrant?.tasks || [];

      if (urgentTasks.length < 2) {
        toast.error("No urgent tasks found to prioritize.");
        return;
      }

      // Save urgent tasks to localStorage
      localStorage.setItem("urgentTasks", JSON.stringify(urgentTasks));

      // Navigate to frogs page
      router.push("/frog");
    } catch (error) {
      console.error("Error moving to Eat the Frog:", error);
      toast.error("Failed to move tasks. Please try again.");
    }
  };
  return (
    <>
      <div className="min-h-screen bg-primary/10 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
            <div className="flex items-center gap-4 py-2">
              <div className="relative">
                <Image
                  src="/logo.svg"
                  alt="Eisenflow"
                  width={56}
                  height={56}
                  className="object-contain drop-shadow-md"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Eisenflow
                  </h1>
                  <InfoDialog />
                </div>

                <p className="text-sm text-muted-foreground font-medium">
                  Prioritize tasks efficiently with the Eisenhower Matrix
                </p>
              </div>
            </div>

            <div className="flex w-full sm:w-auto gap-2">
              <Button
                onClick={handleAISort}
                disabled={loading}
                className="flex-1 sm:flex-initial items-center"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full " />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {loading ? "Thinking..." : "Ask AI"}
              </Button>
              <Button
                onClick={exportTasks}
                variant="outline"
                className="flex-1 sm:flex-initial items-center"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={handleClearAll}
                variant="destructive"
                className="flex-1 sm:flex-initial items-center"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          {quadrants[0].tasks.length > 0 && (
            <Alert className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <AlertTitle className="text-lg font-semibold tracking-tight">
                    Ready to prioritize your urgent tasks?
                  </AlertTitle>
                  <AlertDescription className="text-sm text-muted-foreground">
                    Use the Eat the Frog method to tackle your important and
                    urgent tasks effectively.
                  </AlertDescription>
                </div>
              </div>
              <Button
                variant="default"
                className="mt-3 sm:mt-0 font-medium "
                onClick={moveToEatTheFrog}
              >
                <ExternalLink className="h-4 w-4" />
                Eat the Frog
              </Button>
            </Alert>
          )}

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            ref={ref}
          >
            {loading ? (
              <QuadrantGridSkeleton />
            ) : (
              <>
                <DndContext
                  sensors={sensors}
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

                  <div className="col-span-1 lg:col-span-2 mx-auto w-full max-w-2xl">
                    <Quadrant
                      icon={quadrants[4].icon}
                      quadrant={quadrants[4]}
                      onAddTask={(task) => handleAddTask(quadrants[4].id, task)}
                      onEditTask={handleEditTask}
                      onCompleteTask={onCompleteTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  </div>

                  <DragOverlay
                    dropAnimation={{
                      duration: 250,
                      easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                    }}
                  >
                    {activeTask ? (
                      <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md">
                        <Card className="bg-white dark:bg-gray-800 shadow-2xl">
                          <CardHeader className="p-3 sm:p-4">
                            <CardTitle className="text-base sm:text-lg font-semibold">
                              {activeTask.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 sm:p-4 pt-0">
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

          <EditTaskDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            task={editingTask}
            onUpdate={handleUpdateTask}
          />
        </div>
      </div>
      {reasonings.length > 0 && (
        <Button
          onClick={() => setIsRecommendationDialogOpen(true)}
          variant="default"
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 shadow-lg z-30 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all duration-200 gap-2 font-medium"
        >
          <BadgeInfo className="h-4 w-4 text-white" />
          View Recommendations
        </Button>
      )}

      <RecommendationDialog
        reasonings={reasonings}
        open={isRecommendationDialogOpen}
        onOpenChange={setIsRecommendationDialogOpen}
      />
    </>
  );
}

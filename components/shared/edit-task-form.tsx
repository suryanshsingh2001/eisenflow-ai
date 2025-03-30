import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onUpdate: (task: Task) => void;
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onUpdate,
}: EditTaskDialogProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const TaskForm = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (task) {
          onUpdate({
            ...task,
            title: formData.get("title") as string,
            description: formData.get("description") as string,
          });
        }
      }}
      className="space-y-4"
    >
      <Input
        name="title"
        defaultValue={task?.title}
        placeholder="Task title"
      />
      <Textarea
        name="description"
        defaultValue={task?.description}
        placeholder="Task description"
        rows={3}
      />
      <Button type="submit" className="w-full">
        Update Task
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[400px]">
          <SheetHeader>
            <SheetTitle>Edit Task</SheetTitle>
          </SheetHeader>
          {task && <TaskForm />}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        {task && <TaskForm />}
      </DialogContent>
    </Dialog>
  );
}
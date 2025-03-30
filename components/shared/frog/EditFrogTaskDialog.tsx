import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { FrogTaskForm, TaskFormValues } from "./FrogTaskForm";
import { FrogTask } from "@/app/frog/page";
import { useEffect } from "react";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any;
  onSubmit: (data: TaskFormValues) => void;
  onClose?: () => void;
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
  onClose,
}: EditTaskDialogProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    //on closing the dialog, reset the task
    if (!open) {
      onClose?.();
    }
  }, [open, onClose]);

  const Content = () => (
    <div className="">
      <FrogTaskForm
        defaultValues={{
          title: task?.title,
          description: task?.description,
          priorityScore: task?.priorityScore,
        }}
        onSubmit={onSubmit}
        submitLabel="Update Task"
      />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Task</DrawerTitle>
            <DrawerDescription>Update your task details</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update your task details</DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}

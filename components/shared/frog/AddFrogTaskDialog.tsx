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
  
  interface AddTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: TaskFormValues) => void;
  }
  
  export function AddTaskDialog({
    open,
    onOpenChange,
    onSubmit,
  }: AddTaskDialogProps) {
    const isMobile = useMediaQuery("(max-width: 640px)");
  
    const Content = () => (
      <div className="space-y-5">
        <FrogTaskForm onSubmit={onSubmit} submitLabel="Add Task" />
      </div>
    );

    
  
    if (isMobile) {
      return (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add a New Task</DrawerTitle>
              <DrawerDescription>
                What's your next big challenge?
              </DrawerDescription>
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
            <DialogTitle>Add a New Task</DialogTitle>
            <DialogDescription>What's your next big challenge?</DialogDescription>
          </DialogHeader>
          <Content />
        </DialogContent>
      </Dialog>
    );
  }
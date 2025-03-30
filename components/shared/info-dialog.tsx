import {
    Dialog,
    DialogTrigger,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogContent,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { InfoIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "../ui/card";

export default function InfoDialog() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const content = (
        <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
            <div className="space-y-8">
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        About Eisenflow
                    </DialogTitle>
                    <DialogDescription className="text-lg leading-relaxed">
                        Eisenflow is a simple yet effective task management tool that helps
                        you focus on what truly matters.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <Card className="border-2 border-primary/20 shadow-lg hover:border-primary/30 transition-all">
                        <CardHeader className="space-y-3">
                            <CardTitle className="text-xl font-semibold text-primary">
                                Key Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-none pl-2 space-y-3 text-muted-foreground">
                                {[
                                    "Simple task prioritization using the Eisenhower Matrix",
                                    "AI-powered insights to help place tasks in the right quadrant",
                                    "Clear, easy-to-use interface",
                                    "Personal task organization",
                                    "Focus on what's important",
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-primary/60" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-primary/20 shadow-lg hover:border-primary/30 transition-all">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-primary">
                                How to Use
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                Simply add your tasks and categorize them based on their urgency
                                and importance. Use AI assistance to get suggestions on task
                                prioritization. This helps you make better decisions about how
                                to spend your time and energy.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-primary/20 shadow-lg hover:border-primary/30 transition-all">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-primary">
                                Coming Soon
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                We're working on adding more productivity tools and features to
                                help you manage your time even better. Stay tuned for updates!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ScrollArea>
    );

    if (!isDesktop) {
        return (
            <Drawer>
                <DrawerTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-primary/10 transition-colors"
                    >
                        <InfoIcon className="h-5 w-5 text-primary" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="px-6 py-6">{content}</div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-primary/10 transition-colors"
                >
                    <InfoIcon className="h-5 w-5 text-primary" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">{content}</DialogContent>
        </Dialog>
    );
}

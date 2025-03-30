import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Wand2 } from "lucide-react"

interface AIAnalysis {
  title: string
  reasoning: string
  priorityScore: string
}

interface AIAnalysisDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  analysisResults: AIAnalysis[]
  onApply: () => void
}

export function AIAnalysisDialog({
    open,
    onOpenChange,
    analysisResults,
    onApply,
  }: AIAnalysisDialogProps) {
    const isMobile = useMediaQuery("(max-width: 640px)")
  
    const Content = (
      <div className="mt-6 space-y-4 px-4 pb-8 overflow-y-auto max-h-[70vh]">
        {analysisResults.map((analysis, index) => (
          <Card 
            key={index} 
            className="group transition-all hover:border-primary/20 hover:bg-primary/5 dark:hover:border-primary/20 dark:hover:bg-primary/5"
          >
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/80 p-2 text-white shadow-md">
                  <span className="flex h-5 w-5 items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                </div>
                {analysis.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Strategy:</span>{" "}
                      {analysis.reasoning}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Priority Score:</span>
                    <Badge 
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {analysis.priorityScore}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
  
        {analysisResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Wand2 className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No analysis results available.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Click "Ask AI" to analyze your tasks.
            </p>
          </div>
        )}
      </div>
    )
  
    const Actions = (
      <div className="flex items-center gap-2 p-4 sm:p-6 border-t bg-background">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          onClick={onApply} 
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Apply Suggestions
        </Button>
      </div>
    )
  
    if (isMobile) {
      return (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="h-[90vh]">
            <DrawerHeader className="pb-2">
              <DrawerTitle className="flex items-center gap-2 text-xl">
                <Wand2 className="h-5 w-5 text-primary" />
                AI Task Analysis
              </DrawerTitle>
              <DrawerDescription>
                Review and apply AI suggestions for your tasks
              </DrawerDescription>
            </DrawerHeader>
            {Content}
            {Actions}
          </DrawerContent>
        </Drawer>
      )
    }
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] max-h-[85vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Wand2 className="h-5 w-5 text-primary" />
              AI Task Analysis
            </DialogTitle>
            <DialogDescription>
              Review and apply AI suggestions for your tasks
            </DialogDescription>
          </DialogHeader>
          {Content}
          {Actions}
        </DialogContent>
      </Dialog>
    )
  }
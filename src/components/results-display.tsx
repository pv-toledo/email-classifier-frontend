"use client"

import type { AIResponse } from "@/lib/api"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Label } from "./ui/label"
import { Copy, Plus } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { cn } from "@/lib/utils"

type ResultsDisplayProps = {
  results: AIResponse[]
  onReset: () => void
}

export function ResultsDisplay({ results, onReset }: ResultsDisplayProps) {
  const handleCopyResponse = (response: string) => {
    navigator.clipboard.writeText(response)
    toast.success("Resposta copiada para a área de transferência!")
  }

  return (
    <main className="min-h-screen">
      <div className="flex mx-auto px-5 pb-40 mt-10 max-w-4xl lg:px-0">
        <div className="flex flex-col gap-10 w-full animate-in fade-in duration-300 lg:gap-15 lg:mt-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold lg:text-4xl">Resultados da Análise</h1>
          </div>
          <div className="flex flex-col gap-5">
            {results.map((result, index) => (
              <Card key={index} className="gap-2.5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg lg:text-xl">Email analisado</CardTitle>
                    {result.classification && (
                      <Badge
                        variant={result.classification === "Produtivo" ? "default" : "destructive"}
                        className={cn("lg:text-sm", result.classification === "Produtivo" ? "bg-green-600 text-white" : "")
                          
                        }
                      >
                        {result.classification}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="original">
                      <AccordionTrigger className="text-base hover:no-underline">Texto original</AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="whitespace-pre-wrap text-sm">{result.original_email}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailResponse" className="text-base font-medium">
                        Resposta Sugerida:
                      </Label>
                      <Button variant="ghost" size="icon" className="w-fit" onClick={() => handleCopyResponse(result.suggested_response)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      id="emailResponse"
                      value={result.suggested_response}
                      readOnly
                      className="max-h-[200px] resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onReset}
                size="lg"
                className="h-14 w-14 lg:h-16 lg:w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-primary hover:bg-primary/90 group"
                aria-label="Iniciar nova análise de email"
              >
                <Plus className="transition-transform group-hover:rotate-90" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <span className="text-base font-medium">Nova análise</span>
              
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </main>
  )
}

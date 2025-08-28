import { AIResponse } from "@/lib/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Label } from "./ui/label";
import { Copy } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

type ResultsDisplayProps = {
  results: AIResponse[];
  onReset: () => void;
};

export function ResultsDisplay({ results, onReset }: ResultsDisplayProps) {
  const handleCopyResponse = (response: string) => {
    navigator.clipboard.writeText(response);
    toast.success("Resposta copiada para a área de transferência!");
  };

  return (
    <div className="flex mx-auto px-10 py-8 max-w-4xl lg:px-0">
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="relative flex justify-center items-center py-4">
          <Button size="lg" variant="outline" onClick={onReset} className="absolute left-0">
            Nova análise
          </Button>
          <h1 className="text-4xl font-bold text-center">Resultados da Análise</h1>
        </div>
        <div className="space-y-6">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Email analisado</CardTitle>
                  {result.classification && (
                    <Badge
                      variant={
                        result.classification === "Produtivo"
                          ? "default"
                          : "destructive"
                      }
                      className={
                        result.classification === "Produtivo"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : ""
                      }
                    >
                      {result.classification}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="original">
                    <AccordionTrigger>Texto original</AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="whitespace-pre-wrap text-sm">
                          {result.original_email}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="emailResponse"
                      className="text-sm font-medium"
                    >
                      Resposta Sugerida:
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopyResponse(result.suggested_response)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    id="emailResponse"
                    value={result.suggested_response}
                    readOnly
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center"></div>
      </div>
    </div>
  );
}

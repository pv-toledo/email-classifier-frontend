"use client";

import type React from "react";
import { toast } from "sonner";
import type { MutationInput } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, UploadCloud, FileText, X } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

type EmailInputFormProps = {
  onSubmit: (data: MutationInput) => void;
  isPending: boolean;
  error: Error | null;
};

const formSchema = z
  .object({
    activeTab: z.enum(["text", "file"]),
    emailText: z.string().optional(),
    selectedFile: z.custom<File | null>().optional(),
  })
  .refine(
    (data) => {
      if (data.activeTab === "text") {
        return data.emailText && data.emailText.trim().length > 0;
      }
      return !!data.selectedFile;
    },
    {
      message: "Por favor, preencha o campo ou selecione um arquivo.",
      path: ["emailText"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export function EmailInputForm({
  onSubmit,
  isPending,
  error,
}: EmailInputFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activeTab: "text",
      emailText: "",
      selectedFile: null,
    },
    mode: "onChange",
  });

  const activeTab = form.watch("activeTab");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type === "text/csv" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      form.setValue("selectedFile", file, {shouldValidate: true});
    } else {
      toast.error("Por favor, selecione um arquivo .csv ou .xlsx válido.");
    }
  };

  const handleClearFile = () => {
    form.setValue("selectedFile", null);
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const onFormSubmit = (data: FormValues) => {
    if (data.activeTab === "text" && data.emailText) {
      onSubmit({ type: "text", payload: data.emailText });
    } else if (data.activeTab === "file" && data.selectedFile) {
      onSubmit({ type: "file", payload: data.selectedFile });
    }
  };

  return (
    <div className="min-h-screen px-10 flex items-center justify-center lg:px-0">
      <div className="flex mx-auto max-w-2xl w-full">
        <div className="space-y-8 animate-in fade-in duration-300 w-full">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Analisador Inteligente de Emails
            </h1>
            <p className="text-muted-foreground">
              Classifique seus emails e gere respostas automáticas com IA.
            </p>
          </div>
          <Card>
            <CardContent className="p-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onFormSubmit)}
                  className="space-y-6"
                >
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      form.setValue("activeTab", value as "text" | "file")
                    }
                    className="space-y-5"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="text">Email único</TabsTrigger>
                      <TabsTrigger value="file">Arquivo em Lote</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text">
                      <FormField
                        control={form.control}
                        name="emailText"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Cole aqui o conteúdo de um e-mail..."
                                className="min-h-[200px] resize-none"
                                disabled={isPending}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="file">
                      <FormField
                        control={form.control}
                        name="selectedFile"
                        render={({ field }) => (
                          <FormItem>
                            {!field.value ? (
                              <FormControl>
                                <Label
                                  htmlFor="file-upload"
                                  className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer block"
                                >
                                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                  <p className="text-lg font-medium">
                                    Clique aqui para selecionar um arquivo
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Arquivos .csv ou .xlsx
                                  </p>
                                  <Input
                                    type="file"
                                    accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    disabled={isPending}
                                  />
                                </Label>
                              </FormControl>
                            ) : (
                              <div className="border-2 border-solid border-primary/20 rounded-lg p-5 bg-primary/5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                      <FileText className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-foreground">
                                        {field.value.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {(field.value.size / 1024).toFixed(1)}{" "}
                                        KB •{" "}
                                        {field.value.type.includes("csv")
                                          ? "CSV"
                                          : "Excel"}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearFile}
                                    className="text-muted-foreground hover:text-destructive"
                                    disabled={isPending}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="mt-4 pt-4 border-t border-border/50">
                                  <Label
                                    htmlFor="file-upload-replace"
                                    className="text-sm text-primary hover:text-primary/80 cursor-pointer underline"
                                  >
                                    Trocar arquivo
                                  </Label>
                                  <Input
                                    type="file"
                                    accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload-replace"
                                    disabled={isPending}
                                  />
                                </div>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro na Análise</AlertTitle>
                      <AlertDescription>
                        {error?.message ||
                          "Ocorreu um erro desconhecido. Tente novamente."}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || isPending}
                    className="w-full"
                    size="lg"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Analisando...
                      </>
                    ) : (
                      "Analisar"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMutation } from "@tanstack/react-query";

import { analyzeEmail } from "@/lib/api";
import { ResultsDisplay } from "@/components/results-display";
import { EmailInputForm } from "@/components/email-input-form";

export default function HomePage() {
  const {
    mutate,
    data: results,
    isPending,
    isSuccess, 
    error, 
    reset, 
  } = useMutation({
    mutationFn: analyzeEmail,
  });

  if (isSuccess && results) {
    return <ResultsDisplay results={results} onReset={reset} />;
  }

  return (
    <EmailInputForm onSubmit={mutate} isPending={isPending} error={error} />
  );
}

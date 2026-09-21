"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function BackButton({ className, ...props }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className={cn(
        "mb-4 text-muted-foreground hover:text-foreground hover:bg-muted",
        className,
      )}
      {...props}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Назад
    </Button>
  );
}

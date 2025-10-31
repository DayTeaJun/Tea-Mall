"use client";

import {
  AlertTriangle,
  CheckCircle,
  Info,
  Loader,
  XCircle,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";
import React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export default function Toaster(props: ToasterProps) {
  const common: ToasterProps = {
    theme: "light",
    duration: 2000,
    className: "toaster group z-[9999]",
    toastOptions: {
      classNames: {
        toast:
          "max-w-[300px] group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        description: "group-[.toast]:text-muted-foreground",
        actionButton:
          "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        cancelButton:
          "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground rounded-full",
      },
    },
    icons: {
      success: <CheckCircle className="h-4 w-4 text-green-500" />,
      info: <Info className="h-4 w-4 text-blue-500" />,
      warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      error: <XCircle className="h-4 w-4 text-red-500" />,
      loading: <Loader className="h-4 w-4 text-gray-500 animate-spin" />,
    },
    ...props,
  };

  return (
    <>
      <Sonner
        {...common}
        position="top-center"
        className={`${common.className} block sm:hidden`}
      />

      <Sonner
        {...common}
        position="bottom-right"
        className={`${common.className} hidden sm:block`}
      />
    </>
  );
}

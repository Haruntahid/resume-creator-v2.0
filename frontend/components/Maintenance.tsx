"use client";

import { Phone, Hammer, Settings2 } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Aesthetic Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full mx-4 space-y-8 text-center z-10">
        {/* Animated Icon Area */}
        <div className="flex justify-center">
          <div className="relative p-6 bg-primary/10 rounded-3xl ring-1 ring-primary/20">
            <Settings2 className="w-10 h-10 text-primary animate-spin duration-[5000ms]" />
            <Hammer className="w-5 h-5 text-primary absolute bottom-4 right-4 animate-bounce" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight">
            System <span className="text-primary">Maintenance</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            We are fine-tuning our engine to provide you with the best
            experience. We&apos;ll be back online in a moment!
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden max-w-[240px]">
            <div className="h-full bg-primary w-1/2 animate-pulse rounded-full" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Optimization in progress
          </span>
        </div>

        {/* Contact Section */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4 font-medium italic">
            Any urgent queries? Reach out to us:
          </p>
          <a
            href="tel:01676782636"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-primary text-primary-foreground hover:opacity-90 rounded-2xl text-sm font-bold transition-all group shadow-lg shadow-primary/20"
          >
            <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            01676782636
          </a>
        </div>
      </div>
    </div>
  );
}

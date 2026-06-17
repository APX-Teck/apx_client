'use client';

interface Props {
  serviceName: string;
  scrollToForm: () => void;
}

export function ServiceDetailStickyCTA({ serviceName, scrollToForm }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t border-glass-border p-4 flex items-center justify-between md:hidden shadow-lg">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">
          Start Project
        </span>
        <span className="text-xs font-bold text-foreground truncate max-w-[150px]">
          {serviceName}
        </span>
      </div>
      <button
        onClick={scrollToForm}
        className="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-md shadow-accent/15 cursor-pointer"
      >
        Request Service
      </button>
    </div>
  );
}

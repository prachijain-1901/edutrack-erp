export function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading data...</p>
    </div>
  );
}

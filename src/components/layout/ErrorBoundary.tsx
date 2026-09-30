import React from "react";

type State = { error: Error | null };

/** Catches a crash anywhere in a page so the app shows a way back instead of a blank screen. */
export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Page crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-4 text-center text-white">
        <h1 className="text-2xl font-bold">Something went wrong on this page</h1>
        <p className="max-w-md text-sm text-gray-400">Your log is safe. Reload the page, or head back to Today.</p>
        <div className="flex gap-3">
          <button onClick={() => window.location.reload()} className="rounded-lg bg-dark-fill-3 px-4 py-2 text-sm font-medium hover:bg-dark-fill-2">
            Reload
          </button>
          {/* A full navigation, not a client-side one, so the crashed tree is thrown away. */}
          <button onClick={() => window.location.assign("/")} className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium">
            Go to Today
          </button>
        </div>
      </div>
    );
  }
}

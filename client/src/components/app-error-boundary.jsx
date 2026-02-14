import React from "react";

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("App render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center p-6 text-center">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Something went wrong.</h2>
            <p className="text-sm text-slate-600">
              Please refresh once. If this keeps happening, open the feedback page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

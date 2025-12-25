
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Standard Error Boundary component to catch rendering errors in visualizer components.
 */
// Fix: Use React.Component with explicit generic types to ensure base class members like setState, props, and state are properly recognized
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Fix: Initialize state within the constructor for better type inference in some environments
    this.state = {
      hasError: false
    };
  }

  // Standard static method to update state after an error is caught
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Standard lifecycle method for logging error details
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  // Fix: Reset the error state and reload; setState is now correctly identified as a member of the base class
  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    // Fix: this.state and this.props are now properly recognized as members of React.Component<Props, State>
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gray-900 rounded-xl border border-red-900/50 text-center">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Visualizer Crashed</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            Something went wrong while rendering this component. 
            {error && (
              <span className="block mt-2 text-xs font-mono text-red-400 bg-black/30 p-2 rounded">
                {error.message}
              </span>
            )}
          </p>
          <Button onClick={this.handleReset} variant="outline" className="border-red-500 text-red-400 hover:bg-red-900/20">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reload Application
          </Button>
        </div>
      );
    }

    return children;
  }
}

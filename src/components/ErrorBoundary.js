import React from "react";
import { clearCache } from "../utils/utils";
const getFullError = (error) => {
  return JSON.stringify(error, Object.getOwnPropertyNames(error));
};
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { from }= this.props;
      const errorObj = JSON.parse(getFullError(this.state.error))
      return (
        <div>
          <button onClick={clearCache}>Clear Cache</button>
          <h4>Error From: {from}</h4>
          <h1>Something went wrong.</h1>
          <span>{errorObj.message}</span>
          <span>{errorObj.stack}</span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
"use client";

import React, { Component, PropsWithChildren } from "react";

class ErrorBoundary extends Component<PropsWithChildren, any, any> {
	constructor(props: PropsWithChildren) {
		super(props);

		// Define a state variable to track whether is an error or not
		this.state = { hasError: false };
	}
	static getDerivedStateFromError(error: unknown) {
		// Update state so the next render will show the fallback UI

		return { hasError: true };
	}
	componentDidCatch(error: unknown, errorInfo: unknown) {
		// You can use your own error logging service here
		console.log({ error, errorInfo });
	}
	render() {
		// Check if the error is thrown
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div>
					<h2>Something went wrong!</h2>
					<button
						type="button"
						onClick={() => this.setState({ hasError: false })}
					>
						Try again?
					</button>
				</div>
			);
		}

		// Return children components in case of no error
		return this.props.children;
	}
}

export default ErrorBoundary;

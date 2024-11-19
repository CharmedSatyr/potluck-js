"use client";

import { useState, useEffect, PropsWithChildren } from "react";

const SlideIn = ({ children }: PropsWithChildren) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<div className={`slide-in ${isVisible ? "visible" : ""}`}>{children}</div>
	);
};

export default SlideIn;

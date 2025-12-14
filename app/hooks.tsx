"use client";

import { useEffect, useState } from "react";

export const useMobileDetection = () => {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		if (window) {
			function handleWindowSizeChange() {
				setIsMobile(window.innerWidth <= 768);
			}

			handleWindowSizeChange();
			window.addEventListener("resize", handleWindowSizeChange);

			return () => {
				window.removeEventListener("resize", handleWindowSizeChange);
			};
		}
	}, []);

	return isMobile;
};

import { ReactNode } from "react";

export const Standout = ({ children }: { children: ReactNode }) => {
	return <span className="font-sans">{children}</span>;
};

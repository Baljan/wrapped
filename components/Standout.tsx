import { ReactNode } from "react";

export const Standout = ({ children }: { children: ReactNode }) => {
	return <span className="font-bold text-white">{children}</span>;
};

"use client";

import { AmountOfCoffee } from "@/components/AmountOfCoffee";
import { End } from "@/components/End";
import { FavCafe } from "@/components/FavCafe";
import { MostPurchases } from "@/components/MostPurchases";
import { Placement } from "@/components/Placement";
import { Welcome } from "@/components/Welcome";
import { WrappedProvider } from "./context";
import { WrappedData } from "./types";

export const Wrapped = ({ data }: { data: WrappedData }) => {
	return (
		<WrappedProvider data={data}>
			<Welcome />
			<AmountOfCoffee />
			<Placement />
			<MostPurchases />
			<FavCafe />
			<End />
		</WrappedProvider>
	);
};

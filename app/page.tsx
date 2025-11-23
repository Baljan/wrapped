import { Fragment } from "react/jsx-runtime";
import { loadWrappedData } from "./actions";

const Home = async () => {
	const data = await loadWrappedData();

	return (
		<Fragment>
			<div className="flex h-screen w-screen items-center justify-center bg-linear-to-tr from-[#00a4e0] via-purple-500 to-[#e6008b]">
				<div className="w-fit">
					<h1 className="stroke-2 font-sans text-9xl">
						Blippen Wrapped
					</h1>
				</div>
			</div>
			<pre>
				<code>{JSON.stringify(data, null, 4)}</code>
			</pre>
		</Fragment>
	);
};

export default Home;

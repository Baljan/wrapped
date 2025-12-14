import { loadWrappedData } from "./actions";
import { Wrapped } from "./wrapped";

const Home = async () => {
	const { success, data } = await loadWrappedData();

	if (!success) {
		return (
			<div className="flex h-screen w-screen flex-col items-center justify-center bg-black">
				<h1 className="font-title px-4 pt-8 text-center text-7xl text-white text-shadow-lg md:text-9xl xl:text-[12rem]">
					Blippen Wrapped
				</h1>
				<p className="mt-16 max-w-6/12 text-center font-sans text-3xl text-white">
					<i>Sorgens dag.</i>
					<br />
					<br />
					Det plågar oss att säga, men du har inte blippat någon gång
					under terminen innan den 14 december, så vi har ingen data
					för dig.
				</p>
			</div>
		);
	}

	return <Wrapped data={data} />;
};

export default Home;

import { loadWrappedData } from "./actions";
import { Wrapped } from "./wrapped";

const Home = async () => {
	const { success, data } = await loadWrappedData();

	if (!success) {
		return (
			<div>
				<h1>Inge wrapped för dig manneeeen</h1>
				<p>Fan skulle blippat lite mer typ</p>
			</div>
		);
	}

	return (
		<>
			<Wrapped data={data} />
			<pre>
				<code>{JSON.stringify(data, null, 4)}</code>
			</pre>
		</>
	);
};

export default Home;

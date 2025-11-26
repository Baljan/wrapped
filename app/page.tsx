import { loadWrappedData } from "./actions";
import { Wrapped } from "./wrapped";

const Home = async () => {
	const data = await loadWrappedData();

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

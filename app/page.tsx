import { loadWrappedData } from "./actions";
import { Wrapped } from "./wrapped";

const Home = async () => {
	const data = await loadWrappedData();

	return <Wrapped data={data} />;
};

export default Home;

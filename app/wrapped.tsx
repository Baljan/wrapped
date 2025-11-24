"use client";

export const Wrapped = ({ data }: { data: unknown }) => {
	// TODO: State machine context?
	return (
		<>
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
		</>
	);
};

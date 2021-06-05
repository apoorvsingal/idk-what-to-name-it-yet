import { useEffect, useState } from "react";
import StackCard from "../../../components/stackcard";
import { TechStack } from "../../../lib/data";
import { Database } from "../../../lib/db";

type ExploreStacksPageProps = {
	stacks: TechStack[]
};

const ExploreStacksPage = ({ stacks }: ExploreStacksPageProps) => {
	const [currentStacks, setCurrentStacks] = useState(stacks);

	return (
		<>
			{currentStacks.map(stack => <StackCard stack={stack}></StackCard>)}
		</>
	);
};

const db = new Database;

export const getServerSideProps = async () => {
	await db.init();

	return { props: { stacks: (await db.techStacks().find([], { limit: 10 })).map(t => ({...t})) } };
};

export default ExploreStacksPage;

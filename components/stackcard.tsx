import { TechStack } from "../lib/data";
import Image from "next/image";

type StackCardProps = {
	stack: TechStack
};

const StackCard = ({ stack }: StackCardProps) => {
	return (
		<div>
			<Image src={stack.data.icon} width="100%" height="100%"/>
			<span>
				<span>{stack.data.name}</span>
				<span>{stack.data.description}</span>
			</span>
		</div>
	);
};

export default StackCard;
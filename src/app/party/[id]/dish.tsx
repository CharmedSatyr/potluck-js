import { type Dish } from "@/db/schema/dishes";

interface Props {
	dish: Dish;
	handleDelete: (id: string) => Promise<void>;
}

const Dish = ({ dish, handleDelete }: Props) => {
	return (
		<div className="m-2 flex justify-between border-2 border-teal-500 p-2">
			<div>
				<h3 className="text-2xl">{dish.name}</h3>
				<div>{dish.description}</div>
				<div>{dish.createdBy}</div>
				<div>Last modified: {dish.createdAt.toDateString()}</div>
			</div>
			<button
				onClick={async () => await handleDelete(dish.id)}
				className="border-2 border-rose-500 p-4"
			>
				Delete
			</button>
		</div>
	);
};

export default Dish;

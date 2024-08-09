"use client";

import { useEffect, useState } from "react";
import Dish from "./dish";
import { type Dish as DishType } from "@/db/schema/dishes";
import deleteDish from "@/actions/delete-dish";
import DishForm, { FormInput } from "./dish-form";
import createDish from "@/actions/create-dish";

interface Props {
	dishes: DishType[];
}

const Dishes = (props: Props) => {
	const [dishes, setDishes] = useState<DishType[]>([]);

	useEffect(() => {
		setDishes(props.dishes);
	}, [props.dishes]);

	// create
	const handleCreate = async (data: FormInput): Promise<void> => {
		const result = await createDish(data);
		if (!result.length) {
			console.error("Failed to create dish");
			return;
		}
		const newDishes = [...dishes, ...result];
		setDishes(newDishes);
	};

	// delete
	const handleDelete = async (id: string) => {
		const result = await deleteDish(id);

		if (!result.length) {
			console.error("There was an issue deleting dish: ", id);
			return;
		}

		const newDishes = dishes.filter((dish) => dish.id !== id);
		setDishes(newDishes);
	};

	const toggleModal = () => {
		const modal = document.getElementById(
			"dish_modal"
		) as HTMLDialogElement | null;

		if (!modal) {
			return;
		}

		if (!modal.open) {
			modal.showModal();
			return;
		}

		modal.close();
	};

	return (
		<div className="my-6">
			<h2 className="text-2xl">Dishes</h2>

			<button className="btn btn-primary" onClick={toggleModal}>
				Bring a dish!
			</button>
			<DishForm handleCreate={handleCreate} close={toggleModal} />

			<div>
				{dishes.map((dish) => (
					<Dish
						key={`${dish.name}-${dish.createdBy}`}
						dish={dish}
						handleDelete={handleDelete}
					/>
				))}
			</div>
		</div>
	);
};

export default Dishes;

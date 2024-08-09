"use client";

import { useEffect, useState } from "react";
import Dish from "@/app/party/[id]/dish";
import { type Dish as DishType } from "@/db/schema/dishes";
import createDish from "@/actions/db/create-dish";
import deleteDish from "@/actions/db/delete-dish";
import CreateDishForm, {
	FormInput as CreateDishFormInput,
} from "@/app/party/[id]/create-dish-form";
import updateDish from "@/actions/db/update-dish";
import { FormInput as UpdateDishFormInput } from "./update-dish-form";

interface Props {
	dishes: DishType[];
}

const Dishes = (props: Props) => {
	const [dishes, setDishes] = useState<DishType[]>([]);

	useEffect(() => {
		setDishes(props.dishes);
	}, [props.dishes]);

	// create
	const handleCreate = async (data: CreateDishFormInput): Promise<void> => {
		const result = await createDish(data);
		if (!result.length) {
			console.error("Failed to create dish");
			return;
		}
		const newDishes = [...dishes, ...result];
		setDishes(newDishes);
	};

	// update
	const handleUpdate = async (data: UpdateDishFormInput): Promise<void> => {
		if (!data.id) {
			return;
		}

		if (!data.description && !data.name) {
			return;
		}

		const result = await updateDish({
			description: data.description,
			id: data.id,
			name: data.name,
		});

		if (!result.length) {
			console.error("Failed to update dish");
			return;
		}

		const index = dishes.findIndex((dish) => dish.id === data.id);
		const updatedDishes = dishes.toSpliced(index, 1, result[0]);

		setDishes(updatedDishes);
	};

	// delete
	const handleDelete = async (id: Dish["id"]) => {
		const result = await deleteDish(id);

		if (!result.length) {
			console.error("There was an issue deleting dish: ", id);
			return;
		}

		const newDishes = dishes.filter((dish) => dish.id !== id);
		setDishes(newDishes);
	};

	const toggleCreateDishModal = () => {
		const modal = document.getElementById(
			"create_dish_modal"
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

	const toggleUpdateDishModal = () => {
		const modal = document.getElementById(
			"update_dish_modal"
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
		<div>
			{dishes.length > 0 ? <h2>On the Table</h2> : <h2>Nothing here yet...</h2>}
			<button className="btn btn-primary" onClick={toggleCreateDishModal}>
				Sign up to bring a dish!
			</button>

			{dishes.length > 0 && (
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th></th>
								<th>Name</th>
								<th>Description</th>
								<th>Brought by</th>
								<th>Serves</th>
								<th>Tags</th>
								<th></th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{dishes.map((dish) => (
								<Dish
									key={dish.id}
									dish={dish}
									handleDelete={handleDelete}
									handleUpdate={handleUpdate}
									toggleModal={toggleUpdateDishModal}
								/>
							))}
						</tbody>
					</table>
				</div>
			)}

			<CreateDishForm
				handleCreate={handleCreate}
				close={toggleCreateDishModal}
			/>
		</div>
	);
};

export default Dishes;

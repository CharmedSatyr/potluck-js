import { type Dish } from "@/db/schema/dishes";
import UpdateDishForm, {
	FormInput as UpdateDishFormInput,
} from "@/app/party/[id]/update-dish-form";

interface Props {
	dish: Dish;
	handleDelete: (id: Dish["id"]) => Promise<void>;
	handleUpdate: (data: UpdateDishFormInput) => Promise<void>;
	toggleModal: () => void;
}

const Dish = ({ dish, handleDelete, handleUpdate, toggleModal }: Props) => {
	return (
		<>
			<tr>
				<th></th>
				<td>{dish.name}</td>
				<td>{dish.description}</td>
				<td>{dish.createdBy}</td>
				<td></td>
				<td></td>
				<td>
					<button className="btn btn-secondary" onClick={toggleModal}>
						Update
					</button>
				</td>

				<td>
					<button
						className="btn btn-accent"
						onClick={async () => await handleDelete(dish.id)}
					>
						Delete
					</button>
				</td>
			</tr>

			<UpdateDishForm
				close={toggleModal}
				handleUpdate={handleUpdate}
				id={dish.id}
			/>
		</>
	);
};

export default Dish;

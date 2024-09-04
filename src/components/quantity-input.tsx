"use client";

import { Dispatch, SetStateAction } from "react";

interface Props {
	index: number;
	labelText: string;
	max: number;
	min: number;
	quantity: number;
	setQuantity: Dispatch<SetStateAction<number>>;
}
const QuantityInput = ({
	index,
	labelText,
	max,
	min,
	quantity,
	setQuantity,
}: Props) => {
	return (
		<div className="form-control">
			<label htmlFor={`quantity-input-${index}`} className="label label-text">
				{labelText}
			</label>

			<div className="join join-horizontal">
				<button
					onClick={() => setQuantity(quantity > min ? quantity - 1 : min)}
					type="button"
					className="btn join-item input-bordered"
				>
					<svg
						className="h-3 w-3 text-gray-900 dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 18 2"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M1 1h16"
						/>
					</svg>
				</button>

				<input
					type="text"
					className="input join-item input-bordered w-14 border"
					id={`quantity-input-${index}`}
					style={{ borderRadius: 0 }} // TODO: This is necessary due to conflicts with parent join classes
					value={quantity}
					readOnly
				/>

				<button
					onClick={() => setQuantity(quantity < max ? quantity + 1 : max)}
					type="button"
					className="btn join-item input-bordered"
				>
					<svg
						className="h-3 w-3 text-gray-900 dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 18 18"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 1v16M1 9h16"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default QuantityInput;

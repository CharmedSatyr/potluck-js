"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SlotInput from "@/components/plan-food-form/slot-input";
import { v4 as uuidv4 } from "uuid";
import deleteSlot from "@/actions/db/delete-slot";
import { EventData } from "@/@types/event";
import { MAX_SLOTS } from "@/constants/max-slots";
import { SlotData } from "@/@types/slot";
import { schema as slotSchema } from "@/validation/slot.schema"

type Props = {
	committedUsersBySlot: Map<string, JSX.Element>;
	eventData: EventData;
	slots: SlotData[];
};

const PlanFoodForm = ({
	committedUsersBySlot,
	eventData,
	slots: prevSlots,
}: Props) => {
	const [slots, setSlots] = useState<
		{ count: string; id?: string; item: string; key: string }[]
	>(() => {
		if (prevSlots.length > 0) {
			return prevSlots.map((slot) => ({
				count: slot.count.toString(),
				id: slot.id,
				item: slot.item,
				key: uuidv4(),
			}));
		}

		return [{ count: "0", item: "", key: uuidv4() }];
	});

	useEffect(() => {
		const filtered = slots.filter(
			(slot) => slot.count !== "0" && slot.item !== ""
		);

		const propSlots = prevSlots.map((slot) => {
			return { ...slot, count: slot.count.toString(), key: uuidv4() };
		});

		const newSlots = [];

		if (filtered.length) {
			newSlots.push(...filtered);
		}

		if (propSlots.length) {
			newSlots.push(...propSlots);
		}

		if (!newSlots.length) {
			return;
		}

		setSlots(newSlots);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prevSlots]);

	const addSlot = () => {
		if (slots.length >= MAX_SLOTS) {
			return;
		}

		setSlots([...slots, { count: "0", item: "", key: uuidv4() }]);
	};

	const removeSlot = useCallback(
		async (index: number, id?: string) => {
			setSlots(slots.filter((_, i) => i !== index));

			if (!id) {
				return;
			}

			await deleteSlot({ id });
		},
		[slots]
	);

	const handleSlotChange = (index: number, item: string, count: string) => {
		const updatedSlots = [...slots];
		updatedSlots[index].item = item;
		updatedSlots[index].count = count;

		setSlots(updatedSlots);
	};

	const slotsValid = useMemo(
		() =>
			slots.length > 0 &&
			slots.every((slot) => slotSchema.safeParse(slot).success),
		[slots]
	);

	const disableButtons = !eventData;

	return (
		<form
			action="/plan/confirm"
			className="form-control mx-2 w-full md:w-11/12 lg:w-9/12 2xl:w-7/12"
			data-testid="plan-food-form"
		>
			<h2>Create Signup Slots</h2>

			{slots.map((slot, index) => (
				<div key={slot.key}>
					<SlotInput
						change={handleSlotChange}
						count={slot.count}
						hasCommitments={committedUsersBySlot.has(slot.id ?? "")}
						id={slot.id}
						index={index}
						item={slot.item}
						remove={removeSlot}
					/>
					{committedUsersBySlot.has(slot.id ?? "") && (
						<div className="mt-4 flex w-full items-center justify-center">
							<span className="text-sm font-light">Existing Commitments:</span>
							<span className="mx-2">
								{committedUsersBySlot.get(slot.id ?? "")}
							</span>
						</div>
					)}
					<div className="divider mt-6" />
				</div>
			))}

			<div className="mb-4 flex justify-between">
				<button
					className="btn btn-secondary w-1/3"
					disabled={disableButtons || slots.length >= MAX_SLOTS}
					onClick={addSlot}
					type="button"
				>
					Add Slot
				</button>
				<button
					className={`btn btn-accent w-1/3 ${disableButtons ? "btn-disabled pointer-events-none" : ""}`}
					formNoValidate={true}
				>
					Skip for Now
				</button>
			</div>

			<input
				autoComplete="off"
				defaultValue={eventData.name}
				hidden
				name="name"
				required
				type="text"
			/>
			<input
				defaultValue={eventData.startDate}
				hidden
				name="startDate"
				required
				type="date"
			/>
			<input
				defaultValue={eventData.startTime}
				hidden
				name="startTime"
				required
				type="time"
			/>
			<input
				defaultValue={eventData.location}
				hidden
				name="location"
				required
				type="text"
			/>
			<input defaultValue={eventData.hosts} hidden name="hosts" type="text" />
			<input
				defaultValue={eventData.description}
				hidden
				name="description"
				type="text"
			/>

			<button
				className="btn btn-primary w-full"
				disabled={disableButtons || !slotsValid}
				type="submit"
			>
				Save and Continue
			</button>
		</form>
	);
};

export default PlanFoodForm;

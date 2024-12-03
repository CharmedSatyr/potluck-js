"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import SlotInput from "@/components/plan-food-form/slot-input";
import deleteSlot from "@/actions/db/delete-slot";
import { EventData } from "@/@types/event";
import { MAX_SLOTS } from "@/constants/max-slots";
import { SlotData } from "@/@types/slot";
import { schema as slotSchema } from "@/validation/slot.schema";
import { WizardMode } from "@/@types/wizard-mode";

type Props = {
	code: string | null;
	committedUsersBySlotPromise: Promise<Map<string, JSX.Element>>;
	eventData: EventData;
	mode: WizardMode;
	slots: SlotData[];
	suggestedSlots: SlotData[];
};

const PlanFoodForm = ({
	code,
	committedUsersBySlotPromise,
	eventData,
	mode,
	slots: prevSlots,
	suggestedSlots,
}: Props) => {
	const committedUsersBySlot = use(committedUsersBySlotPromise);

	const [slots, setSlots] = useState<
		{ count: string; id?: string; item: string; order: number }[]
	>(() => {
		if (prevSlots.length > 0) {
			return prevSlots.map((slot) => ({
				count: slot.count.toString(),
				id: slot.id,
				item: slot.item,
				order: slot.order,
			}));
		}

		return [{ count: "0", item: "", order: 1 }];
	});

	useEffect(() => {
		const suggested = suggestedSlots.map((slot) => {
			return { ...slot, count: slot.count.toString() };
		});

		if (!suggested.length) {
			return;
		}

		setSlots((state) =>
			[
				...state.filter((slot) => slot.count !== "0" && slot.item !== ""),
				...suggested,
			].map((slot, i) => ({ ...slot, order: i + 1 }))
		);
	}, [setSlots, suggestedSlots]);

	const addSlot = () => {
		if (slots.length >= MAX_SLOTS) {
			return;
		}

		setSlots([...slots, { count: "0", item: "", order: slots.length + 1 }]);
	};

	const removeSlot = useCallback(
		async (index: number, id?: string) => {
			setSlots(
				slots
					.filter((_, i) => i !== index)
					.map((slot, i) => ({ ...slot, order: i + 1 }))
			);

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

	const determineAction = () => {
		if (mode === "create") {
			return "/plan/confirm";
		}

		if (mode === "edit") {
			return `/event/${code}/edit/confirm`;
		}

		return "";
	};

	return (
		<form
			action={determineAction()}
			className="form-control mx-2 w-full"
			data-testid="plan-food-form"
		>
			<h2>Create Signup Slots</h2>

			{slots.map((slot, index) => (
				<div key={slot.order}>
					<SlotInput
						{...slot}
						change={handleSlotChange}
						hasCommitments={committedUsersBySlot.has(slot.id ?? "")}
						index={index}
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
				hidden
				name="title"
				readOnly
				required
				type="text"
				value={eventData.title}
			/>
			<input
				hidden
				name="startDate"
				readOnly
				required
				type="date"
				value={eventData.startDate}
			/>
			<input
				hidden
				name="startTime"
				readOnly
				required
				type="time"
				value={eventData.startTime}
			/>
			<input
				hidden
				name="location"
				readOnly
				required
				type="text"
				value={eventData.location}
			/>
			<input hidden name="hosts" readOnly type="text" value={eventData.hosts} />
			<input
				hidden
				name="description"
				readOnly
				type="text"
				value={eventData.description}
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

export const PlanFoodFormFallback = () => {
	return (
		<div className="flex w-full flex-col gap-4">
			<div className="skeleton h-14 w-5/12" />
			<div className="flex justify-between gap-2">
				<div className="skeleton h-14 w-1/12" />
				<div className="skeleton h-14 w-7/12" />
				<div className="skeleton h-14 w-3/12" />
			</div>
			<div className="flex justify-between gap-2">
				<div className="skeleton h-14 w-4/12" />
				<div className="skeleton h-14 w-4/12" />
			</div>
			<div className="skeleton h-14 w-full" />
		</div>
	);
};

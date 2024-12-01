"use client";

import {
	useActionState,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from "react";
import SlotInput from "@/components/plan-food-form/slot-input";
import { v4 as uuidv4 } from "uuid"; // TODO: ew ew ew
// TODO: Should this be passed in?
import submitSlots, {
	PlanFoodFormState,
} from "@/components/plan-food-form/submit-actions";
import { useSearchParams } from "next/navigation";
import useAnchor from "@/hooks/use-anchor";
import Link from "next/link";
import { z } from "zod";
// TODO: Should this be passed in?
import deleteSlot from "@/actions/db/delete-slot";
import { Step } from "@/components/manage-event-wizard";
import LoadingIndicator from "@/components/loading-indicator";
import WarningAlert from "@/components/warning-alert";
import { EventData } from "@/@types/event";

const MAX_SLOTS = 20;

const slotSchema = z.strictObject({
	id: z.string().uuid(),
	count: z.coerce.number().positive(),
	item: z.string().trim().min(1),
});

type Props = {
	code: string | null;
	committedUsersBySlot: Map<string, JSX.Element>;
	eventData: EventData;
	slots: { id: string; item: string; count: number }[];
};

const PlanFoodForm = ({
	code,
	committedUsersBySlot,
	eventData,
	slots: prevSlots,
}: Props) => {
	const [anchor] = useAnchor();
	const searchParams = useSearchParams();
	const [, forceUpdate] = useReducer((x) => x + 1, 0);

	// TODO: Add loading indicator when pending.
	const [state, submit, isPending] = useActionState<
		PlanFoodFormState,
		FormData
	>(submitSlots, {
		code: code ?? "",
		message: "",
		success: false,
	});

	useEffect(() => {
		if (state?.code) {
			return;
		}

		const eventCode = code ?? searchParams.get("code");

		if (!eventCode) {
			return;
		}

		state.code = eventCode;

		forceUpdate();
	}, [code, state, searchParams]);

	/** TODO: Update this to work without JS. */
	const [slots, setSlots] = useState<
		{ item: string; count: string; id: string }[]
	>(() => {
		if (prevSlots.length > 0) {
			return prevSlots.map((slot) => ({
				count: slot.count.toString(),
				id: slot.id,
				item: slot.item,
			}));
		}

		return [{ item: "", count: "0", id: uuidv4() }];
	});

	useEffect(() => {
		const filtered = slots.filter(
			(slot) => slot.count !== "0" && slot.item !== ""
		);
		// TODO: ChatGPT comes out with uuids like uuid-1, uuid-2...
		const uuid = z.string().uuid();
		const propSlots = prevSlots.map((slot) => {
			if (!uuid.safeParse(slot.id).success) {
				return { ...slot, id: uuidv4(), count: slot.count.toString() };
			}

			return { ...slot, count: slot.count.toString() };
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

		setSlots([...slots, { item: "", count: "0", id: uuidv4() }]);
	};

	const removeSlot = useCallback(
		async (index: number, id: string) => {
			setSlots(slots.filter((_, i) => i !== index));
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

	const disableButtons = isPending || anchor === Step.CREATE_EVENT;

	return (
		<form
			action={submit}
			className="form-control mx-2 w-full md:w-11/12 lg:w-9/12 2xl:w-7/12"
			data-testid="plan-food-form"
		>
			<h2>Create Signup Slots</h2>

			<WarningAlert text={state?.message} />
			{slots.map((slot, index) => (
				<div key={slot.id}>
					<SlotInput
						change={handleSlotChange}
						count={slot.count}
						hasCommitments={committedUsersBySlot.has(slot.id)}
						id={slot.id}
						index={index}
						item={slot.item}
						key={slot.id}
						remove={removeSlot}
					/>
					{committedUsersBySlot.has(slot.id) && (
						<div className="mt-4 flex w-full items-center justify-center">
							<span className="text-sm font-light">Existing Commitments:</span>
							<span className="mx-2">{committedUsersBySlot.get(slot.id)}</span>
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
				<Link
					className={`btn btn-accent w-1/3 ${!state.code || disableButtons ? "btn-disabled pointer-events-none" : ""}`}
					href={`/event/${state.code}`}
				>
					Skip for Now
				</Link>
			</div>

			<input
				defaultValue={JSON.stringify(eventData)}
				hidden
				name="eventData"
				required
				type="text"
			/>

			<button
				className="btn btn-primary w-full"
				disabled={disableButtons || !slotsValid}
				type="submit"
			>
				{isPending ? <LoadingIndicator size={10} /> : "Save and Continue"}
			</button>
		</form>
	);
};

export default PlanFoodForm;

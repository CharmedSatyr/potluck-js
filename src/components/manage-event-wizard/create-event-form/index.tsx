"use client";

import Form from "next/form";
import { useActionState, useEffect } from "react";
import submit from "../actions";
import useAnchor from "@/hooks/use-anchor";

const CreateEventForm = () => {
    const [, scrollToAnchor] = useAnchor();
    const [state, submitAction, isPending] = useActionState(submit, {});

    useEffect(() => {
        if (isPending || !state.code || typeof window === "undefined") {
            return;
        }

        scrollToAnchor('plan-food');
    }, [state.code, isPending]);

    return (
        <Form
            action={submitAction}
            className="flex max-h-96 flex-col justify-between"
        >
            <input
                className="w-full border-b-2 border-base-100 bg-inherit text-6xl font-extrabold text-primary focus:border-neutral focus:outline-none"
                name="name"
                id="name"
                placeholder="Wicked"
                type="text"
                defaultValue="Wicked"
            />
            <div className="flex items-center justify-between">
                <input
                    className="border-base-100 bg-inherit text-2xl focus:border-b-2 focus:border-neutral focus:outline-none"
                    name="date"
                    type="date"
                />{" "}
                <span className="text-2xl font-bold"> at </span>
                <input
                    className="w-4/12 border-b-2 border-base-100 bg-inherit text-2xl focus:border-neutral focus:outline-none"
                    name="time"
                    step={60}
                    type="time"
                />
            </div>
            <div className="mb-4 mt-1">
                <input
                    className="my-2 w-full border-b-2 border-base-100 bg-inherit text-2xl focus:border-neutral focus:outline-none"
                    name="location"
                    placeholder="Place name, address, or link"
                    type="text"
                />
            </div>
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <span className="-mr-5 w-3/12 text-xl font-bold">Hosted by</span>{" "}
                    <input
                        className="w-8/12 border-b-2 border-base-100 bg-inherit text-xl focus:border-neutral focus:outline-none"
                        name="hosts"
                        placeholder={"(optional) Nickname"}
                        type="text"
                    />
                </div>
            </div>
            <input
                className="my-2 w-full border-b-2 border-base-100 bg-inherit focus:border-neutral focus:outline-none"
                name="description"
                placeholder="(optional) Add a description of your event"
            />
            <button
                className="btn btn-primary w-full"
                disabled={isPending}
                type="submit"
            >
                Next
            </button>
        </Form>
    );
};

export default CreateEventForm;

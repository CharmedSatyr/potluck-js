import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

const useQueryString = () => {
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	const deleteQueryString = useCallback(
		(name: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.delete(name);

			return params.toString();
		},
		[searchParams]
	);

	return { createQueryString, deleteQueryString };
};

export default useQueryString;

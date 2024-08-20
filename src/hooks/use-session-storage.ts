import { Dispatch, useState, useEffect } from "react";

type UseSessionStorageOutput<T> = readonly [T, Dispatch<T>, () => void];

const useSessionStorage = <T>(
	key: string,
	initialValue: T
): UseSessionStorageOutput<T> => {
	const [value, setValue] = useState<T>(() => {
		try {
			const currentValue = sessionStorage.getItem(key);

			if (typeof currentValue !== "string") {
				return initialValue;
			}

			return JSON.parse(currentValue);
		} catch (error) {
			console.warn(error);
			return initialValue;
		}
	});

	useEffect(() => {
		sessionStorage.setItem(key, JSON.stringify(value));
	}, [value, key]);

	const removeValue = () => sessionStorage.removeItem(key);

	return [value, setValue, removeValue] as const;
};

export default useSessionStorage;

import { Dispatch, useState, useEffect } from "react";

type UseSessionStorageOutput<T> = [T, Dispatch<T>, () => void];

function useSessionStorage<T>(key: string): UseSessionStorageOutput<T> {
	const [value, setValue] = useState<T>(() => {
		try {
			const currentValue: string | null = sessionStorage.getItem(key);

			if (!currentValue) {
				return;
			}

			return JSON.parse(currentValue);
		} catch (error) {
			console.error(error);
		}
	});

	useEffect(() => {
		sessionStorage.setItem(key, JSON.stringify(value));
	}, [value, key]);

	const removeValue = () => sessionStorage.removeItem(key);

	return [value, setValue, removeValue];
}

export default useSessionStorage;

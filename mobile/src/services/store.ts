import AsyncStorage from '@react-native-async-storage/async-storage';

const ITEM_NAME = 'token';

export function save(value: string): Promise<void> {
	return AsyncStorage.setItem(ITEM_NAME, value);
}

export function load(): Promise<string | null> {
	return AsyncStorage.getItem(ITEM_NAME);
}

export function flush(): Promise<void> {
	return AsyncStorage.clear();
}

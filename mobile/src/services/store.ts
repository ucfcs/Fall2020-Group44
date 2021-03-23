import AsyncStorage from '@react-native-async-storage/async-storage';

const ITEM_NAME = 'token';

export function save(value: string) {
	return AsyncStorage.setItem(ITEM_NAME, value);
}

export function load() {
	return AsyncStorage.getItem(ITEM_NAME);
}

export function flush() {
	return AsyncStorage.clear();
}

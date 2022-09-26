function setCache(key: string, value: string) {
	window.sessionStorage.setItem(key, value);
	return { error: false };
}

function getCache(key: string) {
	let data = sessionStorage.getItem(key);
	if (data) return data;

	return null;
}

export { setCache, getCache };

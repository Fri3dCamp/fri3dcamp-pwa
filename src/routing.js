export function prefixRoute(route) {
	return window.location.pathname.startsWith('/app') ? `/app${route}` : route;
}

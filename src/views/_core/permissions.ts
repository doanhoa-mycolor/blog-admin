import type { FunctionComponent } from "react";
import { createElement } from "react";

// Redefine type for correct usage logic
export type Actions = {
	list: boolean;
	create: boolean;
	edit: boolean;
	show: boolean;
};

export type Permission = {
	posts?: Actions;
	comments?: Actions;
	users?: Actions;
	categories?: Actions;
	tags?: Actions;
	[key: string]: Actions | undefined;
};

export const generateRole = (role: string): Permission => {
	// Role-based Permissions
	const permissions: Permission = {
		posts: { list: false, create: false, edit: false, show: false },
		comments: { list: false, create: false, edit: false, show: false },
		users: { list: false, create: false, edit: false, show: false },
		categories: { list: false, create: false, edit: false, show: false },
		tags: { list: false, create: false, edit: false, show: false },
	};

	// ADMIN has full access to all resources
	if (role === "ADMIN") {
		Object.keys(permissions).forEach((resource) => {
			const actions = permissions[resource];
			if (actions) {
				Object.keys(actions).forEach((action) => {
					actions[action as keyof Actions] = true;
				});
			}
		});
		return permissions;
	}

	// EDITOR can manage posts, comments, categories, and tags but can't manage users
	if (role === "EDITOR") {
		["posts", "comments", "categories", "tags"].forEach((resource) => {
			const actions = permissions[resource];
			if (actions) {
				Object.keys(actions).forEach((action) => {
					actions[action as keyof Actions] = true;
				});
			}
		});
		// EDITOR can only view user list and details
		if (permissions.users) {
			permissions.users.list = true;
			permissions.users.show = true;
		}
		return permissions;
	}

	// VIEWER can only view content
	if (role === "VIEWER") {
		["posts", "comments", "categories", "tags", "users"].forEach((resource) => {
			const actions = permissions[resource];
			if (actions) {
				actions.list = true;
				actions.show = true;
			}
		});
		// VIEWER can create comments
		if (permissions.comments) {
			permissions.comments.create = true;
		}
	}

	return permissions;
};

export const checkRole = ({
	permissions,
	resource,
	action,
	component,
	props,
}: {
	permissions: Permission;
	resource: keyof Permission;
	action: keyof Actions;
	component: any;
	props?: any;
}) => {
	if (!permissions) return false;
	if (!permissions[resource]) return false;
	const resComponent = props
		? createElement(component as FunctionComponent, props)
		: component;

	return !!permissions[resource][action] ? resComponent : null;
};

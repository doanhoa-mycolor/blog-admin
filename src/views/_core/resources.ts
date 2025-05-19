import {
	Article,
	Category,
	Comment,
	Group,
	LocalOffer,
} from "@mui/icons-material";

export type ReactComponent = ComponentType<any> | ReactElement | undefined;

export interface ResourceIF {
	list?: ReactComponent;
	show?: ReactComponent;
	edit?: ReactComponent;
	create?: ReactComponent;
	icon?: ReactComponent;
	resource: string;
	defaultProp?: boolean;
	name?: string;
}

import { PostCreate, PostEdit, PostList, PostShow } from "../Posts";

import {
	CommentCreate,
	CommentEdit,
	CommentList,
	CommentShow,
} from "../Comments";

import type { ComponentType, ReactElement } from "react";
import { UserCreate, UserEdit, UserList } from "../Users";

const Resources: ResourceIF[] = [
	{
		resource: "posts",
		list: PostList,
		edit: PostEdit,
		create: PostCreate,
		show: PostShow,
		icon: Article,
	},
	{
		resource: "comments",
		list: CommentList,
		edit: CommentEdit,
		create: CommentCreate,
		show: CommentShow,
		icon: Comment,
	},
	{
		resource: "users",
		list: UserList,
		edit: UserEdit,
		create: UserCreate,
		icon: Group,
	},
	{
		resource: "categories",
		// list: CategoryList,
		// edit: CategoryEdit,
		// create: CategoryCreate,
		icon: Category,
	},
	{
		resource: "tags",
		// list: TagList,
		// edit: TagEdit,
		// create: TagCreate,
		icon: LocalOffer,
	},
];

export default Resources;

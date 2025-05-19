"use client";

import {
	Datagrid,
	DateField,
	EditButton,
	List,
	ReferenceField,
	ReferenceInput,
	SelectInput,
	ShowButton,
	TextField,
	TextInput,
} from "react-admin";

const commentFilters = [
	<TextInput key="q" source="q" label="Search" alwaysOn />,
	<ReferenceInput key="postId" source="postId" reference="posts" label="Post">
		<SelectInput optionText="title" />
	</ReferenceInput>,
	<ReferenceInput
		key="authorId"
		source="authorId"
		reference="users"
		label="Author"
	>
		<SelectInput optionText="name" />
	</ReferenceInput>,
	<SelectInput
		key="status"
		source="status"
		label="Status"
		choices={[
			{ id: "PENDING", name: "Pending" },
			{ id: "APPROVED", name: "Approved" },
			{ id: "REJECTED", name: "Rejected" },
		]}
	/>,
];

export const CommentList: React.FC = () => (
	<List filters={commentFilters}>
		<Datagrid>
			<TextField source="content" label="Content" />
			<ReferenceField source="postId" reference="posts" label="Post">
				<TextField source="title" />
			</ReferenceField>
			<ReferenceField source="authorId" reference="users" label="Author">
				<TextField source="name" />
			</ReferenceField>
			<TextField source="status" label="Status" />
			<DateField source="created" label="Created Date" />
			<ShowButton />
			<EditButton />
		</Datagrid>
	</List>
);

export default CommentList;

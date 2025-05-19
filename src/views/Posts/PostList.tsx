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

const postFilters = [
	<TextInput key="q" source="q" label="Search" alwaysOn />,
	<ReferenceInput
		key="authorId"
		source="authorId"
		reference="users"
		label="Author"
	>
		<SelectInput optionText="name" />
	</ReferenceInput>,
	<ReferenceInput
		key="categoryId"
		source="categoryId"
		reference="categories"
		label="Category"
	>
		<SelectInput optionText="name" />
	</ReferenceInput>,
	<SelectInput
		key="status"
		source="status"
		label="Status"
		choices={[
			{ id: "DRAFT", name: "Draft" },
			{ id: "PUBLISHED", name: "Published" },
			{ id: "ARCHIVED", name: "Archived" },
		]}
	/>,
];

export const PostList: React.FC = () => (
	<List filters={postFilters}>
		<Datagrid>
			<TextField source="title" label="Title" />
			<ReferenceField source="authorId" reference="users" label="Author">
				<TextField source="name" />
			</ReferenceField>
			<ReferenceField
				source="categoryId"
				reference="categories"
				label="Category"
			>
				<TextField source="name" />
			</ReferenceField>
			<TextField source="status" label="Status" />
			<DateField source="publishedAt" label="Published Date" />
			<DateField source="created" label="Created Date" />
			<ShowButton />
			<EditButton />
		</Datagrid>
	</List>
);

export default PostList;

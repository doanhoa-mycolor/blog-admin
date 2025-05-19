"use client";

import {
	Datagrid,
	DateField,
	EditButton,
	ReferenceField,
	ReferenceManyField,
	RichTextField,
	Show,
	SimpleShowLayout,
	Tab,
	TabbedShowLayout,
	TextField,
} from "react-admin";

export const PostShow: React.FC = () => (
	<Show>
		<TabbedShowLayout>
			<Tab label="Details">
				<TextField source="title" label="Title" />
				<TextField source="slug" label="Slug" />
				<RichTextField source="content" label="Content" />
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
				<DateField source="updated" label="Updated Date" />
			</Tab>
			<Tab label="Comments" path="comments">
				<ReferenceManyField
					reference="comments"
					target="postId"
					label="Comments"
				>
					<Datagrid>
						<TextField source="content" label="Content" />
						<ReferenceField source="authorId" reference="users" label="Author">
							<TextField source="name" />
						</ReferenceField>
						<TextField source="status" label="Status" />
						<DateField source="created" label="Created Date" />
						<EditButton />
					</Datagrid>
				</ReferenceManyField>
			</Tab>
		</TabbedShowLayout>
	</Show>
);

export default PostShow;

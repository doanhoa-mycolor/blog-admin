"use client";

import {
	DateField,
	ReferenceField,
	RichTextField,
	Show,
	SimpleShowLayout,
	TextField,
} from "react-admin";

export const CommentShow: React.FC = () => (
	<Show>
		<SimpleShowLayout>
			<RichTextField source="content" label="Content" />

			<ReferenceField source="postId" reference="posts" label="Post">
				<TextField source="title" />
			</ReferenceField>

			<ReferenceField source="authorId" reference="users" label="Author">
				<TextField source="name" />
			</ReferenceField>

			<TextField source="status" label="Status" />
			<DateField source="created" label="Created Date" />
			<DateField source="updated" label="Updated Date" />
		</SimpleShowLayout>
	</Show>
);

export default CommentShow;

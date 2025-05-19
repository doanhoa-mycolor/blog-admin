"use client";

import {
	Create,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
	required,
} from "react-admin";

export const PostCreate: React.FC = () => (
	<Create>
		<SimpleForm>
			<TextInput source="title" label="Title" validate={required()} fullWidth />
			<TextInput source="slug" label="Slug" validate={required()} fullWidth />
			<TextInput
				source="content"
				label="Content"
				multiline
				rows={5}
				validate={required()}
				fullWidth
			/>
			<TextInput
				source="excerpt"
				label="Excerpt"
				multiline
				rows={3}
				fullWidth
			/>

			<ReferenceInput label="Author" source="authorId" reference="users">
				<SelectInput optionText="name" />
			</ReferenceInput>

			<ReferenceInput
				label="Category"
				source="categoryId"
				reference="categories"
			>
				<SelectInput optionText="name" />
			</ReferenceInput>

			<SelectInput
				label="Status"
				source="status"
				validate={required()}
				choices={[
					{ id: "DRAFT", name: "Draft" },
					{ id: "PUBLISHED", name: "Published" },
					{ id: "ARCHIVED", name: "Archived" },
				]}
				defaultValue="DRAFT"
			/>
		</SimpleForm>
	</Create>
);

export default PostCreate;

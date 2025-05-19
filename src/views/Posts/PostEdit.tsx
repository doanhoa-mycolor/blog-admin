"use client";

import {
	DateTimeInput,
	Edit,
	FormDataConsumer,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
	required,
} from "react-admin";

export const PostEdit: React.FC = () => (
	<Edit>
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
				<SelectInput optionText="name" validate={required()} />
			</ReferenceInput>

			<ReferenceInput
				label="Category"
				source="categoryId"
				reference="categories"
			>
				<SelectInput optionText="name" validate={required()} />
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
			/>

			<FormDataConsumer>
				{({ formData, ...rest }) =>
					formData.status === "PUBLISHED" && (
						<DateTimeInput
							source="publishedAt"
							label="Published Date"
							{...rest}
						/>
					)
				}
			</FormDataConsumer>
		</SimpleForm>
	</Edit>
);

export default PostEdit;

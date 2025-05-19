"use client";

import {
	Create,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
	required,
} from "react-admin";

export const CommentCreate: React.FC = () => (
	<Create>
		<SimpleForm>
			<TextInput
				source="content"
				label="Content"
				multiline
				rows={3}
				validate={required()}
				fullWidth
			/>

			<ReferenceInput label="Post" source="postId" reference="posts">
				<SelectInput optionText="title" />
			</ReferenceInput>

			<ReferenceInput label="Author" source="authorId" reference="users">
				<SelectInput optionText="name" />
			</ReferenceInput>

			<SelectInput
				label="Status"
				source="status"
				validate={required()}
				choices={[
					{ id: "PENDING", name: "Pending" },
					{ id: "APPROVED", name: "Approved" },
					{ id: "REJECTED", name: "Rejected" },
				]}
				defaultValue="PENDING"
			/>
		</SimpleForm>
	</Create>
);

export default CommentCreate;

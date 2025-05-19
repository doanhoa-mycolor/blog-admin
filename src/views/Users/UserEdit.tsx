"use client";

import {
	BooleanInput,
	Edit,
	PasswordInput,
	SelectInput,
	SimpleForm,
	TextInput,
	email,
	minLength,
	required,
} from "react-admin";

const validateEmail = [required(), email()];
const validatePassword = [minLength(8)];

export const UserEdit: React.FC = () => (
	<Edit>
		<SimpleForm>
			<TextInput source="username" label="Username" disabled fullWidth />
			<TextInput
				source="name"
				label="Display Name"
				validate={required()}
				fullWidth
			/>
			<TextInput
				source="email"
				label="Email"
				validate={validateEmail}
				fullWidth
			/>
			<PasswordInput
				source="password"
				label="Password"
				validate={validatePassword}
				fullWidth
			/>

			<SelectInput
				label="Role"
				source="role"
				validate={required()}
				choices={[
					{ id: "ADMIN", name: "Admin" },
					{ id: "EDITOR", name: "Editor" },
					{ id: "VIEWER", name: "Viewer" },
				]}
			/>

			<BooleanInput source="enabled" label="Active" />
		</SimpleForm>
	</Edit>
);

export default UserEdit;

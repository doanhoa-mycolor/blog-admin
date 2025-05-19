"use client";

import {
	BooleanInput,
	Create,
	PasswordInput,
	SelectInput,
	SimpleForm,
	TextInput,
	email,
	minLength,
	required,
} from "react-admin";

const validateEmail = [required(), email()];
const validateUsername = [required(), minLength(4)];
const validatePassword = [required(), minLength(8)];

export const UserCreate: React.FC = () => (
	<Create>
		<SimpleForm>
			<TextInput
				source="username"
				label="Username"
				validate={validateUsername}
				fullWidth
			/>
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
				defaultValue="VIEWER"
			/>

			<BooleanInput source="enabled" label="Active" defaultValue={true} />
		</SimpleForm>
	</Create>
);

export default UserCreate;

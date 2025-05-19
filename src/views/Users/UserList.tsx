"use client";

import {
	BooleanField,
	BooleanInput,
	Datagrid,
	DateField,
	EditButton,
	EmailField,
	List,
	SelectInput,
	TextField,
	TextInput,
} from "react-admin";

const userFilters = [
	<TextInput key="q" source="q" label="Search" alwaysOn />,
	<SelectInput
		key="role"
		source="role"
		label="Role"
		choices={[
			{ id: "ADMIN", name: "Admin" },
			{ id: "EDITOR", name: "Editor" },
			{ id: "VIEWER", name: "Viewer" },
		]}
	/>,
	<BooleanInput key="enabled" source="enabled" label="Active" />,
];

export const UserList: React.FC = () => (
	<List filters={userFilters}>
		<Datagrid>
			<TextField source="username" label="Username" />
			<TextField source="name" label="Display Name" />
			<EmailField source="email" label="Email" />
			<TextField source="role" label="Role" />
			<BooleanField source="enabled" label="Status" />
			<DateField source="created" label="Created Date" />
			<EditButton />
		</Datagrid>
	</List>
);

export default UserList;

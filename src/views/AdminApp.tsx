"use client";

import { Admin, Resource } from "react-admin";
import authProvider from "../providers/authProvider";
import prismaDataProvider from "../providers/dataProviders/prismaDataProvider";
import { checkRole } from "./_core/permissions";
import Resources, { type ResourceIF } from "./_core/resources";

const AdminApp: React.FC = () => {
	return (
		<Admin
			dataProvider={prismaDataProvider}
			authProvider={authProvider}
			title="Blog Admin"
			requireAuth
		>
			{(permissions) => {
				return Resources.map((resource: ResourceIF) => {
					const { list, edit, create, show, icon } = resource;
					return (
						<Resource
							key={resource.resource}
							name={resource.resource}
							list={checkRole({
								permissions,
								resource: resource.resource,
								action: "list",
								component: list,
							})}
							show={checkRole({
								permissions,
								resource: resource.resource,
								action: "show",
								component: show,
							})}
							edit={checkRole({
								permissions,
								resource: resource.resource,
								action: "edit",
								component: edit,
							})}
							create={checkRole({
								permissions,
								resource: resource.resource,
								action: "create",
								component: create,
							})}
							icon={icon}
						/>
					);
				});
			}}
		</Admin>
	);
};

export default AdminApp;

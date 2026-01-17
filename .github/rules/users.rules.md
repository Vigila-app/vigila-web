# Copilot Instructions and Rules for Vigila App Users

## Users Overview
There are diffent kinds of Users, diffentiate by ROLE and LEVEL.
There are Enums that list the Roles and the Levels here `src/enums/roles.enums.ts`.
- **LEVELS**
    - **BASE**: is the default level associated to every user
    - **PREMIUM**: is a level that user obtain with a subscription to get access to premium features (currently not in use).
    - **GOD**: is the highest level a user can achive, but it is limited justo to ADMIN role (currently not in use).
- **ROLES**
    - **CONSUMER**: is the most common user role, it's designed for families. Consumers wants to book the caregiving services offered by Vigil. They input the needs of their relatives and search for a service to help and assist. They can access to the homeConsumer to book new services and visit their profile to manage the past, current and future services booking.
    - **VIGIL**: is the role to offer caregiving services. Vigil put their availabilities and the services they can offer to Consumers. They can access just to their profile to manage past, current and future services booking, to manage their availabilities and to manage their balance.
    - **ADMIN**: it the highest and powerful role, but it's not available. No one can signup with this role. It's a role reserved to Vigila Staff.
    - **PARTNER** (planned role, not yet implemented in `RolesEnum`): is the role to offer offline services to help Consumers to signup and book via Vigila App. Usually it's a territorial partnership with local organizations or merchants. They can access just to the Portal Partner area to insert new Consumers, to book services and to manage their balance. (currently not in use).
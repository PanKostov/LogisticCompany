# Logistic Company Application Documentation

## Overview

This project implements a web-based logistics company system for managing shipments, offices,
customers, employees, and company profile data. It uses session-based authentication and
role-based access control to separate administrator, employee, and customer capabilities.

## Architecture

- Backend: NestJS + TypeORM + PostgreSQL.
- Frontend: React (Vite) single-page app.
- Auth: server-side sessions using `express-session` and cookies.
- Data protection: passwords are hashed, EGN is stored encrypted.

## Roles and Access

- Administrator: full access, including company profile, user roles, employees, offices, and reports.
- Employee (staff): manage customers and packets; view all packets.
- Customer (regular user, non-employee): view only their own packets (sent/received/expected).

### Access Matrix

| Capability                     | Admin | Employee | Customer |
| ------------------------------ | ----- | -------- | -------- |
| Manage company profile         | Yes   | No       | No       |
| Manage users / roles           | Yes   | No       | No       |
| Manage employees               | Yes   | No       | No       |
| Manage offices                 | Yes   | No       | No       |
| Manage customers               | Yes   | Yes      | No       |
| Register sent/received packets | Yes   | Yes      | No       |
| Update/delete packets          | Yes   | Yes      | No       |
| View all packets               | Yes   | Yes      | No       |
| View own packets               | Yes   | Yes      | Yes      |
| Run reports / revenue          | Yes   | No       | No       |

## Functional Requirements Mapping

1. Registration and login: `Access` screen; `/authentication/*` endpoints.
2. Role assignment: admin user management (`/admin/user/*`).
3. CRUD:
   - Company: `/company` (admin).
   - Employees: `/admin/employee/*` (admin).
   - Customers: `/customer/*` (staff).
   - Offices: `/admin/office/*` (admin).
   - Packets: `/packet/*` (staff).
4. Employees register packets: `/packet/sending`, `/packet/receiving`.
5. Reports:
   - Employees: `/admin/employee`.
   - Customers: `/customer`.
   - All packets: `/packet/all`.
   - Packets by employee: `/packet/all-from-employee/:id`.
   - Not received: `/packet/not-received`.
   - Sent by customer: `/packet/sent-by-customer/:id`.
   - Received by customer: `/packet/received-by-customer/:id`.
   - Revenue by period: `/packet/revenue?from=...&to=...`.
6. Employees can view all packets: `Packets` (staff view).
7. Customers can view only their packets: `/user/sent/packets`, `/user/received-packets`, `/user/expected-packets`.

## Data Model (Key Entities)

- User: `email`, `password` (hashed), `egn` (encrypted), `isEmployee`, `type`.
- Customer: `firstName`, `lastName`, `egn` (encrypted).
- Employee: `firstName`, `lastName`, `type` (courier or office worker).
- Office: `city`, `street`, `streetNumber`.
- Packet: `sender`, `receiver`, `weight`, `price`, `fromOffice`, `toOffice`, `fromAddress`, `toAddress`,
  `employeeId`, `isReceived`.
- Company: `name`, `legalId`, `address`, `contact`, `notes`.

## Packet Pricing and Lifecycle

- Price is calculated on the server, based on:
  - Weight (base rate per kg)
  - Delivery target (office delivery is cheaper; address delivery includes surcharge)
- Packet state:
  - Sent: `isReceived = false`
  - Received: `isReceived = true`
- Price is recalculated on updates if weight or delivery target changes.

## Backend Endpoints (Detailed)

Authentication:

- POST `/authentication/signup` (public)
- POST `/authentication/login` (public)
- GET `/authentication` (session status)
- POST `/authentication/sign-out`

Users (admin):

- GET `/admin/user/:id`
- POST `/admin/user/egn`
- GET `/admin/user/egn/:id`
- PATCH `/admin/user/:id`
- PATCH `/admin/user/user-access/:id`
- DELETE `/admin/user/:id`

Users (session user):

- PATCH `/user/:id`
- DELETE `/user/:id`
- GET `/user/sent/packets`
- GET `/user/received-packets`
- GET `/user/expected-packets`

Company (admin):

- GET `/company`
- POST `/company`
- PATCH `/company/:id`
- DELETE `/company/:id`

Employees (admin):

- POST `/admin/employee`
- GET `/admin/employee`
- GET `/admin/employee/:id`
- PATCH `/admin/employee/:id`
- DELETE `/admin/employee/:id`

Offices:

- GET `/office?city=...` (authenticated)
- POST `/admin/office/creation` (admin)
- PATCH `/admin/office/update/:id` (admin)
- DELETE `/admin/office/:id` (admin)
- GET `/admin/office/:id` (admin)
- GET `/admin/office/employees/:officeId` (admin)
- POST `/admin/office/employee-for-office/:officeId` (admin)
- PATCH `/admin/office/employee-for-office/:officeId` (admin)

Customers (staff):

- POST `/customer`
- PATCH `/customer/:id`
- DELETE `/customer/:id`
- GET `/customer`
- GET `/customer/:id`
- POST `/customer/egn`
- GET `/customer/egn/:id`

Packets (staff):

- POST `/packet/sending`
- PATCH `/packet/receiving`
- PATCH `/packet/:id`
- DELETE `/packet/:id`
- GET `/packet/all`
- GET `/packet/:id`
- GET `/packet/all-from-employee/:id`
- GET `/packet/not-received`
- GET `/packet/sent-by-customer/:id`
- GET `/packet/received-by-customer/:id`

Reports (admin):

- GET `/packet/revenue?from=YYYY-MM-DD&to=YYYY-MM-DD`

## Frontend Screens (What to Demonstrate)

- Access: register/login, session status.
- Users (admin): lookup users, set roles, delete.
- Company (admin): create/update company profile.
- Employees (admin): list/create/update/delete.
- Offices (admin): create/update/delete, list employees per office.
- Customers (staff): create/update/delete, find by ID/EGN.
- Packets:
  - Staff: list all, send, receive, update, delete, filter by employee/customer.
  - Customer: my packets (sent/received/expected only).
- Reports (admin): employees, customers, packets, revenue.

## Environment and Run

Backend:

- Create `.env` with `SECRET` and `ENCRYPTION_KEY`.
- Start: `npm run start:dev`.
- PostgreSQL configuration is in `src/AppModule.ts` (host/port/user/pass/db).

Frontend:

- `cd frontend`
- `npm install`
- `npm run dev`

## Testing Checklist

1. Register a user and log in.
2. Promote one user to admin (set `type = administrator`).
3. As admin: create company, employees, offices, and users.
4. As staff: create customers, register packets (send/receive), update/delete packets.
5. As customer: view only sent/received/expected packets.
6. Run reports and revenue calculation.

## Code Excerpts

Below are small code excerpts that illustrate how the requirements are implemented.

### Authentication and session

```ts
// src/authentication/AuthenticationController.ts
@Post('/login')
@Public()
async signIn(@Body() body: UserDto, @Session() session: any): Promise<UserResponseDto> {
  const user = await this.authService.signIn(body.email, body.password)
  session.user = user
  return user
}
```

### Role-based access (admin vs staff)

```ts
// src/guards/EmployeeGuard.ts
const user = request.session?.user
if (!user) return false
if (user.type === UserAccess.ADMIN) return true
return Boolean(user.isEmployee)
```

### Packet pricing logic (weight + delivery target)

```ts
// src/packet/PacketService.ts
private calculatePrice(weight: number, toAddress?: string, toOfficeId?: number): number {
  const baseRate = 2
  const addressSurcharge = 5
  const safeWeight = Number.isFinite(weight) ? Math.max(weight, 0) : 0
  const isAddressDelivery = Boolean(toAddress && toAddress.trim().length > 0) || !toOfficeId
  return Number((safeWeight * baseRate + (isAddressDelivery ? addressSurcharge : 0)).toFixed(2))
}
```

### Customer-only packet visibility

```ts
// src/user/UserController.ts
@Get('/sent/packets')
@UseGuards(AuthGuard)
async getSentPacketsForUser(@Session() session: any) {
  return await this.usersService.sentPacketsForUser(session.user.id)
}
```

### Frontend role-based packet view

```jsx
// frontend/src/pages/Packets.jsx
const isStaff = user?.type === 'administrator' || user?.isEmployee
return (
  <div className="grid">
    {isStaff ? <Panel title="Packets" subtitle="View all registered packets." /> : <Panel title="My packets" subtitle="View only your packets." />}
  </div>
)
```

## Team Contributions

All tasks and features were implemented by a single contributor:

- Backend architecture, entities, and endpoints.
- Frontend UI, routing, and role-based flows.
- Pricing and revenue calculation logic.
- Documentation and project structure.

## Known Limitations

- Internet Explorer support is not implemented (modern browsers only).

# Logistic Company Application Documentation

## Overview
This project implements a web-based logistics company system for managing shipments, offices,
customers, employees, and the company profile. It uses session-based authentication and
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
| Capability | Admin | Employee | Customer |
| --- | --- | --- | --- |
| Manage company profile | Yes | No | No |
| Manage users / roles | Yes | No | No |
| Manage employees | Yes | No | No |
| Manage offices | Yes | No | No |
| Manage customers | Yes | Yes | No |
| Register sent/received packets | Yes | Yes | No |
| Update/delete packets | Yes | Yes | No |
| View all packets | Yes | Yes | No |
| View own packets | Yes | Yes | Yes |
| Run reports / revenue | Yes | No | No |

## Functional Requirements Mapping
1) Registration and login: `Access` screen; `/authentication/*` endpoints.
2) Role assignment: admin user management (`/admin/user/*`).
3) CRUD:
   - Company: `/company` (admin).
   - Employees: `/admin/employee/*` (admin).
   - Customers: `/customer/*` (staff).
   - Offices: `/admin/office/*` (admin).
   - Packets: `/packet/*` (staff).
4) Employees register packets: `/packet/sending`, `/packet/receiving`.
5) Reports:
   - Employees: `/admin/employee`.
   - Customers: `/customer`.
   - All packets: `/packet/all`.
   - Packets by employee: `/packet/all-from-employee/:id`.
   - Not received: `/packet/not-received`.
   - Sent by customer: `/packet/sent-by-customer/:id`.
   - Received by customer: `/packet/received-by-customer/:id`.
   - Revenue by period: `/packet/revenue?from=...&to=...`.
6) Employees see all packets: `Packets` (staff view).
7) Customers see only their packets: `/user/sent/packets`, `/user/received-packets`, `/user/expected-packets`.

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

## Backend Endpoints (Required by Assignment)
Each endpoint below is required by the assignment and includes a short description of its role.

### Authentication
- POST `/authentication/signup` - Register a new user (email, password, EGN).
- POST `/authentication/login` - Log in and attach the user to the session.
- GET `/authentication` - Return current session user (used by the frontend to refresh state).
- POST `/authentication/sign-out` - Clear the active session.

### Role assignment (admin)
- PATCH `/admin/user/:id` - Update user profile fields and `isEmployee`.
- PATCH `/admin/user/user-access/:id` - Set access type (`administrator` or `regular`).

### Company (admin)
- GET `/company` - Fetch the single company profile (or null if not set).
- POST `/company` - Create the company profile.
- PATCH `/company/:id` - Update the company profile.
- DELETE `/company/:id` - Remove the company profile.

### Employees (admin)
- GET `/admin/employee` - List all employees.
- GET `/admin/employee/:id` - Get employee details by ID.
- POST `/admin/employee` - Create an employee (courier or office worker).
- PATCH `/admin/employee/:id` - Update employee data.
- DELETE `/admin/employee/:id` - Delete an employee.

### Customers (staff)
- GET `/customer` - List all customers.
- GET `/customer/:id` - Get customer details by ID.
- POST `/customer` - Create a customer.
- PATCH `/customer/:id` - Update customer data.
- DELETE `/customer/:id` - Delete a customer.
- POST `/customer/egn` - Find customer by EGN.
- GET `/customer/egn/:id` - Return the decrypted EGN for a customer.

### Offices
- GET `/office?city=...` - Search offices by city (authenticated).
- GET `/admin/office/:id` - Get office details (admin).
- POST `/admin/office/creation` - Create an office (admin).
- PATCH `/admin/office/update/:id` - Update office data (admin).
- DELETE `/admin/office/:id` - Delete an office (admin).

### Packets (staff)
- POST `/packet/sending` - Register a sent packet (creates price and links sender/receiver).
- PATCH `/packet/receiving` - Mark a packet as received at an office.
- PATCH `/packet/:id` - Update packet data and recompute price.
- DELETE `/packet/:id` - Delete a packet.
- GET `/packet/:id` - Get packet details by ID.
- GET `/packet/all` - List all packets.

### Reports (admin/staff)
- GET `/packet/all-from-employee/:id` - Packets registered by an employee.
- GET `/packet/not-received` - Packets that are sent but not received.
- GET `/packet/sent-by-customer/:id` - Packets sent by a customer.
- GET `/packet/received-by-customer/:id` - Packets received by a customer.
- GET `/packet/revenue?from=YYYY-MM-DD&to=YYYY-MM-DD` - Total revenue for a period.

### Customer views (session user)
- GET `/user/sent/packets` - Current user's sent packets.
- GET `/user/received-packets` - Current user's received packets.
- GET `/user/expected-packets` - Current user's expected packets.

## Endpoint Code Excerpts
Each required endpoint is shown below with a code excerpt from its controller.

### Authentication
Creates user accounts and attaches the authenticated user to the session.
```ts
// src/authentication/AuthenticationController.ts
@Post('/signup')
async signUp(@Body() body: CreateUserDto): Promise<UserResponseDto> {
  const user = await this.authService.signUp(body.email, body.password, body.egn)
  return user
}

@Post('/login')
@Public()
async signIn(@Body() body: UserDto, @Session() session: any): Promise<UserResponseDto> {
  const user = await this.authService.signIn(body.email, body.password)
  session.user = user
  return user
}
```

### Role Assignment (Admin)
Allows administrators to update `isEmployee` and access type for users.
```ts
// src/user/UserAdminController.ts
@Patch('/:id')
@UseGuards(AdminGuard)
async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
  return await this.usersService.updateUser(parseInt(id), body)
}

@Patch('user-access/:id')
@UseGuards(AdminGuard)
async updateUserAccess(@Param('id') id: string, @Body() { userAccessType }: { userAccessType: UserAccess }) {
  return await this.usersService.updateUser(parseInt(id), { type: userAccessType })
}
```

### Company CRUD
Provides create, read, update, and delete operations for the company profile.
```ts
// src/company/CompanyController.ts
@Controller('company')
@UseGuards(AdminGuard)
export class CompanyController {
  @Get() async getCompany(): Promise<Company | null> { return this.companyService.getCompany() }
  @Post() async createCompany(@Body() body: CompanyDto): Promise<Company> { return this.companyService.createCompany(body) }
  @Patch(':id') async updateCompany(@Param('id') id: string, @Body() body: UpdateCompanyDto): Promise<Company> {
    return this.companyService.updateCompany(parseInt(id), body)
  }
  @Delete(':id') async deleteCompany(@Param('id') id: string): Promise<Company> {
    return this.companyService.deleteCompany(parseInt(id))
  }
}
```

### Employee CRUD (Admin)
Administrative endpoints for managing courier and office worker records.
```ts
// src/employee/EmployeeAdminController.ts
@Controller('admin/employee')
export class EmployeeAdminController {
  @Post() @UseGuards(AdminGuard) createEmployee(@Body() body: EmployeeDto): Promise<Employee> {
    return this.employeeService.createEmployee(body.firstName, body.lastName, body.type)
  }
  @Get() @UseGuards(AdminGuard) async getAllEmployees() { return await this.employeeService.getAllEmployees() }
  @Get('/:id') @UseGuards(AdminGuard) async getEmployee(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.getEmployeeById(parseInt(id))
  }
  @Patch('/:id') @UseGuards(AdminGuard) async updateEmployee(@Param('id') id: string, @Body() body: UpdateEmployeeDto): Promise<Employee> {
    return await this.employeeService.updateEmployee(parseInt(id), body)
  }
  @Delete('/:id') @UseGuards(AdminGuard) async deleteEmployee(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.deleteEmployee(parseInt(id))
  }
}
```

### Customer CRUD (Staff)
Staff endpoints to register customers and edit or search their data.
```ts
// src/customer/CustomerController.ts
@Controller('customer')
@UseGuards(EmployeeGuard)
export class CustomerController {
  @Post() async createCustomer(@Body() body: CustomerDto): Promise<Customer> { return await this.customerService.createCustomer(body) }
  @Patch(':id') async updateCustomer(@Param('id') id: string, @Body() body: UpdateCustomerDto): Promise<Customer> {
    return await this.customerService.updateCustomer(parseInt(id), body)
  }
  @Delete(':id') async deleteCustomer(@Param('id') id: string): Promise<Customer> { return await this.customerService.deleteCustomer(parseInt(id)) }
  @Get() async getAllCustomers(): Promise<Customer[]> { return await this.customerService.getAllCustomers() }
  @Get(':id') async getCustomer(@Param('id') id: string): Promise<Customer> { return await this.customerService.findById(parseInt(id)) }
  @Post('/egn') async findByEgn(@Body() { egn }: UpdateCustomerDto): Promise<Customer> { return await this.customerService.findByEgn(egn) }
  @Get('/egn/:id') async getEgnOfCustomer(@Param('id') id: string): Promise<string> { return await this.customerService.getEgnOfCustomer(parseInt(id)) }
}
```

### Office CRUD
Authenticated office lookup by city, plus admin CRUD for office records.
```ts
// src/office/OfficeController.ts
@Controller('office')
@UseGuards(AuthGuard)
export class OfficeController {
  @Get() async getOfficesByCity(@Query('city') city: string): Promise<Office[]> {
    return await this.officeService.showAllOfficesForCity(city)
  }
}

// src/office/OfficeAdminController.ts
@Controller('admin/office')
export class OfficeAdminController {
  @Post('/creation') @UseGuards(AdminGuard)
  createOffice(@Body() body: { city: string; street: string; streetNumber: number }): Promise<Office> {
    return this.officeService.createOffice(body.city, body.street, body.streetNumber)
  }
  @Patch('/update/:id') @UseGuards(AdminGuard)
  async updateOffice(@Param('id') id: string, @Body() body: Partial<Office>): Promise<Office> {
    return await this.officeService.updateOffice(parseInt(id), body)
  }
  @Delete(':id') @UseGuards(AdminGuard)
  async deleteOffice(@Param('id') id: string): Promise<Office> { return await this.officeService.deleteOffice(parseInt(id)) }
  @Get(':id') @UseGuards(AdminGuard)
  async getOffice(@Param('id') id: string): Promise<Office> { return await this.officeService.getOfficeById(parseInt(id)) }
}
```

### Packet Operations and Reports
Staff endpoints to register, update, and inspect packets, plus report filters.
```ts
// src/packet/PacketController.ts
@Controller('packet')
export class PacketController {
  @Post('/sending') @UseGuards(EmployeeGuard)
  async sendPackaet(@Body() body: SendPackageInterface): Promise<Packet> { return await this.packetService.sendPacket(body) }
  @Patch('/receiving') @UseGuards(EmployeeGuard)
  async receivePacket(@Body() body: { packageId: number; officeId: number }): Promise<Packet> {
    return await this.packetService.receivePacket(body.packageId, body.officeId)
  }
  @Patch('/:id') @UseGuards(EmployeeGuard)
  async updatePacket(@Param('id') id: string, @Body() body: UpdatePacketDto): Promise<Packet> {
    return await this.packetService.updatePacket(parseInt(id), body)
  }
  @Delete('/:id') @UseGuards(EmployeeGuard)
  async deletePacket(@Param('id') id: string): Promise<Packet> { return await this.packetService.deletePacket(parseInt(id)) }
  @Get('/all') @UseGuards(EmployeeGuard)
  async getAllPackets(): Promise<Packet[]> { return await this.packetService.getAllPackets() }
  @Get('/all-from-employee/:id') @UseGuards(EmployeeGuard)
  async getAllPacketsByEmployee(@Param('id') employeeId: string) { return await this.packetService.getAllPacketsByEmployee(parseInt(employeeId)) }
  @Get('/not-received') @UseGuards(EmployeeGuard)
  async getNotRecievedPackets(): Promise<Packet[]> { return await this.packetService.getAllNotReceivedPackets() }
  @Get('/sent-by-customer/:id') @UseGuards(EmployeeGuard)
  async getAllSentPacketsForCustomer(@Param('id') id: string) { return await this.packetService.getAllSentPacketsForCustomer(parseInt(id)) }
  @Get('/received-by-customer/:id') @UseGuards(EmployeeGuard)
  async getAllReceivedPacketsForCustomer(@Param('id') id: string) { return await this.packetService.getAllReceivedPacketsForCustomer(parseInt(id)) }
  @Get('/revenue') @UseGuards(AdminGuard)
  async getRevenue(@Query('from') from?: string, @Query('to') to?: string) {
    const total = await this.packetService.getRevenue(from, to)
    return { total, from: from || null, to: to || null }
  }
  @Get(':id') @UseGuards(EmployeeGuard)
  async getPacket(@Param('id') id: string) { return await this.packetService.getPacketById(parseInt(id)) }
}
```

### Customer Packet Views (Session User)
Session-user endpoints that return only the authenticated customer's packets.
```ts
// src/user/UserController.ts
@Controller('user')
export class UserController {
  @Get('/sent/packets') @UseGuards(AuthGuard)
  async getSentPacketsForUser(@Session() session: any) {
    return await this.usersService.sentPacketsForUser(session.user.id)
  }
  @Get('/received-packets') @UseGuards(AuthGuard)
  async getReceivedPacketsForUser(@Session() session: any) {
    return await this.usersService.receivedPacketsForUser(session.user.id)
  }
  @Get('/expected-packets') @UseGuards(AuthGuard)
  async getExpectedPacketsForUser(@Session() session: any) {
    return await this.usersService.expectedPacketsForUser(session.user.id)
  }
}
```

## Frontend Screens (What to Demonstrate)
- Access: register and log in; confirm the session status updates after authentication.
- Users (admin): search users, assign roles, set employee flag, and delete accounts.
- Company (admin): create and update the single company profile used in the system.
- Employees (admin): create, update, and remove couriers and office workers.
- Offices (admin): manage office locations and inspect staff assigned per office.
- Customers (staff): register customers, edit their data, and search by ID or EGN.
- Packets:
  - Staff: register sent/received packets, update/delete, and filter by employee or customer.
  - Customer: view only sent, received, or expected packets for the logged-in user.
- Reports (admin): list employees/customers/packets and calculate revenue for a time period.

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
1) Register a user and log in.
2) Promote one user to admin (set `type = administrator`).
3) As admin: create company, employees, offices, and users.
4) As staff: create customers, register packets (send/receive), update/delete packets.
5) As customer: view only sent/received/expected packets.
6) Run reports and revenue calculation.

## User Stories
- As an administrator, I can manage users and roles so I can control access.
- As an administrator, I can create and update the company profile so system data is accurate.
- As an administrator, I can manage employees and offices so operations stay organized.
- As a staff member, I can register sent and received packets so deliveries are tracked.
- As a staff member, I can manage customers so shipments are correctly assigned.
- As a staff member, I can view all packets so I can answer operational questions.
- As a customer, I can see only my sent, received, and expected packets so my data stays private.
- As an administrator, I can generate reports so I can monitor workload and revenue.

## Team Contributions
All tasks and features were implemented by a single contributor:
- Backend architecture, entities, and endpoints.
- Frontend UI, routing, and role-based flows.
- Pricing and revenue calculation logic.
- Documentation and project structure.

## Known Limitations
- Internet Explorer support is not implemented (modern browsers only).

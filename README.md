1- Functionality: User Registration
User Story:
As a new user,
I want to register on the application,
So that I can log in and make table reservations.

Business Rules:

* The user's email must be unique in the system.
* The password field must have at least 8 characters, including uppercase letters, lowercase letters, numbers, and symbols.
* All required fields (name, email, password) must be filled in.
* The system must validate the email format before registration.

2- Functionality: User Login
User Story:
As a registered user,
I want to log in to the application,
So that I can access my account and make my reservations.

Business Rules:

* Login is only allowed with a valid email and password.
* The user must remain authenticated for a configurable period (e.g., 30 minutes of inactivity).

3- Functionality: desk booking
User Story:
As an authenticated user,
I want to book a desk,
So that I guarantee my place on a specific day and time.

Business Rules:

* There cannot be duplicate bookings for the same desk and time.
* The system must validate table availability before confirming the booking.
* Each user can have a maximum of one active booking per date.
* The reservation must include the date, time, and selected desk.

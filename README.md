# TranquilPay - Klusterthon Hackathon

## Description
This is the backend repo of the Klusterthon Hackathon project, Tranquil Pay.

# Endpoints
- [/api/login](#login) - Login endpoint.
- [/api/user/create](#create-user) - Create user endpoint.
- [/api/user/verify/:token](#verify-email) - Verify email on account creation endpoint.
- [/api/user/forgot-password](#forgot-password) - Forgot password endpoint.
- [/api/user/reset-password](#reset-password-post) - Post endpoint for resetting password.

<a name="login"></a>
## /api/login

#### Method: POST

Description:

This endpoint allows users to log in to their TranquilPay account using their email and password. Upon successful authentication, the API returns an authentication token that can be used to access other protected resources.

#### Request Body
##### Sample of a good req

```bash
{
    "email": "someemail@gmail.com",
    "password": "somepassword" 
}
```

#### Response Object
##### Success 

```bash
{
    "token":"eervwerv.....",
    "email":"someemail@gmail.com",
    "businessName":"somename",
    "fullName":"John Doe"
}
```

##### Error
##### Sample error response for wrong password or email
```bash
{
    "error": "Invalid email or password"
}
```

##### Sample error response for invalid input (Empty password in this case)

```bash
{
    "errors": [
        {
            "type": "field",
            "msg": "Invalid value",
            "path": "password",
            "location": "body"
        },
        {
            "type": "field",
            "msg": "Field is required and should be a string.",
            "path": "password",
            "location": "body"
        }
    ]
}
```

<a name="create-user"></a>
## /api/user/create
#### Method: POST

Description: This endpoint allows users to create a TranquilPay account using their email, password and full name. Upon successful registration, the API sends a JSON response informing the user their registration is successful and that they have received an email, if the email sending process fails the registration is rolled back.

#### Request Object
##### Sample of a good req

```bash
{
    "email": "someemail@gmail.com",
    "password": "somepassword",
    "fullName": "Johnbull Biobele"
}
```

##### Success 
```bash
{
    "message":"Registration successful. Please check your email to verify your account."
}
```

##### Error 
##### Sample error response for empty fullName field
```bash
{
    "errors": [
        {
            "type": "field",
            "msg": "Invalid value",
            "path": "fullName",
            "location": "body"
        },
        {
            "type": "field",
            "msg": "Field is required and should be a string.",
            "path": "fullName",
            "location": "body"
        }
    ]
}
```

##### Sample error response for error creating record or sending email (Appropriate status codes are returned as well)

```bash
{
    "error": "Error here",
}
```

<a name="verify-email"></a>

## /api/user/verify/:token
#### Method: GET

Description:

This endpoint allows users to verify their email address, clicking the link makes a get request to the backend which verifies the status of the token. Upon successful confirmation of the validity of the token a JSON response is sent back that the token is valid.

#### Response Object
##### Success 

```bash
{
    "message": "Hurray! Email verified successfully."
}
```

##### Error
##### Sample error response for invalid or expired token

```bash
{
    "error": "Invalid or expired verification token."
}
```
<a name="forgot-password"></a>

## /api/user/forgot-password
#### Method: POST

Description:

This endpoint allows users to reset their password in the occasion they forget it. It requires an email that exists in the database, else an error response is sent back. If successful an email is sent to the email. Since it takes an email the typical email validation rules apply.

#### Response Object
##### Sample of a good req

```bash
{
    "email": "someemail@gmail.com",
}
```

##### Success 

```bash
{
    "message": "Reset password email sent successfully. Please check your email to reset your password."
}
```

##### Error
##### Sample error response for invalid or expired token

```bash
{
    "error": "Invalid or expired verification token."
}
```


<a name="reset-password-post"></a>

## /api/user/reset-password
#### Method: POST

Description:

This endpoint allows users to change their password, they have to remember their current password.  It accepts the current user's password and checks if its corrects and updates, if not sends an appropriate error message.

#### Response Object
##### Sample of a good req

```bash
{
    "password": "existingPassword",
}
```

##### Success 

```bash
{
    "message": "Password reset successfully!"
}
```

##### Error
##### Sample error response for invalid request

```bash
{
    "error": "Internal server error."
}
```


# TranquilPay - Klusterthon Hackathon

## Description
This is the backend repo of the Klusterthon Hackathon project, Tranquil Pay.

# Endpoints
- [/api/login](#login) - Login endpoint.
- [/api/user/create](#create-user) - Create user endpoint.
- [/api/user/verify/:token](#verify-email) - Verify email on account creation endpoint.
- [/api/user/forgot-password](#forgot-password) - Forgot password endpoint.
- [/api/user/reset-password](#reset-password-post) - Post endpoint for resetting password.
- [/api/invoice/create](#invoice-create) - Endpoint for creating an invoice.
- [/api/invoice/get/:invoiceNumber](#fetch-single-invoice) - Endpoint for returning information about a specific invoice.
- [/api/invoice/fetch-all](#fetch-user-invoice) - Enpoint for fetching all of a business owners invoice.
- [/api/invoice/fetch/:clientId](#fetch-client-invoice) - Endpoint for fetching all the transactions of a specific client.
- [/api/auth/update-profile](#update-user-profile) - Endpoint for updating user profile.

<a name="login"></a>
## /api/login

#### Method: POST

Description:

This endpoint allows users to log in to their TranquilPay account using their email and password. Upon successful authentication, the API returns an authentication token that can be used to access other protected resources.

#### Request Body
##### Sample of a good req

```JSON
{
    "email": "someemail@gmail.com",
    "password": "somepassword" 
}
```

#### Response Object
##### Success 

```JSON
{
    "token":"eervwerv.....",
    "email":"someemail@gmail.com",
    "businessName":"somename",
    "fullName":"John Doe"
}
```

##### Error
##### Sample error response for wrong password or email
```JSON
{
    "error": "Invalid email or password"
}
```

##### Sample error response for invalid input (Empty password in this case)

```JSON
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

```JSON
{
    "email": "someemail@gmail.com",
    "password": "somepassword",
    "fullName": "Johnbull Biobele"
}
```

##### Success 
```JSON
{
    "message":"Registration successful. Please check your email to verify your account."
}
```

##### Error 
##### Sample error response for empty fullName field
```JSON
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

```JSON
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

```JSON
{
    "message": "Hurray! Email verified successfully."
}
```

##### Error
##### Sample error response for invalid or expired token

```JSON
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

```JSON
{
    "email": "someemail@gmail.com",
}
```

##### Success 

```JSON
{
    "message": "Reset password email sent successfully. Please check your email to reset your password."
}
```

##### Error
##### Sample error response for invalid or expired token

```JSON
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

```JSON
{
    "password": "existingPassword",
}
```

##### Success 

```JSON
{
    "message": "Password reset successfully!"
}
```

##### Error
##### Sample error response for invalid request

```JSON
{
    "error": "Internal server error."
}
```

<a name="invoice-create"></a>

## /api/invoice/create
#### Method: POST

Description:

This endpoint allows users to create an invoice containing the details of the invoice.

#### Response Object
##### Sample of a good req

```JSON
{
    "dueDate": "2050-10-20",
    "totalAmount": 4000,
    "clientEmail": "client@gmail.com",
    "items": [
        "name": "Potato",
        "quantity": 10,
        "unitPrice": 4
    ]
}
```

##### Success 

```JSON
{
    "message": "Invoice sent successfully!"
}
```

##### Error
##### Sample error response for invalid or expired token

```JSON
{
    "error": "Error creating invoice: `Reason here.`"
}
```

<a name="fetch-client-invoice"></a>

## /api/invoice/get/:invoiceNumber
#### Method: GET

Description:

This endpoint returns information about a single invoice.

#### Response Object
##### Success 

```JSON
{
    "invoice": {
        "number": "wrtvwer",
        "status": "Unpaid | Paid |Incomplete",
        "dueDate": "2050-10-30",
        "clientId": "ervqerqrvqwe",
        "totalAmount": 4000,
        "paidAmount": 3444,
        "items": [
            {
                "name": "Chips",
                "quantity": 4,
                "unitPrice": 5
            }
        ]
    }
}
```


<a name="fetch-user-invoice"></a>

## /api/invoice/fetch-all
#### Method: GET

Description:

This endpoint returns all the users invoices.

#### Response Object
##### Success 

```JSON
{
    "invoices": [
        {
            "number": "wrtvwer",
            "status": "Unpaid | Paid |Incomplete",
            "dueDate": "2050-10-30",
            "clientId": "ervqerqrvqwe",
            "totalAmount": 4000,
            "paidAmount": 3444,
            "items": [
                {
                    "name": "Chips",
                    "quantity": 4,
                    "unitPrice": 5
                }
            ]
        }
    ],
}
```


<a name="fetch-client-invoice"></a>

## /api/invoice/fetch/:clientId
#### Method: GET

Description:

This endpoint returns all the invoices a client is to pay.

#### Response Object
##### Success 

```JSON
{
    "invoices": [
        {
            "number": "wrtvwer",
            "status": "Unpaid | Paid |Incomplete",
            "dueDate": "2050-10-30",
            "clientId": "ervqerqrvqwe",
            "totalAmount": 4000,
            "paidAmount": 3444,
            "items": [
                {
                    "name": "Chips",
                    "quantity": 4,
                    "unitPrice": 5
                }
            ]
        }
    ],
}
```


<a name="update-user-profile"></a>

## /api/auth/update-profile
#### Method: PUT

Description:

This endpoint allows the user to update their profile information, like their full name, email and business name. All fields are optional, only fields provided will be updated.

#### Response Object
##### Sample of a good req

```JSON
{
    "fullName": "Biobele Johnbull",
    "email": "cat@gmail.com",
    "businessName": "Some Business"
}
```
##### Success 

```JSON
{
    "message": "Profile updated successfully.",
}
```

##### Error 
```JSON
{
    "error": "Error updating profile, try again later."
}
```




# TranquilPay - Klusterthon Hackathon

## Description
This is the backend repo of the Klusterthon Hackathon project, Tranquil Pay.

## Endpoints

### /api/login
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

##### Sample error response for invalid input

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


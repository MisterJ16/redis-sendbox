# Redis sendbox

1. Clone repo to your local computer
2. Run "npm install" to install node modules
3. Run "npm start" to satart node.js server with end-points

## End points

Please, use an application like "Postman" to check endpoints

### Set key - value

1.  Choose "POST" request type
2.  Add url "http://localhost:3001/api/redis/setByKey"
3.  Add "Content-Type:application/json" to request headers
4.  Add request to test end-point, for example:

                {
                    key: "param1",
                    value: "test1"
                }

### Get key - value

1.  Choose "GET" request type
2.  Add url "http://localhost:3001/api/redis/getByKey?key=param1"
3.  Add "Content-Type:application/json" to request headers

### Delete key

1.  Choose "POST" request type
2.  Add url "http://localhost:3001/api/redis/delByKey"
3.  Add "Content-Type:application/json" to request headers
4.  Add request to test end-point, for example:

                {
                    key: "param1"
                }

### Set user

1.  Choose "POST" request type
2.  Add url "http://localhost:3001/api/redis/addUser"
3.  Add "Content-Type:application/json" to request headers
4.  Add request to test end-point, for example:

                {
                    "lastName": "Doe",
                    "firstName": "Jhon",
                    "nickName": "Mr.D",
                    "email": "jhon.doe@gmail.com"
                }

### Delete user

1.  Choose "POST" request type
2.  Add url "http://localhost:3001/api/redis/delUser"
3.  Add "Content-Type:application/json" to request headers
4.  Add request to test end-point, for example:

                {
                    "id": "69cb373c-f9fb-4e3f-8c91-e7381da087e9"
                }

### Get user

1.  Choose "GET" request type
2.  Add url "http://localhost:3001/api/redis/getUser?id=f5b19779-8b93-45b8-a3fb-b4f5ea5ea801"
3.  Add "Content-Type:application/json" to request headers

### Get all users

1.  Choose "GET" request type
2.  Add url "http://localhost:3001/api/redis/getUsers"
3.  Add "Content-Type:application/json" to request headers

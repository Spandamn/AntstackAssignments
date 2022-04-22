# StudentDB

StudentDB: Express server 
The server should respond to GET, POST, PUT, DELETE request

GET request
1./api/student
If a request to the server is get /api/student then it should return all these students records.
2. /api/student/{id}
Server should send back details of provided student id in json format (id: 1, name: 'Lokesh',currentClass : 12, division: 'A'}.
3.If id is invalid respond with 404.

4. POST request
1. /api/student
 The server should record the student details.Should return the id to which is allocated to the new student. 
2. If incomplete details are given return status code 400.
3. Returned id should be unique to every student and should be incremental.
4. Even if the record is deleted its id should not be used.

5. PUT request
1. /api/student/{id}
 If valid id and valid update are given then should update the studentdetails
2. If invalid id is given then respond with status 400.
3. If invalid update is given then respond with status 400.

6. DELETE request
1. /api/student/{id}
1. If valid id is given remove the corresponding record.
2. If invalid id is given respond with status 404.

# URL Shortner
The program doesnt show the generated link in the browser window, it just prints the short link on the console after pressing submit. Copy the link from the console and paste it into browser to go to it and get redirected.

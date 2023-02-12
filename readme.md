## Information
- Author: Benedict Mateo
- Email: benedictpmateo@gmail.com
- Exam Link: https://github.com/SplashSoftware/fullstack-44/blob/main/Instruction.txt


## Environment Setup <br />
Backend
```
# .env
ENV=development
PORT=3001
MONGODB_URI=mongodb+srv://<username>:<password>@<host>
MONGODB_NAME=<db-name>
```

Frontend
- NOTE: API and Socket uses the same port
```
# .env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3001
```

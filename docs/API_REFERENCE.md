# API Reference — EduTrack ERP

All API requests should be made to `BASE_URL/api/v1`. Authentication is handled via Bearer tokens.

## 🔐 Authentication

### Login
`POST /auth/login`

**Request:**
```json
{
  "email": "admin@edutrack.in",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": { "id": "...", "name": "...", "role": "OWNER" },
  "token": "eyJhbG..."
}
```

---

## 👨‍🎓 Students

### Create Student
`POST /students`
*Required Role: OWNER, ADMIN*

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210",
  "parent": {
    "fatherName": "Robert Doe",
    "phone": "9876543211"
  }
}
```

### List Students
`GET /students?skip=0&take=10&search=John`

---

## 📅 Attendance

### Mark Attendance
`POST /attendance/mark`
*Required Role: OWNER, ADMIN, TEACHER*

**Request:**
```json
{
  "studentId": "...",
  "batchId": "...",
  "status": "PRESENT",
  "date": "2024-07-15"
}
```

---

## 💳 Payments

### Record Payment
`POST /payments`
*Required Role: OWNER, ADMIN*

**Request:**
```json
{
  "studentFeeId": "...",
  "amount": 5000,
  "paymentMethod": "UPI",
  "utrNumber": "TXN123456"
}
```

---

## 💬 WhatsApp & Templates

### Send Message
`POST /whatsapp/send`

### List Templates
`GET /whatsapp/templates`

---

## 🌐 WebSocket Events

Clients can listen to the following events on the `Socket.IO` connection:

| Event | Data Payload | Target Room |
| :--- | :--- | :--- |
| `dashboard_update` | `{ type: string, payload: any }` | `admins` |
| `new_notification` | `{ title: string, message: string }` | `user_id` |
| `payment_received` | `{ amount: number, receipt: string }` | `admins` |
| `student_absent` | `{ studentName: string, date: string }` | `admins` |

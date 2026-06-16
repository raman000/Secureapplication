# Secure Application

A comprehensive web application for secure document management with built-in authentication, encryption, and access control features.

## Features

✅ **User Authentication**
- Secure registration and login with JWT tokens
- Password hashing with bcryptjs
- Token-based authorization

✅ **Document Management**
- Upload and manage documents
- File type validation
- File size restrictions
- User-specific document access

✅ **Security Features**
- Helmet.js for HTTP security headers
- CORS protection
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure password storage

✅ **User Interface**
- Responsive design for all devices
- Modern and intuitive dashboard
- Real-time alerts and notifications
- File upload with drag-and-drop (optional)

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - JSON Web Tokens for authentication
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **Express-Validator** - Input validation

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with responsive design
- **Vanilla JavaScript** - Client-side logic

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/raman000/Secureapplication.git
   cd Secureapplication
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` and set:
   - `JWT_SECRET` - Your secret key for JWT
   - `PORT` - Server port (default: 5000)
   - `NODE_ENV` - Environment (development/production)

5. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:5000`

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Verify Token**
```
GET /api/auth/verify
Authorization: Bearer <token>
```

### Documents

**Upload Document**
```
POST /api/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData: document (file)
```

**Get User Documents**
```
GET /api/documents
Authorization: Bearer <token>
```

**Get Document Details**
```
GET /api/documents/:id
Authorization: Bearer <token>
```

**Delete Document**
```
DELETE /api/documents/:id
Authorization: Bearer <token>
```

## Security Best Practices

1. **Environment Variables** - Never commit `.env` file
2. **Password Hashing** - Passwords are hashed with bcryptjs (10 rounds)
3. **JWT Expiry** - Tokens expire after 7 days by default
4. **Rate Limiting** - API requests are limited to prevent abuse
5. **CORS** - Only allow requests from trusted origins
6. **Helmet** - HTTP security headers are set automatically
7. **Input Validation** - All inputs are validated before processing

## File Upload Restrictions

- **Max File Size**: 10 MB
- **Allowed Types**: PDF, DOC, DOCX, TXT, JPG, PNG
- **Storage**: Files are stored in `/uploads` directory

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Update `CLIENT_URL` in `.env` to match your frontend URL
- Ensure frontend is running on the specified URL

## Project Structure

```
.
├── public/
│   ├── index.html        # Main HTML file
│   ├── app.js           # Frontend JavaScript
│   └── styles.css       # Styling
├── routes/
│   ├── auth.js          # Authentication routes
│   └── documents.js     # Document management routes
├── uploads/             # Uploaded files storage
├── server.js            # Express server setup
├── .env                 # Environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies
└── README.md            # This file
```

## Future Enhancements

- [ ] Database integration (MongoDB)
- [ ] Document encryption
- [ ] User profiles and settings
- [ ] Document sharing with other users
- [ ] Document versioning
- [ ] Two-factor authentication (2FA)
- [ ] Email verification
- [ ] Admin dashboard
- [ ] Audit logs
- [ ] API documentation (Swagger)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the maintainer.

---

**Created by**: raman000  
**Last Updated**: 2024

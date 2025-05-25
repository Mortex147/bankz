# Professional Earning Platform

A complete, production-ready earning platform built with modern web technologies. Users can complete real tasks, earn money, and manage their finances through a secure, intuitive interface.

## 🚀 Features

### User Features
- **Secure Authentication** - Login with Replit Auth
- **Real-time Dashboard** - Track earnings, balance, and transactions
- **Task-based Earning** - Complete various tasks to earn money
- **Wallet Management** - Instant deposits and withdrawal requests
- **Transaction History** - Detailed tracking with filtering options
- **Profile Management** - Update personal information and view achievements
- **Dark/Light Theme** - Beautiful UI with theme switching

### Admin Features
- **User Management** - View and manage all platform users
- **Transaction Oversight** - Monitor all platform transactions
- **Withdrawal Approval** - Approve or reject withdrawal requests
- **Platform Analytics** - Comprehensive statistics and insights
- **User Status Control** - Activate or suspend user accounts

## 🛠 Technology Stack

- **Frontend**: React, TypeScript, Vite, shadcn/ui, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **Deployment**: Vercel-ready configuration

## 📋 Available Earning Tasks

- **Data Entry** - Product catalog management ($25)
- **Content Moderation** - Social media review ($15)
- **Market Research** - Survey completion ($10)
- **Image Processing** - Tagging and classification ($20)
- **Quality Assurance** - Website testing and bug reports ($35)

## 🏗 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd earning-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Required environment variables:
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   REPL_ID=your_replit_app_id
   REPLIT_DOMAINS=your_domains
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically with every commit

### Manual Deployment
1. Build the application
   ```bash
   npm run build
   ```
2. Deploy the built files to your hosting provider

## 🔧 Configuration

### Database Schema
The platform uses PostgreSQL with the following main tables:
- `users` - User accounts and profiles
- `transactions` - All financial transactions
- `sessions` - User authentication sessions

### Security Features
- Password hashing with bcrypt
- CSRF protection
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Role-based access control

## 📊 API Endpoints

### Authentication
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Logout user
- `GET /api/auth/user` - Get current user

### User Operations
- `GET /api/user/stats` - Get user statistics
- `GET /api/transactions` - Get user transactions
- `POST /api/deposit` - Process deposit
- `POST /api/withdrawal` - Request withdrawal
- `POST /api/earning` - Complete earning task

### Admin Operations
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/pending-withdrawals` - Pending approvals
- `PATCH /api/admin/withdrawal/:id` - Approve/reject withdrawal
- `PATCH /api/admin/user/:id/status` - Update user status

## 🎨 UI Components

Built with shadcn/ui components:
- Navigation with theme switching
- Responsive dashboard cards
- Data tables with sorting/filtering
- Modal dialogs for transactions
- Form components with validation
- Toast notifications

## 🔒 Security Considerations

- All sensitive operations require authentication
- Admin routes protected by role-based access
- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization

## 📱 Responsive Design

- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Fast loading on all devices

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ using modern web technologies
# Blog Platform - Frontend

A production-ready blog platform frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication System**: Register, login, and protected routes
- **Blog Management**: Create, read, update, and delete blogs
- **Public Feed**: Browse published blogs with pagination
- **Like System**: Like/unlike blogs with optimistic UI updates
- **Comment System**: Real-time commenting on blog posts
- **Responsive Design**: Mobile-first responsive layout
- **Clean Architecture**: Organized codebase with separation of concerns

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Navbar
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── dashboard/         # Protected dashboard
│   │   ├── create/        # Create blog page
│   │   └── edit/[id]/     # Edit blog page
│   ├── feed/              # Public blog feed
│   └── blog/[slug]/       # Blog detail page
│
├── components/            # Reusable React components
│   ├── BlogCard.tsx
│   ├── BlogEditor.tsx
│   ├── CommentItem.tsx
│   ├── CommentList.tsx
│   ├── LikeButton.tsx
│   ├── Navbar.tsx
│   ├── Pagination.tsx
│   ├── Loading.tsx
│   └── EmptyState.tsx
│
├── lib/                   # Core utilities
│   ├── api.ts            # API client wrapper
│   ├── auth.ts           # Auth utilities
│   └── fetcher.ts        # Axios instance with interceptors
│
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useBlogs.ts       # Blog management hooks
│   └── useComments.ts    # Comments hook
│
├── services/              # API service layer
│   ├── authService.ts
│   ├── blogService.ts
│   ├── likeService.ts
│   └── commentService.ts
│
├── types/                 # TypeScript definitions
│   ├── blog.ts
│   ├── user.ts
│   └── comment.ts
│
└── utils/                 # Helper functions
    └── slug.ts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Date Formatting**: date-fns

## 📋 Prerequisites

- Node.js 18+ installed
- Backend API running (NestJS)

## 🔧 Installation

1. **Clone and navigate to project**:
```bash
cd blog-platform
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Run development server**:
```bash
npm run dev
```

5. **Open browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 API Integration

The frontend connects to a NestJS backend with the following endpoints:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user

### Blogs (Protected)
- `GET /blogs` - Get my blogs
- `GET /blogs/:id` - Get blog by ID
- `POST /blogs` - Create blog
- `PATCH /blogs/:id` - Update blog
- `DELETE /blogs/:id` - Delete blog

### Public Routes
- `GET /public/feed?page=1&limit=10` - Get paginated feed
- `GET /public/blogs/:slug` - Get blog by slug

### Likes (Protected)
- `POST /blogs/:id/like` - Like blog
- `DELETE /blogs/:id/like` - Unlike blog

### Comments (Protected)
- `GET /blogs/:id/comments` - Get comments
- `POST /blogs/:id/comments` - Create comment

## 🔐 Authentication Flow

1. User registers or logs in
2. JWT token stored in localStorage
3. Token automatically attached to API requests via interceptor
4. Protected routes redirect to login if not authenticated
5. 401 responses trigger automatic logout

## 📱 Pages Overview

### Public Pages
- **Home** (`/`) - Landing page
- **Feed** (`/feed`) - Browse all published blogs
- **Blog Detail** (`/blog/[slug]`) - View single blog with comments

### Protected Pages
- **Dashboard** (`/dashboard`) - Manage your blogs
- **Create Blog** (`/dashboard/create`) - Write new blog
- **Edit Blog** (`/dashboard/edit/[id]`) - Edit existing blog

### Auth Pages
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration

## 🎨 Key Features

### Optimistic UI Updates
- Like/unlike actions update immediately
- Reverts on error

### Loading States
- Skeleton screens
- Loading spinners
- Disabled states during actions

### Error Handling
- User-friendly error messages
- Automatic 401 redirect
- Form validation

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly buttons

## 🏗️ Architecture Highlights

### Clean Separation
- **Services**: API communication
- **Hooks**: State management and side effects
- **Components**: UI presentation
- **Types**: Type safety throughout

### Reusability
- Shared components
- Custom hooks for common logic
- Centralized API client

### Performance
- React hooks optimization
- Minimal re-renders
- Efficient state updates

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🧪 Development Tips

### Adding New Features
1. Define types in `src/types/`
2. Create service in `src/services/`
3. Build custom hook in `src/hooks/`
4. Create components in `src/components/`
5. Add pages in `src/app/`

### State Management
- Use React hooks for local state
- Services handle API calls
- Hooks combine state + API logic

### Styling
- Use Tailwind utility classes
- Follow existing color scheme
- Maintain responsive patterns

## 🐛 Common Issues

### API Connection Error
- Ensure backend is running on port 3001
- Check `.env.local` configuration
- Verify CORS is enabled on backend

### Authentication Issues
- Clear localStorage if token expired
- Check token format in interceptor
- Verify backend JWT configuration

### Build Errors
- Run `npm install` to update dependencies
- Delete `.next` folder and rebuild
- Check TypeScript errors with `npm run lint`

## 📝 Code Style

- TypeScript strict mode enabled
- Functional components with hooks
- ESLint configuration included
- Consistent naming conventions

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Other Platforms
1. Build: `npm run build`
2. Set environment variable: `NEXT_PUBLIC_API_URL`
3. Start: `npm start`

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 🆘 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 15
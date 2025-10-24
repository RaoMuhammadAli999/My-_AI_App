# SubSage - Smart Subscription Manager

## Overview
SubSage is a modern, intelligent subscription management web application built with Flask (Python) and vanilla JavaScript. It helps users track their monthly subscriptions, visualize spending patterns, receive AI-powered insights, and discover promotional deals.

**Current Status**: MVP Complete ✅  
**Last Updated**: October 24, 2025

## Purpose & Goals
- Track all active subscriptions in one centralized dashboard
- Visualize spending patterns by category using interactive charts
- Provide AI-powered insights to help users identify savings opportunities
- Offer dual UI modes (Friendly/Robotic) for personalized user experience
- Support dark/light themes for accessibility and user preference

## Key Features

### ✅ Implemented (MVP)
1. **Subscription Management**
   - Add new subscriptions (name, cost, renewal date, category)
   - Delete existing subscriptions
   - View all subscriptions in a clean, organized list
   - Real-time subscription count badge

2. **Financial Analytics**
   - Total monthly spending calculation
   - Average subscription cost
   - Annual cost projection
   - Category-based spending breakdown

3. **Data Visualization**
   - Chart.js integration for visual analytics
   - Toggle between Bar Chart and Pie Chart views
   - Color-coded categories for easy identification
   - Responsive chart sizing

4. **AI Insights** (Placeholder Logic)
   - Spending pattern analysis
   - Duplicate subscription detection
   - High-cost subscription warnings
   - Money-saving tips and recommendations
   - Potential savings estimation

5. **Promotional Coupons**
   - Display of 4 hardcoded coupon offers
   - Service name, discount, code, and expiry date
   - Category-based filtering potential

6. **Dual UI Modes**
   - **Friendly Mode**: Casual, welcoming language with emojis
   - **Robotic Mode**: Formal, system-like language
   - Persistent mode selection via localStorage

7. **Theme Support**
   - Light mode (default)
   - Dark mode
   - Smooth transitions between themes
   - Persistent theme selection via localStorage

8. **Responsive Design**
   - Mobile-friendly layout (320px+)
   - Tablet optimization (768px+)
   - Desktop experience (1024px+)
   - Flexible grid system

### 🚀 Future Enhancements
1. **Persistent Storage**
   - Integrate PostgreSQL or SQLite database
   - Replace in-memory storage for data persistence
   - Add database migrations with Alembic

2. **Real AI Integration**
   - Connect to OpenAI or Anthropic API
   - Generate genuinely intelligent insights
   - Personalized spending recommendations
   - Natural language query support

3. **User Authentication**
   - Multi-user support with secure login
   - Individual user dashboards
   - User-specific subscription tracking
   - OAuth integration (Google, GitHub)

4. **Advanced Features**
   - Subscription renewal reminders (email/SMS)
   - Spending history and trends over time
   - Budget setting and alerts
   - Export reports (CSV/PDF)
   - Sharing capabilities
   - Currency conversion support

5. **Integration Ecosystem**
   - Import subscriptions from bank statements
   - Sync with calendar for renewal dates
   - API for third-party integrations
   - Browser extension for quick adds

## Project Architecture

### Backend (Flask)
**File**: `app.py`

**Key Components**:
- RESTful API endpoints for CRUD operations
- In-memory data storage (Python dictionaries/lists)
- CORS support for development
- Error handling middleware
- AI insights generation algorithm

**API Endpoints**:
- `GET /` - Serve main dashboard
- `GET /api/subscriptions` - Retrieve all subscriptions
- `POST /api/subscriptions` - Add new subscription
- `DELETE /api/subscriptions/<id>` - Delete subscription
- `GET /api/analytics` - Get spending analytics
- `GET /api/ai-insights` - Get AI-powered insights
- `GET /api/coupons` - Get promotional offers

### Frontend (HTML/CSS/JavaScript)
**Structure**:
```
templates/
  └── index.html          # Main dashboard template
static/
  ├── css/
  │   └── style.css       # All styles with CSS variables for theming
  └── js/
      └── app.js          # Frontend logic and API interactions
```

**Key Features**:
- Vanilla JavaScript (no frameworks)
- Chart.js for data visualization
- CSS Grid and Flexbox for layout
- CSS Custom Properties for theming
- LocalStorage for preferences

### Dependencies
**Python**:
- Flask 3.1.2 - Web framework
- Flask-CORS 6.0.1 - CORS support

**Frontend**:
- Chart.js 4.4.0 (CDN) - Data visualization

## Data Model

### Subscription Object
```python
{
    'id': int,              # Unique identifier
    'name': str,            # Service name (e.g., "Netflix")
    'cost': float,          # Monthly cost in USD
    'renewalDate': str,     # ISO date format (YYYY-MM-DD)
    'category': str         # One of 8 predefined categories
}
```

### Categories
- Streaming
- Gaming
- Productivity
- Fitness
- Music
- Education
- Cloud Storage
- Other

## Code Structure & Comments

All files include comprehensive comments explaining:
- Function purposes and logic
- Component organization
- Algorithm explanations
- Extension points for future development

**Comment Markers**:
- `// ==================== SECTION ====================` - Major sections
- `/** ... */` - Function documentation
- `/* ... */` - CSS section headers
- `# ...` - Python inline explanations

## Development Workflow

### Running the Application
The Flask server runs automatically via the configured Replit workflow:
- **Command**: `python app.py`
- **Port**: 5000
- **Host**: 0.0.0.0 (required for Replit)

### Making Changes

**Backend Changes** (app.py):
1. Edit the Python code
2. Workflow will auto-restart
3. Check workflow logs for errors
4. Test API endpoints via browser/frontend

**Frontend Changes** (HTML/CSS/JS):
1. Edit the files
2. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
3. Check browser console for errors
4. Test UI interactions

**Adding New Features**:
1. Backend: Add routes in `app.py`
2. Frontend: Add UI elements in `index.html`
3. Styling: Update `style.css` with theme variables
4. Logic: Implement in `app.js` with proper event handlers

## User Preferences
User preferences are stored in browser's localStorage:
- `theme` - "light" or "dark"
- `uiMode` - "friendly" or "robotic"

## Testing Checklist
Before deploying changes:
- [ ] All API endpoints return valid JSON
- [ ] Subscriptions can be added and deleted
- [ ] Chart updates when data changes
- [ ] AI insights load properly
- [ ] Coupons display correctly
- [ ] Theme toggle works in both directions
- [ ] Mode toggle updates all UI text
- [ ] Mobile responsive design intact
- [ ] No console errors
- [ ] No LSP/linting errors

## Recent Changes
**October 24, 2025** - Initial MVP Implementation
- Created Flask backend with full API
- Built responsive frontend with modern UI
- Implemented Chart.js visualizations
- Added dual mode (Friendly/Robotic) support
- Added dark/light theme support
- Integrated AI insights placeholder logic
- Added promotional coupons section
- Configured Replit workflow

## Extending the Application

### Adding a New Category
1. Update `CATEGORIES` list in `app.py`
2. Add option to `<select id="subCategory">` in `index.html`
3. No JS changes needed (dynamically handled)

### Replacing AI Logic with Real API
1. Install API client: `pip install openai`
2. Replace `get_ai_insights()` function logic
3. Add API key via Replit Secrets
4. Update error handling for API failures

### Adding Database Persistence
1. Install database library: `pip install psycopg2-binary`
2. Use Replit's built-in PostgreSQL
3. Replace in-memory `subscriptions` list with DB queries
4. Add database initialization script
5. Create migration files for schema changes

## Notes for Future Development
- The current in-memory storage resets on server restart
- AI insights use placeholder logic - replace with real AI API for production
- Consider adding input validation on both frontend and backend
- Implement rate limiting for API endpoints
- Add comprehensive error messages for better UX
- Consider adding subscription import from CSV/JSON
- Implement search and filter functionality for large subscription lists

## Support & Documentation
For Flask documentation: https://flask.palletsprojects.com/
For Chart.js documentation: https://www.chartjs.org/docs/
For Replit-specific features: Use the Replit docs search tool

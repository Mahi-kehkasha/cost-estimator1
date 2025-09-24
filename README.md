# BuilderBro Cost Estimator

A professional construction cost estimation tool built with React and Bootstrap 5, designed for architects, engineers, and clients to get accurate project cost estimates.

## 🏗️ Features

### Multi-Step Project Flow
1. **Role Selection** - Choose between Client or Architect/Engineer
2. **Project Type Selection** - Select from 6 project types with detailed requirements
3. **Specifications** - Choose materials and quantities with package tiers
4. **Cost Estimation** - Get detailed breakdown and total cost

### Project Types Supported
- **Villa** - Single-family residential buildings
- **Apartment** - Multi-unit residential buildings  
- **Office** - Commercial office buildings
- **Mall** - Shopping complex construction
- **Road** - Road and infrastructure projects
- **Renovation** - Existing structure renovation

### Package Tiers
- **Basic** - Budget-friendly options
- **Standard** - Mid-range quality materials
- **Premium** - High-quality materials and finishes
- **Royal** - Luxury-grade materials and premium finishes
- **Custom** - Mix and match different tiers

### Materials & Specifications
- **Construction Materials**: Cement, Steel, Aggregates (Sand & Gravel), Bricks, Concrete Blocks
- **Finishing Materials**: Ceramic Wall Dado, Flooring, Painting, Windows
- **Electrical & Plumbing**: Wiring, Switches & Sockets, Sanitaryware, Faucets
- **Doors & Windows**: Main Door, Internal Doors, Bathroom Doors, Window Grills
- **Structural Elements**: Overhead Tank, Underground Sump, Staircase Railing
- **Extras**: Solar heater provision, EV Charging, Gas line

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cost-estimator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 Usage Guide

### Step 1: Choose Your Role
- **Client**: For quick cost estimates with simple forms
- **Architect/Engineer**: For detailed specifications and BOQ reports

### Step 2: Select Project Type
Click on any project card to open the requirements modal:

#### Villa Requirements
- Villa Type (Single Villa, Duplex, Multi-Duplex)
- Built-up Area (sq.ft or sq.m)
- Number of Floors
- Number of Bedrooms/Bathrooms
- Construction Quality
- Region

#### Apartment Requirements
- Total Built-up Area
- Number of Units
- Number of Floors
- Common Areas (Parking, Garden, Gym, Play Area)
- Construction Quality
- Region

#### Office Requirements
- Built-up Area
- Number of Floors
- Layout Type (Open Plan, Partitioned)
- AC Systems (Centralized, Split, None)
- Number of Elevators
- Region

#### Mall Requirements
- Total Built-up Area
- Number of Floors
- Parking Capacity
- Food Court (Yes/No)
- Large Spaces (Yes/No)
- Construction Quality
- Region

#### Road Requirements
- Road Length (km)
- Road Width (m)
- Pavement Type (Asphalt, Concrete, Gravel)
- Drainage Requirement (Yes/No)
- Signage & Markings (Yes/No)
- Region

#### Renovation Requirements
- Type of Renovation (Partial Work, Upgrades, Modernization)
- Built-up Area
- Number of Floors Affected
- Rooms to Renovate (Bedrooms, Kitchen, Bathrooms, Living Area)
- Estimated Age of Structure (years)
- Region

### Step 3: Project Specifications
- **Package Selection**: Choose Basic, Standard, Premium, Royal, or Custom
- **Material Selection**: Select specifications for each material/feature
- **Quantity Input**: Specify exact quantities for accurate costing
- **Auto-calculation**: Per-sqft items automatically calculate based on project area

### Step 4: Cost Estimation
- **Detailed Breakdown**: View all selected materials with quantities and rates
- **Total Cost**: Get the complete project cost estimate
- **Print/Save**: Export the estimate as PDF

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: React 18.3.1
- **UI Framework**: Bootstrap 5.3.3
- **Icons**: Bootstrap Icons 1.11.3
- **Build Tool**: Vite 5.4.3
- **Package Manager**: npm

### Project Structure
```
src/
├── App.jsx          # Main application component
├── main.jsx         # Application entry point
└── styles.css       # Custom styles and responsive utilities
```

### Key Components

#### State Management
- **Project Forms**: Separate state for each project type (villa, apartment, office, etc.)
- **Specifications**: Centralized state for material selections and quantities
- **Package Tier**: Global package selection affecting all specifications
- **Step Navigation**: Multi-step form progression

#### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Bootstrap Grid**: Responsive layout system
- **Breakpoints**: xs, sm, md, lg, xl
- **Card Layout**: Adaptive grid for specifications

#### Calculation Engine
- **Price Parsing**: Extracts numeric values from price strings
- **Unit Detection**: Identifies per-sqft, per-bag, per-kg, per-cft, per-piece rates
- **Quantity Logic**: User quantities override auto-calculations
- **Area Integration**: Automatically multiplies per-sqft items by project area

### Data Structure

#### Project Form Example
```javascript
const villaForm = {
  type: 'Single Villa',
  area: '2000',
  unit: 'sq.ft',
  floors: '2',
  bedrooms: '3',
  bathrooms: '2',
  quality: 'Premium',
  region: 'North'
}
```

#### Specifications Example
```javascript
const specSelections = {
  'Cement': 'Premium - ₹420/bag',
  'Steel': 'Standard - ₹70/kg',
  'Living & Dining Flooring': 'Premium - ₹140/sqft'
}

const specQuantities = {
  'Cement': '50',
  'Steel': '2000',
  'Living & Dining Flooring': '' // Auto-calculated from area
}
```

## 🎨 Styling & Customization

### Bootstrap Classes Used
- **Layout**: `container`, `row`, `col-*`, `d-flex`, `justify-content-*`
- **Components**: `card`, `button`, `form-control`, `form-select`, `modal`
- **Utilities**: `shadow`, `rounded`, `text-*`, `bg-*`, `p-*`, `m-*`

### Custom CSS
- **Card Hover Effects**: Subtle lift and border color change
- **Modal Footer**: Sticky positioning for better UX
- **Responsive Utilities**: Custom cursor and spacing classes

### Color Scheme
- **Primary**: Bootstrap blue (`#0d6efd`)
- **Success**: Green for checkmarks (`#198754`)
- **Warning**: Orange for icons (`#ffc107`)
- **Danger**: Red for validation (`#dc3545`)

## 📊 Features in Detail

### Package Tier System
- **Auto-fill**: Selecting Basic/Standard/Premium/Royal automatically fills all specifications
- **Lock Mode**: Dropdowns are disabled when not in Custom mode
- **Consistency**: Ensures all materials match the selected quality tier

### Quantity Management
- **User Override**: Custom quantities take priority over auto-calculations
- **Smart Defaults**: Per-sqft items use project area, others default to 1
- **Decimal Support**: Supports fractional quantities (0.01 step)

### Validation System
- **Required Fields**: Red borders for empty required fields
- **Form Blocking**: Next button disabled until all required fields are filled
- **Real-time Feedback**: Immediate visual feedback on form completion

### Responsive Behavior
- **Mobile**: Single column layout, simplified table view
- **Tablet**: 2-column grid, full table with truncated text
- **Desktop**: 3-4 column grid, complete table with all details

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Adding New Materials
To add new materials to the specifications:

1. **Update specTable** in `App.jsx`:
```javascript
'New Material': { 
  Basic: '₹100/unit', 
  Standard: '₹120/unit', 
  Premium: '₹140/unit', 
  Royal: '₹160/unit' 
}
```

2. **Add to appropriate category** (Construction Materials, Finishing Materials, etc.)

### Adding New Project Types
1. **Add to projectTypes array**
2. **Create form state**
3. **Add required fields**
4. **Create modal form section**
5. **Update calculation logic**

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@builderbro.com or create an issue in the repository.

## 🚀 Deployment

The application can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automatic deployment
- **AWS S3**: Upload the `dist` folder to an S3 bucket

## 📈 Future Enhancements

- [ ] User authentication and project saving
- [ ] Advanced reporting with charts and graphs
- [ ] Integration with construction material suppliers
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] API integration for real-time pricing
- [ ] Project comparison features
- [ ] Export to Excel/CSV formats

---

**BuilderBro Cost Estimator** - Making construction cost estimation simple, accurate, and professional.

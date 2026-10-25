// Mock data for Califnco E-Commerce Platform
// Provides realistic initial states for Customer Orders, Dealer Wholesale Orders,
// Service Bookings, and FCM Push Notifications.

export const INITIAL_ORDERS = [
  {
    id: 'CAL-ORD-8821',
    date: '2026-10-22',
    customerName: 'Karthik Raja',
    email: 'karthik.raja@example.com',
    phone: '+91 98401 23456',
    role: 'customer',
    status: 'Shipped', // 'Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'
    trackingNumber: 'DTDC-IN-9812440',
    deliveryPartner: 'DTDC Express',
    estimatedDelivery: '26 Oct 2026',
    paymentMethod: 'Razorpay UPI (Google Pay)',
    paymentId: 'pay_rzp_mock_98214',
    address: {
      tag: 'Home',
      street: 'Flat 402, Green Valley Apartments, 100 Feet Road',
      area: 'Velachery',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600042',
      coordinates: { lat: 12.9759, lng: 80.2212 }
    },
    items: [
      {
        id: 'pur-001',
        name: 'Califnco AquaShield Pro RO+UV+UF+TDS Water Purifier',
        quantity: 1,
        unitPrice: 14499,
        image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'spar-007',
        name: 'Califnco Digital Pocket TDS Meter Pen',
        quantity: 1,
        unitPrice: 599,
        image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 15098,
    gst: 2717,
    discount: 500,
    total: 17315
  },
  {
    id: 'CAL-DLR-5502',
    date: '2026-10-23',
    customerName: 'Apex Water Systems (Dealer)',
    dealerBusiness: 'Apex Water Solutions Pvt Ltd',
    gstin: '33AABCA1234D1Z5',
    email: 'dealer.apex@watercare.in',
    phone: '+91 94440 98765',
    role: 'dealer',
    status: 'Processing',
    trackingNumber: 'VRL-LOG-77210',
    deliveryPartner: 'VRL Logistics Cargo',
    estimatedDelivery: '28 Oct 2026',
    paymentMethod: 'Razorpay NetBanking (HDFC Bank)',
    paymentId: 'pay_rzp_dealer_5502',
    address: {
      tag: 'Warehouse',
      street: 'Plot 18, SIDCO Industrial Estate, Guindy',
      area: 'Guindy',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600032',
      coordinates: { lat: 13.0067, lng: 80.2033 }
    },
    items: [
      {
        id: 'filt-001',
        name: 'Califnco 10" 5-Micron Spun Sediment Filter (Pack of 4)',
        quantity: 25,
        unitPrice: 280, // Wholesale price
        image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'pump-002',
        name: 'Califnco PowerFlow 100 GPD Heavy-Duty RO Booster Pump',
        quantity: 10,
        unitPrice: 1799, // Wholesale price
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'filt-003',
        name: 'Califnco Vontron 80 GPD Polyamide Thin-Film RO Membrane',
        quantity: 15,
        unitPrice: 1199, // Wholesale price
        image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 42975,
    gst: 7735,
    discount: 2000,
    total: 48710
  },
  {
    id: 'CAL-ORD-8710',
    date: '2026-10-18',
    customerName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 97910 11223',
    role: 'customer',
    status: 'Delivered',
    trackingNumber: 'BLUEDART-88291',
    deliveryPartner: 'BlueDart Express',
    estimatedDelivery: '21 Oct 2026',
    paymentMethod: 'Razorpay Credit Card (VISA)',
    paymentId: 'pay_rzp_mock_8710',
    address: {
      tag: 'Apartment',
      street: 'Tower B, 12th Floor, Prestige Bella Vista',
      area: 'Iyyappanthangal',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600056',
      coordinates: { lat: 13.0422, lng: 80.1287 }
    },
    items: [
      {
        id: 'filt-010',
        name: 'Califnco Annual Maintenance Service Filter Kit',
        quantity: 1,
        unitPrice: 2899,
        image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 2899,
    gst: 521,
    discount: 200,
    total: 3220
  }
];

export const INITIAL_SERVICES = [
  {
    id: 'SRV-2026-101',
    type: 'Periodic RO Maintenance & Filter Replacement',
    customerName: 'Karthik Raja',
    phone: '+91 98401 23456',
    address: 'Flat 402, Green Valley Apartments, Velachery, Chennai',
    preferredDate: '2026-10-27',
    preferredSlot: '10:00 AM - 01:00 PM',
    status: 'Assigned', // 'Requested', 'Assigned', 'In Progress', 'Completed', 'Cancelled'
    technician: {
      name: 'M. Ramesh',
      phone: '+91 98840 55112',
      rating: 4.9,
      experience: '6 Years Certified Califnco Technician'
    },
    purifierModel: 'Califnco AquaShield Pro RO+UV',
    notes: 'TDS taste slightly salty, pre-filter replacement needed',
    estimatedCost: 899
  },
  {
    id: 'SRV-2026-102',
    type: 'Emergency Pump Leakage & Pressure Inspection',
    customerName: 'Dr. S. Subramanian',
    phone: '+91 94441 33221',
    address: 'Old No. 44, 2nd Main Road, Gandhi Nagar, Adyar, Chennai',
    preferredDate: '2026-10-25',
    preferredSlot: '02:00 PM - 05:00 PM',
    status: 'Requested',
    technician: null,
    purifierModel: 'Califnco HydroPure Under-Sink RO',
    notes: 'Water dripping slowly near booster pump fitting',
    estimatedCost: 450
  },
  {
    id: 'SRV-2026-098',
    type: 'Annual Maintenance Contract (AMC) Comprehensive Check',
    customerName: 'Priya Sundaram',
    phone: '+91 98412 88776',
    address: 'Plot 12, Anna Nagar West Extension, Chennai',
    preferredDate: '2026-10-15',
    preferredSlot: '11:00 AM - 02:00 PM',
    status: 'Completed',
    technician: {
      name: 'V. Prakash',
      phone: '+91 98400 99881',
      rating: 4.8,
      experience: '4 Years Field Specialist'
    },
    purifierModel: 'Califnco CopperCharge RO+UV',
    notes: 'Replaced Sediment, Carbon, and sanitized tank. Post-TDS tested at 78 ppm.',
    estimatedCost: 1499
  }
];

export const INITIAL_DEALERS = [
  {
    id: 'DLR-APX-01',
    businessName: 'Apex Water Solutions Pvt Ltd',
    ownerName: 'Venkatesh Kumar',
    email: 'dealer.apex@watercare.in',
    phone: '+91 94440 98765',
    gstin: '33AABCA1234D1Z5',
    city: 'Chennai',
    state: 'Tamil Nadu',
    status: 'approved', // 'pending', 'approved', 'rejected'
    appliedDate: '2026-09-12',
    creditLimit: 250000,
    totalOrders: 14,
    totalVolume: '₹3,42,800'
  },
  {
    id: 'DLR-ROY-02',
    businessName: 'Royal Aqua Care & Spares',
    ownerName: 'Mohamed Farooq',
    email: 'royalaqua.coimbatore@gmail.com',
    phone: '+91 98422 65432',
    gstin: '33BBXPF4321A1Z8',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    status: 'approved',
    appliedDate: '2026-09-28',
    creditLimit: 150000,
    totalOrders: 8,
    totalVolume: '₹1,84,200'
  },
  {
    id: 'DLR-BLR-03',
    businessName: 'Cauvery Pure Tech Spares',
    ownerName: 'Manjunath Gowda',
    email: 'manjunath@cauverypure.in',
    phone: '+91 98801 44332',
    gstin: '29ABCDE6789F1Z2',
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'pending',
    appliedDate: '2026-10-23',
    creditLimit: 0,
    totalOrders: 0,
    totalVolume: '₹0'
  },
  {
    id: 'DLR-HYD-04',
    businessName: 'Krishna Delta Water Systems',
    ownerName: 'Chaitanya Reddy',
    email: 'sales@krishnadelta.com',
    phone: '+91 97033 11990',
    gstin: '36AAACE5566G1Z9',
    city: 'Hyderabad',
    state: 'Telangana',
    status: 'pending',
    appliedDate: '2026-10-24',
    creditLimit: 0,
    totalOrders: 0,
    totalVolume: '₹0'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Order CAL-ORD-8821 Shipped! 🚚',
    message: 'Your Califnco AquaShield Pro has been dispatched via DTDC. Expected delivery: 26 Oct 2026.',
    time: '2 hours ago',
    unread: true,
    type: 'order'
  },
  {
    id: 'notif-2',
    title: 'Water Health Alert: Monsoons & TDS 💧',
    message: 'Monsoon season can spike tap water turbidity and TDS. Book a free technician TDS health check today.',
    time: '1 day ago',
    unread: true,
    type: 'promo'
  },
  {
    id: 'notif-3',
    title: 'Wholesale Festive Tier Activated! 🎁',
    message: 'Dealers enjoy extra 5% bulk discount on booster pumps and 80 GPD membranes this week.',
    time: '2 days ago',
    unread: false,
    type: 'dealer'
  },
  {
    id: 'notif-4',
    title: 'Referral Reward Credited: ₹250 🎉',
    message: 'Your friend Rahul signed up using your code CALIFNCO-HERO. ₹250 has been added to your Califnco Wallet.',
    time: '3 days ago',
    unread: false,
    type: 'referral'
  }
];

export const PRODUCT_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Karthik Raja',
    location: 'Velachery, Chennai',
    rating: 5,
    date: '18 Oct 2026',
    verified: true,
    comment: 'Installed this in my apartment. Our borewell TDS was around 1100 ppm, output water is crystal clear and tastes naturally sweet at 85 ppm. Technician Ramesh arrived on time for installation.'
  },
  {
    id: 'rev-2',
    author: 'Suresh Kumar',
    location: 'Anna Nagar, Chennai',
    rating: 5,
    date: '12 Oct 2026',
    verified: true,
    comment: 'We use this for our cafe pantry. Continuous flow with high recovery. Build quality of the SS tank and booster pump is noticeably sturdier than conventional plastic brands.'
  },
  {
    id: 'rev-3',
    author: 'Mohamed Farooq (RO Tech)',
    location: 'Coimbatore',
    rating: 5,
    date: '04 Oct 2026',
    verified: true,
    comment: 'As a dealer, I have ordered 20+ units of this pump and membrane lot. Low return rate and the 100% pure copper coil does not overheat even during peak summer.'
  }
];


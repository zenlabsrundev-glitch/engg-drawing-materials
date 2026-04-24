import { User, Kit, Order, Role } from '../types';

const DEPARTMENTS = [
  'Computer Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics & Communication'
];

export const generateMockUsers = (count: number): User[] => {
  const users: User[] = [];
  
  // Seed Admin
  users.push({
    id: 'admin',
    fullName: 'System Admin',
    email: 'admin@campuskit.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  });

  // Seed Students
  for (let i = 1; i <= count; i++) {
    const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    users.push({
      id: i === 1 ? 'student1' : `STU${1000 + i}`,
      fullName: i === 1 ? 'John Student' : `Student ${i}`,
      email: i === 1 ? 'student1@gmail.com' : `student${i}@gmail.com`,
      password: i === 1 ? 'pass123' : 'student123',
      role: 'student',
      department: dept,
      year: '1st Year',
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    });
  }
  
  return users;
};

export const SAMPLE_KITS: Kit[] = [
  {
    id: 'kit-1',
    name: 'Standard ED Kit',
    description: 'Basic engineering drawing kit for 1st-year students.',
    price: 1250,
    items: [
      { id: 'i1', name: 'Mini Drafter', image: 'https://images.unsplash.com/photo-1544654803-b69140b285a1?auto=format&fit=crop&q=80&w=400' },
      { id: 'i2', name: 'A3 Drawing Sheets', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400' },
      { id: 'i3', name: 'Compass Set', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400' },
      { id: 'i4', name: 'Pencil Set', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400' }
    ],
    category: 'Essential',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'kit-2',
    name: 'Premium Drafter Kit',
    description: 'High-quality equipment for precise engineering work.',
    price: 2100,
    items: [
      { id: 'i5', name: 'Professional Mini Drafter', image: 'https://images.unsplash.com/photo-1544654803-b69140b285a1?auto=format&fit=crop&q=80&w=400' },
      { id: 'i6', name: 'Board Case', image: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=400' },
      { id: 'i7', name: 'French Curves', image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=400' }
    ],
    category: 'Premium',
    image: 'https://images.unsplash.com/photo-1544654803-b69140b285a1?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'kit-3',
    name: 'Architecture Basics',
    description: 'Complete set for aspiring architects and designers.',
    price: 1850,
    items: [
      { id: 'i8', name: 'Scale Ruler', image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=400' },
      { id: 'i9', name: 'Tracing Paper', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400' },
      { id: 'i10', name: 'Cutting Mat', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400' }
    ],
    category: 'Essential',
    image: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'kit-4',
    name: 'Electronics Pro Kit',
    description: 'Everything you need for circuit design and testing.',
    price: 3500,
    items: [
      { id: 'i11', name: 'Digital Multimeter', image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=400' },
      { id: 'i12', name: 'Breadboard', image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=400' }
    ],
    category: 'Advanced',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=400'
  }
];

export const generateMockOrders = (users: User[], count: number): Order[] => {
  const orders: Order[] = [];
  const students = users.filter(u => u.role === 'student');
  
  for (let i = 1; i <= count; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const kit = SAMPLE_KITS[Math.floor(Math.random() * SAMPLE_KITS.length)];
    const statuses: Order['status'][] = ['Pending', 'Packed', 'Delivered'];
    
    orders.push({
      id: `ORD-${5000 + i}`,
      userId: student.id,
      userName: student.fullName,
      userDepartment: student.department || 'General',
      items: [{
        id: `item-${i}`,
        kitId: kit.id,
        kitName: kit.name,
        price: kit.price,
        quantity: 1
      }],
      totalAmount: kit.price,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: Math.random() > 0.5 ? 'COD' : 'Online',
      transactionId: Math.random() > 0.5 ? `TXN${Math.floor(Math.random() * 1000000)}` : undefined,
      address: '123 University Hostel, Block A',
      phoneNumber: '9876543210',
      location: { lat: 13.0827 + (Math.random() * 0.05), lng: 80.2707 + (Math.random() * 0.05) },
      orderDate: new Date(Date.now() - Math.random() * 5000000000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date(Date.now() - Math.random() * 5000000000).toISOString()
    });
  }
  
  return orders;
};

import { JobItem } from '../types';

export const MOCK_JOBS: JobItem[] = [
  {
    id: 'job-1',
    serviceName: 'Electrical Repair',
    serviceImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    clientName: 'Rahul Sharma',
    clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    clientAddress: 'Model Town, Jalandhar',
    clientPhone: '+91 98765 43210',
    scheduledTime: '10:00 AM – 11:00 AM',
    date: 'today',
    status: 'accepted',
    price: '₹450',
    duration: '1 hr',
    description: 'The switchboard in the master bedroom has a faulty socket. The socket sparks sometimes when the laptop charger or iron is plugged in. Please inspect the internal wiring and replace the 16A modular switch and socket if required.',
    customerPhotos: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', // switchboard / wiring
      'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80', // electrical socket
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', // circuit panel
      'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80', // wires
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80', // equipment
    ],
    latitude: 31.3260,
    longitude: 75.5762,
    isLocationReached: false,
  },
  {
    id: 'job-2',
    serviceName: 'Plumbing Service',
    serviceImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80',
    clientName: 'Neha Verma',
    clientImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    clientAddress: 'Guru Nanak Nagar, Kapurthala',
    clientPhone: '+91 98123 45678',
    scheduledTime: '11:30 AM – 12:30 PM',
    date: 'today',
    status: 'accepted',
    price: '₹600',
    duration: '1 hr',
    description: 'The kitchen sink mixer tap has been continuously leaking from the base connector for the past 2 days. The angle valve underneath is also stiff and leaking small drops. Please check the tap connection and replace the damaged rubber gasket or washer.',
    customerPhotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', // sink tap
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80', // pipe connection
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80', // plumbing fixture
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80', // water drainage
      'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80', // bathroom / sink
    ],
    latitude: 31.3800,
    longitude: 75.3800,
    isLocationReached: false,
  },
  {
    id: 'job-3',
    serviceName: 'AC Servicing & Repair',
    serviceImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
    clientName: 'Arjun Singh',
    clientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    clientAddress: 'Urban Estate Phase 2, Jalandhar',
    clientPhone: '+91 97654 32109',
    scheduledTime: '1:30 PM – 2:30 PM',
    date: 'today',
    status: 'accepted',
    price: '₹850',
    duration: '1 hr',
    description: '1.5 Ton Split AC is blowing normal room temperature air and not cooling the bedroom. The indoor unit is also making a slight vibration sound and water is dripping from the side drain panel. Thorough filter cleaning and gas pressure check needed.',
    customerPhotos: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80', // AC unit
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80', // AC maintenance
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80', // AC repair
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', // wall unit
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80', // component
    ],
    latitude: 31.3090,
    longitude: 75.5920,
    isLocationReached: false,
  },
  {
    id: 'job-4',
    serviceName: 'Deep Home Cleaning',
    serviceImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    clientName: 'Simran Kaur',
    clientImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    clientAddress: 'GT Road Area, Kapurthala',
    clientPhone: '+91 99887 76655',
    scheduledTime: '3:00 PM – 4:30 PM',
    date: 'today',
    status: 'accepted',
    price: '₹1,200',
    duration: '1.5 hrs',
    description: 'Deep cleaning required for kitchen and 2 bathrooms before family gathering. Major focus on grease stain removal on tile backsplash, kitchen chimney filter degreasing, and removing hard water scale from bathroom glass partitions.',
    customerPhotos: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80', // kitchen area
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', // bathroom tiles
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80', // cleaning surface
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', // home interior
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', // room view
    ],
    latitude: 31.3780,
    longitude: 75.3710,
    isLocationReached: false,
  },
  {
    id: 'job-5',
    serviceName: 'Furniture Repair & Carpentry',
    serviceImage: 'https://images.unsplash.com/photo-1502005229762-ee1b2b93e08c?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1502005229762-ee1b2b93e08c?auto=format&fit=crop&w=600&q=80',
    clientName: 'Manpreet Singh',
    clientImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    clientAddress: 'Central Town, Jalandhar',
    clientPhone: '+91 98721 09876',
    scheduledTime: '5:00 PM – 6:00 PM',
    date: 'today',
    status: 'accepted',
    price: '₹550',
    duration: '1 hr',
    description: 'The master bedroom wardrobe sliding door came off its bottom track and is jammed. Also two hydraulic soft-close cabinet hinges in the modular kitchen have come loose from the particle board screw holes and need tightening with new anchors.',
    customerPhotos: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80', // wooden furniture
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80', // cabinet
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80', // sofa/woodwork
      'https://images.unsplash.com/photo-1502005229762-ee1b2b93e08c?auto=format&fit=crop&w=600&q=80', // wooden fitting
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=600&q=80', // wardrobe door
    ],
    latitude: 31.3200,
    longitude: 75.5800,
    isLocationReached: false,
  },
  {
    id: 'job-6',
    serviceName: 'RO / Water Purifier Repair',
    serviceImage: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    clientName: 'Priya Sharma',
    clientImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    clientAddress: 'Green Avenue, Kapurthala',
    clientPhone: '+91 98450 12345',
    scheduledTime: '6:30 PM – 7:30 PM',
    date: 'today',
    status: 'accepted',
    price: '₹300',
    duration: '1 hr',
    description: 'Kent RO water purifier has very low flow rate from the dispensing tap and the booster pump makes a continuous buzzing vibration sound without filling the tank properly. Pre-filter cartridge and sediment filter likely need replacement.',
    customerPhotos: [
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80', // water purifier
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', // tap
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', // filter pipe
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80', // connection
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80', // fixture
    ],
    latitude: 31.3850,
    longitude: 75.3900,
    isLocationReached: false,
  },
];

export type Product = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop Pro",
    description: "High-performance laptop with advanced features for professionals and developers.",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking and long battery life.",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    name: "Mechanical Keyboard",
    description: "Premium mechanical keyboard with customizable RGB lighting and tactile switches.",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    name: "USB-C Hub",
    description: "Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader support.",
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "5",
    name: "Monitor Stand",
    description: "Adjustable monitor stand to improve ergonomics and workspace organization.",
    createdAt: "2024-01-11T11:00:00Z",
    updatedAt: "2024-01-11T11:00:00Z",
  },
  {
    id: "6",
    name: "Webcam HD",
    description: "1080p HD webcam with auto-focus and built-in microphone for video calls.",
    createdAt: "2024-01-10T13:30:00Z",
    updatedAt: "2024-01-10T13:30:00Z",
  },
];


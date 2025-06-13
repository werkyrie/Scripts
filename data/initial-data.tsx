import { Grid3X3, CreditCard, Wrench, Package, RefreshCw, UserPlus, MoreHorizontal } from "lucide-react"

export const initialScripts = [
  {
    id: 1,
    title: "Payment Processing Issue",
    category: "Transactions",
    content:
      "Hello! I understand you're experiencing issues with payment processing. Let me help you resolve this immediately. Can you please provide your transaction ID?",
    description: "For payment-related problems",
    tags: ["urgent", "payment"],
    pinned: true,
    favorited: false,
    createdAt: new Date().toISOString(),
    version: 1,
  },
  {
    id: 2,
    title: "Order Status Inquiry",
    category: "Orders",
    content:
      "Thank you for contacting us about your order. I'd be happy to check the status for you. Please provide your order number, and I'll give you an immediate update.",
    description: "Standard order status response",
    tags: ["tracking", "status"],
    pinned: false,
    favorited: true,
    createdAt: new Date().toISOString(),
    version: 1,
  },
  {
    id: 3,
    title: "Welcome New Customer",
    category: "Introduction",
    content: "Welcome to our service! I'm here to assist you today. How may I help you get started with your account?",
    description: "Greeting for new customers",
    tags: ["welcome", "new"],
    pinned: true,
    favorited: false,
    createdAt: new Date().toISOString(),
    version: 2,
  },
  {
    id: 4,
    title: "Technical Support Escalation",
    category: "Troubleshooting",
    content:
      "I understand this technical issue is causing frustration. Let me escalate this to our technical team for immediate attention. You should receive a response within 2 hours.",
    description: "For complex technical issues",
    tags: ["escalation", "technical"],
    pinned: false,
    favorited: false,
    createdAt: new Date().toISOString(),
    version: 1,
  },
]

export const initialQuickActionTemplates = [
  {
    id: 1,
    name: "Personalized Greeting",
    content: "Hello! How can I assist you today?",
  },
  {
    id: 2,
    name: "Company Introduction",
    content: "Welcome! I'm here to help you with any questions you might have.",
  },
  {
    id: 3,
    name: "Order Follow-up",
    content: "I'm following up on your order. ",
  },
  {
    id: 4,
    name: "Thank You",
    content: "Thank you for contacting us. Is there anything else I can help you with?",
  },
  {
    id: 5,
    name: "Hold Please",
    content: "Please hold on for a moment while I check that for you.",
  },
  {
    id: 6,
    name: "Follow Up",
    content: "I'll follow up with you shortly with more information.",
  },
]

export const categories = [
  { name: "All", icon: Grid3X3 },
  { name: "Transactions", icon: CreditCard },
  { name: "Troubleshooting", icon: Wrench },
  { name: "Orders", icon: Package },
  { name: "Updates", icon: RefreshCw },
  { name: "Introduction", icon: UserPlus },
  { name: "Others", icon: MoreHorizontal },
]

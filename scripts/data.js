const users = [
    {
        id: 1,
        username: "john",
        password: "john123",
        name: "John Doe",
        currency: "RON",
        salary: 5000,
        budget: 3000
    },
    {
        id: 2,
        username: "maria",
        password: "maria123",
        name: "Maria Pop",
        currency: "RON",
        salary: 4200,
        budget: 2500
    },
    {
        id: 3,
        username: "alex",
        password: "alex123",
        name: "Alex Ionescu",
        currency: "EUR",
        salary: 2000,
        budget: 1200
    }
];

const categories = [
    { id: 1, userId: 1, name: "Food", type: "Need" },
    { id: 2, userId: 1, name: "Take-out", type: "Want" },
    { id: 3, userId: 1, name: "Transport", type: "Need" },
    { id: 4, userId: 2, name: "Food", type: "Need" },
    { id: 5, userId: 2, name: "Shopping", type: "Want" },
    { id: 6, userId: 3, name: "Transport", type: "Need" },
    { id: 7, userId: 3, name: "Entertainment", type: "Want" }
];

const receipts = [
    {
        id: 1,
        userId: 1,
        merchant: "Kaufland",
        date: "2026-03-15",
        category: "Food",
        paymentMethod: "Card",
        currency: "RON",
        total: 152.30,
        items: [
            { name: "Bread", qty: 2, price: 3.50 },
            { name: "Milk", qty: 3, price: 8.20 },
            { name: "Chicken", qty: 1, price: 32.99 }
        ]
    },
    {
        id: 2,
        userId: 1,
        merchant: "McDonald's",
        date: "2026-03-18",
        category: "Take-out",
        paymentMethod: "Cash",
        currency: "RON",
        total: 87.50,
        items: [
            { name: "Big Mac Menu", qty: 2, price: 38.00 },
            { name: "McFlurry", qty: 1, price: 11.50 }
        ]
    },
    {
        id: 3,
        userId: 1,
        merchant: "Uber",
        date: "2026-03-20",
        category: "Transport",
        paymentMethod: "Card",
        currency: "RON",
        total: 45.00,
        items: [
            { name: "Ride to Airport", qty: 1, price: 45.00 }
        ]
    },
    {
        id: 4,
        userId: 2,
        merchant: "Zara",
        date: "2026-03-10",
        category: "Shopping",
        paymentMethod: "Card",
        currency: "RON",
        total: 320.00,
        items: [
            { name: "Jacket", qty: 1, price: 220.00 },
            { name: "T-shirt", qty: 2, price: 50.00 }
        ]
    },
    {
        id: 5,
        userId: 2,
        merchant: "Mega Image",
        date: "2026-03-22",
        category: "Food",
        paymentMethod: "Cash",
        currency: "RON",
        total: 98.40,
        items: [
            { name: "Vegetables", qty: 1, price: 30.00 },
            { name: "Cheese", qty: 2, price: 34.20 }
        ]
    },
    {
        id: 6,
        userId: 3,
        merchant: "Netflix",
        date: "2026-03-01",
        category: "Entertainment",
        paymentMethod: "Card",
        currency: "EUR",
        total: 15.99,
        items: [
            { name: "Monthly subscription", qty: 1, price: 15.99 }
        ]
    },
    {
        id: 7,
        userId: 3,
        merchant: "Bolt",
        date: "2026-03-14",
        category: "Transport",
        paymentMethod: "Card",
        currency: "EUR",
        total: 23.50,
        items: [
            { name: "Ride", qty: 1, price: 23.50 }
        ]
    }
];
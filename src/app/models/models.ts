//USER INTERFACE
export interface User {
    userid: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    gender: string;
    pwd: string;
    membersince: string;
}

//PRODUCT INTERFACE
export interface ProductDetail {
    id: number;
    title: string;
    quantity: string;
    description: string;
    price: string;
    author: string;
    image: string;
}

//CART ITEM INTERFACE
export interface CartItem {
    id: number;
    productDetail: ProductDetail;
}

//CART INTERFACE
export interface Cart {
    id: number;
    user: User;
    cartItems: CartItem[];
    ordered: boolean;
    orderedOn: string;
}

//PAYMENT METHOD INTERFACE
export interface PaymentMethod {
    id: number;
    type: string;
    provider: string;
    available: boolean;
    reason: string;
}


//PAYMENT INTERFACE
export interface Payment {
    id: number;
    user: User;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    shippingCharges: number;
    amountReduced: number;
    amountPaid: number;
    createdAt: string;
}


//ORDER INTERFACE
export interface Order {
    id: number;
    user: User;
    cart: Cart;
    payment: Payment;
    createdAt: string;
}


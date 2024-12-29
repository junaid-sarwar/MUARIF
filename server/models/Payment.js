import mongoose from "mongoose";

const schema = new mongoose.Schema({
    paymentIntentId: { // Stripe Payment Intent ID
        type: String,
        required: true,
    },
    amount: { // Payment Amount
        type: Number,
        required: true,
    },
    currency: { // Payment Currency
        type: String,
        required: true,
        default: "pkr",
    },
    paymentStatus: { // Payment Status
        type: String,
        enum: ["requires_payment_method", "requires_action", "processing", "succeeded", "canceled"],
        default: "requires_payment_method",
    },
    user: { // Reference to User
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: { // Reference to Course
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
    },
    createdAt: { // Payment Created Timestamp
        type: Date,
        default: Date.now,
    },
});

export const Payment = mongoose.model("Payment", schema);

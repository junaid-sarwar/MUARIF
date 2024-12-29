import { stripe } from "../index.js";
import TryCatch from "../middleware/TryCatch.js";
import { Courses } from '../models/Courses.js';
import { Lecture } from "../models/Lecture.js";
import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';

// Fetch all courses
export const getAllCourses = TryCatch(async (req, res) => {
    const courses = await Courses.find();
    res.json({ courses });
});

// Fetch a single course
export const getSingleCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);
    res.json({ course });
});

// Fetch lectures for a course
export const fetchLectures = TryCatch(async (req, res) => {
    const lectures = await Lecture.find({ course: req.params.id });
    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return res.json({ lectures });
    }

    if (!user.subscription.includes(req.params.id)) {
        return res.status(400).json({ message: "You have not subscribed to this course" });
    }

    res.json({ lectures });
});

// Fetch a single lecture
export const fetchLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return res.json({ lecture });
    }

    if (!user.subscription.includes(req.params.id)) {
        return res.status(400).json({ message: "You have not subscribed to this course" });
    }

    res.json({ lecture });
});

// Get user-specific courses
export const getMyCourses = TryCatch(async (req, res) => {
    const courses = await Courses.find({ _id: { $in: req.user.subscription } });
    res.json({ courses });
});

// Checkout (Stripe PaymentIntent Creation)
export const checkout = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);

    if (user.subscription.includes(course._id)) {
        return res.status(400).json({
            message: "You already have this Course.",
        });
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(course.price * 100), // Amount in smallest currency unit
        currency: "pkr",
        metadata: {
            userId: user._id.toString(),
            courseId: course._id.toString(),
        },
        receipt_email: user.email,
    });

    // Save payment details in the database
    const payment = new Payment({
        paymentIntentId: paymentIntent.id,
        amount: course.price,
        currency: "pkr",
        paymentStatus: paymentIntent.status,
        user: user._id,
        course: course._id,
    });

    await payment.save();

    res.status(201).json({
        clientSecret: paymentIntent.client_secret,
        course,
    });
});

// Payment Verification (Handled via Webhook)
export const paymentVerification = TryCatch(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        await Payment.findOneAndUpdate(
            { paymentIntentId: paymentIntent.id },
            { paymentStatus: "succeeded" }
        );

        const paymentRecord = await Payment.findOne({ paymentIntentId: paymentIntent.id });
        const user = await User.findById(paymentRecord.user);

        if (!user.subscription.includes(paymentRecord.course)) {
            user.subscription.push(paymentRecord.course);
            await user.save();
        }
    }

    res.json({ received: true });
});

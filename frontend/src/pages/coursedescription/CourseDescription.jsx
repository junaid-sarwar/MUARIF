import React, { useEffect, useState } from 'react';
import "./coursedescription.css";
import { useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserData } from '../../context/UserContext';
import Loading from '../../components/loading/Loading';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const CourseDescription = ({ user }) => {
    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const { fetchUser } = UserData();
    const { fetchCourse, course, fetchCourses } = CourseData();

    useEffect(() => {
        fetchCourse(params.id);
    }, []);

    const checkoutHandler = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);

        try {
            const {
                data: { clientSecret },
            } = await axios.post(`${server}/api/course/checkout/${params.id}`, {}, {
                headers: {
                    token,
                },
            });

            await fetchUser();
            await fetchCourses();

            const stripe = await window.Stripe("pk_test_51QbRFWAoTTewqutON5DBliGVhKBoKMyzAWTLKXIhAuJvph8WOY7VNqTmXV8a58k8gIZ9kAH97xaPFnKfCqvQcnHB00HKXRYO6b");
            console.log("Client Secret:", clientSecret);

            const { error } = await stripe.redirectToCheckout({
                sessionId: clientSecret,
            });

            if (error) {
                toast.error(error.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                course && (
                    <div className='course-description'>
                        <div className="course-header">
                            <img src={`${server}/${course.image}`} alt="" className='course-image' />
                            <div className="course-info">
                                <h2>{course.title}</h2>
                                <p>Instructor: {course.createdBy}</p>
                                <p>Duration: {course.duration} Weeks</p>
                            </div>
                        </div>
                        <p>{course.description}</p>
                        <p>Let's get started with course At {course.price} PKR</p>

                        {user && user.subscription.includes(course._id) ? (
                            <button onClick={() => navigate(`/course/study/${course._id}`)} className='common-btn'>
                                Study
                            </button>
                        ) : (
                            <button onClick={checkoutHandler} className='common-btn'>Buy Now</button>
                        )}
                    </div>
                )
            )}
        </>
    );
};

export default CourseDescription;
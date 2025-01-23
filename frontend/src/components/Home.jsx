import React, { useEffect, useState } from 'react';
import logo from "../../public/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../utils/utils';

function Home() {
    const [courses, setCourses] = useState([]);
    const [isLoggedin, setIsLoggedin] = useState(false);
    const navigate = useNavigate();
//token
    useEffect(() => {
        const token = localStorage.getItem("user");
        if (token) {
            setIsLoggedin(true);
        } else {
            setIsLoggedin(false);
        }
    }, []);
//fetch courese
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(
                    `${ BACKEND_URL }/course/courses`,
                    {
                        withCredentials: true,
                    }
                );
                setCourses(response.data.courses);
            } catch (error) {
                console.log("Error fetching courses", error);
            }
        };
        fetchCourses();
    }, []);
//logout
    const handleLogout = () => {
        localStorage.removeItem("user"); // Remove token from localStorage
        setIsLoggedin(false); // Update state to reflect user is logged out
        toast.success("Logged out successfully!");
        navigate("/login"); // Redirect user to login page after logout
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    //Button Enroll now Navigate

    const Enrollnow = () => {
        // Redirect to a specific route when the button is clicked
        navigate("/courses");
      };

    return (
        <div className="bg-gradient-to-r from-black to-blue-950">
            <div className="h-screen text-white container mx-auto">
                {/* HEADER */}
                <header className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-2">
                        <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                        <h1 className="text-2xl text-orange-500">Course Haven</h1>
                    </div>
                    <div className="space-x-4">
                        {isLoggedin ? (
                            <button
                                className="bg-transparent text-white py-2 px-4 border border-white rounded"
                                onClick={handleLogout} // Attach the logout handler
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-transparent text-white py-2 px-4 border border-white rounded"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-transparent text-white py-2 px-4 border border-white rounded"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                {/* MAIN section */}
                <section className="text-center">
                    <h1 className="text-4xl font-semibold text-orange-500">Course Haven</h1>
                    <p className="text-gray-500">
                        Sharpen your skill with courses crafted by experts.
                    </p>
                    <div className="space-x-4 mt-8">
                        <Link to={"/courses"}className="bg-green-500 text-white py-1 px-2 mb-3 rounded font-semibold hover:bg-white duration-300 hover:text-black">
                            Explore Courses
                        </Link>
                        <Link to={"https://www.w3schools.com/ "}className="bg-white text-black py-1 px-2 mb-3 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white">
                            Course Docs
                        </Link>
                    </div>
                </section>

                <section>
                    <Slider {...settings}>  
                        {courses.map((course) => (
                            <div key={course._id} className="p-4">
                                <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                                        <img
                                            className="h-32 w-full object-contain"
                                            src={course.image.url}
                                            alt=""
                                        />
                                        <div className="p-6 text-center">
                                            <h2 className="text-xl font-bold text-white">{course.title}</h2>
                                            <button onClick={Enrollnow}className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300">
                                                Enroll Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </section>

                <hr />
                {/* FOOTER */}
                <footer className="my-8">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center space-x-2">
                                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                                <h1 className="text-2xl text-orange-500">Course Haven</h1>
                            </div>
                            <div className="mt-3 ml-2 md:ml-8">
                                <p className="mb-2">Follow us</p>
                                <div className="flex space-x-4">
                                    <a href="">
                                        <FaFacebook className="text-2xl hover:text-blue-500 duration-200" />
                                    </a>
                                    <a href="">
                                        <FaInstagram className="text-2xl hover:text-pink-600 duration-200" />
                                    </a>
                                    <a href="">
                                        <FaTwitter className="text-2xl hover:text-blue-600 duration-200" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="items-center flex flex-col">
                            <h3 className="text-lg font-semibold mb-4">Connects</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li className="hover:text-white cursor-pointer duration-300">Youtube-learn coding</li>
                                <li className="hover:text-white cursor-pointer duration-300">Telegram-learn coding</li>
                                <li className="hover:text-white cursor-pointer duration-300">GitHub-learn coding</li>
                            </ul>
                        </div>
                        <div className="items-center flex flex-col">
                            <h3 className="text-lg font-semibold mb-4">Copyrights &#169; 2024</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li className="hover:text-white cursor-pointer duration-300">Terms & conditions</li>
                                <li className="hover:text-white cursor-pointer duration-300">Privacy & policy</li>
                                <li className="hover:text-white cursor-pointer duration-300">Refund & cancel</li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Home;
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import logo from "../resources/Ruet_logo.jpg";
import bg from "../resources/30755.jpg";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faTimes, faSliders, faPlus, faL } from '@fortawesome/free-solid-svg-icons';

import { motion, AnimatePresence } from "framer-motion";

import DoubleEndedSlider from "./slider"

let  hndleLoadProjectProfile = () => {

}



const Slide = ({ title, data }) => {
    const settings = {
        infinite: true,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 3000,
        cssEase: "linear",
        slidesToScroll: 1,
        variableWidth: true,
    };
    return (
        <div className="slider-container">
            <p className="text-white">{title}</p>
            <Slider {...settings}>

                {data.map((d) => {
                    return (
                        <button className="p-2" key={d.projectTitle} onClick={()=>{hndleLoadProjectProfile(d)}}>
                            <div className="flex bg-white shadow-lg w-96 h-60 p-4 rounded-lg">
                                <div className="flex-shrink-0 w-1/2 h-full">
                                    <img src={d.image} className="w-full h-full object-cover rounded-lg" alt="logo" />
                                </div>
                                <div className="flex flex-col justify-between pl-4 w-1/2 h-full border-l-2 border-slate-200">
                                    <div className="flex-grow">
                                        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{d.projectTitle}</h2>
                                        <p className="text-gray-600 line-clamp-5">{d.about}</p>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </Slider>
        </div>
    );
}

const Card = ({ title, data }) => {
    return (
        <div>
            <p className="text-white">{title}</p>
            <div className="flex flex-wrap">
                {data.map((d,i) => {
                    return (
                        <button 
                        className="w-48 h-72 bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out m-2" 
                        key={d.projectTitle}
                        onClick={()=>{hndleLoadProjectProfile(d)}}
                        >
                            <img src={d.image} className="w-full h-52 p-1 object-contain" alt="logo" />
                            <div className="p-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-2 truncate">{d.projectTitle}</h2>
                            </div>
                        </button>
                    );
                })}

            </div>
        </div>
    );
}




const Home = () => {
    const navigate = useNavigate();

    const [option, setOption] = useState(true);
    const [userName, setUserName] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sortBy, setSortBy] = useState("");
    const [order, setOrder] = useState("asc");
    const [uni, setUni] = useState("");
    const [dept, setDept] = useState("");
    const [dateStart, setDateStart] = useState(2000);
    const [dateEnd, setDateEnd] = useState(new Date().getFullYear());
    const [projectData, setProjectData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // State for search term



    useEffect(() => {
        authenticateUser();
        fetchProjects();
    }, []);


    const authenticateUser = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    setIsAuthenticated(false)
                    localStorage.removeItem("token");
                    localStorage.removeItem("userName");
                } else {
                    const userName = decoded.user.userName;
                    setUserName(userName)
                    setIsAuthenticated(true)
                }
            } catch (error) {
                console.error("Token decoding error:", error);
                setIsAuthenticated(false)
                localStorage.removeItem("token");
            }
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/project/fetchProjects', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 200) {
                setProjectData(response.data)
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            alert('There was an error fetching the projects.');
        }
    };

    hndleLoadProjectProfile = (data) => {
        navigate('/project', { state: data });
    }
    const hndleLoadUserProfile = (userName) => {
        navigate('/profile', { state: userName });
    }

    const handleSliderChange = (values) => {
        setDateStart(values[0])
        setDateEnd(values[1])
    }


    const getFilteredData = () => {

        // Filter the data based on university, department, and date range
        let filteredData = projectData.filter((item) => {
            const uploadYear = new Date(item.uploadDate).getFullYear();
            return (
                (uni ? item.university === uni : true) &&
                (dept ? item.dept === dept : true) &&
                uploadYear >= dateStart &&
                uploadYear <= dateEnd &&
                (searchTerm ? item.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) : true)

            );
        });

        // Sort the filtered data
        filteredData.sort((a, b) => {
            if (!sortBy) {
                return Math.random() - 0.5;
            }

            let comparison = 0;
            if (sortBy === 'Name') {
                comparison = a.projectTitle.localeCompare(b.projectTitle);
            } else if (sortBy === 'date') {
                comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
            } else if (sortBy === 'rating') {
                comparison = a.rating - b.rating;
            }

            return order === 'asc' ? comparison : -comparison;
        });

        return filteredData;
    };


    const getRecent = () => {
        const recent = projectData.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        return recent.slice(0, 15);
    };




    return (
        <div className="h-screen flex flex-col" style={{ backgroundImage: `url(${bg})` }}>
            <div className="absolute right-0 bottom-0 z-50 m-2 text-slate-600 font-serif italic">
                <p className="text-lg font-bold ">Developed by-</p>
                <p className="ml-7">Jobayer Hossain CSE,RUET</p>
            </div>
            <div className="bg-blue-600 flex items-center p-4 space-x-4 shadow-md">
                <img className="w-20 h-20 rounded-full" src={logo} alt="logo" />
                <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                    <input
                        className="h-10 pl-10 pr-4 rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="search"
                        placeholder="Search..."
                        onChange={(e)=>{setSearchTerm(e.target.value)}}
                    />
                </div>
                {isAuthenticated ? <button className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition" onClick={
                    () => {
                        localStorage.setItem("token", "")
                        setUserName("")
                        setIsAuthenticated(false)
                    }}>Log out</button>
                    : <a href="/login" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition">Log in</a>
                }
                <button
                    className="bg-white align-middle text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition"
                    onClick={() => {
                        isAuthenticated ? window.location.href = "/upload" : alert("You need to login first.")
                    }}
                >
                    <FontAwesomeIcon className="my-auto mr-1" icon={faPlus} />
                    Add Project
                </button>
                <button
                    className="align-middle text-blue-600 px-2 py-auto rounded-md"
                    onClick={() => {
                        isAuthenticated ? hndleLoadUserProfile(userName) : alert("You are not Logged in, How can we show your profile?")
                    }}
                >
                    <FontAwesomeIcon className="text-white" size="2x" icon={faUser} />
                </button>

            </div>

            <div className="flex flex-grow overflow-hidden">
                <AnimatePresence>
                    {option && (
                        <motion.div
                            id="options"
                            className="bg-slate-100 bg-opacity-30 h-full border-r-4 border-slate-500 p-5 flex flex-col space-y-4 shadow-lg overflow-y-auto"
                            initial={{ width: 0 }}
                            animate={{ width: "25%" }}
                            exit={{ width: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div>
                                <label className="block mb-1 font-medium">Sort By:</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    onChange={(e) => {
                                        setSortBy(e.target.value)
                                    }}
                                >
                                    <option value="">None</option>
                                    <option value="Name">Name</option>
                                    <option value="date">Date</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Sorting order:</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    onChange={(e) => { setOrder(e.target.value) }}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Select University:</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    onChange={(e) => { setUni(e.target.value) }}
                                >
                                    <option value="">Any</option>
                                    <option value="RUET">RUET</option>
                                    <option value="KUET">KUET</option>
                                    <option value="CUET">CUET</option>
                                    <option value="BUET">BUET</option>
                                    <option value="DU">DU</option>
                                    <option value="RU">RU</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Select Department:</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    onChange={(e) => { setDept(e.target.value) }}
                                >
                                    <option value="">Any</option>
                                    <option value="CE">CE</option>
                                    <option value="ME">ME</option>
                                    <option value="EEE">EEE</option>
                                    <option value="CSE">CSE</option>
                                    <option value="IPE">IPE</option>
                                    <option value="URP">URP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Admission year:</label>
                                <DoubleEndedSlider onChange={handleSliderChange} />

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    id="maincontent"
                    className={`h-full  bg-gray-50 bg-opacity-0 p-1 ${option ? "w-3/4" : "w-screen"} overflow-y-auto`}
                    initial={{ width: option ? "75%" : "100%" }}
                    animate={{ width: option ? "75%" : "100%" }}
                    transition={{ duration: 0.3 }}
                >
                    <button
                        className="absolute rounded-md text-white"
                        onClick={() => { setOption(!option) }}
                    >
                        {option ? <FontAwesomeIcon size="2x" className="text-white" icon={faTimes} /> : <FontAwesomeIcon size="2x" icon={faSliders} />}
                    </button>
                    <div className="h-full overflow-y-auto bg-slate-100 bg-opacity-0 min-h-0 min-w-0 w-full p-10 space-y-5">
                        <Slide title={"Recently Added"} data={getRecent()} />
                        <Card title={"All"} data={getFilteredData()} />
                    </div>
                </motion.div>
            </div>
        </div>
    );

}

export default Home;

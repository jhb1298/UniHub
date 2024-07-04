import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import logo from "../resources/Ruet_logo.jpg";
import bg from "../resources/30755.jpg";
import axios from 'axios';

const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userName = location.state


    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState({
        userName: localStorage.getItem("userName"),
        name: "",
        email: "",
        password: "",
        profilePic: "",
        profile: "",
        university: "",
        dept: "",
        role: ""
    });
    const [projects, setProjects] = useState([]);
    const [preState, setPreState] = useState([]);
    const [viewer, setViewer] = useState({})   //information of external profile viewer

    useEffect(() => {
        setViewer(jwtDecode(localStorage.getItem("token")).user);
        fetchUserInfo();
        fetchUserProject();
    }, []);

    const fetchUserInfo = async () => {
        fetch(`http://localhost:5000/api/users/userInfo/${userName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUser(data.user);
                    setPreState(data.user);
                    console.log("user:", user);
                } else {
                    alert("Failed to fetch profile data.");
                }
            })
            .catch((error) => {
                alert("error")
                console.error("Profile fetch error:", error);
            });
    };

    const fetchUserProject = async () => {
        fetch(`http://localhost:5000/api/project/memberProjects/${userName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setProjects(data.projects);
                } else {
                    alert("Failed to fetch projects for the user.");
                }
            })
            .catch((error) => {
                console.error("Profile fetch projects for the user:", error);
            });
    };

    const hndleLoadProjectProfile = (data) => {
        navigate('/project', { state: data });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'unihubimage');

            axios.post(`https://api.cloudinary.com/v1_1/dapnfbeyi/image/upload`, formData).then((response) => {
                if (response.status === 200) {
                    const url = response.data.secure_url;
                    alert(url);
                    setUser((prevState) => ({
                        ...prevState,
                        profilePic: url
                    }));
                }
            }).catch((err) => {
                console.error("Error uploading image to cloudinery: ", err);
            });
        }
    };

    const updateUserInfo = (event) => {
        event.preventDefault();
        const updatedFields = {};

        for (const key in user) {
            if (user[key] !== preState[key]) {
                updatedFields[key] = user[key];
            }
        }

        fetch(`http://localhost:5000/api/users/updateUserInfo/${user.userName}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
            },
            body: JSON.stringify(updatedFields),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Profile updated successfully.");
                    setUser(data.user);
                } else {
                    alert("Failed to update profile.");
                }
            })
            .catch((error) => {
                console.error("Profile update error:", error);
            });
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const Card = ({ data }) => {
        return (
            <div >
                <div className="flex flex-wrap">
                    {data.map((d) => {
                        return (
                            <button className="w-48 h-fit p-2 bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out m-2" key={d.projectTitle} onClick={() => { hndleLoadProjectProfile(d) }}>
                                <img src={d.image} className="w-full aspect-video object-contain" alt="image" />
                                <div className="pt-4">
                                    <h2 className="text-lg font-bold text-gray-800 mb-2 truncate">{d.projectTitle}</h2>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex justify-center h-screen bg-cover bg-center overflow-scroll " style={{ backgroundImage: `url(${bg})` }}>
            <div className="flex flex-col bg-white bg-opacity-80 p-8 rounded-sm shadow-lg w-3/5 h-fit my-10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <img src={user.profilePic} alt="ProfilePic" className="w-24 h-24 rounded-full mr-4" />
                        <div>
                            <h2 className="text-3xl font-bold">{user.userName}</h2>
                            <h2>{user.name}</h2>
                        </div>
                    </div>
                    {
                        /*if viewer is admin or viewer is profile owner then show this button */
                        (viewer.role === "Admin" || viewer.userName===user.userName) && <button
                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                            onClick={toggleEditMode}
                        >
                            {editMode ? "Cancel" : "Edit Profile"}
                        </button>
                    }

                </div>
                {editMode ? (
                    <form onSubmit={updateUserInfo} className="mb-4">
                        <div className="flex flex-col space-y-4">
                            {viewer.userName === user.userName && (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                                            placeholder="John Doe"
                                            type="text"
                                            name="name"
                                            value={user.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                                        <input
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                                            type="file"
                                            name="profilePic"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                                            placeholder="example@gmail.com"
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Link</label>
                                        <input
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                                            placeholder="https://www.facebook.com/jh"
                                            type="text"
                                            name="profile"
                                            value={user.profile}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                                        <select
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                                            name="university"
                                            value={user.university}
                                            onChange={handleInputChange}
                                        >
                                            <option value="RUET">RUET</option>
                                            <option value="KUET">KUET</option>
                                            <option value="CUET">CUET</option>
                                            <option value="BUET">BUET</option>
                                            <option value="DU">DU</option>
                                            <option value="RU">RU</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <select
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                                            name="dept"
                                            value={user.dept}
                                            onChange={handleInputChange}
                                        >
                                            <option value="CSE">CSE</option>
                                            <option value="EEE">EEE</option>
                                            <option value="ETE">ETE</option>
                                            <option value="ME">ME</option>
                                            <option value="CE">CE</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {viewer.role === "Admin" ? <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                                    name="role"
                                    value={user.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Reviewer">Reviewer</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div> : null}

                        </div>
                        <button
                            className="p-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                            type="submit"
                        >
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div className="mb-4">
                        <div className="felx flex-col space-y-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <p className="p-2 bg-gray-100 border border-gray-300 rounded-md">{user.email}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Link</label>
                                <p className="p-2 bg-gray-100 border border-gray-300 rounded-md">{user.profile}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                                <p className="p-2 bg-gray-100 border border-gray-300 rounded-md">{user.university}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <p className="p-2 bg-gray-100 border border-gray-300 rounded-md">{user.dept}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <p className="p-2 bg-gray-100 border border-gray-300 rounded-md">{user.role}</p>
                            </div>

                        </div>
                    </div>
                )}
                <h2 className="text-xl font-bold mb-4">Projects Done:</h2>
                <div>
                    <Card data={projects.filter((p) => {
                        return p.supervisor !== user.userName
                    })} />
                </div>
                <h2 className="text-xl font-bold mb-4">Projects Supervised:</h2>
                <div>
                    <Card data={projects.filter((p) => {
                        return p.supervisor === user.userName
                    })} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

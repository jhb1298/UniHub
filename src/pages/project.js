import React, { useState, useEffect } from 'react';
import bg from "../resources/30755.jpg";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



const ProjectDescription = () => {
    const navigate=useNavigate()
    const location = useLocation();
    const initialProjectData = location.state

    const userName=jwtDecode(localStorage.getItem("token")).user.userName
    const [isEditing, setIsEditing] = useState(false);
    const [project, setProject] = useState(
        initialProjectData
    );
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0]

        if (file) {
            const formData = new FormData();
            formData.append('file', file)
            formData.append('upload_preset', 'unihubimage')

            axios.post(`https://api.cloudinary.com/v1_1/dapnfbeyi/image/upload`, formData).then((response) => {
                if (response.status === 200) {
                    const url = response.data.secure_url
                    alert(url)
                    this.setState({ profilePic: url })
                }
            }).catch((err) => {
                console.error("Error uploading image to cloudinery: ", err)
            })
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const updateProjectInfo = (event) => {
        event.preventDefault();
        const updatedFields = {
            id: project.id
        };

        for (const key in project) {
            if (project[key] !== initialProjectData[key]) {
                updatedFields[key] = project[key];
            }
        }

        fetch("http://localhost:5000/api/project/updateProjectInfo", {
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
                    this.setState({ user: data.user });
                    console.log("upadate ddata:", updatedFields)
                    console.log("ddata:", data.user)
                } else {
                    alert("Failed to update profile.");
                }
            })
            .catch((error) => {
                console.error("Profile update error:", error);
            });
    }

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
                }
                else {
                    setIsAuthenticated(true)
                }
            } catch (error) {
                console.error("Token decoding error:", error);
                setIsAuthenticated(false)
                localStorage.removeItem("token");
            }
        }
    };

    useEffect(() => {
        authenticateUser()
    })

    return (
        <div className=" mx-auto p-10 h-screen overflow-scroll flex justify-center" style={{ backgroundImage: `url(${bg})` }}>
            <div className='w-2/3 h-fit bg-slate-100 bg-opacity-60 flex flex-col p-8'>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{isEditing ? (
                        <input
                            type="text"
                            name="projectTitle"
                            value={project.projectTitle}
                            onChange={handleChange}
                            className="border p-1 w-full"
                        />
                    ) : project.projectTitle}</h1>
                    {project.teamMembers.find((m) => (m === userName)) && isAuthenticated ? <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={handleEdit}
                    >
                        {isEditing ? 'cancel' : 'Edit'}
                    </button> : null}

                </div>
                <div className="my-4">
                    {isEditing ? (
                        <input
                            type="file"
                            name="image"
                            accept='image/*'
                            onChange={handleImageChange}
                            className="border p-1 w-full"
                        />
                    ) : (
                        <img src={project.image} alt="Project" className="w-full aspect-video" />
                    )}
                </div>
                <div className="my-4">
                    <h2 className="text-xl font-bold">About the Project</h2>
                    {isEditing ? (
                        <textarea
                            name="about"
                            value={project.about}
                            onChange={handleChange}
                            className="border p-1 w-full"
                        />
                    ) : (
                        <p>{project.about}</p>
                    )}
                </div>
                <div className="my-4">
                    <h2 className="text-xl font-bold">Project Link</h2>
                    {isEditing ? (
                        <input
                            name="projectLink"
                            type='text'
                            value={project.projectLink}
                            onChange={handleChange}
                            className="border p-1 w-full"
                        />
                    ) : (
                        <a href={project.projectLink} target='blank'>{project.projectLink}</a>
                    )}
                </div>
                <div className="my-4">
                    <h2 className="text-xl font-bold">YouTube Video</h2>
                    {isEditing ? (
                        <input
                            type="text"
                            name="videoLink"
                            value={project.videoLink}
                            onChange={handleChange}
                            className="border p-1 w-full"
                        />
                    ) : (<div className='w-full aspect-video'>
                        <iframe width="100%" height="100%" src={project.videoLink} title={project.title} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen ></iframe>
                    </div>

                    )}
                </div>
                <div className="my-4">
                    <h2 className="text-xl font-bold">Supervisor</h2>
                    {isEditing ? (
                        <input
                            type="text"
                            name="supervisor"
                            value={project.supervisor}
                            onChange={handleChange}
                            className="border p-1 w-full"
                        />
                    ) : (
                        <p>{project.supervisor}</p>
                    )}
                </div>
                {
                    project.teamMembers.map((name, index) => {  //here name is the userName
                        return <div className="my-4">
                            <h2 className="text-xl font-bold">Team Members {index + 1}</h2>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="teamMembers"
                                    value={name}
                                    onChange={handleChange}
                                    className="border p-1 w-full"
                                />
                            ) : (
                                <button onClick={()=>{navigate('/profile', { state: name })}}>{name}</button>
                            )}
                        </div>
                    })
                }

                <div className="my-4">
                    <h2 className="text-xl font-bold">University</h2>
                    {isEditing ? (
                        <select
                            name="university"
                            value={project.university}
                            onChange={handleChange}
                            className="border p-1 w-full"
                        >
                            <option value="RUET">RUET</option>
                            <option value="KUET">KUET</option>
                            <option value="CUET">CUET</option>
                            <option value="BUET">BUET</option>
                            <option value="DU">DU</option>
                            <option value="RU">RU</option>
                        </select>
                    ) : (
                        <p>{project.university}</p>
                    )}
                </div>
                <div className="my-4">
                    <h2 className="text-xl font-bold">Department</h2>
                    {isEditing ? (
                        <select
                            name="dept"
                            value={project.dept}
                            onChange={handleChange}
                            className="border p-1 w-full"
                        >
                            <option value="CE">CE</option>
                            <option value="ME">ME</option>
                            <option value="EEE">EEE</option>
                            <option value="CSE">CSE</option>
                            <option value="IPE">IPE</option>
                            <option value="URP">URP</option>
                        </select>
                    ) : (
                        <p>{project.dept}</p>
                    )}
                </div>
                {
                    isEditing ? <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={(e) => {
                            handleEdit()
                            updateProjectInfo(e)
                        }}
                    >
                        Save
                    </button> : null
                }

            </div>


        </div>
    );
};

export default ProjectDescription;

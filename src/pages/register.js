import React from "react";
import axios from 'axios'
import logo from "../resources/Ruet_logo.jpg";
import bg from "../resources/30755.jpg";
let acceptsTerms = false

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            name: "",
            email: "",
            password: "",
            profilePic: "",
            profile: "",
            university: "RUET",
            dept: "CE",
            role: "Student"
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleImageChange = (event) => {
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

    handleFormSubmit = (event) => {
        event.preventDefault();

        // Check if terms are accepted
        if (!acceptsTerms) {
            alert("You must accept Terms And Conditions");
            return;
        }

        // Destructure state
        const { userName, name, email, password, profilePic, profile, university, dept, role } = this.state;

        // Make the POST request
        fetch("http://localhost:5000/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName, name, email, password, profilePic, profile, university, dept, role }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Response data:", data); // Log the response data for debugging

                if (data.token) {
                    // Store the token
                    localStorage.setItem("token", data.token);
                    alert("Registration successful. Please log in.");
                    window.location.href = "/login";
                } else {
                    alert("Registration failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Registration error:", error);
                alert("An error occurred during registration. Please try again.");
            });
    };


    render() {
        const { userName, name, email, password, profile } = this.state;

        return (
            <div className="flex justify-center p-6  h-screen overflow-scroll bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
                <div className=" flex flex-col bg-white bg-opacity-60 p-6 m-auto rounded-xl shadow-lg w-fit h-fit">
                    <div className="flex justify-center">
                        <img id="regimg" src={logo} alt="Logo" className="w-24 h-24 rounded-full" />
                    </div>
                    <h2 className="text-xl font-bold m-1 text-center">Register</h2>
                    <form onSubmit={this.handleFormSubmit}>
                        <div className="flex space-x-4">
                            <div className=" min-w-80">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md  "
                                        placeholder="jd_12"
                                        type="text"
                                        name="userName"
                                        value={userName}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md  "
                                        placeholder="John Doe"
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md  "
                                        placeholder="example@gmail.com"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Set Password</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md  "
                                        placeholder="••••••••"
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={this.handleInputChange}
                                    />
                                </div>

                            </div>
                            <div className="min-w-80">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md  "
                                        type="file"
                                        accept="image/*"
                                        name="profilePic"
                                        onChange={(e)=>{this.handleImageChange(e)}}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Link</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md  "
                                        placeholder="https://www.facebook.com/jh"
                                        type="text"
                                        name="profile"
                                        value={profile}
                                        onChange={this.handleInputChange}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                                    <select
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md  "
                                        name="university"
                                        defaultValue={"RUET"}
                                        onChange={this.handleInputChange}
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
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md  "
                                        name="dept"
                                        defaultValue={"CE"}
                                        onChange={this.handleInputChange}
                                    >
                                        <option value="CE">CE</option>
                                        <option value="ME">ME</option>
                                        <option value="EEE">EEE</option>
                                        <option value="CSE">CSE</option>
                                        <option value="IPE">IPE</option>
                                        <option value="URP">URP</option>
                                    </select>
                                </div>

                            </div>
                        </div>

                        <label className="flex items-center mb-6">
                            <input
                                className="mr-2"
                                type="checkbox"
                                onChange={(e) => { acceptsTerms = e.target.value }}
                            />
                            <span className="text-sm">Accept <a href="t&c" className="text-blue-600">terms & conditions</a></span>
                        </label>


                        <button className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300" type="submit">Register</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;

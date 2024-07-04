import React from "react";
import logo from "../resources/Ruet_logo.jpg";
import bg from "../resources/30755.jpg";
//import { jwtDecode } from 'jwt-decode';


class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleFormSubmit = (event) => {
        event.preventDefault();
        const { email, password } = this.state;
    
        fetch("http://localhost:5000/api/users/login", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            if (data.token) {
                // Authentication successful
                localStorage.setItem("token", data.token); // Store the token in local storage
                //const decoded = jwtDecode(data.token);
                //const userName = decoded.user.userName;
                //localStorage.setItem('userName',userName)
                alert("Login successful!");
                // Redirect to the home page or perform any necessary action
                window.location.href = "/";
            } else {
                // Authentication failed
                alert("Authentication failed. Please check your credentials.");
            }
        })
        .catch((error) => {
            console.error("Login error:", error);
            alert("An error occurred during login. Please try again.");
        });
    
        console.log("Email:", email);
        console.log("Password:", password);
    };
    
    render() {
        const { email, password } = this.state;

        return (
            <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
                <div className="bg-white bg-opacity-60 p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="flex justify-center mb-6">
                        <img id="logimg" src={logo} alt="Logo" className="w-24 h-24 rounded-full" />
                    </div>
                    <form onSubmit={this.handleFormSubmit}>
                        <h2 className="text-xl font-bold mb-4 text-center">Log In</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                               className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md  "
                                autoFocus
                                placeholder="example@gmail.com"
                                type="email"
                                name="email"
                                value={email}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md  "
                                placeholder="bz@623"
                                type="password"
                                name="password"
                                value={password}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center">
                                <input
                                    className="mr-2"
                                    type="checkbox"
                                    name="option1"
                                    value="Option 1"
                                />
                                <span className="text-sm">Accept <a href="t&c" className="text-blue-600">terms & conditions</a></span>
                            </label>
                            <a href="register" className="text-sm text-blue-600">Register</a>
                        </div>
                        <button className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300" type="submit">Log In</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default LogIn;

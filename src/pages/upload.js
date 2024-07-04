import React from "react";
import logo from "../resources/Ruet_logo.jpg";
import bg from "../resources/30755.jpg";
import axios from "axios";




class ProjectUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectTitle: "",
            image: "",
            about: "",
            projectLink: "",
            videoLink: "",
            supervisor: "",
            teamMembers: [""],
            university: "",
            dept: "",
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
                    this.setState({ image: url })
                }
            }).catch((err) => {
                alert("error uploding")
                console.error("Error uploading image to cloudinery: ", err)
            })
        }
    }


    


    handleTeamMemberChange = (index, event) => {
        const { value } = event.target;
        const updatedTeamMembers = this.state.teamMembers.map((name, i) =>
            i === index ? value : name
        );
        this.setState({ teamMembers: updatedTeamMembers });
    };

    addTeamMember = () => {
        this.setState({
            teamMembers: [...this.state.teamMembers, ''],
        });
    };

    handleFormSubmit = (event) => {
        event.preventDefault();
        const { projectTitle, image, about, projectLink, videoLink, supervisor, teamMembers, university, dept } = this.state;

        const projectData = {
            projectTitle, image, about, projectLink, videoLink, supervisor, teamMembers, university, dept
        };

        fetch("http://localhost:5000/api/project/uploadProject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(projectData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("dttttt:", data)
                if (data.success) {
                    alert("Project uploaded successfully!");
                    this.setState({
                        projectTitle: "",
                        image: "",
                        about: "",
                        projectLink: "",
                        videoLink: "",
                        supervisor: "",
                        teamMembers: [""],
                        university: "",
                        dept: "",
                    });
                } else {
                    alert("Failed to upload project. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Project upload error:", error);
            });
    };



    render() {
        const { projectTitle, about, projectLink, videoLink, supervisor, teamMembers, university, dept } = this.state;

        return (
            <div className="flex justify-center h-screen overflow-scroll  bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
                <div className="flex flex-col bg-white bg-opacity-60 p-6 rounded-xl shadow-lg w-fit h-fit m-10">
                    <div className="flex justify-center">
                        <img id="projimg" src={logo} alt="Logo" className="w-24 h-24 rounded-full" />
                    </div>
                    <h2 className="text-xl font-bold m-1 text-center">Upload Project</h2>
                    <form onSubmit={this.handleFormSubmit}>

                        <div className="flex space-x-4">
                            <div className="min-w-80">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md"
                                        placeholder="Project Title"
                                        type="text"
                                        name="projectTitle"
                                        value={projectTitle}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={(e) => { this.handleImageChange(e) }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                                    <textarea
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md"
                                        placeholder="Project Description"
                                        name="about"
                                        value={about}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md"
                                        placeholder="github/jhb/unihub"
                                        type="text"
                                        name="projectLink"
                                        value={projectLink}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Video Link</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md"
                                        placeholder="Youtube url"
                                        type="text"
                                        name="videoLink"
                                        value={videoLink}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                                    <select
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md"
                                        defaultValue={""}
                                        name="university"
                                        value={university}
                                        onChange={this.handleInputChange}
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
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md"
                                        defaultValue={""}
                                        name="dept"
                                        value={dept}
                                        onChange={this.handleInputChange}
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



                            </div>
                            <div className="min-w-80">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                                    <input
                                        className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md mb-2"
                                        placeholder="Username"
                                        type="text"
                                        name="supervisor"
                                        value={supervisor}
                                        onChange={this.handleInputChange}
                                    />

                                </div>
                                {teamMembers.map((name, index) => (
                                    <div key={index} className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Team Member {index + 1}</label>
                                        <input
                                            className="w-full p-2 bg-blue-100 bg-opacity-40 border-2 border-slate-500 rounded-md mb-2"
                                            placeholder="Username"
                                            type="text"
                                            name="teamMembers"
                                            value={name}
                                            onChange={(event) => this.handleTeamMemberChange(index, event)}
                                        />

                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={this.addTeamMember}
                                    className="w-full p-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                                >
                                    Add Team Member
                                </button>

                            </div>
                        </div>
                        <input className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300" type="submit" value="Upload Project" />
                    </form>
                </div>
            </div>
        );
    }
}

export default ProjectUpload;

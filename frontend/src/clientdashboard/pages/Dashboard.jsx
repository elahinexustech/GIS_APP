import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './style.css';


const SidebarMenu = ({ projects, activeSection, setActiveSection, setSelectedProject }) => (
    <div className="list-group list-group-flush">
        <h5>Dashboard</h5>
        <button
            className={`list-group-item list-group-item-action py-2 ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => {
                setActiveSection('home');
                setSelectedProject(null);
            }}
        >
            Home
        </button>
        <br />
        <button
            className={`list-group-item list-group-item-action py-2 ${activeSection === 'home' ? 'active' : ''} bg-success`}
            onClick={() => {
                window.location = '/map'
            }}
        >
            New Project
        </button>

        <h5 className="mt-4">Projects</h5>
        {projects.map((project, index) => (
            <div className="dropdown mt-2" key={index}>
                <button
                    className="btn btn-secondary dropdown-toggle w-100"
                    type="button"
                    id={`dropdown-${index}`}
                    data-bs-toggle="dropdown"
                    onClick={() => setSelectedProject(project)}
                >
                    <p>{project['project: '].name}</p>
                    <p>Project ID: {project['project: '].id}</p>
                </button>
                <ul className="dropdown-menu" aria-labelledby={`dropdown-${index}`}>
                    <li>
                        <button
                            className={`dropdown-item ${activeSection === 'coupons' ? 'active' : ''}`}
                            onClick={() => setActiveSection('coupons')}
                        >
                            Coupon Link
                        </button>
                    </li>
                    <li>
                        <button
                            className={`dropdown-item ${activeSection === 'active-users' ? 'active' : ''}`}
                            onClick={() => setActiveSection('active-users')}
                        >
                            Active Members
                        </button>
                    </li>
                    <li>
                        <button
                            className={`dropdown-item ${activeSection === 'comments' ? 'active' : ''}`}
                            onClick={() => setActiveSection('comments')}
                        >
                            Comments
                        </button>
                    </li>
                    <li>
                        <button
                            className={`dropdown-item ${activeSection === 'likes' ? 'active' : ''}`}
                            onClick={() => setActiveSection('likes')}
                        >
                            Likes
                        </button>
                    </li>
                    <li>
                        <button
                            className={`dropdown-item ${activeSection === 'dislikes' ? 'active' : ''}`}
                            onClick={() => setActiveSection('dislikes')}
                        >
                            Dislikes
                        </button>
                    </li>
                </ul>
            </div>
        ))}
    </div>
);

const Sidebar = ({ projects, activeSection, setActiveSection, setSelectedProject }) => (
    <>
        {/* Sidebar for Desktop */}
        <nav id="sidebarMenu" className="bg-white p-3 shadow-lg sideBarMenu d-none d-md-block">
            <SidebarMenu
                projects={projects}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                setSelectedProject={setSelectedProject}
            />
        </nav>

        {/* Toggle Button for Mobile */}
        <button
            className="btn btn-primary d-md-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mobileSidebar"
            aria-controls="mobileSidebar"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ position: 'fixed', top: '60px', right: '10px', zIndex: 1050, width: '10%' }}
        >
            ☰
        </button>

        {/* Sidebar for Mobile */}
        <div
            className="collapse bg-white p-3 shadow-lg d-md-none"
            id="mobileSidebar"
            style={{ width: '250px', height: '100vh', position: 'fixed', top: '100px', right: '10px', zIndex: 1040 }}
        >
            <SidebarMenu
                projects={projects}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                setSelectedProject={setSelectedProject}
            />
        </div>
    </>
);


const Dashboard = () => {
    const [projects, setProjects] = useState([]); // State to hold projects
    const [selectedProject, setSelectedProject] = useState(null); // Currently selected project
    const [activeSection, setActiveSection] = useState('home'); // Active section

    // Fetch projects on component mount
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/projects/', { withCredentials: true })
            .then((response) => {
                setProjects(response.data.merged_data);
            })
            .catch((error) => {
                console.error('Error fetching projects:', error);
                toast.error('Failed to load projects');
            });
    }, []);

    const renderComments = (comments) => {
        return comments.map((comment) => (
            <div key={comment.id} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                <strong>{comment.user.email}</strong>: {comment.text}
                {comment.replies.length > 0 && (
                    <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                        {renderComments(comment.replies)}
                    </div>
                )}
            </div>
        ));
    };

    const renderDetails = () => {
        if (activeSection === 'home') {
            return (
                <div className="container mt-5">
                    <h2>Welcome to the Dashboard</h2>
                    <p>Select a project and a section to view its details.</p>
                </div>
            );
        }

        if (!selectedProject) {
            return (
                <div className="container mt-5">
                    <h2>Select a project to view its details</h2>
                </div>
            );
        }

        switch (activeSection) {
            case 'coupons':
                return (
                    <div className="container mt-5">
                        <h2>Coupon Link</h2>
                        <div>
                            {selectedProject.coupon.link ? (
                                <>
                                    <p>Share this link with Members:</p>
                                    <a
                                        href={selectedProject.coupon.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open Link in new tab
                                    </a><br />
                                    <button
                                        className="btn btn-transparent d-flex align-items-center p-2"
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedProject.coupon.link);
                                            toast.success('Link copied to clipboard!');
                                        }}
                                    >
                                        <i className="bi bi-clipboard"></i>
                                        Copy Link
                                    </button>
                                </>
                            ) : (
                                <p>No coupon link available</p>
                            )}
                        </div>
                    </div>
                );
            case 'active-users':
                return (
                    <div className="container mt-5">
                        <h2>Active Members</h2>
                        {selectedProject.coupon.users_connected.length > 0 ? (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProject.coupon.users_connected
                                        .filter((user) => user)
                                        .map((user, index) => (
                                            <tr key={index}>
                                                <td>{user.id}</td>
                                                <td>{user.email}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No active Members available</p>
                        )}
                    </div>
                );
            case 'comments':
                return (
                    <div className="container mt-5">
                        <h2>Comments and Replies</h2>
                        {selectedProject.comment.length > 0 ? (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Member</th>
                                        <th>Comment</th>
                                        <th>Replies</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProject.comment.map((comment, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{comment.user.email}</td>
                                            <td>{comment.text}</td>
                                            <td>{comment.replies && comment.replies.length > 0 ? (
                                                comment.replies.map((reply, i) => (
                                                    <div key={i}>
                                                        - {reply.text}
                                                    </div>
                                                ))
                                            ) : (
                                                <span>No Replies</span>
                                            )}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No comments available</p>
                        )}
                    </div>
                );
            case 'likes':
                return (
                    <div className="container mt-5">
                        <h2>Likes</h2>
                        {selectedProject.likes.length > 0 ? (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Member</th>
                                        <th>Latitude</th>
                                        <th>Longitude</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProject.likes.map((likes, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{likes.user.email}</td>
                                            <td>{likes.latitude}</td>
                                            <td>{likes.longitude}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No Data available</p>
                        )}
                    </div>
                );
            case 'dislikes':
                return (
                    <div className="container mt-5">
                        <h2>DisLikes</h2>
                        {selectedProject.dislikes.length > 0 ? (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Member</th>
                                        <th>Latitude</th>
                                        <th>Longitude</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProject.dislikes.map((dislikes, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{dislikes.user.email}</td>
                                            <td>{dislikes.latitude}</td>
                                            <td>{dislikes.longitude}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No Data available</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="d-flex">
            <Sidebar
                projects={projects}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                setSelectedProject={setSelectedProject}
            />
            <div className="container">{renderDetails()}</div>
        </div>
    );
};

export default Dashboard;

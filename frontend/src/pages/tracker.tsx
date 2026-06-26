import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import API from "../api/api";
import "./tracker.css";

type Job = {
    _id: string;
    jobAddUrl: string;
    jobTitle: string;
    companyName: string;
    city: string;
    minWorkLoad: number;
    maxWorkLoad: number;
    published: string;
    jobDescription: string;
    status: string;
    yourNote: string;
    createdAt?: string;
    updatedAt?: string;
};

type Column = {
    id: string;
    title: string;
    jobs: Job[];
};

type FormData = {
    jobAddUrl: string;
    jobTitle: string;
    companyName: string;
    city: string;
    minWorkLoad: number;
    maxWorkLoad: number;
    published: string;
    jobDescription: string;
    status: string;
    yourNote: string;
};

const initialFormData: FormData = {
    jobAddUrl: "",
    jobTitle: "",
    companyName: "",
    city: "",
    minWorkLoad: 0,
    maxWorkLoad: 100,
    published: "",
    jobDescription: "",
    status: "Wishlist",
    yourNote: "",
};

const initialColumns: Column[] = [
    {
        id: "Wishlist",
        title: "Wishlist",
        jobs: [],
    },
    {
        id: "Applied",
        title: "Applied",
        jobs: [],
    },
    {
        id: "Interviewing",
        title: "Interviewing",
        jobs: [],
    },
    {
        id: "Offered",
        title: "Offered",
        jobs: [],
    },
    {
        id: "Accepted",
        title: "Accepted",
        jobs: [],
    },
    {
        id: "Rejected",
        title: "Rejected",
        jobs: [],
    },
];

function Tracker() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [editingJobId, setEditingJobId] = useState<string | null>(null);
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [error, setError] = useState("");

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        fetchJobs();
    }, [navigate]);

    async function fetchJobs() {
        try {
            const res = await API.get("/api/save-jobs");

            const jobs: Job[] = res.data.data || [];

            const updatedColumns = initialColumns.map((column) => ({
                ...column,
                jobs: jobs.filter((job) => job.status === column.id),
            }));

            setColumns(updatedColumns);
            setError("");
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(err.response?.data?.message || "Failed to fetch jobs");
        }
    }

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]:
                name === "minWorkLoad" || name === "maxWorkLoad"
                    ? Number(value)
                    : value,
        });
    }

    function formatDate(dateValue: string) {
        if (!dateValue) return "No date";

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function openAddModal() {
        setFormData(initialFormData);
        setEditingJobId(null);
        setError("");
        setShowModal(true);
    }

    function openUpdateModal(job: Job) {
        setFormData({
            jobAddUrl: job.jobAddUrl,
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            city: job.city,
            minWorkLoad: job.minWorkLoad,
            maxWorkLoad: job.maxWorkLoad,
            published: job.published ? job.published.slice(0, 10) : "",
            jobDescription: job.jobDescription || "",
            status: job.status || "Wishlist",
            yourNote: job.yourNote || "",
        });

        setEditingJobId(job._id);
        setError("");
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setFormData(initialFormData);
        setEditingJobId(null);
        setError("");
    }

    function openJobDetails(job: Job) {
        navigate(`/save-job/${job._id}`, {
            state: job,
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (Number(formData.minWorkLoad) > Number(formData.maxWorkLoad)) {
            setError("Minimum workload cannot be greater than maximum workload");
            return;
        }

        try {
            if (editingJobId) {
                await API.patch(`/api/save-jobs/${editingJobId}`, formData);
            } else {
                await API.post("/api/save-jobs", formData);
            }

            await fetchJobs();
            closeModal();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save job");
        }
    }

    async function handleDragEnd(result: DropResult) {
        const { source, destination } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const newColumns = columns.map((column) => ({
            ...column,
            jobs: [...column.jobs],
        }));

        const sourceColumn = newColumns.find(
            (column) => column.id === source.droppableId
        );

        const destinationColumn = newColumns.find(
            (column) => column.id === destination.droppableId
        );

        if (!sourceColumn || !destinationColumn) return;

        const [movedJob] = sourceColumn.jobs.splice(source.index, 1);

        if (!movedJob) return;

        const oldStatus = movedJob.status;
        movedJob.status = destinationColumn.id;

        destinationColumn.jobs.splice(destination.index, 0, movedJob);

        setColumns(newColumns);
        setError("");

        try {
            await API.patch(`/api/save-jobs/${movedJob._id}`, {
                status: destinationColumn.id,
            });
        } catch (err: any) {
            movedJob.status = oldStatus;
            setError(err.response?.data?.message || "Failed to update status");
            await fetchJobs();
        }
    }

    async function handleDelete(jobId: string) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/api/save-jobs/${jobId}`);
            await fetchJobs();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete job");
        }
    }

    async function handleLogout() {
        try {
            await API.post("/api/logout");
        } catch (error) {
            console.log("Logout error", error);
        } finally {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("token");
            navigate("/login");
        }
    }

    return (
        <div className="home-page">
            <nav className="navbar">
                <div className="logo">
                    <img
                        src="/job-tracker-favicon.ico"
                        id="jb-img-icon"
                        alt="JobTracker icon"
                    />
                    <h2>JobTracker</h2>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </nav>

            {error && <div className="error">{error}</div>}

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="board">
                    {columns.map((column) => (
                        <div className="column" key={column.id}>
                            <div className="column-header">
                                <h3>{column.title}</h3>

                                {column.id === "Wishlist" && (
                                    <button
                                        className="add-btn"
                                        onClick={openAddModal}
                                        type="button"
                                    >
                                        +
                                    </button>
                                )}
                            </div>

                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        className={`drop-area ${
                                            snapshot.isDraggingOver
                                                ? "drag-over"
                                                : ""
                                        }`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {column.jobs.map((job, index) => (
                                            <Draggable
                                                draggableId={job._id}
                                                index={index}
                                                key={job._id}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={`job-card ${
                                                            snapshot.isDragging
                                                                ? "dragging"
                                                                : ""
                                                        }`}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() =>
                                                            openJobDetails(job)
                                                        }
                                                    >
                                                        <button
                                                            className="update-card-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openUpdateModal(job);
                                                            }}
                                                            type="button"
                                                            title="Update job"
                                                        >
                                                            +
                                                        </button>

                                                        <h4>{job.jobTitle}</h4>

                                                        <p className="company-name">
                                                            {job.companyName}
                                                        </p>

                                                        <p>{job.city}</p>

                                                        <div className="job-footer">
                                                            <span>{job.status}</span>
                                                            <p>
                                                                Published:{" "}
                                                                {formatDate(
                                                                    job.published
                                                                )}
                                                            </p>
                                                        </div>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(job._id);
                                                            }}
                                                            type="button"
                                                            title="Delete job"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}

                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {showModal && (
                <div className="modal-overlay">
                    <form className="job-modal" onSubmit={handleSubmit}>
                        <div className="modal-content">
                            <h1>{editingJobId ? "Update Job" : "Track New Job"}</h1>

                            {error && <div className="modal-error">{error}</div>}

                            <label>Job Ad URL</label>
                            <input
                                type="text"
                                name="jobAddUrl"
                                placeholder="https://example.com/job"
                                value={formData.jobAddUrl}
                                onChange={handleChange}
                                required
                            />

                            <label>Job Title</label>
                            <input
                                type="text"
                                name="jobTitle"
                                placeholder="Full Stack Developer"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                required
                            />

                            <label>Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Company name"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />

                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />

                            <div className="range-row">
                                <div>
                                    <label>Min workload</label>
                                    <div className="range-box">
                                        <input
                                            type="range"
                                            name="minWorkLoad"
                                            min="0"
                                            max="100"
                                            value={formData.minWorkLoad}
                                            onChange={handleChange}
                                        />
                                        <span>{formData.minWorkLoad}%</span>
                                    </div>
                                </div>

                                <div>
                                    <label>Max workload</label>
                                    <div className="range-box">
                                        <input
                                            type="range"
                                            name="maxWorkLoad"
                                            min="0"
                                            max="100"
                                            value={formData.maxWorkLoad}
                                            onChange={handleChange}
                                        />
                                        <span>{formData.maxWorkLoad}%</span>
                                    </div>
                                </div>
                            </div>

                            <label>Published</label>
                            <input
                                type="date"
                                name="published"
                                value={formData.published}
                                onChange={handleChange}
                                required
                            />

                            <label>Job Description</label>
                            <textarea
                                name="jobDescription"
                                placeholder="Write job description"
                                value={formData.jobDescription}
                                onChange={handleChange}
                            />

                            <label>Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Wishlist">Wishlist</option>
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offered">Offered</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>

                            <label>Your Notes</label>
                            <textarea
                                name="yourNote"
                                placeholder="Write your notes here"
                                value={formData.yourNote}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closeModal}
                            >
                                CANCEL
                            </button>

                            <button type="submit" className="submit-btn">
                                {editingJobId ? "UPDATE" : "SUBMIT"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Tracker;
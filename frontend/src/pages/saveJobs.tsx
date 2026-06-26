import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import "./saveJob.css";

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
};

function SaveJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSingleJob();
    }, [id]);

    async function fetchSingleJob() {
        try {
            setLoading(true);
            setError("");

            const res = await API.get(`/api/save-jobs/${id}`);

            setJob(res.data.data);
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(err.response?.data?.message || "Failed to fetch job");
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <div className="save-job-page">
                <div className="save-job-card">
                    <h2>Loading job...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="save-job-page">
                <div className="save-job-card">
                    <h2>{error}</h2>

                    <button className="back-btn" onClick={() => navigate("/tracker")}>
                        ← Back to Tracker
                    </button>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="save-job-page">
                <div className="save-job-card">
                    <h2>No job found</h2>

                    <button className="back-btn" onClick={() => navigate("/tracker")}>
                        ← Back to Tracker
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="save-job-page">
            <div className="save-job-card">
                <button className="back-btn" onClick={() => navigate("/tracker")}>
                    ← Back
                </button>

                <h1>{job.jobTitle}</h1>

                <div className="detail-row">
                    <strong>Company:</strong>
                    <span>{job.companyName}</span>
                </div>

                <div className="detail-row">
                    <strong>City:</strong>
                    <span>{job.city}</span>
                </div>

                <div className="detail-row">
                    <strong>Status:</strong>
                    <span>{job.status}</span>
                </div>

                <div className="detail-row">
                    <strong>Published:</strong>
                    <span>{formatDate(job.published)}</span>
                </div>

                <div className="detail-row">
                    <strong>Workload:</strong>
                    <span>
                        {job.minWorkLoad}% - {job.maxWorkLoad}%
                    </span>
                </div>

                <div className="detail-section">
                    <strong>Job Ad URL:</strong>
                    <a href={job.jobAddUrl} target="_blank" rel="noreferrer">
                        {job.jobAddUrl}
                    </a>
                </div>

                <div className="detail-section">
                    <strong>Job Description:</strong>
                    <p>{job.jobDescription}</p>
                </div>

                <div className="detail-section">
                    <strong>Your Notes:</strong>
                    <p>{job.yourNote}</p>
                </div>
            </div>
        </div>
    );
}

export default SaveJob;
import { useEffect, useState } from "react";
import API from "../api";
import "../styles/dashboard.css";

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [score, setScore] = useState("");
    const [date, setDate] = useState("");

    const [scores, setScores] = useState([]);

    const [dashboard, setDashboard] = useState({
        subscription: {},
        charity: {},
        winnings: {}
    });

    // FETCH DASHBOARD
    const fetchDashboard = async () => {
        try {
            const res = await API.get(`/dashboard/${user._id}`);

            setDashboard({
                subscription: res.data.subscription || {},
                charity: res.data.charity || {},
                winnings: res.data.winnings || {},
                drawsEntered: res.data.drawsEntered || 0
            });

            setScores(res.data.scores || []);
        } catch (err) {
            console.log(err);
        }
    };

    // ADD SCORE
    const addScore = async () => {
        if (!score || !date) return alert("Enter score and date");
        if (score < 1 || score > 45) return alert("Score must be 1–45");

        await API.post("/scores", {
            userId: user._id,
            score,
            date
        });

        setScore("");
        setDate("");
        fetchDashboard();
    };

    // CREATE SUBSCRIPTION
    const subscribe = async (plan) => {
        try {
            await API.post("/subscription", {
                userId: user._id,
                plan
            });

            fetchDashboard();
        } catch (err) {
            console.log(err);
        }
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    useEffect(() => {
        if (!user) window.location.href = "/";
        else fetchDashboard();
    }, []);

    return (
        <div className="dashboard-container">

            {/* HEADER */}
            <div className="header">
                <h2>Welcome, {user?.name}</h2>
                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </div>

            <div className="grid">

                {/* SUBSCRIPTION */}
                <div className="card">
                    <h3>Subscription</h3>

                    <p>Status: <b>{dashboard.subscription.status || "Inactive"}</b></p>
                    <p>Plan: {dashboard.subscription.plan || "None"}</p>

                    <p>
                        Renewal:{" "}
                        {dashboard.subscription.renewalDate
                            ? new Date(dashboard.subscription.renewalDate).toDateString()
                            : "-"}
                    </p>

                    {/* SHOW BUTTON ONLY IF NOT ACTIVE */}
                    {dashboard.subscription.status !== "Active" && (
                        <>
                            <button onClick={() => subscribe("Monthly")}>
                                Subscribe Monthly
                            </button>

                            <button
                                onClick={() => subscribe("Yearly")}
                                style={{ marginLeft: "10px" }}
                            >
                                Subscribe Yearly
                            </button>
                        </>
                    )}
                </div>

                {/* SCORE INPUT */}
                <div className="card">
                    <h3>Add Score</h3>

                    <input
                        type="number"
                        placeholder="Score (1–45)"
                        value={score}
                        onChange={e => setScore(e.target.value)}
                    />

                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />

                    <button onClick={addScore}>Add Score</button>
                </div>

                {/* SCORES */}
                <div className="card">
                    <h3>Last 5 Scores</h3>

                    {scores.length === 0 ? (
                        <p>No scores yet</p>
                    ) : (
                        scores.map((s, i) => (
                            <div className="score-row" key={i}>
                                <span>{s.date}</span>
                                <strong>{s.score}</strong>
                            </div>
                        ))
                    )}
                </div>

                {/* CHARITY */}
                <div className="card">
                    <h3>Charity</h3>

                    <p>
                        <b>{dashboard.charity.charityName || "Not Selected"}</b>
                    </p>

                    <p>
                        Contribution: {dashboard.charity.contribution || "0"}%
                    </p>

                    <select
                        onChange={(e) =>
                            setDashboard({
                                ...dashboard,
                                charity: {
                                    ...dashboard.charity,
                                    charityName: e.target.value
                                }
                            })
                        }
                    >
                        <option value="">Select Charity</option>
                        <option value="Save Children">Save Children</option>
                        <option value="UNICEF">UNICEF</option>
                        <option value="Red Cross">Red Cross</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Contribution %"
                        onChange={(e) =>
                            setDashboard({
                                ...dashboard,
                                charity: {
                                    ...dashboard.charity,
                                    contribution: e.target.value
                                }
                            })
                        }
                    />

                    <button
                        onClick={async () => {
                            await API.post("/charity", {
                                userId: user._id,
                                charityName: dashboard.charity.charityName,
                                contribution: dashboard.charity.contribution
                            });

                            fetchDashboard();
                        }}
                    >
                        Save Charity
                    </button>
                </div>

                {/* DRAW */}
                <div className="card">
                    <h3>Draw Participation</h3>
                    <p>Draws Entered: {dashboard.drawsEntered || 0}</p>
                    <p>Next Draw: 1 May 2026</p>
                </div>

                {/* WINNINGS */}
                <div className="card">
                    <h3>Winnings</h3>
                    <p>₹{dashboard.winnings?.total || 0}</p>
                    <p>{dashboard.winnings?.status || "No winnings yet"}</p>
                </div>

            </div>
        </div>
    );
}
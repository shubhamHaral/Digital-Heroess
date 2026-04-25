import { useEffect, useState } from "react";
import API from "../api";
import "../styles/dashboard.css";

export default function Admin() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [stats, setStats] = useState({
        users: 0,
        subscriptions: 0,
        winners: 0,
        prizePool: 0,
        charities: 0
    });

    const [users, setUsers] = useState([]);
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);

            const [statsRes, usersRes, winnersRes] = await Promise.all([
                API.get(`/admin/stats?userId=${user._id}`),
                API.get(`/admin/users?userId=${user._id}`),
                API.get(`/admin/winners?userId=${user._id}`)
            ]);

            setStats(statsRes.data || {});
            setUsers(usersRes.data?.users || []);
            setWinners(winnersRes.data?.winners || []);

        } catch (err) {
            console.log(err);
            alert("Admin data fetch failed ");
        } finally {
            setLoading(false);
        }
    };

    const runDraw = async () => {
        await API.post(`/admin/run-draw?userId=${user._id}`);
        alert("Draw executed ");
        loadData();
    };

    const verify = async (id, status) => {
        await API.post(`/admin/verify?userId=${user._id}`, {
            winnerId: id,
            status
        });

        loadData();
    };

    useEffect(() => {
        if (user?._id) loadData();
    }, []);

    return (
        <div className="dashboard-container">

            {/* HEADER */}
            <div className="header">
                <h2>Admin Dashboard</h2>

                <button className="logout-btn">
                    Logout
                </button>
            </div>

            {loading && <p>Loading admin data...</p>}

            {/* STATS */}
            <div className="grid">
                <div className="card">
                    <h3>Users</h3>
                    <p>{stats.users}</p>
                </div>

                <div className="card">
                    <h3>Active Subscriptions</h3>
                    <p>{stats.subscriptions}</p>
                </div>

                <div className="card">
                    <h3>Winners</h3>
                    <p>{stats.winners}</p>
                </div>

                <div className="card">
                    <h3>Prize Pool</h3>
                    <p>₹{stats.prizePool}</p>
                </div>

                <div className="card">
                    <h3>Charities</h3>
                    <p>{stats.charities}</p>
                </div>
            </div>

            {/* DRAW BUTTON */}
            <div className="card" style={{ marginTop: "20px" }}>
                <h3>Draw Control</h3>
                <button onClick={runDraw}>
                    Run Monthly Draw
                </button>
            </div>

            {/* USERS */}
            <div className="card" style={{ marginTop: "20px" }}>
                <h3>Users</h3>

                {users.length === 0 ? (
                    <p>No users found</p>
                ) : (
                    users.map((u) => (
                        <div key={u._id} className="score-row">
                            {u.name} | {u.email}
                        </div>
                    ))
                )}
            </div>

            {/* WINNERS */}
            <div className="card" style={{ marginTop: "20px" }}>
                <h3>Winners</h3>

                {winners.length === 0 ? (
                    <p>No winners yet</p>
                ) : (
                    winners.map((w) => (
                        <div key={w._id} style={{ marginBottom: "10px" }}>
                            <div className="score-row">
                                User: {w.userId} | ₹{w.amount || 0} | {w.status || "Pending"}
                            </div>

                            <button onClick={() => verify(w._id, "Approved")}>
                                Approve
                            </button>

                            <button onClick={() => verify(w._id, "Rejected")}>
                                Reject
                            </button>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
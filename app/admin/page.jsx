'use client'
import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [reports, setReports] = useState([]);

  // auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) fetchReports();
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchReports = async () => {
    const querySnapshot = await getDocs(collection(db, "reports"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReports(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !url) return;

    try {
      await addDoc(collection(db, "reports"), { title, url });
      setTitle("");
      setUrl("");
      fetchReports();
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Welcome, {user.email}</h1>
      <button onClick={handleLogout} style={styles.logout}>Logout</button>

      <h2>Add New Power BI Report</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Report Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Power BI URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Report</button>
      </form>

      <h2 style={{ marginTop: "2rem" }}>Existing Reports</h2>
      <ul>
        {reports.map((r) => (
          <li key={r.id}>
            <strong>{r.title}</strong> — <a href={r.url} target="_blank">View</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    display:"flex",
    flexDirection:'column',
    gap:"1rem"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    fontSize: "1rem",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  logout: {
    ...this?.button,
    backgroundColor: "#e63946",
    marginBottom: "1rem",
    maxWidth:"5rem"
  },
};

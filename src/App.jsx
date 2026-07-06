import { useState } from "react";
import "./App.css";

function App() {
  const [rolls, setRolls] = useState("");
  const [names, setNames] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("Present");
  const [students, setStudents] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editRoll, setEditRoll] = useState("");
  const [editName, setEditName] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editStatus, setEditStatus] = useState("Present");

  // ---------------- ADD ATTENDANCE ----------------

  const addAttendance = () => {
    if (!rolls.trim()) {
      alert("Please enter at least one roll number.");
      return;
    }

    const rollArray = rolls
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r !== "");

    const nameArray = names
      .split(",")
      .map((n) => n.trim());

    const newStudents = [];

    for (let i = 0; i < rollArray.length; i++) {
      const roll = rollArray[i];

      if (!/^\d+$/.test(roll)) {
        alert(`Invalid Roll Number: ${roll}`);
        return;
      }

      const duplicate =
        students.some((s) => s.roll === roll) ||
        newStudents.some((s) => s.roll === roll);

      if (duplicate) continue;

      newStudents.push({
        id: Date.now() + Math.random() + i,
        roll,
        name: nameArray[i] || "-",
        course: course || "-",
        status,
      });
    }

    if (newStudents.length === 0) {
      alert("All entered roll numbers already exist.");
      return;
    }

    const updated = [...students, ...newStudents].sort(
      (a, b) => Number(a.roll) - Number(b.roll)
    );

    setStudents(updated);

    setRolls("");
    setNames("");
    setCourse("");
    setStatus("Present");
  };

  // ---------------- DELETE ----------------

  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  // ---------------- CLEAR ----------------

  const clearAll = () => {
    if (window.confirm("Clear all attendance records?")) {
      setStudents([]);
    }
  };

  // ---------------- EDIT ----------------

  const startEdit = (student) => {
    setEditId(student.id);
    setEditRoll(student.roll);
    setEditName(student.name);
    setEditCourse(student.course);
    setEditStatus(student.status);
  };

  const saveEdit = () => {
    if (!/^\d+$/.test(editRoll)) {
      alert("Roll Number must contain only digits.");
      return;
    }

    const duplicate = students.some(
      (student) =>
        student.roll === editRoll &&
        student.id !== editId
    );

    if (duplicate) {
      alert("Roll Number already exists.");
      return;
    }

    const updated = students
      .map((student) =>
        student.id === editId
          ? {
              ...student,
              roll: editRoll,
              name: editName || "-",
              course: editCourse || "-",
              status: editStatus,
            }
          : student
      )
      .sort((a, b) => Number(a.roll) - Number(b.roll));

    setStudents(updated);

    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  // ---------------- SUMMARY ----------------

  const total = students.length;

  const present = students.filter(
    (student) => student.status === "Present"
  ).length;

  const absent = total - present;

    return (
    <div className="container">
      <h1>📋 Student Attendance System</h1>

      <div className="form">

        <input
          type="text"
          placeholder="Roll Numbers (101,102,103)"
          value={rolls}
          onChange={(e) => {
            const value = e.target.value;

            if (/^[0-9,\s]*$/.test(value)) {
              setRolls(value);
            }
          }}
        />

        <input
          type="text"
          placeholder="Names (Optional) (Rahul,Priya,Aman)"
          value={names}
          onChange={(e) => setNames(e.target.value)}
        />

        <select
         value={course}
         onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="B.Tech CSE">B.Tech CSE</option>
          <option value="B.Tech AI & ML">B.Tech AI & ML</option>
          <option value="B.Tech Data Science">B.Tech Data Science</option>
          <option value="MBA">MBA</option>
          <option value="B.Com">B.Com</option>
          <option value="BBA">BBA</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Present</option>
          <option>Absent</option>
        </select>

        <button onClick={addAttendance}>
          Add Attendance
        </button>

      </div>

      <h2>Attendance Records</h2>

      <table>

        <thead>
          <tr>
            <th>Roll No.</th>
            <th>Name</th>
            <th>Course</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {students.length === 0 ? (

            <tr>
              <td colSpan="5">
                No Attendance Records Found
              </td>
            </tr>

          ) : (

            students.map((student) => (

              editId === student.id ? (

                <tr key={student.id}>

                  <td>
                    <input
                      value={editRoll}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                          setEditRoll(value);
                        }
                      }}
                    />
                  </td>

                  <td>
                    <input
                      value={editName}
                      onChange={(e) =>
                        setEditName(e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <select
  value={editCourse}
  onChange={(e) => setEditCourse(e.target.value)}
>
  <option value="">Select Course</option>
  <option value="MCA">MCA</option>
  <option value="BCA">BCA</option>
  <option value="B.Tech CSE">B.Tech CSE</option>
  <option value="B.Tech AI & ML">B.Tech AI & ML</option>
  <option value="B.Tech Data Science">B.Tech Data Science</option>
  <option value="MBA">MBA</option>
  <option value="B.Com">B.Com</option>
  <option value="BBA">BBA</option>
</select>
                  
                  </td>

                  <td>

                    <select
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(e.target.value)
                      }
                    >
                      <option>Present</option>
                      <option>Absent</option>
                    </select>

                  </td>

                  <td>

                    <button
                      className="saveBtn"
                      onClick={saveEdit}
                    >
                      Save
                    </button>

                    <button
                      className="cancelBtn"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>

                  </td>

                </tr>

              ) : (

                <tr key={student.id}>

                  <td>{student.roll}</td>

                  <td>{student.name}</td>

                  <td>{student.course}</td>

                  <td>

                    <span
                      className={
                        student.status === "Present"
                          ? "badge present"
                          : "badge absent"
                      }
                    >
                      {student.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="editBtn"
                      onClick={() => startEdit(student)}
                    >
                      Edit
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() =>
                        deleteStudent(student.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              )

            ))

          )}

        </tbody>

      </table>

      <div className="summary">

        <div className="card">
          <h3>{total}</h3>
          <p>Total Students</p>
        </div>

        <div className="card presentCard">
          <h3>{present}</h3>
          <p>Present</p>
        </div>

        <div className="card absentCard">
          <h3>{absent}</h3>
          <p>Absent</p>
        </div>

      </div>

      <button
        className="clearBtn"
        onClick={clearAll}
      >
        Clear All Records
      </button>

    </div>
  );
}

export default App;
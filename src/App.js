import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setIsEditId] = useState(null);
  const [alert, setIsAlert] = useState(
    {
      show: false,
      msg: "",
      type: "",
    },
    [list]
  );

  const handleSummit = (e) => {
    e.preventDefault();

    if (!name) {
      showAlert(true, "Please enter value", "danger");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setIsEditId(null);
      setIsEditing(false);
      showAlert(true, "value changed", "success");
    } else {
      showAlert(true, "item added to the list", "success");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  const clearList = () => {
    showAlert(true, "empty list", "danger");
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, "item removed from list", "danger");
    setList(list.filter((item) => item.id !== id));
  };

  const showAlert = (show = false, msg = "", type = "") => {
    setIsAlert({ show, msg, type });
  };
  const editItem = (id) => {
    const specificId = list.find((item) => item.id === id);
    setIsEditing(true);
    setIsEditId(id);
    setName(specificId.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="task-form" onSubmit={handleSummit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>todo app</h3>
        <div className="form-control">
          <input
            type="text"
            className="task"
            placeholder="task"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="task-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;

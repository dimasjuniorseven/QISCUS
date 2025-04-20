import React, { useState, useRef } from "react";
import data from "../data/index.json";
import "../styles/ChatPage.css";

export default function ChatSlider() {
  const [index, setIndex] = useState(0);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const fileInputRef = useRef();
  const rooms = data.results;
  const currentRoom = rooms[index].room;
  const comments = rooms[index].comments;

  const handleToggleMode = () => setDarkMode(!darkMode);

  const nextRoom = () => index < rooms.length - 1 && setIndex(index + 1);
  const prevRoom = () => index > 0 && setIndex(index - 1);

  const handleSend = () => {
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), message: inputMessage, sender: "you", type: "text" },
      ]);
      setInputMessage("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const type = file.type.includes("image")
      ? "image"
      : file.type.includes("pdf")
      ? "pdf"
      : "file";

    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: fileUrl,
        sender: "you",
        type: type,
        name: file.name,
      },
    ]);
  };

  return (
    <div className={`slider-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="sidebar">
        <img src={currentRoom.image_url} alt="Product" className="product-image" />
        <h2 className="product-name">{currentRoom.name}</h2>
        <p className="product-description">{currentRoom.description}</p>
        <p className="product-price">Harga: {currentRoom.price}</p>
        <p className={`product-status ${currentRoom.status === "Online" ? "online" : "offline"}`}>
          {currentRoom.status === "Online" ? "🟢 Online" : `🕓 Terakhir dilihat: ${currentRoom.lastSeen}`}
        </p>
        
        <div className="nav-buttons">
          <button onClick={prevRoom} disabled={index === 0}>⬅️</button>
          <button onClick={nextRoom} disabled={index === rooms.length - 1}>➡️</button>
        </div>
        <button className="toggle-mode" onClick={handleToggleMode}>
          {darkMode ? "☀️ Terang" : "🌙 Gelap"}
        </button>
      </div>

      <div className="chat-area">
        <div className="chat-header">💬 {currentRoom.name}</div>

        <div className="chat-body">
          {[...comments, ...messages].map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.sender === "agent@mail.com" ? "left" : "right"}`}
            >
              {msg.type === "text" && <p>{msg.message}</p>}
              {msg.type === "image" && <img src={msg.message} className="media" alt="uploaded" />}
              {msg.type === "pdf" && (
                <>
                  <embed src={msg.message} type="application/pdf" width="100%" height="200px" />
                  <a href={msg.message} download={msg.name || "file.pdf"} className="download-btn">📥</a>
                </>
              )}
              {msg.type === "file" && (
                <a href={msg.message} download={msg.name} className="download-btn">📎 {msg.name}</a>
              )}
              <span className="sender-label">from: {msg.sender}</span>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <div className="input-row">
            <input
              type="text"
              placeholder="Ketik pesan..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Kirim</button>
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              ➕
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

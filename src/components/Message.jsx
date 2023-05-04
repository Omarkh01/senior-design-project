import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [timeString, setTimeString] = useState('');

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    const messageTime = message.date.toDate();
    const currentTime = new Date();

    const diffInMinutes = Math.round(
      (currentTime.getTime() - messageTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      setTimeString('just now');
    } else if (diffInMinutes < 60) {
      setTimeString(`${diffInMinutes} minutes ago`);
    } else if (diffInMinutes < 60 * 24) {
      const diffInHours = Math.round(diffInMinutes / 60);
      setTimeString(`${diffInHours} hours ago`);
    } else {
      setTimeString(
        `${messageTime.toLocaleDateString()} ${messageTime.toLocaleTimeString()}`
      );
    }
  }, [message.date]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{timeString}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;

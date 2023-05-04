import React, { useContext, useState, useRef, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const userChatRef = useRef(null);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userChatRef.current && !userChatRef.current.contains(event.target)) {
        setUser(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userChatRef])

  useEffect(() => {
    setErr(false);
  }, [username])

  const handleSearch = async () => {

    if (currentUser.displayName === username) {
      return;
    }

    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUser(doc.data());
    });

    if (querySnapshot.empty) {
      setUser(null);
      setErr(true);
    } else {
      setErr(false);
    }
    
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {

    setUser(null);
    setUsername("");
    
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setUser(null);
      setUsername("")
    }
  };
  
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span className="errMsgSpan">User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect} ref={userChatRef}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

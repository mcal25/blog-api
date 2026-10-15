import { useState, useContext } from "react";
import { BlogContext } from "./BlogContext";



const PostCard = ({ postCard } ) => {

    return <div>
        <h3>{postCard.title}</h3>
        <p>{postCard.body}</p>
    </div>
}

export { PostCard };
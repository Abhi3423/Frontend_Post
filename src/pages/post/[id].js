import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import postForm from "@/components/postForm";

import React from 'react'

function PostDetails() {

    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState(null);

    const fetchPost = async () => {
        try {
            const { data } = await axios.get('https://backend-post-inky.vercel.app/posts')
            setPosts(data);
        } catch (error) {
            console.error('Error Fetching data')
        }
    }

    useEffect(() => {
        if (id) fetchPost();
    }, [id])

    if (!post) return <p>Loading</p>

    return (
        <div>
            <h1>{post.content}</h1>
        </div>
    )
}

export default PostDetails

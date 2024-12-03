import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PostList({ posts, onPostDeleted }) {
    const [replies, setReplies] = useState({});
    const [allPosts, setAllPosts] = useState(posts);
    

    const fetchPosts = async () => {
        try {
            const { data } = await axios.get('https://backend-post-inky.vercel.app/posts');
            setAllPosts(data.posts);
        } catch (error) {
            console.error('Error fetching posts');
        }
    };

    
    const fetchReplies = async (postId) => {
        try {
            const { data } = await axios.get(`https://backend-post-inky.vercel.app/posts/${postId}/comments`);
            setReplies((prevReplies) => ({
                ...prevReplies,
                [postId]: data.post.replies,
            }));
        } catch (error) {
            console.error('Error fetching replies');
        }
    };

    
    const handleDelete = async (postId) => {
        try {
            await axios.delete(`https://backend-post-inky.vercel.app/posts/${postId}`);
            onPostDeleted(postId);
            fetchPosts(); 
        } catch (error) {
            console.error('Error deleting post');
        }
    };

    const handleReaction = async (postId, reaction) => {
        try {
            await axios.post(`https://backend-post-inky.vercel.app/posts/${postId}/reaction`, { reaction });
            fetchPosts();
            fetchReplies(postId); 
        } catch (error) {
            console.error('Error updating reaction');
        }
    };

    const handleReply = async (postId, replyContent) => {
        try {
            await axios.post(`https://backend-post-inky.vercel.app/posts/${postId}/reply`, { content: replyContent });
            fetchPosts(); 
            fetchReplies(postId); 
        } catch (error) {
            console.error('Error posting reply');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <ul>
            {allPosts.length === 0 ? (
                <p>No posts yet!</p>
            ) : (
                allPosts.map((post) => (
                    <li key={post.id}>
                        <div>
                            <p>{post.content}</p>
                            <p>
                                <small>{new Date(post.timeStamp).toLocaleString()}</small>
                            </p>

                            <div className='flex flex-row gap-3'>
                                <button className='bg-black rounded-md p-2 text-white' onClick={() => handleReaction(post.id, 'like')}>Like ({post.likes})</button>
                                <button className='bg-black rounded-md p-2 text-white' onClick={() => handleReaction(post.id, 'dislike')}>Dislike ({post.dislikes})</button>
                                <button className='bg-black rounded-md p-2 text-white' onClick={() => fetchReplies(post.id)}>View Replies</button>
                                <button className='bg-black rounded-md p-2 text-white' onClick={() => handleDelete(post.id)}>Delete</button>
                            </div>

                            {replies[post.id] && (
                                <div>
                                    <h4>Replies:</h4>
                                    <ul>
                                        {replies[post.id].map((reply) => (
                                            <li key={reply.id}>
                                                <p>{reply.content}</p>
                                                <p>
                                                    <small>{new Date(reply.timeStamp).toLocaleString()}</small>
                                                </p>
                                                <div className='flex flex-row gap-3'>
                                                    <button className='bg-black rounded-md p-2 text-white' onClick={() => handleReaction(reply.id, 'like')}>Like ({reply.likes})</button>
                                                    <button className='bg-black rounded-md p-2 text-white' onClick={() => handleReaction(reply.id, 'dislike')}>Dislike ({reply.dislikes})</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div>
                                <h4>Post a Reply:</h4>
                                <input
                                    type="text"
                                    placeholder="Your reply"
                                    onBlur={(e) => handleReply(post.id, e.target.value)}
                                />
                            </div>
                        </div>
                    </li>
                ))
            )}
        </ul>
    );
}

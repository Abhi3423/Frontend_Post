import { useState, useEffect } from 'react';
import axios from 'axios';
import PostForm from '@/components/postForm';
import PostList from '@/components/postList';

function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('https://backend-post-inky.vercel.app/posts');
      console.log(data)
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts');
    }
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== deletedPostId));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col gap-2 justify-center p-4 items-center w-full h-full">
      <h1>Anonymous Posts</h1>
      <PostForm onPostCreated={fetchPosts} />
      <PostList posts={posts} onPostDeleted={handlePostDeleted} />
    </div>
  );
}

export default Home;

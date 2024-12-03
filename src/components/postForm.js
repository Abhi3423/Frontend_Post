import React from 'react'
import axios from 'axios'
import { useState } from 'react'

export default function PostForm({postId, onPostCreated}) {

    const [content, setContent] = useState('');

    const handlesubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:5000/posts', {
            content, parentId: postId || null
        });

        setContent('')
        if(onPostCreated) onPostCreated();
      } catch (error) {
        console.error('Error creating posts')
      }
    }
    


    return (
        <form className='flex flex-col gap-2 items-center justi-center ' onSubmit={handlesubmit}>
          <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Write.....'
          required
          />
          <button className='bg-black rounded-md p-2 text-white w-28' type='submit'>Post</button>
        </form>
    )
}

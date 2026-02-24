import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsByHashtag } from '../../store/hashtagsSlice';
import { useParams } from 'react-router-dom';
import Message from '../components/Message';


export default function HashtagPage() {
const { tag } = useParams();
const dispatch = useDispatch();
const { byTag, status } = useSelector((s) => s.hashtags);
const posts = byTag[tag] || [];


useEffect(() => {
dispatch(fetchPostsByHashtag(tag));
}, [dispatch, tag]);

console.log("BYTAG:", byTag);
console.log("POSTS:", posts);
console.log("IS ARRAY:", Array.isArray(posts));

return (
<div className="p-4">
<h2 className="text-xl font-bold mb-4">#{tag}</h2>


{status === 'loading' && <div>Загрузка...</div>}


{posts.length === 0 && status === 'succeeded' && (
<div className="text-gray-500">Постов нет</div>
)}


<div className="flex flex-col gap-4">
{Array.isArray(posts) && posts.map((post) => (
<Message key={post.id}
  post={post} />
))}
</div>
</div>
);
}
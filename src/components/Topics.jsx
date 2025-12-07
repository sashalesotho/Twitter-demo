import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularHashtags } from '../../store/hashtagsSlice';
import { Link } from 'react-router-dom';


const Topics = () => {
const dispatch = useDispatch();
const { popular, status } = useSelector((state) => state.hashtags);


useEffect(() => {
dispatch(fetchPopularHashtags());
}, [dispatch]);


if (status === 'loading') return <div className="text-sm text-gray-400">...</div>;
if (popular.length === 0) {
    return (
      <div className="p-4 rounded-2xl shadow bg-white">
        <h3 className="font-bold text-lg mb-3">Популярные хештеги</h3>
        <div className="text-gray-500 text-sm">Пока ничего нет</div>
      </div>
    );
  }

return (
<div className="p-4 rounded-2xl shadow bg-white">
<h3 className="font-bold text-lg mb-3">Популярные хештеги</h3>
<div className="flex flex-col gap-2">
{popular.map((h) => (
<Link
key={h.tag}
to={`/hashtag/${h.tag}`}
className="text-blue-600 hover:underline"
>
#{h.tag} <span className="text-gray-500">({h.count})</span>
</Link>
))}
</div>
</div>
);
}

export default Topics;
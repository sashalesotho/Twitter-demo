import Message from './Message';

import styles from '../styles/UserPosts.module.css';

const UserPosts = ({ posts }) => {
  return (
    <ul className={styles.feed}>
      {posts.map((post) => (
        <Message
          key={post.id}
          id={post.id}
          picUrl={post.avatar_url}
          username={post.username}
          email={`@${post.nickname}`}
          date={post.date}
          message={post.message}
          imgmessage={post.imgmessage}
          quantityReposts={post.quantityreposts}
          quantityLike={post.quantitylike}
          quantityShare={post.quantityreshare}
        />
      ))}
    </ul>
  );
};

export default UserPosts;

import Message from './Message';

import styles from '../styles/UserPosts.module.css';

const UserPosts = ({ posts }) => {
  return (
    <ul className={styles.feed}>
      {posts.map((post) => (
        <Message
          key={post.id}
          post={post}
        />
      ))}
    </ul>
  );
};

export default UserPosts;

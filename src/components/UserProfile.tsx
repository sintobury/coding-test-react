import React from 'react';
import styles from './UserProfile.module.css';

// --- 데이터 타입 정의 ---
interface User {
  id: number;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
}

interface UserStats {
  posts: number;
  followers: number;
  following: number;
}

interface Post {
  id: number;
  imageUrl: string;
  caption: string;
}

interface UserProfileProps {
  user: User;
  stats: UserStats;
  posts: Post[];
}

/**
 * ## UI 문제 1: 컴포넌트 리팩토링
 *
 * 이 컴포넌트는 사용자 프로필 페이지를 렌더링합니다.
 * 현재는 하나의 컴포넌트에 모든 UI가 들어가 있어 재사용성과 가독성이 떨어집니다.
 *
 * ### 요구사항:
 * 1. 이 파일을 의미 있는 단위의 여러 작은, 재사용 가능한 컴포넌트로 분리하세요.
 *    - 컴포넌트의 이름과 구조는 자유롭게 결정하되, 왜 그렇게 분리했는지 논리적으로 설명할 수 있어야 합니다.
 * 2. 분리된 컴포넌트들은 `props`를 통해 필요한 데이터만 전달받아야 합니다.
 * 3. 최종적으로 `UserProfile` 은 분리된 컴포넌트들을 조합하여 동일한 UI를 렌더링해야 합니다.
 * 4. CSS 모듈을 사용하여 스타일을 관리하세요.
 *
 */

// 1. ProfileHeader: 상단 아바타 및 이름 영역
const ProfileHeader = ({ avatarUrl, name, username }: { avatarUrl: string; name: string; username: string }) => (
  <header className={styles.profileHeader}>
    <div className={styles.avatarContainer}>
      <img src={avatarUrl} alt={`${name}'s avatar`} className={styles.avatar} />
    </div>
    <div className={styles.userInfoContainer}>
      <h2 className={styles.username}>{username}</h2>
      <button className={styles.editProfileButton}>프로필 편집</button>
    </div>
  </header>
);

// 2. ProfileBio: 상세 소개 영역
const ProfileBio = ({ name, bio }: { name: string; bio: string }) => (
  <section className={styles.userInfoSection}>
    <h1 className={styles.name}>{name}</h1>
    <p className={styles.bio}>{bio}</p>
  </section>
);

// 3. ProfileStats: 통계 데이터 영역
const ProfileStats = ({ stats }: { stats: UserStats }) => {
  const statItems = [
    { label: '게시물', value: stats.posts },
    { label: '팔로워', value: stats.followers },
    { label: '팔로잉', value: stats.following },
  ];

  return (
    <section className={styles.statsSection}>
      {statItems.map((item) => (
        <div key={item.label} className={styles.statItem}>
          <span className={styles.statValue}>{item.value}</span>
          <span className={styles.statLabel}>{item.label}</span>
        </div>
      ))}
    </section>
  );
};

// 4. PostGrid: 게시물 그리드 영역
const PostGrid = ({ posts }: { posts: Post[] }) => (
  <main className={styles.postsGrid}>
    {posts.map(post => (
      <div key={post.id} className={styles.postItem}>
        <img src={post.imageUrl} alt={post.caption} className={styles.postImage} />
      </div>
    ))}
  </main>
);

// 메인 컴포넌트: 조립(Composition)
const UserProfile: React.FC<UserProfileProps> = ({ user, stats, posts }) => {
  return (
    <div className={styles.profileContainer}>
      <ProfileHeader 
        avatarUrl={user.avatarUrl} 
        name={user.name} 
        username={user.username} 
      />
      <ProfileBio 
        name={user.name} 
        bio={user.bio} 
      />
      <ProfileStats stats={stats} />
      <PostGrid posts={posts} />
    </div>
  );
};

/*const UserProfile: React.FC<UserProfileProps> = ({ user, stats, posts }) => {
  return (
    <div className={styles.profileContainer}>
      { 1. 프로필 헤더 }
      <header className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <img src={user.avatarUrl} alt={`${user.name}'s avatar`} className={styles.avatar} />
        </div>
        <div className={styles.userInfoContainer}>
          <h2 className={styles.username}>{user.username}</h2>
          <button className={styles.editProfileButton}>프로필 편집</button>
        </div>
      </header>

      { 2. 사용자 정보 }
      <section className={styles.userInfoSection}>
        <h1 className={styles.name}>{user.name}</h1>
        <p className={styles.bio}>{user.bio}</p>
      </section>

      { 3. 사용자 통계 }
      <section className={styles.statsSection}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.posts}</span>
          <span className={styles.statLabel}>게시물</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.followers}</span>
          <span className={styles.statLabel}>팔로워</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.following}</span>
          <span className={styles.statLabel}>팔로잉</span>
        </div>
      </section>

      { 4. 게시물 그리드 }
      <main className={styles.postsGrid}>
        {posts.map(post => (
          <div key={post.id} className={styles.postItem}>
            <img src={post.imageUrl} alt={post.caption} className={styles.postImage} />
          </div>
        ))}
      </main>
    </div>
  );
}
*/
export default UserProfile;

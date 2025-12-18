import React, { useEffect, useState, useMemo } from 'react';
import styles from './CodeReviewChallenge.module.css';

/**
 * ## 과제 5: 코드 리뷰
 *
 * 아래 `UserList`는 사용자 목록을 렌더링합니다. 정상 동작하지만 개선 여지가 있습니다.
 *
 * ### 요구사항:
 * 1. 코드(JSX 포함)를 읽고 잠재적인 문제점이나 개선점을 찾아보세요.
 * 2. 발견한 내용에 대해, 해당 코드 라인 근처에 주석을 사용하여 코드 리뷰를 작성해주세요.
 *    - 무엇이 문제인지, 왜 문제인지, 어떻게 개선할지 제시해주세요.
 * 3. 최소 3가지 이상의 유의미한 코드 리뷰를 작성해야 합니다.
 *
 * ### 선택사항:
 * - 코드 리뷰 작성을 넘어, 실제로 코드를 개선하여 리팩토링을 진행해보세요.
 * - (주의: 이 과제는 코드 리뷰 능력을 중점적으로 보기 때문에, 리뷰 작성 없이 리팩토링만 진행하면 안 됩니다.)
 */

type UserData = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
};

// 가짜 API 호출 함수
const fetchUsers = (): Promise<UserData[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, name: '김철수', email: 'chulsoo@example.com', isAdmin: false },
        { id: 2, name: '이영희', email: 'younghee@example.com', isAdmin: true },
        { id: 3, name: '스티브', email: 'steve@example.com', isAdmin: false },
        { id: 4, name: '관리자', email: 'admin@example.com', isAdmin: true },
        { id: 5, name: 'Steve Jobs', email: 'sj@apple.com', isAdmin: false },
        { id: 6, name: 'Apple Mint', email: 'mint@gmail.com', isAdmin: false },
      ]);
    }, 500);
  });
};

const UserList = () => {
  //const [users, setUsers] = useState<any[]>([]); // state 1 (수정전)
  const [users, setUsers] = useState<UserData[]>([]); // 1. any 대신 정확한 타입 지정
  const [filter, setFilter] = useState(''); // state 2
  const [loading, setLoading] = useState(true); // state 3
  const [showAdminsOnly, setShowAdminsOnly] = useState(false); // state 4
  const [error, setError] = useState<string | null>(null); // 2. 에러 상태 추가(fetch에서 에러 감지 위해 추가)

  // 데이터 로딩
  useEffect(() => {
    let isMounted = true; // 메모리 누수 방지용

    /*fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });*/

    fetchUsers()
      .then(data => {
        if (isMounted) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError('사용자 정보를 불러오는 데 실패했습니다.');
          setLoading(false);
        }
      });

      return () => { isMounted = false; };

  }, []);

    // 필터링 로직
  /*const filteredUsers = users.filter(user => {
      const nameMatches = user.name.includes(filter);
      const emailMatches = user.email.includes(filter);
      const adminMatches = !showAdminsOnly || user.isAdmin;
      return (nameMatches || emailMatches) && adminMatches;
    });
  */
  // 3. useMemo를 사용한 필터링 최적화
  const filteredUsers = useMemo(() => {
    const searchFilter = filter.toLowerCase(); // 대소문자 구분 방지
    return users.filter(user => {
      const nameMatches = user.name.toLowerCase().includes(searchFilter);
      const emailMatches = user.email.toLowerCase().includes(searchFilter);
      const adminMatches = !showAdminsOnly || user.isAdmin;
      return (nameMatches || emailMatches) && adminMatches;
    });
  }, [users, filter, showAdminsOnly]);

  // 6-1. 핸들러 추출
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleAdminToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAdminsOnly(e.target.checked);
  };

  return (
    <div className={styles.container}>
      <h2>과제 5: 코드 리뷰하기</h2>
      <p className={styles.description}>
        이 파일(`CodeReviewChallenge.tsx`)의 코드에 대한 리뷰를 주석으로 작성해주세요.
      </p>

      <div className={styles.controls}>
        {/* 6.익명함수 지양할 것 
          - 매 렌더링마다 새로운 함수 생성 (참조값 변경)
          - 가독성과 로직의 분리

        <input
          type="text"
          placeholder="이름으로 검색..."
          onChange={e => setFilter(e.target.value)} 
          className={styles.input}
        />
        <label>
          <input
            type="checkbox"
            checked={showAdminsOnly}
            onChange={e => setShowAdminsOnly(e.target.checked)}
          />
          관리자만 보기
        </label>
        */}
        <input
          type="text"
          onChange={handleFilterChange} // 참조값을 고정하여 전달
          className={styles.input}
        />
        <input
          type="checkbox"
          checked={showAdminsOnly}
          onChange={handleAdminToggle}
        />
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
            </tr>
          </thead>
          <tbody>
            {/* 5. 검색결과가 없을 때를 추가 */}
            {filteredUsers.length > 0 ? (
              filteredUsers.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                {/* 역할(Role) 표시 4. 직접 blue나 black 말고 css파일에서 스타일을 받아오는게 좋음*/}
                <td style={{ color: u.isAdmin ? 'blue' : 'black' }}>
                  {u.isAdmin ? 'Admin' : 'User'}
                </td>
                {/*<td className={u.isAdmin ? styles.adminText : styles.userText}>
                  {u.isAdmin ? 'Admin' : 'User'}
                </td>*/}
              </tr>)) 
            ) : (
              <tr><td colSpan={3}>검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
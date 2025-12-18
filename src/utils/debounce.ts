/**
 * ## 비동기 문제 2: Debounce 함수 구현
 *
 * `debounce` 함수를 직접 구현해 보세요.
 * `debounce`는 연속적인 함수 호출을 그룹화하여, 지정된 시간 동안 추가 호출이 없을 때만 함수를 실행하는 기술입니다.
 * 주로 검색창 자동완성, 창 크기 조절 이벤트 처리 등에서 서버 부하를 줄이기 위해 사용됩니다.
 *
 * ### 요구사항:
 * - `debounce` 함수는 지정된 `delay` 시간 동안 호출이 없을 때만 `func` 함수를 실행해야 합니다.
 * - 만약 `delay` 시간이 지나기 전에 `debounce` 함수가 다시 호출되면, 이전의 대기 중인 `func` 실행은 취소되어야 합니다.
 * - `debounce` 함수는 감싸고 있는 `func` 함수와 동일한 `this` 컨텍스트 및 인자들을 전달받아 실행해야 합니다.
 *
 * @param func 디바운싱할 함수
 * @param delay 디바운스 시간 (밀리초)
 * @returns 디바운싱된 새로운 함수
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  // 여기에 debounce 로직을 구현하세요.
  // Hint: 클로저를 사용하여 타이머 ID를 관리해야 합니다.

  // 클로저를 통해 타이머 ID를 메모리에 유지합니다.
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>) {
    // @ts-ignore
    const context = this;

    // 1. 이미 대기 중인 타이머가 있다면 취소합니다. (이전 호출 무시)
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 2. 새로운 타이머를 설정합니다.
    timeoutId = setTimeout(() => {
      // 3. delay 시간이 지나면 실제 함수를 실행합니다.
      // apply를 사용하여 원본 함수의 this 컨텍스트와 인자를 그대로 전달합니다.
      func.apply(context, args);
    }, delay);

    func.apply(context, args);
  };

  // 예시: 리액트 컴포넌트 내에서의 사용
  // 문제점: 리액트 컴포넌트가 리렌더링될 때마다 새로운 디바운스 함수가 생성되어 timeoutId가 초기화됩니다. 
  // 즉, 디바운스가 작동하지 않게 됩니다.
  // 해결책: useMemo나 useCallback을 사용하여 
  // 컴포넌트의 생명주기 동안 단 한 번만 디바운스 함수가 생성되도록 보장해야 합니다.
  /*const handleSearch = useMemo(
    () => debounce((query) => fetchResults(query), 500),
    []
  );*/
}

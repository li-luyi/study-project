import { useState, useEffect } from 'react';

// 模拟请求
const getList = (query) => {
  return new Promise((resolve) => {
    console.log(query, 'query');
    setTimeout(() => {
      resolve([6, 7, 8, 9, 10])
    }, 2000)
  })
}

// 自定义hook
const useApi = () => {
  const [data, setData] = useState([1, 2, 3, 4, 5])
  const [query, setQuery] = useState('')

  useEffect(() => {
    (async () => {
      const data = await getList(query)
      setData(data)
    })()
  }, [query])
  return [{ data }, setQuery, setData]
}

export default useApi;

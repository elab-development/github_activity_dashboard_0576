'use client';

import { useMemo, useState } from 'react';
import { ActivityEvent } from '@/types';

export function useActivityFilters(data: ActivityEvent[]) {
  const [author, setAuthor] = useState('');
  const [type, setType] = useState('');

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const authorMatch = author
        ? item.author.toLowerCase().includes(author.toLowerCase())
        : true;

      const typeMatch = type ? item.type === type : true;

      return authorMatch && typeMatch;
    });
  }, [data, author, type]);

  function clearFilters() {
    setAuthor('');
    setType('');
  }

  return {
    author,
    type,
    setAuthor,
    setType,
    clearFilters,
    filteredData,
  };
}
'use client';

import Button from '../ui/Button';
import Input from '../ui/Input';

export default function ActivityFilters({
  author,
  type,
  onAuthorChange,
  onTypeChange,
  onClear,
}: {
  author: string;
  type: string;
  onAuthorChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Input
        placeholder="Search by author"
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
      />

      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
      >
        <option value="">All types</option>
        <option value="COMMIT">Commit</option>
        <option value="ISSUE_OPENED">Issue Opened</option>
        <option value="ISSUE_CLOSED">Issue Closed</option>
        <option value="PR_OPENED">PR Opened</option>
        <option value="PR_CLOSED">PR Closed</option>
        <option value="BRANCH">Branch</option>
      </select>

      <Button onClick={onClear}>Clear filters</Button>
    </div>
  );
}
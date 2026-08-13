import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  right?: React.ReactNode;
}

export default function PageHeader({ title, right }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/40 bg-background/90 px-4 backdrop-blur-md">
      <button
        onClick={() => navigate(-1)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-opacity active:opacity-50"
        aria-label="返回"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2} />
      </button>
      <h1 className="text-base font-semibold">{title}</h1>
      <div className="flex h-10 w-10 items-center justify-center">
        {right}
      </div>
    </header>
  );
}

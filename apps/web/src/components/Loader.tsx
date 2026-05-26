interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'size-5 border-2',
  md: 'size-8 border-[3px]',
  lg: 'size-12 border-[3px]',
};

export function Loader({ size = 'md', className = '' }: Props) {
  return (
    <div
      className={`${sizes[size]} rounded-full border-bg-card border-t-accent animate-spin ${className}`}
    />
  );
}

export function CenteredLoader() {
  return (
    <div className="flex-1 grid place-items-center min-h-[40vh]">
      <Loader size="lg" />
    </div>
  );
}

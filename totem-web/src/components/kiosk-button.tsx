import Link from 'next/link';

type KioskButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

const variantClasses: Record<KioskButtonVariant, string> = {
  primary: 'bg-semapa-blue hover:bg-semapa-blue-dark text-white shadow-lg shadow-blue-900/20',
  secondary: 'bg-white hover:bg-slate-50 text-semapa-blue border-4 border-semapa-sky',
  success: 'bg-semapa-green hover:bg-emerald-600 text-white',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

interface KioskButtonBaseProps {
  children: React.ReactNode;
  variant?: KioskButtonVariant;
  className?: string;
  disabled?: boolean;
}

interface KioskButtonAsButton extends KioskButtonBaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

interface KioskButtonAsLink extends KioskButtonBaseProps {
  href: string;
  onClick?: undefined;
  type?: undefined;
}

type KioskButtonProps = KioskButtonAsButton | KioskButtonAsLink;

const baseClasses =
  'inline-flex min-h-[88px] w-full items-center justify-center rounded-2xl px-8 py-6 text-2xl font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation';

export function KioskButton({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: KioskButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}

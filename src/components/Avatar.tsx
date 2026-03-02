import React, { useMemo } from 'react';

type AvatarProps = {
  name: string;
  size?: number; // diameter in px
  bg?: string; // hex without #
  color?: string; // hex without #
  src?: string;
  rounded?: boolean;
  onClick?: () => void;
  className?: string;
  alt?: string;
};

function initialsFromName(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('');
  return initials || '?';
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 48,
  bg = '4F46E5', // default indigo-600
  color = 'fff',
  src,
  rounded = true,
  onClick,
  className,
  alt,
}) => {
  const initials = useMemo(() => initialsFromName(name), [name]);
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: rounded ? '999px' : 6,
    backgroundColor: `#${bg}`,
    color: `#${color}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: Math.max(12, Math.floor(size / 2.6)),
    userSelect: 'none',
    overflow: 'hidden',
  };

  // If a src is provided, prefer rendering the image
  const content = src ? (
    // Using a plain img tag to avoid Next.js Image constraints in some contexts
    <img
      src={src}
      alt={alt || name}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: rounded ? '999px' : 6,
      }}
    />
  ) : (
    <span aria-label={name} style={{ lineHeight: 1 }}>
      {initials}
    </span>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label={`Avatar for ${name}`}
      style={style}
    >
      {content}
    </button>
  );
};

export default Avatar;

// Avatar using ui-avatars.com service
export const AvatarFromName: React.FC<Omit<AvatarProps, 'src'>> = ({
  name,
  size,
  bg,
  color,
  rounded,
  onClick,
  className,
  alt,
}) => {
  const safeName = encodeURIComponent(name);
  const avatarUrl = `https://ui-avatars.com/api/?name=${safeName}&background=${bg ?? '4F46E5'}&color=${color ?? 'fff'}`;

  return (
    <Avatar
      name={name}
      size={size}
      bg={bg}
      color={color}
      src={avatarUrl}
      rounded={rounded}
      onClick={onClick}
      className={className}
      alt={alt}
    />
  );
};

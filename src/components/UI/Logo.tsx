import Image from 'next/image';

interface Props {
  width?: string;
  height?: string;
}

export function Logo({ width = '200px', height = '50px' }: Props) {
  return (
    <Image
      src="/images/budgetify-logo.svg"
      alt="budgetify logo"
      width={width}
      height={height}
      className="self-center"
    />
  );
}

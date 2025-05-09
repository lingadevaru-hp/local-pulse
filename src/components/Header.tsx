import type { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="py-6 px-4 md:px-6 border-b border-border">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Event Finder
        </h1>
      </div>
    </header>
  );
};

export default Header;

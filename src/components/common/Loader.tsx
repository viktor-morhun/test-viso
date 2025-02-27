import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader: React.FC = () => {

  return (
    <Loader2
      className="absolute top-24 z-20 animate-spin text-blue-300"
      size={80}
    />
  );
};

export default Loader;
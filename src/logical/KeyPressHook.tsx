import { useEffect, useState } from 'react';

const useKeyPress = (): string => {
  const [pressedKey, setPressedKey] = useState<string>('');

  const handleKeyDown = (event: KeyboardEvent) => {
    setPressedKey(event.key);
    
  };

  const handleKeyUp = () => {
    setPressedKey('');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return pressedKey;
};

export default useKeyPress;

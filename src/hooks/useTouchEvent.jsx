import { useEffect } from 'react';

export default function useTouchEvents(
  onWheel,
  onTouchDown,
  onTouchMove,
  onTouchUp
) {
  useEffect(() => {
    const handleWheel = (event) => {
      onWheel(event);
    };

    const handleTouchDown = (event) => {
      onTouchDown(event);
    };

    const handleTouchMove = (event) => {
      onTouchMove(event);
    };

    const handleTouchUp = (event) => {
      onTouchUp(event);
    };

    window.addEventListener('wheel', handleWheel);

    window.addEventListener('mousedown', handleTouchDown);
    window.addEventListener('mousemove', handleTouchMove);
    window.addEventListener('mouseup', handleTouchUp);

    window.addEventListener('touchstart', handleTouchDown);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchUp);

    return () => {
      window.removeEventListener('wheel', handleWheel);

      window.removeEventListener('mousedown', handleTouchDown);
      window.removeEventListener('mousemove', handleTouchMove);
      window.removeEventListener('mouseup', handleTouchUp);

      window.removeEventListener('touchstart', handleTouchDown);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchUp);
    };
  }, [onWheel, onTouchDown, onTouchMove, onTouchUp]);
}

import { useState } from 'react';

export const useContextMenu = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuAction = (action: () => void) => {
    setShowMenu(false);
    action();
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return {
    showMenu,
    handleMenuClick,
    handleMenuAction,
    closeMenu,
  };
};


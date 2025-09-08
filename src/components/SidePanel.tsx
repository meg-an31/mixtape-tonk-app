import React from 'react';

export interface SidePanelProps {
  children?: React.ReactNode;
  width?: string;
  position?: 'left' | 'right';
  title?: string;
  className?: string;
}

const SidePanel: React.FC<SidePanelProps> = ({
  children,
  width = '400px',
  position = 'right',
  title,
  className = ''
}) => {
  const positionClasses = position === 'left' ? 'order-1' : 'order-2';

  return (
    <aside 
      className={`bg-white border-l border-gray-200 ${positionClasses} ${className} h-screen flex flex-col`}
      style={{ width, minWidth: width }}
    >
      {title && (
        <header className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </header>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </aside>
  );
};

export default SidePanel;